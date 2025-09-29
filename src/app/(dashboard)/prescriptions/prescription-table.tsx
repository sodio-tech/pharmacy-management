import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

const prescriptions = [
  {
    id: "#RX001234",
    patient: { name: "Sarah Johnson", age: "34, F", avatar: "/diverse-woman-portrait.png" },
    doctor: { name: "Dr. Michael Chen", specialty: "Cardiology" },
    date: "Dec 15, 2024",
    time: "10:30 AM",
    medications: ["Lisinopril", "Metformin", "Aspirin"],
    status: "Pending Validation",
    statusColor: "bg-[#ffedd5] text-[#ea580c]",
    icon: "📋",
  },
  {
    id: "#RX001233",
    patient: { name: "Robert Martinez", age: "45, M", avatar: "/man.jpg" },
    doctor: { name: "Dr. Emily Davis", specialty: "Internal Medicine" },
    date: "Dec 15, 2024",
    time: "08:15 AM",
    medications: ["Amoxicillin", "Ibuprofen"],
    status: "Validated",
    statusColor: "bg-[#dcfce7] text-[#16a34a]",
    icon: "✅",
  },
  {
    id: "#RX001232",
    patient: { name: "Lisa Thompson", age: "28, F", avatar: "/young-woman.jpg" },
    doctor: { name: "Dr. James Wilson", specialty: "Dermatology" },
    date: "Dec 14, 2024",
    time: "03:45 PM",
    medications: ["Tretinoin Cream"],
    status: "Dispensed",
    statusColor: "bg-[#f3e8ff] text-[#9333ea]",
    icon: "💊",
  },
  {
    id: "#RX001231",
    patient: { name: "David Brown", age: "52, M", avatar: "/older-man.jpg" },
    doctor: { name: "Dr. Anna Rodriguez", specialty: "Orthopedics" },
    date: "Dec 14, 2024",
    time: "11:20 AM",
    medications: ["Prescription unclear"],
    status: "Rejected",
    statusColor: "bg-[#fee2e2] text-[#dc2626]",
    icon: "❌",
  },
]

export function PrescriptionTable() {
  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb]">
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">Recent Prescriptions</h2>
          <div className="flex items-center gap-4 text-sm text-[#6b7280]">
            <span>Showing 1-20 of 342 prescriptions</span>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription, index) => (
            <TableRow key={index} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
              <TableCell className="pl-5">
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{prescription.icon}</span>
                  <div>
                    <div className="font-medium text-[#111827]">{prescription.id}</div>
                    <div className="text-xs text-[#6b7280]">
                      {prescription.status === "Pending Validation" && "Uploaded 2h ago"}
                      {prescription.status === "Validated" && "Validated 4h ago"}
                      {prescription.status === "Dispensed" && "Dispensed 6h ago"}
                      {prescription.status === "Rejected" && "Rejected 1d ago"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={prescription.patient.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {prescription.patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-[#111827]">{prescription.patient.name}</div>
                    <div className="text-sm text-[#6b7280]">Age: {prescription.patient.age}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-[#111827]">{prescription.doctor.name}</div>
                  <div className="text-sm text-[#6b7280]">{prescription.doctor.specialty}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-[#111827]">{prescription.date}</div>
                  <div className="text-sm text-[#6b7280]">{prescription.time}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-[#111827]">
                    {prescription.medications.length} medication{prescription.medications.length > 1 ? "s" : ""}
                  </div>
                  <div className="text-sm text-[#6b7280]">{prescription.medications.join(", ")}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${prescription.statusColor} border-0 font-medium`}>{prescription.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-[#e5e7eb] flex items-center justify-between">
        <div className="text-sm text-[#6b7280]">Showing 1 to 20 of 342 results</div>
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
