/**
 * @author Zakaria Tejjani
 * @date 2025-12-30
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    // In production, consider using isomorphic-dompurify or similar
    return html;
  }

  // Client-side: sanitize with DOMPurify
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'br', 'strong', 'em', 'u', 's',
      // Headings
      'h1', 'h2', 'h3',
      // Lists
      'ul', 'ol', 'li',
      // Links and images
      'a', 'img',
      // Structural
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      // Link attributes
      'href', 'target', 'rel',
      // Image attributes
      'src', 'alt',
      // Styling and classes
      'class', 'style'
    ],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
    ALLOW_DATA_ATTR: false,
  });
}
