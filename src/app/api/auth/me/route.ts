import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get user from cookie
    const payload = await getCurrentUser();

    if (!payload) {
      return NextResponse.json(
        { user: null },
        { status: 200 }, // Return 200 with null user essentially means "not logged in" but no error
      );
    }

    // 2. Fetch fresh user data from DB to ensure role/status is current
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        // Exclude password
      },
    });

    if (!user) {
      // Token valid but user deleted?
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me Endpoint Error:", error);
    // Don't leak server errors for auth check, just return null
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
