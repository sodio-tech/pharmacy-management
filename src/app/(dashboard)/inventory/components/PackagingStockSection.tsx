"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProductUnits } from "@/hooks/useProductUnits"

interface PackagingStockSectionProps {
  unitId: string
  packSize: string
  stock: string
  onUnitIdChange: (value: string) => void
  onPackSizeChange: (value: string) => void
  onStockChange: (value: string) => void
}

export function PackagingStockSection({
  unitId,
  packSize,
  stock,
  onUnitIdChange,
  onPackSizeChange,
  onStockChange
}: PackagingStockSectionProps) {
  const { units, isLoading: isLoadingUnits } = useProductUnits()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
        Packaging & Stock Levels
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit_id" className="text-sm font-medium">
            Unit
          </Label>
          <Select
            value={unitId}
            onValueChange={onUnitIdChange}
            disabled={isLoadingUnits}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder={isLoadingUnits ? "Loading units..." : "Select unit"} />
            </SelectTrigger>
            <SelectContent>
              {units.length > 0 ? (
                units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id.toString()}>
                    {unit.unit}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  {isLoadingUnits ? "Loading units..." : "No units available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pack_size" className="text-sm font-medium">
            Pack Size
          </Label>
          <Input
            id="pack_size"
            type="number"
            min="1"
            value={packSize}
            onChange={(e) => onPackSizeChange(e.target.value)}
            placeholder="1"
            className="mt-1.5 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
          />
        </div>

        <div>
          <Label htmlFor="stock" className="text-sm font-medium">
            Stock
          </Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => onStockChange(e.target.value)}
            placeholder="0"
            className="mt-1.5 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
          />
        </div>
      </div>
    </div>
  )
}

