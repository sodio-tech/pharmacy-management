import { useEffect, useState, useRef, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { PrescriptionTableProps, Prescription } from "./types"
import { backendApi } from "@/lib/axios-config"
import { useAppSelector } from "@/store/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApiPrescriptionResponse {
  prescription_id: number
  customer_id: number
  customer_name: string
  doctor_name: string | null
  prescription_link: string
  prescription_notes: string
  created_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    prescriptions: ApiPrescriptionResponse[]
    total: string
    page: number
    limit: number
    total_pages: number
  }
}

export function PrescriptionTable({ onViewPrescription, searchTerm, statusFilter, dateFilter }: PrescriptionTableProps) {
  const [items, setItems] = useState<Prescription[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false)
  
  // Get selected branch from Redux to refetch when branch changes
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm || "")
      setCurrentPage(1)
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  // Convert dateFilter to start_date and end_date (YYYY-MM-DD format)
  const getDateRange = useCallback((filter: string): { start_date?: string; end_date?: string } => {
    if (!filter || filter === 'all-dates') {
      return {}
    }

    const today = new Date()
    const formatDate = (date: Date): string => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    switch (filter) {
      case 'today': {
        return {
          start_date: formatDate(today),
          end_date: formatDate(today),
        }
      }
      case 'week': {
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        return {
          start_date: formatDate(startDate),
          end_date: formatDate(today),
        }
      }
      case 'month': {
        const startDate = new Date(today)
        startDate.setMonth(today.getMonth() - 1)
        return {
          start_date: formatDate(startDate),
          end_date: formatDate(today),
        }
      }
      default:
        return {}
    }
  }, [])

  // Map API response to Prescription type - only map fields displayed in table
  const mapApiResponseToPrescription = useCallback((apiPrescription: ApiPrescriptionResponse): Prescription => {
    return {
      id: apiPrescription.prescription_id.toString(),
      prescription_number: `${apiPrescription.prescription_id}`,
      patient_name: apiPrescription.customer_name,
      doctor_name: apiPrescription.doctor_name || 'N/A',
      file_url: apiPrescription.prescription_link,
      created_at: apiPrescription.created_at,
    } as Prescription
  }, [])

  // Fetch prescriptions from API
  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', pageSize.toString())

      if (debouncedSearchTerm.trim()) {
        params.append('search', debouncedSearchTerm.trim())
      }

      const dateRange = getDateRange(dateFilter || 'all-dates')
      if (dateRange.start_date) {
        params.append('start_date', dateRange.start_date)
      }
      if (dateRange.end_date) {
        params.append('end_date', dateRange.end_date)
      }

      const response = await backendApi.get<ApiResponse>(`/v1/customer/prescriptions?${params.toString()}`)
      const responseData = response.data?.data

      if (responseData) {
        const mappedPrescriptions = responseData.prescriptions.map(mapApiResponseToPrescription)
        setItems(mappedPrescriptions)
        setTotal(parseInt(responseData.total) || 0)
        setTotalPages(responseData.total_pages || 1)
      } else {
        setItems([])
        setTotal(0)
        setTotalPages(0)
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string; message?: string } } }
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load prescriptions')
      setItems([])
      setTotal(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearchTerm, dateFilter, getDateRange, mapApiResponseToPrescription])

  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, dateFilter])

  // Refetch prescriptions when branch changes
  useEffect(() => {
    if (selectedBranchId) {
      setCurrentPage(1) // Reset to first page when branch changes
      fetchPrescriptions()
    }
  }, [selectedBranchId]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (iso?: string) => {
    if (!iso) return '-'
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch { return '-' }
  }

  const retryFetch = () => {
    fetchPrescriptions()
  }

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setIsImageModalOpen(true)
  }
  
  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb]">
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">Recent Prescriptions</h2>
          <div className="flex mt-2 sm:mt-0 items-center sm:gap-4 gap-2 text-sm text-[#6b7280]">
            <span>Showing {items.length} of {total} prescriptions</span>
            <select 
              className="border border-[#e5e7eb] rounded px-2 py-1"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1) // Reset to first page when changing page size
              }}
            >
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#e5e7eb]">
            <TableHead className="w-12 pl-5">
              <Checkbox />
            </TableHead>
            <TableHead className="text-[#6b7280] font-medium">Prescription ID</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Patient</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Doctor</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Date</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="p-6 text-sm text-[#6b7280] flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0f766e]"></div>
                    Loading prescriptions...
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="p-6 text-sm text-red-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 mb-2">⚠️</div>
                    <div className="font-medium">{error}</div>
                    <button 
                      onClick={retryFetch} 
                      className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="p-6 text-sm text-[#6b7280] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">📋</div>
                    <div className="font-medium">No prescriptions found</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Try adjusting your search or filters
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((prescription) => (
            <TableRow key={prescription.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
              <TableCell className="pl-5">
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium text-[#111827]">{prescription.prescription_number || prescription.id}</div>
                    <div className="text-xs text-[#6b7280]">Created: {formatDate(prescription.created_at)}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback>
                      {prescription.patient_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-[#111827]">{prescription.patient_name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-[#111827]">{prescription.doctor_name}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-[#111827]">{formatDate(prescription.created_at)}</div>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewPrescription(prescription)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!loading && !error && (
        <div className="p-4 border-t border-[#e5e7eb] flex items-center justify-between">
          <div className="text-sm text-[#6b7280]">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
          </div>
        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {/* Generate page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            if (pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === pageNum
                    ? 'bg-[#0f766e] text-white'
                    : 'border border-[#e5e7eb] hover:bg-[#f9fafb]'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        </div>
      )}

      {/* Prescription Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Prescription - {selectedPrescription?.patient_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedPrescription?.file_url ? (
              <div className="flex flex-col gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Patient:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.patient_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Doctor:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.doctor_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Prescription ID:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.prescription_number || selectedPrescription.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedPrescription.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                  <img
                    src={selectedPrescription.file_url}
                    alt={`Prescription for ${selectedPrescription.patient_name}`}
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                      target.alt = "Image not available"
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No prescription image available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
