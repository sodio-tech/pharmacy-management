export function TermsAvailability() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-[#111827]">10. Service Availability & Updates</h2>

      <p className="text-[#4b5563] leading-relaxed">
        Pharmy strives to maintain 99.9% uptime but cannot guarantee uninterrupted service due to:
      </p>

      <ul className="space-y-2 ml-6">
        <li className="text-[#4b5563] leading-relaxed">Scheduled maintenance and updates</li>
        <li className="text-[#4b5563] leading-relaxed">Third-party service dependencies</li>
        <li className="text-[#4b5563] leading-relaxed">Force majeure events beyond our control</li>
        <li className="text-[#4b5563] leading-relaxed">Security incidents requiring immediate response</li>
      </ul>

      <p className="text-[#4b5563] leading-relaxed">
        Pharmy reserves the right to update, modify, or discontinue features with reasonable notice to users.
      </p>
    </section>
  )
}
