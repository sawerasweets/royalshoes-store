import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateCart } from "@/lib/cart";
import { generateOrderNumber, formatPKR } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      city,
      shippingAddress,
      deliveryNotes,
      paymentMethod,
      referenceNumber,
      proofImageUrl,
      couponCode,
      items,
    } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !city || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required shipping address fields." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    const validMethods = ["COD", "EASYPAISA", "BANK_TRANSFER"];
    const method = validMethods.includes(paymentMethod) ? paymentMethod : "COD";

    if ((method === "EASYPAISA" || method === "BANK_TRANSFER") && !referenceNumber) {
      return NextResponse.json(
        { success: false, error: "Please provide your transaction reference number (TRX ID)." },
        { status: 400 }
      );
    }

    // 1. Recalculate everything strictly on the server
    const calculation = await calculateCart(items, couponCode);

    if (calculation.errors.length > 0 && calculation.items.length === 0) {
      return NextResponse.json(
        { success: false, error: calculation.errors.join(" ") },
        { status: 400 }
      );
    }

    // 2. Identify authenticated user if any
    const user = await getCurrentUser();

    // 3. Generate unique order number
    const orderNumber = generateOrderNumber();

    // 4. Create Order atomically with Snapshots
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user ? user.id : null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        city: city.trim(),
        shippingAddress: shippingAddress.trim(),
        deliveryNotes: deliveryNotes ? deliveryNotes.trim() : null,
        paymentMethod: method,
        paymentStatus: "PENDING",
        subtotal: calculation.subtotal,
        discount: calculation.discount,
        shippingFee: calculation.shippingFee,
        grandTotal: calculation.grandTotal,
        couponCode: calculation.couponCode || null,
        items: {
          create: calculation.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            productSku: item.sku,
            size: item.size,
            color: item.color,
            price: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            imageUrl: item.imageUrl,
          })),
        },
        payments: {
          create: {
            method,
            amount: calculation.grandTotal,
            referenceNumber: referenceNumber ? referenceNumber.trim() : null,
            proofImageUrl: proofImageUrl || null,
          },
        },
      },
    });

    // 5. Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user ? user.id : null,
        action: "ORDER_CREATED",
        entity: "Order",
        entityId: order.id,
        details: `Order ${orderNumber} placed for ${customerName} (${formatPKR(calculation.grandTotal)}) via ${method}`,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Checkout order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order." },
      { status: 500 }
    );
  }
}
