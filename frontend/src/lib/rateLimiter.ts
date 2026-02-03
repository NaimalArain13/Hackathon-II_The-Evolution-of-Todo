/**
 * Rate limiting utilities for chat API calls
 * Helps prevent excessive API requests
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitRecord> = new Map();
  private readonly defaultWindowMs: number = 60000; // 1 minute
  private readonly defaultMaxRequests: number = 30;

  /**
   * Check if a request is allowed based on rate limiting rules
   */
  async isAllowed(
    key: string,
    maxRequests: number = this.defaultMaxRequests,
    windowMs: number = this.defaultWindowMs
  ): Promise<boolean> {
    const now = Date.now();
    const record = this.limits.get(key);

    if (!record) {
      // First request from this key
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    // Check if window has expired
    if (now >= record.resetTime) {
      // Reset the counter
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= maxRequests) {
      return false;
    }

    // Increment counter
    this.limits.set(key, {
      count: record.count + 1,
      resetTime: record.resetTime
    });

    return true;
  }

  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string, maxRequests: number = this.defaultMaxRequests): number {
    const record = this.limits.get(key);
    if (!record) {
      return maxRequests;
    }

    const now = Date.now();
    if (now >= record.resetTime) {
      return maxRequests;
    }

    return Math.max(0, maxRequests - record.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number {
    const record = this.limits.get(key);
    return record ? record.resetTime : Date.now() + this.defaultWindowMs;
  }

  /**
   * Clear rate limit for a specific key
   */
  clear(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.limits.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Higher-order function to wrap API calls with rate limiting
 */
export function withRateLimit<T>(
  fn: (...args: any[]) => Promise<T>,
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): (...args: any[]) => Promise<T> {
  return async (...args: any[]): Promise<T> => {
    const allowed = await rateLimiter.isAllowed(key, maxRequests, windowMs);

    if (!allowed) {
      const resetTime = rateLimiter.getResetTime(key);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
    }

    return fn(...args);
  };
}