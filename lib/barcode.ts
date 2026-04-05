'use client';

import JsBarcode from 'jsbarcode';

export function generateBarcode(
  element: HTMLCanvasElement | SVGSVGElement,
  value: string,
  format: string = 'CODE128'
) {
  JsBarcode(element, value, {
    format,
    width: 3,
    height: 120,
    displayValue: false,
    margin: 10,
    background: '#ffffff',
    lineColor: '#000000',
  });
}

export function formatCardNumber(number: string): string {
  // Format as phone number if it's 9 digits starting with 5
  if (/^5\d{8}$/.test(number)) {
    return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }
  // Format as phone number with 0 prefix
  if (/^05\d{8}$/.test(number)) {
    return `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`;
  }
  // Format long card numbers in groups of 4
  if (number.length > 8) {
    return number.replace(/(.{4})/g, '$1 ').trim();
  }
  return number;
}

export function validateGeorgianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // 9 digits starting with 5
  if (/^5\d{8}$/.test(cleaned)) return true;
  // With 0 prefix
  if (/^05\d{8}$/.test(cleaned)) return true;
  // With country code
  if (/^9955\d{8}$/.test(cleaned)) return true;
  // With +995
  if (/^\+?9955\d{8}$/.test(cleaned)) return true;
  return false;
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('995') && cleaned.length === 12) {
    return cleaned.slice(3); // Remove country code
  }
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return cleaned.slice(1); // Remove leading 0
  }
  return cleaned;
}
