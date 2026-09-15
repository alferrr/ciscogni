const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const logDir = path.join(rootDir, "logs");
const logPath = path.join(logDir, "build.log");

fs.mkdirSync(logDir, { recursive: true });
fs.writeFileSync(logPath, `Build started at ${new Date().toISOString()}\n`);
const logStream = fs.createWriteStream(logPath, { flags: "a" });

const nextBin = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

const child = spawn(nextBin, ["build"], {
  cwd: rootDir,
  env: process.env,
});

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  logStream.write(chunk);
});

child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  logStream.write(chunk);
});

child.on("error", (err) => {
  logStream.write(`\nFailed to start build: ${err.message}\n`);
  logStream.end(() => process.exit(1));
});

child.on("close", (code) => {
  logStream.write(
    `\nBuild finished with exit code ${code} at ${new Date().toISOString()}\n`,
  );
  logStream.end(() => process.exit(code ?? 1));
});
