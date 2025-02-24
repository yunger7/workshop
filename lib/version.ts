import { promises as fs } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { getEnvironment } from "@/lib/environment";

const execAsync = promisify(exec);

export async function getVersion() {
    const packageJsonContent = await fs.readFile("./package.json", "utf8");
    const { version } = JSON.parse(packageJsonContent);

    const { stdout } = await execAsync("git rev-parse HEAD");
    const commitHash = stdout.trim();
    const shortCommitHash = commitHash.slice(0, 7);

    const baseVersion = `v${version}-${shortCommitHash}`;
    const environment = getEnvironment();

    return `${baseVersion}-${environment}`;
}
