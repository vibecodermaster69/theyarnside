"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useCart } from "@/components/CartProvider";

const formatInr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function CartDrawer() {
  const { items, totalInr, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });

  const mailto = useMemo(() => {
    const lines = items.map((item) => `${item.name} × ${item.quantity} — ${formatInr(item.priceInr * item.quantity)}`);
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email || "Not provided"}`,
      `Phone: ${form.phone}`,
      `Delivery address: ${form.address}`,
      `Notes: ${form.notes || "None"}`,
      "",
      "Order:",
      ...lines,
      `Total: ${formatInr(totalInr)}`,
    ].join("\n");
    return `mailto:cozy@theyarnside.com?subject=${encodeURIComponent("New THE YARN SIDE order")}&body=${encodeURIComponent(body)}`;
  }, [form, items, totalInr]);

  async function submitOrder(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: order, error: orderError } = await supabase.from("orders").insert({
        customer_name: form.name,
        customer_email: form.email || null,
        customer_phone: form.phone,
        delivery_address: form.address,
        notes: form.notes || null,
        total_inr: totalInr,
      }).select("id").single();

      if (orderError || !order) throw orderError ?? new Error("Order could not be created.");

      const { error: itemsError } = await supabase.from("order_items").insert(items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price_inr: item.priceInr,
      })));
      if (itemsError) throw itemsError;

      clearCart();
      setCheckoutOpen(false);
      setMessage("Thank you — your order request has been received. We’ll contact you shortly to confirm payment and delivery.");
    } catch {
      setMessage("Your order is ready. Please send it by email so we can confirm payment and delivery details.");
    } finally {
      setBusy(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="cart-backdrop" onClick={closeCart} aria-label="Close cart" />
      <aside className="cart-panel">
        <div className="cart-header">
          <div><p className="cart-eyebrow">THE YARN SIDE</p><h2>Your cart</h2></div>
          <button className="cart-close touch-target" onClick={closeCart} aria-label="Close cart"><X size={22} /></button>
        </div>

        {message && <div className="cart-message"><Check size={18} /><span>{message}</span></div>}

        {!items.length ? (
          <div className="cart-empty"><ShoppingBag size={30} /><p>Your cart is waiting for something cozy.</p><button className="btn btn-secondary" onClick={closeCart}>Continue shopping</button></div>
        ) : checkoutOpen ? (
          <form className="checkout-form" onSubmit={submitOrder}>
            <p className="cart-eyebrow">CHECKOUT</p>
            <h3>Tell us where to send it.</h3>
            <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label>Email <span>(optional)</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label>Phone<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <label>Delivery address<textarea required rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
            <label>Notes <span>(optional)</span><textarea rows={2} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            <div className="checkout-total"><span>Total</span><strong>{formatInr(totalInr)}</strong></div>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending..." : "Send order request"}</button>
            <a className="manual-link" href={mailto} onClick={() => { clearCart(); setCheckoutOpen(false); }}>Prefer email? Send manually →</a>
            <button className="back-link" type="button" onClick={() => setCheckoutOpen(false)}>← Back to cart</button>
          </form>
        ) : (
          <>
            <div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div className="cart-item-info"><h3>{item.name}</h3><p>{formatInr(item.priceInr)}</p><div className="quantity-controls"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}><Plus size={14} /></button></div></div>
              <button className="remove-item" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button>
            </div>)}</div>
            <div className="cart-summary"><span>Total</span><strong>{formatInr(totalInr)}</strong></div>
            <button className="btn btn-primary checkout-button" onClick={() => setCheckoutOpen(true)}>Continue to checkout</button>
            <button className="clear-button" onClick={clearCart}>Clear cart</button>
          </>
        )}
      </aside>
      <style jsx>{`
        .cart-layer { position: fixed; inset: 0; z-index: 1200; display: flex; justify-content: flex-end; }
        .cart-backdrop { position: absolute; inset: 0; background: rgba(75,58,50,.38); cursor: default; }
        .cart-panel { position: relative; width: min(440px, 100%); height: 100%; overflow-y: auto; padding: 28px; background: var(--cream); box-shadow: -8px 0 30px rgba(75,58,50,.12); }
        .cart-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
        .cart-eyebrow { margin: 0 0 5px; color: var(--coral); font: 700 11px var(--font-lato), sans-serif; letter-spacing: .12em; text-transform: uppercase; }
        .cart-header h2, .checkout-form h3 { margin: 0; font-size: 30px; }
        .cart-close { color: var(--cocoa); }
        .cart-empty { display: grid; justify-items: center; gap: 18px; padding: 80px 20px; text-align: center; color: var(--cocoa); }
        .cart-empty p { margin: 0; }
        .cart-items { display: grid; gap: 16px; }
        .cart-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--white); border: 1px solid rgba(75,58,50,.08); border-radius: var(--border-radius-md); }
        .cart-item img { width: 68px; height: 82px; object-fit: cover; border-radius: 8px; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-info h3 { margin: 0 0 4px; font: 700 16px var(--font-playfair), Georgia, serif; }
        .cart-item-info p { margin: 0 0 10px; font-size: 14px; }
        .quantity-controls { display: inline-flex; align-items: center; gap: 10px; border: 1px solid rgba(75,58,50,.18); border-radius: 20px; padding: 2px 8px; }
        .quantity-controls button, .remove-item { color: var(--cocoa); }
        .remove-item { padding: 8px; }
        .cart-summary, .checkout-total { display: flex; justify-content: space-between; align-items: center; margin: 24px 0 16px; padding-top: 18px; border-top: 1px solid rgba(75,58,50,.14); }
        .cart-summary strong, .checkout-total strong { font: 700 22px var(--font-playfair), Georgia, serif; }
        .checkout-button { width: 100%; }
        .clear-button, .back-link, .manual-link { display: block; margin: 14px auto 0; color: var(--cocoa); text-align: center; font-size: 13px; text-decoration: underline; text-underline-offset: 3px; }
        .checkout-form { display: grid; gap: 14px; }
        .checkout-form h3 { margin-bottom: 8px; font-size: 25px; }
        .checkout-form label { display: grid; gap: 5px; font: 700 12px var(--font-lato), sans-serif; text-transform: uppercase; letter-spacing: .04em; }
        .checkout-form label span { font-weight: 400; text-transform: none; letter-spacing: 0; }
        .checkout-form input, .checkout-form textarea { width: 100%; padding: 11px 12px; border: 1px solid rgba(75,58,50,.18); border-radius: 8px; background: var(--white); color: var(--cocoa); font: 400 15px var(--font-lato), sans-serif; resize: vertical; }
        .checkout-form input:focus, .checkout-form textarea:focus { outline: 2px solid rgba(224,122,105,.3); border-color: var(--coral); }
        .cart-message { display: flex; gap: 10px; padding: 14px; margin-bottom: 18px; background: var(--sage-light); border-left: 3px solid var(--sage); font-size: 14px; }
        @media (max-width: 480px) { .cart-panel { padding: 22px 18px; } }
      `}</style>
    </div>
  );
}
