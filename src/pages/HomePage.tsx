import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { ArrowRight, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const dehydratedProducts = products.filter(
    (p) => p.category_slug === 'dehydrated-vegetables' || p.primary_category_id === 'cat_dehydrated'
  );

  return (
    <div className="relative">
      {/* ============================================================ */}
      {/* 01. HERO SECTION (Asymmetric Editorial Split)                 */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Typographic Statement (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-brand-gold" />
                <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold">
                  India · International Trade
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.02] tracking-tight text-brand-ink dark:text-brand-ivory">
                Indian products.
                <br />
                <span className="italic text-brand-gold">Global possibilities.</span>
              </h1>

              <p className="text-base sm:text-lg text-brand-ink/75 dark:text-brand-ivory/75 max-w-xl font-sans font-normal leading-relaxed">
                SIWI Global Ventures connects quality Indian products with international markets through dependable trade partnerships and a focus on quality.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-ink font-sans text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors"
                >
                  <span>Explore Our Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/trade-enquiries"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-ink/30 dark:border-white/20 text-brand-ink dark:text-brand-ivory font-sans text-xs uppercase tracking-[0.16em] font-medium hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <span>Discuss Requirements</span>
                </Link>
              </div>

              <div className="pt-6 flex items-center gap-6 text-[11px] text-brand-grey-500 tracking-wider uppercase">
                <span>Headquarters: Mumbai, India</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
                <span>Agricultural Export</span>
              </div>
            </div>

            {/* Right Hero Image (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden bg-brand-charcoal">
                <img
                  src="/assets/images/hero_still_life.jpg"
                  alt="Editorial still life of Indian dehydrated ingredients on slate"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Image caption badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-brand-ink/80 backdrop-blur-sm p-4 border border-white/10 text-brand-ivory">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold block font-semibold mb-1">
                    Commodity Study
                  </span>
                  <p className="text-xs font-serif italic text-brand-ivory/90">
                    Dehydrated onion powder, flakes, and garlic granules in macro detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 02. EDITORIAL PRODUCT SHOWCASE (Dehydrated Vegetables)        */}
      {/* ============================================================ */}
      <section className="py-24 lg:py-36 border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mb-16 lg:mb-24">
            <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold block mb-3">
              Primary Export Portfolio
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-brand-ink dark:text-brand-ivory mb-6">
              Made for many possibilities.
            </h2>
            <p className="text-base text-brand-ink/70 dark:text-brand-ivory/70 font-sans leading-relaxed">
              Our core export operations focus on dehydrated vegetable products sourced from premier growing regions in India. Milled, granulated, and packaged to meet exacting international food manufacturing specifications.
            </p>
          </div>

          {/* Asymmetric Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {dehydratedProducts.slice(0, 6).map((product, idx) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="group flex flex-col justify-between border-b border-brand-grey-300/40 dark:border-white/10 pb-8 transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-charcoal mb-6">
                    <img
                      src={product.featured_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-brand-ink/80 text-brand-gold text-[10px] font-mono px-2 py-1 uppercase tracking-wider backdrop-blur-sm border border-brand-gold/20">
                      0{idx + 1}
                    </div>
                  </div>

                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-2">
                    Dehydrated Range
                  </span>
                  <h3 className="font-serif text-2xl lg:text-3xl font-medium text-brand-ink dark:text-brand-ivory group-hover:text-brand-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-brand-ink/70 dark:text-brand-ivory/70 mt-3 leading-relaxed line-clamp-3">
                    {product.short_description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-grey-300/20 dark:border-white/5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-brand-gold">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-brand-ink dark:text-brand-ivory hover:text-brand-gold dark:hover:text-brand-gold transition-colors pb-1 border-b border-brand-gold"
            >
              <span>Explore Complete Product Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 03. THE SIWI APPROACH (3-Step Editorial Flow)                 */}
      {/* ============================================================ */}
      <section className="py-24 lg:py-36 border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-16 lg:mb-24">
            <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold block mb-3">
              Operational Clarity
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-brand-ink dark:text-brand-ivory">
              The SIWI Approach
            </h2>
            <p className="text-sm text-brand-ink/70 dark:text-brand-ivory/70 mt-4 leading-relaxed font-sans">
              International trade succeeds through transparent communication, verified product specifications, and dependable commercial execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <div className="border-t border-brand-gold/60 pt-6 space-y-4">
              <span className="font-serif text-3xl text-brand-gold">01</span>
              <h3 className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">
                Understand the Requirement
              </h3>
              <p className="text-xs text-brand-ink/70 dark:text-brand-ivory/70 leading-relaxed font-sans">
                Every trade dialogue starts with exact technical specifications: particle size, target volumes, custom packaging, and destination ports.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-t border-brand-gold/60 pt-6 space-y-4">
              <span className="font-serif text-3xl text-brand-gold">02</span>
              <h3 className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">
                Discuss the Supply
              </h3>
              <p className="text-xs text-brand-ink/70 dark:text-brand-ivory/70 leading-relaxed font-sans">
                We review production batches, export packaging standards, and lead times directly before committing to commercial terms.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-t border-brand-gold/60 pt-6 space-y-4">
              <span className="font-serif text-3xl text-brand-gold">03</span>
              <h3 className="font-serif text-2xl text-brand-ink dark:text-brand-ivory">
                Build the Partnership
              </h3>
              <p className="text-xs text-brand-ink/70 dark:text-brand-ivory/70 leading-relaxed font-sans">
                Our objective is enduring B2B business relationships built on reliable quality, timely documentation, and consistent supply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 04. MUMBAI OPERATIONS & FOUNDER SPOTLIGHT                    */}
      {/* ============================================================ */}
      <section className="py-24 lg:py-32 bg-brand-ivory dark:bg-[#14171C] border-b border-brand-grey-300/30 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold block">
                Trade Foundation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-brand-ink dark:text-brand-ivory">
                Grounded in Mumbai, serving international partners.
              </h2>
              <p className="text-sm text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
                Operating out of Mumbai, Maharashtra—India’s commercial hub and major maritime gateway—SIWI Global Ventures coordinates export logistics, quality evaluation, and client communication with precision.
              </p>
              <p className="text-sm text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
                Led by founder <strong className="text-brand-gold font-medium">Harshvardhan Patil</strong>, our business operates on personal accountability and long-term commercial trust.
              </p>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-brand-gold hover:text-brand-goldLight transition-colors"
                >
                  <span>Read About Our Foundation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Maritime Visual (6 Cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-charcoal">
                <img
                  src="/assets/images/mumbai_trade_port.jpg"
                  alt="Mumbai maritime trade port at dusk"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 05. FINAL COMMERCIAL TRIGGER (High Restraint)                 */}
      {/* ============================================================ */}
      <section className="py-24 lg:py-36 text-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="w-12 h-12 text-brand-gold mx-auto mb-6">
            <Compass className="w-full h-full stroke-[1.25]" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-brand-ink dark:text-brand-ivory mb-6">
            Have a requirement in mind?
          </h2>

          <p className="text-base text-brand-ink/70 dark:text-brand-ivory/70 font-sans leading-relaxed mb-10 max-w-xl mx-auto">
            Discuss target volumes, custom packaging, or technical product parameters directly with our international trade desk.
          </p>

          <Link
            to="/trade-enquiries"
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-gold text-brand-ink font-sans text-xs uppercase tracking-[0.18em] font-semibold hover:bg-brand-goldLight transition-colors shadow-sm"
          >
            <span>Start a Trade Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
