import { Suspense, lazy, useMemo } from "react";
import { Link } from "wouter";
import { getPageBySlug, getAdjacentPages } from "@/lib/sidebar";
import MDXWrapper from "@/components/MDXWrapper";
import { Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const mdxModules = import.meta.glob("../docs/**/*.mdx");

interface DocPageProps {
  slug: string;
}

function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-9 bg-muted rounded w-2/3" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-4/5" />
      <div className="mt-8 h-5 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-3/4" />
    </div>
  );
}

export default function DocPage({ slug }: DocPageProps) {
  const pageInfo = getPageBySlug(slug);
  const { prev, next } = getAdjacentPages(slug);

  const Component = useMemo(() => {
    const key = `../docs/${slug}.mdx`;
    const loader = mdxModules[key];
    if (!loader) return null;
    return lazy(loader as () => Promise<{ default: React.ComponentType }>);
  }, [slug]);

  if (!pageInfo && !Component) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Page not found</h2>
        <p className="text-muted-foreground text-sm mb-6">
          This documentation page does not exist.
        </p>
        <Link href="/introduction/what-is-minke" className="text-sm text-primary hover:underline">
          Go to Introduction →
        </Link>
      </div>
    );
  }

  if (pageInfo?.comingSoon) {
    return (
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
            {pageInfo.title}
          </h1>
          <p className="text-muted-foreground">
            This section is currently under development and will be published when the feature launches.
          </p>
        </div>
        {Component && (
          <Suspense fallback={<PageSkeleton />}>
            <MDXWrapper>
              <Component />
            </MDXWrapper>
          </Suspense>
        )}
        <PageNav prev={prev} next={next} />
      </div>
    );
  }

  return (
    <div>
      {Component ? (
        <Suspense fallback={<PageSkeleton />}>
          <MDXWrapper>
            <Component />
          </MDXWrapper>
        </Suspense>
      ) : (
        <PageSkeleton />
      )}
      <PageNav prev={prev} next={next} />
    </div>
  );
}

function PageNav({ prev, next }: { prev?: { slug: string; title: string; section: string; comingSoon?: boolean }; next?: { slug: string; title: string; section: string; comingSoon?: boolean } }) {
  if (!prev && !next) return null;
  return (
    <nav className="mt-12 pt-8 border-t border-border flex items-stretch gap-4">
      {prev ? (
        <Link
          href={`/${prev.slug}`}
          className="flex-1 group flex flex-col gap-1 rounded-lg border border-border p-4 hover:bg-muted transition-colors text-left"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </span>
          <span className="text-xs text-muted-foreground/60">{prev.section}</span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next && !next.comingSoon ? (
        <Link
          href={`/${next.slug}`}
          className="flex-1 group flex flex-col gap-1 rounded-lg border border-border p-4 hover:bg-muted transition-colors text-right"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs text-muted-foreground/60">{next.section}</span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
