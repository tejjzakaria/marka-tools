/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { use } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import PinProtection from "@/components/admin/PinProtection";
import EditProductForm from "./EditProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <PinProtection onAuthenticated={login} />;
  }

  return <EditProductForm productId={id} />;
}
