"use client";

import React from "react";
import { Scissors, Sun, ShieldCheck, HeartHandshake } from "lucide-react";

export default function WhyHandmade() {
  const reasons = [
    {
      icon: <Scissors size={28} strokeWidth={1.5} />,
      title: "Artisan Craftsmanship",
      desc: "Each item is slowly hand-looped with precise attention to detail, creating one-of-a-kind variations that industrial machines can never replicate.",
    },
    {
      icon: <Sun size={28} strokeWidth={1.5} />,
      title: "Premium Natural Yarns",
      desc: "We source only premium natural fibers—soft organic cotton, merino wool, and cozy alpaca—that feel luxurious, breathe naturally, and last for years.",
    },
    {
      icon: <ShieldCheck size={28} strokeWidth={1.5} />,
      title: "Zero Waste Design",
      desc: "Crochet cannot be replicated by machines. Since we craft stitch-by-stitch, we use only the exact amount of yarn needed, leaving zero fabric waste.",
    },
    {
      icon: <HeartHandshake size={28} strokeWidth={1.5} />,
      title: "Custom Crafted",
      desc: "Because we make everything ourselves, we can accommodate custom size adjustments, color edits, and personalized requests for any item.",
    },
  ];

  return (
    <section className="section-padding why-section">
      <div className="container">
        <h2 className="section-title text-serif">Why Handmade?</h2>
        <div className="section-subtitle tagline">
          <span className="flourish-heart">♥</span>
          Slow fashion, made to be cherished
          <span className="flourish-heart">♥</span>
        </div>

        <div className="reasons-grid">
          {reasons.map((item, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon-wrapper">{item.icon}</div>
              <h3 className="reason-title text-serif">{item.title}</h3>
              <p className="reason-desc text-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .why-section {
          background-color: var(--white);
          border-bottom: 1px solid rgba(75, 58, 50, 0.05);
        }

        .reasons-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .reason-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 20px;
          border-radius: var(--border-radius-md);
          background-color: var(--cream);
          border: 1px solid rgba(75, 58, 50, 0.04);
          transition: var(--transition-normal);
        }

        .reason-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-sm);
        }

        .reason-icon-wrapper {
          color: var(--sage);
          background-color: var(--white);
          width: 60px;
          height: 60px;
          border-radius: var(--border-radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(75, 58, 50, 0.03);
        }

        .reason-title {
          font-size: var(--fs-md);
          color: var(--cocoa);
          margin-bottom: 12px;
          font-weight: 700;
        }

        .reason-desc {
          font-size: var(--fs-sm);
          color: var(--cocoa);
          opacity: 0.8;
          line-height: 1.6;
        }

        @media (max-width: 991px) {
          .reasons-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 576px) {
          .reasons-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .reason-card {
            max-width: 320px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
