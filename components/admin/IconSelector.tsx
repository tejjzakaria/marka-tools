/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  IconSearch,
  IconX,
  IconChevronDown,
  IconPencil,
  IconCheck,
} from '@tabler/icons-react';
import {
  availableIcons,
  iconCategories,
  getIconByName,
  type IconCategory,
} from '@/data/icons';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function IconSelector({
  value,
  onChange,
  placeholder,
}: IconSelectorProps) {
  const t = useTranslations('admin.addProduct.iconSelector');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>(
    'all'
  );
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualValue, setManualValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredIcons = availableIcons.filter((icon) => {
    const matchesSearch =
      searchQuery === '' ||
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const SelectedIcon = value ? getIconByName(value) : null;

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery('');
    setIsManualMode(false);
  };

  const handleManualSubmit = () => {
    if (manualValue.trim()) {
      onChange(manualValue.trim());
      setIsManualMode(false);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setManualValue('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <div className="w-full flex items-center gap-1">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white flex items-center justify-between gap-2 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {SelectedIcon ? (
              <>
                <SelectedIcon size={20} className="text-primary flex-shrink-0" />
                <span className="truncate text-neutral-700">{value}</span>
              </>
            ) : (
              <span className="text-neutral-400">{placeholder || t('selectIcon')}</span>
            )}
          </div>
          <IconChevronDown
            size={18}
            className={`text-neutral-400 transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 hover:bg-neutral-100 rounded-lg border border-neutral-200"
          >
            <IconX size={16} className="text-neutral-400" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search & Manual Toggle */}
          <div className="p-3 border-b border-neutral-100 space-y-2">
            <div className="relative">
              <IconSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchIcons')}
                className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
            </div>

            {/* Manual Input Toggle */}
            <button
              type="button"
              onClick={() => setIsManualMode(!isManualMode)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isManualMode
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <IconPencil size={16} />
              {t('manualEntry')}
            </button>

            {/* Manual Input Field */}
            {isManualMode && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder={t('manualPlaceholder')}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleManualSubmit();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleManualSubmit}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <IconCheck size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Category Filter */}
          {!isManualMode && (
            <div className="p-2 border-b border-neutral-100 flex gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {t('allCategories')}
              </button>
              {iconCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {t(`categories.${category}`)}
                </button>
              ))}
            </div>
          )}

          {/* Icons Grid */}
          {!isManualMode && (
            <div className="p-2 max-h-64 overflow-y-auto">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 gap-1">
                  {filteredIcons.map((iconOption) => {
                    const IconComponent = iconOption.icon;
                    const isSelected = value === iconOption.name;
                    return (
                      <button
                        key={iconOption.name}
                        type="button"
                        onClick={() => handleSelect(iconOption.name)}
                        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                        }`}
                        title={iconOption.name}
                      >
                        <IconComponent size={22} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  {t('noIconsFound')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
