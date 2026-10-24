import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { Plus, Layers } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', display_order: 1 });

  const loadCategories = () => {
    setLoading(true);
    api.getAdminCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.slug) return;
    try {
      await api.createCategory(newCat);
      setIsAdding(false);
      setNewCat({ name: '', slug: '', description: '', display_order: 1 });
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Category Taxonomy Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organise products into trade categories and manage public catalogue taxonomy.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Add Category'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Create New Category
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={newCat.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewCat({
                  ...newCat,
                  name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                });
              }}
              placeholder="e.g. Spices &amp; Seasonings"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={newCat.slug}
              onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={newCat.description}
              onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              placeholder="Brief commercial description of this category..."
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-brand-gold text-neutral-950 font-semibold text-xs rounded hover:bg-brand-goldLight"
          >
            Create Category
          </button>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase text-neutral-500">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                  {cat.name}
                </td>
                <td className="py-3 px-4 font-mono text-neutral-500">
                  /{cat.slug}
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-sm">
                  {cat.description || '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
