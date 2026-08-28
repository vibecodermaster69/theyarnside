/**
 * Marks are stored inside product text as `:name:` tokens rather than as HTML,
 * so the database keeps plain strings, nothing can inject markup, and a token
 * that no longer resolves degrades to visible text instead of a broken tag.
 */

export const MARK_GROUPS: { label: string; marks: { name: string; label: string }[] }[] = [
  {
    // The supplied painted sheet, kept together so it is findable at a glance.
    label: "Your illustrations",
    marks: [
      { name: "yarn-ball", label: "Yarn ball" },
      { name: "crochet-hook", label: "Crochet hook" },
      { name: "yarn-heart", label: "Yarn heart" },
      { name: "blossom", label: "Blossom" },
      { name: "sprig", label: "Sprig" },
      { name: "sparkle", label: "Sparkle" },
      { name: "gift-box", label: "Gift box" },
      { name: "shopping-bag", label: "Shopping bag" },
      { name: "parcel", label: "Parcel" },
      { name: "care-wash", label: "Wash care" },
      { name: "bow", label: "Bow" },
      { name: "review-bubble", label: "Review" },
      { name: "mushroom-charm", label: "Mushroom" },
      { name: "octopus-charm", label: "Octopus" },
      { name: "cherry-charm", label: "Cherry" },
      { name: "handmade-tag", label: "Handmade tag" },
    ],
  },
  {
    label: "Crochet & tools",
    marks: [
      { name: "yarn-skein", label: "Yarn skein" },
      { name: "yarn-basket", label: "Yarn basket" },
      { name: "granny-square", label: "Granny square" },
      { name: "doily", label: "Doily" },
      { name: "crochet-flower", label: "Flower" },
      { name: "amigurumi-bear", label: "Bear" },
      { name: "amigurumi-bunny", label: "Bunny" },
      { name: "baby-bootie", label: "Baby bootie" },
      { name: "mittens", label: "Mittens" },
      { name: "scarf", label: "Scarf" },
      { name: "plant-hanger", label: "Plant hanger" },
      { name: "pom-pom", label: "Pom-pom" },
      { name: "tassel", label: "Tassel" },
      { name: "button", label: "Button" },
      { name: "stitch-marker", label: "Stitch marker" },
      { name: "scissors", label: "Scissors" },
      { name: "measuring-tape", label: "Measuring tape" },
      { name: "thread-spool", label: "Thread spool" },
    ],
  },
  {
    label: "Care, shipping & notes",
    marks: [
      { name: "check", label: "Check" },
      { name: "truck", label: "Shipping" },
      { name: "gift-tag", label: "Gift tag" },
      { name: "envelope", label: "Envelope" },
      { name: "calendar", label: "Made to order" },
      { name: "bell", label: "Bell" },
    ],
  },
  {
    label: "Warmth & weather",
    marks: [
      { name: "heart", label: "Heart" },
      { name: "smile", label: "Smile" },
      { name: "star", label: "Star" },
      { name: "sparkle-cluster", label: "Sparkles" },
      { name: "sun", label: "Sun" },
      { name: "moon", label: "Moon" },
      { name: "cloud", label: "Cloud" },
      { name: "leaf", label: "Leaf" },
      { name: "ribbon", label: "Ribbon" },
      { name: "cozy-mug", label: "Cozy mug" },
    ],
  },
];

export const MARK_LABELS: Record<string, string> = Object.fromEntries(
  MARK_GROUPS.flatMap((group) => group.marks.map((mark) => [mark.name, mark.label])),
);

export const markSrc = (name: string) => `/assets/marks/${name}.webp`;

// Only a token whose name is in the registry is treated as a mark.
const TOKEN = /:([a-z0-9-]+):/g;

export type MarkSegment =
  | { type: "text"; value: string }
  | { type: "mark"; name: string; label: string };

/** Split a stored string into plain text and the marks embedded in it. */
export function parseMarks(input: string): MarkSegment[] {
  const segments: MarkSegment[] = [];
  let cursor = 0;

  TOKEN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN.exec(input)) !== null) {
    const name = match[1];
    if (!(name in MARK_LABELS)) continue;
    const start = match.index;
    if (start > cursor) segments.push({ type: "text", value: input.slice(cursor, start) });
    segments.push({ type: "mark", name, label: MARK_LABELS[name] });
    cursor = start + match[0].length;
  }

  if (cursor < input.length) segments.push({ type: "text", value: input.slice(cursor) });
  return segments;
}

/** Strip marks for titles, meta descriptions and anywhere else plain text is required. */
export function stripMarks(input: string): string {
  return input.replace(TOKEN, (whole, name) => (name in MARK_LABELS ? "" : whole))
    .replace(/\s{2,}/g, " ")
    .trim();
}
