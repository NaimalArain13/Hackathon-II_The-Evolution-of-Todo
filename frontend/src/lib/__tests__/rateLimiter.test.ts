/**
 * Tests for the rate limiter utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimiter, withRateLimit } from '../rateLimiter';

describe('Rate Limiter Tests', () => {
  beforeEach(() => {
    rateLimiter.clearAll();
  });

  it('allows first request', async () => {
    const result = await rateLimiter.isAllowed('test-key');
    expect(result).toBe(true);
  });

  it('respects request limit', async () => {
    const maxRequests = 5;

    // Make maxRequests requests
    for (let i = 0; i < maxRequests; i++) {
      const result = await rateLimiter.isAllowed('test-key', maxRequests, 60000);
      expect(result).toBe(true);
    }

    // Next request should be denied
    const result = await rateLimiter.isAllowed('test-key', maxRequests, 60000);
    expect(result).toBe(false);
  });

  it('resets after window expires', async () => {
    vi.useFakeTimers();

    const key = 'test-key';
    const maxRequests = 2;
    const windowMs = 1000;

    // Make max requests
    for (let i = 0; i < maxRequests; i++) {
      const result = await rateLimiter.isAllowed(key, maxRequests, windowMs);
      expect(result).toBe(true);
    }

    // Next request should be denied
    let result = await rateLimiter.isAllowed(key, maxRequests, windowMs);
    expect(result).toBe(false);

    // Advance time past window
    vi.advanceTimersByTime(windowMs + 1);

    // Now request should be allowed again
    result = await rateLimiter.isAllowed(key, maxRequests, windowMs);
    expect(result).toBe(true);

    vi.useRealTimers();
  });

  it('tracks remaining requests', async () => {
    const maxRequests = 3;
    const key = 'test-key';

    // Start with full allowance
    expect(rateLimiter.getRemainingRequests(key, maxRequests)).toBe(maxRequests);

    // Make one request
    await rateLimiter.isAllowed(key, maxRequests, 60000);
    expect(rateLimiter.getRemainingRequests(key, maxRequests)).toBe(maxRequests - 1);

    // Make another request
    await rateLimiter.isAllowed(key, maxRequests, 60000);
    expect(rateLimiter.getRemainingRequests(key, maxRequests)).toBe(maxRequests - 2);
  });

  it('works with rate-limited function wrapper', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const rateLimitedFn = withRateLimit(mockFn, 'test-key', 1, 60000);

    // First call should work
    const result1 = await rateLimitedFn('arg1', 'arg2');
    expect(result1).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

    // Second call should fail due to rate limit
    await expect(rateLimitedFn('arg3', 'arg4')).rejects.toThrow('Rate limit exceeded');
  });

  it('clears rate limits properly', async () => {
    const key = 'test-key';

    await rateLimiter.isAllowed(key, 1, 60000);
    expect(await rateLimiter.isAllowed(key, 1, 60000)).toBe(false);

    rateLimiter.clear(key);
    expect(await rateLimiter.isAllowed(key, 1, 60000)).toBe(true);
  });
});