import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { Search, ArrowRight, ArrowUpRight } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching catalogue:', err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      activeCategory === 'all' ||
      prod.category_slug === activeCategory ||
      prod.primary_category_id === activeCategory;

    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.short_description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 lg:pt-40 lg:pb-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Page Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-brand-gold" />
            <span className="text-[11px] tracking-[0.24em] font-sans font-semibold uppercase text-brand-gold">
              Master Catalogue
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-brand-ink dark:text-brand-ivory mb-6">
            A considered range of products for global trade.
          </h1>

          <p className="text-base text-brand-ink/75 dark:text-brand-ivory/75 font-sans leading-relaxed">
            Explore our dehydrated vegetable products and other traded categories. For technical specifications, availability, and commercial requirements, contact our team.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="border-b border-brand-grey-300/40 dark:border-white/10 pb-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-brand-gold text-brand-ink font-semibold'
                  : 'text-brand-ink/70 dark:text-brand-ivory/70 hover:text-brand-gold border border-brand-grey-300/40 dark:border-white/10'
              }`}
            >
              All Products ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-brand-gold text-brand-ink font-semibold'
                    : 'text-brand-ink/70 dark:text-brand-ivory/70 hover:text-brand-gold border border-brand-grey-300/40 dark:border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product range..."
              className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-brand-ink dark:text-brand-ivory placeholder-brand-grey-500 border border-brand-grey-300/40 dark:border-white/10 focus:border-brand-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Product Catalogue Grid (Image-Led Editorial Composition) */}
        {loading ? (
          <div className="py-24 text-center text-sm text-brand-grey-500 font-sans">
            Loading verified product records...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-brand-ink dark:text-brand-ivory mb-2">No matching products found</p>
            <p className="text-xs text-brand-grey-500 font-sans">Try selecting another category or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between border-b border-brand-grey-300/40 dark:border-white/10 pb-8"
              >
                <div>
                  {/* Macro Image */}
                  <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-brand-charcoal mb-6 border border-brand-grey-300/30 dark:border-white/10">
                    {product.featured_image ? (
                      <img
                        src={product.featured_image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-neutral-900 text-brand-ivory/60 text-center">
                        <img src="/assets/images/siwi-logo.png" alt="SIWI Logo" className="w-12 h-12 opacity-30 mb-2" />
                        <span className="font-serif text-sm text-brand-gold">SIWI Global</span>
                        <span className="text-[9px] font-mono tracking-widest uppercase mt-0.5 text-brand-grey-400">Image Pending</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-brand-ink/80 text-[10px] text-brand-ivory font-mono px-2 py-1 uppercase tracking-wider backdrop-blur-sm border border-white/10">
                      {product.category_name || 'Commodity'}
                    </div>
                  </Link>

                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-2">
                    {product.packaging_type ? 'Export Standard' : 'Trading Range'}
                  </span>

                  <h2 className="font-serif text-2xl lg:text-3xl font-medium text-brand-ink dark:text-brand-ivory group-hover:text-brand-gold transition-colors">
                    <Link to={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h2>

                  <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 mt-3 leading-relaxed line-clamp-3 font-sans">
                    {product.short_description}
                  </p>

                  {/* Highlights */}
                  {product.available_pack_sizes && (
                    <div className="mt-4 pt-4 border-t border-brand-grey-300/20 dark:border-white/5 text-[11px] text-brand-grey-500">
                      <span className="text-brand-gold uppercase tracking-wider font-medium">Packaging: </span>
                      <span>{product.available_pack_sizes}</span>
                    </div>
                  )}
                </div>

                {/* Direct Action Pathways */}
                <div className="mt-6 pt-4 border-t border-brand-grey-300/30 dark:border-white/10 flex items-center justify-between text-xs">
                  <Link
                    to={`/products/${product.slug}`}
                    className="font-medium uppercase tracking-[0.14em] text-brand-ink dark:text-brand-ivory hover:text-brand-gold transition-colors inline-flex items-center gap-1"
                  >
                    <span>Full Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to={`/trade-enquiries?product=${product.slug}`}
                    className="text-brand-gold hover:text-brand-goldLight uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Enquire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Sourcing Support Banner */}
        <div className="mt-24 p-8 lg:p-12 border border-brand-grey-300/40 dark:border-white/10 bg-brand-ivory dark:bg-[#14171C] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-gold block mb-2">
              Bespoke Sourcing
            </span>
            <h3 className="font-serif text-2xl lg:text-3xl font-medium text-brand-ink dark:text-brand-ivory">
              Need custom mesh sizes, packaging, or commodities?
            </h3>
            <p className="text-xs text-brand-ink/75 dark:text-brand-ivory/75 mt-2 font-sans leading-relaxed">
              We coordinate tailored dehydrated cuts, specific granule fractions, and containerized logistics for qualified commercial orders.
            </p>
          </div>

          <Link
            to="/trade-enquiries"
            className="px-6 py-3 bg-brand-gold text-brand-ink text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-goldLight transition-colors whitespace-nowrap"
          >
            Submit Custom Requirement
          </Link>
        </div>
      </div>
    </div>
  );
};
