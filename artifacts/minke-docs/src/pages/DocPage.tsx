import { useGetDocContent } from "@workspace/api-client-react";
import DocContent from "@/components/DocContent";
import { Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface DocPageProps {
  slug: string;
}

export default function DocPage({ slug }: DocPageProps) {
  const { data, isLoading, isError } = useGetDocContent(slug);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/5" />
        <div className="mt-8 h-5 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Page not found
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          This documentation page could not be loaded.
        </p>
        <Link
          href="/introduction/what-is-minke"
          className="text-sm text-primary hover:underline"
        >
          Go to Introduction →
        </Link>
      </div>
    );
  }

  if (data.comingSoon) {
    return (
      <div>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
            {data.title}
          </h1>
          <p className="text-muted-foreground">
            This section is under development and will be available soon.
          </p>
        </div>
        <DocContent content={data.content} />
      </div>
    );
  }

  return <DocContent content={data.content} />;
}
