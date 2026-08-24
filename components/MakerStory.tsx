"use client";

import React from "react";
import Image from "next/image";

export default function MakerStory() {
  return (
    <section id="about" className="section-padding story-section">
      <div className="container story-inner">
        {/* Left Column: Story Image */}
        <div className="story-image-container">
          <div className="story-image-wrapper zoom-container">
            <Image
              src="/assets/02_website_assets/category_banners/kits_and_bundles.png"
              alt="Artisan yarn basket with crochet hooks"
              width={500}
              height={500}
              className="story-image zoom-image"
            />
          </div>
        </div>

        {/* Right Column: Story Content */}
        <div className="story-content">
          <span className="story-meta text-sans">The Maker’s Journey</span>
          <h2 className="story-title text-serif">Meet Anjali</h2>
          
          <div className="story-divider">
            <span className="flourish-heart">♥</span>
          </div>

          <p className="story-text text-sans">
            Hi, I’m Anjali. THE YARN SIDE was born out of a lifelong love for texture, 
            patience, and the quiet joy of handmade craftsmanship. For me, crocheting is 
            more than a craft—it is a mindful ritual, a way to slow down and create 
            something beautiful and lasting in a fast-paced world.
          </p>
          
          <p className="story-text text-sans">
            Every single bag, amigurumi toy, and cozy blanket is hand-crocheted by me in my 
            sunny home studio. I select only the softest, high-quality, thoughtfully sourced 
            natural yarns, ensuring that each creation is not only unique but also durable 
            and warm.
          </p>

          <p className="story-text tagline italic">
            "Made one loop at a time, just for you."
          </p>

          <div className="story-signature">
            <Image
              src="/assets/logos/primary_horizontal.png"
              alt="Anjali's signature logo"
              width={200}
              height={52}
              className="signature-img"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .story-section {
          background-color: var(--cream);
          border-top: 1px solid rgba(75, 58, 50, 0.05);
          border-bottom: 1px solid rgba(75, 58, 50, 0.05);
        }

        .story-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }

        .story-image-container {
          width: 45%;
        }

        .story-image-wrapper {
          width: 100%;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 6px solid var(--white);
        }

        .story-image {
          object-fit: cover;
          width: 100%;
          height: auto;
        }

        .story-content {
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .story-meta {
          font-size: 11px;
          color: var(--coral);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .story-title {
          font-size: var(--fs-3xl);
          color: var(--cocoa);
          margin-bottom: 12px;
        }

        .story-divider {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .story-text {
          font-size: var(--fs-base);
          color: var(--cocoa);
          opacity: 0.85;
          margin-bottom: 20px;
          line-height: 1.7;
        }

        .story-signature {
          margin-top: 20px;
        }

        .signature-img {
          object-fit: contain;
          opacity: 0.9;
        }

        @media (max-width: 1024px) {
          .story-inner {
            gap: 40px;
          }
          
          .story-title {
            font-size: var(--fs-2xl);
          }
        }

        @media (max-width: 768px) {
          .story-inner {
            flex-direction: column;
            gap: 40px;
          }

          .story-image-container {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }

          .story-content {
            width: 100%;
            align-items: center;
            text-align: center;
          }

          .story-signature {
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
