"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useCart } from "@/components/CartProvider";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceInr?: number;
  image: string;
  isNew: boolean;
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
    },
    {
      id: 2,
      name: "Blush Bunny",
      category: "Handmade • Amigurumi",
      price: "₹2,850",
      image: "/assets/02_website_assets/product_images/blush_bunny.png",
      isNew: true,
    },
    {
      id: 3,
      name: "Vintage Square Blanket",
      category: "Handmade • Crochet Blanket",
      price: "₹8,200",
      image: "/assets/02_website_assets/product_images/vintage_square_blanket.png",
      isNew: true,
    },
    {
      id: 4,
      name: "The Cozy Beanie",
      category: "Handmade • Wearable",
      price: "₹3,200",
      image: "/assets/02_website_assets/product_images/the_cozy_beanie.png",
      isNew: true,
    },
  ];

  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [wishlist, setWishlist] = useState<number[]>([]);
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
      .select("id, name, category, price_inr, image_url, is_new")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        setProducts(data.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: `₹${product.price_inr.toLocaleString("en-IN")}`,
          image: product.image_url || "/assets/02_website_assets/product_images/daisy_market_tote.png",
          isNew: product.is_new,
        })));
      });
  }, []);

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((productId) => productId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

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
              {/* Product Image & Tags */}
              <div className="product-image-container zoom-container">
                {product.isNew && (
                  <span className="product-tag badge badge-new">New</span>
                )}
                
                <button
                  className={`wishlist-button touch-target ${
                    wishlist.includes(product.id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Add to Wishlist"
                >
                  <Heart
                    size={18}
                    fill={wishlist.includes(product.id) ? "var(--coral)" : "transparent"}
                    color={wishlist.includes(product.id) ? "var(--coral)" : "var(--cocoa)"}
                  />
                </button>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={320}
                  height={400}
                  className="product-image zoom-image"
                />
              </div>

              {/* Product Info */}
              <div className="product-info">
                <span className="product-category text-sans">{product.category}</span>
                <h3 className="product-title text-serif">{product.name}</h3>
                
                <div className="product-footer">
                  <span className="product-price text-serif">{product.price}</span>
                  <button className="add-to-cart-btn touch-target" aria-label={`Add ${product.name} to Cart`} onClick={() => addItem({ id: product.id, name: product.name, priceInr: product.priceInr ?? Number(product.price.replace(/[^0-9]/g, "")), image: product.image })}>
                    <ShoppingBag size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <a href="#shop" className="btn btn-primary">
            View All Products
          </a>
        </div>
      </div>

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

        .product-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
        }

        .wishlist-button {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          background-color: var(--white);
          border-radius: var(--border-radius-round);
          box-shadow: 0 2px 6px rgba(75, 58, 50, 0.1);
          color: var(--cocoa);
          transition: var(--transition-fast);
        }

        .wishlist-button:hover {
          transform: scale(1.08);
          color: var(--coral);
        }

        .wishlist-button.active {
          color: var(--coral);
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

        .add-to-cart-btn {
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

        .add-to-cart-btn:hover {
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
