/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import PinProtection from "@/components/admin/PinProtection";
import ProductsContent from "./ProductsContent";

export default function AdminProductsPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <PinProtection onAuthenticated={login} />;
  }

  return <ProductsContent />;
}
