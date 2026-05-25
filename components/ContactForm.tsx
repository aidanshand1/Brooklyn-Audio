'use client'

import { useState } from 'react'

export function ContactForm({ initialSubject = '' }: { initialSubject?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="font-serif text-2xl text-[var(--text)] mb-4">
          Thank you!
        </div>
        <p className="text-[var(--muted)]">
          We'll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[10px] font-medium tracking-wide uppercase text-[var(--muted)] mb-1.5">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          className="w-full bg-white border border-[var(--border)] text-[var(--text)] font-sans text-[13px] px-3 py-2.5 outline-none transition-colors focus:border-[var(--red)] rounded-sm"
        />
      </div>
      
      <div>
        <label className="block text-[10px] font-medium tracking-wide uppercase text-[var(--muted)] mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
          className="w-full bg-white border border-[var(--border)] text-[var(--text)] font-sans text-[13px] px-3 py-2.5 outline-none transition-colors focus:border-[var(--red)] rounded-sm"
        />
      </div>
      
      <div>
        <label className="block text-[10px] font-medium tracking-wide uppercase text-[var(--muted)] mb-1.5">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g. Inquiry about the Harbeth HL5Plus"
          required
          className="w-full bg-white border border-[var(--border)] text-[var(--text)] font-sans text-[13px] px-3 py-2.5 outline-none transition-colors focus:border-[var(--red)] rounded-sm"
        />
      </div>
      
      <div>
        <label className="block text-[10px] font-medium tracking-wide uppercase text-[var(--muted)] mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what you're looking for..."
          rows={6}
          required
          className="w-full bg-white border border-[var(--border)] text-[var(--text)] font-sans text-[13px] px-3 py-2.5 outline-none transition-colors focus:border-[var(--red)] rounded-sm resize-y min-h-[100px]"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-sans text-[11px] font-medium tracking-wider uppercase px-6 py-3 bg-[var(--red)] text-white border-none cursor-pointer transition-colors rounded-sm hover:bg-[var(--red-dark)] disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
