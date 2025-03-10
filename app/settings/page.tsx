import type { Metadata } from "next";
import { Layout } from "@/components/layout";
import { Menu } from "@/components/settings/menu";

export const metadata: Metadata = {
    title: "Settings",
};

export default function SettingsPage() {
    return (
        <Layout title="Settings">
            <Menu />
        </Layout>
    );
}
