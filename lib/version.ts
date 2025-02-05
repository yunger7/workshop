import { promises as fs } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function getVersion() {
    const packageJsonContent = await fs.readFile("./package.json", "utf8");
    const { version } = JSON.parse(packageJsonContent);

    const { stdout } = await execAsync("git rev-parse HEAD");
    const commitHash = stdout.trim();
    const shortCommitHash = commitHash.slice(0, 7);

    const baseVersion = `v${version}-${shortCommitHash}`;

    if (
        process.env.NODE_ENV === "development" ||
        process.env.VERCEL_ENV === "development"
    ) {
        return `${baseVersion}-dev`;
    } else if (
        process.env.NODE_ENV === "test" ||
        process.env.VERCEL_ENV === "preview"
    ) {
        return `${baseVersion}-preview`;
    }

    return baseVersion;
}
