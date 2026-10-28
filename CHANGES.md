# ZeroTrustX — v5.0 redesign

## Design: "Graphite & Signal"

The neon-on-black palette is gone. The console now uses warm graphite neutrals
with muted print-style accents: verdigris for primary, moss for allowed, ochre
for warnings, brick for critical, and plum for AI.

- **One file controls the look.** `src/index.css` re-points Tailwind's colour
  names (`slate`, `cyan`, `emerald`, `rose`…) at CSS variables using
  `@theme inline`. Every existing class picked up the new palette without its
  markup changing.
- **Real light theme.** The neutral ramp inverts under `[data-theme="light"]`,
  so the whole app repaints instantly onto warm paper. `text-white` and the
  hardcoded hex values were tokenised so nothing stays stuck in dark mode.
- **No glow.** 28 neon `shadow-[0_0_…]` halos, the coloured drop shadows and
  all gradient buttons and gradient text were removed. Panels now use one
  `.panel` treatment: a hairline border, a 1px top highlight and real
  elevation.
- **Type with intent.** Instrument Serif for headings and big numbers, Inter
  Tight for the interface, JetBrains Mono for data.
- **New brand mark** (`BrandMark.tsx`), drawn in SVG so it follows the theme.

## Cursor trail (`CursorTrail.tsx`)

- **Dot:** tracks the pointer almost 1:1, so you always know where you are.
- **Ring:** follows on a spring, stretches with speed, and **snaps onto
  buttons**, taking on their size and corner radius.
- **Trail:** a tapering ink stroke drawn on canvas, with a click ripple and
  sparks.
- **Labels:** any element can add `data-cursor-label="…"` and the cursor
  carries that word with it.
- **Cheap when idle:** the render loop stops when nothing is moving, so an
  idle tab draws no frames.
- **Turns itself off** on touch screens, narrow viewports and when the system
  asks for reduced motion. It can also be toggled with the `C` key or in
  Settings.

## New features

- **Command palette (⌘K / Ctrl+K):** fuzzy search with highlighted matches,
  full keyboard control (↑ ↓ ↵), actions alongside records, and your recent
  commands.
- **Keyboard shortcuts:** press `?` for the list. `G` followed by a letter
  jumps to a page.
- **Break-glass containment (Shift+X):** a scoped emergency lockdown. It
  revokes sessions, quarantines untrusted devices and forces re-authentication
  on high-risk accounts. You commit it by holding the control down rather than
  clicking. A banner with a running clock stays up while it's on, and every
  action goes to the audit log.
- **Theme:** dark, light or auto, applied before the first paint so there is
  no flash.
- **Row density:** compact tables (`D`).
- **Pin users and devices** to the sidebar.
- **CSV / JSON export** on the Audit Trail and Security Events pages. Exports
  respect the active filters, escape fields properly and defuse
  formula-injection payloads.
- **Settings → Workspace** for all of the above. These preferences are saved
  in your browser.

## Bugs fixed

- `npm run build` failed because `react-is`, which recharts needs, was not
  installed. It is now in the dependencies.
- The sign-in screen accepted any email and password. It now checks the demo
  account and logs rejected attempts.
- Audit CSV export put fields in quotes but didn't escape quotes inside them,
  so metadata containing a `"` shifted the columns.
- Copilot replies showed raw `**markdown**`.
- The command palette couldn't be driven from the keyboard.
- Dialogs didn't trap focus or return it when they closed.
- The splash screen held the console for 5.1 s on every load. It now takes
  1.5 s, can be skipped, and shows once per session.
- The JavaScript bundle is split into chunks (it was a single 1 MB file).

## Notes

- Fonts load from Google Fonts. If you need the console to work without
  internet access, self-host the fonts. The fallback font stacks are already
  set.
