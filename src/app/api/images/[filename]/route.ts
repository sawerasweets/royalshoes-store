import { NextRequest, NextResponse } from "next/server";
import { getPersistentFile } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    if (!filename) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // 1. Check persistent database storage
    const file = await getPersistentFile(filename);
    if (file) {
      return new NextResponse(new Uint8Array(file.data), {
        status: 200,
        headers: {
          "Content-Type": file.mimeType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": String(file.data.length),
        },
      });
    }

    // 2. Legacy disk fallback if file exists in public/uploads (e.g. local dev)
    const localPath = path.join(process.cwd(), "public", "uploads", filename);
    if (fs.existsSync(localPath)) {
      const data = fs.readFileSync(localPath);
      const ext = path.extname(filename).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
          ? "image/webp"
          : ext === ".svg"
          ? "image/svg+xml"
          : ext === ".gif"
          ? "image/gif"
          : "image/jpeg";

      return new NextResponse(new Uint8Array(data), {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": String(data.length),
        },
      });
    }

    return new NextResponse("Image Not Found", { status: 404 });
  } catch (error: any) {
    console.error("Image serve error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
