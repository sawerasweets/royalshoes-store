import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const variants = await prisma.productVariant.findMany({
      orderBy: { stock: "asc" },
      take: 200,
    });

    const movements = await prisma.inventoryMovement.findMany({
      take: 50,
    });

    const lowStockCount = variants.filter((v) => v.stock <= 3).length;
    const outOfStockCount = variants.filter((v) => v.stock <= 0).length;
    const totalInventoryUnits = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return NextResponse.json({
      success: true,
      variants,
      movements,
      stats: {
        totalVariants: variants.length,
        totalInventoryUnits,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { variantId, stock, reason = "RESTOCK" } = body;

    if (!variantId || typeof stock !== "number") {
      return NextResponse.json({ success: false, error: "Variant ID and numeric stock required." }, { status: 400 });
    }

    const current = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!current) {
      return NextResponse.json({ success: false, error: "Variant not found." }, { status: 404 });
    }

    const diff = stock - current.stock;

    // Update variant stock
    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, stock) },
    });

    // Log movement
    await prisma.inventoryMovement.create({
      data: {
        variantId,
        quantity: diff,
        reason,
        referenceId: `admin-${admin.id}`,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "STOCK_UPDATED",
        entity: "ProductVariant",
        entityId: variantId,
        details: `Stock for variant ${current.sku || variantId} updated from ${current.stock} to ${stock} (${diff >= 0 ? "+" : ""}${diff}) by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
