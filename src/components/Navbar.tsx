import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Trade Enquiries', path: '/trade-enquiries' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isDarkHero = location.pathname === '/about' && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-ivoryLight/95 dark:bg-brand-ink/95 backdrop-blur-md border-b border-brand-grey-300/30 dark:border-white/10 shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center gap-3.5 group focus:outline-none">
          <div className="w-10 h-10 transition-transform duration-700 ease-out group-hover:rotate-45">
            <img
              src="/assets/images/siwi-logo.png"
              alt="SIWI Global Ventures Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(198,154,69,0.35)]"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-serif text-2xl tracking-[0.18em] font-medium leading-none group-hover:text-brand-gold transition-colors ${
              isDarkHero ? 'text-brand-ivory' : 'text-brand-ink dark:text-brand-ivory'
            }`}>
              SIWI
            </span>
            <span className={`text-[9px] tracking-[0.24em] font-sans font-semibold uppercase leading-tight mt-1 ${
              isDarkHero ? 'text-brand-grey-300' : 'text-brand-grey-500 dark:text-brand-grey-300'
            }`}>
              Global Ventures
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-[0.14em] font-medium transition-colors relative py-1 ${
                  active
                    ? 'text-brand-gold'
                    : isDarkHero
                    ? 'text-brand-ivory/85 hover:text-brand-gold'
                    : 'text-brand-ink/80 dark:text-brand-ivory/80 hover:text-brand-gold dark:hover:text-brand-gold'
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Restrained Commercial CTA */}
          <Link
            to="/trade-enquiries"
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium border border-brand-gold/60 hover:bg-brand-gold hover:text-brand-ink dark:hover:text-brand-ink transition-all duration-200 ${
              isDarkHero ? 'text-brand-ivory' : 'text-brand-ink dark:text-brand-ivory'
            }`}
          >
            <span>Enquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
            className={`md:hidden p-2 hover:text-brand-gold focus:outline-none ${
              isDarkHero ? 'text-brand-ivory' : 'text-brand-ink dark:text-brand-ivory'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-brand-ivoryLight dark:bg-brand-ink z-40 border-t border-brand-grey-300/30 dark:border-white/10 px-6 py-8 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold">
              Navigation
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-lg font-serif tracking-wide py-2 border-b border-brand-grey-300/20 dark:border-white/5 ${
                  isActive(link.path)
                    ? 'text-brand-gold'
                    : 'text-brand-ink dark:text-brand-ivory'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-brand-grey-300/30 dark:border-white/10 flex flex-col gap-4">
            <div className="text-xs text-brand-grey-500">
              <p className="font-medium text-brand-ink dark:text-brand-ivory">Mumbai, Maharashtra, India</p>
              <p className="mt-1">+91 83696 35619</p>
              <p>siwiglobalventure@gmail.com</p>
            </div>
            <Link
              to="/trade-enquiries"
              className="w-full text-center py-3 bg-brand-gold text-brand-ink font-sans uppercase tracking-[0.16em] text-xs font-semibold"
            >
              Start Trade Enquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
