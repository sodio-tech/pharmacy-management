"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, List, Grid } from "lucide-react"
import { PrescriptionTable } from "./prescription-table"
import { PrescriptionStats } from "./prescription-stats"
import { PrescriptionContentProps } from "./types"

export default function PrescriptionContent({ onViewPrescription }: PrescriptionContentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all-status');
    const [dateFilter, setDateFilter] = useState('all-dates');

    return (
        <div className="bg-[#f9fafb]">
            {/* <PrescriptionStats /> */}

            <div className="mb-6 bg-white p-4 rounded-lg border border-[#e5e7eb]">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                        <Input
                            placeholder="Search by patient name, doctor, or prescription ID"
                            className="pl-10 bg-white border-[#e5e7eb]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="UPLOADED">Uploaded</SelectItem>
                            <SelectItem value="PENDING_VALIDATION">Pending Validation</SelectItem>
                            <SelectItem value="VALIDATED">Validated</SelectItem>
                            <SelectItem value="DISPENSED">Dispensed</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="All Dates" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-dates">All Dates</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <PrescriptionTable 
                onViewPrescription={onViewPrescription}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                dateFilter={dateFilter}
            />
        </div>
    )
}
