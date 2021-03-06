import { spawn } from "child_process";

/**
 * An `exec` alternative that **escapes arguments**!
 * @param cmd The command to spawn
 * @param args The command arguments
 * @param additionalResolveCodes Passable process exit codes, besides 0.
 */
export async function safeExec(cmd: string, args: string[], additionalResolveCodes: number[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args);

    let out = "";
    let err = "";
    process.stdout.on("data", (_) => out += _);
    process.stderr.on("data", (_) => err += _);
    process.on("close", (code) => {
      if (code && !additionalResolveCodes.includes(code)) {
        reject(new Error(`${cmd} failed with code ${code}: ${err}`));
        return;
      }
      resolve(out);
    });
  });
}
