"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { CartProvider, useCart } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import CartBag from "@/components/CartBag";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = { id: number; slug: string; name: string; category: string; priceInr: number; image: string; description: string; stockQuantity: number };

const fallback: Product[] = [
  ["Daisy Market Tote", "daisy-market-tote", "Handmade · Crochet Bag", 5200, "daisy_market_tote.png"],
  ["Blush Bunny", "blush-bunny", "Handmade · Amigurumi", 2850, "blush_bunny.png"],
  ["Vintage Square Blanket", "vintage-square-blanket", "Handmade · Crochet Blanket", 8200, "vintage_square_blanket.png"],
  ["The Cozy Beanie", "the-cozy-beanie", "Handmade · Wearable", 3200, "the_cozy_beanie.png"],
  ["Paranda", "paranda", "Hair & Fashion Accessories", 250, "paranda.png"],
  ["Evil Eye", "evil-eye", "Keychains & Charms", 250, "evil_eye.png"],
  ["3 Musketeers Mushroom", "3-musketeers-mushroom", "Keychains & Charms", 250, "three_musketeers_mushroom.png"],
  ["Red Cherry", "red-cherry", "Keychains & Charms", 250, "red_cherry.png"],
].map(([name, slug, category, priceInr, image], index) => ({ id: index + 1, name: String(name), slug: String(slug), category: String(category), priceInr: Number(priceInr), image: `/assets/02_website_assets/product_images/${image}`, description: "Thoughtfully handmade with soft yarn and careful attention to every stitch. A one-of-a-kind piece made to bring warmth and character to your everyday life.", stockQuantity: index < 4 ? 0 : 5 }));

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <CartProvider><Header /><ProductDetail slug={params.slug} /><Footer /><CartDrawer /><CartBag /></CartProvider>;
}

function ProductDetail({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(fallback.find((item) => item.slug === slug) ?? null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    client.from("products").select("id, name, slug, category, price_inr, image_url, description, stock_quantity").eq("is_active", true).then(({ data }) => {
      if (!data?.length) return;
      const products = data.map((item) => ({ id: item.id, name: item.name, slug: item.slug, category: item.category, priceInr: item.price_inr, image: item.image_url || fallback[0].image, description: item.description || fallback[0].description, stockQuantity: item.stock_quantity }));
      setProduct(products.find((item) => item.slug === slug) ?? product);
      setRecommended(products.filter((item) => item.slug !== slug).slice(0, 3));
    });
  }, [slug]);

  if (!product) return <main className="product-not-found"><h1>Piece not found</h1><Link href="/shop">Back to shop</Link></main>;
  const add = () => { addItem({ id: product.id, name: product.name, priceInr: product.priceInr, image: product.image, stockQuantity: product.stockQuantity }); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  const suggestions = recommended.length ? recommended : fallback.filter((item) => item.slug !== slug).slice(0, 3);
  return <main className="product-page"><header className="product-top"><Link href="/shop"><ArrowLeft size={15} /> Back to shop</Link></header><div className="product-layout"><div className="product-image-panel"><Image src={product.image} alt={product.name} width={900} height={1100} unoptimized={product.image.startsWith("http")} /></div><section className="product-copy"><p className="product-category">{product.category}</p><h1>{product.name}</h1><p className="product-price">₹{product.priceInr.toLocaleString("en-IN")}</p><div className="product-rule" /><p className="product-dimension">Made with care · Handmade in India</p><p className="product-description">{product.description}</p><div className="product-actions">{product.stockQuantity > 0 ? <button className="btn btn-primary" onClick={add}><ShoppingBag size={17} /> {added ? "Added to your bag" : "Add to bag"}</button> : <p className="product-unavailable">Currently made to order. Contact us to request this piece.</p>}</div></section><aside className="recommended"><h2>Recommended products</h2>{suggestions.map((item) => <Link href={`/shop/${item.slug}`} className="recommended-item" key={item.id}><Image src={item.image} alt="" width={90} height={110} unoptimized={item.image.startsWith("http")} /><span><strong>{item.name}</strong><small>₹{item.priceInr.toLocaleString("en-IN")}</small></span></Link>)}</aside></div><style jsx>{`.product-page{min-height:100vh;background:var(--cream);padding:28px 5vw 90px;color:var(--cocoa)}.product-top{max-width:1240px;margin:0 auto 38px}.product-top a{display:inline-flex;align-items:center;gap:6px;color:var(--cocoa);font-size:14px}.product-layout{display:grid;grid-template-columns:minmax(260px,420px) minmax(280px,1fr) minmax(220px,320px);gap:54px;max-width:1240px;margin:auto;align-items:start}.product-image-panel{background:var(--white);border:1px solid rgba(75,58,50,.1);padding:14px}.product-image-panel img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}.product-copy{padding-top:38px}.product-category{margin:0 0 16px;color:var(--coral);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.product-copy h1{margin:0;font:700 clamp(34px,4vw,56px) var(--font-playfair),Georgia,serif;line-height:1.08}.product-price{margin:20px 0;font:700 24px var(--font-playfair),Georgia,serif}.product-rule{height:1px;background:rgba(75,58,50,.2)}.product-dimension{margin:25px 0 16px;font-size:14px}.product-description{max-width:500px;color:rgba(75,58,50,.75);line-height:1.8}.product-actions{margin-top:32px}.product-actions button{display:inline-flex;align-items:center;gap:8px}.product-unavailable{color:var(--coral);font-size:14px;line-height:1.6}.recommended{padding-top:38px}.recommended h2{margin:0 0 14px;padding-bottom:12px;border-bottom:2px solid var(--cocoa);font:700 20px var(--font-playfair),Georgia,serif}.recommended-item{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid rgba(75,58,50,.14);color:var(--cocoa)}.recommended-item img{width:74px;height:88px;object-fit:cover}.recommended-item span{display:grid;gap:6px}.recommended-item strong{font:700 16px var(--font-playfair),Georgia,serif}.recommended-item small{font-size:13px}@media(max-width:900px){.product-layout{grid-template-columns:minmax(240px,400px) 1fr;gap:30px}.recommended{grid-column:1/-1;padding-top:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.recommended h2{grid-column:1/-1}.recommended-item{border:0;background:var(--white);padding:10px}}@media(max-width:600px){.product-page{padding:22px 18px 70px}.product-layout{display:block}.product-copy{padding-top:28px}.recommended{display:block;margin-top:45px}.recommended-item{background:transparent;padding:14px 0}}`}</style></main>;
}
