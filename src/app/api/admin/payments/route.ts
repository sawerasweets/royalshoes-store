import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const payments = await prisma.payment.findMany({ take: 50 });
    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { paymentId, orderId, status, rejectionReason, notes } = body;

    if (!paymentId || !status) {
      return NextResponse.json({ success: false, error: "Payment ID and status required." }, { status: 400 });
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy: admin.name,
        verifiedAt: new Date(),
        rejectionReason: rejectionReason || null,
        notes: notes || null,
      },
    });

    if (orderId) {
      const orderPaymentStatus = status === "VERIFIED" ? "VERIFIED" : status === "REJECTED" ? "REJECTED" : "PENDING";
      const orderStatus = status === "VERIFIED" ? "CONFIRMED" : undefined;
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: orderPaymentStatus,
          ...(orderStatus ? { status: orderStatus } : {}),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: `PAYMENT_${status}`,
        entity: "Payment",
        entityId: paymentId,
        details: `Payment ${paymentId} for Order ${orderId} marked as ${status} by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
