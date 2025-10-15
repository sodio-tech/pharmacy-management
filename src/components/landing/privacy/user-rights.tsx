import { User, Eye, Edit, Trash2, Download } from "lucide-react"

export default function UserRights() {
  const rights = [
    {
      icon: Eye,
      title: "Access Your Data",
      description: "Request a copy of all personal data we have about you",
      color: "text-[#0f766e]",
      bg: "bg-[#0f766e]/10",
    },
    {
      icon: Edit,
      title: "Correct Information",
      description: "Update or correct any inaccurate personal information",
      color: "text-[#3b82f6]",
      bg: "bg-[#3b82f6]/10",
    },
    {
      icon: Trash2,
      title: "Delete Your Data",
      description: "Request deletion of your account and associated data",
      color: "text-[#ef4444]",
      bg: "bg-[#ef4444]/10",
    },
    {
      icon: Download,
      title: "Data Portability",
      description: "Export your data in a machine-readable format",
      color: "text-[#0f766e]",
      bg: "bg-[#0f766e]/10",
    },
  ]

  return (
    <section className="py-16 px-4 bg-[#f9fafb]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#0f766e]" />
          </div>
          <h2 className="text-2xl font-bold">Your Rights</h2>
        </div>

        <div className="space-y-4">
          {rights.map((right, index) => {
            const Icon = right.icon
            return (
              <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-lg">
                <div className={`w-10 h-10 ${right.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${right.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{right.title}</h3>
                  <p className="text-[#4b5563] text-sm">{right.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
