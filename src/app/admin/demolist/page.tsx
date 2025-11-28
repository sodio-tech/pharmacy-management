"use client"

import { useState, useEffect, useCallback } from "react"
import { Suspense } from "react"
import LayoutSkeleton from "@/components/layout-skeleton"
import DynamicHeader from "@/components/DynamicHeader"
import { LoadingFallback } from "@/components/loading-fallback"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronLeft, ChevronRight, User, Phone, Calendar, PlayCircle } from "lucide-react"
import { backendApi } from "@/lib/axios-config"

interface DemoRequest {
  id: number
  name: string
  phone_number: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    page: number
    limit: number
    total_pages: number
    total: number
    requests: DemoRequest[]
  }
}

export default function DemoListPage() {
  const [requests, setRequests] = useState<DemoRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)

  const fetchDemoRequests = useCallback(
    async (page: number) => {
      setLoading(true)
      setError(null)
      try {
        const response = await backendApi.get<ApiResponse>(`/v1/admin/demo-requests/list?page=${page}&limit=${limit}`)

        if (response.data.success && response.data.data) {
          const data = response.data.data
          setRequests(data.requests || [])
          setCurrentPage(data.page || 1)
          setTotalPages(data.total_pages || 1)
          setTotal(data.total || 0)
        } else {
          setRequests([])
          setError("Failed to load demo requests")
        }
      } catch (err: unknown) {
        console.error("Error fetching demo requests:", err)
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load demo requests"
        setError(errorMessage)
        setRequests([])
      } finally {
        setLoading(false)
      }
    },
    [limit],
  )

  useEffect(() => {
    fetchDemoRequests(currentPage)
  }, [currentPage, fetchDemoRequests])

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
    <LayoutSkeleton header={<DynamicHeader maintext="Demo List" para="View and manage demo requests" />}>
      <Suspense fallback={<LoadingFallback />}>
        <div>
          <div className="mx-auto max-w-[1400px]">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-50 animate-pulse" />
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 relative" />
                  </div>
                  <span className="mt-4 text-sm font-medium text-gray-600">Loading demo requests...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="rounded-full bg-red-50 p-4 mb-4">
                    <PlayCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 font-medium text-center">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-transparent"
                    onClick={() => fetchDemoRequests(currentPage)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <PlayCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No demo requests found</p>
                  <p className="text-gray-500 text-sm mt-1">Demo requests will appear here when submitted</p>
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-200 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">All Demo Requests</h3>
                        <p className="text-sm text-gray-600 mt-1.5">Track and manage product demo inquiries</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-fit px-4 py-2 bg-emerald-600 text-white border-0 shadow-sm"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {total} {total === 1 ? "Request" : "Requests"}
                      </Badge>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                          <TableHead className="font-semibold text-gray-700 h-12 px-6">ID</TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              Name
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              Phone Number
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[180px]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              Created At
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 h-12 px-6 min-w-[180px]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              Updated At
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow
                            key={request.id}
                            className="hover:bg-emerald-50/40 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <TableCell className="font-mono text-xs text-gray-500 px-6 py-5">#{request.id}</TableCell>
                            <TableCell className="font-medium text-gray-900 px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-semibold text-sm shadow-sm">
                                  {request.name.charAt(0).toUpperCase()}
                                </div>
                                {request.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 font-mono text-sm px-6 py-5">
                              {request.phone_number}
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
                            className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-50 bg-transparent"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || loading}
                            className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-50 bg-transparent"
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
