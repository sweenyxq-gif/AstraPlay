import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const port = process.env.PORT || "10000";

const vinextCli = path.join(projectRoot, "node_modules/vinext/dist/cli.js");

const child = spawn(process.execPath, [vinextCli, "start", "--port", port, "--hostname", "0.0.0.0"], {
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
