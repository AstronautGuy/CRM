"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Link as LinkIcon, Table as TableIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Type here...", className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline underline-offset-4",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "min-w-full divide-y divide-gray-200 border border-gray-200 mt-2 mb-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-gray-50 font-medium text-gray-900 px-3 py-2 text-left text-sm",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "whitespace-nowrap px-3 py-2 text-sm text-gray-500 border-t border-gray-200",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[120px] p-4 text-sm",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    if (previousUrl) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("URL");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const ToolbarButton = ({ 
    isActive, 
    onClick, 
    children 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0", isActive && "bg-muted text-foreground")}
      onClick={(e) => { e.preventDefault(); onClick(); }}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("flex flex-col rounded-md border border-input bg-transparent shadow-sm", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b p-1 bg-muted/50 rounded-t-md">
        <ToolbarButton isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        
        <div className="w-[1px] h-4 bg-border mx-1" />
        
        <ToolbarButton isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        
        <div className="w-[1px] h-4 bg-border mx-1" />
        
        <ToolbarButton isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("link")} onClick={toggleLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("table")} onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="bg-background rounded-b-md flex-1 overflow-auto" />
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}} />
    </div>
  );
}
