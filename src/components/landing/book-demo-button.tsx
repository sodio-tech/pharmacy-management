import { Button } from "@/components/ui/button"
import { BookDemoModal } from "./book-demo-modal"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface BookDemoButtonProps {
  className?: string
  variant?: ButtonProps["variant"]
}

export function BookDemoButton({ className, variant = "outline" }: BookDemoButtonProps) {
  return (
    <BookDemoModal>
      <Button
        variant={variant}
        className={cn("border-[#0f766e] text-[#0f766e] hover:bg-[#0f766e]/5 px-6 py-6 text-base bg-transparent", className)}
      >
        Book a Demo
      </Button>
    </BookDemoModal>
  )
}

