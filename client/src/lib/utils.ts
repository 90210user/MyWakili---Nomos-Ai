import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in Kenyan Shillings
export function formatCurrency(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

// Validate phone number for M-Pesa (Kenya)
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Basic Kenya phone number validation (Safaricom, Airtel, etc.)
  const regex = /^(?:254|\+254|0)?((?:(?:7(?:(?:[01249][0-9])|(?:5[789])|(?:6[89])))|(?:1(?:[1][0-5])))[0-9]{6})$/;
  return regex.test(phoneNumber);
}

// Format phone number for M-Pesa API (should be 254XXXXXXXXX format)
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Remove non-digit characters
  let digits = phoneNumber.replace(/\D/g, '');
  
  // Handle different formats and convert to 254XXXXXXXXX
  if (digits.startsWith('0') && digits.length === 10) {
    // Convert 07XXXXXXXX to 2547XXXXXXXX
    return '254' + digits.substring(1);
  } else if (digits.startsWith('254') && digits.length === 12) {
    // Already in correct format
    return digits;
  } else if (digits.length === 9 && !digits.startsWith('0')) {
    // Just the 7XXXXXXXX part, add 254
    return '254' + digits;
  }
  
  // Return as is if already formatted or in an unexpected format
  return digits;
}
