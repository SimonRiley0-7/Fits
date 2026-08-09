import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function resolveGoogleShoppingLink(url: string): Promise<string> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.url;
  } catch {
    return url;
  }
}

export function isGoogleRedirect(url: string): boolean {
  return url.includes('google.com/aclk') || url.includes('googleadservices.com') || url.includes('google.com/shopping');
}

export function getRetailerFromLink(url: string): string {
  if (url.includes('myntra.com')) return 'Myntra';
  if (url.includes('ajio.com')) return 'Ajio';
  if (url.includes('amazon.in') || url.includes('amazon.com')) return 'Amazon';
  if (url.includes('flipkart.com')) return 'Flipkart';
  return 'Retailer';
}
