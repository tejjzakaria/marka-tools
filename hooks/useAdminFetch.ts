/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { useCallback } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';

/**
 * Hook to make authenticated admin API requests
 * Automatically adds the Authorization header with JWT token
 */
export function useAdminFetch() {
  const { adminToken } = useAdminAuth();

  const adminFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!adminToken) {
      throw new Error('Not authenticated');
    }

    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
      'Authorization': `Bearer ${adminToken}`,
    };

    // Only set Content-Type for JSON requests (not for FormData)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [adminToken]);

  return adminFetch;
}
