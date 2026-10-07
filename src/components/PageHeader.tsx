import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Page title displayed as h1 */
  title: string;
  /** Optional subtitle (e.g. item count) */
  subtitle?: string;
  /** Action buttons or filter components on the right side */
  actions?: ReactNode;
  /** Use larger text for public-facing pages (text-3xl vs text-2xl) */
  large?: boolean;
}

/**
 * Consistent page header layout used across list and dashboard pages.
 * Stacks vertically on mobile, side-by-side on desktop.
 */
export function PageHeader({ title, subtitle, actions, large }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1
          className={`font-heading font-bold tracking-tight ${
            large ? "text-3xl" : "text-2xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
