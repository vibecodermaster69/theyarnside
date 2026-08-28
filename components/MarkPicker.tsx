"use client";

import React, { useEffect, useRef, useState } from "react";
import { Smile, X } from "lucide-react";
import { MARK_GROUPS, markSrc } from "@/lib/marks";

/**
 * Inserts a `:name:` token at the caret of the field it is attached to, so a
 * mark can be dropped mid-sentence rather than only at the start.
 */
export default function MarkPicker({
  targetRef,
  value,
  onChange,
  label = "Add a mark",
}: {
  targetRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
  value: string;
  onChange: (next: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onClick = (event: MouseEvent) => {
      if (!panel.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const insert = (name: string) => {
    const field = targetRef.current;
    const token = `:${name}:`;
    // Fall back to appending when the field was never focused and has no caret.
    const start = field?.selectionStart ?? value.length;
    const end = field?.selectionEnd ?? value.length;

    const before = value.slice(0, start);
    const after = value.slice(end);
    const spacer = before && !before.endsWith(" ") ? " " : "";
    const trailing = after && !after.startsWith(" ") ? " " : "";
    const next = `${before}${spacer}${token}${trailing}${after}`;
    onChange(next);

    const caret = before.length + spacer.length + token.length + trailing.length;
    window.setTimeout(() => {
      field?.focus();
      field?.setSelectionRange(caret, caret);
    }, 0);
  };

  const term = query.trim().toLowerCase();
  const groups = MARK_GROUPS.map((group) => ({
    ...group,
    marks: term
      ? group.marks.filter((m) => `${m.label} ${m.name}`.toLowerCase().includes(term))
      : group.marks,
  })).filter((group) => group.marks.length);

  return (
    <div className="mark-picker" ref={panel}>
      <button type="button" className="mark-trigger" onClick={() => setOpen((o) => !o)}>
        <Smile size={15} /> {label}
      </button>

      {open && (
        <div className="mark-panel">
          <div className="mark-panel-head">
            <input
              autoFocus
              type="text"
              value={query}
              placeholder="Search marks..."
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
              <X size={15} />
            </button>
          </div>

          <div className="mark-scroll">
            {groups.map((group) => (
              <div className="mark-group" key={group.label}>
                <span className="mark-group-label">{group.label}</span>
                <div className="mark-grid">
                  {group.marks.map((mark) => (
                    <button
                      type="button"
                      key={mark.name}
                      title={mark.label}
                      onClick={() => insert(mark.name)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={markSrc(mark.name)} alt={mark.label} width={30} height={30} style={{ display: "block", width: 30, height: 30, objectFit: "contain" }} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!groups.length && <p className="mark-empty">No marks match “{query.trim()}”.</p>}
          </div>
        </div>
      )}

      <style jsx>{`
        .mark-picker { position: relative; display: inline-flex; }
        .mark-trigger { display: inline-flex; align-items: center; gap: 6px; padding: 6px 11px;
          border: 1px solid rgba(75,58,50,.22); border-radius: 6px; background: #fff;
          font: 700 12px var(--font-lato), sans-serif; color: #4B3A32; cursor: pointer; }
        .mark-trigger:hover { border-color: #E07A69; color: #E07A69; }
        .mark-panel { position: absolute; z-index: 60; top: calc(100% + 8px); right: 0;
          width: 322px; padding: 12px; border: 1px solid rgba(75,58,50,.16); border-radius: 12px;
          background: #fff; box-shadow: 0 16px 40px rgba(75,58,50,.18); }
        .mark-panel-head { display: flex; gap: 8px; margin-bottom: 10px; }
        .mark-panel-head input { flex: 1; min-width: 0; padding: 7px 10px; border: 1px solid rgba(75,58,50,.2);
          border-radius: 6px; font: 400 13px var(--font-lato), sans-serif; }
        .mark-panel-head button { flex: none; width: 30px; border: 1px solid rgba(75,58,50,.2);
          border-radius: 6px; background: #fff; color: #4B3A32; cursor: pointer; }
        .mark-scroll { max-height: 288px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .mark-group { display: flex; flex-direction: column; gap: 7px; }
        .mark-group-label { font: 700 9px var(--font-lato), sans-serif; letter-spacing: .1em;
          text-transform: uppercase; color: rgba(75,58,50,.5); }
        .mark-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .mark-grid button { display: flex; align-items: center; justify-content: center; padding: 4px;
          border: 1px solid transparent; border-radius: 7px; background: transparent; cursor: pointer; }
        .mark-grid button:hover { border-color: rgba(224,122,105,.5); background: rgba(224,122,105,.1); }
        .mark-grid img { display: block; width: 30px; height: 30px; object-fit: contain; }
        .mark-empty { margin: 4px 0; font: 400 13px var(--font-lato), sans-serif; color: rgba(75,58,50,.6); }
      `}</style>
    </div>
  );
}
