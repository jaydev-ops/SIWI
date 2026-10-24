import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Category, MediaAsset } from '../../types';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Star,
  Sparkles,
  Plus,
  Trash2,
  FolderOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowRight,
  ClipboardPaste,
} from 'lucide-react';

interface StagedImageItem {
  id: string;
  source: 'file' | 'media';
  file?: File;
  mediaAsset?: MediaAsset;
  previewUrl: string;
  name: string;
  sizeBytes?: number;
}

interface QuickAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onProductCreated: (product: any) => void;
}

export const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  onProductCreated,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_dehydrated');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [origin, setOrigin] = useState('India');
  const [formType, setFormType] = useState('Dehydrated Powder');
  const [packSizes, setPackSizes] = useState('20kg / 25kg multi-wall bags');
  const [shelfLife, setShelfLife] = useState('24 Months');

  // Staged Images
  const [stagedImages, setStagedImages] = useState<StagedImageItem[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Drag & drop & file input
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media Library Picker Modal
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Submitting
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync categoryId if categories load later
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSlug('');
      setCategoryId(categories[0]?.id || 'cat_dehydrated');
      setShortDescription('');
      setDescription('');
      setStatus('PUBLISHED');
      setStagedImages([]);
      setFeaturedIndex(0);
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  // Auto-generate URL slug
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
  };

  // Add files to staged list
  const addFilesToStaged = (files: File[]) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
    const maxBytes = 10 * 1024 * 1024; // 10MB
    const validItems: StagedImageItem[] = [];

    for (const f of files) {
      if (!allowed.includes(f.type)) {
        setError(`"${f.name}" was skipped: Only JPEG, PNG, WebP, AVIF, SVG are supported.`);
        continue;
      }
      if (f.size > maxBytes) {
        setError(`"${f.name}" is too large (max 10MB).`);
        continue;
      }
      validItems.push({
        id: 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        source: 'file',
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name,
        sizeBytes: f.size,
      });
    }

    if (validItems.length > 0) {
      setError(null);
      setStagedImages((prev) => [...prev, ...validItems]);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToStaged(Array.from(e.dataTransfer.files));
    }
  };

  // Clipboard paste support (Cmd+V / Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        addFilesToStaged(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  // Remove staged image
  const removeStagedImage = (index: number) => {
    setStagedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (featuredIndex >= next.length) {
        setFeaturedIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  // Open Media Library Modal
  const openMediaLibrary = async () => {
    setLibraryOpen(true);
    setLibraryLoading(true);
    setSelectedAssetIds([]);
    try {
      const assets = await api.getAdminMedia();
      setLibraryAssets(assets);
    } catch {
      setError('Failed to load media library assets.');
    } finally {
      setLibraryLoading(false);
    }
  };

  const confirmAttachMediaAssets = () => {
    const selected = libraryAssets.filter((a) => selectedAssetIds.includes(a.id));
    const newItems: StagedImageItem[] = selected.map((asset) => ({
      id: 'media_' + asset.id,
      source: 'media',
      mediaAsset: asset,
      previewUrl: asset.file_url,
      name: asset.title || asset.original_filename || 'Media Asset',
      sizeBytes: asset.file_size,
    }));

    setStagedImages((prev) => [...prev, ...newItems]);
    setLibraryOpen(false);
    setSelectedAssetIds([]);
  };

  // Submit product creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a product title.');
      return;
    }

    if (!slug.trim()) {
      setError('Please provide a valid URL slug.');
      return;
    }

    if (!shortDescription.trim()) {
      setError('Please provide a short commercial summary for catalogue cards.');
      return;
    }

    setSubmitting(true);

    try {
      // Collect files to upload
      const filesToUpload: File[] = [];
      const mediaAssetIds: string[] = [];

      stagedImages.forEach((item) => {
        if (item.source === 'file' && item.file) {
          filesToUpload.push(item.file);
        } else if (item.source === 'media' && item.mediaAsset) {
          mediaAssetIds.push(item.mediaAsset.id);
        }
      });

      // Specifications
      const specifications = [
        { name: 'Product Form', value: formType, unit: '', display_order: 1, is_public: true },
        { name: 'Origin', value: origin, unit: '', display_order: 2, is_public: true },
        { name: 'Shelf Life', value: shelfLife, unit: '', display_order: 3, is_public: true },
      ];

      const featuredItem = stagedImages[featuredIndex];
      const initialFeaturedUrl = featuredItem?.source === 'media' ? featuredItem.previewUrl : '';

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        primary_category_id: categoryId,
        short_description: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        status,
        featured_image: initialFeaturedUrl,
        featured_index: featuredIndex,
        packaging_type: packSizes,
        available_pack_sizes: packSizes,
        shelf_life: shelfLife,
        storage_conditions: 'Cool, dry storage below 25°C in original packaging away from direct sunlight.',
        processing_info: 'Hygienically sorted, metal-detected, and vacuum-sealed to international export specifications.',
        specifications,
        media_asset_ids: mediaAssetIds,
      };

      const result = await api.createProduct(payload, filesToUpload);
      onProductCreated(result);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Quick Add Product</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-bold">
                  With Images in One Go
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                Create a catalogue entry, drop product images, and set primary cover all in a single click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Grid: Info + Imagery */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Product Essentials (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Premium Dehydrated White Onion Flakes"
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 bg-neutral-100 dark:bg-neutral-800 border border-r-0 border-neutral-300 dark:border-neutral-700 rounded-l-lg text-[11px] text-neutral-500 font-mono">
                      /products/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="white-onion-flakes"
                      className="flex-1 px-2.5 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-r-lg text-xs text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Catalogue Summary (Short Description) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setShortDescription(
                          `Premium commercial export grade ${name || 'produce'} processed from select Indian origin crops with rich natural aroma and stringent purity standards.`
                        )
                      }
                      className="text-[10px] text-brand-gold hover:underline"
                    >
                      Use standard template
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Concise commercial summary displayed on product cards and search results..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Quick Specs */}
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Quick Export Attributes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-1">Product Form</label>
                    <input
                      type="text"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-1">Origin</label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-1">Packaging</label>
                    <input
                      type="text"
                      value={packSizes}
                      onChange={(e) => setPackSizes(e.target.value)}
                      className="w-full px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-1">Shelf Life</label>
                    <input
                      type="text"
                      value={shelfLife}
                      onChange={(e) => setShelfLife(e.target.value)}
                      className="w-full px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Publishing:</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-800 dark:text-neutral-200">
                  <input
                    type="radio"
                    name="quick_status"
                    checked={status === 'PUBLISHED'}
                    onChange={() => setStatus('PUBLISHED')}
                    className="accent-brand-gold"
                  />
                  <span>Publish Immediately</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-500">
                  <input
                    type="radio"
                    name="quick_status"
                    checked={status === 'DRAFT'}
                    onChange={() => setStatus('DRAFT')}
                    className="accent-brand-gold"
                  />
                  <span>Save as Draft</span>
                </label>
              </div>
            </div>

            {/* Right Column: Multi-Image Uploader & Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Product Imagery ({stagedImages.length})
                  </label>
                  <span className="text-[10px] text-neutral-500">
                    Click an image to set as Primary Cover
                  </span>
                </div>
                <button
                  type="button"
                  onClick={openMediaLibrary}
                  className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-medium"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Media Library</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    addFilesToStaged(Array.from(e.target.files));
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-brand-gold bg-brand-gold/10 scale-[1.01]'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-brand-gold bg-neutral-50/70 dark:bg-neutral-800/40'
                }`}
              >
                <div className="space-y-1.5 pointer-events-none">
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Drop photos here, or <span className="text-brand-gold underline">browse</span>
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Select multiple · JPEG, PNG, WebP up to 10MB
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 pt-1">
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Supports Cmd+V paste from clipboard</span>
                  </div>
                </div>
              </div>

              {/* Staged Images Strip / Grid */}
              {stagedImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50">
                    {stagedImages.map((img, idx) => {
                      const isCover = idx === featuredIndex;
                      return (
                        <div
                          key={img.id}
                          onClick={() => setFeaturedIndex(idx)}
                          className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all aspect-square bg-neutral-200 dark:bg-neutral-800 ${
                            isCover
                              ? 'border-brand-gold shadow-md ring-2 ring-brand-gold/30'
                              : 'border-transparent hover:border-neutral-400 dark:hover:border-neutral-600'
                          }`}
                        >
                          <img
                            src={img.previewUrl}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover badge */}
                          {isCover && (
                            <div className="absolute top-1 left-1 bg-brand-gold text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-neutral-950" />
                              <span>Cover</span>
                            </div>
                          )}

                          {/* Hover set cover overlay */}
                          {!isCover && (
                            <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-medium bg-neutral-900/80 px-2 py-0.5 rounded">
                                Set Cover
                              </span>
                            </div>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeStagedImage(idx);
                            }}
                            className="absolute top-1 right-1 p-1 bg-neutral-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-neutral-500 text-center">
                    {stagedImages.length} image{stagedImages.length === 1 ? '' : 's'} staged. Primary cover is highlighted in gold.
                  </p>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-center bg-white dark:bg-neutral-900 text-xs text-neutral-400">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 text-neutral-400 opacity-60" />
                  <span>No images added yet. You can still create the product and add them later.</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              {stagedImages.length > 0
                ? `${stagedImages.length} image(s) will be uploaded & attached immediately`
                : 'Default placeholder image will be assigned'}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-neutral-950 text-xs font-semibold rounded-lg hover:bg-brand-goldLight transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating &amp; Uploading...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {status === 'PUBLISHED' ? 'Create & Publish' : 'Save Product'}{' '}
                      {stagedImages.length > 0 ? `(${stagedImages.length} Images)` : ''}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Library Picker Modal (Nested) */}
      {libraryOpen && (
        <div className="fixed inset-0 z-60 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Select from Media Library
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Pick existing high-res assets to attach to this product
                </p>
              </div>
              <button onClick={() => setLibraryOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <input
                type="text"
                placeholder="Search assets by title..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full px-3 py-1.5 mb-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
              />

              {libraryLoading ? (
                <div className="py-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                  <span>Loading media library...</span>
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No assets found in Media Library.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {libraryAssets
                    .filter((a) => (a.title || a.original_filename).toLowerCase().includes(librarySearch.toLowerCase()))
                    .map((asset) => {
                      const isSelected = selectedAssetIds.includes(asset.id);
                      return (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setSelectedAssetIds((prev) =>
                              prev.includes(asset.id) ? prev.filter((id) => id !== asset.id) : [...prev, asset.id]
                            );
                          }}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-brand-gold shadow-md ring-2 ring-brand-gold/40'
                              : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
                          }`}
                        >
                          <img src={asset.file_url} alt={asset.title} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-brand-gold text-neutral-950 p-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-neutral-950/70 p-1 text-[10px] text-white truncate">
                            {asset.title || asset.original_filename}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
              <span className="text-xs text-neutral-500">
                {selectedAssetIds.length} asset(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLibraryOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAttachMediaAssets}
                  disabled={selectedAssetIds.length === 0}
                  className="px-4 py-1.5 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight disabled:opacity-50"
                >
                  Attach Selected ({selectedAssetIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
