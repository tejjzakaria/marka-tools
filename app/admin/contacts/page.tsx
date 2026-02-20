/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import PinProtection from '@/components/admin/PinProtection';
import ContactsContent from './ContactsContent';

export default function ContactsPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <PinProtection onAuthenticated={login} />;
  }

  return <ContactsContent />;
}
