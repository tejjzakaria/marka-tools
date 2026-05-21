/**
 * @author Zakaria Tejjani
 * @date 2026-05-22
 */

'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import PinProtection from '@/components/admin/PinProtection';
import WhitelistContent from './WhitelistContent';

export default function WhitelistPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <PinProtection onAuthenticated={login} />;
  }

  return <WhitelistContent />;
}
