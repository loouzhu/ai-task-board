import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

export function LazyRoute<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode,
) {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback ?? <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
