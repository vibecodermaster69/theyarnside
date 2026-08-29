"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ShopByCategory() {
  const categories = [
    {
      title: "Amigurumi",
      image: "/assets/02_website_assets/category_banners/amigurumi.png",
      link: "/shop?category=amigurumi",
    },
    {
      title: "Wearables",
      image: "/assets/02_website_assets/category_banners/wearables.png",
      link: "/shop?category=wearables",
    },
    {
      title: "Home Decor",
      image: "/assets/02_website_assets/category_banners/home_decor.png",
      link: "/shop?category=home-decor",
    },
    {
      title: "Accessories & Gifts",
      image: "/assets/02_website_assets/category_banners/accessories_gifts.png",
      link: "/shop?category=accessories-gifts",
    },
  ];

  return (
    <section id="categories" className="section-padding category-section">
      <div className="container">
        <h2 className="section-title text-serif">Our Specialties</h2>
        <div className="section-subtitle tagline">
          <span className="flourish-heart">♥</span>
          Made one loop at a time
          <span className="flourish-heart">♥</span>
        </div>

        <div className="category-grid">
          {categories.map((cat, index) => (
            <Link href={cat.link} key={index} className="category-card card-hover-lift">
              <div className="category-image-wrapper zoom-container">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={280}
                  height={280}
                  className="category-image zoom-image"
                />
              </div>
              <div className="category-info">
                <h3 className="category-title text-serif">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-section {
          background-color: var(--cream);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .category-card {
          background-color: var(--white);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(75, 58, 50, 0.05);
          display: flex;
          flex-direction: column;
        }

        .category-image-wrapper {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background-color: var(--cream);
          position: relative;
        }

        .category-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .category-info {
          padding: 16px;
          text-align: center;
          background-color: var(--white);
        }

        .category-title {
          font-size: var(--fs-md);
          color: var(--cocoa);
          margin: 0;
          font-weight: 700;
          transition: var(--transition-fast);
        }

        .category-card:hover .category-title {
          color: var(--coral);
        }

        @media (max-width: 991px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .category-section {
            padding: 56px 0 64px;
          }

          .category-section .container {
            padding: 0 16px;
          }

          .category-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .category-card {
            max-width: none;
            margin: 0 auto;
            width: 100%;
            overflow: visible;
            border: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
          }

          .category-info {
            order: -1;
            margin-bottom: 18px;
            padding: 22px 16px;
            border: 1px solid rgba(75, 58, 50, 0.06);
            border-radius: 0;
            box-shadow: var(--shadow-sm);
          }

          .category-image-wrapper {
            aspect-ratio: 1 / 1;
            border-radius: 0;
            box-shadow: var(--shadow-sm);
          }
        }
      `}</style>
    </section>
  );
}
