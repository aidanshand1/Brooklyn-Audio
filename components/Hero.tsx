export function Hero() {
  return (
    <div className="bg-[var(--burgundy)] text-white flex items-center justify-between px-12 py-16 gap-10">
      <div className="flex-1">
        <div className="text-[11px] tracking-wider uppercase text-[#e8a0a0] mb-4 font-normal">
          Dartmouth, Nova Scotia · Est. 1994
        </div>
        <p className="font-serif text-[58px] font-light leading-none text-white mb-5">
          Getting you<br />
          in <em className="italic text-[#e8a0a0]">the groove</em>
        </p>
        <p className="text-[13px] text-[#d4b8b8] leading-relaxed max-w-[400px]">
          High-fidelity audio for serious listeners. Turntables, amplifiers, speakers and more — curated for over 30 years.
        </p>
      </div>

      <div className="flex border-l border-white/15">
        <div className="px-10 py-6 border-r border-white/15 text-center">
          <div className="font-serif text-[36px] font-light text-white leading-none">30+</div>
          <div className="text-[10px] tracking-wide uppercase text-[#d4b8b8] mt-2">Years open</div>
        </div>
        <div className="px-10 py-6 border-r border-white/15 text-center">
          <div className="font-serif text-[36px] font-light text-white leading-none">200+</div>
          <div className="text-[10px] tracking-wide uppercase text-[#d4b8b8] mt-2">Items in stock</div>
        </div>
        <div className="px-10 py-6 text-center">
          <div className="font-serif text-[36px] font-light text-white leading-none">1994</div>
          <div className="text-[10px] tracking-wide uppercase text-[#d4b8b8] mt-2">Est.</div>
        </div>
      </div>
    </div>
  )
}
