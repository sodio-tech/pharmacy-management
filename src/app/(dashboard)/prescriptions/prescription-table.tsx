import { useEffect, useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, Package } from "lucide-react"
import { PrescriptionTableProps, Prescription } from "./types"
import { prescriptionService } from "@/services/prescriptionService"

export function PrescriptionTable({ onViewPrescription, searchTerm, statusFilter, dateFilter }: PrescriptionTableProps) {
  const [items, setItems] = useState<Prescription[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

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
    f.page = 1
    f.limit = 20
    return f
  }, [searchTerm, statusFilter, dateFilter])

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

  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb]">
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">Recent Prescriptions</h2>
          <div className="flex items-center gap-4 text-sm text-[#6b7280]">
            <span>Showing {Math.min(items.length, 20)} of {total} prescriptions</span>
            <select className="border border-[#e5e7eb] rounded px-2 py-1">
              <option>20 per page</option>
              <option>50 per page</option>
              <option>100 per page</option>
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
            <TableHead className="text-[#6b7280] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="p-6 text-sm text-[#6b7280]">Loading prescriptions...</div>
              </TableCell>
            </TableRow>
          )}
          {!loading && error && (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="p-6 text-sm text-red-600">{error}</div>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="p-6 text-sm text-[#6b7280]">No prescriptions found.</div>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && items.map((prescription) => (
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
                  <div className="font-medium text-[#111827]">-</div>
                  <div className="text-sm text-[#6b7280]">View details</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className="border-0 font-medium">
                  {prescription.status}
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
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-[#e5e7eb] flex items-center justify-between">
        <div className="text-sm text-[#6b7280]">Showing 1 to {Math.min(items.length, 20)} of {total} results</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">Previous</button>
          <button className="px-3 py-1 text-sm bg-[#0f766e] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">2</button>
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">3</button>
          <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded hover:bg-[#f9fafb]">Next</button>
        </div>
      </div>
    </div>
  )
}
