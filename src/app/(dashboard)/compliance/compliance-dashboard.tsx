import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, FileText, User, Shield, Download, Eye, Plus } from "lucide-react"

export function ComplianceDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb] py-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7280] mb-1">Drug License Status</p>
                <p className="text-2xl font-bold text-[#16a34a]">Valid</p>
                <p className="text-xs text-[#6b7280] mt-1">Expires: Mar 15, 2025</p>
              </div>
              <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#16a34a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb] py-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7280] mb-1">GST Compliance</p>
                <p className="text-2xl font-bold text-[#16a34a]">100%</p>
                <p className="text-xs text-[#6b7280] mt-1">All returns filed</p>
              </div>
              <div className="w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#2563eb]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb] py-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7280] mb-1">Controlled Substances</p>
                <p className="text-2xl font-bold text-[#ea580c]">3</p>
                <p className="text-xs text-[#6b7280] mt-1">Require attention</p>
              </div>
              <div className="w-12 h-12 bg-[#fef3c7] rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#ea580c]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb] py-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7280] mb-1">Audit Score</p>
                <p className="text-2xl font-bold text-[#9333ea]">98.5%</p>
                <p className="text-xs text-[#6b7280] mt-1">Last audit: Dec 2024</p>
              </div>
              <div className="w-12 h-12 bg-[#f3e8ff] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#9333ea]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Drug License & Permits */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold text-[#111827]">Drug License & Permits</CardTitle>
              <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] border-[#16a34a] w-fit">
                Valid
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#f0fdf4] rounded-lg">
              <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Retail Drug License</p>
                <p className="text-sm text-[#6b7280] break-words">License No: DL-2024-001234</p>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
                  Valid
                </Badge>
                <p className="text-xs text-[#6b7280]">Expires: Mar 15, 2025</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#f0fdf4] rounded-lg">
              <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Trade License</p>
                <p className="text-sm text-[#6b7280] break-words">License No: TL-2024-5678</p>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
                  Valid
                </Badge>
                <p className="text-xs text-[#6b7280]">Expires: Dec 31, 2024</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#fef9c3] rounded-lg">
              <div className="w-8 h-8 bg-[#ca8a04] rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Fire Safety Certificate</p>
                <p className="text-sm text-[#6b7280] break-words">Certificate No: FSC-2024-9012</p>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <Badge variant="secondary" className="bg-[#fef9c3] text-[#ca8a04] w-fit">
                  Renewal Due
                </Badge>
                <p className="text-xs text-[#6b7280]">Expires: Jan 30, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Compliance */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold text-[#111827]">Tax Compliance</CardTitle>
              <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] border-[#16a34a] w-fit">
                Up to Date
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#dbeafe] rounded-lg">
              <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">GST Return - December</p>
                <p className="text-sm text-[#6b7280]">GSTR-1, GSTR-3B</p>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
                  Filed
                </Badge>
                <p className="text-xs text-[#6b7280]">Filed: Jan 10, 2025</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#f3e8ff] rounded-lg">
              <div className="w-8 h-8 bg-[#9333ea] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Income Tax Return</p>
                <p className="text-sm text-[#6b7280]">AY 2024-25</p>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
                  Filed
                </Badge>
                <p className="text-xs text-[#6b7280]">Filed: Jul 15, 2024</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#f0fdf4] rounded-lg">
              <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">TDS Compliance</p>
                <p className="text-sm text-[#6b7280]">Monthly TDS returns</p>
              </div>
              <div className="flex flex-col sm:text-right gap-1">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
                  Current
                </Badge>
                <p className="text-xs text-[#6b7280]">Last: Dec 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controlled Substances Tracking */}
      <Card className="border-[#e5e7eb]">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold text-[#111827]">Controlled Substances Tracking</CardTitle>
              <Badge variant="secondary" className="bg-[#fef9c3] text-[#ca8a04] w-fit">
                3 Items Need Attention
              </Badge>
            </div>
            <Button className="bg-[#0f766e] hover:bg-[#0d5d56] text-white w-full sm:w-auto sm:self-end">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div>
                      <p className="font-medium">Tramadol 50mg</p>
                      <p className="text-sm text-[#6b7280]">Batch: TR20240001</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="bg-[#fee2e2] text-[#dc2626]">
                      Schedule H
                    </Badge>
                  </TableCell>
                  <TableCell>45 units</TableCell>
                  <TableCell>Sale - 2 hours ago</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#fef9c3] text-[#ca8a04]">
                      Record Pending
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Log
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div>
                      <p className="font-medium">Codeine Phosphate</p>
                      <p className="text-sm text-[#6b7280]">Batch: CP20240002</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="bg-[#fee2e2] text-[#dc2626]">
                      Schedule X
                    </Badge>
                  </TableCell>
                  <TableCell>12 units</TableCell>
                  <TableCell>Purchase - 1 day ago</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a]">
                      Compliant
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Log
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-4">
            <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827]">Tramadol 50mg</p>
                  <p className="text-sm text-[#6b7280]">Batch: TR20240001</p>
                </div>
                <Badge variant="destructive" className="bg-[#fee2e2] text-[#dc2626] flex-shrink-0">
                  Schedule H
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[#6b7280]">Stock</p>
                  <p className="font-medium">45 units</p>
                </div>
                <div>
                  <p className="text-[#6b7280]">Last Transaction</p>
                  <p className="font-medium">Sale - 2 hours ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-[#fef9c3] text-[#ca8a04] w-fit">
                Record Pending
              </Badge>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                  Update
                </Button>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  View Log
                </Button>
              </div>
            </div>

            <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827]">Codeine Phosphate</p>
                  <p className="text-sm text-[#6b7280]">Batch: CP20240002</p>
                </div>
                <Badge variant="destructive" className="bg-[#fee2e2] text-[#dc2626] flex-shrink-0">
                  Schedule X
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[#6b7280]">Stock</p>
                  <p className="font-medium">12 units</p>
                </div>
                <div>
                  <p className="text-[#6b7280]">Last Transaction</p>
                  <p className="font-medium">Purchase - 1 day ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a] w-fit">
                Compliant
              </Badge>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                  Update
                </Button>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  View Log
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Audit Trail */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold text-[#111827]">Recent Audit Trail</CardTitle>
              <Button variant="ghost" size="sm" className="text-[#0f766e] flex-shrink-0">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#dbeafe] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827] break-words">User Login - Dr. Sarah Wilson</p>
                <p className="text-sm text-[#6b7280] break-words">Successfully logged into system</p>
                <p className="text-xs text-[#9ca3af] mt-1">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#dcfce7] rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-[#16a34a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827] break-words">Controlled Substance Sale</p>
                <p className="text-sm text-[#6b7280] break-words">Tramadol 50mg - 10 units sold</p>
                <p className="text-xs text-[#9ca3af] mt-1">30 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#f3e8ff] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#9333ea]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827] break-words">Prescription Validated</p>
                <p className="text-sm text-[#6b7280] break-words">Prescription ID: PRX20240001234</p>
                <p className="text-xs text-[#9ca3af] mt-1">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#fef9c3] rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-[#ca8a04]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827] break-words">Compliance Alert</p>
                <p className="text-sm text-[#6b7280] break-words">Fire safety certificate renewal due</p>
                <p className="text-xs text-[#9ca3af] mt-1">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Reports */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold text-[#111827]">Compliance Reports</CardTitle>
              <Button className="bg-[#0f766e] hover:bg-[#0d5d56] text-white w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#dbeafe] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Monthly Compliance Report</p>
                <p className="text-sm text-[#6b7280]">December 2024</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a]">
                  Ready
                </Badge>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#fee2e2] rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-[#dc2626]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Controlled Substances Log</p>
                <p className="text-sm text-[#6b7280]">Q4 2024</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Badge variant="secondary" className="bg-[#dcfce7] text-[#16a34a]">
                  Ready
                </Badge>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-[#e5e7eb] rounded-lg">
              <div className="w-8 h-8 bg-[#f3e8ff] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#9333ea]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#111827]">Audit Compliance Report</p>
                <p className="text-sm text-[#6b7280]">Annual 2024</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Badge variant="secondary" className="bg-[#fef9c3] text-[#ca8a04]">
                  Pending
                </Badge>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
