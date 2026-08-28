"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { CatalogueProduct } from "@/lib/catalogue";
import { useCart } from "@/components/CartProvider";
import RequestOrderModal from "@/components/RequestOrderModal";
import ColorVariantModal from "@/components/ColorVariantModal";

const categoryLabels: Record<string, string> = {
  amigurumi: "Amigurumi", wearables: "Wearables", "home-decor": "Home Decor",
  "accessories-gifts": "Accessories & Gifts", "hair-fashion-accessories": "Hair & Fashion Accessories",
  "keychains-charms": "Keychains & Charms",
};

function getCategoryKey(category: string) {
  const normalized = category.toLowerCase().replace(/handmade\s*[·•]\s*/, "");
  if (normalized.includes("amigurumi")) return "amigurumi";
  if (normalized.includes("wearable")) return "wearables";
  if (normalized.includes("blanket") || normalized.includes("home")) return "home-decor";
  if (normalized.includes("accessor") || normalized.includes("bag")) return "accessories-gifts";
  if (normalized.includes("keychain") || normalized.includes("charm")) return "keychains-charms";
  return normalized.replace(/\s+/g, "-");
}

export default function ShopCatalogueClient({
  products,
  initialCategory,
  initialQuery,
}: {
  products: CatalogueProduct[];
  initialCategory: string;
  initialQuery: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [requestProduct, setRequestProduct] = useState<CatalogueProduct | null>(null);
  const [variantProduct, setVariantProduct] = useState<CatalogueProduct | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const { addItem } = useCart();
  const router = useRouter();

  const categories = useMemo(() => Array.from(new Set(products.map((product) => getCategoryKey(product.category)))), [products]);
  const searchTerms = useMemo(() => query.trim().toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (category !== "all" && getCategoryKey(product.category) !== category) return false;
      if (!searchTerms.length) return true;
      return searchTerms.every((term) => `${product.name} ${product.category}`.toLowerCase().includes(term));
    });
    return [...filtered].sort((first, second) => {
      if (sort === "price-low") return first.priceInr - second.priceInr;
      if (sort === "price-high") return second.priceInr - first.priceInr;
      if (first.isBestSeller !== second.isBestSeller) return Number(second.isBestSeller) - Number(first.isBestSeller);
      return Number(second.isNew) - Number(first.isNew);
    });
  }, [category, products, searchTerms, sort]);

  const clearSearch = () => {
    setQuery("");
    router.push(category === "all" ? "/shop" : `/shop?category=${category}`);
  };

  const addProduct = (product: CatalogueProduct, variant?: CatalogueProduct["colorVariants"][number]) => {
    if (product.colorVariants.length > 1 && !variant) { setVariantProduct(product); return; }
    const selected = variant ?? product.colorVariants[0];
    if (selected && selected.stockQuantity <= 0) return;
    addItem({ id: product.id, name: product.name, priceInr: product.priceInr, image: selected?.imageUrl || product.image, stockQuantity: product.stockQuantity, colorVariant: selected });
    setVariantProduct(null);
  };

  return (
    <main className="shop-page">
      <section className="section-padding catalogue-section" data-category={category}>
        <div className="container">
          <div className="catalogue-toolbar">
            <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{categoryLabels[item] || item.replaceAll("-", " ")}</option>)}</select>
            <select aria-label="Sort by" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
            <span className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}{searchTerms.length ? <> matching <em>&ldquo;{query.trim()}&rdquo;</em><button type="button" className="clear-search" onClick={clearSearch}>Clear <X size={13} /></button></> : null}</span>
          </div>
          {!visibleProducts.length ? (
            <div className="empty-catalogue"><Image src="/assets/empty-crochet.png" alt="A woman crocheting with soft yarn" width={720} height={480} /><div><p className="empty-eyebrow">{searchTerms.length ? "NO MATCHES YET" : "A LITTLE MAKING MAGIC"}</p><h2>{searchTerms.length ? <>Nothing found for &ldquo;{query.trim()}&rdquo;</> : "Something lovely is crocheting..."}</h2><p>{searchTerms.length ? "Try a shorter word, a different spelling, or browse the full collection — new pieces are added often." : "We’re adding more handmade pieces to this collection. Check back soon or explore the rest of the shop."}</p>{searchTerms.length ? <button type="button" className="btn btn-secondary" onClick={clearSearch}>Browse all pieces</button> : <Link href="/shop" className="btn btn-secondary">Browse all pieces</Link>}</div></div>
          ) : <div className="catalogue-grid">{visibleProducts.map((product) => <article className="catalogue-card" key={product.id}><Link href={`/products/${product.slug}`} className="catalogue-card-link" aria-label={`View ${product.name}`} /><div className="catalogue-image-wrap">{product.isNew && <span className="badge badge-new catalogue-badge">New</span>}{product.isBestSeller && <span className={`bestseller-badge ${product.isNew ? "below-new" : ""}`}>BESTSELLER</span>}<Image src={product.image} alt={product.name} width={600} height={750} className="catalogue-image" unoptimized={product.image.startsWith("http")} sizes="(max-width:640px) 50vw, (max-width:991px) 33vw, 25vw" /></div><div className="catalogue-info"><span className="catalogue-category">{categoryLabels[getCategoryKey(product.category)] || product.category}</span><h2 className="text-serif">{product.name}</h2><div className="catalogue-footer"><strong>₹{product.priceInr.toLocaleString("en-IN")}</strong><div className="catalogue-stock">{product.stockQuantity === 0 ? <span className="stock-note out">Out of stock</span> : product.stockQuantity <= 5 ? <span className="stock-note low">Only {product.stockQuantity} remaining</span> : <span className="stock-note in">In stock</span>}{product.stockQuantity > 0 ? <button className="catalogue-action" onClick={() => addProduct(product)}><ShoppingBag size={15} /> Add</button> : <button className="catalogue-action request" onClick={() => setRequestProduct(product)}>Request order</button>}</div></div></div></article>)}</div>}
        </div>
      </section>
      {requestProduct && <RequestOrderModal product={{ id: requestProduct.id, name: requestProduct.name, priceInr: requestProduct.priceInr }} onClose={() => setRequestProduct(null)} />}
      {variantProduct && <ColorVariantModal productName={variantProduct.name} variants={variantProduct.colorVariants} onClose={() => setVariantProduct(null)} onSelect={(variant) => addProduct(variantProduct, variant)} />}
      <style jsx>{`
        .shop-page { min-height: 100vh; background: var(--cream); color: var(--cocoa); }
        .catalogue-section { background: var(--cream); }
        .catalogue-toolbar { display:flex; align-items:center; gap:16px; margin-bottom:32px; padding-bottom:20px; border-bottom:1px solid rgba(75,58,50,.1); }
        .catalogue-toolbar select { min-width:190px; padding:11px 32px 11px 12px; border:1px solid rgba(75,58,50,.18); border-radius:4px; background:var(--cream); font:400 14px var(--font-lato),sans-serif; }
        .result-count { display:inline-flex; align-items:center; gap:10px; margin-left:auto; color:rgba(75,58,50,.65); font-size:var(--fs-sm); }.result-count em { color:var(--cocoa); font-style:normal; font-weight:700; }.clear-search { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border:1px solid rgba(75,58,50,.18); border-radius:var(--border-radius-lg); color:var(--cocoa); }
        .catalogue-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }.catalogue-card { position:relative; display:flex; flex-direction:column; overflow:hidden; background:#fff; border:1px solid rgba(75,58,50,.08); border-radius:12px; box-shadow:0 4px 16px rgba(75,58,50,.05); transition:box-shadow .2s ease; }.catalogue-card { transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .2s ease; }.catalogue-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(75,58,50,.09); }@media (prefers-reduced-motion: reduce) { .catalogue-card { transition:box-shadow .2s ease; } .catalogue-card:hover { transform:none; } }.catalogue-image-wrap { position:relative; aspect-ratio:4/5; overflow:hidden; background:var(--cream); border-radius:12px 12px 0 0; }.catalogue-image-wrap img { width:100%; height:100%; object-fit:cover; transition:transform .3s cubic-bezier(.16,1,.3,1); }.catalogue-card:hover .catalogue-image-wrap img { transform:scale(1.04); }@media (prefers-reduced-motion: reduce) { .catalogue-image-wrap img { transition:none; } .catalogue-card:hover .catalogue-image-wrap img { transform:none; } }.catalogue-badge { position:absolute; top:12px; left:12px; z-index:2; }.bestseller-badge { position:absolute; top:44px; left:0; z-index:2; min-width:100px; padding:5px 16px 5px 10px; background:var(--coral); color:var(--white); font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%); }.bestseller-badge:not(.below-new) { top:12px; }.catalogue-info { display:flex; flex:1; flex-direction:column; padding:16px 18px 18px; background:#fff; }.catalogue-category { min-height:20px; color:rgba(75,58,50,.55); font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }.catalogue-info h2 { margin:4px 0 16px; font-size:var(--fs-md); line-height:1.3; }.catalogue-footer { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:auto; padding-top:10px; border-top:1px solid rgba(75,58,50,.06); }.catalogue-footer strong { font:700 var(--fs-md) var(--font-playfair),Georgia,serif; }.catalogue-stock { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }.stock-note { font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--coral); }.stock-note.in { color:var(--sage); }.stock-note.out { color:rgba(75,58,50,.58); }.catalogue-action { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:36px; padding:6px 14px; border-radius:6px; background:var(--coral); color:var(--white); font-size:12px; font-weight:700; border:0; cursor:pointer; }.catalogue-action.request { background:transparent; border:1px solid var(--cocoa); color:var(--cocoa); }.empty-catalogue { display:grid; grid-template-columns:minmax(260px,420px) minmax(280px,440px); align-items:center; justify-content:center; gap:42px; padding:34px 20px 70px; text-align:left; }.empty-catalogue img { width:100%; height:auto; border-radius:var(--border-radius-md); }.empty-catalogue h2 { margin:8px 0 12px; font:700 clamp(28px,4vw,42px) var(--font-playfair),Georgia,serif; }.empty-catalogue p:not(.empty-eyebrow) { max-width:390px; margin:0 0 22px; color:var(--text-muted); line-height:1.7; }.empty-eyebrow { margin:0; color:var(--coral); font:700 11px var(--font-lato),sans-serif; letter-spacing:.14em; }
        @media(max-width:991px){.catalogue-grid{grid-template-columns:repeat(3,1fr)}} @media(max-width:700px){.empty-catalogue{grid-template-columns:1fr;gap:24px;text-align:center}.empty-catalogue img{max-width:480px;margin:auto}.empty-catalogue p:not(.empty-eyebrow){margin-left:auto;margin-right:auto}} @media(max-width:640px){.catalogue-toolbar{align-items:stretch;flex-direction:column}.catalogue-toolbar select{width:100%}.result-count{margin:0}.catalogue-grid{grid-template-columns:repeat(2,1fr);gap:12px}.catalogue-info{padding:12px}.catalogue-footer{align-items:stretch;flex-direction:column}.catalogue-stock{align-items:stretch}.catalogue-action{width:100%}}
      `}</style>
    </main>
  );
}
