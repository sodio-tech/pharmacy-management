"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrescriptionStats as PrescriptionStatsType } from "./types"
import { RefreshCw } from "lucide-react"
import { backendApi } from "@/lib/axios-config"

export function PrescriptionStats() {
  const [stats, setStats] = useState<PrescriptionStatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const fetchStats = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await backendApi.get('/prescriptions/stats')
  //     const statsData = response.data?.data || response.data
  //     setStats(statsData);
  //   } catch (error: unknown) {
  //     console.error('Failed to fetch prescription stats:', error);
  //     const err = error as { message?: string; response?: { data?: { message?: string } } }
  //     setError(err?.message || err?.response?.data?.message || 'Failed to load prescription statistics');
  //     // Set fallback data for development
  //     setStats({
  //       total_prescriptions: 0,
  //       pending_validation: 0,
  //       validated: 0,
  //       dispensed: 0,
  //       rejected: 0,
  //       today_uploads: 0,
  //       this_week_uploads: 0,
  //       this_month_uploads: 0
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchStats();
  // }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 bg-white border border-[#e5e7eb] animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    if (error) {
      return (
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                <strong>Error loading statistics:</strong> {error}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  console.log(stats,'stats')

  const displayStats = [
    {
      title: "Total Prescriptions",
      value: stats.total_prescriptions.toString(),
      icon: "📋",
      color: "text-[#2563eb]",
      bgColor: "bg-[#dbeafe]",
    },
    {
      title: "Pending Validation",
      value: stats.pending_validation.toString(),
      icon: "⏳",
      color: "text-[#ea580c]",
      bgColor: "bg-[#ffedd5]",
    },
    {
      title: "Validated",
      value: stats.validated.toString(),
      icon: "✅",
      color: "text-[#16a34a]",
      bgColor: "bg-[#dcfce7]",
    },
    {
      title: "Dispensed",
      value: stats.dispensed.toString(),
      icon: "💊",
      color: "text-[#9333ea]",
      bgColor: "bg-[#f3e8ff]",
    },
    {
      title: "Rejected",
      value: stats.rejected.toString(),
      icon: "❌",
      color: "text-[#dc2626]",
      bgColor: "bg-[#fee2e2]",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#111827]">Prescription Statistics</h2>
        <Button
          variant="outline"
          size="sm"
          // onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {displayStats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white border border-[#e5e7eb]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7280] mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
