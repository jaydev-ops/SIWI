import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Enquiry } from '../../types';
import { Search, Inbox, ArrowRight, Filter, Trash2, Loader2 } from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [purging, setPurging] = useState(false);

  const loadEnquiries = () => {
    setLoading(true);
    api.getAdminEnquiries({ status: statusFilter, search })
      .then((data) => {
        setEnquiries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching enquiries:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEnquiries();
  };

  const closedCount = enquiries.filter((e) => e.status === 'CLOSED').length;

  const handleDeleteSingle = async (id: string, refNo: string) => {
    if (!window.confirm(`Permanently delete closed enquiry ${refNo}? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePurgeClosed = async () => {
    if (!window.confirm(`Permanently delete all ${closedCount} closed enquiries? This action cannot be undone.`)) {
      return;
    }
    setPurging(true);
    try {
      await api.purgeClosedEnquiries();
      loadEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to purge closed enquiries');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-brand-gold" />
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Buyer Trade Enquiries
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Incoming international procurement requests, product sampling inquiries, and volume quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {closedCount > 0 && (
            <button
              onClick={handlePurgeClosed}
              disabled={purging}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
            >
              {purging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Delete Closed Enquiries ({closedCount})</span>
            </button>
          )}

          <span className="text-xs text-neutral-500">
            Total records: <strong className="text-neutral-900 dark:text-neutral-100">{enquiries.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, name, ref..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Enquiries</option>
            <option value="NEW">New</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="AWAITING_CUSTOMER">Awaiting Customer</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Company &amp; Contact</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Product of Interest</th>
                <th className="py-3 px-4">Target Volume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    Loading enquiry records...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No enquiries match the current criteria.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-brand-gold">
                      {enq.reference_no}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                        {enq.company_name}
                      </span>
                      <span className="text-[11px] text-neutral-500">{enq.full_name} · {enq.business_email}</span>
                    </td>

                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                      {enq.country}
                    </td>

                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                      {enq.product_of_interest}
                    </td>

                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {enq.estimated_volume || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          enq.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : enq.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                            : enq.status === 'CONVERTED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : enq.status === 'CLOSED'
                            ? 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 line-through'
                            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-neutral-400 text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/enquiries/${enq.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-brand-gold rounded"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {enq.status === 'CLOSED' && (
                          <button
                            onClick={() => handleDeleteSingle(enq.id, enq.reference_no)}
                            disabled={deletingId === enq.id}
                            title="Delete Closed Enquiry"
                            className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors disabled:opacity-50"
                          >
                            {deletingId === enq.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
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
