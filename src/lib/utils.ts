import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a percentage with 2 decimal places
 * @param value - The number to format as percentage
 * @returns Formatted percentage string (e.g., "12.34%")
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0.00%"
  }
  return `${Number(value).toFixed(2)}%`
}
