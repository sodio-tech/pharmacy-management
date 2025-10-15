export function PricingFaq() {
  const faqs = [
    {
      question: "Can I upgrade or downgrade later?",
      answer:
        "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades will take effect at the end of your current billing cycle.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! We offer a 14-day free trial for all plans. No credit card required to get started. You can explore all features before making a commitment.",
    },
    {
      question: "Do I need to install anything?",
      answer:
        "No, Pharmy is a cloud-based solution that works in your web browser. You can access it from any device with an internet connection.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption, regular backups, and comply with healthcare data protection standards. Your data is stored securely in the cloud.",
    },
    {
      question: "What if I manage multiple branches?",
      answer:
        "Our Pro plan supports up to 5 branches, while Enterprise offers unlimited branches with centralized management and reporting across all locations.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-[#ffffff]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#111827] mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-[#4b5563]">Everything you need to know about Pharmy pricing</p>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#e5e7eb] pb-8 last:border-0">
              <h3 className="text-xl font-semibold text-[#111827] mb-3">{faq.question}</h3>
              <p className="text-[#4b5563] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
