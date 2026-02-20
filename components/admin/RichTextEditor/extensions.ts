/**
 * @author Zakaria Tejjani
 * @date 2025-12-30
 */

import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

export const getExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc ms-6',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal ms-6',
      },
    },
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right'],
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline hover:text-primary-dark',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
  Image.configure({
    inline: true,
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg my-4',
    },
  }),
];
