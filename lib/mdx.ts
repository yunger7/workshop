import fs from "node:fs";
import path from "node:path";

type Metadata = {
    title: string;
    publishedAt: string;
};

type ParsedMDX = {
    metadata: Metadata;
    content: string;
};

function parseFrontmatter(fileContent: string): ParsedMDX {
    let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    let match = frontmatterRegex.exec(fileContent);

    if (!match) throw new Error("Invalid frontmatter format");

    let frontMatterBlock = match[1];
    let content = fileContent.replace(frontmatterRegex, "").trim();
    let frontMatterLines = frontMatterBlock.trim().split("\n");
    let metadata: Partial<Metadata> = {};

    frontMatterLines.forEach((line) => {
        let [key, ...valueArr] = line.split(": ");
        let value = valueArr.join(": ").trim();
        value = value.replace(/^['"](.*)['"]$/, "$1");
        metadata[key.trim() as keyof Metadata] = value;
    });

    return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string): string[] {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string): ParsedMDX {
    let rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
}

type MDXData = {
    metadata: Metadata;
    slug: string;
    content: string;
};

function getMDXData(dir: string): MDXData[] {
    let mdxFiles = getMDXFiles(dir);

    return mdxFiles.map((file) => {
        let { metadata, content } = readMDXFile(path.join(dir, file));
        let slug = path.basename(file, path.extname(file));

        return {
            metadata,
            slug,
            content,
        };
    });
}

export function getAllPosts(): MDXData[] {
    return getMDXData(path.join(process.cwd(), "content"));
}

export function getPostBySlug(slug: string): MDXData | null {
    return getAllPosts().find((post) => post.slug === slug) ?? null;
}
