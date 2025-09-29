import { Users, UserCheck, Shield, Stethoscope } from "lucide-react"

export function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Total Users</p>
            <p className="text-2xl font-bold text-[#111827]">12</p>
            <p className="text-xs text-[#16a34a]">+2 this month</p>
          </div>
          <div className="w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-[#2563eb]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Active Users</p>
            <p className="text-2xl font-bold text-[#16a34a]">8</p>
            <p className="text-xs text-[#6b7280]">Currently online</p>
          </div>
          <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-[#16a34a]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Administrators</p>
            <p className="text-2xl font-bold text-[#9333ea]">3</p>
            <p className="text-xs text-[#6b7280]">Full access</p>
          </div>
          <div className="w-12 h-12 bg-[#f3e8ff] rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#9333ea]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Pharmacists</p>
            <p className="text-2xl font-bold text-[#0f766e]">9</p>
            <p className="text-xs text-[#6b7280]">Limited access</p>
          </div>
          <div className="w-12 h-12 bg-[#ccfbf1] rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-[#0f766e]" />
          </div>
        </div>
      </div>
    </div>
  )
}
