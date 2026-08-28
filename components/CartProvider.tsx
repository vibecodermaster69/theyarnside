"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ColorVariant } from "@/lib/catalogue";
import { stripMarks } from "@/lib/marks";

export type CartProduct = {
  id: number;
  name: string;
  priceInr: number;
  image: string;
  stockQuantity: number;
  colorVariant?: ColorVariant;
};

export type CartItem = CartProduct & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalInr: number;
  lastAddedItem: CartProduct | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CartProduct) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  clearLastAdded: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "theyarnside-cart";
const getLineId = (product: CartProduct) => `${product.id}:${product.colorVariant?.name ?? "default"}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      // An unavailable or malformed local cart should not block the storefront.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalInr: items.reduce((sum, item) => sum + item.priceInr * item.quantity, 0),
    lastAddedItem,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (raw) => {
      // The cart feeds order records and emails, which are plain text, so a name
      // carrying a mark token is normalised on the way in rather than at display.
      const product = { ...raw, name: stripMarks(raw.name) };
      setItems((current) => {
        const existing = current.find((item) => getLineId(item) === getLineId(product));
        if (existing) {
          if (existing.quantity >= product.stockQuantity) return current;
          return current.map((item) => getLineId(item) === getLineId(product) ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...current, { ...product, quantity: 1 }];
      });
      setLastAddedItem(product);
    },
    updateQuantity: (lineId, quantity) => {
      setItems((current) => quantity <= 0
        ? current.filter((item) => getLineId(item) !== lineId)
        : current.map((item) => getLineId(item) === lineId ? { ...item, quantity: Math.min(quantity, item.colorVariant?.stockQuantity ?? item.stockQuantity) } : item));
    },
    removeItem: (lineId) => setItems((current) => current.filter((item) => getLineId(item) !== lineId)),
    clearCart: () => setItems([]),
    clearLastAdded: () => setLastAddedItem(null),
  }), [items, isOpen, lastAddedItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
