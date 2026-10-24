import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-ivory dark:bg-[#0E1013] text-brand-ink dark:text-brand-ivory border-t border-brand-grey-300/40 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Column 1: Identity & Tagline (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                  <img
                    src="/assets/images/siwi-logo.png"
                    alt="SIWI Global Ventures Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(198,154,69,0.3)]"
                  />
                </div>
                <div>
                  <span className="font-serif text-2xl tracking-[0.18em] font-medium leading-none block text-brand-ink dark:text-brand-ivory">
                    SIWI
                  </span>
                  <span className="text-[9px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-grey-500 dark:text-brand-grey-300 block mt-1">
                    Global Ventures
                  </span>
                </div>
              </div>

              <p className="font-serif italic text-lg sm:text-xl text-brand-gold mt-6 leading-relaxed max-w-sm">
                “Serving with trust, delivering with quality.”
              </p>

              <p className="text-xs text-brand-grey-500 dark:text-brand-grey-300 mt-4 leading-relaxed max-w-md">
                India-based international trading company connecting quality dehydrated vegetable commodities and agricultural products with international partners.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-grey-300/30 dark:border-white/5 text-[11px] text-brand-grey-500 space-y-1">
              <p>GSTIN: 27BGPPP7746J1ZN</p>
              <p>IEC Code: GBPPP7746J</p>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block mb-6">
              Navigation
            </span>
            <ul className="space-y-3 text-xs tracking-wider uppercase font-medium">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors inline-block py-0.5">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors inline-block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-gold transition-colors inline-block py-0.5">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link to="/trade-enquiries" className="hover:text-brand-gold transition-colors inline-block py-0.5">
                  Trade Enquiries
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-gold transition-colors inline-block py-0.5">
                  Contact
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="text-brand-grey-500 dark:text-brand-grey-500 hover:text-brand-gold dark:hover:text-brand-gold transition-colors inline-flex items-center gap-1 text-[11px] lowercase tracking-normal"
                >
                  <span>Operator Login</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Contact & Location (4 cols) */}
          <div className="md:col-span-4">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block mb-6">
              Commercial Operations
            </span>
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <span className="text-brand-grey-500 dark:text-brand-grey-300 block text-[11px] uppercase tracking-wider mb-1">
                  Location
                </span>
                <p className="font-medium text-brand-ink dark:text-brand-ivory">
                  Mumbai, Maharashtra, India
                </p>
                <p className="text-brand-grey-500 dark:text-brand-grey-300 text-[11px] mt-0.5">
                  Opposite Dahisar Station, Dahisar West, Mumbai 400068
                </p>
              </div>

              <div>
                <span className="text-brand-grey-500 dark:text-brand-grey-300 block text-[11px] uppercase tracking-wider mb-1">
                  Direct Line
                </span>
                <a
                  href="tel:+918369635619"
                  className="font-medium hover:text-brand-gold transition-colors inline-block"
                >
                  +91 83696 35619
                </a>
              </div>

              <div>
                <span className="text-brand-grey-500 dark:text-brand-grey-300 block text-[11px] uppercase tracking-wider mb-1">
                  Business Enquiries
                </span>
                <a
                  href="mailto:siwiglobalventure@gmail.com"
                  className="font-medium hover:text-brand-gold transition-colors inline-block break-all"
                >
                  siwiglobalventure@gmail.com
                </a>
              </div>

              <div>
                <span className="text-brand-grey-500 dark:text-brand-grey-300 block text-[11px] uppercase tracking-wider mb-1">
                  Leadership
                </span>
                <p className="font-medium text-brand-ink dark:text-brand-ivory">
                  Harshvardhan Patil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rule & Legal */}
        <div className="mt-16 pt-8 border-t border-brand-grey-300/30 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-grey-500">
          <p>© {new Date().getFullYear()} SIWI Global Ventures. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-gold transition-colors">
              Terms of Trade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
