"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, User, Phone, Mail, Calendar, Users, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Customer } from "@/types/sales"
import { backendApi } from "@/lib/axios-config"

import { toast } from "react-toastify"

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customerData: Customer) => void
  existingCustomer?: Customer | null
}

export function CustomerModal({ isOpen, onClose, onSave, existingCustomer }: CustomerModalProps) {
  const [mode, setMode] = useState<"list" | "create">(existingCustomer ? "create" : "list")
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    patient_name: existingCustomer?.patient_name || "",
    patient_phone: existingCustomer?.patient_phone || "",
    patient_email: existingCustomer?.patient_email || "",
    age: "",
    gender: "",
  })

  useEffect(() => {
    if (isOpen && mode === "list") {
      fetchCustomers()
    }
  }, [isOpen, mode])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(
        (customer) =>
          customer.patient_name?.toLowerCase().includes(query) ||
          customer.patient_phone?.includes(query) ||
          customer.patient_email?.toLowerCase().includes(query),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await backendApi.get("/v1/customer/customer-list")
      const data = response.data

      if (data.success) {
        // Map API response to Customer type
        const mappedCustomers: Customer[] = data.data.customers.map((customer: any) => ({
          id: customer.id,
          patient_name: customer.name || "",
          patient_phone: customer.phone_number || "",
          patient_email: customer.email || "",
          age: customer.age,
          gender: customer.gender,
        }))
        setCustomers(mappedCustomers)
        setFilteredCustomers(mappedCustomers)
      } else {
        toast.error("Failed to fetch customers")
      }
    } catch (error: unknown) {
      console.error("[v0] Error fetching customers:", error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err?.response?.data?.message || "Error connecting to the server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectCustomer = (customer: Customer) => {
    onSave(customer)
    toast.success("Customer selected")
    onClose()
    setMode("list")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.patient_name.trim() && !formData.patient_phone.trim()) {
      toast.error("At least one of customer name or phone number is required")
      return
    }

    setIsLoading(true)

    try {
      const payload: {
        name?: string
        phone_number?: string
        email?: string
        age?: number
        gender?: string
      } = {}

      if (formData.patient_name.trim()) {
        payload.name = formData.patient_name.trim()
      }
      if (formData.patient_phone.trim()) {
        payload.phone_number = formData.patient_phone.trim()
      }
      if (formData.patient_email.trim()) {
        payload.email = formData.patient_email.trim()
      }
      if (formData.age.trim()) {
        const ageNum = Number.parseInt(formData.age.trim(), 10)
        if (!isNaN(ageNum) && ageNum > 0) {
          payload.age = ageNum
        }
      }
      if (formData.gender) {
        payload.gender = formData.gender
      }

      const response = await backendApi.post("/v1/customer/new-customer", payload)
      const data = response.data?.data

      const customerData: Customer = {
        id: data?.id,
        patient_name: data?.name || "",
        patient_phone: data?.phone_number || "",
        patient_email: data?.email || formData.patient_email || "",
        age: data?.age,
        gender: data?.gender,
        created_at: data?.created_at,
      }

      onSave(customerData)
      toast.success("Customer created successfully")
      onClose()
      setMode("list")
    } catch (error: unknown) {
      console.error("[v0] Error creating customer:", error)
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string }
      const errorMessage =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to create customer"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setMode("list")
    setSearchQuery("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold">
            {mode === "list" ? "Select Customer" : existingCustomer ? "Edit Customer" : "Add New Customer"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {mode === "list" ? (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Create New Button */}
              <Button
                variant="outline"
                className="w-full border-dashed border-2 bg-transparent"
                onClick={() => setMode("create")}
              >
                <User className="h-4 w-4 mr-2" />
                Create New Customer
              </Button>

              {/* Customer List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    <span className="ml-3 text-muted-foreground">Loading customers...</span>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      {searchQuery ? "No customers found matching your search" : "No customers available"}
                    </p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                    >
                       <Avatar className="h-12 w-12 bg-teal-100">
                         <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                           {(customer.patient_name || "")
                             .split(" ")
                             .map((n) => n[0])
                             .join("")
                             .toUpperCase()
                             .slice(0, 2)}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                         <p className="font-semibold text-sm">{customer.patient_name}</p>
                         <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                           <span className="flex items-center">
                             <Phone className="h-3 w-3 mr-1" />
                             {customer.patient_phone}
                           </span>
                           {customer.patient_email && (
                             <span className="flex items-center">
                               <Mail className="h-3 w-3 mr-1" />
                               {customer.patient_email}
                             </span>
                           )}
                          {customer.age && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {customer.age} yrs
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Customer Name</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => handleInputChange("patient_name", e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_phone">Phone Number</Label>
                  <Input
                    id="patient_phone"
                    value={formData.patient_phone}
                    onChange={(e) => handleInputChange("patient_phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_email">Email Address</Label>
                  <Input
                    id="patient_email"
                    type="email"
                    value={formData.patient_email}
                    onChange={(e) => handleInputChange("patient_email", e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label className="w-full" htmlFor="gender">
                    Gender
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                <Button variant="outline" onClick={() => setMode("list")}>
                  Back to List
                </Button>
                <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                  {isLoading ? "Saving..." : existingCustomer ? "Update Customer" : "Save Customer"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
