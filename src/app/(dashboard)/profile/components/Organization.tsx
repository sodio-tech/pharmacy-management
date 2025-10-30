"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building2,
  Users,
  UserCog,
  UserCheck,
  Edit,
  Trash2,
  Settings,
  Lock,
  Mail,
  RotateCw,
  X,
  Shield,
  ExternalLink,
} from "lucide-react"

export default function Organization() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6 mt-6 ">
      {/* Organization Details and Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Organization Details - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
            <Button
              variant="outline"
              size="sm"
              className="text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/5 bg-transparent w-full sm:w-auto"
              onClick={() => setIsEditing(!isEditing)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pharmacy-name" className="text-sm font-medium text-gray-700">
                  Pharmacy Name
                </Label>
                <Input
                  id="pharmacy-name"
                  defaultValue="Wilson's Care Pharmacy"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="license-number" className="text-sm font-medium text-gray-700">
                  License Number
                </Label>
                <Input id="license-number" defaultValue="PH-2024-NY-8756" disabled={!isEditing} className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </Label>
              <Input
                id="address"
                defaultValue="123 Healthcare Avenue, Medical District, New York, NY 10001"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" disabled={!isEditing} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input id="email" defaultValue="contact@wilsonspharmacy.com" disabled={!isEditing} className="mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Organization Overview - Takes 1 column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Team Members</div>
                  <div className="text-xs text-gray-500">Active users</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">4</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Branches</div>
                  <div className="text-xs text-gray-500">Active locations</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <UserCog className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Admins</div>
                  <div className="text-xs text-gray-500">Full access</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Pharmacists</div>
                  <div className="text-xs text-gray-500">Limited access</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management and Role Permissions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Team Management - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
            <Button size="sm" className="bg-[#0f766e] hover:bg-[#0d6860] text-white w-full sm:w-auto">
              <Users className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>

          <div className="space-y-3">
            {/* Current User */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src="/professional-woman-pharmacist.png"
                    alt="Dr. Sarah Wilson"
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">Dr. Sarah Wilson</div>
                    <div className="text-sm text-gray-600 truncate">sarah.wilson@wilsonspharmacy.com</div>
                    <div className="text-xs text-green-600 mt-1">Last active: Currently online</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">
                    Admin
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">
                    You
                  </span>
                </div>
              </div>
            </div>

            {/* Team Member 1 */}
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src="/professional-man-pharmacist.jpg"
                    alt="Michael Chen"
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">Michael Chen</div>
                    <div className="text-sm text-gray-600 truncate">michael.chen@wilsonspharmacy.com</div>
                    <div className="text-xs text-gray-500 mt-1">Last active: 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded whitespace-nowrap">
                    Pharmacist
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" aria-label="Edit user">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors" aria-label="Delete user">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src="/professional-woman-pharmacist-hispanic.jpg"
                    alt="Emma Rodriguez"
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">Emma Rodriguez</div>
                    <div className="text-sm text-gray-600 truncate">emma.rodriguez@wilsonspharmacy.com</div>
                    <div className="text-xs text-gray-500 mt-1">Last active: Yesterday</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded whitespace-nowrap">
                    Pharmacist
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" aria-label="Edit user">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors" aria-label="Delete user">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Invitation */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">Dr. James Mitchell</div>
                    <div className="text-sm text-gray-600 truncate">james.mitchell@gmail.com</div>
                    <div className="text-xs text-yellow-700 mt-1">Invitation sent 2 days ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded whitespace-nowrap">
                    Pending
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 hover:bg-yellow-100 rounded transition-colors"
                      aria-label="Resend invitation"
                    >
                      <RotateCw className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors" aria-label="Cancel invitation">
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Permissions - Takes 1 column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Admin</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">
                  Full Access
                </span>
              </div>
              <p className="text-sm text-gray-600">Complete system control, user management, reports, settings</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Pharmacist</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded whitespace-nowrap">
                  Limited Access
                </span>
              </div>
              <p className="text-sm text-gray-600">Sales, inventory viewing, prescription handling</p>
            </div>

            <Button
              variant="outline"
              className="w-full text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/5 bg-transparent"
            >
              <Shield className="w-4 h-4 mr-2" />
              Manage Permissions
            </Button>
          </div>
        </div>
      </div>

      {/* Branch Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Branch Management</h2>
          <Button size="sm" className="bg-[#0f766e] hover:bg-[#0d6860] text-white w-full sm:w-auto">
            <Building2 className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>

        <div className="space-y-4">
          {/* Main Branch */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">Main Branch</div>
                  <div className="text-sm text-gray-600 mt-0.5 break-words">
                    123 Healthcare Avenue, Medical District, NY 10001
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    <span>3 staff members</span>
                    <span className="hidden sm:inline">•</span>
                    <span>License: PH-2024-NY-8756</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:flex-nowrap">
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded whitespace-nowrap">
                  Primary
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-green-100 rounded transition-colors" aria-label="Edit branch">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-green-100 rounded transition-colors" aria-label="Branch settings">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Branches - Locked */}
          <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">Additional Branches</div>
                  <div className="text-sm text-gray-600 mt-0.5">Manage multiple pharmacy locations</div>
                  <div className="text-xs text-gray-500 mt-1">Upgrade to Pro or Enterprise plan to unlock</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#0f766e] hover:bg-[#0d6860] text-white w-full sm:w-auto lg:w-auto lg:flex-shrink-0"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
