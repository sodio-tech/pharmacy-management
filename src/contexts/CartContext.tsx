"use client"

import React, { createContext, useContext, useState, ReactNode, useRef, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Product, Customer } from '@/types/sales'
import { backendApi } from '@/lib/axios-config'
import { useAppSelector } from '@/store/hooks'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  packSize: number
  unitPrice: number
  totalPrice: number
  // API से आए actual prices
  apiPrice?: number
  gstRate?: number
  listPrice?: number
}

interface CartPricingData {
  total_amt: number
  total_before_tax: number
  products: Array<{
    id: string
    quantity: number
    pack_size: number
    price: number
    gst_rate: number
    list_price: number
  }>
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
  isCalculatingPrices: boolean
  cartPricing: CartPricingData | null
  setCustomerId: (customerId: number | string | null) => void
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
  const [isCalculatingPrices, setIsCalculatingPrices] = useState(false)
  const [cartPricing, setCartPricing] = useState<CartPricingData | null>(null)
  const [customerId, setCustomerIdState] = useState<number | string | null>(null)
  
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Debounced function to fetch prices from API
  const fetchCartPrices = useCallback(async (items: CartItem[], branchId: number | null, customerIdParam?: number | string | null) => {
    if (!branchId || items.length === 0) {
      setCartPricing(null)
      return
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new debounced timer (500ms delay)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsCalculatingPrices(true)
        
        const formData = new FormData()
        formData.append("branch_id", branchId.toString())
        
        // Format cart items according to API requirements
        const cartItemsData = items.map(item => ({
          product_id: Number(item.product.id),
          quantity: item.quantity,
          pack_size: item.packSize,
        }))
        formData.append("cart", JSON.stringify(cartItemsData))
        
        // Add customer_id if available (use parameter or state)
        const finalCustomerId = customerIdParam !== undefined ? customerIdParam : customerId
        if (finalCustomerId) {
          formData.append("customer_id", String(finalCustomerId))
        }

        const response = await backendApi.post("/v1/sales/new-sale?action=review", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })

        const responseData = response.data
        if (responseData?.success && responseData?.data) {
          const pricingData = responseData.data
          setCartPricing(pricingData)
          
          // Update cart items with API prices
          setCartItems(prevItems => {
            return prevItems.map(item => {
              const apiProduct = pricingData.products.find(
                (p: { id: string }) => String(p.id) === String(item.product.id)
              )
              if (apiProduct) {
                return {
                  ...item,
                  apiPrice: apiProduct.price,
                  gstRate: apiProduct.gst_rate,
                  listPrice: apiProduct.list_price,
                  totalPrice: apiProduct.price, // Use API price as total
                }
              }
              return item
            })
          })
        }
      } catch (error: unknown) {
        console.error("Error fetching cart prices:", error)
        // Don't show error toast for background API calls
      } finally {
        setIsCalculatingPrices(false)
      }
    }, 500) // 500ms debounce delay
  }, [])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const addToCart = (product: Product, quantity: number = 1) => {
    let isNewItem = false
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity
        const updatedItems = prevItems.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                // Don't calculate price here, API will provide it
                totalPrice: item.apiPrice || item.totalPrice
              }
            : item
        )
        // Trigger debounced API call to fetch prices
        setTimeout(() => fetchCartPrices(updatedItems, selectedBranchId, customerId), 0)
        return updatedItems
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
          totalPrice: 0 // Will be updated by API
        }
        const updatedItems = [...prevItems, newItem]
        // Trigger debounced API call to fetch prices
        setTimeout(() => fetchCartPrices(updatedItems, selectedBranchId, customerId), 0)
        return updatedItems
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
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId)
      // Trigger debounced API call to fetch prices
      fetchCartPrices(updatedItems, selectedBranchId, customerId)
      return updatedItems
    })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === productId
          ? {
              ...item,
              quantity,
              // Don't calculate price here, API will provide it
              totalPrice: item.apiPrice || item.totalPrice
            }
          : item
      )
      // Trigger debounced API call to fetch prices
      fetchCartPrices(updatedItems, selectedBranchId, customerId)
      return updatedItems
    })
    // Play sound when quantity is updated
    playAddSound()
  }

  const updatePackSize = (productId: string, packSize: number) => {
    if (packSize < 1) {
      packSize = 1
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === productId
          ? {
              ...item,
              packSize,
              // Don't calculate price here, API will provide it
              totalPrice: item.apiPrice || item.totalPrice
            }
          : item
      )
      // Trigger debounced API call to fetch prices
      fetchCartPrices(updatedItems, selectedBranchId, customerId)
      return updatedItems
    })
  }

  const setCustomerId = useCallback((id: number | string | null) => {
    setCustomerIdState(id)
    // Trigger API call when customer changes
    if (cartItems.length > 0 && selectedBranchId) {
      fetchCartPrices(cartItems, selectedBranchId, id)
    }
  }, [cartItems, selectedBranchId, fetchCartPrices])

  const clearCart = (silent: boolean = false) => {
    setCartItems([])
    setCartPricing(null)
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    if (!silent) {
      toast.success('Cart cleared')
    }
  }

  const getCartSubtotal = () => {
    // Use API pricing if available, otherwise fallback to cart items
    if (cartPricing) {
      return cartPricing.total_before_tax || 0
    }
    return cartItems.reduce((total, item) => total + (item.apiPrice || item.totalPrice || 0), 0)
  }

  const getCartTax = () => {
    // Calculate tax from API data
    if (cartPricing) {
      return (cartPricing.total_amt || 0) - (cartPricing.total_before_tax || 0)
    }
    return 0
  }

  const getCartDiscount = () => {
    // You can implement discount logic here
    return 0
  }

  const getCartTotal = () => {
    // Use API total if available
    if (cartPricing) {
      return cartPricing.total_amt || 0
    }
    // Fallback to cart items calculation
    return cartItems.reduce((total, item) => total + (item.apiPrice || item.totalPrice || 0), 0)
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
    isProcessing,
    isCalculatingPrices,
    cartPricing,
    setCustomerId
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
