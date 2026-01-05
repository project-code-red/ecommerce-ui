import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Get product URL path from product slug and ID
 * Format: /products/{slug}/{productId}
 */
export function getProductUrl(slug: string, productId: string): string {
  // Extract numeric ID from productId (e.g., "prod-83" -> "83")
  const idMatch = productId.match(/prod-(\d+)/);
  const numericId = idMatch ? idMatch[1] : productId;
  return `/products/${slug}/${numericId}`;
}

/**
 * Extract slug from product (remove ID if present)
 * Format: "blue--black-check-shirt-83" -> "blue--black-check-shirt"
 */
export function extractSlugFromProductSlug(fullSlug: string): string {
  // Remove trailing -{number} pattern
  return fullSlug.replace(/-\d+$/, '');
}

