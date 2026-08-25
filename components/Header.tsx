"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const shopCategories = [
    { label: "Amigurumi", value: "amigurumi" },
    { label: "Wearables", value: "wearables" },
    { label: "Home Decor", value: "home-decor" },
    { label: "Accessories & Gifts", value: "accessories-gifts" },
    { label: "Hair & Fashion Accessories", value: "hair-fashion-accessories" },
    { label: "Keychains & Charms", value: "keychains-charms" },
  ];

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
    <header className="header-container">
      <div className="container header-inner">
        {/* Left Side: Social Media Icons (Desktop only) */}
        <div className="header-socials">
          <a
            href="https://www.instagram.com/theyarnside.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link touch-target"
            aria-label="Instagram"
          >
            <InstagramIcon size={18} />
          </a>
        </div>

        {/* Mobile Menu Toggle Button (Mobile only) */}
        <button
          className="mobile-toggle touch-target"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Center: Brand Logo */}
        <div className="header-logo">
          <Link href="/">
            <Image
              src="/assets/logos/primary_horizontal.png"
              alt="THE YARN SIDE"
              width={240}
              height={62}
              priority
              className="logo-img"
            />
          </Link>
        </div>

        {/* Center-Right: Navigation Links (Desktop only) */}
        <nav className="header-nav">
          <Link href="/" className="nav-link active">Home</Link>
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="#about" className="nav-link">About</Link>
          <Link href="#journal" className="nav-link">Journal</Link>
        </nav>

        {/* Right Side: Utilities (Search, Profile, Cart) */}
        <div className="header-utils">
          <button className="util-button touch-target hide-mobile" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="util-button touch-target hide-mobile" aria-label="Profile">
            <User size={20} />
          </button>
          <button className="util-button touch-target cart-btn" aria-label={`Shopping Cart${itemCount ? `, ${itemCount} items` : ""}`} onClick={openCart}>
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount > 9 ? "9+" : itemCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="drawer-overlay" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="drawer-content">
          <div className="drawer-header">
            <div className="drawer-logo">
              <Image
                src="/assets/logos/primary_horizontal.png"
                alt="THE YARN SIDE"
                width={180}
                height={46}
              />
            </div>
            <button
              className="drawer-close touch-target"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="drawer-nav">
            <Link href="/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/shop" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <div className="drawer-category-list" aria-label="Shop categories">
              {shopCategories.map((category) => (
                <Link
                  key={category.value}
                  href={`/shop?category=${category.value}`}
                  className="drawer-category-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
            </div>
            <Link href="#about" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="#journal" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Journal</Link>
          </nav>

          <div className="drawer-footer">
            <div className="drawer-socials">
              <a href="https://www.instagram.com/theyarnside.co/" target="_blank" rel="noopener noreferrer" className="social-icon-link touch-target">
                <InstagramIcon size={20} />
              </a>
            </div>
            <p className="drawer-tagline">May the yarn be with you.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-container {
          background-color: var(--cream);
          border-bottom: 1px solid rgba(75, 58, 50, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
          height: 90px;
          display: flex;
          align-items: center;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .header-socials {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1 1 auto;
          width: auto;
        }

        .social-icon-link {
          color: var(--cocoa);
          opacity: 0.8;
          transition: var(--transition-fast);
        }

        .social-icon-link:hover {
          color: var(--coral);
          opacity: 1;
          transform: scale(1.08);
        }

        .mobile-toggle {
          display: none;
          color: var(--cocoa);
        }

        .header-logo {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 0 0 240px;
          width: 240px;
          margin-right: 28px;
        }

        .logo-img {
          object-fit: contain;
          max-height: 52px;
          width: auto;
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          width: auto;
          gap: 22px;
        }

        .nav-link {
          font-family: var(--font-lato), sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          font-size: var(--fs-xs);
          letter-spacing: 0.05em;
          color: var(--cocoa);
          position: relative;
          padding: 8px 0;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--coral);
          transition: var(--transition-fast);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--coral);
        }

        .header-utils {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex: 0 0 auto;
          width: auto;
        }

        .util-button {
          color: var(--cocoa);
          transition: var(--transition-fast);
        }

        .util-button:hover {
          color: var(--coral);
        }

        .cart-btn {
          position: relative;
          color: var(--cocoa);
        }

        .cart-btn:hover {
          color: var(--coral);
        }

        .cart-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background-color: var(--coral);
          color: var(--white);
          font-size: 9px;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: var(--border-radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          visibility: hidden;
          transition: visibility var(--transition-normal);
        }

        .mobile-drawer.open {
          visibility: visible;
        }

        .drawer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(75, 58, 50, 0.4);
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .mobile-drawer.open .drawer-overlay {
          opacity: 1;
        }

        .drawer-content {
          position: absolute;
          top: 0;
          left: -320px;
          width: 320px;
          height: 100%;
          background-color: var(--cream);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          padding: 24px;
          overflow-y: auto;
          transition: left var(--transition-normal);
        }

        .mobile-drawer.open .drawer-content {
          left: 0;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex-grow: 1;
        }

        .drawer-category-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: -12px 0 0 16px;
          padding-left: 16px;
          border-left: 1px solid rgba(75, 58, 50, 0.12);
        }

        .drawer-category-link {
          color: var(--cocoa);
          font-size: var(--fs-sm);
          opacity: 0.78;
          padding: 7px 0;
        }

        .drawer-category-link:hover {
          color: var(--coral);
          opacity: 1;
        }

        .drawer-link {
          font-family: var(--font-lato), sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          font-size: var(--fs-md);
          letter-spacing: 0.05em;
          color: var(--cocoa);
          padding: 8px 0;
          border-bottom: 1px solid rgba(75, 58, 50, 0.05);
        }

        .drawer-link:hover {
          color: var(--coral);
          padding-left: 4px;
        }

        .drawer-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid rgba(75, 58, 50, 0.08);
          padding-top: 24px;
        }

        .drawer-socials {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .drawer-tagline {
          font-family: var(--font-lora), Georgia, serif;
          font-style: italic;
          text-align: center;
          font-size: var(--fs-xs);
          color: var(--cocoa);
          opacity: 0.8;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .header-container {
            height: 80px;
          }

          .header-nav {
            gap: 18px;
          }
        }

        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }

          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 20%;
          }

          .header-socials {
            display: none;
          }

          .header-logo {
            flex: 0 0 auto;
            width: 60%;
            margin-right: 0;
            justify-content: center;
          }

          .header-nav {
            display: none;
          }

          .header-utils {
            flex: 0 0 auto;
            width: 20%;
          }
        }
      `}</style>
    </header>
  );
}
