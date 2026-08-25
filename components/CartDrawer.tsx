"use client";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useCart } from "@/components/CartProvider";

const formatInr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function CartDrawer() {
  const { items, totalInr, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [shippingInr, setShippingInr] = useState<number | null>(null), [shippingCourier, setShippingCourier] = useState(""), [shippingEta, setShippingEta] = useState(""), [shippingBusy, setShippingBusy] = useState(false), [shippingError, setShippingError] = useState("");
  const [pinVerified, setPinVerified] = useState(false), [pinBusy, setPinBusy] = useState(false), [pinError, setPinError] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", alternatePhone: "", apartment: "", road: "", landmark: "", pinCode: "", city: "", state: "", notes: "" });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const deliveryAddress = [`Apartment / House: ${form.apartment}`, `Road / Area: ${form.road}`, form.landmark ? `Landmark: ${form.landmark}` : "", `PIN Code: ${form.pinCode}`, `City: ${form.city}`, `State: ${form.state}`, form.alternatePhone ? `Alternate phone: ${form.alternatePhone}` : ""].filter(Boolean).join(", ");
  const giftWrapInr = giftWrap ? 30 : 0;
  const orderTotalInr = totalInr + (shippingInr ?? 0) + giftWrapInr;
  const orderNotes = [form.notes.trim(), giftWrap ? "Gift wrapping requested (+₹30)." : ""].filter(Boolean).join(" ");
  const mailto = useMemo(() => { const lines = items.map((item) => `${item.name} x ${item.quantity} - ${formatInr(item.priceInr * item.quantity)}`); const body = [`Name: ${form.name}`, `Email: ${form.email || "Not provided"}`, `Phone: ${form.phone}`, `Delivery address: ${deliveryAddress}`, `Notes: ${orderNotes || "None"}`, "", "Order:", ...lines, `Items: ${formatInr(totalInr)}`, `Estimated shipping: ${shippingInr === null ? "Not calculated" : formatInr(shippingInr)}`, `Gift wrapping: ${giftWrap ? formatInr(giftWrapInr) : "Not requested"}`, `Estimated total: ${formatInr(orderTotalInr)}`].join("\n"); return `mailto:cozy@theyarnside.com?subject=${encodeURIComponent("New THE YARN SIDE order")}&body=${encodeURIComponent(body)}`; }, [deliveryAddress, form, giftWrap, giftWrapInr, items, orderNotes, orderTotalInr, shippingInr, totalInr]);

  useEffect(() => {
    if (!/^\d{6}$/.test(form.pinCode)) {
      setPinVerified(false);
      setPinError("");
      return;
    }
    const controller = new AbortController();
    setPinBusy(true);
    setPinVerified(false);
    setPinError("");
    fetch(`/api/address/pincode?pincode=${form.pinCode}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "PIN code could not be verified."); return data; })
      .then((data) => { setPinVerified(true); setForm((current) => ({ ...current, city: data.city, state: data.state })); })
      .catch((error) => { if (error.name !== "AbortError") { setPinError(error.message); setForm((current) => ({ ...current, city: "", state: "" })); } })
      .finally(() => setPinBusy(false));
    return () => controller.abort();
  }, [form.pinCode]);

  useEffect(() => {
    if (!checkoutOpen || !pinVerified || !items.length) {
      setShippingInr(null);
      setShippingCourier("");
      setShippingEta("");
      setShippingError("");
      return;
    }
    const controller = new AbortController();
    setShippingBusy(true);
    setShippingError("");
    fetch("/api/shipping/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deliveryPostcode: form.pinCode, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), cartValue: totalInr, cod: false }), signal: controller.signal })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Shipping estimate unavailable."); return data; })
      .then((data) => { setShippingInr(data.shippingInr); setShippingCourier(data.courier); setShippingEta(data.estimatedDays); })
      .catch((error) => { if (error.name !== "AbortError") { setShippingInr(null); setShippingError(error.message); } })
      .finally(() => setShippingBusy(false));
    return () => controller.abort();
  }, [checkoutOpen, form.pinCode, items, pinVerified, totalInr]);

  async function submitOrder(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (!form.apartment.trim()) throw new Error("Please enter your apartment or house number.");
      if (!form.road.trim()) throw new Error("Please enter your road or area.");
      if (!/^\d{10}$/.test(form.phone)) throw new Error("Please enter a valid 10-digit phone number.");
      if (form.alternatePhone && !/^\d{10}$/.test(form.alternatePhone)) throw new Error("Please enter a valid 10-digit alternate phone number.");
      if (!/^\d{6}$/.test(form.pinCode)) throw new Error("Please enter a valid 6-digit PIN code.");
      const { error } = await createSupabaseBrowserClient().rpc("create_order", { p_customer_name: form.name, p_customer_email: form.email || null, p_customer_phone: form.phone, p_delivery_address: deliveryAddress, p_notes: orderNotes || null, p_items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })) });
      if (error) throw error;
      clearCart(); setCheckoutOpen(false); setMessage("Your order request has been sent. We’ll contact you shortly."); window.setTimeout(closeCart, 1800);
    } catch (error) { setMessage(error instanceof Error ? error.message : "We could not send your order request. Please try again."); } finally { setBusy(false); }
  }
  if (!isOpen) return null;
  return <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Shopping cart"><button className="cart-backdrop" onClick={closeCart} aria-label="Close cart" /><aside className="cart-panel">
    <div className="cart-header"><div><p className="cart-eyebrow">THE YARN SIDE</p><h2>Your cart</h2></div><button className="cart-close touch-target" onClick={closeCart} aria-label="Close cart"><X size={22} /></button></div>
    {message && <div className="cart-message"><Check size={18} /><span>{message}</span></div>}
    {!items.length ? <div className="cart-empty"><ShoppingBag size={30} /><p>Your cart is waiting for something cozy.</p><button className="btn btn-secondary" onClick={closeCart}>Continue shopping</button></div> : checkoutOpen ? <form className="checkout-form" onSubmit={submitOrder}>
      <p className="cart-eyebrow">CHECKOUT</p><h3>Tell us where to send it.</h3>
      <label>Name<input required value={form.name} onChange={(e) => update("name", e.target.value)} /></label><label>Email <span>(optional)</span><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
      <div className="phone-grid"><label>Phone<input required type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="10-digit phone number" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} /></label><label>Alternate phone <span>(optional)</span><input type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="10-digit alternate number" value={form.alternatePhone} onChange={(e) => update("alternatePhone", e.target.value.replace(/\D/g, "").slice(0, 10))} /></label></div>
      <div className="address-grid"><label>Apartment / House<input required pattern=".*\S.*" title="Apartment or house is required" value={form.apartment} onChange={(e) => update("apartment", e.target.value)} /></label><label>Road / Area<input required pattern=".*\S.*" title="Road or area is required" value={form.road} onChange={(e) => update("road", e.target.value)} /></label><label>Landmark <span>(optional)</span><input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} /></label><label>PIN Code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" value={form.pinCode} onChange={(e) => update("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} />{pinBusy && <small>Checking PIN code...</small>}{pinError && <small className="shipping-error">{pinError}</small>}{pinVerified && <small className="pin-valid">PIN code verified</small>}</label><label>City<input required readOnly value={form.city} placeholder="Filled from PIN code" /></label><label>State<input required readOnly value={form.state} placeholder="Filled from PIN code" /></label></div>
      <label>Notes <span>(optional)</span><textarea rows={2} value={form.notes} onChange={(e) => update("notes", e.target.value)} /></label><label className="gift-wrap-option"><input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} /><span>Gift wrap this order <small>+₹30</small></span></label><div className="shipping-estimate"><div><span>Items</span><strong>{formatInr(totalInr)}</strong></div><div><span>Estimated shipping</span><strong>{shippingBusy ? "Calculating..." : shippingInr === null ? pinVerified ? "Calculating..." : "Verify PIN code" : formatInr(shippingInr)}</strong></div>{giftWrap && <div><span>Gift wrapping</span><strong>{formatInr(giftWrapInr)}</strong></div>}{shippingCourier && <small>{shippingCourier}{shippingEta ? ` · estimated ${shippingEta} days` : ""}</small>}{shippingError && <small className="shipping-error">{shippingError}</small>}</div><p className="shipping-policy">Once your order has been shipped, it cannot be refunded, returned, or exchanged.</p><div className="checkout-total"><span>Estimated total</span><strong>{formatInr(orderTotalInr)}</strong></div><button className="btn btn-primary" type="submit" disabled={busy || shippingBusy || !pinVerified || shippingInr === null}>{busy ? "Sending..." : "Send order request"}</button><a className="manual-link" href={mailto} onClick={() => { clearCart(); setCheckoutOpen(false); }}>Prefer email? Send manually →</a><button className="back-link" type="button" onClick={() => setCheckoutOpen(false)}>← Back to cart</button>
    </form> : <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-info"><h3>{item.name}</h3><p>{formatInr(item.priceInr)}</p><div className="quantity-controls"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}><Plus size={14} /></button></div></div><button className="remove-item" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button></div>)}</div><div className="cart-summary"><span>Total</span><strong>{formatInr(totalInr)}</strong></div><button className="btn btn-primary checkout-button" onClick={() => setCheckoutOpen(true)}>Continue to checkout</button><button className="clear-button" onClick={clearCart}>Clear cart</button></>}
  </aside><style jsx>{`.cart-layer{position:fixed;inset:0;z-index:1200;display:flex;justify-content:flex-end}.cart-backdrop{position:absolute;inset:0;background:rgba(75,58,50,.38)}.cart-panel{position:relative;width:min(440px,100%);height:100%;overflow-y:auto;padding:28px;background:var(--cream);box-shadow:-8px 0 30px rgba(75,58,50,.12)}.cart-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}.cart-eyebrow{margin:0 0 5px;color:var(--coral);font:700 11px var(--font-lato),sans-serif;letter-spacing:.12em;text-transform:uppercase}.cart-header h2,.checkout-form h3{margin:0;font-size:30px}.cart-close{color:var(--cocoa)}.cart-empty{display:grid;justify-items:center;gap:18px;padding:80px 20px;text-align:center;color:var(--cocoa)}.cart-empty p{margin:0}.cart-items{display:grid;gap:16px}.cart-item{display:flex;align-items:center;gap:12px;padding:12px;background:var(--white);border:1px solid rgba(75,58,50,.08);border-radius:var(--border-radius-md)}.cart-item img{width:68px;height:82px;object-fit:cover;border-radius:8px}.cart-item-info{flex:1;min-width:0}.cart-item-info h3{margin:0 0 4px;font:700 16px var(--font-playfair),Georgia,serif}.cart-item-info p{margin:0 0 10px;font-size:14px}.quantity-controls{display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(75,58,50,.18);border-radius:20px;padding:2px 8px}.quantity-controls button,.remove-item{color:var(--cocoa)}.remove-item{padding:8px}.cart-summary,.checkout-total{display:flex;justify-content:space-between;align-items:center;margin:24px 0 16px;padding-top:18px;border-top:1px solid rgba(75,58,50,.14)}.cart-summary strong,.checkout-total strong{font:700 22px var(--font-playfair),Georgia,serif}.checkout-button{width:100%}.clear-button,.back-link,.manual-link{display:block;margin:14px auto 0;color:var(--cocoa);text-align:center;font-size:13px;text-decoration:underline;text-underline-offset:3px}.checkout-form{display:grid;gap:14px}.checkout-form h3{margin-bottom:8px;font-size:25px}.checkout-form label{display:grid;gap:5px;font:700 12px var(--font-lato),sans-serif;text-transform:uppercase;letter-spacing:.04em}.checkout-form label span{font-weight:400;text-transform:none;letter-spacing:0}.checkout-form input,.checkout-form textarea{width:100%;padding:11px 12px;border:1px solid rgba(75,58,50,.18);border-radius:8px;background:var(--white);color:var(--cocoa);font:400 15px var(--font-lato),sans-serif;resize:vertical}.checkout-form input:focus,.checkout-form textarea:focus{outline:2px solid rgba(224,122,105,.3);border-color:var(--coral)}.address-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.cart-message{display:flex;gap:10px;padding:14px;margin-bottom:18px;background:var(--sage-light);border-left:3px solid var(--sage);font-size:14px}@media(max-width:480px){.cart-panel{padding:22px 18px}.address-grid{grid-template-columns:1fr}}`}</style></div>;
}
