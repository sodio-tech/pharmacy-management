import { Card } from "@/components/ui/card"

const stats = [
  {
    title: "Total Prescriptions",
    value: "342",
    icon: "📋",
    color: "text-[#2563eb]",
    bgColor: "bg-[#dbeafe]",
  },
  {
    title: "Pending Validation",
    value: "18",
    icon: "⏳",
    color: "text-[#ea580c]",
    bgColor: "bg-[#ffedd5]",
  },
  {
    title: "Validated Today",
    value: "25",
    icon: "✅",
    color: "text-[#16a34a]",
    bgColor: "bg-[#dcfce7]",
  },
  {
    title: "Rejected",
    value: "3",
    icon: "❌",
    color: "text-[#dc2626]",
    bgColor: "bg-[#fee2e2]",
  },
  {
    title: "Dispensed",
    value: "298",
    icon: "💊",
    color: "text-[#9333ea]",
    bgColor: "bg-[#f3e8ff]",
  },
]

export function PrescriptionStats() {
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
