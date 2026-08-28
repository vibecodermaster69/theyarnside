"use client";

import Link from "next/link";
import Image from "next/image";

const careCards = [
  {
    number: "01",
    title: "Wash gently",
    text: "Hand wash your crochet piece in cool or lukewarm water with a small amount of mild detergent. Avoid bleach, fabric softener, and vigorous scrubbing.",
  },
  {
    number: "02",
    title: "Dry flat",
    text: "Never wring or twist handmade crochet. Press out excess water with a clean towel, then reshape the piece and leave it flat to air-dry away from direct sunlight.",
  },
  {
    number: "03",
    title: "Keep its shape",
    text: "While damp, gently smooth the edges and adjust the shape by hand. Bags should be dried upright or stuffed lightly with a clean towel to support their form.",
  },
  {
    number: "04",
    title: "Store with care",
    text: "Fold items loosely and store them in a cool, dry place. Keep them away from moisture, rough surfaces, and anything that could catch the yarn.",
  },
];

export default function CareGuidePage() {
  return <><main className="care-page">
    <section className="care-hero"><div className="care-hero-inner"><div><p className="care-eyebrow">MADE TO LAST</p><h1>Care for your crochet,<br /><em>keep the story going.</em></h1><p className="care-intro">Every piece from THE YARN SIDE is made slowly and thoughtfully. A little gentle care helps your favourite stitches stay soft, beautiful, and ready for everyday adventures.</p></div><Image className="care-seal" src="/assets/logos/footer_seal_transparent.png" alt="The Yarn Side logo" width={220} height={220} priority /></div></section>
    <section className="care-section"><div className="care-container"><div className="care-section-heading"><p className="care-eyebrow">THE EVERYDAY ROUTINE</p><h2>Simple care, <em>happy stitches.</em></h2><p>Most handmade crochet pieces only need a light touch and a little patience.</p></div><div className="care-grid">{careCards.map((card) => <article className="care-card" key={card.number}><span>{card.number}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}</div></div></section>
    <section className="care-section care-section-alt"><div className="care-container care-two-column"><div><p className="care-eyebrow">QUICK REMINDERS</p><h2>What to avoid</h2></div><div className="care-reminders"><p><strong>No machine washing:</strong> Heat and agitation can stretch or felt the fibres.</p><p><strong>No tumble drying:</strong> Air-drying protects the shape and texture.</p><p><strong>No hanging heavy bags:</strong> Store them supported so the handles do not stretch.</p><p><strong>Small pulls happen:</strong> Tuck a loose end back through the stitches; do not cut it.</p></div></div></section>
    <section className="care-note"><div className="care-note-inner"><p className="care-eyebrow">A LITTLE EXTRA LOVE</p><h2>Need help with a piece?</h2><p>If your item needs reshaping, repair, or a little advice, send us a photo and we’ll guide you through the next step.</p><Link href="/#custom-orders" className="care-button">Contact THE YARN SIDE</Link></div></section>
  </main><style jsx global>{`.care-page{background:var(--cream);color:var(--cocoa)}.care-hero{padding:78px 24px 76px;background:var(--cream);border-bottom:1px solid rgba(75,58,50,.1)}.care-hero-inner,.care-container,.care-note-inner{max-width:1120px;margin:0 auto}.care-hero-inner{display:flex;align-items:center;justify-content:space-between;gap:44px}.care-eyebrow{margin:0 0 10px;color:var(--coral);font:700 11px var(--font-lato),sans-serif;letter-spacing:.16em;text-transform:uppercase}.care-page h1,.care-page h2,.care-page h3{font-family:var(--font-playfair),Georgia,serif}.care-page h1{margin:0;max-width:760px;font-size:clamp(38px,6vw,72px);font-weight:400;line-height:1.05}.care-page h1 em,.care-page h2 em{color:var(--coral);font-weight:400}.care-intro{max-width:610px;margin:22px 0 0;color:rgba(75,58,50,.72);font-size:17px;line-height:1.7}.care-seal{width:clamp(150px,20vw,220px);height:auto;flex:none;filter:drop-shadow(0 12px 20px rgba(75,58,50,.1))}.care-section{padding:82px 24px}.care-section-alt{background:var(--white);border-top:1px solid rgba(75,58,50,.08);border-bottom:1px solid rgba(75,58,50,.08)}.care-section-heading{max-width:610px;margin-bottom:38px}.care-page h2{margin:0 0 10px;font-size:clamp(30px,4vw,48px);font-weight:400}.care-section-heading>p:last-child{margin:0;color:rgba(75,58,50,.7);font-size:16px}.care-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.care-card{min-height:235px;padding:24px;background:var(--sage-light);border:1px solid rgba(75,58,50,.08);border-radius:var(--border-radius-md)}.care-card>span{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:var(--coral);color:var(--white);font:700 11px var(--font-lato),sans-serif}.care-card h3{margin:24px 0 10px;font-size:22px;font-weight:400}.care-card p,.care-reminders p{margin:0;color:rgba(75,58,50,.72);font-size:14px;line-height:1.65}.care-two-column{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px}.care-reminders{display:grid;gap:18px}.care-reminders p{padding-bottom:18px;border-bottom:1px solid rgba(75,58,50,.1)}.care-reminders p:last-child{padding-bottom:0;border-bottom:0}.care-note{padding:82px 24px;background:var(--sage-light)}.care-note-inner{text-align:center}.care-note-inner>p:not(.care-eyebrow){max-width:550px;margin:0 auto 24px;color:rgba(75,58,50,.72);font-size:16px;line-height:1.7}.care-button{display:inline-flex;padding:13px 20px;border-radius:999px;background:var(--coral);color:var(--white);font:700 12px var(--font-lato),sans-serif;letter-spacing:.04em;text-transform:uppercase}.care-button:hover{background:var(--cocoa)}@media(max-width:850px){.care-hero-inner{align-items:flex-start;flex-direction:column}.care-seal{width:150px}.care-grid{grid-template-columns:repeat(2,1fr)}.care-two-column{grid-template-columns:1fr;gap:34px}}@media(max-width:560px){.care-hero,.care-section,.care-note{padding:52px 18px}.care-grid{grid-template-columns:1fr}.care-card{min-height:0}.care-page h1{font-size:40px}}`}</style></>;
}
