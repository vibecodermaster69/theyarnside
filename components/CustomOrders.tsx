"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const INQUIRY_EMAIL = "requests@theyarnside.in";

const categories = [
  { value: "flowers-bouquets", label: "Flowers & Bouquets" },
  { value: "toys-plushies", label: "Toys & Plushies" },
  { value: "keychains-charms", label: "Keychains & Charms" },
  { value: "bags-pouches", label: "Bags & Pouches" },
  { value: "hair-fashion-accessories", label: "Hair & Fashion Accessories" },
  { value: "wearables", label: "Wearables" },
  { value: "home-lifestyle", label: "Home & Lifestyle" },
  { value: "blankets-throws", label: "Blankets & Throws" },
  { value: "baby-kids", label: "Baby & Kids" },
  { value: "gifts", label: "Gifts" },
  { value: "custom-orders", label: "Custom Orders" },
  { value: "others", label: "Others" },
];

export default function CustomOrders() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "flowers-bouquets",
    details: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details) return;
    setBusy(true);
    setError("");

    const categoryLabel =
      categories.find((item) => item.value === formData.category)?.label ??
      formData.category;
    const subject = `Custom crochet inquiry — ${categoryLabel}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Item category: ${categoryLabel}`,
      "",
      "Idea:",
      formData.details,
    ].join("\n");

    // Record it first so the enquiry reaches admin even if the customer never
    // presses send in their mail app.
    try {
      const { error: insertError } = await createSupabaseBrowserClient()
        .from("inquiries")
        .insert({
          customer_name: formData.name,
          email: formData.email,
          category: categoryLabel,
          details: formData.details,
        });
      if (insertError) throw insertError;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save your inquiry. Please try again.",
      );
      setBusy(false);
      return;
    }

    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setBusy(false);
    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      category: "flowers-bouquets",
      details: "",
    });
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
                <h3 className="success-title text-serif">Almost there!</h3>
                <p className="success-text text-sans">
                  Your email app should have opened with your inquiry addressed to{" "}
                  <a href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a> — press send and
                  Anjali will get back to you within 24 to 48 hours to discuss fiber
                  selection and sizing. If nothing opened, write to us at that address
                  directly.
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
                    {categories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
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

                {error && (
                  <p className="form-error" role="alert">{error}</p>
                )}

                <button type="submit" className="btn btn-primary form-submit-btn" disabled={busy}>
                  <Send size={14} className="send-icon" />
                  <span>{busy ? "Sending..." : "Submit Inquiry"}</span>
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

        .form-error {
          margin: 0;
          color: var(--coral);
          font-family: var(--font-lato), sans-serif;
          font-size: 13px;
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
