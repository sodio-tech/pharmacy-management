export function TermsResponsibilities() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#111827] mb-4">4. User Responsibilities</h2>
      <div className="space-y-4 text-[#4b5563]">
        <p>Users agree to:</p>
        <ul className="space-y-2 ml-6">
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Maintain the security and confidentiality of login credentials</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Use Pharmy only for lawful pharmacy operations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Comply with all applicable local, state, and federal pharmacy regulations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Ensure accurate data entry and prescription handling</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Report any suspected security breaches immediately</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Not attempt to reverse engineer, copy, or redistribute Pharmy's software</span>
          </li>
        </ul>
        <p>
          Pharmacies remain solely responsible for compliance with healthcare regulations including HIPAA, controlled
          substance laws, and prescription dispensing requirements.
        </p>
      </div>
    </section>
  )
}
