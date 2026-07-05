"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  Bold, Italic, Code, Heading2, Heading3,
  Quote, Link as LinkIcon, List, ListOrdered,
  Minus, Eye, EyeOff, Pilcrow,
} from "lucide-react";

interface EditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
}

const C = {
  panel: "#0a1019",
  border: "rgba(76,150,255,0.14)",
  borderStrong: "rgba(76,150,255,0.35)",
  cyan: "#00e5ff",
  text: "#e7edf5",
  muted: "#66768a",
};

// ─── Toolbar button ──────────────────────────────────────────────────────────
function ToolBtn({
  title,
  onClick,
  active,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 rounded transition-colors"
      style={{
        color: active ? C.cyan : C.muted,
        background: active ? "rgba(0,229,255,0.1)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = C.text;
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = C.muted;
      }}
    >
      {children}
    </button>
  );
}

// ─── Main Editor ─────────────────────────────────────────────────────────────
export default function Editor({ name, defaultValue, placeholder, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    syncValue();
  }, []);

  const syncValue = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    if (hiddenRef.current) hiddenRef.current.value = html;
    const text = editorRef.current?.innerText?.trim() ?? "";
    setIsEmpty(text.length === 0);
    onChange?.(html);
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  const insertHR = useCallback(() => {
    document.execCommand("insertHTML", false, "<hr/><p><br/></p>");
    editorRef.current?.focus();
    syncValue();
  }, [syncValue]);

  // Set initial default value
  useEffect(() => {
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue;
      syncValue();
    }
  }, [defaultValue, syncValue]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.addEventListener("input", syncValue);
    return () => el.removeEventListener("input", syncValue);
  }, [syncValue]);

  const tools = [
    { title: "Bold", icon: <Bold size={14} />, cmd: "bold" },
    { title: "Italic", icon: <Italic size={14} />, cmd: "italic" },
    { title: "Inline Code", icon: <Code size={14} />, cmd: "formatBlock", val: "pre" },
    { title: "Heading 2", icon: <Heading2 size={14} />, cmd: "formatBlock", val: "h2" },
    { title: "Heading 3", icon: <Heading3 size={14} />, cmd: "formatBlock", val: "h3" },
    { title: "Paragraph", icon: <Pilcrow size={14} />, cmd: "formatBlock", val: "p" },
    { title: "Blockquote", icon: <Quote size={14} />, cmd: "formatBlock", val: "blockquote" },
    { title: "Bullet List", icon: <List size={14} />, cmd: "insertUnorderedList" },
    { title: "Numbered List", icon: <ListOrdered size={14} />, cmd: "insertOrderedList" },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.border}`, background: C.panel }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b"
        style={{ borderColor: C.border }}
      >
        {tools.map((t) => (
          <ToolBtn
            key={t.title}
            title={t.title}
            onClick={() => exec(t.cmd, t.val)}
          >
            {t.icon}
          </ToolBtn>
        ))}
        <ToolBtn title="Insert Link" onClick={insertLink}>
          <LinkIcon size={14} />
        </ToolBtn>
        <ToolBtn title="Divider" onClick={insertHR}>
          <Minus size={14} />
        </ToolBtn>

        {/* Separator */}
        <div className="flex-1" />

        {/* Preview toggle */}
        <ToolBtn title={preview ? "Edit" : "Preview"} onClick={() => setPreview((v) => !v)}>
          {preview ? <EyeOff size={14} /> : <Eye size={14} />}
        </ToolBtn>
      </div>

      {/* Content area */}
      <div className="relative min-h-[320px]">
        {/* Hidden input for form submission */}
        <input type="hidden" name={name} ref={hiddenRef} />

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!preview}
          suppressContentEditableWarning
          onInput={syncValue}
          className="w-full min-h-[320px] px-6 py-5 outline-none focus:outline-none prose-editor"
          style={{
            color: C.text,
            display: preview ? "none" : "block",
            fontSize: "15px",
            lineHeight: "1.85",
          }}
          data-placeholder={placeholder ?? "Start writing your writeup…"}
        />

        {/* Placeholder */}
        {isEmpty && !preview && (
          <div
            className="absolute top-5 left-6 pointer-events-none select-none text-[15px]"
            style={{ color: C.muted }}
          >
            {placeholder ?? "Start writing your writeup…"}
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div
            className="w-full min-h-[320px] px-6 py-5 prose-render"
            style={{ color: C.text, fontSize: "15px", lineHeight: "1.85" }}
            dangerouslySetInnerHTML={{
              __html: editorRef.current?.innerHTML ?? "<p style='color:#66768a'>Nothing to preview yet.</p>",
            }}
          />
        )}
      </div>

      {/* Editor styles injected inline via a style tag */}
      <style>{`
        .prose-editor h2 { font-size:1.4em; font-weight:700; margin:1.2em 0 0.5em; color:#e7edf5; }
        .prose-editor h3 { font-size:1.15em; font-weight:600; margin:1em 0 0.4em; color:#e7edf5; }
        .prose-editor p  { margin:0.6em 0; }
        .prose-editor blockquote {
          border-left: 3px solid rgba(0,229,255,0.4);
          margin: 1em 0; padding: 0.5em 1em;
          color: #8494a8; font-style: italic;
          background: rgba(0,229,255,0.04); border-radius: 0 8px 8px 0;
        }
        .prose-editor pre, .prose-editor code {
          background: rgba(0,0,0,0.35); border-radius:6px;
          padding: 0.2em 0.5em; font-family: monospace; font-size: 0.88em;
          color:#00e5ff;
        }
        .prose-editor ul  { list-style:disc; padding-left:1.5em; margin:0.5em 0; }
        .prose-editor ol  { list-style:decimal; padding-left:1.5em; margin:0.5em 0; }
        .prose-editor a   { color:#3aa9ff; text-decoration:underline; }
        .prose-editor hr  { border:none; border-top:1px solid rgba(76,150,255,0.2); margin:1.5em 0; }

        .prose-render h2 { font-size:1.4em; font-weight:700; margin:1.2em 0 0.5em; color:#e7edf5; }
        .prose-render h3 { font-size:1.15em; font-weight:600; margin:1em 0 0.4em; color:#e7edf5; }
        .prose-render p  { margin:0.6em 0; }
        .prose-render blockquote {
          border-left: 3px solid rgba(0,229,255,0.4);
          margin: 1em 0; padding: 0.5em 1em;
          color: #8494a8; font-style: italic;
          background: rgba(0,229,255,0.04); border-radius: 0 8px 8px 0;
        }
        .prose-render pre, .prose-render code {
          background: rgba(0,0,0,0.35); border-radius:6px;
          padding: 0.2em 0.5em; font-family: monospace; font-size: 0.88em;
          color:#00e5ff;
        }
        .prose-render ul  { list-style:disc; padding-left:1.5em; margin:0.5em 0; }
        .prose-render ol  { list-style:decimal; padding-left:1.5em; margin:0.5em 0; }
        .prose-render a   { color:#3aa9ff; text-decoration:underline; }
        .prose-render hr  { border:none; border-top:1px solid rgba(76,150,255,0.2); margin:1.5em 0; }
      `}</style>
    </div>
  );
}
