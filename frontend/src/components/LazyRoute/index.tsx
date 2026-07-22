import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

export function LazyRoute(
  importFn: () => Promise<{ default: ComponentType }>,
  fallback?: ReactNode,
) {
  const LazyComponent = lazy(importFn);

  return () => (
    <Suspense fallback={fallback ?? <div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
