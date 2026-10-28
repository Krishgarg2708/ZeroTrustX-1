/**
 * Table export.
 *
 * Audit and event tables are evidence — an operator needs to get them out of
 * the browser and into a ticket. Two formats cover it: CSV for spreadsheets,
 * JSON for anything programmatic.
 */

export type ExportFormat = 'csv' | 'json';

/**
 * RFC 4180 quoting. Escaping matters more than it looks here: audit metadata
 * routinely contains commas and quotes, and a naive join silently corrupts
 * the column alignment of the evidence you are about to attach to a ticket.
 *
 * The leading apostrophe on =, +, - and @ defuses CSV formula injection —
 * a cell like `=HYPERLINK(...)` would otherwise execute on open in Excel.
 */
const csvCell = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  let s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const toCsv = <T extends Record<string, unknown>>(
  rows: T[],
  columns?: { key: keyof T & string; header?: string }[]
): string => {
  if (!rows.length) return '';
  const cols: { key: keyof T & string; header?: string }[] =
    columns ?? (Object.keys(rows[0]) as (keyof T & string)[]).map((key) => ({ key }));
  const header = cols.map((c) => csvCell(c.header ?? c.key)).join(',');
  const body = rows.map((row) => cols.map((c) => csvCell(row[c.key])).join(',')).join('\r\n');
  // The BOM makes Excel open UTF-8 correctly instead of mangling non-ASCII.
  return `﻿${header}\r\n${body}`;
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick; revoking synchronously can cancel the download
  // in some browsers before it has started reading the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const stamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
};

/**
 * Writes `rows` out as a download and returns the filename, so the caller can
 * name it in a toast.
 */
export const exportRows = <T extends Record<string, unknown>>(
  rows: T[],
  options: {
    filename: string;
    format: ExportFormat;
    columns?: { key: keyof T & string; header?: string }[];
    /** Provenance written into the JSON envelope. */
    meta?: Record<string, unknown>;
  }
): string => {
  const name = `${options.filename}-${stamp()}.${options.format}`;

  if (options.format === 'csv') {
    triggerDownload(new Blob([toCsv(rows, options.columns)], { type: 'text/csv;charset=utf-8' }), name);
    return name;
  }

  const envelope = {
    exportedAt: new Date().toISOString(),
    source: 'ZeroTrustX',
    count: rows.length,
    ...options.meta,
    rows,
  };
  triggerDownload(
    new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' }),
    name
  );
  return name;
};
