import { NextRequest, NextResponse } from "next/server";

/**
 * Security middleware utilities
 */

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  );

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );

  return response;
}

/**
 * Validate request body size
 */
export function validateRequestSize(
  req: NextRequest,
  maxSizeKB: number = 100,
): NextResponse | null {
  const contentLength = req.headers.get("content-length");

  if (contentLength) {
    const sizeKB = parseInt(contentLength) / 1024;
    if (sizeKB > maxSizeKB) {
      return NextResponse.json(
        { error: `Request body too large. Maximum size is ${maxSizeKB}KB.` },
        { status: 413 },
      );
    }
  }

  return null;
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate and sanitize object inputs
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      // Only sanitize string fields that might be displayed (notes, names, etc.)
      // Don't sanitize passwords, tokens, etc.
      if (
        !key.toLowerCase().includes("password") &&
        !key.toLowerCase().includes("token") &&
        !key.toLowerCase().includes("secret")
      ) {
        sanitized[key] = sanitizeString(value) as any;
      }
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      sanitized[key] = sanitizeObject(value);
    }
  }

  return sanitized;
}

/**
 * Check for SQL injection patterns
 * Note: Prisma already prevents SQL injection, but this adds an extra layer
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(UNION.*SELECT)/i,
    /(--|\#|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate input against SQL injection
 */
export function validateNoSQLInjection(data: any): NextResponse | null {
  const checkValue = (value: any): boolean => {
    if (typeof value === "string") {
      return detectSQLInjection(value);
    } else if (typeof value === "object" && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  if (checkValue(data)) {
    return NextResponse.json(
      { error: "Invalid input detected." },
      { status: 400 },
    );
  }

  return null;
}

/**
 * CORS configuration
 */
export function addCORSHeaders(
  response: NextResponse,
  origin?: string,
): NextResponse {
  // In production, specify exact origins
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "https://project-billing-trackor-app.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (process.env.NODE_ENV === "development") {
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}
