// Redirige vers le script unique et consolidé apps/backend/restore_db.js
const { spawn } = require("node:child_process");
const path = require("node:path");

const targetScript = path.join(__dirname, "../../apps/backend/restore_db.js");
const args = process.argv.slice(2);

const child = spawn(process.execPath, [targetScript, ...args], {
  stdio: "inherit",
  cwd: path.join(__dirname, "../../apps/backend"),
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
