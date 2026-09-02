import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select007Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "size" | "children"
> & {
  label?: string
  options?: string[]
  /** Пока список едет с сервера — поле выключено и объясняет почему. */
  loading?: boolean
  loadingText?: string
  /** Первая строка готового списка. */
  placeholder?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: состояние «список ещё едет». Пустой select с одной
// строкой выглядит как поломка, поэтому поле выключено, подписано и рядом
// крутится маленький индикатор — понятно, что ждать, а не чинить.
// Ширина поля не прыгает при подмене списка: скелет занимает то же место.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="select-007"]){
--vibeui-select-007-surface:transparent;
--vibeui-select-007-surface-border:transparent;
--vibeui-select-007-surface-pad:0;
--vibeui-select-007-surface-radius:0;
--vibeui-select-007-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-007-muted:light-dark(oklch(0.57 0.014 265),oklch(0.71 0.012 265));
--vibeui-select-007-field:light-dark(oklch(0.985 0.002 265),oklch(0.25 0.012 265));
--vibeui-select-007-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-select-007-accent:light-dark(oklch(0.55 0.19 245),oklch(0.76 0.15 245));
--vibeui-select-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложка появляется только вместе с пропом background: по умолчанию поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="select-007"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
padding:var(--vibeui-select-007-surface-pad);
background:var(--vibeui-select-007-surface);
border:1px solid var(--vibeui-select-007-surface-border);
border-radius:var(--vibeui-select-007-surface-radius);
font-family:var(--vibeui-select-007-font);color:var(--vibeui-select-007-fg);
}
[data-vibeui-block="select-007"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-007"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-007"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.75rem 0 0.875rem;
border:1px solid var(--vibeui-select-007-border);border-radius:0.625rem;
background:var(--vibeui-select-007-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
}
[data-vibeui-block="select-007"] select:focus{
outline:none;border-color:var(--vibeui-select-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-007-accent) 22%,transparent);
}
[data-vibeui-block="select-007"] select:disabled{
cursor:progress;color:var(--vibeui-select-007-muted);
background:color-mix(in oklab,var(--vibeui-select-007-border) 22%,var(--vibeui-select-007-field));
}
[data-vibeui-block="select-007"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-007-muted);
border-bottom:1.5px solid var(--vibeui-select-007-muted);
transform:rotate(45deg);
}
/* Индикатор — кольцо из conic-gradient с вырезом маской: спиннер без SVG
   и без иконочной библиотеки. */
[data-vibeui-block="select-007"] [data-part="spinner"]{
position:absolute;right:0.875rem;top:50%;margin-top:-0.5rem;
width:1rem;height:1rem;border-radius:9999px;pointer-events:none;
background:conic-gradient(from 0deg,transparent 0deg,var(--vibeui-select-007-accent) 300deg);
mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px));
-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 2px));
animation:vibeui-select-007-spin .8s linear infinite;
}
@keyframes vibeui-select-007-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="select-007"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-007-muted);
}
/* Полоска-скелет: намекает, что после загрузки список станет длиннее. */
[data-vibeui-block="select-007"] [data-part="bar"]{
flex:1 1 auto;height:0.375rem;border-radius:9999px;
background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-select-007-accent) 35%,transparent),color-mix(in oklab,var(--vibeui-select-007-border) 60%,transparent));
background-size:200% 100%;
animation:vibeui-select-007-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-select-007-slide{0%{background-position:100% 0}100%{background-position:0 0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Новосибирск",
  "Екатеринбург",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Select во время загрузки списка: поле выключено, индикатор объясняет паузу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select007({
  label = "Город доставки",
  options = DEFAULT_OPTIONS,
  loading = true,
  loadingText = "Загружаем список городов",
  placeholder = "Выберите город",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select007Props) {
  // Подложка приходит вместе с полями и скруглением: без неё поле лежит
  // прямо на странице, и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-select-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-007-surface": background,
          "--vibeui-select-007-surface-border":
            "light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265))",
          "--vibeui-select-007-surface-pad": "0.875rem",
          "--vibeui-select-007-surface-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="select-007"
        data-loading={loading}
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            {...props}
            id={id}
            disabled={loading}
            aria-busy={loading}
            defaultValue=""
          >
            <option value="" disabled>
              {loading ? loadingText + "…" : placeholder}
            </option>
            {loading
              ? null
              : options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
          </select>
          {loading ? (
            <span data-part="spinner" aria-hidden="true" />
          ) : (
            <span data-part="arrow" aria-hidden="true" />
          )}
        </span>
        {loading ? (
          <p data-part="status" role="status">
            <span data-part="bar" aria-hidden="true" />
            <span>{loadingText}</span>
          </p>
        ) : null}
      </div>
    </>
  )
}
