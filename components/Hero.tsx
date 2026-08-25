"use client";

import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-inner">
        {/* Left Column: Text Content */}
        <div className="hero-content">
          <h1 className="hero-title text-serif">
            Come to the <br className="hide-mobile" />
            cozy side.
          </h1>
          
          <div className="hero-tagline-container">
            <span className="hero-line"></span>
            <p className="hero-tagline tagline">May the yarn be with you.</p>
            <span className="hero-heart">♥</span>
            <span className="hero-line"></span>
          </div>

          <p className="hero-description text-sans">
            Thoughtfully sourced fibers, crafted one loop at a time. Discover 
            timeless crochet pieces designed to bring warmth, texture, and a 
            touch of elegance into your everyday life.
          </p>

          <div className="hero-actions">
            <a href="/shop" className="btn btn-primary hero-btn">
              Shop Handmade
            </a>
            <a href="#categories" className="btn btn-secondary hero-btn">
              Browse Categories
            </a>
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="hero-image-container">
          <div className="hero-image-wrapper zoom-container">
            <Image
              src="/assets/02_website_assets/website_banner.png"
              alt="THE YARN SIDE — Handmade crochet blankets and cozy coffee scene"
              width={640}
              height={480}
              priority
              className="hero-image zoom-image"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 60px 0;
          background-color: var(--cream);
          overflow: hidden;
        }

        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }

        .hero-content {
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-title {
          font-size: var(--fs-4xl);
          line-height: 1.15;
          color: var(--cocoa);
          margin-bottom: 24px;
        }

        .hero-tagline-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .hero-line {
          height: 1px;
          width: 40px;
          background-color: var(--sage);
          opacity: 0.6;
        }

        .hero-tagline {
          font-size: var(--fs-md);
          color: var(--cocoa);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .hero-heart {
          color: var(--coral);
          font-size: 14px;
        }

        .hero-description {
          font-size: var(--fs-base);
          color: var(--cocoa);
          opacity: 0.85;
          margin-bottom: 36px;
          max-width: 480px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          width: 100%;
        }

        .hero-btn {
          min-width: 180px;
        }

        /* Right Column Image */
        .hero-image-container {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-wrapper {
          width: 100%;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 6px solid var(--white); /* Premium border style matching the boutique character */
        }

        .hero-image {
          object-fit: cover;
          width: 100%;
          height: auto;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: var(--fs-3xl);
          }
          
          .hero-inner {
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 0;
          }

          .hero-inner {
            flex-direction: column;
            gap: 48px;
          }

          .hero-content {
            width: 100%;
            align-items: center;
            text-align: center;
          }

          .hero-title {
            font-size: var(--fs-2xl);
            margin-bottom: 16px;
          }

          .hero-tagline-container {
            justify-content: center;
            margin-bottom: 24px;
          }

          .hero-line {
            width: 24px;
          }

          .hero-description {
            margin-bottom: 30px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 12px;
          }

          .hero-btn {
            width: 100%;
            max-width: 320px;
          }

          .hero-image-container {
            width: 100%;
          }
          
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
