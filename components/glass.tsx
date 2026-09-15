"use client";

import {
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

const frost: CSSProperties = {
  backdropFilter: "blur(40px) saturate(1.45)",
  WebkitBackdropFilter: "blur(40px) saturate(1.45)",
};

type GlassProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  light?: boolean;
};

export function Glass({
  children,
  className = "",
  light = true,
  onMouseMove,
  style,
  ...props
}: GlassProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!light) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--gx", `${x}%`);
    el.style.setProperty("--gy", `${y}%`);
    onMouseMove?.(e);
  };

  return (
    <div
      ref={ref}
      className={`glass-panel ${light ? "glass-light" : ""} ${className}`}
      style={{ ...frost, ...style }}
      onMouseMove={handleMove}
      {...props}
    >
      {children}
    </div>
  );
}
