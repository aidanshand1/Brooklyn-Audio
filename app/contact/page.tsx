import { ContactForm } from '@/components/ContactForm'

export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject } = await searchParams
  return (
    <div>
      {/* Hero */}
      <div className="bg-[var(--burgundy)] text-white px-10 py-14">
        <div className="text-[11px] tracking-wider uppercase text-[#e8a0a0] mb-3 font-normal">
          Dartmouth, Nova Scotia · Est. 1994
        </div>
        <h1 className="font-serif text-[52px] font-light leading-none text-white mb-4">
          Let's talk<br />
          <em className="italic text-[#e8a0a0]">audio.</em>
        </h1>
        <p className="text-[13px] text-[#d4b8b8] leading-relaxed max-w-[440px]">
          Questions about equipment, pricing, or booking a listening session — we're happy to help.
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2">

        {/* Left — Contact details */}
        <div className="px-12 py-14 border-r border-[var(--border)]">
          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--red)] mb-5">
            Reach us
          </div>

          <div className="mb-10">
            {[
              {
                label: 'Phone',
                value: '782-640-3160',
                href: 'tel:7826403160',
              },
              {
                label: 'Appointments',
                value: '902-463-8773',
                href: 'tel:9024638773',
              },
              {
                label: 'Email',
                value: 'jody.crane@ns.sympatico.ca',
                href: 'mailto:jody.crane@ns.sympatico.ca',
                red: true,
              },
              {
                label: 'Location',
                value: 'Dartmouth, Nova Scotia',
              },
            ].map(({ label, value, href, red }, i, arr) => (
              <div
                key={label}
                className={`py-4 ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
              >
                <div className="text-[10px] font-medium tracking-wider uppercase text-[var(--muted)] mb-1">
                  {label}
                </div>
                {href ? (
                  <a
                    href={href}
                    className={`font-serif text-lg leading-snug transition-colors ${
                      red
                        ? 'text-[var(--red)] hover:text-[var(--red-dark)]'
                        : 'text-[var(--text)] hover:text-[var(--red)]'
                    }`}
                  >
                    {value}
                  </a>
                ) : (
                  <div className="font-serif text-lg text-[var(--text)]">{value}</div>
                )}
              </div>
            ))}
          </div>

          <div className="h-px bg-[var(--border)] mb-10" />

          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--muted)] mb-4">
            Hours of operation
          </div>
          <div>
            {[
              { days: 'Tuesday – Thursday', hours: '11:00 am – 8:00 pm' },
              { days: 'Friday – Saturday', hours: '10:00 am – 5:00 pm' },
              { days: 'Sunday', hours: null },
              { days: 'Monday', hours: null },
            ].map(({ days, hours }, i, arr) => (
              <div
                key={days}
                className={`flex justify-between py-3 text-[13px] ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
              >
                <span className="text-[var(--muted)]">{days}</span>
                {hours
                  ? <span className="text-[var(--text)] font-medium">{hours}</span>
                  : <span className="text-[var(--light)]">Closed</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div className="bg-[var(--offwhite)] px-12 py-14">
          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--muted)] mb-2">
            Send a message
          </div>
          <p className="font-serif text-[26px] font-light text-[var(--text)] leading-snug mb-8">
            We'll get back to you<br />
            <em className="italic">within one business day.</em>
          </p>
          <ContactForm initialSubject={subject || ''} />
        </div>
      </div>
    </div>
  )
}
