export interface StorageUploadResult {
  storageKey: string;
  fileUrl: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export interface IStorageProvider {
  name: string;
  isCloud: boolean;
  uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    customKey?: string
  ): Promise<StorageUploadResult>;
  deleteFile(storageKey: string): Promise<boolean>;
  getPublicUrl(storageKey: string): string;
  fileExists(storageKey: string): Promise<boolean>;
}
