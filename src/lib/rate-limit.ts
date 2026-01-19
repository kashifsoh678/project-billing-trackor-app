import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;
  /**
   * Time window in seconds
   */
  windowSeconds: number;
  /**
   * Custom identifier function (default: uses IP address)
   */
  identifier?: (req: NextRequest) => string;
}

/**
 * Rate limiter middleware
 * Returns null if request is allowed, or NextResponse with 429 if rate limited
 */
export function rateLimit(config: RateLimitConfig) {
  return (req: NextRequest): NextResponse | null => {
    const identifier = config.identifier
      ? config.identifier(req)
      : getClientIdentifier(req);

    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const key = `${identifier}:${Math.floor(now / windowMs)}`;

    const entry = rateLimitStore.get(key);

    if (!entry) {
      // First request in this window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null;
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(entry.resetTime).toISOString(),
          },
        },
      );
    }

    // Increment counter
    entry.count++;
    return null;
  };
}

/**
 * Get client identifier from request
 * Uses IP address from headers, with fallback to user agent
 */
function getClientIdentifier(req: NextRequest): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  // Combine with user agent for better uniqueness
  const userAgent = req.headers.get("user-agent") || "unknown";

  return `${ip}:${userAgent.substring(0, 50)}`;
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict limit for authentication endpoints
   * 5 requests per 15 minutes
   */
  auth: {
    maxRequests: 5,
    windowSeconds: 15 * 60,
  },
  /**
   * Standard limit for API endpoints
   * 100 requests per minute
   */
  api: {
    maxRequests: 100,
    windowSeconds: 60,
  },
  /**
   * Relaxed limit for read operations
   * 300 requests per minute
   */
  read: {
    maxRequests: 300,
    windowSeconds: 60,
  },
  /**
   * Strict limit for write operations
   * 30 requests per minute
   */
  write: {
    maxRequests: 30,
    windowSeconds: 60,
  },
} as const;
