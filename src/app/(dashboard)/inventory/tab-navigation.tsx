"use client"

export type TabType = "lowStock" | "expiring"

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center justify-between border-b">
      <div className="flex space-x-6 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
        <button
          onClick={() => onTabChange("lowStock")}
          className={`text-sm font-medium pb-2 whitespace-nowrap transition-colors ${
            activeTab === "lowStock"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Low Stock Alerts
        </button>
        <button
          onClick={() => onTabChange("expiring")}
          className={`text-sm font-medium pb-2 whitespace-nowrap transition-colors ${
            activeTab === "expiring"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Expiring Soon
        </button>
      </div>
    </div>
  )
}
