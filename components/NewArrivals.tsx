"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import RequestOrderModal from "@/components/RequestOrderModal";
import { useCart } from "@/components/CartProvider";

function productSlug(product: { slug?: string; name: string }) {
  return (
    product.slug ||
    product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );
}

interface Product {
  id: number;
  slug?: string;
  name: string;
  category: string;
  price: string;
  priceInr?: number;
  image: string;
  isNew: boolean;
  isBestSeller?: boolean;
  stockQuantity: number;
}

export default function NewArrivals() {
  const fallbackProducts: Product[] = [
    {
      id: 1,
      name: "Daisy Market Tote",
      category: "Handmade • Crochet Bag",
      price: "₹5,200",
      image: "/assets/02_website_assets/product_images/daisy_market_tote.png",
      isNew: true,
      stockQuantity: 0,
    },
    {
      id: 2,
      name: "Blush Bunny",
      category: "Handmade • Amigurumi",
      price: "₹2,850",
      image: "/assets/02_website_assets/product_images/blush_bunny.png",
      isNew: true,
      stockQuantity: 0,
    },
    {
      id: 3,
      name: "Vintage Square Blanket",
      category: "Handmade • Crochet Blanket",
      price: "₹8,200",
      image: "/assets/02_website_assets/product_images/vintage_square_blanket.png",
      isNew: true,
      stockQuantity: 0,
    },
    {
      id: 4,
      name: "The Cozy Beanie",
      category: "Handmade • Wearable",
      price: "₹3,200",
      image: "/assets/02_website_assets/product_images/the_cozy_beanie.png",
      isNew: true,
      stockQuantity: 0,
    },
    {
      id: 5,
      name: "Paranda",
      category: "Hair & Fashion Accessories",
      price: "₹250",
      priceInr: 250,
      image: "/assets/02_website_assets/product_images/paranda.png",
      isNew: true,
      stockQuantity: 5,
    },
    {
      id: 6,
      name: "Evil Eye",
      category: "Keychains & Charms",
      price: "₹250",
      priceInr: 250,
      image: "/assets/02_website_assets/product_images/evil_eye.png",
      isNew: true,
      stockQuantity: 5,
    },
    {
      id: 7,
      name: "3 Musketeers Mushroom",
      category: "Keychains & Charms",
      price: "₹250",
      priceInr: 250,
      image: "/assets/02_website_assets/product_images/three_musketeers_mushroom.png",
      isNew: true,
      stockQuantity: 5,
    },
    {
      id: 8,
      name: "Red Cherry",
      category: "Keychains & Charms",
      price: "₹250",
      priceInr: 250,
      image: "/assets/02_website_assets/product_images/red_cherry.png",
      isNew: true,
      stockQuantity: 5,
    },
  ];

  const [products, setProducts] = useState<Product[]>(fallbackProducts.filter((product) => product.isNew));
  const [requestProduct, setRequestProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let client;
    try {
      client = createSupabaseBrowserClient();
    } catch {
      return;
    }

    client
      .from("products")
      .select("id, name, slug, category, price_inr, image_url, is_new, is_best_seller, stock_quantity")
      .eq("is_active", true)
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        setProducts(data.map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: `₹${product.price_inr.toLocaleString("en-IN")}`,
          image: product.image_url || "/assets/02_website_assets/product_images/daisy_market_tote.png",
          isNew: product.is_new,
          isBestSeller: product.is_best_seller,
          stockQuantity: product.stock_quantity,
        })));
      });
  }, []);

  return (
    <section id="shop" className="section-padding products-section">
      <div className="container">
        <h2 className="section-title text-serif">New Arrivals</h2>
        <div className="section-subtitle tagline">
          <span className="flourish-heart">♥</span>
          Fresh from the Yarn Side
          <span className="flourish-heart">♥</span>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card card-hover-lift">
              <Link href={`/products/${productSlug(product)}`} className="product-card-link" aria-label={`View ${product.name}`} />
              {/* Product Image & Tags */}
              <div className="product-image-container zoom-container">
                {product.isNew && (
                  <span className="product-tag badge badge-new">New</span>
                )}

                {product.isBestSeller && (
                  <span className={`bestseller-badge ${product.isNew ? "below-new" : ""}`}>
                    Bestseller
                  </span>
                )}
                
                <Image
                  src={product.image}
                  alt={product.name}
                  width={320}
                  height={400}
                  unoptimized={product.image.startsWith("http")}
                  className={`product-image zoom-image ${product.name === "Red Cherry" ? "red-cherry-image" : ""}`}
                />
              </div>

              {/* Product Info */}
              <div className="product-info">
                <span className="product-category text-sans">{product.category}</span>
                <h3 className="product-title text-serif">{product.name}</h3>
                
                <div className="product-footer">
                  <span className="product-price text-serif">{product.price}</span>
                  <div className="stock-actions">
                    {product.stockQuantity === 0 ? <span className="out-of-stock">Out of stock</span> : product.stockQuantity <= 5 ? <span className="low-stock">Only {product.stockQuantity} remaining</span> : <span className="in-stock">In stock</span>}
                    {product.stockQuantity > 0 ? <button className="add-to-cart-btn touch-target" aria-label={`Add ${product.name} to Cart`} onClick={() => addItem({ id: product.id, name: product.name, priceInr: product.priceInr ?? Number(product.price.replace(/[^0-9]/g, "")), image: product.image, stockQuantity: product.stockQuantity })}>
                      <ShoppingBag size={16} />
                      <span>Add</span>
                    </button> : <button className="request-order-btn touch-target" aria-label={`Request an order for ${product.name}`} onClick={() => setRequestProduct(product)}>
                      <ShoppingBag size={16} />
                      <span>Request order</span>
                    </button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link href="/shop" className="btn btn-primary">
            View All Products
          </Link>
        </div>
      </div>

      {requestProduct && <RequestOrderModal product={{ id: requestProduct.id, name: requestProduct.name, priceInr: requestProduct.priceInr ?? Number(requestProduct.price.replace(/[^0-9]/g, "")) }} onClose={() => setRequestProduct(null)} />}

      <style jsx>{`
        .products-section {
          background-color: var(--white);
          border-top: 1px solid rgba(75, 58, 50, 0.05);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-bottom: 48px;
        }

        .product-card {
          position: relative;
          background-color: var(--cream);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(75, 58, 50, 0.05);
          display: flex;
          flex-direction: column;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5; /* Preferred 4:5 image ratio from guidelines */
          overflow: hidden;
          background-color: var(--cream);
        }

        .product-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .red-cherry-image {
          object-fit: cover;
          object-position: center center;
        }

        .product-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
        }

        .bestseller-badge {
          position: absolute;
          top: 16px;
          left: 0;
          z-index: 10;
          min-width: 100px;
          padding: 5px 16px 5px 10px;
          background: var(--coral);
          color: var(--white);
          font-family: var(--font-lato), sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1.25;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(75, 58, 50, 0.12);
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
        }

        .bestseller-badge.below-new {
          top: 48px;
        }

        .product-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          background-color: var(--white);
        }

        .product-category {
          font-size: 11px;
          color: var(--cocoa);
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .product-title {
          font-size: var(--fs-md);
          color: var(--cocoa);
          margin: 0 0 16px 0;
          font-weight: 700;
          line-height: 1.3;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(75, 58, 50, 0.05);
        }

        .product-price {
          font-size: var(--fs-md);
          color: var(--cocoa);
          font-weight: 700;
        }

        .stock-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .out-of-stock {
          color: rgba(75, 58, 50, 0.58);
          font-family: var(--font-lato), sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .low-stock, .in-stock {
          color: var(--coral);
          font-family: var(--font-lato), sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .in-stock {
          color: var(--sage);
        }

        .add-to-cart-btn, .request-order-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--border-radius-lg);
          background-color: var(--sage);
          color: var(--white);
          font-family: var(--font-lato), sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          transition: var(--transition-fast);
        }

        .add-to-cart-btn {
          background-color: var(--sage);
        }

        .add-to-cart-btn:hover, .request-order-btn:hover {
          background-color: var(--sage-hover);
          transform: scale(1.03);
        }

        .view-all-container {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 576px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .product-card {
            max-width: 320px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
