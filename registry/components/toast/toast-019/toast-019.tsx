"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast019Status = "exporting" | "ready" | "cancelled"

export type Toast019Props = Omit<ComponentProps<"div">, "children"> & {
  fileName?: string
  fileSize?: string
  downloadHref?: string
  exportingLabel?: string
  readyLabel?: string
  cancelLabel?: string
  cancelledLabel?: string
  progressLabel?: string
  downloadLabel?: string
  closeLabel?: string
  /** Цвет полосы прогресса. Пусто — штатная палитра. */
  tone?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  /** Сколько мс идёт демонстрационная выгрузка. */
  durationMs?: number
  onReady?: () => void
  onCancel?: () => void
}

// Идея компонента: фоновая выгрузка не блокирует работу и сама сообщает,
// когда результат готов. Полоса прогресса и процент — на время выгрузки,
// а после завершения карточка не исчезает, а превращается в ссылку
// «Скачать»: результат остаётся доступным, пока пользователь его не заберёт.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, граница светлее подложки, а дорожка полосы
// темнее подложки — иначе пустая часть полосы читалась бы как заполненная.
const STYLES = `
:where([data-vibeui-block="toast-019"]){
--vibeui-toast-019-bg:light-dark(oklch(0.99 0 265),oklch(0.25 0 265));
--vibeui-toast-019-fg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-toast-019-muted:color-mix(in oklab,var(--vibeui-toast-019-fg) 68%,transparent);
--vibeui-toast-019-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-019-track:light-dark(oklch(0.92 0 265),oklch(0.33 0 265));
--vibeui-toast-019-hover:light-dark(oklch(0.2 0 265 / 7%),oklch(1 0 0 / 12%));
--vibeui-toast-019-shadow:light-dark(oklch(0.18 0 265 / 55%),oklch(0.05 0 265 / 70%));
--vibeui-toast-019-tone:light-dark(oklch(0.55 0.16 39.8),oklch(0.72 0.15 39.8));
--vibeui-toast-019-success:light-dark(oklch(0.55 0.15 152),oklch(0.73 0.15 152));
--vibeui-toast-019-on-success:light-dark(oklch(0.99 0 265),oklch(0.18 0.03 152));
--vibeui-toast-019-percent:0;
--vibeui-toast-019-radius:0.875rem;
--vibeui-toast-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-019"]{color-scheme:dark}
[data-vibeui-block="toast-019"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-019-radius);
border:1px solid var(--vibeui-toast-019-border);
background:var(--vibeui-toast-019-bg);color:var(--vibeui-toast-019-fg);
font-family:var(--vibeui-toast-019-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-019-shadow);
}
[data-vibeui-block="toast-019"] [data-part="glyph"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.625rem;margin-top:0.0625rem;
background:color-mix(in oklab,var(--vibeui-toast-019-tone) 14%,transparent);
color:var(--vibeui-toast-019-tone);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="toast-019"][data-status="ready"] [data-part="glyph"]{
background:color-mix(in oklab,var(--vibeui-toast-019-success) 16%,transparent);
color:var(--vibeui-toast-019-success);
}
[data-vibeui-block="toast-019"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="toast-019"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="toast-019"] [data-part="name"]{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-toast-019-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-019"] [data-part="track"]{
margin-top:0.5rem;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-toast-019-track);
}
[data-vibeui-block="toast-019"] [data-part="fill"]{
height:100%;border-radius:inherit;width:calc(var(--vibeui-toast-019-percent) * 1%);
background:repeating-linear-gradient(
  -45deg,var(--vibeui-toast-019-tone) 0 0.5rem,
  color-mix(in oklab,var(--vibeui-toast-019-tone) 70%,transparent) 0.5rem 1rem
);
background-size:200% 100%;
transition:width .18s linear;
animation:vibeui-toast-019-stripes 1s linear infinite;
}
@keyframes vibeui-toast-019-stripes{from{background-position:0 0}to{background-position:1.4142rem 0}}
[data-vibeui-block="toast-019"] [data-part="meta"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.375rem;font-size:0.75rem;color:var(--vibeui-toast-019-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="toast-019"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;
}
[data-vibeui-block="toast-019"] [data-part="download"]{
appearance:none;text-decoration:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.75rem;border-radius:0.5rem;border:0;
background:var(--vibeui-toast-019-success);color:var(--vibeui-toast-019-on-success);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-019"] [data-part="download"]:hover{filter:brightness(1.05)}
[data-vibeui-block="toast-019"] [data-part="download"]:focus-visible{outline:2px solid var(--vibeui-toast-019-success);outline-offset:2px}
[data-vibeui-block="toast-019"] [data-part="cancel"]{
appearance:none;cursor:pointer;border:0;background:transparent;
padding:0.375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:600;color:var(--vibeui-toast-019-muted);
}
[data-vibeui-block="toast-019"] [data-part="cancel"]:hover{background:var(--vibeui-toast-019-hover);color:var(--vibeui-toast-019-fg)}
[data-vibeui-block="toast-019"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-toast-019-tone);outline-offset:2px}
[data-vibeui-block="toast-019"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;margin-top:0.0625rem;
color:var(--vibeui-toast-019-muted);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="toast-019"] [data-part="close"]:hover{background:var(--vibeui-toast-019-hover);color:var(--vibeui-toast-019-fg)}
[data-vibeui-block="toast-019"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-019-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-019"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Фоновая выгрузка файла: полоса прогресса переходит в ссылку «Скачать»
 * после завершения. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast019({
  fileName = "Отчёт-продажи.xlsx",
  fileSize = "2,4 МБ",
  downloadHref = "#",
  exportingLabel = "Готовим файл к скачиванию…",
  readyLabel = "Файл готов",
  cancelLabel = "Отмена",
  cancelledLabel = "Выгрузка отменена",
  progressLabel = "Идёт подготовка",
  downloadLabel = "Скачать",
  closeLabel = "Закрыть",
  tone = "",
  background = "",
  durationMs = 2400,
  onReady,
  onCancel,
  className,
  style,
  ...props
}: Toast019Props) {
  const [status, setStatus] = useState<Toast019Status>("exporting")
  const [percent, setPercent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (status !== "exporting") return

    const step = 100 / (durationMs / 120)
    let value = 0

    // Переход в готовность считается здесь же, в тике таймера: отдельный
    // эффект на percent дал бы лишний каскад рендеров.
    const timer = setInterval(() => {
      value = Math.min(100, value + step)
      setPercent(value)

      if (value >= 100) {
        clearInterval(timer)
        setStatus("ready")
        onReady?.()
      }
    }, 120)

    return () => clearInterval(timer)
  }, [status, durationMs, onReady])

  if (!visible) return null

  const palette = {
    "--vibeui-toast-019-percent": percent,
    ...(tone ? { "--vibeui-toast-019-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-019"
        data-status={status}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          {status === "ready" ? "✓" : status === "cancelled" ? "–" : "↓"}
        </span>
        <span data-part="body">
          <span data-part="title">
            {status === "ready"
              ? readyLabel
              : status === "cancelled"
                ? cancelledLabel
                : exportingLabel}
          </span>
          <span data-part="name">
            {fileName} · {fileSize}
          </span>

          {status === "exporting" ? (
            <>
              <span data-part="track">
                <span data-part="fill" />
              </span>
              <span data-part="meta">
                <span>{progressLabel}</span>
                <span>{Math.round(percent)}%</span>
              </span>
              <span data-part="row">
                <button
                  type="button"
                  data-part="cancel"
                  onClick={() => {
                    setStatus("cancelled")
                    onCancel?.()
                  }}
                >
                  {cancelLabel}
                </button>
              </span>
            </>
          ) : null}

          {status === "ready" ? (
            <span data-part="row">
              <a data-part="download" href={downloadHref} download={fileName}>
                {downloadLabel}
              </a>
            </span>
          ) : null}
        </span>
        <button
          type="button"
          data-part="close"
          aria-label={closeLabel}
          onClick={() => setVisible(false)}
        >
          ×
        </button>
      </div>
    </>
  )
}
