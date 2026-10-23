import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// CSS-only fade so SSR HTML is visible before React hydrates (framer-motion's initial="hidden" kept it at opacity 0).
export default function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-in">{children}</div>;
}
