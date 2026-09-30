# Rivalyze — Design System

## Design Direction

**Product domain:** Competitive intelligence SaaS — automated scraping of news, social, Reddit, and X for market rivals.

**Reference products:** Crayon (broad intel, noisy UI), Klue (card-based battlecards), Kompyte (automation-forward). Rivalyze is sharper and more data-dense than all three — closer to a trading terminal than a marketing tool.

**Mood:** Dark. Precise. Authoritative. No decoration. Every pixel earns its place by communicating data.

**Core principles:**
1. Data first — chrome (UI structure) is always subordinate to content
2. Dark is the default and primary mode — `class="dark"` on `<html>`; light mode is secondary
3. Density over whitespace — 4px base unit, tight spacing on data rows
4. Color is semantic — never decorative

---

## Typography

| Role | Font | Class | Sizes |
|------|------|-------|-------|
| Page titles, section headers | Space Grotesk | `font-display` | `text-2xl` / `text-3xl`, `font-semibold` |
| UI labels, body, nav items | IBM Plex Sans | `font-sans` | `text-sm` default, `text-xs` for dense tables |
| Timestamps, IDs, cron expressions, raw values | IBM Plex Mono | `font-mono` | `text-xs` / `text-sm` |

---

## Color Palette

**Brand primary:** `oklch(0.64 0.19 212)` — electric teal-blue (`--primary`)
**Accent:** `oklch(0.68 0.16 196)` — cyan teal (`--accent`)
**Destructive:** `oklch(0.60 0.22 25)` — red-orange (`--destructive`)
**Background stack:** `--sidebar` → `--background` → `--card` → `--popover` (dark to light)

---

## App Shell

**Sidebar:**
- Width: `256px` (w-64) — fixed, non-collapsible on desktop
- Background: `bg-sidebar` — deepest navy layer (`oklch(0.08 0.018 258)`)
- Border right: `border-r border-sidebar-border`
- Logo area: `h-14`, `font-display font-semibold text-lg`, primary color for brand mark
- Nav items: `text-sm font-sans`, active state uses `bg-sidebar-accent text-sidebar-accent-foreground`
- Section labels: `text-xs font-mono uppercase tracking-widest text-muted-foreground`

**Top header (within content area):**
- Height: `h-14`
- Background: `bg-background` — matches page, NOT card
- Border bottom: `border-b border-border`
- Contains: page title (`font-display text-lg font-semibold`) + actions (right-aligned)

**Main content:**
- Padding: `p-6` on outer container
- Max width: unconstrained (fills available width — data tables need full width)
- Base unit: `4px` — spacing steps are `gap-1` (4px), `gap-2` (8px), `gap-4` (16px), `gap-6` (24px)

---

## Surface Hierarchy (dark mode, dark → light)

| Level | Token | Usage |
|-------|-------|-------|
| 0 — Deepest | `--sidebar` | Sidebar background |
| 1 — Page | `--background` | Main content area background |
| 2 — Card | `--card` | Data cards, table containers, stat panels |
| 3 — Elevated | `--popover` | Dropdowns, modals, tooltips, command palette |
| 4 — Input | `--input` | Text inputs, select triggers, search bars |

---

## Component Styling

**Cards:**
- `bg-card border border-border rounded-md`
- Header: `px-5 py-4 border-b border-border`
- Body: `px-5 py-4`
- No shadow — border alone defines separation on dark backgrounds

**Data tables:**
- Header row: `bg-muted text-muted-foreground text-xs font-mono uppercase tracking-wide`
- Row: `border-b border-border hover:bg-muted/40 transition-colors`
- Cell padding: `px-4 py-2.5`

**Source type badges:**
Apply as inline `<span>` with `rounded-sm px-1.5 py-0.5 text-xs font-mono font-medium`:
- **News** — `bg-[--badge-news] text-[--badge-news-fg]`
- **Reddit** — `bg-[--badge-reddit] text-[--badge-reddit-fg]`
- **X / Twitter** — `bg-[--badge-x] text-[--badge-x-fg]`
- **Social** — `bg-[--badge-social] text-[--badge-social-fg]`

**Automation status indicators:**
Apply as `<span>` with a leading dot `●` + label, `text-xs font-medium`:
- **Active** — `bg-[--status-active] text-[--status-active-fg]`
- **Paused** — `bg-[--status-paused] text-[--status-paused-fg]`
- **Running** — `bg-[--status-running] text-[--status-running-fg]` (pulse animation via `animate-pulse`)
- **Failed** — `bg-[--status-failed] text-[--status-failed-fg]`

Badge shape for status: `rounded-full px-2 py-0.5 text-xs`

**Buttons:**
- Primary: `bg-primary text-primary-foreground hover:bg-primary/90`
- Outline: `border border-border bg-transparent hover:bg-muted`
- Ghost (sidebar nav): `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`
- Destructive: `bg-destructive text-destructive-foreground`
- All buttons: `font-sans font-medium text-sm`

**Inputs / Selects:**
- `bg-input border border-border rounded-md text-sm`
- Focus: `ring-2 ring-ring`
- Placeholder: `text-muted-foreground`

**Region selector:**
- Rendered as a segmented `ToggleGroup` or `Select`
- Active region chip: `bg-primary/15 text-primary border border-primary/30 rounded-sm`
- Inactive: `bg-muted text-muted-foreground`

**Cron / schedule display:**
- Always `font-mono text-xs text-muted-foreground`
- Human-readable translation beside it: `font-sans text-xs text-foreground`

---

## Landing Page (public)

- Full-width, dark background (`bg-background`)
- Hero section: centered, `font-display` headline at `text-5xl font-bold`
- Accent highlights on key words: `text-primary`
- CTA button: primary variant, large (`h-11 px-6`)
- No gradients — use `border border-border/50` to define sections

## Login Page

- Centered card on `bg-background`
- Card: `max-w-sm w-full bg-card border border-border rounded-md p-8`
- "Invite only" notice: `text-xs text-muted-foreground font-mono` below the form
- No sign-up link
