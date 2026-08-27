"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  // Custom Instagram SVG Icon
  const InstagramIcon = ({ size = 18 }: { size?: number }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );

  return (
    <footer className="footer-section">
      <div className="container footer-inner">
        {/* Grid Columns */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo-container">
              <Image
                src="/assets/logos/footer_seal_transparent.png"
                alt="THE YARN SIDE Seal"
                width={80}
                height={80}
                className="footer-seal"
              />
              <div>
                <h2 className="footer-brand-name text-serif">THE YARN SIDE</h2>
                <span className="footer-tagline tagline">May the yarn be with you.</span>
              </div>
            </div>
            <p className="footer-desc text-sans">
              Timeless crochet pieces made with heart, inspired by coziness and crafted for your everyday comfort.
            </p>
          </div>

          {/* Column 2: Shop Links */}
          <div className="footer-col links-col">
            <h3 className="footer-title text-serif">Shop</h3>
            <ul className="footer-links">
              <li><Link href="/shop" className="footer-link">All Products</Link></li>
              <li><Link href="/shop?category=accessories-gifts" className="footer-link">Accessories & Gifts</Link></li>
              <li><Link href="/shop?category=amigurumi" className="footer-link">Amigurumi</Link></li>
              <li><Link href="/shop?category=wearables" className="footer-link">Wearables</Link></li>
              <li><Link href="/shop?category=home-decor" className="footer-link">Home Decor</Link></li>
            </ul>
          </div>

          {/* Column 3: About Links */}
          <div className="footer-col links-col">
            <h3 className="footer-title text-serif">About</h3>
            <ul className="footer-links">
              <li><Link href="/#about" className="footer-link">Our Story</Link></li>
              <li><Link href="/#sustainability" className="footer-link">Sustainability</Link></li>
              <li><Link href="/care-guide" className="footer-link">Care Guide</Link></li>
              <li><Link href="/policies/returns-refunds" className="footer-link">Returns & Refunds</Link></li>
              <li><Link href="/#custom-orders" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col newsletter-col">
            <Newsletter />
          </div>
        </div>

        {/* Bottom footer area */}
        <div className="footer-bottom">
          <p className="footer-copy text-sans">
            &copy; {new Date().getFullYear()} <strong>THE YARN SIDE</strong>. All rights reserved. 
            <span className="tagline italic footer-tagline-text"> May the yarn be with you.</span>
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/theyarnside.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link touch-target"
              aria-label="Instagram"
            >
              <InstagramIcon size={23} />
            </a>
            <a
              href="mailto:support@theyarnside.in"
              className="footer-social-link touch-target"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          background-color: var(--sage);
          color: var(--white);
          padding: 52px 0 28px 0;
          border-top: 1px solid rgba(75, 58, 50, 0.08);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 40px;
          margin-bottom: 38px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
        }

        /* Brand Column details */
        .footer-logo-container {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .footer-seal {
          object-fit: contain;
          border-radius: var(--border-radius-round);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer-brand-name {
          font-size: var(--fs-lg);
          color: var(--white);
          letter-spacing: 0.05em;
          margin: 0;
        }

        .footer-tagline {
          font-size: 11px;
          color: var(--cream);
          display: block;
        }

        .footer-desc {
          font-size: var(--fs-sm);
          color: var(--white);
          opacity: 0.85;
          line-height: 1.6;
          max-width: 320px;
        }

        /* Links Column details */
        .footer-title {
          font-size: var(--fs-md);
          color: var(--white);
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          font-family: var(--font-lato), sans-serif;
          font-size: var(--fs-sm);
          color: var(--white);
          opacity: 0.8;
          transition: var(--transition-fast);
          padding: 4px 0;
          display: inline-block;
        }

        .footer-link:hover {
          opacity: 1;
          color: var(--blush);
          transform: translateX(4px);
        }

        /* Bottom Footer Area */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-copy {
          font-size: var(--fs-xs);
          color: var(--white);
          opacity: 0.85;
        }

        .footer-tagline-text {
          color: var(--cream);
          margin-left: 8px;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: var(--white);
          opacity: 0.8;
          transition: var(--transition-fast);
        }

        .footer-social-link:hover {
          color: var(--blush);
          opacity: 1;
          transform: scale(1.1);
        }

        /* Responsive Styles */
        @media (max-width: 991px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-section {
            padding: 44px 0 24px 0;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
            margin-bottom: 28px;
          }

          .brand-col, .links-col, .newsletter-col {
            align-items: center;
            text-align: center;
          }

          .footer-logo-container {
            flex-direction: column;
            gap: 12px;
          }

          .footer-desc {
            max-width: 100%;
          }

          .footer-bottom {
            flex-direction: column-reverse;
            text-align: center;
            gap: 14px;
          }
        }
      `}</style>
    </footer>
  );
}
