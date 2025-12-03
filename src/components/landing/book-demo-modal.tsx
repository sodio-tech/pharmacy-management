
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
} from "@/components/ui/select"
import axios from "axios"
import { useState, useMemo } from "react"
import { toast } from "react-toastify"
import { all } from "country-codes-list"

interface Country {
  name: string
  flag: string
  code: string
  dialingCode: string
}

interface BookDemoModalProps {
  children: React.ReactNode
}

export function BookDemoModal({ children }: BookDemoModalProps) {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState("IN")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const countriesList = useMemo(() => {
    const seenCodes = new Set<string>()
    return all()
      .map((c) => ({
        name: c.countryNameEn || "",
        flag: c.flag || "",
        code: c.countryCode || "",
        dialingCode: c.countryCallingCode ? `+${c.countryCallingCode}` : "",
      }))
      .filter((c: Country) => {
        // Only include countries with dialing codes and remove duplicates
        if (!c.dialingCode || !c.code || !c.name) return false
        if (seenCodes.has(c.code)) return false
        seenCodes.add(c.code)
        return true
      })
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name))
  }, [])

  const selectedCountry = useMemo(() => {
    return countriesList.find((c) => c.code === selectedCountryCode) || countriesList[0]
  }, [selectedCountryCode, countriesList])

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow digits
    if (value.length <= 10) {
      setPhoneNumber(value)
    }
  }

  const formatPhoneNumber = (value: string) => {
    if (value.length === 0) return ""
    if (value.length <= 3) return value
    if (value.length <= 6) return `${value.slice(0, 3)}-${value.slice(3)}`
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCountry) {
      toast.error("Please select a country")
      return
    }

    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    setIsLoading(true)

    try {
      const fullPhoneNumber = `${selectedCountry.dialingCode}${phoneNumber}`
      
      const payload = {
        name: name,
        phone_number: fullPhoneNumber,
        country_code: selectedCountry.code,
        country_name: selectedCountry.name,
      }

      const response = await axios.post(`${API}/api/v1/admin/book-demo`, payload)

      if (response.data.success) {
        toast.success("Details submitted successfully! We'll get back to you shortly.")

        setIsLoading(false)
        setName("")
        setPhoneNumber("")
        setSelectedCountryCode("IN")
        setIsOpen(false)
      }else{
        toast.error("Failed to submit demo booking. Please try again.")
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
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
              Phone Number
            </Label>
            <div className="relative flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
              <Select
                value={selectedCountryCode}
                onValueChange={(value) => {
                  setSelectedCountryCode(value)
                }}
              >
                <SelectTrigger className="w-auto min-w-[100px] border-0 border-r border-gray-300 rounded-r-none rounded-l-md bg-transparent focus:ring-0 focus:ring-offset-0 h-full px-3 py-2 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedCountry?.flag}</span>
                    <span className="text-sm font-medium">{selectedCountry?.dialingCode}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countriesList.map((c, index) => (
                    <SelectItem key={`${c.code}-${index}`} value={c.code} textValue={c.name}>
                      <span className="flex items-center gap-2 w-full">
                        <span className="text-lg">{c.flag}</span>
                        <span className="flex-1">{c.name}</span>
                        <span className="text-gray-500">{c.dialingCode}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder={formatPhoneNumber("2015555555")}
                value={formatPhoneNumber(phoneNumber)}
                onChange={handlePhoneNumberChange}
                required
                className="border-0 rounded-l-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 pl-3 flex-1"
                maxLength={12}
              />
            </div>
            <p className="text-xs text-gray-500">Enter 10-digit phone number</p>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !name || !phoneNumber || phoneNumber.length !== 10}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}