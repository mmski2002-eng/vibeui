"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select017Status = "loading" | "error" | "ready"

export type Select017Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  options?: string[]
  /** Состояние при монтировании: с него начинается демонстрация. */
  defaultStatus?: Select017Status
  loadingText?: string
  errorText?: string
  retryLabel?: string
  /** Подпись пустого варианта в готовом состоянии. */
  placeholderText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список вариантов — это запрос, который может не
// доехать. Поле остаётся select-007-совместимым (disabled + aria-busy на
// одном и том же <select>), но добавляет третье состояние: запрос упал,
// рядом кнопка «Повторить», которая заново включает загрузку. По
// умолчанию первая попытка нарочно проваливается — это и есть демонстрация
// всех трёх состояний без переключения контролов вручную.
const STYLES = `
:where([data-vibeui-block="select-017"]){
--vibeui-select-017-surface:transparent;
--vibeui-select-017-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-017-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-017-muted:color-mix(in oklab,var(--vibeui-select-017-fg) 68%,transparent);
--vibeui-select-017-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-select-017-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.012 265));
--vibeui-select-017-accent:light-dark(oklch(0.55 0.19 245),oklch(0.74 0.15 245));
--vibeui-select-017-danger:light-dark(oklch(0.58 0.21 25),oklch(0.68 0.19 25));
--vibeui-select-017-on-danger:light-dark(oklch(1 0 0),oklch(0.18 0.02 25));
--vibeui-select-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-017"]{color-scheme:dark}
[data-vibeui-block="select-017"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-017-surface);
border:1px solid var(--vibeui-select-017-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-017-font);color:var(--vibeui-select-017-fg);
container-type:inline-size;
}
[data-vibeui-block="select-017"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-017"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-017"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.75rem 0 0.875rem;
border:1px solid var(--vibeui-select-017-border);border-radius:0.625rem;
background:var(--vibeui-select-017-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
}
[data-vibeui-block="select-017"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-017-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-017-accent) 22%,transparent);
}
[data-vibeui-block="select-017"] select:disabled{
color:var(--vibeui-select-017-muted);
background:color-mix(in oklab,var(--vibeui-select-017-border) 22%,var(--vibeui-select-017-field));
}
[data-vibeui-block="select-017"] select:disabled[aria-invalid="true"]{
cursor:default;border-color:color-mix(in oklab,var(--vibeui-select-017-danger) 45%,var(--vibeui-select-017-border));
}
[data-vibeui-block="select-017"] select:disabled:not([aria-invalid="true"]){cursor:progress}
[data-vibeui-block="select-017"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-017-muted);
border-bottom:1.5px solid var(--vibeui-select-017-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-017"] [data-part="spinner"]{
position:absolute;right:0.875rem;top:50%;margin-top:-0.5rem;
width:1rem;height:1rem;border-radius:9999px;pointer-events:none;
background:conic-gradient(from 0deg,transparent 0deg,var(--vibeui-select-017-accent) 300deg);
mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px));
-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px));
animation:vibeui-select-017-spin .8s linear infinite;
}
@keyframes vibeui-select-017-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="select-017"] [data-part="error-icon"]{
position:absolute;right:0.875rem;top:50%;margin-top:-0.5rem;
display:grid;place-items:center;width:1rem;height:1rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-select-017-danger);color:var(--vibeui-select-017-on-danger);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="select-017"] [data-part="status"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-017-muted);
}
[data-vibeui-block="select-017"] [data-part="status"][data-tone="error"]{color:var(--vibeui-select-017-danger)}
[data-vibeui-block="select-017"] [data-part="bar"]{
flex:1 1 auto;min-width:3rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-select-017-accent) 35%,transparent),color-mix(in oklab,var(--vibeui-select-017-border) 60%,transparent));
background-size:200% 100%;
animation:vibeui-select-017-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-select-017-slide{0%{background-position:100% 0}100%{background-position:0 0}}
[data-vibeui-block="select-017"] [data-part="retry"]{
flex:none;padding:0.25rem 0.625rem;margin:0;border-radius:9999px;
border:1px solid var(--vibeui-select-017-danger);background:transparent;
color:var(--vibeui-select-017-danger);font:inherit;font-size:0.75rem;font-weight:600;
cursor:pointer;transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="select-017"] [data-part="retry"]:hover{
background:color-mix(in oklab,var(--vibeui-select-017-danger) 12%,transparent);
}
[data-vibeui-block="select-017"] [data-part="retry"]:focus-visible{
outline:2px solid var(--vibeui-select-017-danger);outline-offset:2px;
}
@container (max-width: 14rem){
[data-vibeui-block="select-017"] [data-part="status"]{flex-direction:column;align-items:flex-start}
[data-vibeui-block="select-017"] [data-part="bar"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Стандартный", "Ускоренный", "Ночной", "Самовывоз"]

const RESOLVE_DELAY_MS = 900

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
 * Select с состояниями загрузки, ошибки и повтора: поле disabled и
 * помечено aria-busy во время загрузки, при ошибке — aria-invalid и
 * кнопка «Повторить» в role="alert". Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Select017({
  label = "Способ доставки",
  name,
  options = DEFAULT_OPTIONS,
  defaultStatus = "loading",
  loadingText = "Загружаем варианты доставки",
  errorText = "Не удалось загрузить варианты доставки",
  retryLabel = "Повторить",
  placeholderText = "Выберите вариант",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select017Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  const [status, setStatus] = useState<Select017Status>(defaultStatus)
  const [value, setValue] = useState(
    defaultStatus === "ready" ? (options[0] ?? "") : "",
  )
  // Первая попытка нарочно проваливается, если демонстрация стартует с
  // загрузки: так виден весь путь loading → error → retry → ready. Если
  // стартуем сразу с "error", повтор обязан сработать с первого раза.
  const attemptRef = useRef(defaultStatus === "error" ? 1 : 0)

  useEffect(() => {
    if (status !== "loading") return

    const timer = window.setTimeout(() => {
      if (attemptRef.current === 0) {
        attemptRef.current += 1
        setStatus("error")
      } else {
        setValue((current) => current || (options[0] ?? ""))
        setStatus("ready")
      }
    }, RESOLVE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [status, options])

  function handleRetry() {
    setStatus("loading")
  }

  const palette = {
    ...(accent ? { "--vibeui-select-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-017-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const placeholder =
    status === "loading"
      ? `${loadingText}…`
      : status === "error"
        ? errorText
        : placeholderText

  return (
    <>
      <style href="vibeui-select-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-017"
        data-status={status}
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            name={name}
            disabled={status !== "ready"}
            aria-busy={status === "loading"}
            aria-invalid={status === "error"}
            aria-describedby={
              status !== "ready" ? `${fieldId}-status` : undefined
            }
            value={status === "ready" ? value : ""}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {status === "ready"
              ? options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : null}
          </select>
          {status === "loading" ? (
            <span data-part="spinner" aria-hidden="true" />
          ) : status === "error" ? (
            <span data-part="error-icon" aria-hidden="true">
              !
            </span>
          ) : (
            <span data-part="arrow" aria-hidden="true" />
          )}
        </span>
        {status === "loading" ? (
          <p data-part="status" id={`${fieldId}-status`} role="status">
            <span data-part="bar" aria-hidden="true" />
            <span>{loadingText}</span>
          </p>
        ) : null}
        {status === "error" ? (
          <p
            data-part="status"
            id={`${fieldId}-status`}
            data-tone="error"
            role="alert"
          >
            <span>{errorText}</span>
            <button type="button" data-part="retry" onClick={handleRetry}>
              {retryLabel}
            </button>
          </p>
        ) : null}
      </div>
    </>
  )
}
