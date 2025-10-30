import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

export type HeaderAction = {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline'
  disabled?: boolean
}

type HeaderActionsProps = {
  actions: HeaderAction[]
  children?: ReactNode
}

const variantStyles = {
  primary: "bg-[#0f766e] hover:bg-[#0d6660] text-white",
  secondary: "bg-[#14b8a6] hover:bg-[#0f9488] text-white",
  tertiary: "bg-[#06b6d4] hover:bg-[#0891b2] text-white",
  outline: "bg-transparent"
}

export function HeaderActions({ actions, children }: HeaderActionsProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch sm:items-center justify-center w-full gap-2 lg:gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon
        const variant = action.variant || 'primary'
        const isOutline = variant === 'outline'
        
        return (
          <Button
            key={index}
            variant={isOutline ? 'outline' : undefined}
            className={`w-full lg:w-auto gap-1.5 sm:gap-2 h-10 sm:h-11 text-sm ${variantStyles[variant]}`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{action.label}</span>
          </Button>
        )
      })}
      {children}
    </div>
  )
}

