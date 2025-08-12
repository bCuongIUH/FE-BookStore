"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/products-data"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getShippingFee: () => number
  getTax: () => number
  getFinalTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bookstore_cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        localStorage.removeItem("bookstore_cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("bookstore_cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.inStock) {
          return prevItems // Don't add if exceeds stock
        }
        return prevItems.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item))
      } else {
        // Add new item
        if (quantity > product.inStock) {
          return prevItems // Don't add if exceeds stock
        }
        return [...prevItems, { product, quantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.min(quantity, item.product.inStock)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getShippingFee = () => {
    const totalPrice = getTotalPrice()
    if (totalPrice >= 500000) return 0 // Free shipping for orders over 500k
    if (totalPrice >= 200000) return 20000 // 20k shipping for orders over 200k
    return 30000 // 30k shipping for smaller orders
  }

  const getTax = () => {
    return Math.round(getTotalPrice() * 0.1) // 10% VAT
  }

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingFee() + getTax()
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getShippingFee,
        getTax,
        getFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
