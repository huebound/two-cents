import React from "react";

type NudgeImgProps = {
  src: string;
  alt?: string;
  className?: string;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string | number;
  z?: number;
  tx?: string | number; // translateX
  ty?: string | number; // translateY
  rot?: string | number; // rotation
  sc?: string | number; // scale
  style?: React.CSSProperties;
};

function toCss(v?: string | number) {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

export default function NudgeImg({
  src,
  alt = "",
  className = "",
  top,
  left,
  right,
  bottom,
  width,
  z,
  tx,
  ty,
  rot,
  sc,
  style = {},
}: NudgeImgProps) {
  const pos: React.CSSProperties = {
    top: toCss(top),
    left: toCss(left),
    right: toCss(right),
    bottom: toCss(bottom),
    width: toCss(width),
    zIndex: z,
  };

  const vars: React.CSSProperties & Record<string, any> = {};
  if (tx !== undefined) (vars as any)["--tx"] = toCss(tx);
  if (ty !== undefined) (vars as any)["--ty"] = toCss(ty);
  if (rot !== undefined) (vars as any)["--rot"] = typeof rot === "number" ? `${rot}deg` : rot;
  if (sc !== undefined) (vars as any)["--sc"] = typeof sc === "number" ? String(sc) : sc;

  return (
    <img
      src={src}
      alt={alt}
      className={`hero-nudge pointer-events-none absolute ${className}`}
      style={{ ...pos, ...style, ...vars }}
    />
  );
}

