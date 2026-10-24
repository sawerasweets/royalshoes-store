import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [coupons, usages] = await Promise.all([
      prisma.coupon.findMany(),
      prisma.couponUsage.findMany({ take: 100 }),
    ]);

    const stats = {
      totalCodes: coupons.length,
      activeCodes: coupons.filter((c) => c.isActive).length,
      totalTimesUsed: coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0),
      totalDiscountGiven: usages.reduce((sum, u) => sum + (u.discountAmount || 0), 0),
    };

    return NextResponse.json({
      success: true,
      coupons,
      usages,
      stats,
    });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const code = (body.code || "").toUpperCase().trim().replace(/[^A-Z0-9_-]/g, "");
    if (!code || code.length < 2) {
      return NextResponse.json({ success: false, error: "Promo code must be at least 2 characters alphanumeric." }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ success: false, error: `Promo code "${code}" already exists.` }, { status: 400 });
    }

    const discountType = body.discountType || "PERCENTAGE";
    if (!["PERCENTAGE", "FIXED", "FREE_SHIPPING"].includes(discountType)) {
      return NextResponse.json({ success: false, error: "Invalid discount type." }, { status: 400 });
    }

    let discountPercent: number | null = null;
    let discountAmount: number | null = null;

    if (discountType === "PERCENTAGE") {
      discountPercent = Number(body.discountPercent);
      if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
        return NextResponse.json({ success: false, error: "Discount percent must be between 1 and 100." }, { status: 400 });
      }
    } else if (discountType === "FIXED") {
      discountAmount = Number(body.discountAmount);
      if (isNaN(discountAmount) || discountAmount <= 0) {
        return NextResponse.json({ success: false, error: "Discount amount must be greater than 0 PKR." }, { status: 400 });
      }
    }

    const minOrderAmount = Number(body.minOrderAmount) || 0;
    const maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : null;
    const usageLimit = body.usageLimit ? Number(body.usageLimit) : null;
    const perCustomerLimit = body.perCustomerLimit != null ? Math.max(1, Number(body.perCustomerLimit)) : 1;
    const description = body.description?.trim() || null;
    const isActive = body.isActive !== false;
    const endDate = body.expiresAt || body.endDate ? new Date(body.expiresAt || body.endDate) : null;

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountPercent,
        discountAmount,
        minOrderAmount,
        maxDiscount,
        usageLimit,
        perCustomerLimit,
        description,
        isActive,
        endDate,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PROMO_CODE_CREATED",
        entity: "Coupon",
        entityId: newCoupon?.id,
        details: `Created VIP promo code ${code} (${discountType}) by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit === null ? null : Number(body.usageLimit);
    if (body.perCustomerLimit !== undefined) updateData.perCustomerLimit = Number(body.perCustomerLimit);
    if (body.minOrderAmount !== undefined) updateData.minOrderAmount = Number(body.minOrderAmount);
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount === null ? null : Number(body.maxDiscount);
    if (body.description !== undefined) updateData.description = body.description;
    if (body.expiresAt !== undefined || body.endDate !== undefined) {
      const d = body.expiresAt || body.endDate;
      updateData.endDate = d ? new Date(d) : null;
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PROMO_CODE_UPDATED",
        entity: "Coupon",
        entityId: id,
        details: `Updated VIP promo code ${updated?.code || id} by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required." }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Coupon not found." }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PROMO_CODE_DELETED",
        entity: "Coupon",
        entityId: id,
        details: `Deleted VIP promo code ${existing.code} by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true, deletedCode: existing.code });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
