import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getURL } from "@/lib/utils";
import { getTools, getToolBySlug } from "@/lib/data/tools";
import { Layout } from "@/components/layout";

export const dynamicParams = false;

export function generateStaticParams() {
    const tools = getTools();

    return tools
        .filter((tool) => !tool.unreleased)
        .map((tool) => ({
            slug: tool.slug,
        }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata | void> {
    const slug = (await params).slug;
    const tool = getToolBySlug(slug);

    if (!tool) {
        return;
    }

    const url = getURL();
    const ogImage = `${url}/og?title=${encodeURIComponent(tool.name)}`;

    return {
        title: tool.name,
        description: tool.description,
        openGraph: {
            title: tool.name,
            type: "website",
            url: `${url}/tools/${slug}`,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            title: tool.name,
            card: "summary_large_image",
            images: [ogImage],
        },
    };
}

export default async function ToolPage({ params }: { params: Params }) {
    const slug = (await params).slug;
    const tool = getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    const { default: ToolComponent } = await import(
        `@/components/tools/${tool.slug}.tsx`
    );

    if (!ToolComponent) {
        notFound();
    }

    return (
        <Layout
            title={tool.name}
            icon={tool.icon}
            description={tool.description}
        >
            <ToolComponent />
        </Layout>
    );
}
