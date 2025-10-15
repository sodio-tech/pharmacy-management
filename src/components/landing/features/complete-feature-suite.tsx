export function CompleteFeatureSuite() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      iconBg: "#0f766e",
      title: "Reporting & Analytics",
      description: "Comprehensive insights on sales, inventory, and business performance with customizable reports.",
      items: ["Sales reports (daily/weekly/monthly/yearly)", "Profit & loss analysis", "Inventory valuation reports"],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      iconBg: "#3b82f6",
      title: "Supplier Management",
      description: "Complete supplier relationship management with automated ordering and payment tracking.",
      items: ["Supplier database management", "Purchase order generation", "Automated reordering system"],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "#0f766e",
      title: "Regulatory Compliance",
      description: "Stay compliant with drug regulations, tax requirements, and controlled substance tracking.",
      items: ["Drug license validation", "GST/tax compliance reports", "Full audit trail logging"],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "#3b82f6",
      title: "Medicine Information System",
      description: "Comprehensive medicine database with composition, substitutes, and safety information.",
      items: ["Drug interaction verification", "Dosage & storage guidelines", "Alternative brand suggestions"],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      iconBg: "#0f766e",
      title: "Security & Backup",
      description: "Enterprise-grade security with end-to-end encryption and automated backup systems.",
      items: ["End-to-end data encryption", "Two-factor authentication", "Automated daily backups"],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      iconBg: "#3b82f6",
      title: "Multi-Branch Support",
      description: "Centralized management for multiple pharmacy locations with consolidated reporting.",
      items: ["Centralized dashboard", "Inter-branch stock transfers", "Consolidated admin reporting"],
    },
  ]

  return (
    <section className="py-20 px-6 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Complete Feature Suite</h2>
          <p className="text-[#4b5563] text-lg max-w-2xl mx-auto">Everything you need for modern pharmacy management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                style={{ backgroundColor: feature.iconBg }}
              >
                <div className="text-white">{feature.icon}</div>
              </div>

              <h3 className="text-xl font-semibold text-[#111827] mb-3">{feature.title}</h3>

              <p className="text-[#4b5563] text-sm mb-4">{feature.description}</p>

              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-[#374151] text-sm flex items-start gap-2">
                    <span className="text-[#0f766e] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
