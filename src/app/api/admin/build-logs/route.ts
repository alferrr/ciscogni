import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const LOG_PATH = path.join(process.cwd(), "logs", "build.log");
const POLL_MS = 1000;
const HEARTBEAT_MS = 15000;

export async function GET(req: NextRequest) {
  const user = await getAuthedUser(req);
  if (!user || user.getDataValue("role") !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const expectedToken = process.env.BUILD_LOG_TOKEN;
  const token = req.nextUrl.searchParams.get("token");
  if (!expectedToken || token !== expectedToken) {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  let position = 0;
  let pending = "";
  let pollTimer: ReturnType<typeof setInterval>;
  let heartbeatTimer: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const sendLine = (line: string) => {
        controller.enqueue(encoder.encode(`data: ${line}\n\n`));
      };
      const sendComment = () => {
        controller.enqueue(encoder.encode(`: heartbeat\n\n`));
      };

      const readNew = () => {
        let stat: fs.Stats;
        try {
          stat = fs.statSync(LOG_PATH);
        } catch {
          return; // no build has produced a log file yet
        }

        if (stat.size < position) {
          // Log file was rewritten (a new build started).
          position = 0;
          pending = "";
          sendLine("─── new build started ───");
        }

        if (stat.size > position) {
          const length = stat.size - position;
          const buffer = Buffer.alloc(length);
          const fd = fs.openSync(LOG_PATH, "r");
          fs.readSync(fd, buffer, 0, length, position);
          fs.closeSync(fd);
          position = stat.size;

          pending += buffer.toString("utf8");
          const parts = pending.split("\n");
          pending = parts.pop() ?? "";
          for (const line of parts) sendLine(line);
        }
      };

      readNew();
      pollTimer = setInterval(readNew, POLL_MS);
      heartbeatTimer = setInterval(sendComment, HEARTBEAT_MS);

      req.signal.addEventListener("abort", () => {
        clearInterval(pollTimer);
        clearInterval(heartbeatTimer);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
    cancel() {
      clearInterval(pollTimer);
      clearInterval(heartbeatTimer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
