"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  left: { x: -50, y: 0 },
  right: { x: 50, y: 0 },
  none: { x: 0, y: 0 },
};

// Fades/slides children in when they enter the viewport
export const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  const { x, y } = reduce ? { x: 0, y: 0 } : offsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Continuous gentle floating, for decorative elements
export const Float = ({
  children,
  distance = 10,
  duration = 6,
  delay = 0,
  className,
}: {
  children: ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Soft pulsing glow for the background blobs
export const Glow = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    />
  );
};