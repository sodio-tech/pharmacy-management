"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { API } from "@/app/utils/constants"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      const payload = {
        name: formData.name,
        phone_number: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }

      const response = await axios.post(`${API}/api/v1/admin/contact-us`, payload)
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Message sent successfully! We'll get back to you within 24 hours.")
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      }
    } catch (err: unknown) {
      console.error("Error submitting contact form:", err)
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
        "Failed to send message. Please try again."
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-16 bg-[#f9fafb]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Send Us a Message</h2>
          <p className="text-base text-[#4b5563]">Fill out the form below and we'll get back to you within 24 hours.</p>
        </div>

        <Card className="max-w-2xl mx-auto p-6 md:p-8 border-[#e5e7eb]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#111827]">
                  Name <span className="text-[#ec4899]">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-[#e5e7eb]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#111827]">
                  Email <span className="text-[#ec4899]">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-[#e5e7eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#111827]">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-[#e5e7eb]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[#111827]">
                  Subject <span className="text-[#ec4899]">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="border-[#e5e7eb]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[#111827]">
                Message <span className="text-[#ec4899]">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="border-[#e5e7eb] resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f766e] text-white hover:bg-[#0f766e]/90 h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
