import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup035Props = Omit<ComponentProps<"div">, "children"> & {
  actions?: string[]
  extra?: string[]
  moreLabel?: string
  label?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: редкие действия не уезжают в выпадающее меню, а
// раскрываются вправо, оставаясь частью той же сцепки. Раскрытие держит
// details/summary: состояние, клавиатура и объявление «свёрнуто/развёрнуто»
// достаются от браузера, JS не нужен. details выложен flex-строкой, поэтому
// summary остаётся кнопкой сцепки, а раскрытые кнопки встают справа от неё
// в общий ряд, а не блоком под ним. Стрелка на summary поворачивается по
// [open], маркер списка убран через ::marker и ::-webkit-details-marker.
const STYLES = `
:where([data-vibeui-block="buttongroup-035"]){
--vibeui-buttongroup-035-surface:transparent;
--vibeui-buttongroup-035-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-035-muted:color-mix(in oklab,var(--vibeui-buttongroup-035-fg) 68%,transparent);
--vibeui-buttongroup-035-border:light-dark(oklch(0.88 0 265),oklch(0.39 0 265));
--vibeui-buttongroup-035-hover:light-dark(oklch(0.965 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-035-on:light-dark(oklch(0.97 0 265),oklch(0.34 0.06 39.8));
--vibeui-buttongroup-035-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.79 0.13 39.8));
--vibeui-buttongroup-035-radius:0.625rem;
--vibeui-buttongroup-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-035"]{color-scheme:dark}
[data-vibeui-block="buttongroup-035"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-035-border);
border-radius:var(--vibeui-buttongroup-035-radius);
background:var(--vibeui-buttongroup-035-surface);
font-family:var(--vibeui-buttongroup-035-font);
}
[data-vibeui-block="buttongroup-035"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-035"] button,
[data-vibeui-block="buttongroup-035"] summary{
appearance:none;cursor:pointer;font:inherit;list-style:none;
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.8125rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-035-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-035"] summary::marker{content:""}
[data-vibeui-block="buttongroup-035"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="buttongroup-035"] button:hover,
[data-vibeui-block="buttongroup-035"] summary:hover{background:var(--vibeui-buttongroup-035-hover)}
[data-vibeui-block="buttongroup-035"] button:focus-visible,
[data-vibeui-block="buttongroup-035"] summary:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-035-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-035"] [data-part="base"] button + button,
[data-vibeui-block="buttongroup-035"] details,
[data-vibeui-block="buttongroup-035"] [data-part="extra"] button{
border-inline-start:1px solid var(--vibeui-buttongroup-035-border);
}
[data-vibeui-block="buttongroup-035"] [data-part="base"]{display:flex}
[data-vibeui-block="buttongroup-035"] [data-part="base"] button:first-child{
border-start-start-radius:calc(var(--vibeui-buttongroup-035-radius) - 1px);
border-end-start-radius:calc(var(--vibeui-buttongroup-035-radius) - 1px);
}
/* details выложен строкой: summary остаётся ячейкой сцепки. */
[data-vibeui-block="buttongroup-035"] details{display:flex;align-items:stretch}
[data-vibeui-block="buttongroup-035"] [data-part="extra"]{display:flex}
[data-vibeui-block="buttongroup-035"] [data-part="extra"] button:last-child{
border-start-end-radius:calc(var(--vibeui-buttongroup-035-radius) - 1px);
border-end-end-radius:calc(var(--vibeui-buttongroup-035-radius) - 1px);
}
[data-vibeui-block="buttongroup-035"] details:not([open]) summary{
border-start-end-radius:calc(var(--vibeui-buttongroup-035-radius) - 1px);
border-end-end-radius:calc(var(--vibeui-buttongroup-035-radius) - 1px);
}
[data-vibeui-block="buttongroup-035"] summary{color:var(--vibeui-buttongroup-035-muted)}
[data-vibeui-block="buttongroup-035"] details[open] summary{
color:var(--vibeui-buttongroup-035-accent);background:var(--vibeui-buttongroup-035-on);
}
[data-vibeui-block="buttongroup-035"] summary svg{
width:0.875rem;height:0.875rem;
stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;
transition:rotate .18s ease;
}
[data-vibeui-block="buttongroup-035"] details[open] summary svg{rotate:180deg}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-035"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Ответить", "Переслать"]
const DEFAULT_EXTRA = ["В архив", "Спам", "Напомнить"]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Сцепка, которая раскрывает редкие действия вправо, оставаясь одной деталью.
 * Один файл, ноль зависимостей, серверный компонент на details/summary.
 */
export function Buttongroup035({
  actions = DEFAULT_ACTIONS,
  extra = DEFAULT_EXTRA,
  moreLabel = "Ещё",
  label = "Действия над письмом",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup035Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-035-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-035-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-035" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-035"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        <div data-part="base">
          {actions.map((action) => (
            <button key={action} type="button">
              {action}
            </button>
          ))}
        </div>
        <details>
          <summary>
            {moreLabel}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div data-part="extra">
            {extra.map((action) => (
              <button key={action} type="button">
                {action}
              </button>
            ))}
          </div>
        </details>
      </div>
    </>
  )
}
