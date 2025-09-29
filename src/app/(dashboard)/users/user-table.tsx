import { Search, Edit, UserX, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const users = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@pharmacy.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2 minutes ago",
    branch: "Main Branch",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@pharmacy.com",
    role: "Pharmacist",
    status: "Active",
    lastLogin: "15 minutes ago",
    branch: "Branch A",
    avatar: "/man.jpg",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@pharmacy.com",
    role: "Pharmacist",
    status: "Away",
    lastLogin: "2 hours ago",
    branch: "Branch B",
    avatar: "/young-woman.jpg",
  },
  {
    id: 4,
    name: "James Thompson",
    email: "james.thompson@pharmacy.com",
    role: "Administrator",
    status: "Suspended",
    lastLogin: "3 days ago",
    branch: "Main Branch",
    avatar: "/older-man.jpg",
  },
]

export function UserTable() {
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
            />
          </div>

          <Select defaultValue="all-roles">
            <SelectTrigger className="w-40 border-[#d1d5db]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-roles">All Roles</SelectItem>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="pharmacist">Pharmacist</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
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
                        : "bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.status === "Active"
                          ? "bg-[#16a34a]"
                          : user.status === "Away"
                            ? "bg-[#eab308]"
                            : "bg-[#dc2626]"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        user.status === "Active"
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
      </div>
    </div>
  )
}
