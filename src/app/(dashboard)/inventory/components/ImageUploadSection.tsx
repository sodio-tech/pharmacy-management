"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon, X, Upload } from "lucide-react"
import { toast } from "react-toastify"

interface ImageUploadSectionProps {
  imagePreviews: Array<{ file: File; preview: string }>
  imageUrls: string[]
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFilesDrop?: (files: File[]) => void
  onRemoveImage: (index: number) => void
  onRemoveExistingImage: (index: number) => void
  isLoading: boolean
}

export function ImageUploadSection({
  imagePreviews,
  imageUrls,
  onImageChange,
  onFilesDrop,
  onRemoveImage,
  onRemoveExistingImage,
  isLoading
}: ImageUploadSectionProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('Drop triggered:', { acceptedFiles: acceptedFiles.length, rejectedFiles: rejectedFiles.length })
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors: string[] = []
      rejectedFiles.forEach(({ file, errors: fileErrors }) => {
        fileErrors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            errors.push(`"${file.name}" is too large. Maximum size is 10MB`)
          } else if (error.code === 'file-invalid-type') {
            errors.push(`"${file.name}" is not a valid image file`)
          } else {
            errors.push(`"${file.name}": ${error.message}`)
          }
        })
      })
      if (errors.length > 0) {
        errors.forEach(error => {
          toast.error(error)
        })
      }
    }

    // Handle accepted files
    if (acceptedFiles.length === 0) {
      if (rejectedFiles.length === 0) return
      return // Only rejected files, no accepted ones
    }
    
    console.log('Processing accepted files:', acceptedFiles.map(f => f.name))
    
    if (onFilesDrop) {
      onFilesDrop(acceptedFiles)
    } else {
      // Fallback: create a synthetic event for backward compatibility
      const dataTransfer = new DataTransfer()
      acceptedFiles.forEach(file => dataTransfer.items.add(file))
      const syntheticEvent = {
        target: {
          files: dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>
      onImageChange(syntheticEvent)
    }
  }, [onImageChange, onFilesDrop])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    disabled: isLoading,
    noClick: false,
    noKeyboard: false,
    preventDropOnDocument: true
  })

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
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              isDragActive
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/20 border-solid'
                : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input {...getInputProps()} id="image" />
            <div className="space-y-2">
              {isDragActive ? (
                <>
                  <Upload className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto animate-bounce" />
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
                    Drop images here...
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto" />
                  <div>
                    <span className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium text-sm">
                      Click to upload
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm"> or drag and drop</span>
                  </div>
                </>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, WEBP up to 10MB each (Multiple images supported)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

