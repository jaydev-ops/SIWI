import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ShieldCheck, Package, FileText } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    api.getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          const featuredIdx = data.images.findIndex((img: any) => img.is_featured === 1 || img.is_featured === true);
          setActiveImageIndex(featuredIdx >= 0 ? featuredIdx : 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product detail:', err);
        setError('Product record could not be loaded.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-32 text-center text-sm text-brand-grey-500 font-sans">
        Loading product specifications...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-40 pb-32 text-center max-w-md mx-auto px-6">
        <h1 className="font-serif text-3xl text-brand-ink dark:text-brand-ivory mb-4">Product Not Found</h1>
        <p className="text-xs text-brand-grey-500 mb-8 font-sans">
          The requested product record does not exist or may have been archived.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-ink text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.featured_image
      ? [
          {
            id: 'default',
            product_id: product.id,
            media_asset_id: 'default',
            display_order: 1,
            is_featured: 1,
            file_url: product.featured_image,
            alt_text: `${product.name} macro study`,
          },
        ]
      : [];

  const activeImage = galleryImages[activeImageIndex] || galleryImages[0];

  return (
    <div className="pt-28 lg:pt-36 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-brand-grey-500">
          <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-gold transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brand-gold font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Hero Split Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 lg:pb-24 border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: High-Resolution Macro Image & Gallery Strip (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-charcoal border border-brand-grey-300/30 dark:border-white/10 group shadow-sm">
              {activeImage ? (
                <img
                  src={activeImage.file_url}
                  alt={activeImage.alt_text || `${product.name} macro study`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-900 text-brand-ivory/60 text-center">
                  <img src="/assets/images/siwi-logo.png" alt="SIWI Logo" className="w-16 h-16 opacity-30 mb-3" />
                  <span className="font-serif text-lg text-brand-gold">SIWI Global Ventures</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase mt-1 text-brand-grey-400">Authentic Material Study Pending</span>
                </div>
              )}

              {/* Status & Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                <div className="bg-brand-ink/80 backdrop-blur-sm px-3 py-1.5 border border-white/10 text-[10px] text-brand-ivory font-mono uppercase tracking-wider">
                  {activeImage?.caption || 'Authentic Material Study · Non-Simulated'}
                </div>
                {galleryImages.length > 1 && (
                  <div className="bg-brand-ink/80 backdrop-blur-sm px-2.5 py-1 text-[10px] text-brand-gold font-mono border border-white/10">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {galleryImages.map((img: any, idx: number) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 sm:w-24 sm:h-18 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                        isActive
                          ? 'border-brand-gold ring-2 ring-brand-gold/30 scale-[1.02]'
                          : 'border-brand-grey-300/30 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-brand-gold/60'
                      }`}
                      aria-label={`Select image ${idx + 1}: ${img.alt_text || product.name}`}
                    >
                      <img src={img.file_url} alt={img.alt_text || `Gallery image ${idx + 1}`} className="w-full h-full object-cover" />
                      {Boolean(img.is_featured) && (
                        <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-brand-gold shadow" title="Primary image" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Commercial Overview & Enquiry Trigger (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold">
                  {product.category_name || 'Commercial Export'}
                </span>
                <span className="text-[10px] font-mono text-brand-grey-500 uppercase px-1.5 py-0.5 border border-brand-grey-300/40 dark:border-white/10">
                  Origin: India
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-ink dark:text-brand-ivory leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-sm text-brand-ink/80 dark:text-brand-ivory/80 font-sans leading-relaxed">
              {product.short_description}
            </p>

            <div className="p-4 bg-brand-ivory dark:bg-[#14171C] border-l-2 border-brand-gold space-y-2">
              <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-brand-gold block">
                Commercial Verification
              </span>
              <p className="text-xs text-brand-grey-500 dark:text-brand-grey-300 leading-relaxed">
                Direct export supply coordinated through our Mumbai trading operations. Batch Certificate of Analysis (CoA) and verified specification sheets provided upon inquiry.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={`/trade-enquiries?product=${product.slug}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-ink font-sans text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors"
              >
                <span>Discuss This Product</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:siwiglobalventure@gmail.com?subject=Enquiry%20Regarding%20"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-brand-grey-300/60 dark:border-white/20 text-xs uppercase tracking-[0.14em] font-medium text-brand-ink dark:text-brand-ivory hover:border-brand-gold transition-colors"
              >
                <span>Email Spec Request</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Processing & Industrial Applications */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Detailed Narrative */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block">
              Overview &amp; Processing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-ink dark:text-brand-ivory">
              Controlled Dehydration Standard
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
              {product.description || product.short_description}
            </p>
            {product.processing_info && (
              <p className="text-xs text-brand-grey-500 dark:text-brand-grey-300 leading-relaxed font-sans pt-2">
                <strong className="text-brand-ink dark:text-brand-ivory font-medium">Processing Method: </strong>
                {product.processing_info}
              </p>
            )}
          </div>

          {/* Industrial Applications */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block">
              Commercial Utilisation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-ink dark:text-brand-ivory">
              Industrial Applications
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink/75 dark:text-brand-ivory/75 leading-relaxed font-sans">
              {product.industrial_applications ||
                'Commercial food manufacturing, industrial seasonings, seasoning blends, culinary services, institutional catering.'}
            </p>

            <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-brand-grey-500 dark:text-brand-grey-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-brand-gold" />
                <span>Food Processors</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-brand-gold" />
                <span>Seasoning Blenders</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-brand-gold" />
                <span>Institutional Caterers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-brand-gold" />
                <span>Global Importers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Table */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="max-w-3xl mb-10">
          <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block mb-2">
            Verified Parameters
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-ink dark:text-brand-ivory">
            Technical Specifications
          </h2>
          <p className="text-xs text-brand-grey-500 font-sans mt-2">
            Parameters confirmed for standard commercial grades. Custom particle sizes and packaging available upon formal inquiry.
          </p>
        </div>

        {/* Specifications Data Table */}
        <div className="border border-brand-grey-300/40 dark:border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-brand-ivory dark:bg-[#14171C] border-b border-brand-grey-300/40 dark:border-white/10 text-[11px] uppercase tracking-wider text-brand-gold">
              <tr>
                <th className="py-3 px-6 font-semibold">Parameter</th>
                <th className="py-3 px-6 font-semibold">Specification</th>
                <th className="py-3 px-6 font-semibold">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-300/20 dark:divide-white/5">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec) => (
                  <tr key={spec.id} className="hover:bg-brand-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-6 font-medium text-brand-ink dark:text-brand-ivory">{spec.name}</td>
                    <td className="py-3.5 px-6 text-brand-ink/80 dark:text-brand-ivory/80">{spec.value}</td>
                    <td className="py-3.5 px-6 text-brand-grey-500 font-mono">{spec.unit || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 px-6 text-center text-brand-grey-500">
                    Standard commercial specifications apply. Contact our trade desk for the complete technical dossier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mandatory Transparency Note */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-brand-ivory/60 dark:bg-white/[0.02] border border-brand-grey-300/30 dark:border-white/5 text-xs text-brand-grey-500">
          <ShieldCheck className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-brand-ink dark:text-brand-ivory">Authentic Verification Standard: </strong>
            SIWI Global Ventures does not fabricate unverified laboratory microbiology or moisture percentages. Official batch Certificates of Analysis (CoA) and accredited laboratory reports are provided directly to commercial buyers upon commercial contract.
          </p>
        </div>
      </section>

      {/* Packaging & Logistics Guidelines */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-brand-grey-300/30 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block">
              Logistics &amp; Packaging
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-ink dark:text-brand-ivory">
              Export Packaging Standards
            </h2>
            <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
              Engineered to preserve dryness, aroma, and microbiological purity over long sea voyages and multi-modal transit.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 border border-brand-grey-300/40 dark:border-white/10 bg-brand-ivory dark:bg-[#14171C]">
              <Package className="w-5 h-5 text-brand-gold mb-3" />
              <h3 className="font-serif text-lg text-brand-ink dark:text-brand-ivory mb-2">
                Standard Bulk Packaging
              </h3>
              <p className="text-xs text-brand-grey-500 dark:text-brand-grey-300 leading-relaxed font-sans">
                {product.packaging_type || 'Multi-wall kraft paper bags with inner heat-sealed polyethylene moisture barrier, packed in reinforced outer cartons.'}
              </p>
              {product.available_pack_sizes && (
                <p className="text-xs text-brand-gold font-medium mt-3">
                  Configurations: {product.available_pack_sizes}
                </p>
              )}
            </div>

            <div className="p-6 border border-brand-grey-300/40 dark:border-white/10 bg-brand-ivory dark:bg-[#14171C]">
              <FileText className="w-5 h-5 text-brand-gold mb-3" />
              <h3 className="font-serif text-lg text-brand-ink dark:text-brand-ivory mb-2">
                Storage &amp; Shelf Stability
              </h3>
              <p className="text-xs text-brand-grey-500 dark:text-brand-grey-300 leading-relaxed font-sans">
                {product.storage_conditions || 'Store in cool, dry warehouse below 25°C with ambient humidity below 60%.'}
              </p>
              {product.shelf_life && (
                <p className="text-xs text-brand-gold font-medium mt-3">
                  Shelf Life: {product.shelf_life}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Strip */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-brand-grey-300/30 dark:border-white/10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-gold block mb-1">
                Portfolio Synergy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-ink dark:text-brand-ivory">
                Related Products
              </h2>
            </div>
            <Link to="/products" className="text-xs uppercase tracking-wider text-brand-gold hover:underline">
              View All Catalogue
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/products/${rel.slug}`}
                className="group border-b border-brand-grey-300/40 dark:border-white/10 pb-6"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-charcoal mb-4">
                  <img
                    src={rel.featured_image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-xl text-brand-ink dark:text-brand-ivory group-hover:text-brand-gold transition-colors">
                  {rel.name}
                </h3>
                <p className="text-xs text-brand-grey-500 mt-1 line-clamp-2">{rel.short_description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Conversion Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 text-center">
        <div className="p-8 lg:p-12 bg-brand-ivory dark:bg-[#14171C] border border-brand-grey-300/40 dark:border-white/10 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-normal text-brand-ink dark:text-brand-ivory mb-3">
            Ready to evaluate {product.name} for your operations?
          </h2>
          <p className="text-xs text-brand-grey-500 font-sans mb-8">
            Tell us your container volume, port of delivery, and technical requirements.
          </p>
          <Link
            to={`/trade-enquiries?product=${product.slug}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-brand-ink text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors"
          >
            <span>Initiate Commercial Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
