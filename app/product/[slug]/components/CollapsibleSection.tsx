/**
 * @author Zakaria Tejjani
 * @date 2026-02-04
 */
"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface CollapsibleSectionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export default function CollapsibleSection({
  title,
  content,
  defaultOpen = false,
  icon: Icon,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-6 text-start"
        type="button"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={20} className="text-primary" />
            </div>
          )}
          <span className="text-lg font-semibold text-neutral-900">
            {title}
          </span>
        </div>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <IconChevronDown size={20} className="text-primary" />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="rich-text-content px-6 pb-6 leading-relaxed text-neutral-600"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
