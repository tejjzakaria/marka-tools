/**
 * @author Zakaria Tejjani
 * @date 2025-12-30
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import { getExtensions } from './extensions';
import { Toolbar } from './Toolbar';
import { useAdminFetch } from '@/hooks/useAdminFetch';
import { useTranslations } from 'next-intl';
import './editor.styles.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
}: RichTextEditorProps) {
  const adminFetch = useAdminFetch();
  const t = useTranslations('admin.richTextEditor.imageUpload');

  const editor = useEditor({
    extensions: getExtensions(),
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none focus:outline-none min-h-[150px] px-4 py-3',
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Update editor editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(t('invalidType'));
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(t('tooLarge'));
    }

    // Upload to S3
    const formData = new FormData();
    formData.append('file', file);

    const response = await adminFetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success || !data.fileUrl) {
      throw new Error(t('error'));
    }

    return data.fileUrl;
  }, [adminFetch, t]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden bg-white ${
      disabled ? 'opacity-60 pointer-events-none' : ''
    }`}>
      <Toolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
      {placeholder && !editor.getText() && (
        <div className="absolute top-14 left-4 text-neutral-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
