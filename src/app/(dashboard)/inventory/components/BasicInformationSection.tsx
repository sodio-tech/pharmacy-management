"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { backendApi } from "@/lib/axios-config"
import { Loader2 } from "lucide-react"

interface BasicInformationSectionProps {
  formData: {
    name: string
    generic_name: string
    manufacturer: string
    description: string
    requires_prescription: boolean
  }
  onInputChange: (field: string, value: any) => void
}

interface ProductSuggestion {
  name: string
}

export function BasicInformationSection({ formData, onInputChange }: BasicInformationSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Sync searchTerm with formData.name when formData.name changes externally (e.g., when editing existing product)
  useEffect(() => {
    if (formData.name !== searchTerm) {
      setSearchTerm(formData.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name])

  // Debounce search and fetch suggestions
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (searchTerm.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        fetchProductSuggestions(searchTerm.trim())
      }, 500) // 500ms debounce delay
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  const fetchProductSuggestions = useCallback(async (term: string) => {
    if (!term || term.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const response = await backendApi.get(`/v1/products/global?search=${encodeURIComponent(term)}`)
      const data = response.data?.data || response.data
      const products = data?.products || []
      setSuggestions(products)
      setShowSuggestions(products.length > 0)
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Error fetching product suggestions:", error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }, [])

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    onInputChange("name", value)
    setShowSuggestions(true)
  }

  const handleSelectSuggestion = (productName: string) => {
    setSearchTerm(productName)
    onInputChange("name", productName)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[selectedIndex].name)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 relative">
          <Label htmlFor="name" className="text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Input
              ref={inputRef}
              id="name"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Paracetamol 500mg"
              className="w-full"
            />
            {isLoadingSuggestions && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion.name)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-teal-50 dark:bg-teal-900/20 text-teal-900 dark:text-teal-100"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <div className="text-sm font-medium">{suggestion.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="generic_name" className="text-sm font-medium">
            Generic Name
          </Label>
          <Input
            id="generic_name"
            value={formData.generic_name}
            onChange={(e) => onInputChange("generic_name", e.target.value)}
            placeholder="e.g., Acetaminophen"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="manufacturer" className="text-sm font-medium">
            Manufacturer
          </Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => onInputChange("manufacturer", e.target.value)}
            placeholder="e.g., Pfizer Inc."
            className="mt-1.5"
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="requires_prescription"
            checked={formData.requires_prescription}
            onChange={(e) => onInputChange("requires_prescription", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <Label htmlFor="requires_prescription" className="text-sm font-medium cursor-pointer">
            Requires Prescription
          </Label>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Product description, usage instructions, etc."
            rows={3}
            className="mt-1.5 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

