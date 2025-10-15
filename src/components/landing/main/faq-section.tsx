const faqs = [
  {
    question: "Can Pharmy work offline?",
    answer:
      "Yes, Pharmy has offline capabilities for core functions. Data syncs automatically when connection is restored.",
  },
  {
    question: "Is my pharmacy data secure?",
    answer:
      "Absolutely. We use end-to-end encryption, secure cloud storage, and comply with all healthcare data regulations.",
  },
  {
    question: "Does it support multiple branches?",
    answer:
      "Yes, Pharmy is designed for multi-branch operations with centralized management and branch-level reporting.",
  },
  {
    question: "Can I migrate from my old system?",
    answer: "Our team provides free data migration assistance to ensure a smooth transition from your existing system.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>

        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
