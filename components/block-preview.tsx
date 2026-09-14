"use client"

import { useEffect, useRef, useState } from "react"

import {
  DesktopFrame,
  PHONE_BEZEL,
  PhoneFrame,
  TABLET_BEZEL,
  TabletFrame,
} from "@/components/device-frames"
import { getDictionary, type Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"

// bezel — сколько ширины контейнера съедает корпус устройства по бокам
// (рамка DesktopFrame — 1px с каждой стороны).
const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 810, bezel: 2 },
  { id: "tablet", width: 768, height: 1024, bezel: TABLET_BEZEL * 2 + 4 },
  { id: "mobile", width: 375, height: 667, bezel: PHONE_BEZEL * 2 + 4 },
] as const

type ViewportId = (typeof VIEWPORTS)[number]["id"]
type HostTheme = "light" | "dark"

// Экраны фиксированные: десктоп 16:9, планшет 3:4, телефон 9:16. Контент выше
// экрана прокручивается внутри iframe, шире — не бывает (overflow-x скрыт).
// Ниже этой ширины Desktop-фрейм сжимается сильнее чем вдвое и не читается,
// поэтому по умолчанию показываем Mobile.
const NARROW_CONTAINER = 700

// Тема хоста приходит снаружи: та же подложка выбрана на карточке каталога
// и переносится сюда ссылкой, иначе переход сбрасывал бы выбор пользователя.
export function BlockPreview({
  slug,
  kind,
  category,
  theme,
  locale,
  onThemeChange,
}: {
  slug: string
  kind: ItemKind
  category: string
  theme: HostTheme
  locale: Locale
  onThemeChange: (next: HostTheme) => void
}) {
  const t = getDictionary(locale)
  const [viewport, setViewport] = useState<ViewportId>("desktop")
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

  const current = VIEWPORTS.find((item) => item.id === viewport) ?? VIEWPORTS[0]
  const available =
    containerWidth === null ? null : Math.max(containerWidth - current.bezel, 0)
  // Секции показывают настоящий 1440px-лейаут и вписываются масштабом. У
  // компонента и анимации раскладки под ширину экрана нет: ужатый экран лишь
  // уменьшает их. Поэтому экран сужается до контейнера при той же пропорции,
  // а содержимое остаётся 1:1 — масштаб включается, только если сам экран
  // уже контейнера, чего после сужения не бывает.
  const natural = kind !== "block"
  const frameWidth =
    natural && available
      ? Math.min(current.width, Math.floor(available))
      : current.width
  const frameHeight = Math.round((current.height * frameWidth) / current.width)
  const scale = available === null ? null : Math.min(1, available / frameWidth)
  const measured = scale !== null
  const previewPath = `/preview/${kind}/${category}/${slug}`

  // Экран: iframe шире контейнера и вписывается масштабом. position:absolute
  // держит его вне потока: страница не может уехать по горизонтали,
  // даже если transform по какой-то причине не применился.
  const screen = (
    <div
      className="relative"
      style={{
        width: measured ? frameWidth * scale : undefined,
        height: measured ? frameHeight * scale : frameHeight,
      }}
    >
      <iframe
        title={`Preview of ${slug}`}
        src={`${previewPath}?theme=${theme}&lang=${locale}`}
        width={frameWidth}
        height={frameHeight}
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
  )

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label={t.item.preview}
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
              {t.viewport[item.id]}
            </button>
          ))}
        </div>

        <div className="text-shell-muted flex min-w-0 flex-wrap items-center gap-2 text-xs">
          <span>{frameWidth}px</span>
          <span aria-hidden="true">·</span>
          <span>{t.viewport.hostTheme}</span>
          <button
            type="button"
            onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
            className="focus-visible:ring-shell-ring hover:text-shell-fg border-shell-border hover:border-shell-border-strong rounded border px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {theme === "light" ? t.viewport.light : t.viewport.dark}
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex justify-center">
        {viewport === "desktop" ? (
          <DesktopFrame className="w-full">{screen}</DesktopFrame>
        ) : viewport === "tablet" ? (
          <TabletFrame>{screen}</TabletFrame>
        ) : (
          <PhoneFrame>{screen}</PhoneFrame>
        )}
      </div>
    </div>
  )
}
