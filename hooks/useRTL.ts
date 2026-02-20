/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { useLocale } from 'next-intl';

export function useRTL() {
  const locale = useLocale();
  return locale === 'ar';
}
