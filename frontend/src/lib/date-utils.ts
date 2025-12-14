import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date as "MMM d, yyyy" (e.g., "Dec 13, 2025")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Format a date with time as "MMM d, yyyy h:mm a" (e.g., "Dec 13, 2025 3:45 PM")
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format date for input[type="date"] (YYYY-MM-DD)
 */
export function formatInputDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'yyyy-MM-dd');
}

