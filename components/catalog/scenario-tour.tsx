"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Eye } from "lucide-react"

import { cn } from "@/lib/utils"

export type ScenarioTourRow = {
  name: string
  role: string
  title: string
  note?: string
  path: string
  /** Якорь секции в демо: пусто — верх страницы. */
  anchor: string
  /** JSX из демо — только подписчику. */
  usage: string | null
}

/**
 * Экскурсия по демо: слева живая страница, справа список блоков. Клик по
 * строке прокручивает демо к секции с этим блоком — так видно и сам блок, и
 * его место на странице, без отдельных превью на каждый.
 */
export function ScenarioTour({
  demo,
  rows,
  labels,
}: {
  demo: string
  rows: ScenarioTourRow[]
  labels: { show: string; openInCatalog: string }
}) {
  const host = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(0)
  const [active, setActive] = useState<string | null>(null)
  const width = 1440
  const height = 900

  useEffect(() => {
    const element = host.current

    if (!element) return

    const observer = new ResizeObserver(() => setScale(element.offsetWidth / width))

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  function show(row: ScenarioTourRow) {
    setActive(row.name)

    const target = frame.current?.contentWindow

    if (!target) return

    // Тот же origin: якорь меняется без перезагрузки кадра. Без якоря —
    // к верху страницы.
    if (row.anchor) {
      target.location.hash = row.anchor
    } else {
      target.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <div
        ref={host}
        className="border-shell-border bg-shell-elevated relative overflow-hidden rounded-xl border lg:sticky lg:top-24"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {scale > 0 ? (
          <iframe
            ref={frame}
            src={demo}
            title="demo"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: width + 24,
              height,
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
              pointerEvents: "none",
            }}
          />
        ) : null}
      </div>

      <ol className="border-shell-border divide-shell-border divide-y overflow-hidden rounded-xl border">
        {rows.map((row, index) => (
          <li
            key={row.name}
            className={cn(
              "bg-shell-panel flex flex-col gap-1.5 p-4 transition-colors",
              active === row.name && "bg-shell-elevated",
            )}
          >
            <p className="text-shell-accent-text text-xs font-semibold tracking-[0.12em] uppercase">
              {index + 1}. {row.role}
            </p>
            <h3 className="text-shell-fg text-base font-medium">
              <Link href={row.path} className="hover:text-shell-accent transition-colors">
                {row.title}
              </Link>
              <span className="text-shell-muted ml-2 font-mono text-xs">{row.name}</span>
            </h3>
            {row.note ? <p className="text-shell-muted text-sm text-pretty">{row.note}</p> : null}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => show(row)}
                className="bg-shell-fg text-shell hover:bg-shell-accent hover:text-shell-accent-fg focus-visible:ring-shell-ring inline-flex h-8 items-center gap-1.5 rounded-md px-3 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Eye className="size-3.5" aria-hidden="true" />
                {labels.show}
              </button>
              <Link
                href={row.path}
                className="border-shell-border text-shell-fg hover:border-shell-border-strong hover:bg-shell-panel focus-visible:ring-shell-ring inline-flex h-8 items-center gap-1.5 rounded-md border px-3 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {labels.openInCatalog}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            {row.usage ? (
              <pre className="bg-shell-elevated border-shell-border text-shell-fg mt-2 max-h-56 overflow-auto rounded-lg border p-3 font-mono text-[11px] leading-relaxed whitespace-pre">
                {row.usage}
              </pre>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
