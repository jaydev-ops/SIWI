import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Enquiry } from '../../types';
import { ArrowLeft, Save, Mail, Phone, MapPin, CheckCircle, Trash2, Loader2 } from 'lucide-react';

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('NEW');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getAdminEnquiryById(id)
      .then((data) => {
        setEnquiry(data);
        setStatus(data.status);
        setInternalNotes(data.internal_notes || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching enquiry:', err);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.updateEnquiry(id, {
        status,
        internal_notes: internalNotes,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !enquiry) return;
    if (!window.confirm(`Permanently delete closed enquiry ${enquiry.reference_no}? This action cannot be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      await api.deleteEnquiry(id);
      navigate('/admin/enquiries');
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
      setDeleting(false);
    }
  };

  if (loading || !enquiry) {
    return (
      <div className="py-20 text-center text-xs text-neutral-500 font-mono">
        Loading enquiry details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/enquiries"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Enquiry {enquiry.reference_no}
              </h1>
              <span className="text-xs text-neutral-500 font-mono">
                Received {new Date(enquiry.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {enquiry.company_name} ({enquiry.country})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${enquiry.business_email}?subject=RE:%20SIWI%20Global%20Ventures%20Trade%20Enquiry%20${enquiry.reference_no}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-medium rounded hover:bg-neutral-800"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Reply via Email</span>
          </a>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Status & Notes'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-600 dark:text-green-400 rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Enquiry status and internal notes updated in database.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Buyer Details & Commercial Message (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Buyer Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold block border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Buyer Identification
            </span>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px]">Contact Person</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{enquiry.full_name}</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px]">Company Name</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{enquiry.company_name}</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px]">Corporate Email</span>
                <a href={`mailto:${enquiry.business_email}`} className="text-brand-gold hover:underline">
                  {enquiry.business_email}
                </a>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px]">Telephone / WhatsApp</span>
                <span>{enquiry.phone_number || 'Not provided'}</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px]">Country / Market</span>
                <span className="font-medium">{enquiry.country}</span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px]">Destination Port</span>
                <span className="font-mono">{enquiry.destination_port || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Commodity Details Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold block border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Commodity &amp; Volume Requested
            </span>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px]">Product of Interest</span>
                <span className="font-serif text-lg text-brand-gold font-medium">
                  {enquiry.product_of_interest}
                </span>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px]">Target Volume</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                  {enquiry.estimated_volume || 'Open / Sample Request'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-neutral-400 block text-[11px]">Preferred Packaging Format</span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {enquiry.preferred_packaging || 'Standard Export Standard'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[11px] mb-2 font-medium">
                Detailed Procurement Message
              </span>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded border border-neutral-200 dark:border-neutral-800 text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans whitespace-pre-wrap">
                {enquiry.enquiry_details}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Operational Status & Internal Notes (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold block border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Operational Management
            </span>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Current Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
              >
                <option value="NEW">NEW · Unreviewed</option>
                <option value="REVIEWED">REVIEWED · Spec Evaluated</option>
                <option value="IN_PROGRESS">IN_PROGRESS · Quotation Issued</option>
                <option value="AWAITING_CUSTOMER">AWAITING_CUSTOMER · Follow-up Pending</option>
                <option value="CONVERTED">CONVERTED · Contract Concluded</option>
                <option value="CLOSED">CLOSED · Terminated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Private Internal Notes (Never Shown to Buyer)
              </label>
              <textarea
                rows={6}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log internal communication, sample dispatch tracking numbers, target CIF price discussions..."
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
              className="w-full py-2.5 bg-neutral-900 dark:bg-brand-gold text-white dark:text-neutral-950 font-semibold text-xs rounded hover:opacity-90 transition-opacity"
            >
              {saving ? 'Updating Record...' : 'Save Status & Notes'}
            </button>

            {(status === 'CLOSED' || enquiry?.status === 'CLOSED') && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-2.5 border border-red-500/40 text-red-600 dark:text-red-400 font-semibold text-xs rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Closed Enquiry</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
