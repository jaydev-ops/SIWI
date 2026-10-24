import { IStorageProvider } from './types.ts';
import { LocalStorageProvider } from './localStorage.ts';
import { S3StorageProvider } from './s3Storage.ts';

let activeStorage: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
  if (activeStorage) {
    return activeStorage;
  }

  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || 'us-east-1';
  const publicUrl = process.env.S3_PUBLIC_URL;
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';

  if (bucket && accessKeyId && secretAccessKey) {
    console.log(
      `[Storage] Initializing S3 Object Storage Provider (Bucket: ${bucket}, Region: ${region}, Endpoint: ${endpoint || 'AWS Default'})`
    );
    activeStorage = new S3StorageProvider({
      bucket,
      accessKeyId,
      secretAccessKey,
      endpoint,
      region,
      publicUrl,
      forcePathStyle,
    });
  } else {
    console.log(
      '[Storage] S3 credentials not configured. Initializing persistent LocalStorageProvider at storage/uploads.'
    );
    activeStorage = new LocalStorageProvider();
  }

  return activeStorage;
}
