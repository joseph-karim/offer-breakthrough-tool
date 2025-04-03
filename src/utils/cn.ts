/**
 * A simple utility to combine class names
 * This is a replacement for clsx/tailwind-merge that won't cause build issues
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
} 