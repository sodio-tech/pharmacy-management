import { TabType } from "./types"

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-6 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
        <button
          onClick={() => onTabChange("suppliers")}
          className={`text-sm font-medium pb-2 whitespace-nowrap transition-colors ${
            activeTab === "suppliers"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Suppliers
        </button>
        <button
          onClick={() => onTabChange("orders")}
          className={`text-sm font-medium pb-2 whitespace-nowrap transition-colors ${
            activeTab === "orders"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Purchase Orders
        </button>
      </div>
    </div>
  )
}

