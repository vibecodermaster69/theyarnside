"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { CartProvider, useCart } from "@/components/CartProvider";
import RequestOrderModal from "@/components/RequestOrderModal";
import CartDrawer from "@/components/CartDrawer";
import CartBag from "@/components/CartBag";

type Product = {
  id: number;
  name: string;
  category: string;
  priceInr: number;
  image: string;
  isNew: boolean;
  stockQuantity: number;
};

const fallbackProducts: Product[] = [
  ["Daisy Market Tote", "Handmade • Crochet Bag", 5200, "daisy_market_tote.png"],
  ["Blush Bunny", "Handmade • Amigurumi", 2850, "blush_bunny.png"],
  ["Vintage Square Blanket", "Handmade • Crochet Blanket", 8200, "vintage_square_blanket.png"],
  ["The Cozy Beanie", "Handmade • Wearable", 3200, "the_cozy_beanie.png"],
  ["Paranda", "Hair & Fashion Accessories", 250, "paranda.png"],
  ["Evil Eye", "Keychains & Charms", 250, "evil_eye.png"],
  ["3 Musketeers Mushroom", "Keychains & Charms", 250, "three_musketeers_mushroom.png"],
  ["Red Cherry", "Keychains & Charms", 250, "red_cherry.png"],
].map(([name, category, priceInr, image], index) => ({
  id: index + 1,
  name: name as string,
  category: category as string,
  priceInr: priceInr as number,
  image: `/assets/02_website_assets/product_images/${image}`,
  isNew: index < 4,
  stockQuantity: index < 4 ? 0 : 5,
}));

const categoryLabels: Record<string, string> = {
  amigurumi: "Amigurumi",
  wearables: "Wearables",
  "home-decor": "Home Decor",
  "accessories-gifts": "Accessories & Gifts",
  "hair-fashion-accessories": "Hair & Fashion Accessories",
  "keychains-charms": "Keychains & Charms",
};

function getCategoryKey(category: string) {
  const normalized = category.toLowerCase().replace(/handmade\s*•\s*/, "");
  if (normalized.includes("amigurumi")) return "amigurumi";
  if (normalized.includes("wearable")) return "wearables";
  if (normalized.includes("blanket") || normalized.includes("home")) return "home-decor";
  if (normalized.includes("accessor") || normalized.includes("bag")) return "accessories-gifts";
  if (normalized.includes("keychain") || normalized.includes("charm")) return "keychains-charms";
  return normalized.replace(/\s+/g, "-");
}

export default function ShopPage() {
  return <CartProvider><Suspense fallback={<main className="shop-page" />}><ShopCatalogue /><CartDrawer /><CartBag /></Suspense></CartProvider>;
}

function ShopCatalogue() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [requestProduct, setRequestProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialCategory = searchParams.get("category");
    if (initialCategory) setCategory(initialCategory);
  }, [searchParams]);

  useEffect(() => {
    let client;
    try {
      client = createSupabaseBrowserClient();
    } catch {
      return;
    }

    client
      .from("products")
      .select("id, name, category, price_inr, image_url, is_new, stock_quantity, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data?.length) return;
        setProducts(data.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          priceInr: product.price_inr,
          image: product.image_url || fallbackProducts[0].image,
          isNew: product.is_new,
          stockQuantity: product.stock_quantity,
        })));
      });
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => getCategoryKey(product.category)))), [products]);
  const visibleProducts = useMemo(() => {
    const filtered = category === "all" ? products : products.filter((product) => getCategoryKey(product.category) === category);
    return [...filtered].sort((first, second) => {
      if (sort === "price-low") return first.priceInr - second.priceInr;
      if (sort === "price-high") return second.priceInr - first.priceInr;
      return Number(second.isNew) - Number(first.isNew);
    });
  }, [category, products, sort]);

  useEffect(() => {
    const resetCategoryFromEmptyState = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest(".empty-catalogue a")) setCategory("all");
    };
    document.addEventListener("click", resetCategoryFromEmptyState);
    return () => document.removeEventListener("click", resetCategoryFromEmptyState);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist((current) => current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id]);
  };

  return (
    <main className="shop-page">
      <header className="shop-header">
        <div className="container shop-header-inner">
          <Link href="/" className="shop-back">← Back home</Link>
          <h1 className="text-serif">All Handmade Pieces</h1>
          <p>Browse every crochet creation, made one loop at a time.</p>
        </div>
      </header>

      <section className="section-padding catalogue-section" data-category={category}>
        <div className="container">
          <div className="catalogue-toolbar">
            <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{categoryLabels[item] || item.replaceAll("-", " ")}</option>)}</select></label>
            <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
            <span className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span>
          </div>

          {!visibleProducts.length ? <div className="empty-catalogue"><Image src="/assets/empty-crochet.png" alt="A woman crocheting with soft yarn" width={720} height={480} /><div><p className="empty-eyebrow">A LITTLE MAKING MAGIC</p><h2>Something lovely is crocheting...</h2><p>We’re adding more handmade pieces to this collection. Check back soon or explore the rest of the shop.</p><Link href="/shop" className="btn btn-secondary">Browse all pieces</Link></div></div> : <div className="catalogue-grid">
            {visibleProducts.map((product) => <article className="catalogue-card" key={product.id}>
              <div className="catalogue-image-wrap">
                {product.isNew && <span className="badge badge-new catalogue-badge">New</span>}
                <button className={`wishlist-button touch-target ${wishlist.includes(product.id) ? "active" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={`Add ${product.name} to wishlist`}><Heart size={18} fill={wishlist.includes(product.id) ? "var(--coral)" : "transparent"} color={wishlist.includes(product.id) ? "var(--coral)" : "var(--cocoa)"} /></button>
                <Image src={product.image} alt={product.name} width={600} height={750} unoptimized={product.image.startsWith("http")} />
              </div>
              <div className="catalogue-info"><span className="catalogue-category">{categoryLabels[getCategoryKey(product.category)] || product.category}</span><h2 className="text-serif">{product.name}</h2><div className="catalogue-footer"><strong>₹{product.priceInr.toLocaleString("en-IN")}</strong>{product.stockQuantity > 0 ? <button className="catalogue-action" onClick={() => addItem({ id: product.id, name: product.name, priceInr: product.priceInr, image: product.image, stockQuantity: product.stockQuantity })}><ShoppingBag size={15} /> Add</button> : <button className="catalogue-action request" onClick={() => setRequestProduct(product)}>Request order</button>}</div></div>
            </article>)}
          </div>}
        </div>
      </section>
      {requestProduct && <RequestOrderModal product={{ id: requestProduct.id, name: requestProduct.name, priceInr: requestProduct.priceInr }} onClose={() => setRequestProduct(null)} />}
      <style jsx>{`
        .shop-page { min-height: 100vh; background: var(--cream); }
        .shop-header { padding: 48px 0 42px; border-bottom: 1px solid rgba(75,58,50,.08); }
        .shop-header-inner { text-align: center; }
        .shop-back { display: inline-block; margin-bottom: 24px; color: var(--coral); font-size: var(--fs-sm); font-weight: 700; }
        .shop-header h1 { font-size: var(--fs-3xl); margin-bottom: 8px; }
        .shop-header p { color: rgba(75,58,50,.72); }
        .catalogue-section { background: var(--white); }
        .catalogue-toolbar { display: flex; align-items: end; gap: 16px; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid rgba(75,58,50,.1); }
        .catalogue-toolbar label { display: grid; gap: 6px; color: var(--cocoa); font-size: var(--fs-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
        .catalogue-toolbar select { min-width: 190px; padding: 11px 32px 11px 12px; border: 1px solid rgba(75,58,50,.18); border-radius: 4px; background: var(--cream); font: 400 14px var(--font-lato), sans-serif; text-transform: none; letter-spacing: 0; }
        .result-count { margin-left: auto; color: rgba(75,58,50,.65); font-size: var(--fs-sm); }
        .catalogue-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .catalogue-card { display: flex; flex-direction: column; overflow: hidden; background: var(--cream); border: 1px solid rgba(75,58,50,.08); border-radius: var(--border-radius-md); }
        .catalogue-image-wrap { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--cream); }
        .catalogue-image-wrap > img { width: 100%; height: 100%; object-fit: cover; }
        .catalogue-badge { position: absolute; top: 14px; left: 14px; z-index: 2; }
        .wishlist-button { position: absolute; top: 10px; right: 10px; z-index: 2; background: var(--white); border-radius: 50%; box-shadow: var(--shadow-sm); }
        .wishlist-button.active { color: var(--coral); }
        .catalogue-info { display: flex; flex: 1; flex-direction: column; padding: 16px; background: var(--white); }
        .catalogue-category { min-height: 32px; color: rgba(75,58,50,.6); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
        .catalogue-info h2 { margin: 8px 0 18px; font-size: var(--fs-md); line-height: 1.3; }
        .catalogue-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(75,58,50,.08); }
        .catalogue-footer strong { font: 700 var(--fs-md) var(--font-playfair), Georgia, serif; }
        .catalogue-action { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 38px; padding: 8px 10px; border-radius: 4px; background: var(--coral); color: var(--white); font-size: 11px; font-weight: 700; }
        .catalogue-action.request { background: transparent; border: 1px solid var(--cocoa); color: var(--cocoa); }
        .empty-catalogue { display:grid; grid-template-columns:minmax(260px, 420px) minmax(280px, 440px); align-items:center; justify-content:center; gap:42px; padding:34px 20px 70px; text-align:left; }
        .empty-catalogue img { width:100%; height:auto; border-radius:var(--border-radius-md); }
        .empty-catalogue h2 { margin:8px 0 12px; font:700 clamp(28px, 4vw, 42px) var(--font-playfair), Georgia, serif; color:var(--cocoa); }
        .empty-catalogue p:not(.empty-eyebrow) { max-width:390px; margin:0 0 22px; color:var(--text-muted); line-height:1.7; }
        .empty-eyebrow { margin:0; color:var(--coral); font:700 11px var(--font-lato), sans-serif; letter-spacing:.14em; }
        .catalogue-section[data-category="all"] .empty-catalogue { display:block; padding:60px 0; text-align:center; }
        .catalogue-section[data-category="all"] .empty-catalogue img, .catalogue-section[data-category="all"] .empty-catalogue .empty-eyebrow, .catalogue-section[data-category="all"] .empty-catalogue h2, .catalogue-section[data-category="all"] .empty-catalogue p:not(.empty-eyebrow), .catalogue-section[data-category="all"] .empty-catalogue a { display:none; }
        .catalogue-section[data-category="all"] .empty-catalogue::after { content:"No products are available right now."; color:var(--cocoa); }
        @media (max-width: 700px) { .empty-catalogue { grid-template-columns:1fr; gap:24px; padding-top:20px; text-align:center; } .empty-catalogue img { max-width:480px; margin:auto; } .empty-catalogue p:not(.empty-eyebrow) { margin-left:auto; margin-right:auto; } }
        @media (max-width: 991px) { .catalogue-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px) { .shop-header { padding: 32px 0; } .shop-header h1 { font-size: var(--fs-2xl); } .catalogue-toolbar { align-items: stretch; flex-direction: column; } .catalogue-toolbar select { width: 100%; } .result-count { margin: 0; } .catalogue-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .catalogue-info { padding: 12px; } .catalogue-category { min-height: 42px; font-size: 9px; } .catalogue-footer { align-items: stretch; flex-direction: column; } .catalogue-action { width: 100%; } }
      `}</style>
    </main>
  );
}
