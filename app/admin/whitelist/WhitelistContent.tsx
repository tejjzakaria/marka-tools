/**
 * @author Zakaria Tejjani
 * @date 2026-05-22
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  IconShieldCheck,
  IconPlus,
  IconTrash,
  IconLoader2,
  IconAlertCircle,
  IconNetwork,
} from '@tabler/icons-react';
import AdminNav from '@/components/admin/AdminNav';
import { useAdminFetch } from '@/hooks/useAdminFetch';

interface WhitelistEntry {
  _id: string;
  ip: string;
  note?: string;
  createdAt: string;
}

export default function WhitelistContent() {
  const t = useTranslations('admin.whitelist');
  const adminFetch = useAdminFetch();

  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ipInput, setIpInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const fetchEntries = async () => {
    try {
      const res = await adminFetch('/api/admin/whitelist');
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to load whitelist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!ipInput.trim()) {
      setFormError(t('ipRequired'));
      return;
    }
    setAdding(true);
    try {
      const res = await adminFetch('/api/admin/whitelist', {
        method: 'POST',
        body: JSON.stringify({ ip: ipInput.trim(), note: noteInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIpInput('');
        setNoteInput('');
        await fetchEntries();
      } else {
        setFormError(data.message);
      }
    } catch {
      setFormError('Failed to add IP');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (entry: WhitelistEntry) => {
    setDeletingId(entry._id);
    try {
      const res = await adminFetch(
        `/api/admin/whitelist?ip=${encodeURIComponent(entry.ip)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success) {
        setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      }
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <AdminNav />

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <IconShieldCheck size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{t('title')}</h1>
            <p className="text-neutral-500">{t('subtitle')}</p>
          </div>
        </div>

        {/* Add IP Form */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">{t('addIp')}</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                {t('ipAddress')} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="192.168.1.1"
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pe-4 ps-10 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <IconNetwork size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                {t('note')}
              </label>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder={t('notePlaceholder')}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {adding ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                <IconPlus size={18} />
              )}
              {adding ? t('adding') : t('addButton')}
            </button>
          </form>
          {formError && (
            <p className="mt-2 flex items-center gap-1 text-sm text-error">
              <IconAlertCircle size={16} />
              {formError}
            </p>
          )}
        </div>

        {/* Entries Table */}
        <div className="rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <IconLoader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 py-16 text-error">
              <IconAlertCircle size={20} />
              {error}
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center text-neutral-500">{t('noEntries')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('ipAddress')}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('note')}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-600">{t('addedAt')}</th>
                    <th className="px-6 py-4 text-sm font-semibold text-neutral-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry._id}
                      className="border-b border-neutral-50 transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-medium text-neutral-900">
                        {entry.ip}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {entry.note || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(entry)}
                          disabled={deletingId === entry._id}
                          className="flex items-center gap-1 rounded-lg bg-error/10 px-3 py-1.5 text-sm font-medium text-error transition-colors hover:bg-error/20 disabled:opacity-50"
                        >
                          {deletingId === entry._id ? (
                            <IconLoader2 size={14} className="animate-spin" />
                          ) : (
                            <IconTrash size={14} />
                          )}
                          {t('deleteButton')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
