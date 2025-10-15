import Link from "next/link"

export function TermsCta() {
  return (
    <section className="bg-gray-50 w-full py-16">
      <div className="w-full px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started with Pharmy?</h2>
        <p className="text-lg text-gray-600 mb-8">
          By proceeding, you agree to these Terms & Conditions and our Privacy Policy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#"
            className="px-8 py-3 bg-[#0f766e] text-white rounded-lg font-medium hover:bg-[#0d5f58] transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border-2 border-[#0f766e] text-[#0f766e] rounded-lg font-medium hover:bg-[#0f766e] hover:text-white transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  )
}
