const ENVIRONMENTS = [process.env.NODE_ENV, process.env.VERCEL_ENV];

export enum Environment {
    Dev = "dev",
    Preview = "preview",
    Production = "main",
}

export function getEnvironment(): Environment {
    if (ENVIRONMENTS.includes("development")) {
        return Environment.Dev;
    }

    if (ENVIRONMENTS.includes("preview")) {
        return Environment.Preview;
    }

    return Environment.Production;
}
