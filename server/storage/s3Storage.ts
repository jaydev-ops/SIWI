import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { IStorageProvider, StorageUploadResult } from './types.ts';
import { generateStorageKey } from '../utils/imageUtils.ts';

export interface S3Config {
  endpoint?: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl?: string;
  forcePathStyle?: boolean;
}

export class S3StorageProvider implements IStorageProvider {
  public name = 'S3ObjectStorage';
  public isCloud = true;
  private client: S3Client;
  private bucket: string;
  private publicUrl?: string;
  private region: string;

  constructor(config: S3Config) {
    this.bucket = config.bucket;
    this.publicUrl = config.publicUrl;
    this.region = config.region;

    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint || undefined,
      forcePathStyle: config.forcePathStyle ?? (config.endpoint ? true : false),
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  public async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    customKey?: string
  ): Promise<StorageUploadResult> {
    const storageKey = customKey || generateStorageKey(originalFilename, 'products');

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      Body: fileBuffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await this.client.send(command);

    return {
      storageKey,
      fileUrl: this.getPublicUrl(storageKey),
      originalFilename,
      mimeType,
      fileSize: fileBuffer.length,
    };
  }

  public async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });
      await this.client.send(command);
      return true;
    } catch (err) {
      console.error(`Failed to delete S3 object ${storageKey}:`, err);
      return false;
    }
  }

  public getPublicUrl(storageKey: string): string {
    const cleanKey = storageKey.replace(/^[/\\]+/, '');
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, '')}/${cleanKey}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${cleanKey}`;
  }

  public async fileExists(storageKey: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }
}
