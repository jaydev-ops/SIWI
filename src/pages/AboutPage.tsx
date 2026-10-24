import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div>
      {/* ============================================================ */}
      {/* 01. EDITORIAL HERO SECTION (Cinematic Global Trade Background) */}
      {/* ============================================================ */}
      <section className="relative min-h-[80vh] lg:min-h-[88vh] flex items-end pt-36 pb-20 lg:pt-48 lg:pb-28 overflow-hidden bg-brand-ink border-b border-brand-grey-300/30 dark:border-white/10">
        {/* Background Image: Global Trade Fusion (Cargo Vessel + Radiant Worldwide Trade Network Map) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/global_trade_fusion.jpg"
            alt="Global trade fusion: international container cargo vessel navigating ocean waters with illuminated worldwide trade network map and radiating trade corridors"
            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layered luxury editorial scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-brand-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/90 via-brand-ink/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-brand-ink/85 to-transparent" />
        </div>

        {/* Content Over Background */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-brand-gold" />
              <span className="text-[11px] tracking-[0.28em] font-sans font-semibold uppercase text-brand-gold drop-shadow-sm">
                Company &amp; Foundation · International Trade
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.02] tracking-tight text-brand-ivory text-balance drop-shadow-lg">
              Connecting Indian products with global opportunity.
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-brand-gold leading-relaxed drop-shadow-sm">
              “Serving with trust, delivering with quality.”
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-6 sm:gap-10 text-[11px] font-sans tracking-wider uppercase text-brand-ivory/80 border-t border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span>Headquarters: Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span>Maritime Hub: Western Commercial Shipping Ports</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span>Operations: Agricultural &amp; Commodity Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Narrative Section (Authoritative Company Statement) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-16 border-t border-b border-brand-grey-300/30 dark:border-white/10 mb-20">
          <div className="lg:col-span-5">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block mb-3">
              Corporate Overview
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-ink dark:text-brand-ivory leading-tight">
              An international trading house with commercial focus.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-brand-ink/80 dark:text-brand-ivory/80 leading-relaxed font-sans">
            <p>
              SIWI Global Ventures is an India-based import-export company committed to connecting quality Indian products with markets across the globe. Our focus is on building reliable international trade partnerships by delivering quality products, competitive pricing, and dependable service.
            </p>
            <p>
              We specialise in the export of dehydrated vegetable products, including onion powder, garlic powder, garlic granules, dehydrated fried onions, birista, onion kibbles, and other value-added products, catering to diverse international and domestic food manufacturing requirements.
            </p>
            <p>
              Our vision is to take the quality of Indian products to the world, creating lasting business partnerships and sustainable growth through global trade.
            </p>
          </div>
        </div>

        {/* Trade Principles */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block mb-2">
              Foundational Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-ink dark:text-brand-ivory">
              Our Trade Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            <div className="border-t border-brand-gold/60 pt-6 space-y-3">
              <span className="font-serif text-2xl text-brand-gold">01</span>
              <h3 className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">
                Quality-Focused Sourcing
              </h3>
              <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
                Every batch of dehydrated vegetables is verified for consistency, moisture control, aroma, and packaging integrity before export dispatch.
              </p>
            </div>

            <div className="border-t border-brand-gold/60 pt-6 space-y-3">
              <span className="font-serif text-2xl text-brand-gold">02</span>
              <h3 className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">
                Dependable Communication
              </h3>
              <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
                Direct accessibility, verified specification sheets, realistic freight schedules, and honest commercial dialogue on every enquiry.
              </p>
            </div>

            <div className="border-t border-brand-gold/60 pt-6 space-y-3">
              <span className="font-serif text-2xl text-brand-gold">03</span>
              <h3 className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">
                Sustainable Partnerships
              </h3>
              <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
                We believe long-term business relationships are earned through dependable delivery, competitive pricing, and sustained mutual growth.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Leadership Section */}
        <div className="p-10 lg:p-16 bg-brand-ivory dark:bg-[#14171C] border border-brand-grey-300/40 dark:border-white/10 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Compass Vector Emblem */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 p-4 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-charcoal/20 backdrop-blur-sm shadow-xl">
                <img
                  src="/assets/images/siwi-logo.png"
                  alt="SIWI Global Ventures Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(198,154,69,0.3)]"
                />
              </div>
            </div>

            {/* Founder Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold block">
                Executive Leadership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-ink dark:text-brand-ivory">
                Harshvardhan Patil
              </h2>
              <p className="text-xs font-mono text-brand-grey-500 uppercase tracking-widest">
                Founder · Sales Head
              </p>
              <p className="text-sm text-brand-ink/80 dark:text-brand-ivory/80 leading-relaxed font-sans pt-2">
                Founder Harshvardhan Patil leads SIWI Global Ventures with a focus on connecting Indian products with international markets and developing dependable business relationships.
              </p>
              <p className="text-xs text-brand-grey-500 leading-relaxed font-sans">
                Operating directly from Mumbai, Maharashtra, he personally oversees client trade dialogues, product sourcing audits, and commercial commitments.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-brand-grey-500">
                <a href="tel:+918369635619" className="hover:text-brand-gold inline-flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-brand-gold" />
                  <span>+91 83696 35619</span>
                </a>
                <a href="mailto:siwiglobalventure@gmail.com" className="hover:text-brand-gold inline-flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-brand-gold" />
                  <span>siwiglobalventure@gmail.com</span>
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Mumbai, India</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Action */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-ink dark:text-brand-ivory mb-4">
            Let's discuss your sourcing requirements.
          </h2>
          <p className="text-xs text-brand-grey-500 mb-8 font-sans">
            Connect directly with SIWI Global Ventures for product samples, export specifications, or commercial volume quotes.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-brand-ink text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors"
          >
            <span>Contact SIWI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);
};
