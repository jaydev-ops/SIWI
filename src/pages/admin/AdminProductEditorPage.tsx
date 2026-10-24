import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Category, ProductSpecification, MediaAsset } from '../../types';
import { ProductImagesManager } from '../../components/admin/ProductImagesManager';
import {
  ArrowLeft,
  Save,
  Check,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  Image,
  Sliders,
  Package,
  Globe,
  UploadCloud,
  Star,
  Sparkles,
} from 'lucide-react';

export const AdminProductEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('general');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    status: 'DRAFT',
    primary_category_id: 'cat_dehydrated',
    featured_image: '/assets/images/onion_powder_macro.jpg',
    packaging_type: '',
    available_pack_sizes: '',
    shelf_life: '',
    storage_conditions: '',
    processing_info: '',
    industrial_applications: '',
    seo_title: '',
    seo_description: '',
  });

  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { id: '1', product_id: '', name: 'Product Form', value: 'Fine Powder', unit: '', display_order: 1, is_public: true },
    { id: '2', product_id: '', name: 'Origin', value: 'India', unit: '', display_order: 2, is_public: true },
  ]);

  // Staged images state for one-go creation
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [stagedMediaAssets, setStagedMediaAssets] = useState<MediaAsset[]>([]);
  const [stagedFeaturedIndex, setStagedFeaturedIndex] = useState(0);
  const tab1FileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getAdminCategories()
      .then(setCategories)
      .catch(console.error);

    if (!isNew && id) {
      api.getAdminProductById(id)
        .then((prod) => {
          setFormData(prod);
          if (prod.specifications && prod.specifications.length > 0) {
            setSpecifications(prod.specifications);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load product record.');
          setLoading(false);
        });
    }
  }, [id, isNew]);

  // Auto-generate slug from name if new
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      name: val,
      slug: isNew ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
      seo_title: isNew ? `${val} | SIWI Global Ventures` : prev.seo_title,
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Spec handlers
  const handleAddSpec = () => {
    setSpecifications((prev) => [
      ...prev,
      {
        id: 'spec_' + Date.now(),
        product_id: id || '',
        name: '',
        value: '',
        unit: '',
        display_order: prev.length + 1,
        is_public: true,
      },
    ]);
  };

  const handleSpecChange = (index: number, field: string, value: any) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTab1FileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = Array.from(e.target.files);
    e.target.value = '';

    if (isNew) {
      setStagedFiles((prev) => [...prev, ...selected]);
      const preview = URL.createObjectURL(selected[0]);
      setFormData((prev: any) => ({ ...prev, featured_image: preview }));
    } else if (id) {
      try {
        setSaving(true);
        await api.addAdminProductImage(id, { files: selected });
        const updatedImages = await api.getAdminProductImages(id);
        const feat = updatedImages.find((img) => img.is_featured === 1 || img.is_featured === true) || updatedImages[0];
        if (feat) {
          setFormData((prev: any) => ({ ...prev, featured_image: feat.file_url }));
        }
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to upload images');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async (statusOverride?: string) => {
    setError(null);
    if (!formData.name || !formData.slug || !formData.short_description) {
      setError('Please provide Product Name, URL Slug, and Short Description.');
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      status: statusOverride || formData.status,
      specifications,
    };

    try {
      if (isNew) {
        const mediaAssetIds = stagedMediaAssets.map((a) => a.id);
        const res = await api.createProduct(
          {
            ...payload,
            media_asset_ids: mediaAssetIds,
            featured_index: stagedFeaturedIndex,
          },
          stagedFiles
        );
        setSavedSuccess(true);
        setTimeout(() => navigate(`/admin/products/${res.id}/edit`), 1000);
      } else {
        await api.updateProduct(id!, payload);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: '1. General Info', icon: Layers },
    { id: 'images', name: '2. Product Images', icon: Image },
    { id: 'specifications', name: '3. Specifications', icon: Sliders },
    { id: 'packaging', name: '4. Packaging & Supply', icon: Package },
    { id: 'seo', name: '5. SEO & URL', icon: Globe },
    { id: 'publishing', name: '6. Publishing Workflow', icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-neutral-500 font-mono">
        Loading product editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {isNew ? 'Create New Product Record' : `Edit: ${formData.name}`}
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                  formData.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}
              >
                {formData.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {isNew ? 'New product draft' : `URL: /products/${formData.slug}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && formData.status === 'PUBLISHED' && (
            <Link
              to={`/products/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-600 dark:text-neutral-300 hover:text-brand-gold"
            >
              <span>Preview Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-400 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {savedSuccess && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-600 dark:text-green-400 rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Product record updated successfully.</span>
        </div>
      )}

      {/* 7-Tab Navigation Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-brand-gold text-brand-gold font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
        {/* TAB 1: GENERAL INFO */}
        {activeTab === 'general' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Onion Powder"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                URL Slug *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-r-0 border-neutral-200 dark:border-neutral-700 rounded-l text-xs text-neutral-500 font-mono">
                  /products/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="onion-powder"
                  className="flex-1 px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-r text-xs text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Assigned Category *
              </label>
              <select
                value={formData.primary_category_id}
                onChange={(e) => handleInputChange('primary_category_id', e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Short Description (Catalogue Card Summary) *
              </label>
              <textarea
                rows={3}
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                placeholder="Concise commercial summary of the product..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold leading-relaxed"
              />
            </div>

            {/* INLINE PRODUCT IMAGERY CARD */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200">
                    Product Imagery &amp; Primary Cover
                  </label>
                  <p className="text-[11px] text-neutral-500">
                    {isNew
                      ? 'Add photos right now — they will be uploaded & attached in one go on save.'
                      : 'Cover photo shown on public catalogue cards.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Advanced Gallery Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Cover Preview */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-brand-gold shadow-sm flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 group">
                  <img
                    src={formData.featured_image || '/assets/images/onion_powder_macro.jpg'}
                    alt={formData.name || 'Cover'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-brand-gold text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-neutral-950" />
                    <span>Cover</span>
                  </div>
                </div>

                {/* Dropzone & Quick Upload */}
                <div className="flex-1 w-full space-y-2">
                  <div
                    onClick={() => tab1FileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-brand-gold rounded-lg p-3 text-center cursor-pointer transition-colors bg-white dark:bg-neutral-900/60"
                  >
                    <UploadCloud className="w-5 h-5 mx-auto text-brand-gold mb-1" />
                    <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      Drop or click to add photos <span className="text-neutral-400 font-normal">(multi-select)</span>
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      JPG, PNG, WebP up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={tab1FileInputRef}
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                    onChange={handleTab1FileSelect}
                    className="hidden"
                  />

                  {/* Staged photos count or status */}
                  {isNew && stagedFiles.length > 0 && (
                    <div className="flex items-center gap-2 text-[11px] text-green-600 dark:text-green-400 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>{stagedFiles.length} photo(s) staged. Will upload together with this product.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Full Editorial Description
              </label>
              <textarea
                rows={6}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Comprehensive description of processing, aroma, culinary characteristics..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT IMAGES */}
        {activeTab === 'images' && (
          <ProductImagesManager
            productId={id || ''}
            isNew={isNew}
            stagedFiles={stagedFiles}
            onStagedFilesChange={setStagedFiles}
            stagedMediaAssets={stagedMediaAssets}
            onStagedMediaAssetsChange={setStagedMediaAssets}
            stagedFeaturedIndex={stagedFeaturedIndex}
            onStagedFeaturedIndexChange={setStagedFeaturedIndex}
            onFeaturedImageChanged={(url) => {
              setFormData((prev: any) => ({ ...prev, featured_image: url }));
            }}
          />
        )}

        {/* TAB 3: SPECIFICATIONS */}
        {activeTab === 'specifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Verified Technical Attributes
                </h3>
                <p className="text-xs text-neutral-500">
                  Add flexible key-value parameters. Unconfirmed values must not be fabricated.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-medium rounded hover:bg-neutral-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Attribute</span>
              </button>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-4">Parameter Name</th>
                    <th className="py-2.5 px-4">Verified Value</th>
                    <th className="py-2.5 px-4">Unit</th>
                    <th className="py-2.5 px-4 text-center">Public</th>
                    <th className="py-2.5 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {specifications.map((spec, idx) => (
                    <tr key={spec.id || idx}>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => handleSpecChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Particle Size"
                          className="w-full px-2 py-1 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                          placeholder="e.g. 80 - 100"
                          className="w-full px-2 py-1 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={spec.unit || ''}
                          onChange={(e) => handleSpecChange(idx, 'unit', e.target.value)}
                          placeholder="e.g. Mesh"
                          className="w-24 px-2 py-1 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={spec.is_public}
                          onChange={(e) => handleSpecChange(idx, 'is_public', e.target.checked)}
                          className="rounded text-brand-gold focus:ring-0"
                        />
                      </td>
                      <td className="py-2 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="p-1 text-neutral-400 hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGING & SUPPLY */}
        {activeTab === 'packaging' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Standard Packaging Type
              </label>
              <input
                type="text"
                value={formData.packaging_type || ''}
                onChange={(e) => handleInputChange('packaging_type', e.target.value)}
                placeholder="e.g. Multi-wall kraft paper bags with inner food-grade PE liner"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Available Pack Sizes
              </label>
              <input
                type="text"
                value={formData.available_pack_sizes || ''}
                onChange={(e) => handleInputChange('available_pack_sizes', e.target.value)}
                placeholder="e.g. 20 kg, 25 kg export cartons"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Shelf Life
                </label>
                <input
                  type="text"
                  value={formData.shelf_life || ''}
                  onChange={(e) => handleInputChange('shelf_life', e.target.value)}
                  placeholder="e.g. 18–24 months"
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Storage Conditions
                </label>
                <input
                  type="text"
                  value={formData.storage_conditions || ''}
                  onChange={(e) => handleInputChange('storage_conditions', e.target.value)}
                  placeholder="e.g. Store in cool, dry warehouse below 25°C"
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Industrial Applications
              </label>
              <textarea
                rows={3}
                value={formData.industrial_applications || ''}
                onChange={(e) => handleInputChange('industrial_applications', e.target.value)}
                placeholder="Seasoning formulations, dry soup blends, institutional food service..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
              />
            </div>
          </div>
        )}

        {/* TAB 5: SEO & URL */}
        {activeTab === 'seo' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={formData.seo_title || ''}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.seo_description || ''}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs leading-relaxed"
              />
            </div>

            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-800/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
                Google Search Engine Snippet Preview
              </span>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {formData.seo_title || `${formData.name} | SIWI Global Ventures`}
              </p>
              <p className="text-[11px] text-green-700 dark:text-green-500 font-mono">
                https://siwiglobalventures.com/products/{formData.slug}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                {formData.seo_description || formData.short_description}
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: PUBLISHING WORKFLOW */}
        {activeTab === 'publishing' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Publication Checklist &amp; Status
              </h3>
              <p className="text-xs text-neutral-500">
                Verify content requirements before releasing updates to the public B2B website.
              </p>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-3 bg-neutral-50 dark:bg-neutral-800/30">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-semibold block">
                Verification Checklist
              </span>

              <div className="flex items-center gap-2 text-xs">
                {formData.name ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-neutral-400" />}
                <span className={formData.name ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}>
                  Product Name defined ({formData.name || 'Missing'})
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {formData.slug ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-neutral-400" />}
                <span className={formData.slug ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}>
                  URL Slug valid (/{formData.slug || 'missing'})
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {formData.short_description ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-neutral-400" />}
                <span className={formData.short_description ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}>
                  Short description provided for catalogue
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {formData.featured_image ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-neutral-400" />}
                <span className={formData.featured_image ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}>
                  Macro product photography selected
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleSave('PUBLISHED')}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors"
              >
                Publish to Public Website
              </button>

              <button
                type="button"
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
                className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded hover:bg-neutral-300"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSave('ARCHIVED')}
                disabled={saving}
                className="px-6 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-500 text-xs font-medium rounded hover:text-red-500"
              >
                Archive Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
