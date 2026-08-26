"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CartBag() {
  const { itemCount, totalInr, isOpen, lastAddedItem, clearLastAdded, openCart } = useCart();
  const [bump, setBump] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!lastAddedItem) return;
    setBump(false);
    setToastVisible(true);
    const frame = window.requestAnimationFrame(() => setBump(true));
    const toastTimer = window.setTimeout(() => setToastVisible(false), 2600);
    const clearTimer = window.setTimeout(clearLastAdded, 300);
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(toastTimer); window.clearTimeout(clearTimer); };
  }, [clearLastAdded, lastAddedItem]);

  if (!itemCount || isOpen) return null;

  return <>
    <div className={`cart-bag-toast ${toastVisible ? "visible" : ""}`} role="status"><span>✓</span>{lastAddedItem ? `${lastAddedItem.name} added to your bag` : "Added to your bag"}</div>
    <button className={`cart-bag ${bump ? "bump" : ""}`} onClick={openCart} aria-label={`Open shopping bag, ${itemCount} items`}>
      <span className="cart-bag-icon"><svg viewBox="0 0 64 72" aria-hidden="true"><path d="M11 22h42l5 40-5 5H11l-5-5 5-40Z" fill="#fffdf9" stroke="#4b3a32" strokeWidth="3.2" strokeLinejoin="round"/><path d="M18 23c0-14 5-20 14-20s14 6 14 20M18 23c0-11 4-16 9-16s9 5 9 16" fill="none" stroke="#4b3a32" strokeWidth="3.2" strokeLinecap="round"/><path d="M53 22l5 40-12-7-5-33Z" fill="#df7868" opacity=".72"/></svg><img src="/assets/logos/ys-monogram-transparent.png" alt="" /><b>{itemCount > 9 ? "9+" : itemCount}</b></span>
      <span className="cart-bag-copy"><strong>Your bag</strong><small>{itemCount} item{itemCount === 1 ? "" : "s"} · ₹{totalInr.toLocaleString("en-IN")}</small></span><ChevronRight size={18} />
    </button>
    <style jsx global>{`.cart-bag{position:fixed;right:28px;bottom:28px;z-index:1100;display:flex;align-items:center;gap:10px;min-width:188px;padding:10px 13px 10px 10px;border:1px solid rgba(75,58,50,.14);border-radius:18px;background:var(--white);color:var(--cocoa);box-shadow:0 18px 45px rgba(75,58,50,.14);text-align:left;cursor:pointer}.cart-bag-icon{position:relative;display:grid;place-items:center;width:52px;height:58px}.cart-bag-icon svg{display:block;width:52px;height:58px}.cart-bag-icon img{position:absolute;left:13px;top:27px;width:28px;height:19px;object-fit:contain}.cart-bag-icon b{position:absolute;top:-7px;right:-7px;display:grid;place-items:center;min-width:22px;height:22px;padding:0 5px;border:2px solid var(--white);border-radius:999px;background:var(--cocoa);color:var(--white);font-size:11px}.cart-bag-copy{display:grid;gap:1px;flex:1}.cart-bag-copy strong{font:700 17px var(--font-playfair),Georgia,serif}.cart-bag-copy small{color:rgba(75,58,50,.65);font:400 11px var(--font-lato),sans-serif;white-space:nowrap}.cart-bag.bump{animation:cart-bag-bump .55s ease}.cart-bag-toast{position:fixed;right:28px;bottom:104px;z-index:1101;display:flex;align-items:center;gap:10px;max-width:310px;padding:13px 15px;border:1px solid rgba(75,58,50,.13);border-radius:12px;background:var(--white);box-shadow:0 18px 45px rgba(75,58,50,.14);color:var(--cocoa);font:700 13px var(--font-lato),sans-serif;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .25s ease,transform .25s ease}.cart-bag-toast.visible{opacity:1;transform:translateY(0)}.cart-bag-toast span{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--sage);color:var(--white)}@keyframes cart-bag-bump{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-8px) rotate(-3deg)}55%{transform:translateY(2px) rotate(3deg)}75%{transform:translateY(-3px) rotate(-1deg)}}@media(max-width:640px){.cart-bag{right:14px;bottom:14px;min-width:168px}.cart-bag-toast{right:14px;bottom:84px}}`}</style>
  </>;
}
