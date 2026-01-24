import { execSync } from "node:child_process";

export function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

export function runCommands(cmds: string[], cwd: string) {
  cmds.forEach((cmd) => {
    log(`Run: ${cmd}`);
    execSync(cmd, { cwd: cwd });
  });
}
