"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { OrderCompletionData } from "./OrdersTable"
import { backendApi } from "@/lib/axios-config"

interface OrderCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: number
  onComplete: (success: boolean) => void
  orderBatchData?: OrderCompletionData
}

type DialogStep = "ask-delivery-date" | "select-date" | "ask-batch-data" | "completing"

export function OrderCompletionDialog({
  open,
  onOpenChange,
  orderId,
  onComplete,
  orderBatchData,
}: OrderCompletionDialogProps) {
  const [step, setStep] = useState<DialogStep>("ask-delivery-date")
  const [deliveryDate, setDeliveryDate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const resetDialog = () => {
    setStep("ask-delivery-date")
    setDeliveryDate("")
    setIsLoading(false)
  }

  const handleClose = () => {
    resetDialog()
    onOpenChange(false)
  }

  const completeOrder = async (endpoint: string, params?: Record<string, string>, body?: OrderCompletionData) => {
    setIsLoading(true)
    setStep("completing")

    try {
      const config = params ? { params } : undefined
      const response = await backendApi.patch(endpoint, body || undefined, config)
      if (!response.data?.success) {
        throw new Error("Failed to complete order")
      }

      onComplete(true)
      handleClose()
    } catch (error) {
      console.error("Error completing order:", error)
      onComplete(false)
      setIsLoading(false)
      setStep("ask-delivery-date")
    }
  }

  const handleWithDeliveryDate = () => {
    setStep("select-date")
  }

  const handleWithoutDeliveryDate = () => {
    setStep("ask-batch-data")
  }

  const handleDateConfirm = () => {
    if (!deliveryDate) return

    // Convert datetime-local value to ISO string
    const date = new Date(deliveryDate)
    const deliveredOn = date.toISOString()
    // Use axios params option to properly handle query parameters
    const endpoint = `/v1/orders/order-completed/${orderId}`
    completeOrder(endpoint, { delivered_on: deliveredOn })
  }

  const handleWithBatchData = () => {
    if (!orderBatchData) {
      console.error("No batch data available")
      return
    }

    const endpoint = `/v1/orders/order-completed/${orderId}`
    completeOrder(endpoint, undefined, orderBatchData)
  }

  const handleWithoutBatchData = () => {
    const endpoint = `/v1/orders/order-completed/${orderId}`
    completeOrder(endpoint)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === "ask-delivery-date" && (
          <>
            <DialogHeader>
              <DialogTitle>Complete Order #{orderId}</DialogTitle>
              <DialogDescription>Would you like to add a delivery date for this order?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleWithoutDeliveryDate} className="w-full sm:w-auto bg-transparent">
                No, Skip
              </Button>
              <Button onClick={handleWithDeliveryDate} className="w-full sm:w-auto">
                Yes, Add Date
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "select-date" && (
          <>
            <DialogHeader>
              <DialogTitle>Select Delivery Date</DialogTitle>
              <DialogDescription>Choose the date when the order was delivered.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="delivery-date" className="mb-2 block">
                Delivery Date
              </Label>
              <Input
                id="delivery-date"
                type="datetime-local"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("ask-delivery-date")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleDateConfirm} disabled={!deliveryDate} className="w-full sm:w-auto">
                Complete Order
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "ask-batch-data" && (
          <>
            <DialogHeader>
              <DialogTitle>Add Batch Data?</DialogTitle>
              <DialogDescription>
                Would you like to include batch data (manufacturer info, batch numbers, expiry dates) for this order?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleWithoutBatchData} className="w-full sm:w-auto bg-transparent">
                No, Complete Without
              </Button>
              <Button onClick={handleWithBatchData} disabled={!orderBatchData} className="w-full sm:w-auto">
                Yes, Include Batch Data
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "completing" && (
          <>
            <DialogHeader>
              <DialogTitle>Completing Order</DialogTitle>
              <DialogDescription>Please wait while we process your request...</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
