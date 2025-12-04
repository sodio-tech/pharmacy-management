import type { ReactNode } from "react"

export type LicensesData = {
  drug_license_number: string | null
  trade_license_number: string | null
  fire_certificate_number: string | null
  drug_license_expiry: string | null
  trade_license_expiry: string | null
  fire_certificate_expiry: string | null
}

export type LicenseEntry = {
  id: string
  title: string
  numberLabel: string
  number: string | null
  expiry: string | null
  hasExpiry: boolean
  isExpired: boolean
  containerClass: string
  iconWrapperClass: string
  icon: ReactNode
}

export type ComplianceApiResponse = {
  success: boolean
  message: string
  data: {
    licenses: LicensesData
  }
}

