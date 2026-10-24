import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 lg:pt-40 lg:pb-36">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold block mb-3">
            Legal &amp; Compliance
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-ink dark:text-brand-ivory mb-4">
            Terms of Trade
          </h1>
          <p className="text-xs text-brand-grey-500 font-sans">
            SIWI Global Ventures · Mumbai, Maharashtra, India
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-brand-ink/80 dark:text-brand-ivory/80 leading-relaxed font-sans space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">1. Commercial Inquiries &amp; Quotations</h2>
            <p>
              Information displayed on this website is for commercial B2B evaluation purposes. Quotations, minimum order quantities (MOQs), delivery lead times, and Incoterms (FOB, CIF, CFR) are confirmed through formal Proforma Invoices (PI) and sales contracts issued by SIWI Global Ventures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">2. Product Specifications &amp; Quality Inspection</h2>
            <p>
              All agricultural dehydrated products and architectural goods are governed by mutually agreed specification sheets. Standard pre-shipment quality inspection and batch Certificates of Analysis (CoA) are provided according to international standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">3. Export Regulations &amp; Jurisdiction</h2>
            <p>
              Export operations comply with Indian customs regulations under IEC No. GBPPP7746J and GST No. 27BGPPP7746J1ZN. Commercial agreements and trade disputes are subject to the jurisdiction of competent courts in Mumbai, Maharashtra, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
