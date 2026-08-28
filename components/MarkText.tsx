import React from "react";
import { parseMarks, markSrc } from "@/lib/marks";

/**
 * Renders a stored string, turning `:name:` tokens into their mark image.
 * Marks are decorative next to the words they illustrate, so they carry empty
 * alt text and the sentence still reads correctly without them.
 */
export default function MarkText({
  children,
  size = "1.45em",
  className,
}: {
  children: string | null | undefined;
  /** Marks below 24px lose their detail; keep this at 1.3em or above in body copy. */
  size?: string;
  className?: string;
}) {
  if (!children) return null;

  return (
    <span className={className}>
      {parseMarks(children).map((segment, index) =>
        segment.type === "text" ? (
          <React.Fragment key={index}>{segment.value}</React.Fragment>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={markSrc(segment.name)}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            style={{
              // globals.css sets `img { display: block }` site-wide, which puts every
              // mark on its own line. An inline style is what keeps it in the sentence.
              display: "inline-block",
              width: size,
              height: size,
              objectFit: "contain",
              verticalAlign: "-0.28em",
              margin: "0 0.16em",
            }}
          />
        ),
      )}
    </span>
  );
}
