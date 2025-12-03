
"use client"
import { API } from "@/app/utils/constants"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { useState, useMemo } from "react"
import { toast } from "react-toastify"
import countries from "world-countries"

interface BookDemoModalProps {
  children: React.ReactNode
}

export function BookDemoModal({ children }: BookDemoModalProps) {
  const [name, setName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [countryName, setCountryName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const countriesList = useMemo(() => {
    return countries
      .map((c) => ({
        name: c.name.common,
        flag: c.flag,
        code: c.cca2,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!countryCode || !countryName) {
      toast.error("Please select a country")
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        name: name,
        phone_number: contactNumber,
        countryCode: countryCode,
        countryName: countryName,
      }

      const response = await axios.post(`${API}/api/v1/admin/book-demo`, payload)

      if (response.status === 200 || response.status === 201) {
        toast.success("Details submitted successfully! We'll get back to you shortly.")

        setIsLoading(false)
        setName("")
        setContactNumber("")
        setCountryCode("")
        setCountryName("")
        setIsOpen(false)
      }
    } catch (err: unknown) {
      console.error("Error submitting demo booking:", err)
      const error = err as {
        response?: {
          data?: {
            message?: string
            error?: string
          }
        }
        message?: string
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit demo booking. Please try again."

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Book a Demo</DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in your details and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact" className="text-sm font-medium text-gray-900">
              Contact Number
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="Enter your contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-900">
              Select Country
            </Label>
            <Select
              value={countryCode}
              onValueChange={(value) => {
                const selectedCountry = countriesList.find((c) => c.code === value)
                setCountryCode(value)
                setCountryName(selectedCountry?.name || "")
              }}
            >
              <SelectTrigger className="w-full border-gray-300 bg-white">
                <SelectValue placeholder="Select country..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countriesList.map((c) => (
                  <SelectItem key={c.code} value={c.code} textValue={c.name}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !name || !contactNumber || !countryCode}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}