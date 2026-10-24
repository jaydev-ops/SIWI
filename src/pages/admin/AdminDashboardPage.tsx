import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Package, Inbox, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-neutral-500 font-mono">
        Aggregating system metrics from SQLite database...
      </div>
    );
  }

  const { metrics, recentEnquiries, recentlyUpdatedProducts } = data;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Operations Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time status of published products, buyer enquiries, and catalogue revisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-medium rounded hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <span>Triage Enquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Catalogue Items</span>
            <Package className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {metrics.totalProducts}
            </span>
            <span className="text-[11px] text-green-600 dark:text-green-400 font-mono">
              ({metrics.publishedProducts} live)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-2">
            <span>{metrics.draftProducts} drafts</span>
            <span>·</span>
            <span>{metrics.archivedProducts} archived</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>New Enquiries</span>
            <Inbox className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {metrics.newEnquiries}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
              awaiting review
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400">
            Total {metrics.totalEnquiries} buyer records logged
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>In-Progress Trades</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {metrics.pendingEnquiries}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              active leads
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400">
            Commercial negotiations active
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>System Health</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              100%
            </span>
            <span className="text-[11px] text-green-600 dark:text-green-400 font-mono">
              Operational
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400">
            Embedded SQLite active
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Product Revisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Enquiries (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Recent Buyer Enquiries
              </h2>
              <span className="text-[11px] text-neutral-500">Latest trade inquiries from public portal</span>
            </div>
            <Link to="/admin/enquiries" className="text-xs text-brand-gold hover:underline font-medium">
              View All ({metrics.totalEnquiries})
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentEnquiries.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">No enquiries received yet.</div>
            ) : (
              recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs text-neutral-900 dark:text-neutral-100">
                        {enq.company_name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">({enq.country})</span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Product: <strong className="text-neutral-700 dark:text-neutral-300 font-medium">{enq.product_of_interest}</strong> · {enq.full_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        enq.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : enq.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <Link
                      to={`/admin/enquiries/${enq.id}`}
                      className="p-1.5 text-neutral-400 hover:text-brand-gold rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recently Updated Products (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Product Records
              </h2>
              <span className="text-[11px] text-neutral-500">Recently modified catalogue items</span>
            </div>
            <Link to="/admin/products" className="text-xs text-brand-gold hover:underline font-medium">
              Manage
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentlyUpdatedProducts.map((prod: any) => (
              <div key={prod.id} className="p-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    {prod.name}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">/products/{prod.slug}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      prod.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {prod.status}
                  </span>
                  <Link
                    to={`/admin/products/${prod.id}/edit`}
                    className="text-xs text-neutral-500 hover:text-brand-gold p-1"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
