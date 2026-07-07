'use client';

import { Link2, Plus, Trash2 } from 'lucide-react';

interface ResourceLinksInputProps {
  value: string[];
  onChange: (links: string[]) => void;
}

export default function ResourceLinksInput({ value, onChange }: ResourceLinksInputProps) {
  function update(index: number, link: string) {
    const next = [...value];
    next[index] = link;

    onChange(next);
  }

  function add() {
    onChange([...value, '']);
  }

  function remove(index: number) {
    if (value.length === 1) {
      onChange(['']);
      return;
    }

    onChange(value.filter((_, i) => i !== index));
  }

  const validLinks = value.filter((link) => link.trim()).length;

  return (
    <div
      className="rounded-3xl border p-4"
      style={{
        borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2
            size={18}
            style={{
              color: 'var(--primary)',
            }}
          />

          <h3 className="font-semibold">Resources</h3>
        </div>

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all hover:scale-[1.03]"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {value.map((link, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="url"
              value={link}
              onChange={(e) => update(index, e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border px-4 py-3 outline-none"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
                background: 'color-mix(in srgb, var(--background) 15%, transparent)',
              }}
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-lg border p-3 transition-colors hover:bg-red-500/10"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
              }}
            >
              <Trash2 size={17} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div
        className="mt-5 rounded-lg border px-4 py-3 text-sm"
        style={{
          borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
          background: 'color-mix(in srgb, var(--background) 12%, transparent)',
          color: 'color-mix(in srgb, var(--foreground) 68%, transparent)',
        }}
      >
        {validLinks} resource
        {validLinks !== 1 ? 's' : ''} attached
      </div>
    </div>
  );
}
