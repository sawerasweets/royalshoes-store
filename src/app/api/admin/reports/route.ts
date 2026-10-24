import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
    const monthStart = todayStart - 30 * 24 * 60 * 60 * 1000;

    let totalRevenue = 0;
    let todaySales = 0;
    let weekSales = 0;
    let monthSales = 0;

    const statusCounts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    const paymentBreakdown: Record<string, { count: number; total: number }> = {
      COD: { count: 0, total: 0 },
      EASYPAISA: { count: 0, total: 0 },
      BANK_TRANSFER: { count: 0, total: 0 },
    };

    // Daily revenue dictionary for last 14 days
    const dailyMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(todayStart - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = {
        date: d.toLocaleDateString("en-PK", { month: "short", day: "numeric" }),
        revenue: 0,
        orders: 0,
      };
    }

    const validOrders = orders.filter((o) => o.status !== "CANCELLED");

    for (const o of orders) {
      const gTotal = Number(o.grandTotal || 0);
      const t = new Date(o.createdAt).getTime();

      // Status
      const st = o.status || "PENDING";
      statusCounts[st] = (statusCounts[st] || 0) + 1;

      if (o.status !== "CANCELLED") {
        totalRevenue += gTotal;

        if (t >= todayStart) todaySales += gTotal;
        if (t >= weekStart) weekSales += gTotal;
        if (t >= monthStart) monthSales += gTotal;

        // Payment
        const pm = o.paymentMethod || "COD";
        if (!paymentBreakdown[pm]) paymentBreakdown[pm] = { count: 0, total: 0 };
        paymentBreakdown[pm].count += 1;
        paymentBreakdown[pm].total += gTotal;

        // Daily
        const dateKey = new Date(o.createdAt).toISOString().split("T")[0];
        if (dailyMap[dateKey]) {
          dailyMap[dateKey].revenue += gTotal;
          dailyMap[dateKey].orders += 1;
        }
      }
    }

    const aov = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    // Aggregate top products
    const productSalesMap: Record<string, { name: string; sku: string; units: number; revenue: number }> = {};

    for (const o of validOrders) {
      if (Array.isArray(o.items)) {
        for (const item of o.items) {
          const key = item.productId || item.productName;
          if (!productSalesMap[key]) {
            productSalesMap[key] = {
              name: item.productName,
              sku: item.productSku || "N/A",
              units: 0,
              revenue: 0,
            };
          }
          productSalesMap[key].units += Number(item.quantity || 1);
          productSalesMap[key].revenue += Number(item.lineTotal || 0);
        }
      }
    }

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        todaySales,
        weekSales,
        monthSales,
        totalOrders: orders.length,
        activeOrders: orders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING").length,
        deliveredOrders: statusCounts.DELIVERED || 0,
        cancelledOrders: statusCounts.CANCELLED || 0,
        aov,
      },
      statusCounts,
      paymentBreakdown,
      salesByDate: Object.values(dailyMap),
      topProducts,
    });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
