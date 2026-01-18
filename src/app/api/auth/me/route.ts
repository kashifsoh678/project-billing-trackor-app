import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-utils";

export const GET = withAuth(async (_req, user) => {
  try {
    // Fresh user data from DB to ensure role/status is current
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Me Endpoint Error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
});
