import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup047Kind = {
  id: string
  short: string
  label: string
  hue: number
}

export type Buttongroup047Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  kinds?: Buttongroup047Kind[]
  defaultValue?: string[]
  label?: string
  name?: string
  /** Пусто — заливки нет, чипы ложатся на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтр по типу файла, где вместо значка стоит расширение
// текстом. Три буквы читаются однозначно, а «лист бумаги с загнутым углом»
// одинаков у всех типов и не различается на 16 пикселях. Цвет плашки
// приходит числом оттенка и подставляется в oklch через одну инлайновую
// переменную: так палитра остаётся одной формулой, а не набором хардкодов.
// Выбор множественный — на checkbox: типы складываются. Пилюли переносятся
// по строкам, поэтому список расширений можно расширять без переделки.
const STYLES = `
:where([data-vibeui-block="buttongroup-047"]){
--vibeui-buttongroup-047-surface:transparent;
--vibeui-buttongroup-047-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-047-muted:color-mix(in oklab,var(--vibeui-buttongroup-047-fg) 68%,transparent);
--vibeui-buttongroup-047-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-047-line:light-dark(oklch(0.8 0 265),oklch(0.56 0 265));
--vibeui-buttongroup-047-on:light-dark(oklch(0.97 0 265),oklch(0.32 0 265));
--vibeui-buttongroup-047-accent:light-dark(oklch(0.42 0 265),oklch(0.82 0 265));
--vibeui-buttongroup-047-hue:265;
--vibeui-buttongroup-047-radius:0.5rem;
--vibeui-buttongroup-047-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-047"]{color-scheme:dark}
[data-vibeui-block="buttongroup-047"]{
box-sizing:border-box;display:block;width:100%;max-width:28rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-047-font);
}
[data-vibeui-block="buttongroup-047"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-047"] legend{
padding:0;margin:0 0 0.5rem;float:left;width:100%;clear:both;
color:var(--vibeui-buttongroup-047-muted);
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="buttongroup-047"] [data-part="track"]{
display:flex;flex-wrap:wrap;gap:0.375rem;clear:both;
}
[data-vibeui-block="buttongroup-047"] [data-part="chip"]{
position:relative;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.6875rem 0 0.3125rem;
border:1px solid var(--vibeui-buttongroup-047-border);
border-radius:var(--vibeui-buttongroup-047-radius);
background:var(--vibeui-buttongroup-047-surface);
color:var(--vibeui-buttongroup-047-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:border-color .16s ease,color .16s ease,background-color .16s ease;
}
[data-vibeui-block="buttongroup-047"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Плашка расширения: цвет — одна формула от оттенка. */
[data-vibeui-block="buttongroup-047"] [data-part="ext"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:2.0625rem;height:1.5rem;padding:0 0.3125rem;
border-radius:0.3125rem;
background:light-dark(oklch(0.94 0.06 var(--vibeui-buttongroup-047-hue)),oklch(0.38 0.07 var(--vibeui-buttongroup-047-hue)));
color:light-dark(oklch(0.42 0.15 var(--vibeui-buttongroup-047-hue)),oklch(0.9 0.09 var(--vibeui-buttongroup-047-hue)));
font-size:0.625rem;font-weight:800;letter-spacing:0.04em;
}
[data-vibeui-block="buttongroup-047"] [data-part="chip"]:hover{
border-color:var(--vibeui-buttongroup-047-line);color:var(--vibeui-buttongroup-047-fg);
}
[data-vibeui-block="buttongroup-047"] [data-part="chip"]:has(input:checked){
border-color:var(--vibeui-buttongroup-047-accent);
background:var(--vibeui-buttongroup-047-on);
color:var(--vibeui-buttongroup-047-fg);
box-shadow:inset 0 0 0 1px var(--vibeui-buttongroup-047-accent);
}
[data-vibeui-block="buttongroup-047"] [data-part="chip"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-047-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-047"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_KINDS: Buttongroup047Kind[] = [
  { id: "pdf", short: "PDF", label: "Документы PDF", hue: 25 },
  { id: "doc", short: "DOC", label: "Тексты", hue: 250 },
  { id: "xls", short: "XLS", label: "Таблицы", hue: 150 },
  { id: "img", short: "IMG", label: "Изображения", hue: 300 },
  { id: "zip", short: "ZIP", label: "Архивы", hue: 80 },
]

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
 * Фильтр по типу файла: вместо значка — расширение текстом на цветной плашке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup047({
  kinds = DEFAULT_KINDS,
  defaultValue = ["pdf", "img"],
  label = "Тип файла",
  name = "buttongroup-047",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup047Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-047-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-047-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-047" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-047"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {kinds.map((kind) => (
            <label
              key={kind.id}
              data-part="chip"
              style={
                { "--vibeui-buttongroup-047-hue": kind.hue } as CSSProperties
              }
            >
              <input
                type="checkbox"
                name={`${name}-${kind.id}`}
                value={kind.id}
                defaultChecked={defaultValue.includes(kind.id)}
              />
              <span data-part="ext" aria-hidden="true">
                {kind.short}
              </span>
              <span>{kind.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
