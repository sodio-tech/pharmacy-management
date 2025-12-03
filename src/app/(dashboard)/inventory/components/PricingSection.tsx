"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPercentage } from "@/lib/utils"

interface PricingSectionProps {
  unitPrice: string
  sellingPrice: string
  gstPercent: string
  onUnitPriceChange: (value: string) => void
  onSellingPriceChange: (value: string) => void
  onGstPercentChange: (value: string) => void
}

export function PricingSection({
  unitPrice,
  sellingPrice,
  gstPercent,
  onUnitPriceChange,
  onSellingPriceChange,
  onGstPercentChange
}: PricingSectionProps) {
  const unitPriceNum = Number.parseFloat(unitPrice) || 0
  const sellingPriceNum = Number.parseFloat(sellingPrice) || 0
  const gstPercentNum = Number.parseFloat(gstPercent) || 0

  let profitMargin = null
  let totalSellingPrice = null
  let gstAmount = null
  let profitAmount = null
  let basePrice = null

  if (unitPriceNum > 0 && sellingPriceNum > 0) {
    // Selling price already includes GST, so total price = selling price
    totalSellingPrice = sellingPriceNum
    
    if (gstPercentNum > 0) {
      // GST Amount = Selling Price * (GST% / 100)
      gstAmount = (sellingPriceNum * gstPercentNum) / 100
      // Base Price = Selling Price - GST Amount
      basePrice = sellingPriceNum - gstAmount
      // Profit amount = Base Price - Cost Price (GST is already included in selling price)
      profitAmount = basePrice - unitPriceNum
    } else {
      // No GST case
      gstAmount = 0
      basePrice = sellingPriceNum
      profitAmount = sellingPriceNum - unitPriceNum
    }
    
    // Profit margin = (profit amount / cost price) * 100
    if (unitPriceNum > 0) {
      profitMargin = formatPercentage((profitAmount / unitPriceNum) * 100)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
        Pricing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="unit_price" className="text-sm font-medium">
            Cost Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unit_price"
            type="number"
            step="0.01"
            min="0"
            value={unitPrice}
            onChange={(e) => onUnitPriceChange(e.target.value)}
            placeholder="0.00"
            className="mt-1.5 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
            required
          />
        </div>

        <div>
          <Label htmlFor="selling_price" className="text-sm font-medium">
           Total Price (with GST) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="selling_price"
            type="number"
            step="0.01"
            min="0"
            value={sellingPrice}
            onChange={(e) => onSellingPriceChange(e.target.value)}
            placeholder="0.00"
            className="mt-1.5 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
            required
          />
        </div>

        <div>
          <Label htmlFor="gst_percent" className="text-sm font-medium">
            GST % <span className="text-red-500">*</span>
          </Label>
          <Input
            id="gst_percent"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={gstPercent}
            onChange={(e) => {
              const value = e.target.value
              // Allow empty string for clearing
              if (value === '') {
                onGstPercentChange('')
                return
              }
              const numValue = Number.parseFloat(value)
              // Only allow values between 0 and 100
              if (!Number.isNaN(numValue)) {
                if (numValue < 0) {
                  onGstPercentChange('0')
                } else if (numValue > 100) {
                  onGstPercentChange('100')
                } else {
                  onGstPercentChange(value)
                }
              }
            }}
            onBlur={(e) => {
              // Ensure value is within range on blur
              const value = e.target.value
              if (value !== '') {
                const numValue = Number.parseFloat(value)
                if (!Number.isNaN(numValue)) {
                  if (numValue < 0) {
                    onGstPercentChange('0')
                  } else if (numValue > 100) {
                    onGstPercentChange('100')
                  }
                }
              }
            }}
            placeholder="0.00"
            className="mt-1.5 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
            required
          />
        </div>

        {profitMargin && totalSellingPrice !== null && (
          <div className="md:col-span-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">GST Amount</p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{gstAmount !== null ? gstAmount.toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Total Price (with GST)</p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{sellingPrice !== null ? Number(sellingPrice).toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Profit Amount</p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{profitAmount !== null ? profitAmount.toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Profit Margin</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {profitMargin}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
