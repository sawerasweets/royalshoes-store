import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.storeSettings.findUnique();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const updated = await prisma.storeSettings.upsert({
      create: body,
      update: body,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "SETTINGS_UPDATED",
        entity: "StoreSettings",
        details: `Store branding & contact settings updated by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
