import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { MobileControlledSubstanceCard } from "./MobileControlledSubstanceCard"

export const ControlledSubstancesSection = () => (
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
        <MobileControlledSubstanceCard
          title="Tramadol 50mg"
          batch="TR20240001"
          schedule="Schedule H"
          stock="45 units"
          lastTransaction="Sale - 2 hours ago"
          statusBadgeClass="bg-[#fef9c3] text-[#ca8a04]"
          statusLabel="Record Pending"
          scheduleBadgeClass="bg-[#fee2e2] text-[#dc2626]"
        />
        <MobileControlledSubstanceCard
          title="Codeine Phosphate"
          batch="CP20240002"
          schedule="Schedule X"
          stock="12 units"
          lastTransaction="Purchase - 1 day ago"
          statusBadgeClass="bg-[#dcfce7] text-[#16a34a]"
          statusLabel="Compliant"
          scheduleBadgeClass="bg-[#fee2e2] text-[#dc2626]"
        />
      </div>
    </CardContent>
  </Card>
)

