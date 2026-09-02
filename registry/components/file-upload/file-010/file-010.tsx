"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type File010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  fileName?: string
  reason?: string
  retryLabel?: string
  /** Подписи состояний: retrying и done. */
  statusText?: Record<string, string>
  /** Доступное имя кнопки: {label} и {name} подставляют подпись и файл. */
  retryAriaLabel?: string
  /** Пояснение под строкой. */
  hint?: string
  onRetry?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сорванная загрузка, из которой есть выход. Красная строка
// без кнопки заставляет искать файл заново — а причина почти всегда временная:
// пропала сеть, сервер ответил пятисоткой. Здесь названа причина, а не «ошибка
// загрузки», и рядом стоит повтор: файл уже выбран, второй раз его искать не
// нужно. На время повтора строка честно показывает, что идёт работа.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у строки
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-010"]){
--vibeui-file-010-surface:transparent;
--vibeui-file-010-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-file-010-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-file-010-border:light-dark(oklch(0.89 0.008 265),oklch(0.4 0.014 265));
--vibeui-file-010-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-file-010-track:light-dark(oklch(0.93 0.006 265),oklch(0.32 0.012 265));
--vibeui-file-010-accent:light-dark(oklch(0.54 0.17 260),oklch(0.74 0.16 260));
--vibeui-file-010-danger:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.17 25));
--vibeui-file-010-ok:light-dark(oklch(0.52 0.13 155),oklch(0.76 0.14 155));
--vibeui-file-010-on-solid:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-file-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Панель без собственной заливки: рамка очерчивает строку на любом фоне. */
[data-vibeui-block="file-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-010-surface);
border:1px solid var(--vibeui-file-010-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-010-font);color:var(--vibeui-file-010-fg);
}
[data-vibeui-block="file-010"] *{box-sizing:border-box}
[data-vibeui-block="file-010"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem;border-radius:0.75rem;
border:1px solid var(--vibeui-file-010-border);
transition:border-color .16s ease;
}
[data-vibeui-block="file-010"][data-status="failed"] [data-part="row"]{
border-color:color-mix(in oklab,var(--vibeui-file-010-danger) 50%,var(--vibeui-file-010-border));
background:color-mix(in oklab,var(--vibeui-file-010-danger) 10%,transparent);
}
[data-vibeui-block="file-010"][data-status="done"] [data-part="row"]{
border-color:color-mix(in oklab,var(--vibeui-file-010-ok) 45%,var(--vibeui-file-010-border));
}
[data-vibeui-block="file-010"] [data-part="mark"]{
position:relative;flex:none;width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-file-010-track);
}
[data-vibeui-block="file-010"][data-status="failed"] [data-part="mark"]{background:var(--vibeui-file-010-danger)}
[data-vibeui-block="file-010"][data-status="done"] [data-part="mark"]{background:var(--vibeui-file-010-ok)}
[data-vibeui-block="file-010"][data-status="failed"] [data-part="mark"]::before,
[data-vibeui-block="file-010"][data-status="failed"] [data-part="mark"]::after{
content:"";position:absolute;left:0.5rem;top:0.8125rem;
width:0.75rem;height:2px;border-radius:9999px;background:var(--vibeui-file-010-on-solid);
}
[data-vibeui-block="file-010"][data-status="failed"] [data-part="mark"]::before{transform:rotate(45deg)}
[data-vibeui-block="file-010"][data-status="failed"] [data-part="mark"]::after{transform:rotate(-45deg)}
[data-vibeui-block="file-010"][data-status="done"] [data-part="mark"]::before{
content:"";position:absolute;left:0.6875rem;top:0.4375rem;
width:0.375rem;height:0.6875rem;transform:rotate(42deg);
border-right:2px solid var(--vibeui-file-010-on-solid);border-bottom:2px solid var(--vibeui-file-010-on-solid);
}
[data-vibeui-block="file-010"][data-status="retrying"] [data-part="mark"]{
background:none;border:2px solid color-mix(in oklab,var(--vibeui-file-010-accent) 30%,transparent);
border-top-color:var(--vibeui-file-010-accent);
animation:vibeui-file-010-spin .7s linear infinite;
}
@keyframes vibeui-file-010-spin{to{transform:rotate(1turn)}}
[data-vibeui-block="file-010"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1}
[data-vibeui-block="file-010"] [data-part="name"]{
font-size:0.8125rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Причина, а не «ошибка загрузки»: по ней видно, поможет ли повтор. */
[data-vibeui-block="file-010"] [data-part="reason"]{
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-010-muted);
}
[data-vibeui-block="file-010"][data-status="failed"] [data-part="reason"]{color:var(--vibeui-file-010-danger);font-weight:600}
[data-vibeui-block="file-010"] button{
appearance:none;flex:none;cursor:pointer;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-file-010-danger);
background:none;color:var(--vibeui-file-010-danger);
font:inherit;font-size:0.75rem;font-weight:700;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="file-010"] button:hover{background:var(--vibeui-file-010-danger);color:var(--vibeui-file-010-on-solid)}
[data-vibeui-block="file-010"] button:focus-visible{outline:2px solid var(--vibeui-file-010-danger);outline-offset:2px}
[data-vibeui-block="file-010"] [data-part="hint"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-010"] *{animation:none!important;transition:none!important}}
`

type Status = "failed" | "retrying" | "done"

const STATUS_TEXT: Record<string, string> = {
  failed: "",
  retrying: "Повторяем отправку…",
  done: "Загружен со второй попытки",
}

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
 * Строка сорванной загрузки: причина отказа и повтор без повторного выбора файла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File010({
  fileName = "презентация-инвесторам.key",
  reason = "Сеть пропала на 82% — файл дошёл не целиком",
  retryLabel = "Повторить",
  statusText = STATUS_TEXT,
  retryAriaLabel = "{label}: {name}",
  hint = "Файл остался выбранным — при повторе его не нужно искать заново.",
  onRetry,
  background = "",
  accent,
  className,
  style,
  ...props
}: File010Props) {
  const [status, setStatus] = useState<Status>("failed")

  useEffect(() => {
    if (status !== "retrying") return

    const timer = window.setTimeout(() => setStatus("done"), 1200)

    return () => window.clearTimeout(timer)
  }, [status])

  const palette = {
    ...(accent ? { "--vibeui-file-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-010"
        data-status={status}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <span data-part="mark" aria-hidden="true" />
          <span data-part="body">
            <span data-part="name">{fileName}</span>
            {/* Состояние словом: значок сам по себе не читается вслух. */}
            <span data-part="reason" role="status">
              {status === "failed"
                ? reason
                : (statusText[status] ?? STATUS_TEXT[status])}
            </span>
          </span>
          {status === "failed" ? (
            <button
              type="button"
              aria-label={retryAriaLabel
                .replace("{label}", retryLabel)
                .replace("{name}", fileName)}
              onClick={() => {
                setStatus("retrying")
                onRetry?.()
              }}
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
