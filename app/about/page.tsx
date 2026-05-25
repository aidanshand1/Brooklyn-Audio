export default function About() {
  const inventory = [
    'Turntables', 'Tonearms',
    'Amplifiers', 'Preamplifiers',
    'Speakers', 'Subwoofers',
    'Cartridges', 'Phono Preamps',
    'Headphones', 'HP Amps',
    'CD Players', 'DACs',
    'Cables', 'Power Conditioning',
    'Record Care', 'Used / Demo',
  ]

  return (
    <div>
      {/* Hero */}
      <div className="bg-[var(--burgundy)] text-white px-10 py-14">
        <div className="text-[11px] tracking-wider uppercase text-[#e8a0a0] mb-3 font-normal">
          Dartmouth, Nova Scotia · Est. 1994
        </div>
        <h1 className="font-serif text-[52px] font-light leading-none text-white mb-4">
          Thirty years of<br />
          <em className="italic text-[#e8a0a0]">serious listening.</em>
        </h1>
        <p className="text-[13px] text-[#d4b8b8] leading-relaxed max-w-[440px]">
          Brooklyn Audio has been Dartmouth's destination for high-fidelity audio since 1994.
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2">

        {/* Left — Story */}
        <div className="px-12 py-14 border-r border-[var(--border)]">
          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--red)] mb-5">
            Our story
          </div>

          <div className="text-[13px] text-[var(--muted)] leading-relaxed space-y-4 max-w-lg">
            <p>
              Brooklyn Audio has been Dartmouth's destination for high-fidelity audio for over thirty years. We carry a carefully curated selection of turntables, amplifiers, speakers, and accessories from the world's finest manufacturers.
            </p>
            <p>
              Whether you're building your first system or upgrading a reference rig, we take the time to listen — to you, and with you — to find the right combination of components for your ears, your room, and your budget.
            </p>
            <p>
              We carry new, used, and demo equipment. Great sound doesn't have to cost a fortune.
            </p>
          </div>

          <blockquote className="mt-10 border-l-2 border-[var(--red)] pl-5">
            <p className="font-serif text-[26px] font-light italic text-[var(--text)] leading-snug">
              "Come in, sit down,<br />
              and let the music<br />
              do the talking."
            </p>
          </blockquote>

          <div className="h-px bg-[var(--border)] my-10" />

          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--muted)] mb-3">
            Arrange a listening session
          </div>
          <div className="text-[13px] leading-loose">
            <span className="text-[var(--text)] font-medium">902-463-8773</span>
            <span className="mx-2 text-[var(--light)]">·</span>
            <a
              href="mailto:jody.crane@ns.sympatico.ca"
              className="text-[var(--red)] hover:text-[var(--red-dark)] transition-colors"
            >
              jody.crane@ns.sympatico.ca
            </a>
          </div>
        </div>

        {/* Right — Hours + Info */}
        <div className="bg-[var(--offwhite)] px-12 py-14">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] rounded mb-10">
            {[
              { value: '30+', label: 'Years open' },
              { value: '200+', label: 'In stock' },
              { value: '1994', label: 'Est.' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white px-4 py-5 text-center">
                <div className="font-serif text-[30px] font-light text-[var(--text)] leading-none">{value}</div>
                <div className="text-[10px] tracking-wide uppercase text-[var(--muted)] mt-1.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Hours */}
          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--muted)] mb-4">
            Hours of operation
          </div>

          <div className="mb-10">
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

          {/* What we carry */}
          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--muted)] mb-4">
            What we carry
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6">
            {inventory.map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="w-3 h-px bg-[var(--border2)] flex-shrink-0 inline-block" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
