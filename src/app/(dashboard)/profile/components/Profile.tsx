import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Camera, Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '@/contexts/UserContext'
import { backendApi } from '@/lib/axios-config'
import countries from 'world-countries'

interface UserProfile {
  id: number
  fullname: string
  email: string
  phone_number: string
  pharmacy_name: string
  image?: string
  role: string
  subscription_status?: string
  country?: string
  currency?: string
}

interface Country {
  code: string
  name: string
  currency: string
  currencyCode: string
}

// Get countries from world-countries library and map to our format
const getCountriesWithCurrencies = (): Country[] => {
  return countries
    .filter((country) => country.cca2 && country.currencies) // Filter countries with currency data
    .map((country) => {
      // Get first currency (most countries have one primary currency)
      const currencyCode = Object.keys(country.currencies || {})[0] || ''
      const currencyInfo = country.currencies?.[currencyCode]
      const currencyName = currencyInfo?.name || currencyCode
      
      return {
        code: country.cca2, // ISO 3166-1 alpha-2 code (e.g., 'IN', 'US')
        name: country.name.common, // Common name
        currency: currencyName,
        currencyCode: currencyCode
      }
    })
    .filter((country) => country.currencyCode) // Only include countries with valid currency
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
}

// Memoize countries list for performance
const COUNTRIES = getCountriesWithCurrencies()

const Profile = () => {
  const { user: sessionUser, isLoading: isPending, refetch } = useUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null)
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    pharmacy_name: '',
    image: '',
    role: '',
    subscription_status: '',
    country: 'IN', // Default to India (INR)
    currency: 'INR'
  })

  // Initialize form data when user loads or image updates
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
        subscription_status: sessionUser.subscription_status || '',
        country: (sessionUser as any).country || 'IN', // Default to India
        currency: (sessionUser as any).currency || 'INR' // Default to INR
      })
    }
  }, [sessionUser?.id, sessionUser?.image]) // Update when user ID or image changes

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
      // Create FormData for form-data body type
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append('new_name', formData.fullname)
      formDataToSend.append('phone_number', formData.phone_number)
      formDataToSend.append('pharmacy_name', formData.pharmacy_name)
      if (formData.country) {
        formDataToSend.append('country', formData.country)
      }
      if (formData.currency) {
        formDataToSend.append('currency', formData.currency)
      }
      
      // Add profile photo file if selected
      if (selectedProfilePhoto) {
        formDataToSend.append('profile_photo', selectedProfilePhoto)
      }

      await backendApi.put('/v1/update-profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Clear selected photo after successful update
      setSelectedProfilePhoto(null)
      await refetch()
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
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
        subscription_status: sessionUser.subscription_status || '',
        country: (sessionUser as any).country || 'IN',
        currency: (sessionUser as any).currency || 'INR'
      })
      setSelectedProfilePhoto(null)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Store the file in state to be sent with form data
    setSelectedProfilePhoto(file)
    
    // Create preview URL for immediate display
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }))
      }
    }
    reader.readAsDataURL(file)
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

          <div className="space-y-2">
            <Label htmlFor="country" className="text-[#374151] font-medium">
              Your Currency
            </Label>
            <Select
              value={formData.country || 'IN'}
              onValueChange={(value) => {
                const selectedCountry = COUNTRIES.find(c => c.code === value)
                if (selectedCountry) {
                  setFormData(prev => ({
                    ...prev,
                    country: selectedCountry.code,
                    currency: selectedCountry.currencyCode
                  }))
                }
              }}
            >
              <SelectTrigger className="w-full bg-white border-[#e5e7eb]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="flex-1">{country.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {country.currencyCode}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.currency && (
              <p className="text-xs text-gray-500">
                Selected currency: <span className="font-medium">{formData.currency}</span>
              </p>
            )}
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
            {isUpdating && (
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
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUpdating}
              className="w-full border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb] bg-transparent disabled:opacity-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile