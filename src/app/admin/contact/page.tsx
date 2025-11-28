"use client"

import { useState, useEffect, useCallback } from "react"
import { Suspense } from "react"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { LoadingFallback } from "@/components/loading-fallback"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronLeft, ChevronRight, Mail, Phone, User, MessageSquare, Calendar } from "lucide-react"
import { backendApi } from "@/lib/axios-config"

interface ContactRequest {
  id: number
  name: string
  email: string
  phone_number: string
  message: string
  subject: string | null
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    contact_requests: ContactRequest[]
    page: number
    limit: number
    total_pages: number
    total: string | number
  }
}

export default function AdminContactPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)

  const fetchContactRequests = useCallback(
    async (page: number) => {
      setLoading(true)
      setError(null)
      try {
        const response = await backendApi.get<ApiResponse>(`/v1/admin/contact-us/list?page=${page}&limit=${limit}`)

        if (response.data.success && response.data.data) {
          const data = response.data.data
          setRequests(data.contact_requests || [])
          setCurrentPage(data.page || 1)
          setTotalPages(data.total_pages || 1)
          setTotal(typeof data.total === "string" ? Number.parseInt(data.total, 10) : data.total || 0)
        } else {
          setRequests([])
          setError("Failed to load contact requests")
        }
      } catch (err: unknown) {
        console.error("Error fetching contact requests:", err)
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load contact requests"
        setError(errorMessage)
        setRequests([])
      } finally {
        setLoading(false)
      }
    },
    [limit],
  )

  useEffect(() => {
    fetchContactRequests(currentPage)
  }, [currentPage, fetchContactRequests])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <LayoutSkeleton header={<DynamicHeader maintext="Contact List" para="View and manage contact requests" />}>
      <Suspense fallback={<LoadingFallback />}>
        <div>
          <div className="mx-auto max-w-[1400px]">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse" />
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 relative" />
                  </div>
                  <span className="mt-4 text-sm font-medium text-gray-600">Loading contact requests...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="rounded-full bg-red-50 p-4 mb-4">
                    <MessageSquare className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 font-medium text-center">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-transparent"
                    onClick={() => fetchContactRequests(currentPage)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <Mail className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No contact requests found</p>
                  <p className="text-gray-500 text-sm mt-1">Contact requests will appear here when submitted</p>
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-200 bg-gradient-to-br from-blue-50 via-blue-50/50 to-white px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">All Contact Requests</h3>
                        <p className="text-sm text-gray-600 mt-1.5">Manage and review customer inquiries</p>
                      </div>
                      <Badge variant="secondary" className="w-fit px-4 py-2 bg-blue-600 text-white border-0 shadow-sm">
                        <User className="w-4 h-4 mr-2" />
                        {total} {total === 1 ? "Request" : "Requests"}
                      </Badge>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                          <TableHead className="font-semibold text-gray-700 h-12 px-6">ID</TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              Name
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[220px]">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              Email
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[140px]">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              Phone
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[140px]">Subject</TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[280px]">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-500" />
                              Message
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              Created
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              Updated
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow
                            key={request.id}
                            className="hover:bg-blue-50/40 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <TableCell className="font-mono text-xs text-gray-500 px-6 py-5">#{request.id}</TableCell>
                            <TableCell className="font-medium text-gray-900 px-6 py-5">{request.name}</TableCell>
                            <TableCell className="text-gray-600 px-6 py-5">{request.email}</TableCell>
                            <TableCell className="text-gray-600 font-mono text-sm px-6 py-5">
                              {request.phone_number}
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              {request.subject ? (
                                <Badge
                                  variant="outline"
                                  className="font-normal text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {request.subject}
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-5">
                              <div
                                className="max-w-[280px] truncate text-gray-700 text-sm leading-relaxed"
                                title={request.message}
                              >
                                {request.message}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm whitespace-nowrap px-6 py-5">
                              {formatDate(request.created_at)}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm whitespace-nowrap px-6 py-5">
                              {formatDate(request.updated_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                          Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                          <span className="font-semibold text-gray-900">{totalPages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1 || loading}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-50 bg-transparent"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || loading}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-50 bg-transparent"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </LayoutSkeleton>
  )
}
