import type { ComponentProps, CSSProperties } from "react"

export type Checkbox001Props = Omit<
  ComponentProps<"input">,
  "type" | "size"
> & {
  label?: string
  /** Пояснение под подписью. Кликается вместе с ней. */
  description?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кликабельна вся строка, а не квадратик 16×16. Галка
// рисуется двумя гранями и появляется прочерком времени, а не картинкой:
// иконочная библиотека не нужна, состояние держит нативный input.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// вместе со страницей и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="checkbox-001"]){
--vibeui-checkbox-001-surface:transparent;
--vibeui-checkbox-001-pull:-0.625rem -0.75rem;
--vibeui-checkbox-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-checkbox-001-muted:color-mix(in oklab,var(--vibeui-checkbox-001-fg) 68%,transparent);
--vibeui-checkbox-001-bg:light-dark(oklch(1 0 0),oklch(0.27 0 265));
--vibeui-checkbox-001-border:light-dark(oklch(0.82 0 265),oklch(0.5 0 265));
--vibeui-checkbox-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.71 0.16 262));
--vibeui-checkbox-001-mark:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-checkbox-001-hover:light-dark(oklch(0.55 0 265 / 7%),oklch(0.85 0 265 / 10%));
--vibeui-checkbox-001-radius:0.625rem;
--vibeui-checkbox-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-001"]{color-scheme:dark}
/* Подложки по умолчанию нет: строка ложится на фон страницы, а отрицательные
   поля возвращают её к общей сетке формы. */
[data-vibeui-block="checkbox-001"]{
box-sizing:border-box;
background:var(--vibeui-checkbox-001-surface);
display:flex;align-items:flex-start;gap:0.625rem;
padding:0.625rem 0.75rem;margin:var(--vibeui-checkbox-001-pull);
border-radius:var(--vibeui-checkbox-001-radius);cursor:pointer;
font-family:var(--vibeui-checkbox-001-font);color:var(--vibeui-checkbox-001-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="checkbox-001"]:hover:not(:has(input:disabled)){background:var(--vibeui-checkbox-001-hover)}
[data-vibeui-block="checkbox-001"]:has(input:disabled){cursor:not-allowed;opacity:.55}
[data-vibeui-block="checkbox-001"] input{
appearance:none;-webkit-appearance:none;
flex:none;margin:0.0625rem 0 0;width:1.125rem;height:1.125rem;
border:1.5px solid var(--vibeui-checkbox-001-border);border-radius:0.375rem;
background:var(--vibeui-checkbox-001-bg);cursor:inherit;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="checkbox-001"] input:checked{
background:var(--vibeui-checkbox-001-accent);
border-color:var(--vibeui-checkbox-001-accent);
}
[data-vibeui-block="checkbox-001"] input:focus-visible{
outline:2px solid var(--vibeui-checkbox-001-accent);outline-offset:2px;
}
[data-vibeui-block="checkbox-001"] [data-part="box"]{position:relative;display:flex;flex:none}
/* Галка — две грани квадрата, повёрнутые на 45°; растёт из нуля при отметке. */
[data-vibeui-block="checkbox-001"] [data-part="mark"]{
position:absolute;left:0.375rem;top:0.1875rem;
width:0.3125rem;height:0.5625rem;pointer-events:none;
border-right:2px solid var(--vibeui-checkbox-001-mark);
border-bottom:2px solid var(--vibeui-checkbox-001-mark);
transform:rotate(45deg) scale(0.4);transform-origin:center;
opacity:0;transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="checkbox-001"] input:checked + [data-part="mark"]{opacity:1;transform:rotate(45deg) scale(1)}
[data-vibeui-block="checkbox-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="checkbox-001"] [data-part="title"]{font-size:0.875rem;line-height:1.35}
[data-vibeui-block="checkbox-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-checkbox-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-001"] *{animation:none!important;transition:none!important}}
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
 * Чекбокс со строкой-мишенью: подпись, пояснение и галка на чистом CSS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox001({
  label = "Присылать отчёты",
  description = "Раз в неделю, коротким письмом. Отключается в любой момент.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox001Props) {
  // С подложкой отрицательные поля не нужны: плашка обязана держаться
  // в границах колонки, а не вылезать за неё.
  const palette = {
    ...(accent ? { "--vibeui-checkbox-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-001-surface": background,
          "--vibeui-checkbox-001-pull": "0",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-checkbox-001" precedence="medium">
        {STYLES}
      </style>
      <label
        data-slot="checkbox"
        data-vibeui-block="checkbox-001"
        className={className}
        style={palette}
      >
        <span data-part="box">
          <input {...props} type="checkbox" />
          <span data-part="mark" aria-hidden="true" />
        </span>
        <span data-part="text">
          <span data-part="title">{label}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
      </label>
    </>
  )
}
