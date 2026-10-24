import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { ProductImage, MediaAsset } from '../../types';
import {
  UploadCloud,
  Image as ImageIcon,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Check,
  AlertCircle,
  Plus,
  X,
  Loader2,
  FolderOpen,
  Info,
  Sparkles,
} from 'lucide-react';

interface ProductImagesManagerProps {
  productId: string;
  isNew: boolean;
  onFeaturedImageChanged?: (url: string) => void;
  stagedFiles?: File[];
  onStagedFilesChange?: (files: File[]) => void;
  stagedMediaAssets?: MediaAsset[];
  onStagedMediaAssetsChange?: (assets: MediaAsset[]) => void;
  stagedFeaturedIndex?: number;
  onStagedFeaturedIndexChange?: (index: number) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const ProductImagesManager: React.FC<ProductImagesManagerProps> = ({
  productId,
  isNew,
  onFeaturedImageChanged,
  stagedFiles = [],
  onStagedFilesChange,
  stagedMediaAssets = [],
  onStagedMediaAssetsChange,
  stagedFeaturedIndex = 0,
  onStagedFeaturedIndexChange,
}) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Media Library Picker Modal State
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [selectedLibraryAssetId, setSelectedLibraryAssetId] = useState<string | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');

  // Editing metadata
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingAltText, setEditingAltText] = useState('');
  const [editingCaption, setEditingCaption] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);

  // Replace single image state
  const [replacingImageId, setReplacingImageId] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load product gallery images
  const loadGallery = async () => {
    if (isNew || !productId) return;
    try {
      setLoading(true);
      const data = await api.getAdminProductImages(productId);
      setImages(data);
      const featured = data.find((img) => img.is_featured === 1 || img.is_featured === true);
      if (featured && onFeaturedImageChanged) {
        onFeaturedImageChanged(featured.file_url);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [productId, isNew]);

  // Support clipboard paste of images
  useEffect(() => {
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
        processFilesForUpload(pastedFiles);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isNew, images, stagedFiles, productId]);

  // Handle Drag & Drop
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
    const maxBytes = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];

    // In isNew mode, stage files directly without blocking
    if (isNew) {
      const validFiles: File[] = [];
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          setError(`File "${file.name}" rejected: Unsupported format. Allowed: JPEG, PNG, WebP, AVIF, SVG.`);
          return;
        }
        if (file.size > maxBytes) {
          setError(`File "${file.name}" rejected: Exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
          return;
        }
        validFiles.push(file);
      }

      const nextStaged = [...stagedFiles, ...validFiles];
      if (onStagedFilesChange) onStagedFilesChange(nextStaged);

      const newDisplayImages: ProductImage[] = validFiles.map((f, idx) => ({
        id: 'staged_file_' + Date.now() + '_' + idx,
        product_id: '',
        media_asset_id: '',
        file_url: URL.createObjectURL(f),
        display_order: images.length + idx + 1,
        is_featured: images.length === 0 && idx === 0 ? 1 : 0,
        alt_text: f.name,
        original_filename: f.name,
      }));

      const updated = [...images, ...newDisplayImages];
      setImages(updated);

      if (images.length === 0 && newDisplayImages.length > 0 && onFeaturedImageChanged) {
        onFeaturedImageChanged(newDisplayImages[0].file_url);
      }

      setSuccessMessage(`${validFiles.length} image(s) staged. They will be uploaded and attached when you save.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      return;
    }

    const validFiles: UploadQueueItem[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" rejected: Unsupported format. Allowed: JPEG, PNG, WebP, AVIF, SVG.`);
        return;
      }
      if (file.size > maxBytes) {
        setError(`File "${file.name}" rejected: Exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
        return;
      }

      validFiles.push({
        id: 'upload_' + Date.now() + '_' + Math.random(),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      });
    }

    setUploadQueue((prev) => [...prev, ...validFiles]);
    uploadQueueItems(validFiles);
  };

  const uploadQueueItems = async (items: UploadQueueItem[]) => {
    for (const item of items) {
      setUploadQueue((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 40 } : i))
      );

      try {
        await api.addAdminProductImage(productId, {
          files: [item.file],
        });

        setUploadQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'success', progress: 100 } : i))
        );

        setSuccessMessage(`Uploaded "${item.file.name}" successfully.`);
        setTimeout(() => setSuccessMessage(null), 3500);
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

    await loadGallery();
  };

  const handleRetryUpload = (item: UploadQueueItem) => {
    uploadQueueItems([item]);
  };

  const handleDismissQueueItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((i) => i.id !== id));
  };

  // Set Featured / Primary Image
  const handleSetFeatured = async (image: ProductImage) => {
    if (isNew) {
      const updated = images.map((img) => ({
        ...img,
        is_featured: img.id === image.id ? 1 : 0,
      }));
      setImages(updated);
      const featuredIdx = updated.findIndex((img) => img.id === image.id);
      if (onStagedFeaturedIndexChange && featuredIdx >= 0) {
        onStagedFeaturedIndexChange(featuredIdx);
      }
      if (onFeaturedImageChanged) {
        onFeaturedImageChanged(image.file_url);
      }
      setSuccessMessage(`"${image.alt_text || 'Selected image'}" is now the primary cover photo.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    try {
      await api.updateAdminProductImage(productId, image.id, { is_featured: true });
      if (onFeaturedImageChanged) {
        onFeaturedImageChanged(image.file_url);
      }
      await loadGallery();
      setSuccessMessage(`"${image.alt_text || 'Selected image'}" is now the primary featured image.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to set featured image.');
    }
  };

  // Reorder Images (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newOrder = [...images];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setImages(newOrder.map((img, idx) => ({ ...img, display_order: idx + 1 })));

    if (isNew) return;

    const payload = newOrder.map((img, idx) => ({
      id: img.id,
      display_order: idx + 1,
    }));

    try {
      await api.reorderAdminProductImages(productId, payload);
    } catch (err: any) {
      setError('Failed to persist order.');
      await loadGallery();
    }
  };

  // Remove from Product Gallery
  const handleRemoveImage = async (image: ProductImage) => {
    if (isNew) {
      const filtered = images.filter((img) => img.id !== image.id);
      setImages(filtered);
      if (image.id.startsWith('staged_file_') && onStagedFilesChange) {
        const remainingFiles = stagedFiles.filter((f) => f.name !== image.original_filename);
        onStagedFilesChange(remainingFiles);
      } else if (image.media_asset_id && onStagedMediaAssetsChange) {
        const remainingAssets = stagedMediaAssets.filter((a) => a.id !== image.media_asset_id);
        onStagedMediaAssetsChange(remainingAssets);
      }
      setSuccessMessage('Staged image removed.');
      setTimeout(() => setSuccessMessage(null), 2500);
      return;
    }

    const confirmed = window.confirm(
      `Remove this image from "${image.alt_text || 'Product Gallery'}"?\n\nThe underlying media file will remain safely stored in your Central Media Library for future reuse.`
    );
    if (!confirmed) return;

    try {
      await api.deleteAdminProductImage(productId, image.id);
      await loadGallery();
      setSuccessMessage('Image association removed from product gallery.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove image from product.');
    }
  };

  // In-place Metadata Editing
  const startEditing = (img: ProductImage) => {
    setEditingImageId(img.id);
    setEditingAltText(img.alt_text_override || img.alt_text || '');
    setEditingCaption(img.caption_override || img.caption || '');
  };

  const cancelEditing = () => {
    setEditingImageId(null);
  };

  const saveMetadata = async (imageId: string) => {
    setSavingMeta(true);
    try {
      await api.updateAdminProductImage(productId, imageId, {
        alt_text_override: editingAltText,
        caption_override: editingCaption,
      });
      setEditingImageId(null);
      await loadGallery();
      setSuccessMessage('Image alt text and caption saved.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save image metadata.');
    } finally {
      setSavingMeta(false);
    }
  };

  // Replace Image File
  const triggerReplace = (imageId: string) => {
    setReplacingImageId(imageId);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!replacingImageId || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    e.target.value = '';

    try {
      setLoading(true);
      await api.replaceAdminProductImage(productId, replacingImageId, { file });
      await loadGallery();
      setSuccessMessage(`Image replaced with "${file.name}".`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to replace image file.');
    } finally {
      setLoading(false);
      setReplacingImageId(null);
    }
  };

  // Open Media Library Modal
  const openMediaLibraryModal = async () => {
    setLibraryModalOpen(true);
    setLibraryLoading(true);
    try {
      const data = await api.getAdminMedia();
      setLibraryAssets(data);
    } catch (err: any) {
      setError('Failed to fetch media library assets.');
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleAttachFromLibrary = async () => {
    if (!selectedLibraryAssetId) return;

    if (isNew) {
      const asset = libraryAssets.find((a) => a.id === selectedLibraryAssetId);
      if (asset) {
        const nextAssets = [...stagedMediaAssets, asset];
        if (onStagedMediaAssetsChange) onStagedMediaAssetsChange(nextAssets);

        const newDisplay: ProductImage = {
          id: 'staged_asset_' + asset.id,
          product_id: '',
          media_asset_id: asset.id,
          file_url: asset.file_url,
          display_order: images.length + 1,
          is_featured: images.length === 0 ? 1 : 0,
          alt_text: asset.title || asset.original_filename,
          original_filename: asset.original_filename,
        };
        const updated = [...images, newDisplay];
        setImages(updated);
        if (images.length === 0 && onFeaturedImageChanged) {
          onFeaturedImageChanged(asset.file_url);
        }
        setSuccessMessage(`Attached "${asset.title || 'Asset'}" from Media Library.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      setLibraryModalOpen(false);
      setSelectedLibraryAssetId(null);
      return;
    }

    try {
      await api.addAdminProductImage(productId, {
        media_asset_id: selectedLibraryAssetId,
      });
      setLibraryModalOpen(false);
      setSelectedLibraryAssetId(null);
      await loadGallery();
      setSuccessMessage('Media asset attached to product gallery.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to attach media asset.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden file input for Replace action */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleReplaceFileSelected}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="hidden"
      />

      {/* Hidden file input for Multi-upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        className="hidden"
      />

      {/* Alerts */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:text-red-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Product Image Upload Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-gold" />
              <span>Product Image Gallery &amp; Macro Assets</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select multiple authentic ingredient photography files or assign existing assets from the Media Library.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openMediaLibraryModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Choose from Media Library</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New Files</span>
            </button>
          </div>
        </div>

        {/* Staging info banner when isNew */}
        {isNew && (
          <div className="p-3.5 bg-brand-gold/10 border border-brand-gold/30 rounded-lg text-xs text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>
                <strong>One-Go Staging Mode:</strong> Drop or select images now. All staged images ({images.length}) and primary cover will be uploaded and linked automatically when you save.
              </span>
            </div>
            {images.length > 0 && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-gold/20 text-neutral-900 dark:text-brand-gold">
                {images.length} {images.length === 1 ? 'image' : 'images'} staged
              </span>
            )}
          </div>
        )}

        {/* Drag & Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-brand-gold bg-brand-gold/10 scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-brand-gold/60 bg-neutral-50 dark:bg-neutral-800/40'
          }`}
        >
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                Drag and drop product images here, or{' '}
                <span className="text-brand-gold font-semibold underline underline-offset-2">browse files</span>
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Supports multiple file selection · JPEG, PNG, WebP, AVIF up to 10MB each
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Queue Tracker */}
      {uploadQueue.length > 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Upload Queue ({uploadQueue.length})
            </span>
            <button
              onClick={() => setUploadQueue([])}
              className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              Clear Completed
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 text-xs"
              >
                <img src={item.previewUrl} alt="preview" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{item.file.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">{(item.file.size / 1024).toFixed(0)} KB</p>
                  {item.status === 'uploading' && (
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-brand-gold h-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                  {item.status === 'error' && (
                    <p className="text-[10px] text-red-500 truncate mt-0.5">{item.errorMessage}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {item.status === 'uploading' && <Loader2 className="w-4 h-4 text-brand-gold animate-spin" />}
                  {item.status === 'success' && <Check className="w-4 h-4 text-green-500" />}
                  {item.status === 'error' && (
                    <button
                      onClick={() => handleRetryUpload(item)}
                      title="Retry upload"
                      className="p-1 text-brand-gold hover:bg-brand-gold/10 rounded"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDismissQueueItem(item.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Cards & Reordering Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Attached Product Gallery ({images.length} {images.length === 1 ? 'Image' : 'Images'})
            </h4>
            <p className="text-[11px] text-neutral-500">
              The primary image is displayed on the public master catalogue. Use the arrows to reorder gallery displays.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
            <span>Loading gallery records...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center bg-white dark:bg-neutral-900">
            <ImageIcon className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">No images assigned yet</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto mt-1">
              Upload high-resolution macro photography above or select an existing asset from the library to populate the product showcase.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {images.map((img, index) => {
              const isPrimary = img.is_featured === 1 || img.is_featured === true;
              const isEditing = editingImageId === img.id;

              return (
                <div
                  key={img.id}
                  className={`border rounded-lg p-4 bg-white dark:bg-neutral-900 transition-all ${
                    isPrimary
                      ? 'border-brand-gold/70 shadow-sm shadow-brand-gold/5 bg-brand-gold/[0.02]'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Thumbnail & Order Controls */}
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col items-center gap-1 text-neutral-400">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono font-bold text-neutral-500">
                          #{img.display_order || index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === images.length - 1}
                          title="Move Down"
                          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Image Preview */}
                      <div className="relative w-20 h-16 sm:w-28 sm:h-20 rounded bg-neutral-900 overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                        <img src={img.file_url} alt={img.alt_text || 'Product image'} className="w-full h-full object-cover" />
                        {isPrimary && (
                          <div className="absolute top-1 left-1 bg-brand-gold text-neutral-950 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-neutral-950" />
                            <span>Primary</span>
                          </div>
                        )}
                      </div>

                      {/* Image Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                            {img.alt_text || img.original_filename || 'Gallery Image'}
                          </p>
                          {isPrimary && (
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold text-[10px] font-semibold">
                              Catalogue Featured
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5 truncate">
                          {img.original_filename || 'asset.jpg'} ·{' '}
                          {img.width && img.height ? `${img.width}×${img.height} px · ` : ''}
                          {img.file_size ? `${(img.file_size / 1024).toFixed(0)} KB` : ''}
                        </p>

                        {img.caption && (
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 italic mt-1 line-clamp-1">
                            "{img.caption}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(img)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-neutral-950 rounded text-[11px] font-medium transition-colors"
                        >
                          <Star className="w-3 h-3" />
                          <span>Set Primary</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => (isEditing ? cancelEditing() : startEditing(img))}
                        className="px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 rounded text-[11px] text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                      >
                        {isEditing ? 'Cancel Edit' : 'Edit Text'}
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerReplace(img.id)}
                        className="px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 rounded text-[11px] text-neutral-700 dark:text-neutral-300 font-medium transition-colors flex items-center gap-1"
                        title="Upload a new file to replace this image"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Replace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Remove from product gallery"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Metadata Editor */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50/50 dark:bg-neutral-800/30 p-3 rounded">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500 mb-1">
                          Product-Specific Alt Text
                        </label>
                        <input
                          type="text"
                          value={editingAltText}
                          onChange={(e) => setEditingAltText(e.target.value)}
                          placeholder="Descriptive alt text for accessibility & SEO"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-500 mb-1">
                          Optional Caption / Material Study Note
                        </label>
                        <input
                          type="text"
                          value={editingCaption}
                          onChange={(e) => setEditingCaption(e.target.value)}
                          placeholder="e.g. Fine milled 80-100 mesh texture"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveMetadata(img.id)}
                          disabled={savingMeta}
                          className="px-3.5 py-1 bg-brand-gold text-neutral-950 font-semibold text-xs rounded hover:bg-brand-goldLight transition-colors flex items-center gap-1.5"
                        >
                          {savingMeta && <Loader2 className="w-3 h-3 animate-spin" />}
                          <span>Save Text Overrides</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand Guidance Alert */}
      <div className="p-4 border border-brand-gold/30 rounded-lg bg-brand-gold/5 text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-brand-gold">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Authentic Photography Standards</span>
        </div>
        <p>
          SIWI Global Ventures mandates macro still-life photography exploring real ingredient textures. Uploaded images
          are persisted to object storage, verified by mime signature and dimension analysis, and published directly to
          the website without frontend rebuilds.
        </p>
      </div>

      {/* Media Library Picker Modal */}
      {libraryModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Select from Central Media Library
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Reuse existing certified photography assets without duplicating file storage.
                </p>
              </div>
              <button
                onClick={() => setLibraryModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search media library assets by name or title..."
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {libraryLoading ? (
                <div className="py-16 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                  <span>Loading library assets...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryAssets
                    .filter((a) =>
                      librarySearch
                        ? (a.title || a.original_filename || '').toLowerCase().includes(librarySearch.toLowerCase())
                        : true
                    )
                    .map((asset) => {
                      const isSelected = selectedLibraryAssetId === asset.id;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedLibraryAssetId(asset.id)}
                          className={`group cursor-pointer rounded-lg border overflow-hidden transition-all ${
                            isSelected
                              ? 'border-brand-gold ring-2 ring-brand-gold/40 scale-[1.02]'
                              : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                          }`}
                        >
                          <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                            <img src={asset.file_url} alt={asset.alt_text} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-brand-gold text-neutral-950 p-1 rounded-full shadow">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-white dark:bg-neutral-900">
                            <p className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {asset.title || asset.original_filename}
                            </p>
                            <p className="text-[9px] text-neutral-500 font-mono truncate">
                              {asset.original_filename}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500">
                {selectedLibraryAssetId ? '1 asset selected' : 'Click an image to select'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLibraryModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAttachFromLibrary}
                  disabled={!selectedLibraryAssetId}
                  className="px-4 py-1.5 bg-brand-gold text-neutral-950 font-semibold text-xs rounded hover:bg-brand-goldLight transition-colors disabled:opacity-40"
                >
                  Attach to Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
