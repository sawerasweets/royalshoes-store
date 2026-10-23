import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({ take: 100 });
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { orderId, status, paymentStatus, trackingNumber, internalNotes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID required." }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "ORDER_STATUS_UPDATE",
        entity: "Order",
        entityId: orderId,
        details: `Updated by ${admin.name}: status=${status || "unchanged"}, paymentStatus=${paymentStatus || "unchanged"}`,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
