import Link from "next/link";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { Layout } from "@/components/layout";
import { RefererSentence } from "@/components/about/referer-sentence";
import { GreetingSentence } from "@/components/about/greeting-sentence";
import { Note } from "@/components/about/note";

export default async function AboutPage() {
    return (
        <Layout
            title="About"
            actions={[
                {
                    label: "GitHub",
                    icon: IconBrandGithub,
                    href: "https://github.com/yunger7",
                },
                {
                    label: "LinkedIn",
                    icon: IconBrandLinkedin,
                    href: "https://www.linkedin.com/in/luisgalete",
                },
            ]}
        >
            <article className="prose prose-sm prose-zinc mb-8 max-w-none dark:prose-invert">
                <p>Hey!</p>
                <p>
                    <RefererSentence /> <GreetingSentence />
                </p>
                <p>
                    My name is Luís by the way, and this is my workshop. Every{" "}
                    <Link href="/writing/why-digital-craftsman">craftsman</Link>{" "}
                    has one, and I&apos;m no exception. Here you can find my{" "}
                    <Link href="/projects">projects</Link>, a bunch of{" "}
                    <Link href="/tools">tools</Link> and some of my{" "}
                    <Link href="/writing">writing</Link> scattered around.
                </p>
                <p>
                    Make yourself at home and take a look around, you may find
                    something valuable in here, or perhaps this old workshop
                    might inspire you to build something as well. I&apos;m going
                    back to work now, but feel free to leave a note if
                    you&apos;d like to stay in touch.
                </p>
            </article>
            <Note />
        </Layout>
    );
}
