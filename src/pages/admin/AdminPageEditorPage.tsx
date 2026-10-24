import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const AdminPageEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pageTitle, setPageTitle] = useState('');
  const [eyebrow, setEyebrow] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [extraField, setExtraField] = useState('');
  const [extraLabel, setExtraLabel] = useState('Supporting Note');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getAdminPageById(id)
      .then((data) => {
        setPageTitle(data.title);
        try {
          const parsed = JSON.parse(data.content_json);
          setEyebrow(parsed.eyebrow || '');
          setHeadline(parsed.headline || '');
          setDescription(parsed.description || '');

          if (parsed.hero_statement) {
            setExtraLabel('Hero Statement');
            setExtraField(parsed.hero_statement);
          } else if (parsed.founder_quote) {
            setExtraLabel('Founder Perspective / Quote');
            setExtraField(parsed.founder_quote);
          } else if (parsed.office_hours) {
            setExtraLabel('Office Hours & Availability');
            setExtraField(parsed.office_hours);
          }
        } catch {
          setHeadline(data.title);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching page:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const contentObj: Record<string, any> = {
        eyebrow,
        headline,
        description,
      };

      if (id === 'page_home') {
        contentObj.hero_statement = extraField;
      } else if (id === 'page_about') {
        contentObj.founder_quote = extraField;
      } else if (id === 'page_contact') {
        contentObj.office_hours = extraField;
      }

      await api.updateAdminPage(id, {
        title: pageTitle,
        content_json: contentObj,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to save page changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
        <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
        <span>Loading structured CMS draft...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/pages"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Edit Content: {pageTitle || 'Page'}
            </h1>
            <p className="text-xs text-neutral-500 font-mono">ID: {id}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-600 dark:text-green-400 rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Page content revision saved and published to SQLite database.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
            Internal Page Title
          </label>
          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
            Hero Eyebrow Label
          </label>
          <input
            type="text"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
            Primary Display Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
            Supporting Narrative Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 leading-relaxed focus:outline-none focus:border-brand-gold"
          />
        </div>

        {extraLabel && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
              {extraLabel}
            </label>
            <textarea
              rows={3}
              value={extraField}
              onChange={(e) => setExtraField(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 leading-relaxed focus:outline-none focus:border-brand-gold"
            />
          </div>
        )}
      </form>
    </div>
  );
};
