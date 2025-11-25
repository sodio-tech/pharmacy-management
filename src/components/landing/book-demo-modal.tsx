"use client"

import type React from "react"

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
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { API } from "@/app/utils/constants"

interface BookDemoModalProps {
  children: React.ReactNode
}

export function BookDemoModal({ children }: BookDemoModalProps) {
  const [name, setName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      const payload = {
        name: name,
        phone_number: contactNumber,
      }

      const response = await axios.post(`${API}/api/v1/admin/book-demo`, payload)
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Details submitted successfully! We'll get back to you shortly.")
        
        // Reset form and close modal
        setName("")
        setContactNumber("")
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
          <DialogTitle className="text-2xl font-bold text-[#111827]">Book a Demo</DialogTitle>
          <DialogDescription className="text-[#4b5563]">
            Fill in your details and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[#111827]">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-[#e5e7eb]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact" className="text-sm font-medium text-[#111827]">
              Contact Number
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="Enter your contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="border-[#e5e7eb]"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
