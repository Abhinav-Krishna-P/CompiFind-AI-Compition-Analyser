'use client'

import { useEffect, useRef } from 'react'

/**
 * Animates a terminal-style typing cursor blink on the headline.
 * Pure CSS via Tailwind — no JS needed for the blink itself, but
 * we use a ref to manage the element visibility after mount.
 */
export function TerminalCursor() {
  return (
    <span
      aria-hidden
      className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.05em] animate-pulse bg-primary align-middle"
    />
  )
}
