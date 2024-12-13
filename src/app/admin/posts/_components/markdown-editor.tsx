'use client';

import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import './markdown-editor.css';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  label?: string;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  className,
}: MarkdownEditorProps) {
  return (
    <div className={cn('space-y-2', className)} data-color-mode="dark">
      {label && <Label>{label}</Label>}
      <div className="min-h-[500px] border rounded-md">
        <MDEditor
          value={value}
          onChange={onChange}
          preview="live"
          height={500}
          visibleDragbar={false}
          hideToolbar={false}
          enableScroll={true}
          className="w-full"
        />
      </div>
    </div>
  );
} 