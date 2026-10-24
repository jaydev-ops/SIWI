import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SitePage } from '../../types';
import { Edit2, ExternalLink, FileCode, Loader2 } from 'lucide-react';

export const AdminPagesPage: React.FC = () => {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminPages()
      .then((data) => {
        setPages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching CMS pages:', err);
        setLoading(false);
      });
  }, []);

  const getRoute = (slug: string) => {
    if (slug === 'home') return '/';
    return `/${slug}`;
  };

  const getScopeDescription = (p: SitePage) => {
    try {
      const parsed = JSON.parse(p.content_json);
      return parsed.description || parsed.headline || parsed.tagline || 'Structured page content and meta copy';
    } catch {
      return 'Structured page content';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-5 h-5 text-brand-gold" />
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Structured Website Content Management (CMS)
          </h1>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Update public copy, headlines, and corporate narrative without source code deployments.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
            <span>Loading registered CMS pages...</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase text-neutral-500">
              <tr>
                <th className="py-3 px-4">Managed Page</th>
                <th className="py-3 px-4">Public URL</th>
                <th className="py-3 px-4">Content Scope</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-brand-gold flex-shrink-0" />
                    <span>{p.title}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">{getRoute(p.slug)}</td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 max-w-sm line-clamp-2">
                    {getScopeDescription(p)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/pages/${p.id}/edit`}
                        className="p-1.5 text-neutral-500 hover:text-brand-gold rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Edit Content"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={getRoute(p.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-neutral-400 hover:text-brand-gold rounded"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
