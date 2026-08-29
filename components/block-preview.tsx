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

// Ниже этой ширины Desktop-фрейм сжимается сильнее чем вдвое и не читается,
// поэтому по умолчанию показываем Mobile.
const NARROW_CONTAINER = 700

export function BlockPreview({ slug }: { slug: string }) {
  const [viewport, setViewport] = useState<ViewportId>("desktop")
  const [theme, setTheme] = useState<HostTheme>("light")
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportChosenRef = useRef(false)

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setContainerWidth(width)

      // Пока пользователь не выбрал viewport сам, он следует за шириной
      // контейнера: на телефоне Desktop-фрейм превращается в нечитаемую полоску.
      if (!viewportChosenRef.current) {
        setViewport(width < NARROW_CONTAINER ? "mobile" : "desktop")
      }
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
          className="border-shell-border inline-flex rounded-md border p-0.5"
        >
          {VIEWPORTS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={viewport === item.id}
              onClick={() => {
                viewportChosenRef.current = true
                setViewport(item.id)
              }}
              className={
                "focus-visible:ring-shell-ring rounded px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                (viewport === item.id
                  ? "bg-shell-accent text-shell-accent-fg"
                  : "text-shell-muted hover:text-shell-fg")
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="text-shell-muted flex min-w-0 flex-wrap items-center gap-2 text-xs">
          <span>{frameWidth}px</span>
          <span aria-hidden="true">·</span>
          <span>Host theme</span>
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="focus-visible:ring-shell-ring hover:text-shell-fg border-shell-border hover:border-shell-border-strong rounded border px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {theme === "light" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="border-shell-border overflow-hidden rounded-lg border"
      >
        {/* Фрейм шире контейнера и вписывается масштабом. position:absolute
            держит его вне потока: страница не может уехать по горизонтали,
            даже если transform по какой-то причине не применился. */}
        <div
          className="relative"
          style={{
            height: measured ? FRAME_HEIGHT * scale : FRAME_HEIGHT,
          }}
        >
          <iframe
            title={`Preview of ${slug}`}
            src={`/preview/${slug}?theme=${theme}`}
            width={frameWidth}
            height={FRAME_HEIGHT}
            className={
              measured
                ? "absolute top-0 left-0 block border-0"
                : "invisible absolute top-0 left-0 block border-0"
            }
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
