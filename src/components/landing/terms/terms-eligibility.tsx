export function TermsEligibility() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#111827] mb-4">2. Eligibility & User Accounts</h2>
      <div className="space-y-4 text-[#4b5563]">
        <p>
          Pharmy is intended exclusively for licensed pharmacies, certified pharmacists, and authorized pharmacy
          personnel. Users must:
        </p>
        <ul className="space-y-2 ml-6">
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Be at least 18 years of age</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Hold valid pharmacy licenses where required by law</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Provide accurate and complete information during account registration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Maintain the confidentiality of account credentials</span>
          </li>
        </ul>
        <p>
          Pharmacy administrators are responsible for managing access permissions and ensuring that only authorized
          personnel have access to the system.
        </p>
      </div>
    </section>
  )
}
