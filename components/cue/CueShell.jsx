'use client';
import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import CueApp from './CueApp';
import { VIEW_TO_PATH, pathToView } from '../../lib/routes';

// Lives in the root layout, so the app (page stack, filters, Customize values)
// keeps its state while the route changes.
export default function CueShell() {
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useCallback(
    (view) => router.push(VIEW_TO_PATH[view] || '/', { scroll: false }),
    [router],
  );
  return (
    <MotionConfig reducedMotion="user">
      <CueApp view={pathToView(pathname)} navigate={navigate} />
    </MotionConfig>
  );
}
