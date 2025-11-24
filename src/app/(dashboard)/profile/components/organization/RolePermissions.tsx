"use client"

// import { Button } from "@/components/ui/button"
// import { Shield } from "lucide-react"

interface Role {
  name: string
  badge: {
    label: string
    bgColor: string
    textColor: string
  }
  description: string
}

const roles: Role[] = [
  {
    name: "Admin",
    badge: {
      label: "Full Access",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
    description: "Complete system control, user management, reports, settings",
  },
  {
    name: "Pharmacist",
    badge: {
      label: "Limited Access",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    description: "Sales, inventory viewing, prescription handling",
  },
]

export default function RolePermissions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions</h2>
      <div className="space-y-6">
        {roles.map((role) => (
          <div key={role.name}>
            <div className="flex items-center justify-between mb-2 gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{role.name}</h3>
              <span className={`px-2 py-1 ${role.badge.bgColor} ${role.badge.textColor} text-xs font-medium rounded whitespace-nowrap`}>
                {role.badge.label}
              </span>
            </div>
            <p className="text-sm text-gray-600">{role.description}</p>
          </div>
        ))}

        {/* <Button
          variant="outline"
          className="w-full text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/5 bg-transparent"
        >
          <Shield className="w-4 h-4 mr-2" />
          Manage Permissions
        </Button> */}
      </div>
    </div>
  )
}

