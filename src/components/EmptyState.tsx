import type { ReactNode } from "react";

interface EmptyStateProps {
  /** Message displayed when there are no items */
  message: string;
  /** Optional extra content below the message (e.g. CTA button) */
  children?: ReactNode;
}

/**
 * Consistent empty state display used across list pages.
 */
export function EmptyState({ message, children }: EmptyStateProps) {
  return (
    <div className="mt-16 text-center text-muted-foreground">
      <p>{message}</p>
      {children}
    </div>
  );
}
