"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  product: {
    id: string
    title: string
    price: number
    coverImage: string
  }
  quantity: number
}

export interface DeliveryAddress {
  id: string
  street: string
  ward: string
  district: string
  city: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getShippingFee: () => number
  getTax: () => number
  getFinalTotal: () => number
  deliveryAddresses: DeliveryAddress[]
  selectedAddressId: string | null
  saveDeliveryAddress: (address: Omit<DeliveryAddress, "id">) => void
  selectAddress: (addressId: string) => void
  deleteAddress: (addressId: string) => void
  getSelectedAddress: () => DeliveryAddress | null
  setDeliveryAddresses: (addresses: DeliveryAddress[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("cartItems")
    const savedAddresses = localStorage.getItem("deliveryAddresses")
    const savedAddressId = localStorage.getItem("selectedAddressId")

    if (savedItems) setItems(JSON.parse(savedItems))
    if (savedAddresses) setDeliveryAddresses(JSON.parse(savedAddresses))
    if (savedAddressId) setSelectedAddressId(savedAddressId)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem("deliveryAddresses", JSON.stringify(deliveryAddresses))
  }, [deliveryAddresses])

  useEffect(() => {
    localStorage.setItem("selectedAddressId", selectedAddressId || "")
  }, [selectedAddressId])

  const addToCart = (product: any, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product._id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [
        ...prevItems,
        {
          product: {
            id: product._id,
            title: product.title,
            price: product.price,
            coverImage: product.coverImage,
          },
          quantity,
        },
      ]
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
    setItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
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
    const total = getTotalPrice()
    return total >= 200000 ? 0 : 30000
  }

  const getTax = () => {
    return Math.round(getTotalPrice() * 0.1)
  }

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingFee() + getTax()
  }

  const saveDeliveryAddress = (address: Omit<DeliveryAddress, "id">) => {
    const newAddress: DeliveryAddress = {
      ...address,
      id: Date.now().toString(),
    }
    setDeliveryAddresses((prev) => [...prev, newAddress])
  }

  const selectAddress = (addressId: string) => {
    setSelectedAddressId(addressId)
  }

  const deleteAddress = (addressId: string) => {
    setDeliveryAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null)
    }
  }

  const getSelectedAddress = () => {
    return deliveryAddresses.find((addr) => addr.id === selectedAddressId) || null
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
        deliveryAddresses,
        selectedAddressId,
        saveDeliveryAddress,
        selectAddress,
        deleteAddress,
        getSelectedAddress,
        setDeliveryAddresses
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
