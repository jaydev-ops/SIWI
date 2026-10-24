import fs from 'node:fs';
import path from 'node:path';
import { IStorageProvider, StorageUploadResult } from './types.ts';
import { generateStorageKey } from '../utils/imageUtils.ts';

export class LocalStorageProvider implements IStorageProvider {
  public name = 'LocalPersistentStorage';
  public isCloud = false;
  private baseDir: string;
  private publicUrlPrefix: string;

  constructor(
    storageDir = path.resolve(process.cwd(), 'storage/uploads'),
    publicUrlPrefix = '/api/public/media'
  ) {
    this.baseDir = storageDir;
    this.publicUrlPrefix = publicUrlPrefix;
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public getStoragePath(storageKey: string): string {
    // Sanitize key against directory traversal
    const safeKey = storageKey.replace(/^[/\\]+/, '').split('/').filter(p => p !== '..' && p !== '.').join('/');
    return path.join(this.baseDir, safeKey);
  }

  public async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    customKey?: string
  ): Promise<StorageUploadResult> {
    const storageKey = customKey || generateStorageKey(originalFilename, 'products');
    const targetPath = this.getStoragePath(storageKey);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    await fs.promises.writeFile(targetPath, fileBuffer);

    return {
      storageKey,
      fileUrl: this.getPublicUrl(storageKey),
      originalFilename,
      mimeType,
      fileSize: fileBuffer.length,
    };
  }

  public async deleteFile(storageKey: string): Promise<boolean> {
    const filePath = this.getStoragePath(storageKey);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    } catch (err) {
      console.error(`Failed to delete local storage file ${storageKey}:`, err);
    }
    return false;
  }

  public getPublicUrl(storageKey: string): string {
    const cleanKey = storageKey.replace(/^[/\\]+/, '');
    return `${this.publicUrlPrefix}/${cleanKey}`;
  }

  public async fileExists(storageKey: string): Promise<boolean> {
    const filePath = this.getStoragePath(storageKey);
    return fs.existsSync(filePath);
  }
}
