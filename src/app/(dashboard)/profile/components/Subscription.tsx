"use client"

import { Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Subscription() {
  const plans = [
    {
      name: "Community",
      badge: "Free Forever",
      badgeColor: "bg-[#22c55e]",
      subtitle: "Perfect to get started",
      price: "Free",
      period: "",
      features: [
        "1 Branch",
        "Up to 20 items",
        "10 invoices/month",
        "5 suppliers max",
        "Basic expiry alerts",
        "Sales reports only",
      ],
      buttonText: "Your Current Plan",
      buttonVariant: "current" as const,
      isCurrent: true,
      isPopular: false,
    },
    {
      name: "Basic",
      badge: null,
      subtitle: "For independent pharmacies",
      price: "$49",
      period: "/month",
      features: [
        "1 Branch",
        "Admin + Pharmacist roles",
        "Unlimited inventory",
        "Multi-payment support",
        "Manual prescriptions",
        "Basic + expiry reports",
        "Email/SMS alerts",
      ],
      buttonText: "Get Started",
      buttonVariant: "secondary" as const,
      isCurrent: false,
      isPopular: false,
    },
    {
      name: "Pro",
      badge: "Most Popular",
      badgeColor: "bg-[#0f766e]",
      subtitle: "For growing pharmacies",
      price: "$99",
      period: "/month",
      features: [
        "Up to 5 branches",
        "Everything in Basic +",
        "AI-powered OCR",
        "Stock forecasting",
        "Supplier management",
        "Advanced analytics",
        "WhatsApp alerts",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "primary" as const,
      isCurrent: false,
      isPopular: true,
    },
    {
      name: "Enterprise",
      badge: null,
      subtitle: "For large networks",
      price: "Custom",
      period: "",
      features: [
        "Unlimited branches",
        "Everything in Pro +",
        "Franchise dashboard",
        "Custom integrations",
        "Fraud detection",
        "Voice search",
        "Dedicated manager",
        "Priority support",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "enterprise" as const,
      isCurrent: false,
      isPopular: false,
    },
  ]

  const billingHistory = [
    {
      id: "#INV-2024-003",
      date: "Sep 15, 2024",
      amount: "$0.00",
      status: "Paid",
    },
    {
      id: "#INV-2024-002",
      date: "Aug 15, 2024",
      amount: "$0.00",
      status: "Paid",
    },
    {
      id: "#INV-2024-001",
      date: "Jul 15, 2024",
      amount: "$0.00",
      status: "Paid",
    },
  ]

  return (
    <div className="space-y-8 mt-6">
      {/* Pricing Section */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-3xl font-bold text-[#111827]">Find the perfect plan for your pharmacy</h2>
        <p className="text-[#6b7280] text-base">
          Start for free and scale as you grow. All plans include our core features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative p-6 flex flex-col ${
              plan.isCurrent || plan.isPopular ? "border-2 border-[#0f766e]" : "border border-[#e5e7eb]"
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className={`${plan.badgeColor} text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#111827] mb-1">{plan.name}</h3>
              <p className="text-sm text-[#6b7280]">{plan.subtitle}</p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#111827]">{plan.price}</span>
                {plan.period && <span className="text-[#6b7280] text-base">{plan.period}</span>}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#374151]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              className={`w-full ${
                plan.buttonVariant === "current"
                  ? "bg-[#0f766e] text-white hover:bg-[#0f766e] opacity-100"
                  : plan.buttonVariant === "primary"
                    ? "bg-[#0f766e] text-white hover:bg-[#0d6560]"
                    : plan.buttonVariant === "enterprise"
                      ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                      : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
              }`}
              disabled={plan.buttonVariant === "current"}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>

      {/* Billing History */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#111827]">Billing History</h3>
            <p className="text-sm text-[#6b7280] mt-1">Download your previous invoices.</p>
          </div>
          <Button variant="link" className="text-[#0f766e] hover:text-[#0d6560] font-medium">
            Manage Billing
          </Button>
        </div>

        {/* Table */}
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-[#6b7280]">Invoice ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-[#6b7280]">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-[#6b7280]">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-[#6b7280]">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {billingHistory.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#f9fafb]">
                  <td className="py-4 px-6 text-sm font-medium text-[#111827]">{invoice.id}</td>
                  <td className="py-4 px-6 text-sm text-[#6b7280]">{invoice.date}</td>
                  <td className="py-4 px-6 text-sm text-[#111827]">{invoice.amount}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="flex items-center gap-2 text-sm font-medium text-[#0f766e] hover:text-[#0d6560]">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
