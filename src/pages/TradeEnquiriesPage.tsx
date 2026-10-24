import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Phone, Mail, MapPin, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

export const TradeEnquiriesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product') || '';

  const productOptions = [
    { label: 'Select a product of interest...', value: '' },
    { label: 'Onion Powder', value: 'Onion Powder', slug: 'onion-powder' },
    { label: 'Garlic Powder', value: 'Garlic Powder', slug: 'garlic-powder' },
    { label: 'Garlic Granules', value: 'Garlic Granules', slug: 'garlic-granules' },
    { label: 'Dehydrated Fried Onions', value: 'Dehydrated Fried Onions', slug: 'dehydrated-fried-onions' },
    { label: 'Birista', value: 'Birista', slug: 'birista' },
    { label: 'Onion Kibbles', value: 'Onion Kibbles', slug: 'onion-kibbles' },
    { label: 'Other Products', value: 'Other Products', slug: 'other-products' },
    { label: 'Multiple Products', value: 'Multiple Products', slug: 'multiple-products' },
    { label: 'General Trade Discussion', value: 'General Trade Discussion', slug: 'general-trade' },
  ];

  const initialProduct = productOptions.find(p => p.slug === productParam)?.value || '';

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    business_email: '',
    phone_number: '',
    country: '',
    product_of_interest: initialProduct,
    estimated_volume: '',
    preferred_packaging: '',
    destination_port: '',
    enquiry_details: '',
  });

  useEffect(() => {
    if (productParam) {
      const match = productOptions.find(p => p.slug === productParam);
      if (match) {
        setFormData(prev => ({ ...prev, product_of_interest: match.value }));
      }
    }
  }, [productParam]);

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ reference_no: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.full_name || !formData.company_name || !formData.business_email || !formData.country || !formData.product_of_interest || !formData.enquiry_details) {
      setErrorMessage('Please fill in all mandatory fields indicated with an asterisk (*).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitEnquiry(formData);
      setSuccessData(res);
      setSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit enquiry right now. Please use the direct email fallback.');
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
              Commercial Desk
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-brand-ink dark:text-brand-ivory mb-6">
            Tell us what your business needs.
          </h1>

          <p className="text-base text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
            Share your product requirements with SIWI Global Ventures. Our team can then review your enquiry and discuss the relevant commercial details with you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-8">
            {successData ? (
              <div className="p-8 lg:p-12 border border-brand-gold/40 bg-brand-ivory dark:bg-[#14171C] space-y-6">
                <div className="w-12 h-12 text-brand-gold">
                  <CheckCircle2 className="w-full h-full stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-2">
                    Enquiry Registered
                  </span>
                  <h2 className="font-serif text-3xl font-medium text-brand-ink dark:text-brand-ivory">
                    Thank you, {formData.full_name}.
                  </h2>
                  <p className="text-xs text-brand-grey-500 font-mono mt-1">
                    Official Reference: <strong className="text-brand-ink dark:text-brand-ivory">{successData.reference_no}</strong>
                  </p>
                </div>
                <p className="text-xs text-brand-ink/80 dark:text-brand-ivory/80 leading-relaxed font-sans">
                  Your procurement enquiry regarding <strong className="text-brand-gold font-medium">{formData.product_of_interest}</strong> has been logged into our commercial management pipeline. Our sales team in Mumbai will review your specifications and contact you at <strong className="text-brand-ink dark:text-brand-ivory">{formData.business_email}</strong>.
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSuccessData(null);
                      setFormData({
                        full_name: '',
                        company_name: '',
                        business_email: '',
                        phone_number: '',
                        country: '',
                        product_of_interest: '',
                        estimated_volume: '',
                        preferred_packaging: '',
                        destination_port: '',
                        enquiry_details: '',
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-brand-grey-300/40 dark:border-white/10 text-xs uppercase tracking-wider font-medium text-brand-ink dark:text-brand-ivory hover:border-brand-gold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit Another Enquiry</span>
                  </button>
                  <Link
                    to="/products"
                    className="px-6 py-3 bg-brand-gold text-brand-ink text-xs uppercase tracking-wider font-semibold"
                  >
                    Back to Products
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{errorMessage}</p>
                      <a
                        href={`mailto:siwiglobalventure@gmail.com?subject=Trade%20Enquiry%20from%20${encodeURIComponent(formData.company_name || 'Website')}&body=${encodeURIComponent(formData.enquiry_details)}`}
                        className="underline text-brand-gold mt-1 inline-block"
                      >
                        Click here to send enquiry via your email client
                      </a>
                    </div>
                  </div>
                )}

                {/* Section 1: Contact Details */}
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block border-b border-brand-grey-300/30 dark:border-white/10 pb-2">
                    01. Organization &amp; Contact
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="company_name" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Company Name *
                      </label>
                      <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="e.g. Acme Food Ingredients"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="business_email" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Business Email *
                      </label>
                      <input
                        id="business_email"
                        name="business_email"
                        type="email"
                        required
                        value={formData.business_email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="+CountryCode Number"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                      Country / Destination Market *
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. Netherlands, United States, UAE, Japan"
                      className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Section 2: Commodity & Volume */}
                <div className="space-y-4 pt-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block border-b border-brand-grey-300/30 dark:border-white/10 pb-2">
                    02. Product &amp; Supply Requirements
                  </span>

                  <div>
                    <label htmlFor="product_of_interest" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                      Product of Interest *
                    </label>
                    <select
                      id="product_of_interest"
                      name="product_of_interest"
                      required
                      value={formData.product_of_interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none dark:bg-brand-charcoal"
                    >
                      {productOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-brand-ivoryLight dark:bg-brand-ink">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="estimated_volume" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Target Volume
                      </label>
                      <input
                        id="estimated_volume"
                        name="estimated_volume"
                        type="text"
                        value={formData.estimated_volume}
                        onChange={handleChange}
                        placeholder="e.g. 20 MT / 1 FCL"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferred_packaging" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Preferred Packaging
                      </label>
                      <input
                        id="preferred_packaging"
                        name="preferred_packaging"
                        type="text"
                        value={formData.preferred_packaging}
                        onChange={handleChange}
                        placeholder="e.g. 25kg Paper Bag"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="destination_port" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                        Destination Port
                      </label>
                      <input
                        id="destination_port"
                        name="destination_port"
                        type="text"
                        value={formData.destination_port}
                        onChange={handleChange}
                        placeholder="e.g. Rotterdam / Jebel Ali"
                        className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="enquiry_details" className="block text-xs uppercase tracking-wider text-brand-ink/80 dark:text-brand-ivory/80 font-medium mb-1.5">
                      Commercial &amp; Technical Requirements *
                    </label>
                    <textarea
                      id="enquiry_details"
                      name="enquiry_details"
                      rows={5}
                      required
                      value={formData.enquiry_details}
                      onChange={handleChange}
                      placeholder="Please specify mesh size requirements, microbiological limits, delivery timeframe, or particular trade terms (FOB/CIF)..."
                      className="w-full px-4 py-3 bg-transparent text-xs text-brand-ink dark:text-brand-ivory border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-10 py-4 bg-brand-gold text-brand-ink text-xs uppercase tracking-[0.18em] font-semibold hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{submitting ? 'Transmitting Enquiry...' : 'Submit Commercial Enquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-brand-grey-500 font-sans mt-3">
                    Submissions are transmitted securely to our Mumbai trade desk. We do not share commercial data with third parties.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Side Credential Panel (4 Cols) */}
          <div className="lg:col-span-4 p-8 border border-brand-grey-300/40 dark:border-white/10 bg-brand-ivory dark:bg-[#14171C] space-y-8">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-2">
                Direct Communication
              </span>
              <h2 className="font-serif text-2xl font-normal text-brand-ink dark:text-brand-ivory">
                Prefer direct dialogue?
              </h2>
              <p className="text-xs text-brand-grey-500 font-sans mt-2 leading-relaxed">
                Reach out directly to discuss urgent container consignments or specific spot quotations.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-brand-grey-500 block">Direct Line</span>
                  <a href="tel:+918369635619" className="font-medium hover:text-brand-gold transition-colors text-sm">
                    +91 83696 35619
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-brand-grey-500 block">Trade Desk Email</span>
                  <a href="mailto:siwiglobalventure@gmail.com" className="font-medium hover:text-brand-gold transition-colors break-all">
                    siwiglobalventure@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-brand-grey-500 block">Trade Office</span>
                  <p className="font-medium text-brand-ink dark:text-brand-ivory">
                    Mumbai, Maharashtra, India
                  </p>
                  <p className="text-brand-grey-500 text-[11px] mt-0.5">
                    Dahisar West, Mumbai 400068
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-grey-300/30 dark:border-white/10 text-[11px] text-brand-grey-500 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>GST: 27BGPPP7746J1ZN</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>IEC: GBPPP7746J</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
