import { Plus, Users, Shield, User, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access and control",
    userCount: 3,
    icon: Shield,
    color: "bg-[#f3e8ff] text-[#9333ea]",
  },
  {
    id: 2,
    name: "Pharmacist",
    description: "Limited access for daily operations",
    userCount: 9,
    icon: User,
    color: "bg-[#ccfbf1] text-[#0f766e]",
  },
  {
    id: 3,
    name: "Manager",
    description: "Branch management and reporting",
    userCount: 0,
    icon: Users,
    color: "bg-[#dbeafe] text-[#2563eb]",
  },
]

const permissions = [
  { module: "Inventory Management", admin: true, pharmacist: true },
  { module: "Sales & Billing", admin: true, pharmacist: true },
  { module: "User Management", admin: true, pharmacist: false },
  { module: "Reports & Analytics", admin: true, pharmacist: false },
  { module: "Compliance", admin: true, pharmacist: false },
  { module: "System Settings", admin: true, pharmacist: false },
]

export function RoleManagement() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Role Management */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#111827]">Role Management</h3>
          <Button className="bg-[#0f766e] hover:bg-[#115e59] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const IconComponent = role.icon
            return (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#111827]">{role.name}</h4>
                    <p className="text-sm text-[#6b7280]">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[#0f766e] border-[#0f766e]">
                    {role.userCount} Users
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#111827]">Permission Matrix</h3>
          <Button variant="outline" className="text-[#0f766e] border-[#0f766e] hover:bg-[#ccfbf1] bg-transparent">
            Edit Permissions
          </Button>
        </div>

        <div className="space-y-4">
          {permissions.map((permission, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-[#e5e7eb] last:border-b-0"
            >
              <span className="text-sm font-medium text-[#111827]">{permission.module}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${permission.admin ? "bg-[#9333ea]" : "bg-[#d1d5db]"}`} />
                  <span className="text-xs text-[#6b7280]">Admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${permission.pharmacist ? "bg-[#0f766e]" : "bg-[#d1d5db]"}`} />
                  <span className="text-xs text-[#6b7280]">Pharmacist</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
