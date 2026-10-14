import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Uploaded images live in Neon Object Storage (S3-compatible), in a public-read bucket, so the site serves them by URL.

function config() {
  const { STORAGE_ENDPOINT: endpoint, STORAGE_REGION: region, STORAGE_BUCKET: bucket, STORAGE_ACCESS_KEY_ID: accessKeyId, STORAGE_SECRET_ACCESS_KEY: secretAccessKey } = process.env;
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) throw new Error("Neon storage is not configured. Set the STORAGE_* variables (see DEPLOYMENT.md).");
  return { endpoint: endpoint.replace(/\/+$/, ""), region, bucket, accessKeyId, secretAccessKey };
}

let client: S3Client | undefined;
function s3() {
  const { endpoint, region, accessKeyId, secretAccessKey } = config();
  // Path-style addressing is required by Neon; checksums only when an operation needs them, for S3-compatible stores.
  client ??= new S3Client({ endpoint, region, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true, requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED" });
  return client;
}

/** Public address of an object in the media bucket. */
export const storageUrl = (key: string) => { const { endpoint, bucket } = config(); return `${endpoint}/${bucket}/${key}`; };

/** The object key for a URL in our bucket, or null for any other URL (such as the site's built-in /images). */
export function storageKey(url: string) {
  try {
    const { endpoint, bucket } = config();
    const prefix = `${endpoint}/${bucket}/`;
    return url.startsWith(prefix) ? url.slice(prefix.length) : null;
  } catch {
    return null;
  }
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  await s3().send(new PutObjectCommand({ Bucket: config().bucket, Key: key, Body: body, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }));
  return storageUrl(key);
}

export async function deleteObject(key: string) {
  await s3().send(new DeleteObjectCommand({ Bucket: config().bucket, Key: key }));
}
