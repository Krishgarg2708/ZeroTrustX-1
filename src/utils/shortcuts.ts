/**
 * One source of truth for keyboard shortcuts.
 *
 * The handler in ShortcutLayer and the cheat sheet in ShortcutHelp both read
 * this list, so a shortcut can never be implemented but undocumented (or
 * documented but unimplemented), which is the usual failure mode.
 */

export interface Shortcut {
  /** Display form, e.g. ['G', 'D'] renders as two chained keys. */
  keys: string[];
  label: string;
  group: 'Navigation' | 'Actions' | 'Appearance' | 'General';
  /** Page id for `g`-prefixed navigation shortcuts. */
  page?: string;
}

/** `g` then a letter — the Gmail/GitHub convention operators already know. */
export const NAV_SEQUENCES: Record<string, { page: string; label: string }> = {
  d: { page: 'dashboard', label: 'Security Overview' },
  c: { page: 'copilot', label: 'SOC Copilot' },
  u: { page: 'users', label: 'Users & IAM' },
  r: { page: 'roles', label: 'Roles & Permissions' },
  q: { page: 'requests', label: 'Access Requests' },
  m: { page: 'mfa', label: 'MFA & Auth' },
  v: { page: 'devices', label: 'Device Trust' },
  p: { page: 'policies', label: 'Policies' },
  k: { page: 'risk', label: 'Risk Analytics' },
  e: { page: 'events', label: 'Security Events' },
  a: { page: 'audit', label: 'Audit Trail' },
  s: { page: 'settings', label: 'Settings' },
};

export const SHORTCUTS: Shortcut[] = [
  ...Object.entries(NAV_SEQUENCES).map(([key, { page, label }]) => ({
    keys: ['G', key.toUpperCase()],
    label,
    group: 'Navigation' as const,
    page,
  })),

  { keys: ['⌘', 'K'], label: 'Command palette', group: 'General' },
  { keys: ['/'], label: 'Jump to search', group: 'General' },
  { keys: ['?'], label: 'This cheat sheet', group: 'General' },
  { keys: ['Esc'], label: 'Close the topmost panel', group: 'General' },

  { keys: ['S'], label: 'Simulate an access decision', group: 'Actions' },
  { keys: ['L'], label: 'Pause / resume telemetry stream', group: 'Actions' },
  { keys: ['A'], label: 'Architecture flow', group: 'Actions' },
  { keys: ['⇧', 'X'], label: 'Break-glass containment', group: 'Actions' },

  { keys: ['T'], label: 'Cycle theme — dark, light, auto', group: 'Appearance' },
  { keys: ['D'], label: 'Toggle row density', group: 'Appearance' },
  { keys: ['C'], label: 'Toggle cursor trail', group: 'Appearance' },
];

export const SHORTCUT_GROUPS: Shortcut['group'][] = [
  'Navigation',
  'Actions',
  'Appearance',
  'General',
];

/** True when the event originated inside something the user is typing into. */
export const isTypingTarget = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    el.isContentEditable === true ||
    el.getAttribute?.('role') === 'textbox'
  );
};
