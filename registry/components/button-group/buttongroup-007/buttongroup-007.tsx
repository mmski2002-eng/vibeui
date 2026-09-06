import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup007Action = {
  label: string
  hint?: string
}

export type Buttongroup007Props = Omit<ComponentProps<"div">, "children"> & {
  actions?: Buttongroup007Action[]
  label?: string
  width?: number
  /** Пусто — подложки нет, столбец лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в узкой колонке горизонтальная группа рвётся на две
// строки и перестаёт читаться как одна деталь. Здесь она сложена в столбец:
// кнопки во всю ширину, границы схлопнуты по вертикали, скругления остались
// только у верхней и нижней. Подпись прижата к левому краю, подсказка — к
// правому: так глаз идёт по одной колонке названий, а не по центру.
const STYLES = `
:where([data-vibeui-block="buttongroup-007"]){
--vibeui-buttongroup-007-surface:transparent;
--vibeui-buttongroup-007-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-007-muted:color-mix(in oklab,var(--vibeui-buttongroup-007-fg) 68%,transparent);
--vibeui-buttongroup-007-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-007-hover:light-dark(oklch(0.965 0 265),oklch(0.3 0 265));
--vibeui-buttongroup-007-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-buttongroup-007-radius:0.75rem;
--vibeui-buttongroup-007-width:16rem;
--vibeui-buttongroup-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-007"]{color-scheme:dark}
[data-vibeui-block="buttongroup-007"]{
box-sizing:border-box;display:flex;flex-direction:column;isolation:isolate;
width:100%;max-width:var(--vibeui-buttongroup-007-width);
font-family:var(--vibeui-buttongroup-007-font);
}
[data-vibeui-block="buttongroup-007"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-007"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:flex;align-items:center;gap:0.625rem;
width:100%;min-height:2.25rem;padding:0 0.75rem;margin-block-start:-1px;
border:1px solid var(--vibeui-buttongroup-007-border);
background:var(--vibeui-buttongroup-007-surface);
color:var(--vibeui-buttongroup-007-fg);
font-size:0.8125rem;font-weight:600;line-height:1.3;text-align:start;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-007"] button:first-child{
margin-block-start:0;
border-start-start-radius:var(--vibeui-buttongroup-007-radius);
border-start-end-radius:var(--vibeui-buttongroup-007-radius);
}
[data-vibeui-block="buttongroup-007"] button:last-child{
border-end-start-radius:var(--vibeui-buttongroup-007-radius);
border-end-end-radius:var(--vibeui-buttongroup-007-radius);
}
[data-vibeui-block="buttongroup-007"] button:hover{z-index:1;background:var(--vibeui-buttongroup-007-hover)}
/* Соседняя кнопка перекрывает нижнюю границу текущей, поэтому обводке
   фокуса нужен свой слой — иначе она видна только сверху. */
[data-vibeui-block="buttongroup-007"] button:focus-visible{
z-index:2;
outline:2px solid var(--vibeui-buttongroup-007-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-007"] [data-part="dot"]{
width:0.375rem;height:0.375rem;flex:none;border-radius:9999px;
background:var(--vibeui-buttongroup-007-accent);opacity:.35;
}
[data-vibeui-block="buttongroup-007"] button:hover [data-part="dot"]{opacity:1}
[data-vibeui-block="buttongroup-007"] [data-part="name"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="buttongroup-007"] [data-part="hint"]{
flex:none;color:var(--vibeui-buttongroup-007-muted);
font-size:0.75rem;font-weight:500;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Buttongroup007Action[] = [
  { label: "Переименовать", hint: "F2" },
  { label: "Переместить", hint: "Ctrl+M" },
  { label: "Скачать копию", hint: "2,4 МБ" },
  { label: "История версий", hint: "12" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Вертикальная группа кнопок во всю ширину узкой колонки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup007({
  actions = DEFAULT_ACTIONS,
  label = "Операции с файлом",
  width = 16,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup007Props) {
  const palette = {
    "--vibeui-buttongroup-007-width": `${width}rem`,
    ...(accent ? { "--vibeui-buttongroup-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-007"
        role="group"
        aria-label={label}
        className={className}
        style={palette}
      >
        {actions.map((action) => (
          <button key={action.label} type="button">
            <span data-part="dot" aria-hidden="true" />
            <span data-part="name">{action.label}</span>
            {action.hint ? <span data-part="hint">{action.hint}</span> : null}
          </button>
        ))}
      </div>
    </>
  )
}
