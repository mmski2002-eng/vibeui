"use client"

import { useEffect, useRef, useState } from "react"

const VIEWPORTS = [
  { id: "desktop", label: "Desktop", width: 1440 },
  { id: "tablet", label: "Tablet", width: 768 },
  { id: "mobile", label: "Mobile", width: 375 },
] as const

type ViewportId = (typeof VIEWPORTS)[number]["id"]
type HostTheme = "light" | "dark"

// TODO: высота фрейма фиксирована. Блок выше 760px будет обрезан — авто-высота
// через postMessage откладывается до появления таких блоков.
const FRAME_HEIGHT = 760

export function BlockPreview({ slug }: { slug: string }) {
  const [viewport, setViewport] = useState<ViewportId>("desktop")
  const [theme, setTheme] = useState<HostTheme>("light")
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const frameWidth =
    VIEWPORTS.find((item) => item.id === viewport)?.width ?? 1440
  const scale =
    containerWidth === null ? null : Math.min(1, containerWidth / frameWidth)
  const measured = scale !== null

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Preview viewport"
          className="inline-flex rounded-md border p-0.5"
        >
          {VIEWPORTS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={viewport === item.id}
              onClick={() => setViewport(item.id)}
              className={
                "focus-visible:ring-ring rounded px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                (viewport === item.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{frameWidth}px</span>
          <span aria-hidden="true">·</span>
          <span>Host theme</span>
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="focus-visible:ring-ring hover:text-foreground rounded border px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {theme === "light" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-hidden rounded-lg border">
        <div
          style={{
            height: measured ? FRAME_HEIGHT * scale : FRAME_HEIGHT,
          }}
        >
          <iframe
            title={`Preview of ${slug}`}
            src={`/preview/${slug}?theme=${theme}`}
            width={frameWidth}
            height={FRAME_HEIGHT}
            className={measured ? "block border-0" : "invisible block border-0"}
            style={{
              transform: measured ? `scale(${scale})` : undefined,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  )
}
