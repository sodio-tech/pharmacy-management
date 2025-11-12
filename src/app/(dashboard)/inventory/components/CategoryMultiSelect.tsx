"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { useProductCategories } from "@/hooks/useProductCategories"

interface CategoryMultiSelectProps {
  selectedCategoryIds: number[]
  onCategoryChange: (categoryIds: number[]) => void
}

export function CategoryMultiSelect({ selectedCategoryIds, onCategoryChange }: CategoryMultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { categories, isLoading: isLoadingCategories } = useProductCategories()

  const filteredCategories = categories.filter((cat) =>
    cat.category_name.toLowerCase().replace(/_/g, " ").includes(searchTerm.toLowerCase())
  )

  const handleCategoryToggle = (catId: number) => {
    const isSelected = selectedCategoryIds.includes(catId)
    if (isSelected) {
      onCategoryChange(selectedCategoryIds.filter(id => id !== catId))
    } else {
      onCategoryChange([...selectedCategoryIds, catId])
    }
  }

  return (
    <div className="md:col-span-2 w-full">
      <Label htmlFor="category" className="text-sm font-medium">
        Categories <span className="text-red-500">*</span>
      </Label>
      {/* Search Input */}
      <div className="mt-1.5 mb-2 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-48 overflow-y-auto bg-white dark:bg-gray-800">
        {isLoadingCategories ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : filteredCategories.length > 0 ? (
          <div className="space-y-2">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id)
              return (
                <div
                  key={cat.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleCategoryToggle(cat.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by parent div onClick
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <Label
                    htmlFor={`category-${cat.id}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {cat.category_name.replace(/_/g, " ")}
                  </Label>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {searchTerm ? `No categories found matching "${searchTerm}"` : "No categories available"}
          </p>
        )}
      </div>
      {selectedCategoryIds.length > 0 && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {selectedCategoryIds.length} category{selectedCategoryIds.length > 1 ? 'ies' : 'y'} selected
        </p>
      )}
    </div>
  )
}

