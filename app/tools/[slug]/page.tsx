import { notFound } from "next/navigation";
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

export default async function ToolPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
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
