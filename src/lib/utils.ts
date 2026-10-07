import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('IDR', 'Rp')
    .trim();
}

export function formatDate(dateString: string, includeTime = true): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  } catch {
    return dateString;
  }
}
