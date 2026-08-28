"use client";

import { useEffect } from "react";
import { MotionConfig, motion } from "framer-motion";

// Flipped once the first page has mounted in the browser. It is module scope so
// it survives the remount, and it never flips on the server because effects do
// not run there.
let hasMountedOnce = false;

// A template remounts on every navigation, which is what gives each route its
// own enter animation. A layout would not: it persists across routes by design.
export default function StorefrontTemplate({ children }: { children: React.ReactNode }) {
  // The very first page must render fully visible: an SSR'd opacity:0 leaves the
  // document blank until hydration, which is slower than no animation at all.
  // Later navigations are already past hydration, so they can fade in.
  const initial = hasMountedOnce ? { opacity: 0, y: 8 } : false;

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  return (
    // Reduced motion is handled here rather than by branching on
    // useReducedMotion during render, which makes the server and client disagree
    // on the first paint and fails hydration.
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
