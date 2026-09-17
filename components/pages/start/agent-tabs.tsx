"use client"

import { useEffect, useRef, useState } from "react"

import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import type { AgentTab } from "@/components/pages/start/texts"
import { cn } from "@/lib/utils"

/** Вставка отличается только первым шагом: где открыть чат агента. */
export function AgentTabs({
  tabs,
  copy,
  copied,
}: {
  tabs: AgentTab[]
  copy: string
  copied: string
}) {
  const [active, setActive] = useState(tabs[0].id)
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0]
  const list = useRef<HTMLDivElement>(null)
  const marker = useRef<HTMLSpanElement>(null)

  // Подложка скользит под активную вкладку. Геометрия пишется в DOM
  // напрямую: она производная от активной вкладки, состоянием быть не должна.
  useEffect(() => {
    const host = list.current
    const pill = marker.current

    if (!host || !pill) return

    const place = () => {
      const button = host.querySelector<HTMLElement>(
        `[data-tab="${current.id}"]`,
      )

      if (!button) return

      pill.style.setProperty("width", `${button.offsetWidth}px`)
      pill.style.setProperty("transform", `translateX(${button.offsetLeft}px)`)
      pill.style.setProperty("opacity", "1")
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(host)

    return () => observer.disconnect()
  }, [current.id])

  return (
    <div>
      <div
        ref={list}
        role="tablist"
        className="border-shell-border relative inline-flex max-w-full flex-wrap gap-1 rounded-full border p-1"
      >
        <span
          ref={marker}
          aria-hidden="true"
          className="bg-shell-accent-soft border-shell-accent-line absolute top-1 bottom-1 left-0 rounded-full border opacity-0 transition-[transform,width,opacity] duration-(--motion-base) ease-(--ease-out) motion-reduce:transition-none"
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-tab={tab.id}
            aria-selected={tab.id === current.id}
            aria-controls={`agent-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "focus-visible:ring-shell-ring relative z-10 rounded-full px-3 py-1 text-sm transition-colors duration-(--motion-base) focus-visible:ring-2 focus-visible:outline-none",
              tab.id === current.id
                ? "text-shell-accent-text"
                : "text-shell-muted hover:text-shell-fg",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ol
        key={current.id}
        id={`agent-${current.id}`}
        role="tabpanel"
        className="start-fade mt-4 flex list-decimal flex-col gap-3 pl-5"
      >
        {current.steps.map((step) => (
          <li
            key={step.text}
            className="text-shell-muted text-sm leading-relaxed"
          >
            {step.text}
            {step.code ? (
              <div className="mt-2 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <CodeBlock code={step.code} />
                </div>
                <CopyButton
                  value={step.code}
                  label={copy}
                  copiedLabel={copied}
                  className="h-8 px-2.5 text-xs"
                />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
