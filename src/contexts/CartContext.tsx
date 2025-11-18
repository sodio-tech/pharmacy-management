"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { Product, Customer } from '@/types/sales'
import { backendApi } from '@/lib/axios-config'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  packSize: number
  unitPrice: number
  totalPrice: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updatePackSize: (productId: string, packSize: number) => void
  clearCart: (silent?: boolean) => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  getCartTax: () => number
  getCartDiscount: () => number
  getItemCount: () => number
  processCheckout: (customer: Customer, paymentMethod: string, notes?: string) => Promise<void>
  isProcessing: boolean
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
  const [isProcessing, setIsProcessing] = useState(false)

  // Create a singleton audio instance that persists across renders
  // This ensures the audio is preloaded and ready to play
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      try {
        const audio = new Audio('/assets/product-add-sound.mp3')
        audio.volume = 0.5 // Set volume to 50%
        audio.preload = 'auto' // Preload the audio file
        
        // Handle audio loading errors
        audio.addEventListener('error', (e) => {
          console.warn('Audio file failed to load:', e)
        })

        // Try to load the audio
        audio.load()
        audioRef.current = audio
      } catch (error) {
        console.warn('Could not initialize audio:', error)
      }
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Function to play sound when product is added or quantity is updated
  const playAddSound = React.useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      // Use the preloaded audio instance
      const audio = audioRef.current
      if (!audio) {
        // Fallback: create new instance if ref is not available
        const fallbackAudio = new Audio('/assets/product-add-sound.mp3')
        fallbackAudio.volume = 0.5
        fallbackAudio.play().catch(() => {
          // Silently handle autoplay restrictions
        })
        return
      }

      // Reset audio to start if it's already playing
      if (!audio.paused) {
        audio.currentTime = 0
      }

      // Play the audio
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Handle autoplay restrictions - this is expected in some browsers
          // The sound will work after user interaction
          if (error.name !== 'NotAllowedError') {
            console.debug('Could not play sound:', error)
          }
        })
      }
    } catch (error) {
      // Silently handle audio errors
      console.debug('Could not play sound:', error)
    }
  }, [])

  const addToCart = (product: Product, quantity: number = 1) => {
    let isNewItem = false
    
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
                totalPrice: newQuantity * item.packSize * Number(item.unitPrice || 0)
              }
            : item
        )
      } else {
        // Add new item to cart
        isNewItem = true
        const sellingPrice = Number(product.selling_price || product.unit_price || 0)
        const defaultPackSize = product.pack_size && product.pack_size > 0 ? product.pack_size : 1
        const newItem: CartItem = {
          id: String(product.id),
          product,
          quantity,
          packSize: defaultPackSize,
          unitPrice: sellingPrice,
          totalPrice: quantity * defaultPackSize * sellingPrice
        }
        return [...prevItems, newItem]
      }
    })
    
    // Show toast message only when product is added for the first time
    if (isNewItem) {
      toast.success(`${product.name} added to cart`)
    }
    
    // Play sound when product is added to cart
    playAddSound()
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
              totalPrice: quantity * item.packSize * Number(item.unitPrice || 0)
            }
          : item
      )
    )
    // Play sound when quantity is updated
    playAddSound()
  }

  const updatePackSize = (productId: string, packSize: number) => {
    if (packSize < 1) {
      packSize = 1
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? {
              ...item,
              packSize,
              totalPrice: item.quantity * packSize * Number(item.unitPrice || 0)
            }
          : item
      )
    )
  }

  const clearCart = (silent: boolean = false) => {
    setCartItems([])
    if (!silent) {
      toast.success('Cart cleared')
    }
  }

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const getCartTax = () => {
    // No tax applied
    return 0
  }

  const getCartDiscount = () => {
    // You can implement discount logic here
    return 0
  }

  const getCartTotal = () => {
    // Total equals subtotal (no tax or additional charges)
    return getCartSubtotal()
  }

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const processCheckout = async (customer: Customer, paymentMethod: string, notes?: string) => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty')
      return
    }

    setIsProcessing(true)
    try {
      const saleData = {
        customer,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice
        })),
        payment_method: paymentMethod,
        notes: notes || undefined,
        subtotal: getCartSubtotal(),
        tax: getCartTax(),
        discount: getCartDiscount(),
        total: getCartTotal()
      }

      const response = await backendApi.post('/sales', saleData)
      const sale = response.data?.data || response.data
      
      toast.success(`Sale completed successfully! Sale #${sale?.sale_number || sale?.id}`)
      clearCart()
    } catch (error: unknown) {
      console.error("Error processing checkout:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updatePackSize,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartDiscount,
    getItemCount,
    processCheckout,
    isProcessing
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
