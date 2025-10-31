import { useEffect, useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, Package } from "lucide-react"
import { PrescriptionTableProps, Prescription } from "./types"

export function PrescriptionTable({ onViewPrescription, searchTerm, statusFilter, dateFilter }: PrescriptionTableProps) {
  const [items, setItems] = useState<Prescription[]>([])
  const [loading, setLoading] = useState<boolean>(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(0)

  const filters = useMemo(() => {
    const f: any = {}
    if (searchTerm) {
      // backend supports patient_name/doctor_name filters; use both for simple search
      f.patient_name = searchTerm
      f.doctor_name = searchTerm
    }
    if (statusFilter && statusFilter !== 'all-status') f.status = statusFilter
    if (dateFilter && dateFilter !== 'all-dates') {
      // simple range example: today/week/month handled server-side if supported; otherwise ignore
      f.date_range = dateFilter
    }
    f.page = currentPage
    f.limit = pageSize
    return f
  }, [searchTerm, statusFilter, dateFilter, currentPage, pageSize])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await prescriptionService.getPrescriptions(filters)
        if (cancelled) return
        setItems(res.prescriptions)
        setTotal(res.pagination?.total ?? res.prescriptions.length)
        setTotalPages(res.pagination?.total_pages ?? 1)
      } catch (e: any) {
        if (cancelled) return
        setError(e?.response?.data?.error || 'Failed to load prescriptions')
        setItems([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [filters])

  const formatDate = (iso?: string) => {
    if (!iso) return '-'
    try {
      const d = new Date(iso)
      return d.toLocaleDateString()
    } catch { return '-' }
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, dateFilter])

  const retryFetch = () => {
    setError(null)
    setLoading(true)
    // The useEffect will trigger a new fetch due to the loading state change
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
            <TableHead className="text-[#6b7280] font-medium">Medications</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Status</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Validation</TableHead>
            <TableHead className="text-[#6b7280] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9}>
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
              <TableCell colSpan={9}>
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
              <TableCell colSpan={9}>
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
                    <div className="text-sm text-[#6b7280]">{prescription.patient_phone || prescription.patient_email || '-'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-[#111827]">{prescription.doctor_name}</div>
                  <div className="text-sm text-[#6b7280]">{prescription.doctor_specialty || '-'}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-[#111827]">{formatDate(prescription.created_at)}</div>
                  <div className="text-sm text-[#6b7280]">{formatDate(prescription.updated_at)}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-[#111827]">
                    {prescription.medications && prescription.medications.length > 0 
                      ? `${prescription.medications.length} medication${prescription.medications.length > 1 ? 's' : ''}`
                      : 'No medications'
                    }
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    {prescription.medications && prescription.medications.length > 0 
                      ? prescription.medications.slice(0, 2).map(med => med.medication_name).join(', ') + 
                        (prescription.medications.length > 2 ? '...' : '')
                      : 'View details'
                    }
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className="border-0 font-medium">
                  {prescription.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  className={`border-0 font-medium ${
                    prescription.validation_status === 'APPROVED' 
                      ? 'bg-green-100 text-green-800' 
                      : prescription.validation_status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : prescription.validation_status === 'NEEDS_REVISION'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {prescription.validation_status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewPrescription?.(prescription)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {prescription.status === "PENDING_VALIDATION" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {prescription.status === "VALIDATED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                  )}
                </div>
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
    </div>
  )
}
