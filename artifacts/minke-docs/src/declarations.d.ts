declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXComponents } from "@mdx-js/react";
  const Component: ComponentType<{ components?: MDXComponents }>;
  export default Component;
}

declare module "*.json" {
  const value: unknown;
  export default value;
}
