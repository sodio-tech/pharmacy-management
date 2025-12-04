"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle, FileText } from "lucide-react"
import backendApi from "@/lib/axios-config"
import { useAppSelector } from "@/store/hooks"
import { StatusCards } from "./components/StatusCards"
import { LicensePermitsSection } from "./components/LicensePermitsSection"
import { TaxComplianceCard } from "./components/TaxComplianceCard"
import { isExpired } from "./utils"
import type { LicensesData, LicenseEntry, ComplianceApiResponse } from "./types"

export function ComplianceDashboard() {
  const [licenses, setLicenses] = useState<LicensesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Refetch when global selected branch changes
  const selectedBranchId = useAppSelector((state) => state.branch.selectedBranchId)

  useEffect(() => {
    let isMounted = true

    const fetchCompliance = async () => {
      try {
        const res = await backendApi.get<ComplianceApiResponse>("/v1/org/compliance/general-report", {
          params: {
            branch_id: selectedBranchId ?? undefined,
          },
        })
        if (isMounted && res.data?.success && res.data.data?.licenses) {
          setLicenses(res.data.data.licenses)
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch compliance report.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Reset state while refetching on branch change
    setLoading(true)
    setError(null)
    setLicenses(null)

    fetchCompliance()

    return () => {
      isMounted = false
    }
  }, [selectedBranchId])

  const drugExpired = licenses ? isExpired(licenses.drug_license_expiry) : false
  const tradeExpired = licenses ? isExpired(licenses.trade_license_expiry) : false
  const fireExpired = licenses ? isExpired(licenses.fire_certificate_expiry) : false

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#6b7280]">Loading compliance data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (!licenses) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#6b7280]">No compliance data available.</p>
      </div>
    )
  }

  const drugHasExpiry = Boolean(licenses.drug_license_expiry)
  const tradeHasExpiry = Boolean(licenses.trade_license_expiry)
  const fireHasExpiry = Boolean(licenses.fire_certificate_expiry)
  const missingExpiryData = !drugHasExpiry || !tradeHasExpiry || !fireHasExpiry
  const overallValid = !missingExpiryData && !drugExpired && !tradeExpired && !fireExpired

  const licenseEntries: LicenseEntry[] = [
    {
      id: "drug",
      title: "Retail Drug License",
      numberLabel: "License No",
      number: licenses.drug_license_number,
      expiry: licenses.drug_license_expiry,
      hasExpiry: drugHasExpiry,
      isExpired: drugExpired,
      containerClass: "bg-[#f0fdf4]",
      iconWrapperClass: "bg-[#16a34a]",
      icon: <CheckCircle className="w-4 h-4 text-white" />,
    },
    {
      id: "trade",
      title: "Trade License",
      numberLabel: "License No",
      number: licenses.trade_license_number,
      expiry: licenses.trade_license_expiry,
      hasExpiry: tradeHasExpiry,
      isExpired: tradeExpired,
      containerClass: "bg-[#f0fdf4]",
      iconWrapperClass: "bg-[#16a34a]",
      icon: <FileText className="w-4 h-4 text-white" />,
    },
    {
      id: "fire",
      title: "Fire Safety Certificate",
      numberLabel: "Certificate No",
      number: licenses.fire_certificate_number,
      expiry: licenses.fire_certificate_expiry,
      hasExpiry: fireHasExpiry,
      isExpired: fireExpired,
      containerClass: "bg-[#fef9c3]",
      iconWrapperClass: "bg-[#ca8a04]",
      icon: <AlertTriangle className="w-4 h-4 text-white" />,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatusCards
        drugHasExpiry={drugHasExpiry}
        drugExpired={drugExpired}
        drugExpiry={licenses.drug_license_expiry}
      />

      <LicensePermitsSection
        entries={licenseEntries}
        missingExpiryData={missingExpiryData}
        overallValid={overallValid}
      />

      <TaxComplianceCard />

      {/* <ControlledSubstancesSection /> */}
      {/* <AdditionalComplianceGrid /> */}
    </div>
  )
}
