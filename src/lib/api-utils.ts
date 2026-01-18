import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { hasPermission, Permission } from "@/lib/permissions";
import { Role } from "@/types/enums";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

export type ApiContext = {
  params: Promise<Record<string, string>>;
};

export type AuthHandler = (
  req: NextRequest,
  user: AuthenticatedUser,
  context: ApiContext,
) => Promise<Response>;

/**
 * Higher-order function to wrap API route handlers with authentication and permission checks.
 * Supports Next.js 15+ async params.
 */
export function withAuth(handler: AuthHandler, permission?: Permission) {
  return async (req: NextRequest, context: ApiContext) => {
    try {
      const token = req.cookies.get("auth-token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyToken(token);

      if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user: AuthenticatedUser = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      if (permission && !hasPermission(user.role, permission)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return handler(req, user, context);
    } catch (error) {
      console.error("withAuth Wrapper Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
