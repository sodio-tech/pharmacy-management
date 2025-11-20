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

interface BookDemoModalProps {
  children: React.ReactNode
}

export function BookDemoModal({ children }: BookDemoModalProps) {
  const [name, setName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add your form submission logic here
    console.log("Demo booking submitted:", { name, contactNumber })
    // Reset form and close modal
    setName("")
    setContactNumber("")
    setIsOpen(false)
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
          <Button type="submit" className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90 text-white">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
