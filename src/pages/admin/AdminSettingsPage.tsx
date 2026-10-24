import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';
import { Save, CheckCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: 'SIWI Global Ventures',
    tagline: 'Serving with trust, delivering with quality.',
    phone: '+91 83696 35619',
    email: 'siwiglobalventure@gmail.com',
    location: 'Mumbai, Maharashtra, India',
    founder: 'Harshvardhan Patil',
    registered_address: 'G-3 Riverview Saraswati, Lt Road, Opposite Dahisar Station, Dahisar West, Mumbai-400068',
    gst_no: '27BGPPP7746J1ZN',
    iec_no: 'GBPPP7746J',
    primary_export_focus: 'Dehydrated Vegetable Products (Onion & Garlic)',
    secondary_export_focus: 'Agricultural & Traded Commodities',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getAdminSettings().then(setSettings).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateAdminSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Global Enterprise Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Verified corporate credentials, direct contact channels, and regulatory tax identifiers.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-600 dark:text-green-400 rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Site settings successfully updated in database.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={settings.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Official Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-serif italic text-brand-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Primary Direct Telephone
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Trade Email Address
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Operating Location
            </label>
            <input
              type="text"
              name="location"
              value={settings.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Founder &amp; Sales Head
            </label>
            <input
              type="text"
              name="founder"
              value={settings.founder}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
            Registered Business Address
          </label>
          <input
            type="text"
            name="registered_address"
            value={settings.registered_address || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              GST Registration No.
            </label>
            <input
              type="text"
              name="gst_no"
              value={settings.gst_no || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium mb-1">
              Import Export Code (IEC)
            </label>
            <input
              type="text"
              name="iec_no"
              value={settings.iec_no || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
