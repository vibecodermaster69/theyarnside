"use client";

import React from "react";
import { Heart, Package, Venus, Leaf } from "lucide-react";

export default function BrandValueStrip() {
  const values = [
    {
      icon: <Heart size={24} strokeWidth={1.5} className="value-icon" />,
      text: "Handmade with love",
    },
    {
      icon: <Package size={24} strokeWidth={1.5} className="value-icon" />,
      text: "Small batch & unique",
    },
    {
      icon: <Venus size={24} strokeWidth={1.5} className="value-icon" />,
      text: "Woman owned & operated",
    },
    {
      icon: <Leaf size={24} strokeWidth={1.5} className="value-icon" />,
      text: "Thoughtfully sourced",
    },
  ];

  return (
    <section className="value-strip">
      <div className="container strip-inner">
        {values.map((item, index) => (
          <div key={index} className="value-item">
            <div className="icon-wrapper">{item.icon}</div>
            <span className="value-text text-sans">{item.text}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .value-strip {
          background-color: var(--cream);
          border-top: 1px solid rgba(75, 58, 50, 0.06);
          border-bottom: 1px solid rgba(75, 58, 50, 0.06);
          padding: 32px 0;
        }

        .strip-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .value-item {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          justify-content: center;
          min-width: 220px;
        }

        .icon-wrapper {
          color: var(--coral);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--border-radius-round);
          background-color: rgba(224, 122, 105, 0.06);
        }

        .value-text {
          font-family: var(--font-lato), sans-serif;
          font-weight: 700;
          font-size: var(--fs-sm);
          color: var(--cocoa);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        @media (max-width: 991px) {
          .value-item {
            min-width: 40%;
          }
        }

        @media (max-width: 576px) {
          .value-strip {
            padding: 24px 0;
          }
          
          .strip-inner {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
            padding-left: 20px;
          }

          .value-item {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
