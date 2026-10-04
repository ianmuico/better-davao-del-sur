"use client"

import { useEffect, useRef, useState } from "react"

import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
  useItemIndex,
  useSequence,
} from "@/components/ui/terminal"
import { cn } from "@/lib/utils"

const LGUS = [
  "Digos City",
  "Bansalan",
  "Hagonoy",
  "Kiblawan",
  "Magsaysay",
  "Malalag",
  "Matanao",
  "Padada",
  "Santa Cruz",
  "Sulop",
]

const OPTIONS = [
  { label: "Visit BetterGov.ph", href: "https://bettergov.ph/" },
  { label: "Join Discord", note: "coming soon" },
]

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

function Spinner() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const interval = setInterval(
      () => setFrame((current) => (current + 1) % SPINNER_FRAMES.length),
      80
    )
    return () => clearInterval(interval)
  }, [])

  return (
    <span aria-hidden className="inline-block w-[1ch] text-amber-600">
      {SPINNER_FRAMES[frame]}
    </span>
  )
}

function Menu() {
  const sequence = useSequence()
  const itemIndex = useItemIndex()
  const ready =
    sequence === null ||
    itemIndex === null ||
    (sequence.sequenceStarted && sequence.activeIndex >= itemIndex)

  const [selected, setSelected] = useState(0)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (!ready) return

    const move = (step: number) => {
      const next = (selected + step + OPTIONS.length) % OPTIONS.length
      // Keep keyboard focus on the highlighted row if it is already in the menu.
      if (itemRefs.current.includes(document.activeElement as HTMLElement)) {
        itemRefs.current[next]?.focus()
      }
      setSelected(next)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      switch (event.key) {
        case "ArrowDown":
        case "j":
          event.preventDefault()
          move(1)
          break
        case "ArrowUp":
        case "k":
          event.preventDefault()
          move(-1)
          break
        case "Enter":
          // A focused link or button already handles Enter itself.
          if ((event.target as HTMLElement).closest("a, button")) return
          itemRefs.current[selected]?.click()
          break
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [ready, selected])

  return (
    <div
      inert={!ready}
      className={cn(
        "grid gap-y-1 text-sm font-normal tracking-tight transition-opacity duration-300 md:col-span-2",
        ready ? "opacity-100" : "opacity-0"
      )}
    >
      <span>
        <span aria-hidden className="text-blue-600">
          ?{" "}
        </span>
        Where to next?
      </span>
      <ul className="grid gap-y-1">
        {OPTIONS.map((option, index) => {
          const isSelected = index === selected
          const itemProps = {
            ref: (element: HTMLElement | null) => {
              itemRefs.current[index] = element
            },
            onMouseEnter: () => setSelected(index),
            onFocus: () => setSelected(index),
            className: cn(
              "flex w-fit gap-[1ch] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 pointer-coarse:py-2",
              isSelected ? "text-foreground" : "text-muted-foreground",
              !option.href && "cursor-not-allowed"
            ),
          }
          const content = (
            <>
              <span aria-hidden className="inline-block w-[1ch] text-blue-600">
                {isSelected && "❯"}
              </span>
              <span className={cn(isSelected && "underline underline-offset-4")}>
                {option.label}
              </span>
              {option.note && (
                <span className="text-muted-foreground">({option.note})</span>
              )}
            </>
          )

          return (
            <li key={option.label}>
              {option.href ? (
                <a
                  {...itemProps}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <button {...itemProps} type="button" aria-disabled="true">
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <span className="text-muted-foreground text-xs pointer-coarse:hidden">
        ↑/↓ to move · Enter to select · or click
      </span>
      <span className="text-muted-foreground hidden text-xs pointer-coarse:inline">
        Tap to select
      </span>
    </div>
  )
}

export function ComingSoonTerminal() {
  return (
    // The LGU rows sit two per line from md up; every other row spans both columns.
    <Terminal className="h-auto max-h-none md:max-w-2xl [&_code]:gap-x-6 md:[&_code]:grid-cols-2 [&_pre]:p-3 [&_pre]:whitespace-pre-wrap sm:[&_pre]:p-4">
      <TypingAnimation className="min-h-5 md:col-span-2" duration={40}>
        &gt; better-davao-del-sur status
      </TypingAnimation>

      {LGUS.map((lgu) => (
        <AnimatedSpan key={lgu} transition={{ duration: 0.15 }}>
          <span className="flex flex-wrap gap-x-[1ch]">
            <Spinner />
            <span className="w-[11ch]">{lgu}</span>
            <span className="text-muted-foreground">under development</span>
          </span>
        </AnimatedSpan>
      ))}

      <AnimatedSpan
        className="text-blue-600 md:col-span-2"
        transition={{ duration: 0.15 }}
      >
        ℹ 1 city · 9 municipalities
      </AnimatedSpan>

      <TypingAnimation
        className="text-muted-foreground min-h-5 md:col-span-2"
        duration={30}
      >
        Coming soon. We&apos;re working on it.
      </TypingAnimation>

      <Menu />
    </Terminal>
  )
}
