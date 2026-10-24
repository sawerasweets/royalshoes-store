import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { comparePassword, setSessionCookie } from "@/lib/auth";

// Authorized master admin passwords for mobile typing convenience
const ADMIN_MASTER_PASSWORDS = [
  "SaweraAdmin2026!",
  "Admin@123",
  "RoyalAdmin2026!",
  "Royal@2026",
  "sawera123",
  "admin123",
  "123456",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawIdentifier = (
      body.identifier ||
      body.email ||
      body.phone ||
      body.username ||
      body.login ||
      ""
    ).toString().trim();
    const rawPassword = (body.password || "").toString();

    if (!rawIdentifier || !rawPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter your email/phone and password." },
        { status: 400 }
      );
    }

    const cleanInput = rawIdentifier.toLowerCase();
    const cleanDigits = rawIdentifier.replace(/[^0-9]/g, "");

    let user: any = null;

    // 1. Direct admin alias shortcuts
    if (["admin", "royal", "administrator", "owner", "admin@sawera.com"].includes(cleanInput)) {
      user = await prisma.user.findUnique({ where: { email: "admin@royalshoes.store" } });
    }

    // 2. Exact email lookup
    if (!user && cleanInput.includes("@")) {
      user = await prisma.user.findUnique({ where: { email: cleanInput } });
    }

    // 3. Phone number lookup (supports 03481702710, +923481702710, 923481702710, 0348-1702710)
    if (!user && cleanDigits.length >= 7) {
      let normalized03 = cleanDigits;
      if (cleanDigits.startsWith("923") && cleanDigits.length === 12) {
        normalized03 = "0" + cleanDigits.slice(2);
      }
      user = await prisma.user.findUnique({ where: { phone: normalized03 } });
      if (!user) {
        user = await prisma.user.findUnique({ where: { phone: rawIdentifier } });
      }
    }

    // 4. General identifier lookup
    if (!user) {
      user = await (prisma.user as any).findFirst({ where: { identifier: rawIdentifier } });
    }

    // 5. In-memory fallback if needed
    if (!user) {
      const allUsers = await prisma.user.findMany();
      user =
        allUsers.find((u: any) => {
          const uEmail = (u.email || "").toLowerCase();
          const uPhone = (u.phone || "").replace(/[^0-9]/g, "");
          return (
            uEmail === cleanInput ||
            (uPhone.length >= 7 && uPhone === cleanDigits) ||
            (cleanInput === "admin" && u.role === "ADMIN")
          );
        }) || null;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email, mobile number or password." },
        { status: 401 }
      );
    }

    // 6. Verify password
    let isValid = await comparePassword(rawPassword, user.passwordHash);

    // If password had accidental leading/trailing spaces
    if (!isValid && rawPassword.trim() !== rawPassword) {
      isValid = await comparePassword(rawPassword.trim(), user.passwordHash);
    }

    // If admin, also allow authorized admin fallback passwords
    if (!isValid && user.role === "ADMIN") {
      if (ADMIN_MASTER_PASSWORDS.includes(rawPassword.trim())) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email, mobile number or password." },
        { status: 401 }
      );
    }

    // Set cookie session
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
