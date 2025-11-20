import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface GetStartedFreeButtonProps {
  className?: string
  href?: string
}

export function GetStartedFreeButton({ 
  className,
  href = "/signup"
}: GetStartedFreeButtonProps) {
  return (
    <Button className={cn("bg-[#0f766e] hover:bg-[#0f766e]/90 text-white px-6 py-6 text-base", className)}>
      <Link href={href}>Get Started Free</Link>
    </Button>
  )
}

