/**
 * @author Zakaria Tejjani
 * @date 2026-01-03
 */

// Declare fbq function type
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      data?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Track a Lead event (contact forms, newsletter signups, etc.)
 */
export const trackLead = (data?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      currency: "MAD",
      ...data,
    });
  }
};

/**
 * Track InitiateCheckout event (when user starts checkout)
 */
export const trackInitiateCheckout = (data?: {
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  value?: number;
  currency?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      currency: "MAD",
      content_type: "product",
      ...data,
    });
  }
};

/**
 * Track Purchase event (when order is successfully placed)
 */
export const trackPurchase = (data: {
  value: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  content_name?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      currency: "MAD",
      content_type: "product",
      ...data,
    });
  }
};

/**
 * Track AddToCart event
 */
export const trackAddToCart = (data?: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToCart", {
      currency: "MAD",
      content_type: "product",
      ...data,
    });
  }
};

/**
 * Track ViewContent event
 */
export const trackViewContent = (data?: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      currency: "MAD",
      content_type: "product",
      ...data,
    });
  }
};

/**
 * Track custom event
 */
export const trackCustomEvent = (
  eventName: string,
  data?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, data);
  }
};
