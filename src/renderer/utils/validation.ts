/**
 * Validation utilities for calculator inputs
 */

/**
 * Validates if a string is a valid number
 */
export function isValidNumber(value: string): boolean {
  if (value === '' || value === '-' || value === '.') return true;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Validates if a string is a valid digit for a given base
 */
export function isValidDigitForBase(digit: string, base: 'binary' | 'octal' | 'decimal' | 'hexadecimal'): boolean {
  const validDigits = {
    binary: /^[01]$/,
    octal: /^[0-7]$/,
    decimal: /^[0-9]$/,
    hexadecimal: /^[0-9A-Fa-f]$/,
  };

  return validDigits[base].test(digit);
}

/**
 * Sanitizes mathematical expressions to prevent injection attacks
 */
export function sanitizeMathExpression(expression: string): string {
  // Remove any potentially dangerous characters
  // Allow: numbers, operators, parentheses, common math functions, spaces
  const sanitized = expression.replace(/[^0-9+\-*/().^\s,a-zA-Z]/g, '');

  // Remove any script-like patterns
  const noScript = sanitized.replace(/<script.*?>.*?<\/script>/gi, '');

  return noScript.trim();
}

/**
 * Validates a mathematical expression for safety
 */
export function isValidMathExpression(expression: string): boolean {
  // Check for basic validity
  if (!expression || expression.length === 0) return false;

  // Check for balanced parentheses
  let parenCount = 0;
  for (const char of expression) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) return false;
  }
  if (parenCount !== 0) return false;

  // Check for valid characters only
  const validPattern = /^[0-9+\-*/().^\s,a-zA-Z]+$/;
  if (!validPattern.test(expression)) return false;

  return true;
}

/**
 * Limits the length of input to prevent performance issues
 */
export function limitInputLength(value: string, maxLength: number = 50): string {
  return value.slice(0, maxLength);
}

/**
 * Validates financial calculation inputs
 */
export function validateFinancialInput(value: number, fieldName: string): { valid: boolean; error?: string } {
  if (isNaN(value) || !isFinite(value)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }

  if (value < 0 && !['years', 'rate'].includes(fieldName.toLowerCase())) {
    return { valid: false, error: `${fieldName} cannot be negative` };
  }

  if (fieldName.toLowerCase() === 'rate' && value > 100) {
    return { valid: false, error: 'Interest rate seems unusually high (>100%)' };
  }

  return { valid: true };
}

/**
 * Validates and formats decimal input
 */
export function validateDecimalInput(value: string): { valid: boolean; formatted?: string } {
  // Remove any non-numeric characters except . and -
  const cleaned = value.replace(/[^\d.-]/g, '');

  // Check for multiple decimal points
  const decimalCount = (cleaned.match(/\./g) || []).length;
  if (decimalCount > 1) return { valid: false };

  // Check for multiple negative signs
  const negativeCount = (cleaned.match(/-/g) || []).length;
  if (negativeCount > 1) return { valid: false };

  // Negative sign must be at the beginning
  if (cleaned.includes('-') && cleaned.indexOf('-') !== 0) return { valid: false };

  return { valid: true, formatted: cleaned };
}

/**
 * Prevents XSS and other injection attacks in user input
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates range for graphing calculator
 */
export function validateGraphRange(min: number, max: number): { valid: boolean; error?: string } {
  if (!isFinite(min) || !isFinite(max)) {
    return { valid: false, error: 'Range values must be finite numbers' };
  }

  if (min >= max) {
    return { valid: false, error: 'Minimum must be less than maximum' };
  }

  if (max - min < 0.001) {
    return { valid: false, error: 'Range is too small' };
  }

  if (Math.abs(max - min) > 1000000) {
    return { valid: false, error: 'Range is too large' };
  }

  return { valid: true };
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
