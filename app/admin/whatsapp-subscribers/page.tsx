/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */
"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import PinProtection from "@/components/admin/PinProtection";
import WhatsAppSubscribersContent from "./WhatsAppSubscribersContent";

export default function AdminWhatsAppSubscribersPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <PinProtection onAuthenticated={login} />;
  }

  return <WhatsAppSubscribersContent />;
}
