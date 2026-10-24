import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { Search, Plus, Edit2, ExternalLink, Archive, CheckCircle, Clock, Sparkles, X } from 'lucide-react';
import { QuickAddProductModal } from '../../components/admin/QuickAddProductModal';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminProducts({ status: statusFilter, category: categoryFilter, search }),
      api.getAdminCategories(),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handlePublishToggle = async (product: Product) => {
    if (product.status === 'PUBLISHED') {
      await api.unpublishProduct(product.id);
    } else {
      await api.publishProduct(product.id);
    }
    loadData();
  };

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this product? It will be hidden from the public website.')) {
      await api.archiveProduct(id);
      loadData();
    }
  };

  const handleProductCreated = (newProd: any) => {
    loadData();
    setToastMessage(`Product "${newProd.name}" was successfully created with images!`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-400 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage product titles, descriptions, technical specifications, and publishing states.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Quick Add with Images (Fast 1-Go Flow) */}
          <button
            type="button"
            onClick={() => setQuickAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Quick Add (with Images)</span>
          </button>

          {/* Full Detailed Editor Link */}
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Full Editor</span>
          </Link>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddProductModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        categories={categories}
        onProductCreated={handleProductCreated}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      No products match your criteria
                    </p>
                    <p className="text-xs text-neutral-400">
                      Try clearing filters or click "Add New Product" to create one.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.featured_image || '/assets/images/hero_still_life.jpg'}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded bg-neutral-200 dark:bg-neutral-800 flex-shrink-0"
                        />
                        <div>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100 block">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                            {prod.short_description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      {prod.category_name || 'Unassigned'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          prod.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : prod.status === 'DRAFT'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {prod.status === 'PUBLISHED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{prod.status}</span>
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      /{prod.slug}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3 px-4 text-neutral-400 text-[11px]">
                      {new Date(prod.updated_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/admin/products/${prod.id}/edit`}
                          className="p-1.5 text-neutral-500 hover:text-brand-gold rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handlePublishToggle(prod)}
                          className="px-2 py-1 text-[10px] font-medium rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        >
                          {prod.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>

                        {prod.status === 'PUBLISHED' && (
                          <Link
                            to={`/products/${prod.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-neutral-400 hover:text-brand-gold rounded"
                            title="Preview on Live Site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <button
                          onClick={() => handleArchive(prod.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
