export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-"
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export const isExpired = (dateString: string | null | undefined) => {
  // If there is no expiry date, treat it as "not expired" but "unknown"
  if (!dateString) return false
  const expiry = new Date(dateString)
  if (Number.isNaN(expiry.getTime())) return true
  const now = new Date()
  return expiry < now
}

export const getLicenseBadgeVisuals = (hasExpiry: boolean, isExpired: boolean) => {
  if (!hasExpiry) {
    return { badgeLabel: "Not Available", badgeClass: "bg-[#e5e7eb] text-[#6b7280]" }
  }
  if (isExpired) {
    return { badgeLabel: "Expired", badgeClass: "bg-[#fee2e2] text-[#dc2626]" }
  }
  return { badgeLabel: "Valid", badgeClass: "bg-[#dcfce7] text-[#16a34a]" }
}

