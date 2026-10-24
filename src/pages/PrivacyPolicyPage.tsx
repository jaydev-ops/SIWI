import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 lg:pt-40 lg:pb-36">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold block mb-3">
            Legal &amp; Compliance
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-ink dark:text-brand-ivory mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-grey-500 font-sans">
            Effective Date: October 2026 · SIWI Global Ventures, Mumbai, India
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-brand-ink/80 dark:text-brand-ivory/80 leading-relaxed font-sans space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">1. Data Collection &amp; Use</h2>
            <p>
              SIWI Global Ventures collects business information submitted voluntarily through our trade enquiry forms, contact requests, and direct commercial correspondence. This includes your name, company identity, corporate email, phone number, and commercial procurement specifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">2. Purpose of Processing</h2>
            <p>
              We process submitted information strictly to evaluate commercial trade enquiries, provide product specification dossiers, issue formal quotation proposals, and maintain business communications. We do not sell, license, or monetize your contact details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">3. Confidentiality &amp; Data Security</h2>
            <p>
              Commercial specifications, target order volumes, and trade discussions are treated with strict confidentiality. Technical documents and trade correspondence are retained only as required to fulfill commercial agreements and regulatory export compliance under Indian law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl text-brand-ink dark:text-brand-ivory">4. Inquiries &amp; Contact</h2>
            <p>
              For questions regarding our privacy practices or to request removal of your company details from our correspondence records, contact us at:
              <br />
              <strong>Email: </strong>siwiglobalventure@gmail.com
              <br />
              <strong>Phone: </strong>+91 83696 35619
              <br />
              <strong>Address: </strong>Mumbai, Maharashtra, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
