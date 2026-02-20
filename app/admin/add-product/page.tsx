/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import PinProtection from '@/components/admin/PinProtection';
import AddProductForm from '@/components/admin/AddProductForm';

export default function AddProductPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <PinProtection onAuthenticated={login} />;
  }

  return <AddProductForm />;
}
