/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  IconBrandWhatsapp,
  IconSearch,
  IconRefresh,
  IconTrash,
  IconLoader2,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconCopy,
} from "@tabler/icons-react";
import AdminNav from "@/components/admin/AdminNav";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface WhatsAppSubscriber {
  _id: string;
  phoneNumber: string;
  status: string;
  subscribedAt: string;
  createdAt: string;
}

export default function WhatsAppSubscribersContent() {
  const adminFetch = useAdminFetch();
  const t = useTranslations("admin.whatsappSubscribers");
  const [subscribers, setSubscribers] = useState<WhatsAppSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, phone: string} | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", perPage.toString());
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await adminFetch(
        `/api/admin/whatsapp-subscribers?${params.toString()}`
      );

      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers);
        setStats(data.stats);
        setTotalSubscribers(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!deleteConfirm) return;

    setDeletingId(id);
    try {
      const response = await adminFetch(
        `/api/admin/whatsapp-subscribers?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubscribers((prev) => prev.filter((sub) => sub._id !== id));
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          active: prev.active - 1,
        }));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const copyPhoneNumber = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber);
  };

  const copyAllNumbers = () => {
    const numbers = subscribers.map((sub) => sub.phoneNumber).join("\n");
    navigator.clipboard.writeText(numbers);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, currentPage, perPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
              <IconBrandWhatsapp size={32} className="text-secondary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">
                {t("title")}
              </h1>
              <p className="text-neutral-600">{t("subtitle")}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-neutral-50 p-4">
              <div className="flex items-center gap-3">
                <IconUsers size={24} className="text-neutral-600" />
                <div>
                  <p className="text-sm text-neutral-600">{t("totalSubscribers")}</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-secondary/10 p-4">
              <div className="flex items-center gap-3">
                <IconUserCheck size={24} className="text-secondary" />
                <div>
                  <p className="text-sm text-neutral-600">{t("activeSubscribers")}</p>
                  <p className="text-2xl font-bold text-secondary">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4">
              <div className="flex items-center gap-3">
                <IconUserX size={24} className="text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-600">{t("unsubscribed")}</p>
                  <p className="text-2xl font-bold text-neutral-400">
                    {stats.unsubscribed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <IconSearch
                size={20}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pe-4 ps-10 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">{t("allStatuses")}</option>
              <option value="active">{t("active")}</option>
              <option value="unsubscribed">{t("unsubscribedStatus")}</option>
            </select>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyAllNumbers}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-secondary/90 disabled:opacity-50"
            >
              <IconCopy size={18} />
              {t("copyAll")}
            </button>
            <button
              onClick={fetchSubscribers}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50"
            >
              <IconRefresh
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              {t("refresh")}
            </button>
          </div>
        </div>

        {/* Subscribers List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <IconBrandWhatsapp
              size={64}
              className="mx-auto mb-4 text-neutral-200"
            />
            <h3 className="mb-2 text-xl font-semibold text-neutral-700">
              {t("noSubscribers")}
            </h3>
            <p className="text-neutral-500">{t("noSubscribersDesc")}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="pb-4 text-start text-sm font-semibold text-neutral-700">
                      {t("phoneNumber")}
                    </th>
                    <th className="pb-4 text-start text-sm font-semibold text-neutral-700">
                      {t("status")}
                    </th>
                    <th className="pb-4 text-start text-sm font-semibold text-neutral-700">
                      {t("subscribedAt")}
                    </th>
                    <th className="pb-4 text-end text-sm font-semibold text-neutral-700">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber._id}
                      className="border-b border-neutral-50 transition-colors hover:bg-neutral-50"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 direction-ltr text-left">
                            {subscriber.phoneNumber}
                          </span>
                          <button
                            onClick={() => copyPhoneNumber(subscriber.phoneNumber)}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                            title="Copy phone number"
                          >
                            <IconCopy size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            subscriber.status === "active"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {subscriber.status === "active"
                            ? t("active")
                            : t("unsubscribedStatus")}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-neutral-600">
                        {formatDate(subscriber.subscribedAt)}
                      </td>
                      <td className="py-4 text-end">
                        <button
                          onClick={() =>
                            setDeleteConfirm({id: subscriber._id, phone: subscriber.phoneNumber})
                          }
                          disabled={deletingId === subscriber._id}
                          className="inline-flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-sm font-medium text-error transition-all hover:bg-error/20 disabled:opacity-50"
                        >
                          {deletingId === subscriber._id ? (
                            <IconLoader2 size={16} className="animate-spin" />
                          ) : (
                            <IconTrash size={16} />
                          )}
                          {t("delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && subscribers.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-neutral-600">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalSubscribers)} of {totalSubscribers} subscribers
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

      {/* Copy Success Toast */}
      {copySuccess && (
        <div className="fixed bottom-8 end-8 z-50 animate-fade-in-up rounded-lg bg-success px-6 py-3 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <IconCopy size={20} />
            <span>Copied {subscribers.length} phone numbers to clipboard!</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-neutral-900">
              Confirm Delete
            </h3>
            <p className="mb-6 text-neutral-600">
              Are you sure you want to delete <strong>{deleteConfirm.phone}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingId === deleteConfirm.id}
                className="flex-1 rounded-lg border-2 border-neutral-200 px-4 py-2 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deletingId === deleteConfirm.id}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-error px-4 py-2 font-semibold text-white transition-colors hover:bg-error/90 disabled:opacity-50"
              >
                {deletingId === deleteConfirm.id ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
