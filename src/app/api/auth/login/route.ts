import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/password";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";
import {
  addSecurityHeaders,
  validateRequestSize,
  validateNoSQLInjection,
} from "@/lib/security";
import { Role } from "@prisma/client";

const loginRateLimiter = rateLimit(RateLimitPresets.auth);

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = loginRateLimiter(req);
    if (rateLimitResult) {
      return addSecurityHeaders(rateLimitResult);
    }

    // Validate request size
    const sizeCheck = validateRequestSize(req, 10); // 10KB max for login
    if (sizeCheck) {
      return addSecurityHeaders(sizeCheck);
    }

    const body = await req.json();

    // Check for SQL injection attempts
    const sqlCheck = validateNoSQLInjection(body);
    if (sqlCheck) {
      return addSecurityHeaders(sqlCheck);
    }

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Invalid credentials" }, // Don't reveal validation details
          { status: 400 },
        ),
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Use same error message to prevent user enumeration
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 }),
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid credentials" }, { status: 401 }),
      );
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any, // Prisma enum to app enum
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Login error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "An error occurred during login" },
        { status: 500 },
      ),
    );
  }
}
