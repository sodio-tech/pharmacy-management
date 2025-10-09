"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/services/inventoryService'
import { toast } from 'react-toastify'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  getCartTax: () => number
  getCartDiscount: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity
        return prevItems.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: newQuantity * Number(item.unitPrice || 0)
              }
            : item
        )
      } else {
        // Add new item to cart
        const sellingPrice = Number(product.selling_price || product.unit_price || 0)
        const newItem: CartItem = {
          id: product.id,
          product,
          quantity,
          unitPrice: sellingPrice,
          totalPrice: quantity * sellingPrice
        }
        return [...prevItems, newItem]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * Number(item.unitPrice || 0)
            }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    toast.success('Cart cleared')
  }

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const getCartTax = () => {
    // Assuming 12% GST
    return getCartSubtotal() * 0.12
  }

  const getCartDiscount = () => {
    // You can implement discount logic here
    return 0
  }

  const getCartTotal = () => {
    return getCartSubtotal() + getCartTax() - getCartDiscount()
  }

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartDiscount,
    getItemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
