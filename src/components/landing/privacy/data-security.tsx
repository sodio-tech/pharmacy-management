import { Shield, Lock, Key, FileCheck, Server } from "lucide-react"

export default function DataSecurity() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Encryption",
      description: "End-to-end encryption of all sensitive data",
    },
    {
      icon: Key,
      title: "Authentication",
      description: "Two-factor authentication for admin accounts",
    },
    {
      icon: FileCheck,
      title: "Document Security",
      description: "Secure prescription and document storage",
    },
    {
      icon: Server,
      title: "Backup Systems",
      description: "Regular backups and restore capabilities",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#0f766e]" />
          </div>
          <h2 className="text-2xl font-bold">Data Security</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0f766e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#0f766e]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-[#4b5563] text-sm">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
