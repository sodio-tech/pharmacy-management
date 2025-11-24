export interface Branch {
  id: number
  branch_name: string
  branch_location: string
  drug_license_number: string
  drug_license_expiry?: string
  trade_license_number?: string
  trade_license_expiry?: string
  fire_certificate_number?: string
  fire_certificate_expiry?: string
}

export interface BranchForm {
  branch_name: string
  branch_location: string
  drug_license_number: string
  pharmacy_id?: number
}

export interface EmployeeForm {
  pharmacy_id?: number
  role: "ADMIN" | "PHARMACIST" | "SUPER_ADMIN"
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
}

export interface OrganizationStats {
  teamMembers: number
  branches: number
  admins: number
  pharmacists: number
}

