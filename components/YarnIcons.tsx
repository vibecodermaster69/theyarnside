import React from "react";

/**
 * Hand-drawn marks for the crochet catalogue, used in place of Unicode emoji.
 *
 * Emoji are the one element on the page whose colour cannot be controlled: they
 * ship as full-saturation bitmaps and render differently on every platform,
 * which fights the restrained palette in STRICT_BRAND_GUIDELINES section 3.
 * These are strokes painted with currentColor, so they inherit cocoa, coral or
 * sage from whatever text they sit in, and stay identical everywhere.
 *
 * Stroke weight and cap style match lucide-react so they sit alongside the
 * existing UI icons without looking like a second icon set.
 */

export type YarnIconName =
  | "mushroom"
  | "bear"
  | "cat"
  | "bunny"
  | "octopus"
  | "cherry"
  | "evilEye"
  | "bow"
  | "paranda"
  | "keychain"
  | "tote"
  | "beanie"
  | "blanket"
  | "daisy"
  | "yarn"
  | "hook"
  | "heart";

const paths: Record<YarnIconName, React.ReactNode> = {
  mushroom: (
    <>
      <path d="M4.5 11.5a7.5 7.5 0 0 1 15 0Z" />
      <path d="M9.6 11.5v5.2a2.4 2.4 0 0 0 4.8 0v-5.2" />
      <circle cx="9.2" cy="8.2" r=".85" />
      <circle cx="13.6" cy="6.9" r=".85" />
      <circle cx="15.9" cy="9.6" r=".7" />
    </>
  ),
  bear: (
    <>
      <circle cx="7.2" cy="6.8" r="2.6" />
      <circle cx="16.8" cy="6.8" r="2.6" />
      <circle cx="12" cy="13.4" r="6.3" />
      <ellipse cx="12" cy="15.4" rx="2.6" ry="2.1" />
      <circle cx="9.6" cy="11.4" r=".8" />
      <circle cx="14.4" cy="11.4" r=".8" />
    </>
  ),
  cat: (
    <>
      <path d="M6.7 8.8 5.4 3.4l4.9 2.7" />
      <path d="M17.3 8.8l1.3-5.4-4.9 2.7" />
      <circle cx="12" cy="13.6" r="6.4" />
      <circle cx="9.7" cy="12.2" r=".8" />
      <circle cx="14.3" cy="12.2" r=".8" />
      <path d="M4.8 14.2h3.1M16.1 14.2h3.1M10.6 15.8h2.8" />
    </>
  ),
  bunny: (
    <>
      <ellipse cx="9.5" cy="6.4" rx="1.9" ry="4.1" transform="rotate(-13 9.5 6.4)" />
      <ellipse cx="14.5" cy="6.4" rx="1.9" ry="4.1" transform="rotate(13 14.5 6.4)" />
      <circle cx="12" cy="15.2" r="5.3" />
      <circle cx="10.1" cy="14.2" r=".8" />
      <circle cx="13.9" cy="14.2" r=".8" />
      <path d="M12 16.1v1.1" />
    </>
  ),
  octopus: (
    <>
      <path d="M6 14.6a6 6 0 0 1 12 0v1.6H6Z" />
      <circle cx="9.9" cy="12.2" r=".8" />
      <circle cx="14.1" cy="12.2" r=".8" />
      <path d="M6.4 16.2c-.6 1.7.4 2.6-.9 4.3M9.6 16.2c-.5 1.9.3 3-.6 4.6M14.4 16.2c.5 1.9-.3 3 .6 4.6M17.6 16.2c.6 1.7-.4 2.6.9 4.3" />
    </>
  ),
  cherry: (
    <>
      <circle cx="7.9" cy="17.4" r="3.1" />
      <circle cx="16.4" cy="18" r="2.9" />
      <path d="M8.4 14.4C9.2 10.2 11.4 6.4 14.8 4.8" />
      <path d="M16.6 15.2c-.7-3.7.1-7.6-1.8-10.4" />
      <path d="M14.8 4.8c1.6-1.7 3.7-1.8 4.7-.9.9.9-.3 3.1-4.7.9Z" />
    </>
  ),
  evilEye: (
    <>
      <path d="M2.6 12S6.2 6.4 12 6.4 21.4 12 21.4 12 17.8 17.6 12 17.6 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  bow: (
    <>
      <path d="M10.6 12c-2.4-3.2-6.9-3.4-6.9.1s4.5 3.2 6.9-.1Z" />
      <path d="M13.4 12c2.4-3.2 6.9-3.4 6.9.1s-4.5 3.2-6.9-.1Z" />
      <circle cx="12" cy="12.1" r="1.7" />
      <path d="M10.8 13.6 9.1 20M13.2 13.6 14.9 20" />
    </>
  ),
  paranda: (
    <>
      <circle cx="12" cy="3.9" r="1.7" />
      <path d="M12 5.6c-1.6 1.9-1.6 3.4 0 5.3s1.6 3.4 0 5.3" />
      <path d="M12 5.6c1.6 1.9 1.6 3.4 0 5.3s-1.6 3.4 0 5.3" />
      <path d="M8.6 17.6 7.4 21.4M12 17.2V21.4M15.4 17.6l1.2 3.8" />
      <path d="M8 16.9h8" />
    </>
  ),
  keychain: (
    <>
      <circle cx="12" cy="5.4" r="3.1" />
      <path d="M12 8.5v2.4" />
      <path d="M9.8 10.9h4.4a2 2 0 0 1 2 2v3.6a4.2 4.2 0 0 1-8.4 0v-3.6a2 2 0 0 1 2-2Z" />
    </>
  ),
  tote: (
    <>
      <path d="M4.8 7.8h14.4l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4Z" />
      <path d="M9.1 7.8V6.2a2.9 2.9 0 0 1 5.8 0v1.6" />
      <path d="M8.6 12.2h6.8" />
    </>
  ),
  beanie: (
    <>
      <path d="M4.9 15.4a7.1 7.1 0 0 1 14.2 0Z" />
      <path d="M3.6 15.4h16.8a1.6 1.6 0 0 1 0 3.2H3.6a1.6 1.6 0 0 1 0-3.2Z" />
      <circle cx="12" cy="4.6" r="1.8" />
      <path d="M12 6.4v1.9" />
    </>
  ),
  blanket: (
    <>
      <path d="M4.2 7.4a2 2 0 0 1 2-2h11.6a2 2 0 0 1 2 2v9.2H4.2Z" />
      <path d="M4.2 10.4h15.6M4.2 13.5h15.6" />
      <path d="M6.4 16.6v3.2M9.3 16.6v3.2M12 16.6v3.2M14.7 16.6v3.2M17.6 16.6v3.2" />
    </>
  ),
  daisy: (
    <>
      <circle cx="12" cy="8.3" r="2.7" />
      <circle cx="15.5" cy="10.8" r="2.7" />
      <circle cx="14.2" cy="15" r="2.7" />
      <circle cx="9.8" cy="15" r="2.7" />
      <circle cx="8.5" cy="10.8" r="2.7" />
      <circle cx="12" cy="12.1" r="1.9" />
    </>
  ),
  yarn: (
    <>
      <circle cx="11.4" cy="11.8" r="7.4" />
      <path d="M5.6 7.2c4.1 2.5 6.7 6.1 7.7 10.8" />
      <path d="M17.1 8.1c-3.6 1-6.2 3.6-7.5 7.6" />
      <path d="M18.5 16.3c1.6.6 2.4 1.7 2.7 3.2" />
    </>
  ),
  hook: (
    <>
      <path d="M9.4 21V8.6a3.6 3.6 0 0 1 7.2 0c0 1.7-1.3 2.6-2.8 2.6" />
      <path d="M9.4 13.2h4.4" />
    </>
  ),
  heart: (
    <path d="M12 20.4S3.6 14.9 3.6 9.2A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.4 2.6c0 5.7-8.4 11.2-8.4 11.2Z" />
  ),
};

/** Sensible default mark for each catalogue category key. */
export const categoryIcons: Record<string, YarnIconName> = {
  amigurumi: "bear",
  wearables: "beanie",
  "home-decor": "blanket",
  "accessories-gifts": "tote",
  "hair-fashion-accessories": "bow",
  "keychains-charms": "keychain",
};

type YarnIconProps = {
  name: YarnIconName;
  /** Defaults to 1em so the mark matches the surrounding text. */
  size?: number | string;
  className?: string;
  /** Supply when the mark carries meaning; omitted it is hidden from readers. */
  title?: string;
};

export default function YarnIcon({ name, size = "1em", className, title }: YarnIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
