"use client"

import { useEffect, useState, useCallback } from "react"
import { backendApi } from "@/lib/axios-config"
import { LowStockProduct } from "./LowStockAlerts"
import { DashboardPrescription } from "./RecentPrescriptions"

interface ApiPrescriptionResponse {
  prescription_id: number
  customer_id: number
  customer_name: string
  doctor_name: string | null
  prescription_link: string
  prescription_notes: string
  created_at: string
}

interface SalesAnalytics {
  today_transactions: number
  transactions_change_percent: number
  this_month_earnings: number
  this_month_earnings_change_percent: number
}

interface DashboardStatsProps {
  selectedBranchId: number | null
  onDataLoaded: (data: {
    lowStockItems: LowStockProduct[]
    recentPrescriptions: DashboardPrescription[]
    salesAnalytics: SalesAnalytics | null
  }) => void
}

export function DashboardStats({ selectedBranchId, onDataLoaded }: DashboardStatsProps) {
  const fetchStockAlerts = useCallback(async () => {
    if (!selectedBranchId) return []

    try {
      const response = await backendApi.get(`/v1/inventory/stock-alerts/${selectedBranchId}`)
      const data = response.data?.data || response.data
      return data?.alerts || []
    } catch (error) {
      console.error("Failed to load stock alerts:", error)
      return []
    }
  }, [selectedBranchId])

  const fetchRecentPrescriptions = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('limit', '5')

      const response = await backendApi.get(`/v1/customer/prescriptions?${params.toString()}`)
      const responseData = response.data?.data

      if (responseData?.prescriptions) {
        const mappedPrescriptions: DashboardPrescription[] = responseData.prescriptions.map((apiPrescription: ApiPrescriptionResponse) => ({
          id: apiPrescription.prescription_id.toString(),
          patientName: apiPrescription.customer_name,
          status: "UPLOADED" as const,
          itemCount: 0,
          prescription_link: apiPrescription.prescription_link,
        }))
        return mappedPrescriptions
      }
      return []
    } catch (error) {
      console.error("Failed to load recent prescriptions:", error)
      return []
    }
  }, [])

  const fetchSalesAnalytics = useCallback(async () => {
    if (!selectedBranchId) return null

    try {
      const response = await backendApi.get(`/v1/sales/general-analytics/${selectedBranchId}`)
      const data = response.data?.data || response.data
      if (data) {
        return {
          today_transactions: data.today_transactions || 0,
          transactions_change_percent: data.transactions_change_percent || 0,
          this_month_earnings: data.this_month_earnings || 0,
          this_month_earnings_change_percent: data.this_month_earnings_change_percent || 0,
        }
      }
      return null
    } catch (error) {
      console.error("Failed to load sales analytics:", error)
      return null
    }
  }, [selectedBranchId])

  const fetchAllData = useCallback(async () => {
    try {
      const [lowStockItems, recentPrescriptions, salesAnalytics] = await Promise.all([
        fetchStockAlerts(),
        fetchRecentPrescriptions(),
        fetchSalesAnalytics(),
      ])

      onDataLoaded({
        lowStockItems,
        recentPrescriptions,
        salesAnalytics,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Still call onDataLoaded with empty/default data to stop loading
      onDataLoaded({
        lowStockItems: [],
        recentPrescriptions: [],
        salesAnalytics: null,
      })
    }
  }, [fetchStockAlerts, fetchRecentPrescriptions, fetchSalesAnalytics, onDataLoaded])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return null
}

