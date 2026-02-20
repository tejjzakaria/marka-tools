/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  IconSearch,
  IconLoader2,
  IconPackage,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";
import AdminNav from "@/components/admin/AdminNav";
import { formatPriceSimple } from "@/data/config";
import { categories } from "@/data/categories";
import { useAdminFetch } from "@/hooks/useAdminFetch";

interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categoryId: string;
  badge?: "new" | "sale" | "bestseller";
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku?: string;
  stockCount: number;
  soldCount: number;
  viewersCount: number;
  createdAt: string;
  updatedAt: string;
}

const badgeColors: Record<string, string> = {
  new: "bg-secondary/10 text-secondary",
  sale: "bg-primary/10 text-primary",
  bestseller: "bg-accent/10 text-accent",
};

export default function ProductsContent() {
  const t = useTranslations("admin");
  const tCategories = useTranslations("categories");
  const adminFetch = useAdminFetch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [badgeFilter, setBadgeFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", perPage.toString());
      if (search) params.set("search", search);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (badgeFilter !== "all") params.set("badge", badgeFilter);

      const response = await adminFetch(`/api/admin/products?${params.toString()}`);

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [adminFetch, search, categoryFilter, badgeFilter, currentPage, perPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, badgeFilter]);

  const handleDelete = async (productId: string) => {
    if (!deleteConfirm) return;

    setDeletingId(productId);
    setErrorMessage("");

    try {
      const response = await adminFetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        setDeleteConfirm(null);
      } else {
        setErrorMessage("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {t("nav.products")}
            </h1>
            <p className="text-neutral-600">
              {totalProducts} product{totalProducts !== 1 ? "s" : ""} total
            </p>
          </div>

          <Link
            href="/admin/add-product"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-dark"
          >
            <IconPlus size={20} />
            {t("nav.addProduct")}
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <IconSearch
              size={20}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by name, slug, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-12 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-700 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {tCategories(cat.id)}
                </option>
              ))}
            </select>

            <select
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-700 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Badges</option>
              <option value="new">New</option>
              <option value="sale">Sale</option>
              <option value="bestseller">Bestseller</option>
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
              onClick={fetchProducts}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all hover:bg-neutral-100"
            >
              <IconRefresh size={20} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <IconPackage size={48} className="mx-auto mb-4 text-neutral-300" />
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              No products found
            </h3>
            <p className="mb-4 text-neutral-500">
              Try adjusting your filters or add your first product
            </p>
            <Link
              href="/admin/add-product"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-dark"
            >
              <IconPlus size={20} />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <IconPackage size={48} className="text-neutral-300" />
                    </div>
                  )}

                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute start-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        badgeColors[product.badge]
                      }`}
                    >
                      {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                    </span>
                  )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-error px-4 py-2 font-semibold text-white">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold text-neutral-900">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <IconEye size={14} />
                      {product.soldCount}
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-neutral-500">
                    {tCategories(product.categoryId)}
                  </p>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPriceSimple(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        {formatPriceSimple(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mb-4 flex items-center justify-between text-xs text-neutral-500">
                    <span>Stock: {product.stockCount}</span>
                    <span className="direction-ltr text-left">SKU: {product.sku || "—"}</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100"
                    >
                      <IconEye size={16} />
                      View
                    </Link>

                    <Link
                      href={`/admin/edit-product/${product._id}`}
                      className="flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                    >
                      <IconEdit size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm({id: product._id, name: product.name})}
                      disabled={deletingId === product._id}
                      className="flex items-center justify-center gap-1 rounded-lg bg-error/10 px-3 py-2 text-sm font-medium text-error transition-all hover:bg-error/20 disabled:opacity-50"
                    >
                      {deletingId === product._id ? (
                        <IconLoader2 size={16} className="animate-spin" />
                      ) : (
                        <IconTrash size={16} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-neutral-600">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalProducts)} of {totalProducts} products
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-neutral-900">
              Confirm Delete
            </h3>
            <p className="mb-6 text-neutral-600">
              Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"? This action cannot be undone.
            </p>
            {errorMessage && (
              <div className="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error">
                {errorMessage}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteConfirm(null);
                  setErrorMessage("");
                }}
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
