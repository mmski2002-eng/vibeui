"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast019Status = "exporting" | "ready" | "cancelled"

export type Toast019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  fileName?: string
  fileSize?: string
  downloadHref?: string
  exportingLabel?: string
  readyLabel?: string
  cancelLabel?: string
  closeLabel?: string
  /** Сколько мс идёт демонстрационная выгрузка. */
  durationMs?: number
  onReady?: () => void
  onCancel?: () => void
}

// Идея компонента: фоновая выгрузка не блокирует работу и сама сообщает,
// когда результат готов. Полоса прогресса и процент — на время выгрузки,
// а после завершения карточка не исчезает, а превращается в ссылку
// «Скачать»: результат остаётся доступным, пока пользователь его не заберёт.
const STYLES = `
:where([data-vibeui-block="toast-019"]){
--vibeui-toast-019-bg:oklch(0.99 0.002 265);
--vibeui-toast-019-fg:oklch(0.22 0.014 265);
--vibeui-toast-019-muted:oklch(0.56 0.014 265);
--vibeui-toast-019-border:oklch(0.9 0.006 265);
--vibeui-toast-019-track:oklch(0.92 0.006 265);
--vibeui-toast-019-tone:oklch(0.58 0.16 260);
--vibeui-toast-019-success:oklch(0.58 0.15 152);
--vibeui-toast-019-percent:0;
--vibeui-toast-019-radius:0.875rem;
--vibeui-toast-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-019"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-019-radius);
border:1px solid var(--vibeui-toast-019-border);
background:var(--vibeui-toast-019-bg);color:var(--vibeui-toast-019-fg);
font-family:var(--vibeui-toast-019-font);
box-shadow:0 16px 34px -24px oklch(0.18 0.02 265 / 55%);
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
[data-vibeui-block="toast-019"] [data-part="title"]{font-size:0.8438rem;font-weight:600;line-height:1.35}
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
background:var(--vibeui-toast-019-success);color:oklch(0.99 0.004 265);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-019"] [data-part="download"]:hover{filter:brightness(1.05)}
[data-vibeui-block="toast-019"] [data-part="download"]:focus-visible{outline:2px solid var(--vibeui-toast-019-success);outline-offset:2px}
[data-vibeui-block="toast-019"] [data-part="cancel"]{
appearance:none;cursor:pointer;border:0;background:transparent;
padding:0.375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:600;color:var(--vibeui-toast-019-muted);
}
[data-vibeui-block="toast-019"] [data-part="cancel"]:hover{background:oklch(0 0 0 / 6%);color:var(--vibeui-toast-019-fg)}
[data-vibeui-block="toast-019"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-toast-019-tone);outline-offset:2px}
[data-vibeui-block="toast-019"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;margin-top:0.0625rem;
color:var(--vibeui-toast-019-muted);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="toast-019"] [data-part="close"]:hover{background:oklch(0 0 0 / 6%);color:var(--vibeui-toast-019-fg)}
[data-vibeui-block="toast-019"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-019-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-019"] *{animation:none!important;transition:none!important}}
`

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
  closeLabel = "Закрыть",
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

  return (
    <>
      <style href="vibeui-toast-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-019"
        data-status={status}
        role="status"
        aria-live="polite"
        className={className}
        style={
          { "--vibeui-toast-019-percent": percent, ...style } as CSSProperties
        }
      >
        <span data-part="glyph" aria-hidden="true">
          {status === "ready" ? "✓" : status === "cancelled" ? "–" : "↓"}
        </span>
        <span data-part="body">
          <span data-part="title">
            {status === "ready"
              ? readyLabel
              : status === "cancelled"
                ? "Выгрузка отменена"
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
                <span>Идёт подготовка</span>
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
                Скачать
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
