/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconX, IconSearch, IconPhone, IconPackage, IconTruck, IconCheck, IconClock } from "@tabler/icons-react";
import { useTrackOrder } from "@/context";

interface OrderStatus {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  subtotal: number;
  savings: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  createdAt: string;
  customerAddress: string;
}

export default function TrackOrderModal() {
  const t = useTranslations();
  const { isOpen, closeModal } = useTrackOrder();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrders([]);
    setSelectedOrder(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/track-order?phone=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("trackOrder.notFound"));
        return;
      }

      setOrders(data.orders);
      // If only one order, select it automatically
      if (data.orders.length === 1) {
        setSelectedOrder(data.orders[0]);
      }
    } catch (err) {
      setError(t("trackOrder.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return IconClock;
      case "confirmed":
        return IconCheck;
      case "processing":
        return IconPackage;
      case "shipped":
        return IconTruck;
      case "delivered":
        return IconCheck;
      default:
        return IconClock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-warning bg-warning/10";
      case "confirmed":
        return "text-info bg-info/10";
      case "processing":
        return "text-primary bg-primary/10";
      case "shipped":
        return "text-secondary bg-secondary/10";
      case "delivered":
        return "text-success bg-success/10";
      case "cancelled":
        return "text-error bg-error/10";
      default:
        return "text-neutral-500 bg-neutral-100";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <IconPackage size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {t("trackOrder.title")}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              {t("trackOrder.phoneLabel")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <IconPhone
                  size={20}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t("trackOrder.phonePlaceholder")}
                  required
                  className="w-full rounded-xl border border-neutral-300 py-3 pe-4 ps-10 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&:not(:placeholder-shown)]:direction-ltr [&:not(:placeholder-shown)]:text-left"
                  style={{
                    direction: phoneNumber ? "ltr" : "inherit",
                    textAlign: phoneNumber ? "left" : "inherit",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
              >
                <IconSearch size={20} />
                {loading ? t("trackOrder.searching") : t("trackOrder.search")}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-error/10 p-4 text-error">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Orders List - When multiple orders exist */}
          {orders.length > 1 && !selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-neutral-900">
                  {t("trackOrder.foundOrders", { count: orders.length })}
                </p>
              </div>
              <div className="space-y-3">
                {orders.map((order) => {
                  const Icon = getStatusIcon(order.status);
                  return (
                    <button
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="w-full rounded-xl border border-neutral-200 p-4 text-start transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="direction-ltr text-left mb-1 font-bold text-neutral-900">
                            #{order.orderNumber}
                          </p>
                          <p className="mb-2 text-sm text-neutral-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${getStatusColor(order.status)}`}>
                            <Icon size={16} />
                            <span className="font-medium">
                              {t(`trackOrder.status.${order.status}`)}
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <p className="direction-ltr text-left text-lg font-bold text-primary">
                            {order.total.toFixed(2)} MAD
                          </p>
                          <p className="text-sm text-neutral-600">
                            {order.items.length} {order.items.length === 1 ? t("trackOrder.item") : t("trackOrder.items")}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details */}
          {selectedOrder && (
            <div className="space-y-6">
              {/* Back button - only show if multiple orders */}
              {orders.length > 1 && (
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                  <IconX size={16} className="rotate-180" />
                  {t("trackOrder.backToOrders")}
                </button>
              )}

              {/* Status */}
              <div className="rounded-xl bg-neutral-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {t("trackOrder.orderNumber")}
                    </p>
                    <p className="direction-ltr text-left text-lg font-bold text-neutral-900">
                      #{selectedOrder.orderNumber}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${getStatusColor(selectedOrder.status)}`}>
                    {(() => {
                      const Icon = getStatusIcon(selectedOrder.status);
                      return <Icon size={20} />;
                    })()}
                    <span className="font-semibold">
                      {t(`trackOrder.status.${selectedOrder.status}`)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {t("trackOrder.customerName")}
                    </p>
                    <p className="font-semibold text-neutral-900">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">
                      {t("trackOrder.orderDate")}
                    </p>
                    <p className="font-semibold text-neutral-900">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">
                      {t("trackOrder.total")}
                    </p>
                    <p className="direction-ltr text-left text-lg font-bold text-primary">
                      {selectedOrder.total.toFixed(2)} MAD
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-xl border border-neutral-200 p-6">
                <h3 className="mb-3 font-bold text-neutral-900">
                  {t("trackOrder.deliveryAddress")}
                </h3>
                <p className="text-neutral-700">{selectedOrder.customerAddress}</p>
              </div>

              {/* Order Items */}
              <div className="rounded-xl border border-neutral-200 p-6">
                <h3 className="mb-4 font-bold text-neutral-900">
                  {t("trackOrder.orderItems")}
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {t("trackOrder.quantity")}: {item.quantity}
                        </p>
                      </div>
                      <p className="direction-ltr text-left font-semibold text-neutral-900">
                        {item.subtotal.toFixed(2)} MAD
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="rounded-xl bg-secondary/10 p-6 text-center">
                <p className="mb-2 font-medium text-neutral-900">
                  {t("trackOrder.needHelp")}
                </p>
                <p className="text-sm text-neutral-600">
                  {t("trackOrder.contactSupport")}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {orders.length === 0 && !error && !loading && (
            <div className="py-12 text-center">
              <IconPackage size={64} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-600">
                {t("trackOrder.emptyState")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
