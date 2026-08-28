"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CatalogueProduct } from "@/lib/catalogue";
import { useCart } from "@/components/CartProvider";
import ColorVariantModal from "@/components/ColorVariantModal";

export default function ProductPageClient({ product, recommended }: { product: CatalogueProduct; recommended: CatalogueProduct[] }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [added, setAdded] = useState(false);
  const [variantOpen, setVariantOpen] = useState(false);
  const add = (variant?: CatalogueProduct["colorVariants"][number]) => {
    if (product.colorVariants.length > 1 && !variant) { setVariantOpen(true); return; }
    const selected = variant ?? product.colorVariants[0];
    if (selected && selected.stockQuantity <= 0) return;
    addItem({ id: product.id, name: product.name, priceInr: product.priceInr, image: selected?.imageUrl || product.image, stockQuantity: product.stockQuantity, colorVariant: selected });
    setVariantOpen(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return (
    <main className="product-page">
      <header className="product-top"><Link href="/shop"><ArrowLeft size={15} /> Back to shop</Link></header>
      <div className="product-layout">
        <div className="product-image-panel"><div className="product-hero-frame"><AnimatePresence initial={false} mode="wait"><motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }}><Image src={selectedImage} alt={product.name} width={900} height={1100} unoptimized={selectedImage.startsWith("http")} priority /></motion.div></AnimatePresence></div><div className="product-thumbnails" aria-label="Product images">{product.imageUrls.map((url, index) => <button type="button" className={selectedImage === url ? "active" : ""} key={`${url}-${index}`} onClick={() => setSelectedImage(url)} aria-label={`View ${product.name} image ${index + 1}`}><Image src={url} alt="" width={86} height={104} unoptimized={url.startsWith("http")} /></button>)}</div></div>
        <section className="product-copy"><p className="product-category">{product.category}</p><h1>{product.name}</h1><p className="product-price">₹{product.priceInr.toLocaleString("en-IN")}</p><div className="product-rule" /><p className="product-dimension">Made with care · Handmade in India</p><p className="product-description">{product.description}</p><div className="product-actions">{product.stockQuantity > 0 && product.stockQuantity <= 5 && <p className="product-stock-note">Only {product.stockQuantity} remaining</p>}{product.stockQuantity > 0 ? <button className="btn btn-primary" onClick={() => add()}><ShoppingBag size={17} /> {added ? "Added to your bag" : "Add to bag"}</button> : <p className="product-unavailable">Currently made to order. <a href={`mailto:orders@theyarnside.in?subject=${encodeURIComponent(`Made to order request: ${product.name}`)}`}>Contact us</a> to request this piece.</p>}</div></section>
        <aside className="recommended"><h2>Recommended products</h2>{recommended.map((item) => <Link href={`/products/${item.slug}`} className="recommended-item" key={item.id}><Image src={item.image} alt={item.name} width={90} height={110} unoptimized={item.image.startsWith("http")} /><span><strong>{item.name}</strong><small>₹{item.priceInr.toLocaleString("en-IN")} · View piece →</small></span></Link>)}</aside>
      </div>
      {variantOpen && <ColorVariantModal productName={product.name} variants={product.colorVariants} onClose={() => setVariantOpen(false)} onSelect={add} />}
      <style jsx>{`
        .product-page{min-height:100vh;background:var(--cream);padding:28px 5vw 90px;color:var(--cocoa)}.product-top{max-width:1240px;margin:0 auto 38px}.product-top a{display:inline-flex;align-items:center;gap:6px;color:var(--cocoa);font-size:14px}.product-layout{display:grid;grid-template-columns:minmax(260px,420px) minmax(280px,1fr) minmax(220px,320px);gap:54px;max-width:1240px;margin:auto;align-items:start}.product-image-panel{background:var(--white);border:1px solid rgba(75,58,50,.1);padding:14px}.product-image-panel img{display:block;width:100%;height:100%;object-fit:cover}.product-thumbnails{display:flex;gap:10px;margin-top:14px;overflow-x:auto}.product-thumbnails button{flex:0 0 72px;padding:3px;border:1px solid rgba(75,58,50,.16);border-radius:8px;background:var(--white);cursor:pointer}.product-thumbnails button.active{border:2px solid var(--coral)}.product-thumbnails button img{display:block;width:100%;height:82px;object-fit:contain}.product-copy{padding-top:38px}.product-category{margin:0 0 16px;color:var(--coral);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.product-copy h1{margin:0;font:700 clamp(34px,4vw,56px) var(--font-playfair),Georgia,serif;line-height:1.08}.product-price{margin:20px 0;font:700 24px var(--font-playfair),Georgia,serif;color:var(--coral)}.product-rule{height:1px;background:rgba(75,58,50,.2)}.product-dimension{margin:25px 0 16px;font-size:14px}.product-description{max-width:500px;color:rgba(75,58,50,.75);line-height:1.8}.product-actions{margin-top:32px}.product-actions button{display:inline-flex;align-items:center;gap:8px}.product-stock-note{margin:0 0 10px;color:var(--coral);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.product-unavailable{color:var(--coral);font-size:14px;line-height:1.6}.recommended{padding-top:38px}.recommended h2{margin:0 0 14px;padding-bottom:12px;border-bottom:2px solid var(--cocoa);font:700 20px var(--font-playfair),Georgia,serif}.recommended-item{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid rgba(75,58,50,.14);color:var(--cocoa)}.recommended-item img{width:74px;height:88px;object-fit:cover}.recommended-item span{display:grid;gap:6px}.recommended-item strong{font:700 16px var(--font-playfair),Georgia,serif}.recommended-item small{font-size:13px;color:var(--coral)}
        @media(max-width:900px){.product-layout{grid-template-columns:minmax(240px,400px) 1fr;gap:30px}.recommended{grid-column:1/-1;padding-top:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.recommended h2{grid-column:1/-1}.recommended-item{border:0;background:var(--white);padding:10px}}@media(max-width:600px){.product-page{padding:22px 18px 70px}.product-layout{display:block}.product-copy{padding-top:28px}.recommended{display:block;margin-top:45px}.recommended-item{background:transparent;padding:14px 0}}
      `}</style>
    </main>
  );
}
