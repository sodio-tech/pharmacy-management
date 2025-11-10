import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Trash2, Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '@/contexts/UserContext'
import { backendApi } from '@/lib/axios-config'

interface UserProfile {
  id: number
  fullname: string
  email: string
  phone_number: string
  pharmacy_name: string
  image?: string
  role: string
  subscription_status: string
}

const Profile = () => {
  const { user: sessionUser, isLoading: isPending, refetch } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    pharmacy_name: '',
    image: '',
    role: '',
    subscription_status: ''
  })

  // Initialize form data when user loads
  useEffect(() => {
    if (sessionUser) {
      setFormData({
        id: sessionUser.id,
        fullname: sessionUser.fullname || '',
        email: sessionUser.email || '',
        phone_number: sessionUser.phone_number || '',
        pharmacy_name: sessionUser.pharmacy_name || '',
        image: sessionUser.image || '',
        role: sessionUser.role || '',
        subscription_status: sessionUser.subscription_status || ''
      })
    }
  }, [sessionUser?.id]) // Only depend on user ID to avoid infinite loops

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = async () => {
    if (!sessionUser) return

    setIsUpdating(true)
    try {
      const updateData = {
        fullname: formData.fullname,
        phone_number: formData.phone_number,
        pharmacy_name: formData.pharmacy_name,
      }

      await backendApi.put('/v1/profile', updateData)
      await refetch()
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    if (sessionUser) {
      setFormData({
        id: sessionUser.id,
        fullname: sessionUser.fullname || '',
        email: sessionUser.email || '',
        phone_number: sessionUser.phone_number || '',
        pharmacy_name: sessionUser.pharmacy_name || '',
        image: sessionUser.image || '',
        role: sessionUser.role || '',
        subscription_status: sessionUser.subscription_status || ''
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { imageUrl } = await response.json()
        await backendApi.put('/v1/profile', { image: imageUrl })
        await refetch()
        toast.success('Profile image updated successfully!')
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = async () => {
    setIsLoading(true)
    try {
      await backendApi.put('/v1/profile', { image: null })
      await refetch()
      toast.success('Profile image removed successfully!')
    } catch (error) {
      console.error('Error removing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f766e]" />
      </div>
    )
  }

  if (!sessionUser) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6b7280]">Please log in to view your profile.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Information Form */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-6">Profile Information</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#374151] font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                className="bg-white border-[#e5e7eb]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#374151] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50 border-[#e5e7eb] text-gray-500"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#374151] font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className="bg-white border-[#e5e7eb]"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="pharmacyName" className="text-[#374151] font-medium">
              Pharmacy Name
            </Label>
            <Input
              id="pharmacyName"
              value={formData.pharmacy_name}
              onChange={(e) => handleInputChange('pharmacy_name', e.target.value)}
              className="bg-white border-[#e5e7eb]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            onClick={handleSaveChanges}
            disabled={isUpdating}
            className="bg-[#0f766e] hover:bg-[#0f766e]/90 text-white disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
            className="border-[#e5e7eb] text-[#6b7280] bg-transparent disabled:opacity-50"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-6">Profile Photo</h2>

        <div className="flex flex-col items-center">
          <div className="relative">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                <span className="text-4xl font-semibold text-gray-500">
                  {formData.fullname?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 w-full">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isLoading}
              className="w-full border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb] bg-transparent disabled:opacity-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isLoading ? 'Uploading...' : 'Change Photo'}
            </Button>
            {formData.image && (
              <Button
                variant="outline"
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="w-full border-[#e5e7eb] text-[#ef4444] hover:bg-[#fef2f2] hover:border-[#ef4444] bg-transparent disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile