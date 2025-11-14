"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPercentage } from "@/lib/utils"

interface PricingSectionProps {
  unitPrice: string
  sellingPrice: string
  onUnitPriceChange: (value: string) => void
  onSellingPriceChange: (value: string) => void
}

export function PricingSection({
  unitPrice,
  sellingPrice,
  onUnitPriceChange,
  onSellingPriceChange
}: PricingSectionProps) {
  const profitMargin = unitPrice && sellingPrice && Number.parseFloat(unitPrice) > 0
    ? formatPercentage(((Number.parseFloat(sellingPrice) - Number.parseFloat(unitPrice)) / Number.parseFloat(unitPrice)) * 100)
    : null

  const profitPerUnit = unitPrice && sellingPrice && Number.parseFloat(unitPrice) > 0
    ? (Number.parseFloat(sellingPrice) - Number.parseFloat(unitPrice)).toFixed(2)
    : null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
        Pricing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit_price" className="text-sm font-medium">
            Unit Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unit_price"
            type="number"
            step="0.01"
            min="0"
            value={unitPrice}
            onChange={(e) => onUnitPriceChange(e.target.value)}
            placeholder="0.00"
            className="mt-1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="selling_price" className="text-sm font-medium">
            Selling Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="selling_price"
            type="number"
            step="0.01"
            min="0"
            value={sellingPrice}
            onChange={(e) => onSellingPriceChange(e.target.value)}
            placeholder="0.00"
            className="mt-1.5"
            required
          />
        </div>

        {profitMargin && profitPerUnit && (
          <div className="md:col-span-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Profit Margin</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {profitMargin}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Profit per Unit</p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{profitPerUnit}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

