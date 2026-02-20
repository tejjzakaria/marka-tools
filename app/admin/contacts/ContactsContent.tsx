/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  IconMail,
  IconMailOpened,
  IconSend,
  IconSearch,
  IconRefresh,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import AdminNav from "@/components/admin/AdminNav";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  read: "bg-blue-100 text-blue-700",
  replied: "bg-green-100 text-green-700",
};

export default function ContactsContent() {
  const adminFetch = useAdminFetch();
  const t = useTranslations("admin.contacts");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", perPage.toString());
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await adminFetch(`/api/admin/contacts?${params.toString()}`);

      const data = await response.json();

      if (data.success) {
        setContacts(data.contacts);
        setStats(data.stats);
        setTotalContacts(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }, [adminFetch, search, statusFilter, currentPage, perPage]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const updateStatus = async (contactId: string, newStatus: string) => {
    setUpdatingId(contactId);
    try {
      const response = await adminFetch("/api/admin/contacts", {
        method: "PATCH",
        body: JSON.stringify({
          contactId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchContacts();
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) {
      return;
    }

    setDeletingId(contactId);
    try {
      const response = await adminFetch(`/api/admin/contacts?id=${contactId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchContacts();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setDeletingId(null);
    }
  };

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">{t("title")}</h1>
          <p className="text-neutral-600">{t("subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                <IconMail size={24} className="text-neutral-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("totalMessages")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <IconMail size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("newMessages")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <IconMailOpened size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("readMessages")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.read}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <IconSend size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t("repliedMessages")}</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.replied}</p>
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
              <option value="new">{t("statusNew")}</option>
              <option value="read">{t("statusRead")}</option>
              <option value="replied">{t("statusReplied")}</option>
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
              onClick={fetchContacts}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:bg-neutral-100"
            >
              <IconRefresh size={20} />
            </button>
          </div>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <IconMail size={48} className="mx-auto mb-4 text-neutral-300" />
            <h3 className="mb-2 text-lg font-semibold text-neutral-700">
              {t("noMessages")}
            </h3>
            <p className="text-neutral-500">{t("noMessagesDesc")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Contact Header */}
                <div className="flex items-start justify-between gap-4 p-6">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {contact.name}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[contact.status]}`}
                      >
                        {t(`status${contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}`)}
                      </span>
                    </div>
                    <div className="mb-2 space-y-1 text-sm text-neutral-600">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        <span className="direction-ltr text-left">{contact.email}</span>
                      </p>
                      {contact.phone && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          <span className="direction-ltr text-left">{contact.phone}</span>
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Subject:</span> {contact.subject}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>

                    {/* Message Preview/Full */}
                    <div className="mt-3">
                      <p
                        className={`whitespace-pre-wrap text-sm text-neutral-700 ${
                          expandedId === contact._id ? "" : "line-clamp-2"
                        }`}
                      >
                        {contact.message}
                      </p>
                      {contact.message.length > 100 && (
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === contact._id ? null : contact._id)
                          }
                          className="mt-1 text-sm font-medium text-primary hover:text-primary-dark"
                        >
                          {expandedId === contact._id ? t("showLess") : t("showMore")}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact._id, e.target.value)}
                      disabled={updatingId === contact._id}
                      className="h-10 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value="new">{t("statusNew")}</option>
                      <option value="read">{t("statusRead")}</option>
                      <option value="replied">{t("statusReplied")}</option>
                    </select>

                    <button
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 text-error transition-all hover:bg-error/20 disabled:opacity-50"
                    >
                      {deletingId === contact._id ? (
                        <IconLoader2 size={18} className="animate-spin" />
                      ) : (
                        <IconTrash size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && contacts.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-neutral-600">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalContacts)} of {totalContacts} contacts
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
