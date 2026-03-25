/**
 * Strict VIT-AP Student Email Validation
 * Format: name.regno@vitapstudent.ac.in
 */

export const VITAP_EMAIL_REGEX = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@vitapstudent.ac.in$/;

/**
 * Normalizes email input by trimming, lowercasing, and fixing common typos.
 */
export function normalizeEmail(email: string): string {
    if (!email) return '';

    return email
        .trim()
        .toLowerCase()
        .replace(/\.@/g, '@') // Auto-fix trailing dot before @
        .replace(/\s+/g, '');  // Remove any internal spaces
}

/**
 * Validates if the email follows the strict VIT-AP student format.
 */
export function isVitapEmail(email: string): boolean {
    const normalized = normalizeEmail(email);

    // Check for basic existence
    if (!normalized) return false;

    // Check for consecutive dots (regex already handles [a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*, 
    // but we can be explicit if needed. The current regex handles it.)

    return VITAP_EMAIL_REGEX.test(normalized);
}
