import { NextRequest, NextResponse } from "next/server";
import prisma, { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const products = await prisma.product.findMany({
      include: { images: true, variants: true },
      take: 500,
    });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const {
      name,
      categoryId,
      subcategoryId,
      sku,
      price,
      originalPrice,
      description,
      isPublished,
      isFeatured,
      isNewArrival,
      isBestseller,
      imageUrl,
      variants,
    } = body;

    if (!name || !categoryId || !sku || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Please provide product name, category, SKU, and price." },
        { status: 400 }
      );
    }

    const slug = slugify(name) + "-" + Math.floor(100 + Math.random() * 900);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        subcategoryId: subcategoryId || null,
        sku,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        description: description || "",
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        isBestseller: Boolean(isBestseller),
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Failed to persist product record" },
        { status: 500 }
      );
    }

    if (imageUrl) {
      await pool.query(
        "INSERT INTO product_images (id, productId, url, displayOrder, isPrimary) VALUES (?, ?, ?, 1, TRUE)",
        [`img-${Date.now()}`, product.id, imageUrl]
      );
    }

    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: v.size || "Standard",
            color: v.color || "Standard",
            sku: `${sku}-${v.size || 'STD'}`,
            stock: Number(v.stock || 0),
            additionalPrice: Number(v.additionalPrice || 0),
          },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: product.id,
        details: `Created product "${name}" (SKU: ${sku})`,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id, stockUpdates, imageUrl, stock, ...rawUpdateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (rawUpdateData.name !== undefined) updateData.name = rawUpdateData.name;
    if (rawUpdateData.description !== undefined) updateData.description = rawUpdateData.description;
    if (rawUpdateData.categoryId !== undefined) updateData.categoryId = rawUpdateData.categoryId;
    if (rawUpdateData.subcategoryId !== undefined) updateData.subcategoryId = rawUpdateData.subcategoryId || null;
    if (rawUpdateData.sku !== undefined) updateData.sku = rawUpdateData.sku;
    if (rawUpdateData.price !== undefined) updateData.price = Number(rawUpdateData.price);
    if (rawUpdateData.originalPrice !== undefined) {
      updateData.originalPrice = rawUpdateData.originalPrice ? Number(rawUpdateData.originalPrice) : null;
    }
    if (rawUpdateData.isPublished !== undefined) updateData.isPublished = Boolean(rawUpdateData.isPublished);
    if (rawUpdateData.isFeatured !== undefined) updateData.isFeatured = Boolean(rawUpdateData.isFeatured);
    if (rawUpdateData.isNewArrival !== undefined) updateData.isNewArrival = Boolean(rawUpdateData.isNewArrival);
    if (rawUpdateData.isBestseller !== undefined) updateData.isBestseller = Boolean(rawUpdateData.isBestseller);

    let updated = null;
    if (Object.keys(updateData).length > 0) {
      updated = await prisma.product.update({
        where: { id },
        data: updateData,
      });
    }

    // Update product image if provided
    if (imageUrl) {
      const [existing]: any = await pool.query(
        "SELECT id FROM product_images WHERE productId = ? AND isPrimary = TRUE",
        [id]
      );
      if (existing && existing.length > 0) {
        await pool.query(
          "UPDATE product_images SET url = ? WHERE productId = ? AND isPrimary = TRUE",
          [imageUrl, id]
        );
      } else {
        await pool.query(
          "INSERT INTO product_images (id, productId, url, displayOrder, isPrimary) VALUES (?, ?, ?, 1, TRUE)",
          [`img-${id}-${Date.now()}`, id, imageUrl]
        );
      }
    }

    // Update global stock for product variants if provided
    if (stock !== undefined && stock !== null && stock !== "") {
      await pool.query(
        "UPDATE product_variants SET stock = ? WHERE productId = ?",
        [Number(stock), id]
      );
    }

    // Update specific variant stock if provided
    if (Array.isArray(stockUpdates)) {
      for (const su of stockUpdates) {
        if (su.variantId && su.stock !== undefined) {
          await prisma.productVariant.update({
            where: { id: su.variantId },
            data: { stock: Number(su.stock) },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: id,
        details: `Updated product properties for ID ${id}`,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : error.message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
