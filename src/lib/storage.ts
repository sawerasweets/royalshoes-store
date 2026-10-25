import crypto from "crypto";
import { pool } from "@/lib/db";

// Allowed MIME types and corresponding extensions
export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates image buffer magic bytes to ensure file is genuinely an image.
 */
export function validateImageSignature(buffer: Buffer): { isValid: boolean; detectedMime?: string } {
  if (!buffer || buffer.length < 4) {
    return { isValid: false };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, detectedMime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, detectedMime: "image/png" };
  }

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { isValid: true, detectedMime: "image/gif" };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { isValid: true, detectedMime: "image/webp" };
  }

  // SVG: starts with XML or <svg
  const snippet = buffer.slice(0, 1024).toString("utf8").trim().toLowerCase();
  if (snippet.includes("<svg") || snippet.startsWith("<?xml")) {
    return { isValid: true, detectedMime: "image/svg+xml" };
  }

  return { isValid: false };
}

/**
 * Ensures uploaded_files table exists in PostgreSQL.
 */
async function ensureStorageTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.uploaded_files (
        id VARCHAR(100) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        mime_type VARCHAR(100) NOT NULL,
        size_bytes INT NOT NULL,
        data BYTEA NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_uploaded_files_filename ON public.uploaded_files(filename);
    `);
  } catch (err: any) {
    console.error("Storage table init notice:", err.message);
  }
}

/**
 * Saves a file to persistent storage (Supabase Storage if configured, or PostgreSQL durable BYTEA storage).
 */
export async function savePersistentFile(
  buffer: Buffer,
  originalFilename: string,
  providedMimeType?: string
): Promise<{ url: string; filename: string; mimeType: string }> {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds maximum allowed limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
  }

  // Validate file signature to ensure genuine image content
  const sig = validateImageSignature(buffer);
  if (!sig.isValid) {
    throw new Error("Invalid image file. File content does not match any supported image format (JPEG, PNG, WebP, SVG, GIF).");
  }

  const mimeType = sig.detectedMime || providedMimeType || "image/jpeg";
  if (!ALLOWED_MIME_TYPES[mimeType]) {
    throw new Error("Unsupported image format. Allowed formats: JPEG, PNG, WebP, SVG, GIF.");
  }

  const ext = ALLOWED_MIME_TYPES[mimeType] || ".jpg";
  const uniqueId = `prod-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const filename = `${uniqueId}${ext}`;

  // 1. Check if Supabase Storage is configured via environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pddjqenodzettkjdjoof.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (supabaseKey) {
    try {
      const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${filename}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
          "Content-Type": mimeType,
          "x-upsert": "true",
        },
        body: new Uint8Array(buffer),
      });

      if (uploadRes.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`;
        return { url: publicUrl, filename, mimeType };
      } else {
        const errorText = await uploadRes.text();
        console.warn("Supabase Storage upload warning, falling back to durable DB storage:", errorText);
      }
    } catch (e: any) {
      console.warn("Supabase Storage request failed, falling back to durable DB storage:", e.message);
    }
  }

  // 2. Durable Object Storage in Supabase PostgreSQL (100% durable, zero serverless filesystem dependencies)
  await ensureStorageTable();

  await pool.query(
    `INSERT INTO public.uploaded_files (id, filename, mime_type, size_bytes, data)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (filename) DO UPDATE SET data = EXCLUDED.data, size_bytes = EXCLUDED.size_bytes, mime_type = EXCLUDED.mime_type`,
    [uniqueId, filename, mimeType, buffer.length, buffer]
  );

  // Return public URL served by our high-performance streaming API
  const url = `/api/images/${filename}`;
  return { url, filename, mimeType };
}

/**
 * Retrieves a file from persistent storage.
 */
export async function getPersistentFile(
  filename: string
): Promise<{ data: Buffer; mimeType: string } | null> {
  try {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "");
    const [rows]: any = await pool.query(
      "SELECT mime_type, data FROM public.uploaded_files WHERE filename = ? LIMIT 1",
      [cleanFilename]
    );

    if (rows && rows.length > 0) {
      const row = rows[0];
      const data = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data);
      return {
        data,
        mimeType: row.mime_type || "image/jpeg",
      };
    }
  } catch (err: any) {
    console.error("Error retrieving persistent file:", err.message);
  }

  return null;
}
