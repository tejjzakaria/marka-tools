/**
 * @author Zakaria Tejjani
 * @date 2026-09-06
 */

'use client';

import { useTranslations } from 'next-intl';
import { IconPlus, IconTrash, IconX, IconPuzzle } from '@tabler/icons-react';
import IconSelector from './IconSelector';

export interface AddonOptionDraft {
  label: string;
  price: string;
}

export interface AddonDraft {
  id: string;
  title: string;
  icon: string;
  price: string;
  multiple: boolean;
  maxPerOption: string;
  required: boolean;
  options: AddonOptionDraft[];
}

export const emptyAddon = (): AddonDraft => ({
  id: '',
  title: '',
  icon: '',
  price: '',
  multiple: true,
  maxPerOption: '10',
  required: false,
  options: [],
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

/** Convert stored product.addons into editable drafts. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hydrateAddons = (raw: any[]): AddonDraft[] =>
  (raw || []).map((addon) => ({
    id: addon.id || '',
    title: addon.title || '',
    icon: addon.icon || '',
    price: addon.price?.toString() || '',
    multiple: addon.multiple !== undefined ? addon.multiple : true,
    maxPerOption: addon.maxPerOption?.toString() || '10',
    required: !!addon.required,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: (addon.options || []).map((o: any) => ({
      label: o.label || '',
      price: o.price !== undefined && o.price !== null ? o.price.toString() : '',
    })),
  }));

/** Convert drafts into the API payload shape, dropping incomplete rows. */
export const serializeAddons = (drafts: AddonDraft[]) =>
  drafts
    .filter((a) => a.title.trim() !== '' && a.price.trim() !== '')
    .map((a) => ({
      id: (a.id.trim() || slugify(a.title)),
      title: a.title.trim(),
      icon: a.icon,
      price: parseFloat(a.price),
      multiple: a.multiple,
      maxPerOption: parseInt(a.maxPerOption) || 10,
      required: a.required,
      options: a.options
        .filter((o) => o.label.trim() !== '')
        .map((o) => ({
          label: o.label.trim(),
          ...(o.price.trim() !== '' ? { price: parseFloat(o.price) } : {}),
        })),
    }));

interface AddonsEditorProps {
  value: AddonDraft[];
  onChange: (addons: AddonDraft[]) => void;
}

export default function AddonsEditor({ value, onChange }: AddonsEditorProps) {
  const t = useTranslations('admin.addProduct');

  const updateAddon = <K extends keyof AddonDraft>(
    index: number,
    field: K,
    fieldValue: AddonDraft[K]
  ) => {
    const next = [...value];
    next[index] = { ...next[index], [field]: fieldValue };
    onChange(next);
  };

  const updateOption = (
    addonIndex: number,
    optionIndex: number,
    field: keyof AddonOptionDraft,
    fieldValue: string
  ) => {
    const next = [...value];
    const options = [...next[addonIndex].options];
    options[optionIndex] = { ...options[optionIndex], [field]: fieldValue };
    next[addonIndex] = { ...next[addonIndex], options };
    onChange(next);
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
        <IconPuzzle size={20} className="text-primary" />
        {t('addons')}
      </h2>
      <p className="text-sm text-neutral-500 mb-4">{t('addonsHelp')}</p>
      <div className="space-y-4">
        {value.map((addon, index) => (
          <div
            key={index}
            className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-neutral-700">
                {t('addon')} {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
              >
                <IconTrash size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <IconSelector
                  value={addon.icon}
                  onChange={(v) => updateAddon(index, 'icon', v)}
                  placeholder={t('addonIcon')}
                />
              </div>
              <input
                type="text"
                value={addon.title}
                onChange={(e) => updateAddon(index, 'title', e.target.value)}
                className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={t('addonTitle')}
              />
              <input
                type="number"
                value={addon.price}
                onChange={(e) => updateAddon(index, 'price', e.target.value)}
                className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={t('addonPrice')}
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <input
                type="text"
                value={addon.id}
                onChange={(e) => updateAddon(index, 'id', e.target.value)}
                className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                placeholder={t('addonId')}
              />
              <input
                type="number"
                value={addon.maxPerOption}
                onChange={(e) => updateAddon(index, 'maxPerOption', e.target.value)}
                className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder={t('addonMaxPerOption')}
                min="1"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={addon.multiple}
                    onChange={(e) => updateAddon(index, 'multiple', e.target.checked)}
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                  {t('addonAllowMultiple')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={addon.required}
                    onChange={(e) => updateAddon(index, 'required', e.target.checked)}
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                  {t('addonRequired')}
                </label>
              </div>
            </div>

            {/* Options (e.g. colors) */}
            <div className="mt-4 border-t border-neutral-200 pt-3">
              <span className="block text-sm font-medium text-neutral-600 mb-2">
                {t('addonOptions')}
              </span>
              <div className="space-y-2">
                {addon.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) =>
                        updateOption(index, optionIndex, 'label', e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder={t('addonOptionLabel')}
                    />
                    <input
                      type="number"
                      value={option.price}
                      onChange={(e) =>
                        updateOption(index, optionIndex, 'price', e.target.value)
                      }
                      className="w-40 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder={t('addonOptionPrice')}
                      min="0"
                      step="0.01"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateAddon(
                          index,
                          'options',
                          addon.options.filter((_, i) => i !== optionIndex)
                        )
                      }
                      className="p-2.5 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <IconX size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateAddon(index, 'options', [
                      ...addon.options,
                      { label: '', price: '' },
                    ])
                  }
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <IconPlus size={16} />
                  {t('addAddonOption')}
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, emptyAddon()])}
          className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <IconPlus size={18} />
          {t('addAddon')}
        </button>
      </div>
    </section>
  );
}
