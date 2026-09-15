"use client";
import { useEffect, useRef, useState } from "react";
import { FaTerminal, FaTrash } from "react-icons/fa6";

const STORAGE_KEY = "buildLogToken";

const AdminBuildLogs = () => {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "error">(
    "idle",
  );
  const logRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Reading sessionStorage must happen post-mount (browser-only API) to
    // avoid a server/client hydration mismatch.
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(saved);
      setTokenInput(saved);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    // Subscribing to an external system (the SSE stream) — the connecting
    // status mirrors that subscription's lifecycle, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("connecting");
    const source = new EventSource(
      `/api/admin/build-logs?token=${encodeURIComponent(token)}`,
    );
    sourceRef.current = source;

    source.onopen = () => setStatus("live");
    source.onmessage = (e) => {
      setLines((prev) => [...prev, e.data]);
    };
    source.onerror = () => {
      setStatus("error");
    };

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  const connect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    sessionStorage.setItem(STORAGE_KEY, tokenInput.trim());
    setLines([]);
    setToken(tokenInput.trim());
  };

  const disconnect = () => {
    sourceRef.current?.close();
    sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
    setStatus("idle");
  };

  return (
    <div>
      <h1 className="admin-page-title">Build Logs</h1>

      {!token ? (
        <form
          className="admin-card"
          onSubmit={connect}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            className="admin-search"
            style={{ margin: 0, flex: 1 }}
            type="password"
            placeholder="Enter build log access token..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button className="admin-btn primary" type="submit">
            <FaTerminal /> Connect
          </button>
        </form>
      ) : (
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  display: "inline-block",
                  background:
                    status === "live"
                      ? "#22c55e"
                      : status === "error"
                        ? "#ef4444"
                        : "#f59e0b",
                }}
              />
              {status === "live" && "Streaming live build output"}
              {status === "connecting" && "Connecting..."}
              {status === "error" &&
                "Connection lost — check the token or server, retrying..."}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="admin-btn"
                onClick={() => setLines([])}
                type="button"
              >
                <FaTrash /> Clear
              </button>
              <button className="admin-btn" onClick={disconnect} type="button">
                Disconnect
              </button>
            </div>
          </div>

          <div
            ref={logRef}
            style={{
              background: "#0b0d12",
              color: "#d6e2d6",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "12.5px",
              lineHeight: 1.6,
              padding: "16px",
              borderRadius: "10px",
              height: "60vh",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {lines.length === 0 ? (
              <span style={{ color: "#6b7280" }}>
                Waiting for build output... run{" "}
                <code>npm run build</code> on the server.
              </span>
            ) : (
              lines.map((line, i) => <div key={i}>{line}</div>)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBuildLogs;
