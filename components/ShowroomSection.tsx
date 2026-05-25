import Image from 'next/image'

export function ShowroomSection() {
  return (
    <div className="relative border-b border-[var(--border)] overflow-hidden h-[260px]">
      <Image
        src="/brooklyn-audio-room.jpg"
        alt="Brooklyn Audio Listening Room"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-end px-12 pb-10">
        <div>
          <h2 className="font-serif text-[40px] font-light text-white leading-tight">
            Hear the difference<br />
            <em className="italic text-[#e8a0a0]">for yourself.</em>
          </h2>
          <p className="text-[13px] text-white/60 mt-2">
            Our listening room in Dartmouth, NS — open by appointment.
          </p>
        </div>
      </div>
    </div>
  )
}
