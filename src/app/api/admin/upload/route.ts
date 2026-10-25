import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { savePersistentFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize admin
    await requireAdmin();

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    // 3. Extract and validate file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Uploaded file is empty." },
        { status: 400 }
      );
    }

    // 4. Save to durable persistent storage
    const result = await savePersistentFile(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      mimeType: result.mimeType,
    });
  } catch (error: any) {
    console.error("Admin upload error:", error);
    const status =
      error.message === "UNAUTHORIZED"
        ? 401
        : error.message === "FORBIDDEN"
        ? 403
        : 400;

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image file.",
      },
      { status: status === 400 && error.message ? 400 : status }
    );
  }
}
