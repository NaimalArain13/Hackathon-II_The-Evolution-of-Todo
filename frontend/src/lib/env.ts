/**
 * Type-safe environment variable access
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  authSecret: process.env.BETTER_AUTH_SECRET || '',
  authUrl: process.env.BETTER_AUTH_URL || '',
  isDev: process.env.NODE_ENV === 'development',
};

