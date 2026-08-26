"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartProduct = {
  id: number;
  name: string;
  priceInr: number;
  image: string;
  stockQuantity: number;
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
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  clearLastAdded: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "theyarnside-cart";

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
    addItem: (product) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          if (existing.quantity >= product.stockQuantity) return current;
          return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...current, { ...product, quantity: 1 }];
      });
      setLastAddedItem(product);
    },
    updateQuantity: (id, quantity) => {
      setItems((current) => quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => item.id === id ? { ...item, quantity: Math.min(quantity, item.stockQuantity) } : item));
    },
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
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
