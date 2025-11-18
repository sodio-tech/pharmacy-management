"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, Edit, UserX, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface ApiEmployee {
  employee_id: number
  pharmacy_branch_id: number
  branch_name: string
  email: string
  fullname: string
  phone_number: string
  role: "ADMIN" | "PHARMACIST" | "MANAGER"
  profile_image: string | null
}

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  branch: string
  avatar: string | null
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all-roles")
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  // Map API response to User type
  const mapApiResponseToUser = useCallback((employee: ApiEmployee): User => {
    const roleMap: Record<string, string> = {
      "ADMIN": "Administrator",
      "PHARMACIST": "Pharmacist",
      "MANAGER": "Manager"
    }

    return {
      id: employee.employee_id,
      name: employee.fullname,
      email: employee.email,
      role: roleMap[employee.role] || employee.role,
      status: "Active",
      lastLogin: "N/A",
      branch: employee.branch_name,
      avatar: employee.profile_image,
    }
  }, [])

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim())
      }

      if (selectedRole !== "all-roles") {
        const roleMap: Record<string, string> = {
          "administrator": "ADMIN",
          "pharmacist": "PHARMACIST",
          "manager": "MANAGER"
        }
        const apiRole = roleMap[selectedRole]
        if (apiRole) {
          params.append("role", apiRole)
        }
      }

      const response = await backendApi.get(`/v1/org/management-tools?${params.toString()}`)

      if (response.data?.success && response.data?.data?.employees) {
        const mappedUsers = response.data.data.employees.map(mapApiResponseToUser)
        setUsers(mappedUsers)
      } else {
        setUsers([])
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm, selectedRole, mapApiResponseToUser])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb]">
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#111827]">User Management Tools</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-10 border-[#d1d5db] focus:border-[#0f766e] focus:ring-[#0f766e]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40 border-[#d1d5db]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-roles">All Roles</SelectItem>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="pharmacist">Pharmacist</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-status">
            <SelectTrigger className="w-40 border-[#d1d5db]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-[#6b7280]">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[#6b7280]">
            {debouncedSearchTerm || selectedRole !== "all-roles"
              ? "No users found matching your criteria"
              : "No users found"}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-[#6b7280] uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Last Login
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Branch
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#f9fafb]">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#111827]">{user.name}</p>
                        <p className="text-sm text-[#6b7280]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge
                      variant={user.role === "Administrator" ? "secondary" : "outline"}
                      className={
                        user.role === "Administrator"
                          ? "bg-[#f3e8ff] text-[#9333ea] border-[#e9d5ff]"
                          : user.role === "Pharmacist"
                            ? "bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]"
                            : "bg-[#dbeafe] text-[#2563eb] border-[#bfdbfe]"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${user.status === "Active"
                            ? "bg-[#16a34a]"
                            : user.status === "Away"
                              ? "bg-[#eab308]"
                              : "bg-[#dc2626]"
                          }`}
                      />
                      <span
                        className={`text-sm font-medium ${user.status === "Active"
                            ? "text-[#16a34a]"
                            : user.status === "Away"
                              ? "text-[#eab308]"
                              : "text-[#dc2626]"
                          }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6b7280]">{user.lastLogin}</td>
                  <td className="py-4 px-6 text-sm text-[#6b7280]">{user.branch}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#0f766e] hover:text-[#0f766e] hover:bg-[#ccfbf1]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.status === "Suspended" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#16a34a] hover:text-[#16a34a] hover:bg-[#dcfce7]"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#dc2626] hover:text-[#dc2626] hover:bg-[#fef2f2]"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
