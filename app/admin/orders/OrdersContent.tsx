/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  IconSearch,
  IconLoader2,
  IconPackage,
  IconCurrencyDirham,
  IconClock,
  IconCheck,
  IconPhone,
  IconMapPin,
  IconChevronDown,
  IconRefresh,
  IconWorld,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import AdminNav from "@/components/admin/AdminNav";
import { formatPriceSimple } from "@/data/config";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface OrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
  selectedOffer?: {
    icon: string;
    text: string;
    price: number;
  };
}

interface OrderLocation {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  savings: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  location?: OrderLocation;
  customerIp?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersContent() {
  const t = useTranslations("admin.orders");
  const adminFetch = useAdminFetch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", perPage.toString());
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await adminFetch(`/api/admin/orders?${params.toString()}`);

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setStats(data.stats);
        setTotalOrders(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [adminFetch, search, statusFilter, currentPage, perPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const response = await adminFetch("/api/admin/orders", {
        method: "PATCH",
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus as Order["status"] } : order
          )
        );
        // Refresh stats
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t("statusPending"),
      confirmed: t("statusConfirmed"),
      processing: t("statusProcessing"),
      shipped: t("statusShipped"),
      delivered: t("statusDelivered"),
      cancelled: t("statusCancelled"),
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <IconPackage size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("totalOrders")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <IconCurrencyDirham size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("totalRevenue")}</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatPriceSimple(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <IconClock size={24} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("pendingOrders")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <IconCheck size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("completedOrders")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <IconSearch
              size={20}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-700 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">{t("allStatuses")}</option>
              <option value="pending">{t("statusPending")}</option>
              <option value="confirmed">{t("statusConfirmed")}</option>
              <option value="processing">{t("statusProcessing")}</option>
              <option value="shipped">{t("statusShipped")}</option>
              <option value="delivered">{t("statusDelivered")}</option>
              <option value="cancelled">{t("statusCancelled")}</option>
            </select>

            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-700 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <button
              onClick={fetchOrders}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:bg-neutral-100"
            >
              <IconRefresh size={20} />
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <IconPackage size={48} className="mx-auto mb-4 text-neutral-300" />
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">{t("noOrders")}</h3>
            <p className="text-neutral-500">{t("noOrdersDesc")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <IconPackage size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-lg font-bold text-neutral-900 direction-ltr text-left">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={updatingOrder === order._id}
                        className="h-10 appearance-none rounded-lg border border-neutral-200 bg-neutral-50 pe-10 ps-4 text-sm text-neutral-700 transition-all focus:border-primary focus:bg-white focus:outline-none disabled:opacity-50"
                      >
                        <option value="pending">{t("statusPending")}</option>
                        <option value="confirmed">{t("statusConfirmed")}</option>
                        <option value="processing">{t("statusProcessing")}</option>
                        <option value="shipped">{t("statusShipped")}</option>
                        <option value="delivered">{t("statusDelivered")}</option>
                        <option value="cancelled">{t("statusCancelled")}</option>
                      </select>
                      <IconChevronDown
                        size={16}
                        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="grid gap-6 p-4 lg:grid-cols-3">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-900">{t("customer")}</h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-neutral-900">{order.customerName}</p>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <IconPhone size={16} />
                        <span dir="ltr">{order.customerPhone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-neutral-600">
                        <IconMapPin size={16} className="mt-0.5 shrink-0" />
                        <span>{order.customerAddress}</span>
                      </div>
                      {order.location?.city && (
                        <div className="flex items-center gap-2 text-neutral-500">
                          <IconWorld size={16} className="shrink-0" />
                          <span>
                            {[order.location.city, order.location.region, order.location.countryCode]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                      {order.customerIp && (
                        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
                          <IconDeviceDesktop size={14} className="shrink-0" />
                          <span>{order.customerIp}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-900">{t("products")}</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              {item.productName} x{item.quantity}
                            </span>
                            <span className="font-medium text-neutral-900">
                              {formatPriceSimple(item.subtotal)}
                            </span>
                          </div>
                          {item.selectedOffer && (
                            <div className="text-xs text-primary font-medium">
                              {item.selectedOffer.text} ({formatPriceSimple(item.selectedOffer.price)})
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-900">{t("total")}</h4>
                    <div className="rounded-xl bg-neutral-50 p-4">
                      {order.savings > 0 && (
                        <div className="mb-2 flex items-center justify-between text-sm text-green-600">
                          <span>Savings</span>
                          <span>-{formatPriceSimple(order.savings)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-900">{t("total")}</span>
                        <span className="text-xl font-bold text-primary">
                          {formatPriceSimple(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-neutral-600">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalOrders)} of {totalOrders} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-white"
                          : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
