/**
 * Formats a number with K, M, B suffixes for better readability
 * @param value - The number to format
 * @param options - Optional configuration
 * @returns Formatted string (e.g., "40.4M", "1.2K", "500")
 */
export const formatCompactNumber = (
  value: number,
  options?: {
    decimals?: number
    showCurrency?: boolean
    currency?: string
  }
): string => {
  const { decimals = 1, showCurrency = false, currency = "₹" } = options || {}

  if (value === 0) {
    return showCurrency ? `${currency}0` : "0"
  }

  const absValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""

  let formattedValue: string
  let suffix: string

  if (absValue >= 1_000_000_000) {
    // Billions
    formattedValue = (absValue / 1_000_000_000).toFixed(decimals)
    suffix = "B"
  } else if (absValue >= 1_000_000) {
    // Millions
    formattedValue = (absValue / 1_000_000).toFixed(decimals)
    suffix = "M"
  } else if (absValue >= 1_000) {
    // Thousands
    formattedValue = (absValue / 1_000).toFixed(decimals)
    suffix = "K"
  } else {
    // Less than 1000
    formattedValue = absValue.toFixed(0)
    suffix = ""
  }

  // Remove trailing zeros after decimal point
  formattedValue = parseFloat(formattedValue).toString()

  const result = `${sign}${formattedValue}${suffix}`
  return showCurrency ? `${currency}${result}` : result
}

