import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { MediaAsset } from '../../types';
import {
  Search,
  UploadCloud,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  X,
  Plus,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const AdminMediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [storageInfo, setStorageInfo] = useState<{ provider: string; isCloud: boolean }>({
    provider: 'LocalPersistentStorage',
    isCloud: false,
  });

  // Selected Asset for Details Inspector Modal
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Inspector Edit States
  const [editTitle, setEditTitle] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);

  // Feedback Notifications
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media Assets
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminMedia({
        search,
        mime_type: typeFilter === 'all' ? undefined : typeFilter,
        usage: usageFilter === 'all' ? undefined : usageFilter,
      });
      setMedia(data);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load media library assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [typeFilter, usageFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  // Open Asset Inspector
  const openInspector = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setEditTitle(asset.title || asset.original_filename);
    setEditAltText(asset.alt_text || '');
    setEditCaption(asset.caption || '');
    setInspectorOpen(true);
  };

  // Copy Public Asset URL
  const handleCopy = (url: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Save Metadata Changes in Inspector
  const handleSaveMetadata = async () => {
    if (!selectedAsset) return;
    setSavingMeta(true);
    setActionError(null);
    try {
      await api.updateAdminMedia(selectedAsset.id, {
        title: editTitle,
        alt_text: editAltText,
        caption: editCaption,
      });
      setActionSuccess('Asset metadata saved successfully.');
      setTimeout(() => setActionSuccess(null), 3000);

      // Update local state
      setSelectedAsset((prev) =>
        prev
          ? {
              ...prev,
              title: editTitle,
              alt_text: editAltText,
              caption: editCaption,
            }
          : null
      );
      await fetchMedia();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update metadata.');
    } finally {
      setSavingMeta(false);
    }
  };

  // Replace Asset File
  const handleReplaceAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAsset || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    e.target.value = '';

    try {
      setSavingMeta(true);
      const res = await api.replaceAdminMedia(selectedAsset.id, file);
      setActionSuccess(`Replaced file with "${file.name}".`);
      setTimeout(() => setActionSuccess(null), 3000);

      if (res.data) {
        setSelectedAsset((prev) => (prev ? { ...prev, ...res.data } : null));
      }
      await fetchMedia();
    } catch (err: any) {
      setActionError(err.message || 'Failed to replace file.');
    } finally {
      setSavingMeta(false);
    }
  };

  // Delete Asset
  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (asset.is_used_in_published) {
      setActionError(
        `Asset cannot be deleted: It is actively used by published product(s) [${(asset.used_in_products || []).join(', ')}]. Remove it from product galleries before deleting.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete "${asset.title || asset.original_filename}" from media storage?\n\nThis operation cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.deleteAdminMedia(asset.id);
      setActionSuccess('Media asset permanently deleted.');
      setTimeout(() => setActionSuccess(null), 3000);
      setInspectorOpen(false);
      setSelectedAsset(null);
      await fetchMedia();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete media asset.');
    }
  };

  // Multi-file Upload Handlers
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
      processFilesForUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFilesForUpload(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const processFilesForUpload = async (files: File[]) => {
    const queueItems: UploadQueueItem[] = files.map((file) => ({
      id: 'up_' + Date.now() + '_' + Math.random(),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }));

    setUploadQueue((prev) => [...prev, ...queueItems]);

    for (const item of queueItems) {
      setUploadQueue((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 50 } : i))
      );

      try {
        await api.uploadAdminMedia([item.file]);
        setUploadQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'success', progress: 100 } : i))
        );
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', progress: 0, errorMessage: err.message || 'Upload failed' }
              : i
          )
        );
      }
    }

    await fetchMedia();
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Hidden file input for Replace */}
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceAsset}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Central Media Asset Library
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              {media.length} {media.length === 1 ? 'Asset' : 'Assets'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Centrally manage high-resolution macro photography, ingredient studies, and maritime logistics assets with
            persistent storage.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Feedback Alerts */}
      {actionError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="p-1 hover:text-red-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by filename or title..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Format Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
            >
              <option value="all">All File Formats</option>
              <option value="jpeg">JPEG (.jpg)</option>
              <option value="png">PNG (.png)</option>
              <option value="webp">WebP (.webp)</option>
              <option value="avif">AVIF (.avif)</option>
              <option value="svg">SVG (.svg)</option>
            </select>
          </div>

          {/* Usage Filter */}
          <select
            value={usageFilter}
            onChange={(e) => setUsageFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">All Usage States</option>
            <option value="used">Used in Products</option>
            <option value="unused">Unused Media</option>
          </select>
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
          <span>Loading central media library assets...</span>
        </div>
      ) : media.length === 0 ? (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-16 text-center bg-white dark:bg-neutral-900">
          <ImageIcon className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No media assets match your criteria</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
            Try clearing search filters or click "Upload Media" to add new high-resolution photography.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 bg-brand-gold text-neutral-950 font-semibold text-xs rounded hover:bg-brand-goldLight"
          >
            Upload Media Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media.map((asset) => {
            const hasUsage = Number(asset.usage_count || 0) > 0;
            const isPublished = Boolean(asset.is_used_in_published);

            return (
              <div
                key={asset.id}
                onClick={() => openInspector(asset)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden group shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                    <img
                      src={asset.file_url}
                      alt={asset.alt_text || asset.title || 'Media thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Usage Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isPublished ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-green-500 text-white shadow-sm">
                          Live on Web
                        </span>
                      ) : hasUsage ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                          Used in Draft
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-neutral-800/80 text-neutral-300 backdrop-blur-sm border border-white/10">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {asset.width && asset.height && (
                      <div className="absolute bottom-2 right-2 bg-neutral-950/80 text-neutral-300 text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {asset.width}×{asset.height}
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate group-hover:text-brand-gold transition-colors">
                      {asset.title || asset.original_filename}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                      {asset.original_filename}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      {asset.file_size ? `${(asset.file_size / 1024).toFixed(0)} KB · ` : ''}
                      {asset.mime_type?.replace('image/', '').toUpperCase() || 'IMAGE'}
                    </p>
                  </div>
                </div>

                <div className="p-3 pt-0 border-t border-neutral-100 dark:border-neutral-800 mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">
                    {hasUsage
                      ? `${asset.usage_count} ${asset.usage_count === 1 ? 'Product' : 'Products'}`
                      : '0 references'}
                  </span>
                  <button
                    onClick={(e) => handleCopy(asset.file_url, asset.id, e)}
                    className="inline-flex items-center gap-1 text-[11px] text-brand-gold hover:underline font-mono"
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Upload Media Assets
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Select and upload single or multiple photography studies directly to persistent storage.
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-brand-gold/60 bg-neutral-50 dark:bg-neutral-800/40'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Drag and drop files here, or <span className="text-brand-gold underline">browse device</span>
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Supports multi-selection · JPEG, PNG, WebP, AVIF, SVG up to 10MB each
                </p>
              </div>

              {/* Upload Progress Queue */}
              {uploadQueue.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Upload Queue ({uploadQueue.length})
                  </p>
                  {uploadQueue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-xs"
                    >
                      <img src={item.previewUrl} alt="prev" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-neutral-800 dark:text-neutral-200">{item.file.name}</p>
                        {item.status === 'uploading' && (
                          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1 rounded-full mt-1">
                            <div className="bg-brand-gold h-full" style={{ width: `${item.progress}%` }} />
                          </div>
                        )}
                        {item.status === 'error' && (
                          <p className="text-[10px] text-red-500 truncate">{item.errorMessage}</p>
                        )}
                      </div>
                      <div>
                        {item.status === 'uploading' && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />}
                        {item.status === 'success' && <Check className="w-3.5 h-3.5 text-green-500" />}
                        {item.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-1.5 bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-semibold rounded hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Details Inspector Modal / Slide-out */}
      {inspectorOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span>Asset Inspector:</span>
                  <span className="text-brand-gold">{selectedAsset.title || selectedAsset.original_filename}</span>
                </h3>
                <p className="text-[11px] text-neutral-500 font-mono">{selectedAsset.storage_key || selectedAsset.file_url}</p>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split 2 Columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Preview & File Details */}
              <div className="md:col-span-6 space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-inner">
                  <img
                    src={selectedAsset.file_url}
                    alt={selectedAsset.alt_text}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[10px] block mb-2">
                    Storage &amp; Technical Attributes
                  </span>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500">Original Filename</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100">{selectedAsset.original_filename}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500">MIME Type</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100">{selectedAsset.mime_type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500">Dimensions</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100">
                      {selectedAsset.width && selectedAsset.height ? `${selectedAsset.width} × ${selectedAsset.height} px` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500">File Size</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100">
                      {selectedAsset.file_size ? `${(selectedAsset.file_size / 1024).toFixed(1)} KB` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Public URL</span>
                    <button
                      onClick={() => handleCopy(selectedAsset.file_url, selectedAsset.id)}
                      className="font-mono text-brand-gold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === selectedAsset.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === selectedAsset.id ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => replaceInputRef.current?.click()}
                    disabled={savingMeta}
                    className="flex-1 py-2 px-3 border border-neutral-300 dark:border-neutral-700 hover:border-brand-gold rounded text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Image File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(selectedAsset)}
                    className="py-2 px-3 border border-red-200 dark:border-red-900/50 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    title={
                      selectedAsset.is_used_in_published
                        ? 'Cannot delete: used in published products'
                        : 'Delete unused asset'
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Metadata Form & Associated Products */}
              <div className="md:col-span-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Editable Descriptive Metadata
                  </h4>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Display Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Onion Powder Macro Study"
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Alt Text (SEO &amp; Accessibility)
                    </label>
                    <textarea
                      rows={2}
                      value={editAltText}
                      onChange={(e) => setEditAltText(e.target.value)}
                      placeholder="Concise, descriptive text for screen readers and search engines"
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Caption / Technical Context
                    </label>
                    <textarea
                      rows={2}
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Optional editorial caption rendered on product detail pages"
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveMetadata}
                    disabled={savingMeta}
                    className="w-full py-2 bg-brand-gold text-neutral-950 font-semibold text-xs rounded hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {savingMeta && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Metadata Changes</span>
                  </button>
                </div>

                {/* Where this asset is used */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Associated Product Usage</span>
                    </h4>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {selectedAsset.usage_count || 0} {selectedAsset.usage_count === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  {selectedAsset.used_in_products && selectedAsset.used_in_products.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAsset.used_in_products.map((name, idx) => {
                        const prodId = selectedAsset.used_in_product_ids?.[idx];
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs"
                          >
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">{name}</span>
                            {prodId && (
                              <Link
                                to={`/admin/products/${prodId}/edit`}
                                className="inline-flex items-center gap-1 text-[11px] text-brand-gold hover:underline font-mono"
                              >
                                <span>Edit Product</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">
                      This asset is not currently attached to any product galleries. It can be safely attached to any
                      product or deleted.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
