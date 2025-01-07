import type { MDXComponents } from "mdx/types";
import { Button } from "./components/ui/button";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: ({ children }) => <p className="p">{children}</p>,
    h1: ({ children }) => <h1 className="h1">{children}</h1>,
    h2: ({ children }) => <h2 className="h2 -mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="h3 -mb-6 mt-10">{children}</h3>,
    h4: ({ children }) => <h4 className="h4">{children}</h4>,
    ol: ({ children }) => <ol className="list my-0">{children}</ol>,
    ul: ({ children }) => <ol className="list my-0">{children}</ol>,
    li: ({ children }) => <li className="li">{children}</li>,
    a: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <Button
        variant="link"
        className="inline-flex h-auto px-0.5 py-0"
        href={href}
        target="_blank"
      >
        {children}
      </Button>
    ),
    code: ({ children }) => <code className="snippet">{children}</code>,
  };
}
