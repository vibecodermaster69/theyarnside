"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function CustomOrders() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "flowers-bouquets",
    details: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.details) {
      setIsSubmitted(true);
      // Clear form
      setFormData({
        name: "",
        email: "",
        category: "bag",
        details: "",
      });
    }
  };

  return (
    <section id="custom-orders" className="section-padding custom-section">
      <div className="container">
        <div className="custom-card">
          {/* Left Column: Promotion */}
          <div className="custom-info-side">
            <span className="custom-meta text-sans">Bespoke Creations</span>
            <h2 className="custom-title text-serif">Got something cozy in mind?</h2>
            
            <p className="custom-text text-sans">
              I love working with clients to bring unique visions to life. If you have 
              a specific color palette, custom size requirements, or an entirely new 
              crochet idea, let’s collaborate to create your perfect piece.
            </p>
            
            <p className="custom-quote tagline italic">
              "We'll sketch, select fibers, and build it together—one loop at a time."
            </p>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="custom-form-side">
            {isSubmitted ? (
              <div className="form-success-container">
                <CheckCircle2 size={48} className="success-icon" />
                <h3 className="success-title text-serif">Inquiry Received!</h3>
                <p className="success-text text-sans">
                  Thank you for reaching out. Anjali will review your request and get back 
                  to you within 24 to 48 hours to discuss fiber selection and sizing.
                </p>
                <button 
                  className="btn btn-secondary btn-sm success-btn" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="custom-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="e.g. Sarah Jenkins"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="e.g. sarah@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">Item Category</label>
                  <select
                    id="category"
                    className="form-input select-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="flowers-bouquets">Flowers &amp; Bouquets</option>
                    <option value="toys-plushies">Toys &amp; Plushies</option>
                    <option value="keychains-charms">Keychains &amp; Charms</option>
                    <option value="bags-pouches">Bags &amp; Pouches</option>
                    <option value="hair-fashion-accessories">Hair &amp; Fashion Accessories</option>
                    <option value="wearables">Wearables</option>
                    <option value="home-lifestyle">Home &amp; Lifestyle</option>
                    <option value="blankets-throws">Blankets &amp; Throws</option>
                    <option value="baby-kids">Baby &amp; Kids</option>
                    <option value="gifts">Gifts</option>
                    <option value="custom-orders">Custom Orders</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="details" className="form-label">Describe your idea</label>
                  <textarea
                    id="details"
                    className="form-input textarea-input"
                    placeholder="What size, colors, or style do you have in mind?"
                    rows={4}
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary form-submit-btn">
                  <Send size={14} className="send-icon" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-section {
          background-color: var(--cream);
        }

        .custom-card {
          background-color: var(--white);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(75, 58, 50, 0.05);
          display: flex;
          overflow: hidden;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Left Side */
        .custom-info-side {
          width: 50%;
          padding: 60px;
          background-color: var(--sage-light);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .custom-meta {
          font-size: 11px;
          color: var(--sage);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .custom-title {
          font-size: var(--fs-2xl);
          line-height: 1.25;
          margin-bottom: 20px;
        }

        .custom-text {
          font-size: var(--fs-base);
          color: var(--cocoa);
          opacity: 0.85;
          margin-bottom: 24px;
        }

        .custom-quote {
          font-size: var(--fs-sm);
          color: var(--cocoa);
          opacity: 0.9;
          border-left: 2px solid var(--coral);
          padding-left: 16px;
        }

        /* Right Side / Form */
        .custom-form-side {
          width: 50%;
          padding: 60px;
          display: flex;
          align-items: center;
        }

        .custom-form {
          width: 100%;
        }

        .select-input {
          cursor: pointer;
        }

        .textarea-input {
          resize: vertical;
          font-family: var(--font-lato), sans-serif;
        }

        .form-submit-btn {
          width: 100%;
          gap: 8px;
        }

        .send-icon {
          margin-top: -2px;
        }

        /* Success Message styling */
        .form-success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          padding: 20px 0;
        }

        .success-icon {
          color: var(--sage);
          margin-bottom: 20px;
        }

        .success-title {
          font-size: var(--fs-xl);
          margin-bottom: 12px;
        }

        .success-text {
          font-size: var(--fs-sm);
          color: var(--cocoa);
          opacity: 0.8;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .success-btn {
          padding: 10px 20px;
          font-size: var(--fs-xs);
          border: 1px solid var(--cocoa);
        }

        @media (max-width: 991px) {
          .custom-card {
            flex-direction: column;
          }

          .custom-info-side {
            width: 100%;
            padding: 40px;
          }

          .custom-form-side {
            width: 100%;
            padding: 40px;
          }
        }

        @media (max-width: 576px) {
          .custom-info-side {
            padding: 30px 20px;
          }

          .custom-form-side {
            padding: 30px 20px;
          }
        }
      `}</style>
    </section>
  );
}
