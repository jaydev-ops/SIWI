import React, { useState } from 'react';
import { api } from '../services/api';
import { Phone, Mail, MapPin, User, CheckCircle2, ArrowRight } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Product Sourcing',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitContact(formData);
      setSubmitted(true);
      setSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 lg:pt-40 lg:pb-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-brand-gold" />
            <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold">
              Contact &amp; Location
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-brand-ink dark:text-brand-ivory mb-6">
            Let's start a conversation.
          </h1>

          <p className="text-base text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
            For product enquiries, sourcing discussions, and business opportunities, get in touch with SIWI Global Ventures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Directory & Verified Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-4">
                Corporate Directory
              </span>
              <div className="space-y-6 text-sm">
                <div>
                  <span className="text-xs text-brand-grey-500 block uppercase tracking-wider mb-1">Company</span>
                  <p className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">SIWI Global Ventures</p>
                </div>

                <div>
                  <span className="text-xs text-brand-grey-500 block uppercase tracking-wider mb-1">Executive Leadership</span>
                  <p className="font-medium text-brand-ink dark:text-brand-ivory flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-gold" />
                    <span>Harshvardhan Patil · Founder</span>
                  </p>
                </div>

                <div>
                  <span className="text-xs text-brand-grey-500 block uppercase tracking-wider mb-1">Direct Telephone</span>
                  <a
                    href="tel:+918369635619"
                    className="font-medium text-base text-brand-gold hover:underline flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 83696 35619</span>
                  </a>
                </div>

                <div>
                  <span className="text-xs text-brand-grey-500 block uppercase tracking-wider mb-1">Official Email</span>
                  <a
                    href="mailto:siwiglobalventure@gmail.com"
                    className="font-medium text-base text-brand-ink dark:text-brand-ivory hover:text-brand-gold flex items-center gap-2 break-all"
                  >
                    <Mail className="w-4 h-4 text-brand-gold" />
                    <span>siwiglobalventure@gmail.com</span>
                  </a>
                </div>

                <div>
                  <span className="text-xs text-brand-grey-500 block uppercase tracking-wider mb-1">Commercial Office</span>
                  <div className="text-xs text-brand-ink/80 dark:text-brand-ivory/80 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-brand-ink dark:text-brand-ivory">Mumbai, Maharashtra, India</p>
                      <p className="text-brand-grey-500 mt-0.5">
                        Opposite Dahisar Station, Dahisar West, Mumbai 400068
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Maritime Port Location Card */}
            <div className="p-6 bg-brand-ivory dark:bg-[#14171C] border border-brand-grey-300/40 dark:border-white/10 space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block">
                Maritime Advantage
              </span>
              <p className="text-xs text-brand-grey-500 dark:text-brand-grey-300 leading-relaxed font-sans">
                Positioned in Mumbai, Maharashtra, near Jawaharlal Nehru Port (JNPT)—India’s premier container port—providing direct multi-modal access to major trade lanes across Europe, the Middle East, Southeast Asia, and the Americas.
              </p>
            </div>
          </div>

          {/* Right: General Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 lg:p-12 border border-brand-gold/40 bg-brand-ivory dark:bg-[#14171C] space-y-6">
                <CheckCircle2 className="w-12 h-12 text-brand-gold stroke-[1.5]" />
                <h2 className="font-serif text-3xl font-medium text-brand-ink dark:text-brand-ivory">
                  Message Sent
                </h2>
                <p className="text-xs text-brand-ink/80 dark:text-brand-ivory/80 font-sans leading-relaxed">
                  Thank you for contacting SIWI Global Ventures. Your message has been received by our commercial team in Mumbai.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'Product Sourcing', message: '' });
                  }}
                  className="px-6 py-3 border border-brand-grey-300/40 dark:border-white/10 text-xs uppercase tracking-wider text-brand-ink dark:text-brand-ivory hover:border-brand-gold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block border-b border-brand-grey-300/30 dark:border-white/10 pb-2">
                  General Dialogue
                </span>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Rossi"
                    className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                    Business Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. elena@company.com"
                    className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none dark:bg-brand-charcoal"
                  >
                    <option value="Product Sourcing" className="bg-brand-ivoryLight dark:bg-brand-ink">Product Sourcing</option>
                    <option value="Trade Partnership" className="bg-brand-ivoryLight dark:bg-brand-ink">Trade Partnership</option>
                    <option value="General Enquiry" className="bg-brand-ivoryLight dark:bg-brand-ink">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your business requirements?"
                    className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-brand-ink text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
