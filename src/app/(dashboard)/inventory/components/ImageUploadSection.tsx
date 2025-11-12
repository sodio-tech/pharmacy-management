"use client"

import { useRef } from "react"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon, X } from "lucide-react"

interface ImageUploadSectionProps {
  imagePreviews: Array<{ file: File; preview: string }>
  imageUrls: string[]
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onRemoveExistingImage: (index: number) => void
  isLoading: boolean
}

export function ImageUploadSection({
  imagePreviews,
  imageUrls,
  onImageChange,
  onRemoveImage,
  onRemoveExistingImage,
  isLoading
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
        Product Images
      </h3>
      <div className="space-y-4">
        {/* Existing Images Preview (Edit Mode) */}
        {imageUrls.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Existing Images
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Preview */}
        {imagePreviews.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New Images ({imagePreviews.length})
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((item, index) => (
                <div key={index} className="relative group">
                  <img
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                    {item.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-3">
          <Label htmlFor="image" className="text-sm font-medium">
            Product Images
          </Label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept="image/*"
              multiple
              onChange={onImageChange}
              className="hidden"
              disabled={isLoading}
            />
            <div className="space-y-2">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                >
                  Click to upload
                </button>
                <span className="text-gray-500 text-sm"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each (Multiple images supported)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

