"use client";

import React, { FormEvent, useState } from "react";
import { Check, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type RequestProduct = { id: number; name: string; priceInr: number };

const timeframes = [
  { value: "2_weeks", label: "In about 2 weeks" },
  { value: "3_weeks", label: "In about 3 weeks" },
  { value: "4_weeks", label: "In about 4 weeks" },
  { value: "5_weeks", label: "In about 5 weeks" },
  { value: "take_your_time", label: "Take your time — no hurry" },
];

export default function RequestOrderModal({ product, onClose }: { product: RequestProduct; onClose: () => void }) {
  const [form, setForm] = useState({ quantity: 1, name: "", phone: "", address: "", budget: product.priceInr, timeframe: "2_weeks", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submitRequest(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: insertError } = await supabase.from("order_requests").insert({
        product_name: product.name,
        quantity: Number(form.quantity),
        customer_name: form.name,
        phone: form.phone,
        shipping_address: form.address,
        budget_inr: Number(form.budget),
        timeframe: form.timeframe,
        notes: form.notes || null,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not save your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="request-layer" role="dialog" aria-modal="true" aria-labelledby="request-order-title">
      <button className="request-backdrop" onClick={onClose} aria-label="Close request form" />
      <section className="request-modal">
        <button className="request-close touch-target" onClick={onClose} aria-label="Close request form"><X size={21} /></button>
        {submitted ? (
          <div className="request-success"><Check size={34} /><p className="request-eyebrow">REQUEST RECEIVED</p><h2 id="request-order-title">We’ll make it cozy.</h2><p>Thank you for requesting <strong>{product.name}</strong>. We’ll contact you shortly to confirm the price, timing, and details.</p><button className="btn btn-primary" onClick={onClose}>Done</button></div>
        ) : (
          <form className="request-form" onSubmit={submitRequest}>
            <p className="request-eyebrow">REQUEST ORDER</p>
            <h2 id="request-order-title">{product.name}</h2>
            <p className="request-intro">This piece is made to order. Please share a few details and we’ll confirm everything with you.</p>
            <div className="request-grid">
              <label>Quantity<input type="number" min="1" required value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} /></label>
              <label>Budget (INR)<input type="number" min="0" required value={form.budget} onChange={(event) => setForm({ ...form, budget: Number(event.target.value) })} /></label>
            </div>
            <label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label>Phone number<input type="tel" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <label>Shipping address<textarea required rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
            <label>When would you like it?<select value={form.timeframe} onChange={(event) => setForm({ ...form, timeframe: event.target.value })}>{timeframes.map((timeframe) => <option key={timeframe.value} value={timeframe.value}>{timeframe.label}</option>)}</select></label>
            <label>Anything else? <span>(optional)</span><textarea rows={2} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            {error && <p className="request-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending request..." : "Send request"}</button>
          </form>
        )}
      </section>
      <style jsx>{`
        .request-layer { position: fixed; inset: 0; z-index: 1250; display: grid; place-items: center; padding: 20px; }
        .request-backdrop { position: absolute; inset: 0; background: rgba(75,58,50,.42); }
        .request-modal { position: relative; width: min(560px, 100%); max-height: min(740px, 100%); overflow-y: auto; padding: 34px; background: var(--cream); border: 1px solid rgba(75,58,50,.12); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md); }
        .request-close { position: absolute; top: 16px; right: 16px; color: var(--cocoa); }
        .request-form, .request-success { display: grid; gap: 13px; }
        .request-eyebrow { margin: 0; color: var(--coral); font: 700 11px var(--font-lato), sans-serif; letter-spacing: .12em; text-transform: uppercase; }
        .request-form h2, .request-success h2 { margin: 0; font-size: 30px; }
        .request-intro, .request-success p { margin: 0; color: rgba(75,58,50,.8); font-size: 14px; line-height: 1.55; }
        .request-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
        .request-form label { display: grid; gap: 5px; font: 700 12px var(--font-lato), sans-serif; text-transform: uppercase; letter-spacing: .04em; }
        .request-form label span { font-weight: 400; text-transform: none; letter-spacing: 0; }
        .request-form input, .request-form textarea, .request-form select { width: 100%; padding: 11px 12px; border: 1px solid rgba(75,58,50,.18); border-radius: 8px; background: var(--white); color: var(--cocoa); font: 400 15px var(--font-lato), sans-serif; resize: vertical; }
        .request-form input:focus, .request-form textarea:focus, .request-form select:focus { outline: 2px solid rgba(224,122,105,.3); border-color: var(--coral); }
        .request-error { margin: 0; padding: 10px 12px; color: #8c3025; background: #f9e3de; font-size: 13px; }
        .request-success { justify-items: center; text-align: center; padding: 50px 12px 25px; }
        .request-success > svg { color: var(--sage); }
        @media (max-width: 520px) { .request-modal { padding: 28px 20px; } .request-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
