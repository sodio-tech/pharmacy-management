import { useState, useEffect, useCallback } from "react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"
import { CreditCard, Wallet, Smartphone, Banknote, LucideIcon } from "lucide-react"

export interface PaymentMode {
  id: number
  name: string
  description: string | null
}

export interface PaymentMethod {
  id: number
  name: string
  value: string
  icon: LucideIcon
  description: string | null
}

interface UsePaymentModesReturn {
  paymentMethods: PaymentMethod[]
  isLoading: boolean
  error: string | null
  fetchPaymentModes: () => Promise<void>
}

// Map payment mode names to icons and display names
const paymentModeMap: Record<string, { icon: LucideIcon; displayName: string }> = {
  cash: { icon: Banknote, displayName: "Cash" },
  card: { icon: CreditCard, displayName: "Card" },
  upi: { icon: Smartphone, displayName: "UPI" },
  wallet: { icon: Wallet, displayName: "Wallet" },
}

export function usePaymentModes(): UsePaymentModesReturn {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentModes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await backendApi.get("/v1/sales/payment-modes")
      const responseData = response.data?.data || response.data
      let modesList: PaymentMode[] = []
      
      if (Array.isArray(responseData)) {
        modesList = responseData
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        modesList = responseData.data
      }
      
      // Map payment modes to payment methods with icons
      const mappedMethods: PaymentMethod[] = modesList.map((mode) => {
        const modeKey = mode.name.toLowerCase()
        const modeConfig = paymentModeMap[modeKey] || { 
          icon: Banknote, 
          displayName: mode.name.charAt(0).toUpperCase() + mode.name.slice(1) 
        }
        
        return {
          id: mode.id,
          name: modeConfig.displayName,
          value: mode.name.toUpperCase(),
          icon: modeConfig.icon,
          description: mode.description,
        }
      })
      
      setPaymentMethods(mappedMethods)
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(errorMessage || "Failed to fetch payment modes")
      setPaymentMethods([])
      toast.error("Failed to fetch payment modes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPaymentModes()
  }, [fetchPaymentModes])

  return { paymentMethods, isLoading, error, fetchPaymentModes }
}

