import fs from "node:fs";
import path from "node:path";
import { MDX_DIR } from "@/lib/constants";

type Metadata = {
    title: string;
    publishedAt: string;
};

type ParsedMDX = {
    metadata: Metadata;
    content: string;
};

export function parseFrontmatter(fileContent: string): ParsedMDX {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);

    if (!match) {
        throw new Error("Invalid frontmatter format");
    }

    const frontMatterBlock = match[1];
    const content = fileContent.replace(frontmatterRegex, "").trim();
    const frontMatterLines = frontMatterBlock.trim().split("\n");
    const metadata: Partial<Metadata> = {};

    frontMatterLines.forEach((line) => {
        const [key, ...valueArr] = line.split(": ");

        let value = valueArr.join(": ").trim();
        value = value.replace(/^['"](.*)['"]$/, "$1");

        metadata[key.trim() as keyof Metadata] = value;
    });

    return { metadata: metadata as Metadata, content };
}

export function getMDXFiles(dir: string): string[] {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export function readMDXFile(filePath: string): ParsedMDX {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
}

export type MDXData = {
    metadata: Metadata;
    slug: string;
    content?: string;
};

type GetMDXDataOptions = {
    includeContent?: boolean;
};

export function getMDXDataFromDir(
    dir: string,
    options?: GetMDXDataOptions,
): MDXData[] {
    const includeContent = options?.includeContent ?? false;

    const mdxFiles = getMDXFiles(dir);

    return mdxFiles.map((file) => {
        const { metadata, content } = readMDXFile(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));

        const result: MDXData = {
            metadata,
            slug,
        };

        if (includeContent) {
            result.content = content;
        }

        return result;
    });
}

export function getMDXDataFromSlug(
    slug: string,
    options?: GetMDXDataOptions,
): MDXData | null {
    const includeContent = options?.includeContent ?? false;

    const filePath = path.join(MDX_DIR, slug + ".mdx");

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const { metadata, content } = readMDXFile(filePath);

    const result: MDXData = {
        metadata,
        slug,
    };

    if (includeContent) {
        result.content = content;
    }

    return result;
}
