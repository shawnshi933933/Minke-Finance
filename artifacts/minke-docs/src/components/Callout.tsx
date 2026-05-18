import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "note";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const config: Record<CalloutType, { icon: typeof Info; classes: string; titleColor: string }> = {
  info: {
    icon: Info,
    classes: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
    titleColor: "text-blue-700 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
    titleColor: "text-amber-700 dark:text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    classes: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
    titleColor: "text-green-700 dark:text-green-400",
  },
  note: {
    icon: CheckCircle,
    classes: "bg-muted border-border",
    titleColor: "text-muted-foreground",
  },
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, classes, titleColor } = config[type];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 my-4", classes)}>
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", titleColor)} />
      <div className="min-w-0">
        {title && <p className={cn("text-sm font-semibold mb-1", titleColor)}>{title}</p>}
        <div className="text-sm text-foreground/80 [&>p]:my-0 [&>p]:leading-6">{children}</div>
      </div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <Callout type="note">{children}</Callout>;
}

export function Warning({ children }: { children: ReactNode }) {
  return <Callout type="warning">{children}</Callout>;
}

export function Tip({ children }: { children: ReactNode }) {
  return <Callout type="tip">{children}</Callout>;
}

export function ComingSoon({ feature }: { feature?: string }) {
  return (
    <div className="my-8 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 px-8 py-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
        <Lightbulb className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        {feature
          ? `${feature} documentation is under development and will be published when the feature launches.`
          : "This section is under development and will be available when the feature launches."}
      </p>
    </div>
  );
}
