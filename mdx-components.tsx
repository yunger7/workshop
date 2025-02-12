import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener">
                {children}
            </a>
        ),
        ...components,
    };
}
