import { Card } from "@/components/ui/card"

const stats = [
  {
    title: "Total Products",
    value: "1,247",
    icon: "📦",
    color: "text-[#2563eb]",
    bgColor: "bg-[#dbeafe]",
  },
  {
    title: "Low Stock",
    value: "23",
    icon: "⚠️",
    color: "text-[#ea580c]",
    bgColor: "bg-[#ffedd5]",
  },
  {
    title: "Out of Stock",
    value: "8",
    icon: "🔴",
    color: "text-[#dc2626]",
    bgColor: "bg-[#fee2e2]",
  },
  {
    title: "Expiring Soon",
    value: "15",
    icon: "⏰",
    color: "text-[#ca8a04]",
    bgColor: "bg-[#fef9c3]",
  },
  {
    title: "Total Value",
    value: "₹8.5L",
    icon: "💰",
    color: "text-[#16a34a]",
    bgColor: "bg-[#dcfce7]",
  },
]

export function InventoryStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6b7280] mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
