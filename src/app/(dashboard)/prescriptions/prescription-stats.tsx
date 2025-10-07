"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card"
import { PrescriptionStats as PrescriptionStatsType } from "./types"

export function PrescriptionStats() {
  const [stats, setStats] = useState<PrescriptionStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const statsData = await prescriptionService.getPrescriptionStats();
        // setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch prescription stats:', error);
        // Set mock data for development
        setStats({
          total_prescriptions: 342,
          pending_validation: 23,
          validated: 18,
          dispensed: 156,
          rejected: 5,
          today_uploads: 8,
          this_week_uploads: 45,
          this_month_uploads: 189
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (!stats) return null;

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
      title: "Validated Today",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
  )
}
