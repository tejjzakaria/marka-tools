/**
 * @author Zakaria Tejjani
 * @date 2025-12-30
 */

'use client';

import { Editor } from '@tiptap/react';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconLink,
  IconPhoto,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconClearFormatting,
  IconUnlink,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

interface ToolbarProps {
  editor: Editor;
  onImageUpload: (file: File) => Promise<string>;
}

export function Toolbar({ editor, onImageUpload }: ToolbarProps) {
  const t = useTranslations('admin.richTextEditor.toolbar');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const setHeading = useCallback((level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const setAlignment = useCallback((align: 'left' | 'center' | 'right') => {
    editor.chain().focus().setTextAlign(align).run();
  }, [editor]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const openLinkDialog = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setIsLinkDialogOpen(true);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setIsLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor]);

  const undo = useCallback(() => {
    editor.chain().focus().undo().run();
  }, [editor]);

  const redo = useCallback(() => {
    editor.chain().focus().redo().run();
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    title,
    children
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-neutral-100 transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'text-neutral-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="w-px h-6 bg-neutral-200" />
  );

  return (
    <div className="border-b border-neutral-200 bg-neutral-50 p-2">
      <div className="flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={toggleBold}
          active={editor.isActive('bold')}
          title={t('bold')}
        >
          <IconBold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleItalic}
          active={editor.isActive('italic')}
          title={t('italic')}
        >
          <IconItalic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleUnderline}
          active={editor.isActive('underline')}
          title={t('underline')}
        >
          <IconUnderline size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleStrike}
          active={editor.isActive('strike')}
          title={t('strike')}
        >
          <IconStrikethrough size={18} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => setHeading(1)}
          active={editor.isActive('heading', { level: 1 })}
          title={t('heading1')}
        >
          <IconH1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setHeading(2)}
          active={editor.isActive('heading', { level: 2 })}
          title={t('heading2')}
        >
          <IconH2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setHeading(3)}
          active={editor.isActive('heading', { level: 3 })}
          title={t('heading3')}
        >
          <IconH3 size={18} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={toggleBulletList}
          active={editor.isActive('bulletList')}
          title={t('bulletList')}
        >
          <IconList size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleOrderedList}
          active={editor.isActive('orderedList')}
          title={t('orderedList')}
        >
          <IconListNumbers size={18} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => setAlignment('left')}
          active={editor.isActive({ textAlign: 'left' })}
          title={t('alignLeft')}
        >
          <IconAlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setAlignment('center')}
          active={editor.isActive({ textAlign: 'center' })}
          title={t('alignCenter')}
        >
          <IconAlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setAlignment('right')}
          active={editor.isActive({ textAlign: 'right' })}
          title={t('alignRight')}
        >
          <IconAlignRight size={18} />
        </ToolbarButton>

        <Divider />

        {/* Media */}
        <ToolbarButton
          onClick={handleImageUpload}
          title={t('image')}
        >
          <IconPhoto size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={openLinkDialog}
          active={editor.isActive('link')}
          title={t('link')}
        >
          <IconLink size={18} />
        </ToolbarButton>

        <Divider />

        {/* Utilities */}
        <ToolbarButton
          onClick={undo}
          disabled={!editor.can().undo()}
          title={t('undo')}
        >
          <IconArrowBackUp size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={redo}
          disabled={!editor.can().redo()}
          title={t('redo')}
        >
          <IconArrowForwardUp size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={clearFormatting}
          title={t('clearFormat')}
        >
          <IconClearFormatting size={18} />
        </ToolbarButton>
      </div>

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="mt-2 p-3 bg-white border border-neutral-200 rounded-lg">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 border border-neutral-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  saveLink();
                } else if (e.key === 'Escape') {
                  setIsLinkDialogOpen(false);
                  setLinkUrl('');
                }
              }}
            />
            <button
              type="button"
              onClick={saveLink}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              {t('save')}
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={removeLink}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors"
                title={t('removeLink')}
              >
                <IconUnlink size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsLinkDialogOpen(false);
                setLinkUrl('');
              }}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
