import type { Metadata } from "next";
import { Layout } from "@/components/layout";
import { Menu } from "@/components/tools/menu";

export const metadata: Metadata = {
    title: "Tools",
};

export default function ToolsPage() {
    return (
        <Layout title="Tools">
            <Menu />
        </Layout>
    );
}
