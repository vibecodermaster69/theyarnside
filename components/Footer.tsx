"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  // Custom Pinterest SVG Icon
  const PinterestIcon = ({ size = 18 }: { size?: number }) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <title>Pinterest</title>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.168 1.777 2.168 2.127 0 3.765-2.244 3.765-5.479 0-2.861-2.06-4.859-4.991-4.859-3.399 0-5.395 2.543-5.395 5.174 0 1.024.395 2.124.89 2.73.098.119.112.224.083.345l-.333 1.36c-.053.22-.172.269-.399.165-1.495-.699-2.43-2.899-2.43-4.664 0-3.794 2.757-7.279 7.942-7.279 4.168 0 7.407 2.97 7.407 6.939 0 4.141-2.61 7.47-6.233 7.47-1.217 0-2.36-.632-2.75-1.378l-.752 2.871c-.272 1.045-1.01 2.355-1.503 3.159 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.987C23.97 5.39 18.592.02 12.017.02z" />
    </svg>
  );

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

  // Custom Facebook SVG Icon
  const FacebookIcon = ({ size = 18 }: { size?: number }) => (
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
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
              <li><Link href="#shop" className="footer-link">All Products</Link></li>
              <li><Link href="#shop?category=accessories-gifts" className="footer-link">Accessories & Gifts</Link></li>
              <li><Link href="#shop?category=amigurumi" className="footer-link">Amigurumi</Link></li>
              <li><Link href="#shop?category=wearables" className="footer-link">Wearables</Link></li>
              <li><Link href="#shop?category=home-decor" className="footer-link">Home Decor</Link></li>
            </ul>
          </div>

          {/* Column 3: About Links */}
          <div className="footer-col links-col">
            <h3 className="footer-title text-serif">About</h3>
            <ul className="footer-links">
              <li><Link href="#about" className="footer-link">Our Story</Link></li>
              <li><Link href="#sustainability" className="footer-link">Sustainability</Link></li>
              <li><Link href="#care" className="footer-link">Care Guide</Link></li>
              <li><Link href="#custom-orders" className="footer-link">Contact</Link></li>
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
              href="https://www.instagram.com/theyarnside.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link touch-target"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link touch-target"
              aria-label="Pinterest"
            >
              <PinterestIcon size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link touch-target"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href="mailto:cozy@theyarnside.com"
              className="footer-social-link touch-target"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          background-color: var(--sage);
          color: var(--white);
          padding: 80px 0 40px 0;
          border-top: 1px solid rgba(75, 58, 50, 0.08);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 40px;
          margin-bottom: 60px;
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
            padding: 60px 0 30px 0;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
            margin-bottom: 40px;
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
            gap: 24px;
          }
        }
      `}</style>
    </footer>
  );
}
