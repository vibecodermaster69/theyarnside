"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="newsletter-container">
      <h3 className="newsletter-title text-serif">Join Our Community</h3>
      <p className="newsletter-desc text-sans">
        Be the first to know about new arrivals, handmade crochet pieces & cozy things.
      </p>

      {isSubscribed ? (
        <div className="subscribe-success text-sans">
          <Check size={16} className="success-check" />
          <span>Thank you for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
            className="newsletter-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address for newsletter"
          />
          <button type="submit" className="newsletter-btn btn btn-primary">
            Subscribe
          </button>
        </form>
      )}

      <style jsx>{`
        .newsletter-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        .newsletter-title {
          font-size: var(--fs-md);
          color: var(--white);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .newsletter-desc {
          font-size: var(--fs-sm);
          color: var(--white);
          opacity: 0.85;
          margin-bottom: 20px;
          max-width: 320px;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
          width: 100%;
          max-width: 420px;
        }

        .newsletter-input {
          flex-grow: 1;
          padding: 12px 16px;
          border-radius: var(--border-radius-md);
          background-color: var(--white);
          border: 1px solid transparent;
          color: var(--cocoa);
          font-family: var(--font-lato), sans-serif;
          font-size: var(--fs-sm);
          outline: none;
          transition: var(--transition-fast);
          min-height: 44px;
        }

        .newsletter-input:focus {
          box-shadow: 0 0 0 3px rgba(242, 198, 185, 0.4);
        }

        .newsletter-btn {
          padding: 0 20px;
          border-radius: var(--border-radius-md);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: var(--coral);
          color: var(--white);
          transition: var(--transition-fast);
        }

        .newsletter-btn:hover {
          background-color: var(--coral-hover);
        }

        /* Success Message */
        .subscribe-success {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--white);
          background-color: rgba(255, 255, 255, 0.1);
          padding: 10px 16px;
          border-radius: var(--border-radius-md);
          font-size: var(--fs-sm);
          font-weight: 700;
          width: 100%;
        }

        .success-check {
          color: var(--blush);
        }

        @media (max-width: 768px) {
          .newsletter-container {
            align-items: center;
            text-align: center;
          }
          
          .newsletter-form {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
          }

          .newsletter-input {
            width: 100%;
          }

          .newsletter-btn {
            width: 100%;
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
