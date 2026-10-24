import { NextRequest, NextResponse } from "next/server";
import { calculateCart } from "@/lib/cart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const couponCode = typeof body.couponCode === "string" ? body.couponCode : undefined;
    const customerInfo =
      body.customerEmail || body.customerPhone
        ? { email: body.customerEmail, phone: body.customerPhone }
        : undefined;

    const result = await calculateCart(items, couponCode, customerInfo);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to calculate shopping bag.",
      },
      { status: 500 }
    );
  }
}
