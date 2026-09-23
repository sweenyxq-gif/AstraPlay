import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const port = process.env.PORT || "10000";

await import("./sites-env.mjs");

const wranglerBin = path.join(projectRoot, "node_modules/wrangler/bin/wrangler.js");
const wranglerConfig = path.join(projectRoot, "dist/server/wrangler.json");

const args = [
  wranglerBin,
  "dev",
  "--config",
  wranglerConfig,
  "--local",
  "--persist-to",
  ".wrangler/state",
  "--ip",
  "0.0.0.0",
  "--port",
  port,
  "--inspector-port",
  "0",
];

const child = spawn(process.execPath, args, {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port,
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
