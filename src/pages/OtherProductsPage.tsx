import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const OtherProductsPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 lg:pt-40 lg:pb-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-brand-gold" />
            <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold">
              Trade &amp; Sourcing
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-brand-ink dark:text-brand-ivory mb-6">
            More opportunities in global trade.
          </h1>

          <p className="text-base text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
            Beyond our core dehydrated vegetable range, SIWI Global Ventures also coordinates trade in other confirmed agricultural commodities according to verified commercial client requirements.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-brand-charcoal mb-20 border border-brand-grey-300/30 dark:border-white/10">
          <img
            src="/assets/images/mumbai_trade_port.jpg"
            alt="Mumbai maritime trade port and commercial logistics"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-brand-ink/80 backdrop-blur-sm p-4 border border-white/10 text-brand-ivory max-w-md">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-semibold block mb-1">
              Global Sourcing Network
            </span>
            <p className="text-xs font-serif italic text-brand-ivory/90">
              Coordinating export cargo through India’s premier western maritime ports.
            </p>
          </div>
        </div>

        {/* Sourcing Framework */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-t border-b border-brand-grey-300/30 dark:border-white/10 py-16 mb-20">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block">
              Sourcing Discipline
            </span>
            <h2 className="font-serif text-3xl font-normal text-brand-ink dark:text-brand-ivory">
              Verified Domestic Aggregation
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
              We work directly with certified Indian manufacturers and commodity producers, inspecting quality benchmarks before establishing export documentation and freight commitments.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block">
              Commercial Flexibility
            </span>
            <h2 className="font-serif text-3xl font-normal text-brand-ink dark:text-brand-ivory">
              Tailored Export Contracts
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
              Whether you need customized packaging, private labeling, or specific container configurations, our Mumbai operations desk facilitates reliable multi-modal export execution.
            </p>
          </div>
        </div>

        {/* Commercial Action */}
        <div className="p-10 lg:p-14 bg-brand-ivory dark:bg-[#14171C] border border-brand-grey-300/40 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-2">
              Bespoke Inquiries
            </span>
            <h2 className="font-serif text-3xl font-medium text-brand-ink dark:text-brand-ivory">
              Submit a Sourcing Enquiry
            </h2>
            <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 mt-2 font-sans leading-relaxed">
              Have an Indian product requirement not listed on our website? Contact our trade desk.
            </p>
          </div>

          <Link
            to="/trade-enquiries?product=other-products"
            className="px-8 py-4 bg-brand-gold text-brand-ink text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors whitespace-nowrap inline-flex items-center gap-2"
          >
            <span>Discuss Sourcing</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
