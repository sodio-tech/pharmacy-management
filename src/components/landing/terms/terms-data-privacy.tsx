import Link from "next/link"

export function TermsDataPrivacy() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#111827] mb-4">6. Data Handling & Privacy</h2>
      <div className="space-y-4 text-[#4b5563]">
        <p>Pharmy is committed to protecting user data and patient privacy:</p>
        <ul className="space-y-2 ml-6">
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>All data is collected and processed in accordance with our Privacy Policy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Sensitive information including prescriptions and patient data is encrypted</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Users retain ownership of their pharmacy data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Data backups are performed daily with secure cloud storage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6b7280] mt-1">•</span>
            <span>Users remain responsible for HIPAA, GDPR, and local privacy law compliance</span>
          </li>
        </ul>
        <p>
          For detailed information about data handling practices, please review our{" "}
          <Link href="/privacy" className="text-[#0f766e] hover:underline font-medium">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
