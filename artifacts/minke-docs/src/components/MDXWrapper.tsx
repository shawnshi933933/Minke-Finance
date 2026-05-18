import type { ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import Callout, { Note, Warning, Tip, ComingSoon } from "./Callout";

const components = {
  Callout,
  Note,
  Warning,
  Tip,
  ComingSoon,
  wrapper: ({ children }: { children: ReactNode }) => (
    <div className="docs-prose">{children}</div>
  ),
};

export default function MDXWrapper({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
