/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Simplified cart product type that works with both static and DB products
export interface CartProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  offers?: Array<{
    icon: string;
    text: string;
    price: number;
  }>;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  selectedOffer?: {
    icon: string;
    text: string;
    price: number;
  };
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: CartProduct, quantity?: number, selectedOffer?: { icon: string; text: string; price: number } | null) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSelectedOffer: (productId: string, offer: { icon: string; text: string; price: number } | null) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "amana-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (product: CartProduct, quantity = 1, selectedOffer?: { icon: string; text: string; price: number } | null) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selectedOffer: selectedOffer !== undefined ? (selectedOffer || undefined) : item.selectedOffer
              }
            : item
        );
      }
      return [...prev, { product, quantity, selectedOffer: selectedOffer || undefined }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateSelectedOffer = (productId: string, offer: { icon: string; text: string; price: number } | null) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, selectedOffer: offer || undefined }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const effectivePrice = item.selectedOffer ? item.selectedOffer.price : item.product.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const totalSavings = items.reduce((sum, item) => {
    const effectivePrice = item.selectedOffer ? item.selectedOffer.price : item.product.price;
    if (item.product.originalPrice) {
      return (
        sum +
        (item.product.originalPrice - effectivePrice) * item.quantity
      );
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSelectedOffer,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        totalPrice,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
