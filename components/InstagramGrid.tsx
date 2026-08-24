"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase";
// Custom Instagram SVG Icon
const InstagramIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function InstagramGrid() {
  const posts = [
    {
      image: "/assets/03_instagram_kit/ig_feed_post.png",
      link: "https://www.instagram.com/theyarnside.co/",
      alt: "Handmade crochet bag detail",
    },
    {
      image: "/assets/03_instagram_kit/ig_carousel_cover.png",
      link: "https://www.instagram.com/theyarnside.co/",
      alt: "Crochet stitches and guides",
    },
    {
      image: "/assets/03_instagram_kit/ig_reel_cover.png",
      link: "https://www.instagram.com/theyarnside.co/",
      alt: "Crochet amigurumi bunny process",
    },
    {
      image: "/assets/03_instagram_kit/highlight_covers/behind_the_scenes.png",
      link: "https://www.instagram.com/theyarnside.co/",
      alt: "Studio workspace with yarn",
    },
    {
      image: "/assets/03_instagram_kit/highlight_covers/custom_orders.png",
      link: "https://www.instagram.com/theyarnside.co/",
      alt: "Custom ordered crochet blanket",
    },
    {
      image: "/assets/03_instagram_kit/highlight_covers/yarn_love.png",
      link: "https://www.instagram.com/theyarnside.co/",
      alt: "Colorful natural cotton yarn balls",
    },
  ];
  const [postLinks, setPostLinks] = useState(posts.map((post) => post.link));

  useEffect(() => {
    let client;
    try {
      client = createSupabaseBrowserClient();
    } catch {
      return;
    }

    client
      .from("site_settings")
      .select("value")
      .eq("key", "instagram_links")
      .maybeSingle()
      .then(({ data }) => {
        if (Array.isArray(data?.value)) {
          setPostLinks(data.value.filter((link): link is string => typeof link === "string"));
        }
      });
  }, []);

  return (
    <section id="journal" className="section-padding instagram-section">
      <div className="container">
        <h2 className="section-title text-serif">Behind the Loops</h2>
        <div className="section-subtitle tagline">
          <span className="flourish-heart">♥</span>
          Follow our daily loops on Instagram <a href="https://www.instagram.com/theyarnside.co/" target="_blank" rel="noopener noreferrer" className="ig-handle">@theyarnside.co</a>
          <span className="flourish-heart">♥</span>
        </div>

        <div className="instagram-grid">
          {posts.map((post, index) => (
            <a
              href={postLinks[index] || post.link}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-item zoom-container"
              aria-label={`View Instagram post: ${post.alt}`}
            >
              <Image
                src={post.image}
                alt={post.alt}
                width={200}
                height={200}
                className="instagram-image zoom-image"
              />
              <div className="instagram-overlay">
                <InstagramIcon size={20} className="overlay-icon" />
                <span className="overlay-text text-sans">View Post</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .instagram-section {
          background-color: var(--white);
          border-bottom: 1px solid rgba(75, 58, 50, 0.05);
        }

        .ig-handle {
          color: var(--coral);
          font-weight: 700;
          border-bottom: 1.5px solid transparent;
        }

        .ig-handle:hover {
          border-bottom-color: var(--coral);
        }

        .instagram-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .instagram-item {
          display: block;
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(75, 58, 50, 0.03);
          background-color: var(--cream);
        }

        .instagram-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        /* Hover Overlay */
        .instagram-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(75, 58, 50, 0.6);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--white);
          transition: opacity var(--transition-fast);
          z-index: 5;
        }

        .instagram-item:hover .instagram-overlay {
          opacity: 1;
        }

        .overlay-icon {
          transform: translateY(10px);
          transition: transform var(--transition-fast);
        }

        .overlay-text {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
          transform: translateY(10px);
          transition: transform var(--transition-fast) 50ms;
        }

        .instagram-item:hover .overlay-icon,
        .instagram-item:hover .overlay-text {
          transform: translateY(0);
        }

        @media (max-width: 991px) {
          .instagram-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 576px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
