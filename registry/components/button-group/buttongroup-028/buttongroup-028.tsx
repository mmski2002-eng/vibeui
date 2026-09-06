import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup028Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  field?: string
  ascLabel?: string
  descLabel?: string
  ascHint?: string
  descHint?: string
  defaultValue?: "asc" | "desc"
  /** Шаблон подписи группы: {field} подставляется. */
  legendTemplate?: string
  name?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: направление сортировки как пара сегментов, где стрелка
// не подменяется другим значком, а поворачивается на 180°. Одна и та же
// фигура, повёрнутая по выбору, читается как «то же самое, но наоборот» —
// две разные картинки такого не сообщают. Поворот описан transform у
// псевдоэлемента-обёртки стрелки, поэтому анимация не трогает раскладку.
// Название поля стоит первой, неинтерактивной ячейкой той же рамки: без
// него «по возрастанию» повисает в воздухе.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-028"]){
--vibeui-buttongroup-028-surface:transparent;
--vibeui-buttongroup-028-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-028-muted:color-mix(in oklab,var(--vibeui-buttongroup-028-fg) 68%,transparent);
--vibeui-buttongroup-028-border:light-dark(oklch(0.89 0 265),oklch(0.39 0 265));
--vibeui-buttongroup-028-field:light-dark(oklch(0.975 0 265),oklch(0.31 0 265));
--vibeui-buttongroup-028-on:light-dark(oklch(0.96 0 265),oklch(0.34 0.06 39.8));
--vibeui-buttongroup-028-accent:light-dark(oklch(0.5 0.15 39.8),oklch(0.79 0.12 39.8));
--vibeui-buttongroup-028-radius:0.625rem;
--vibeui-buttongroup-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-028"]{color-scheme:dark}
[data-vibeui-block="buttongroup-028"]{
box-sizing:border-box;display:inline-block;
max-inline-size:100%;min-inline-size:0;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-028-font);
}
[data-vibeui-block="buttongroup-028"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-028"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-028"] [data-part="track"]{
display:flex;align-items:stretch;isolation:isolate;
max-inline-size:100%;overflow-x:auto;
border:1px solid var(--vibeui-buttongroup-028-border);
border-radius:var(--vibeui-buttongroup-028-radius);
background:var(--vibeui-buttongroup-028-surface);
}
[data-vibeui-block="buttongroup-028"] [data-part="field"]{
display:inline-flex;align-items:center;
height:2.25rem;padding:0 0.75rem;
border-inline-end:1px solid var(--vibeui-buttongroup-028-border);
background:var(--vibeui-buttongroup-028-field);
color:var(--vibeui-buttongroup-028-fg);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;white-space:nowrap;
}
[data-vibeui-block="buttongroup-028"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.75rem;
color:var(--vibeui-buttongroup-028-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-028"] [data-part="segment"] + [data-part="segment"]{
border-inline-start:1px solid var(--vibeui-buttongroup-028-border);
}
[data-vibeui-block="buttongroup-028"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Одна и та же стрелка, повёрнутая на 180° — «то же, но наоборот». */
[data-vibeui-block="buttongroup-028"] [data-part="arrow"]{
display:inline-flex;transition:rotate .22s cubic-bezier(.2,.7,.3,1);
}
[data-vibeui-block="buttongroup-028"] [data-dir="desc"] [data-part="arrow"]{rotate:180deg}
[data-vibeui-block="buttongroup-028"] svg{
width:0.9375rem;height:0.9375rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-028"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-028-fg)}
[data-vibeui-block="buttongroup-028"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-028-on);
color:var(--vibeui-buttongroup-028-accent);
}
[data-vibeui-block="buttongroup-028"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-028-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-028"] [data-part="hint"]{
margin:0.4375rem 0 0;
color:var(--vibeui-buttongroup-028-muted);
font-size:0.75rem;line-height:1.4;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-028"] [data-part="hint"] span{display:none}
[data-vibeui-block="buttongroup-028"]:has([data-dir="asc"] input:checked) [data-part="hint"] [data-when="asc"]{display:inline}
[data-vibeui-block="buttongroup-028"]:has([data-dir="desc"] input:checked) [data-part="hint"] [data-when="desc"]{display:inline}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-028"] *{animation:none!important;transition:none!important}}
`

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
 * Направление сортировки: одна стрелка, повёрнутая на 180°, и подпись поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup028({
  field = "Дата",
  ascLabel = "По возрастанию",
  descLabel = "По убыванию",
  ascHint = "Сначала старые: 01.04 → 30.04",
  descHint = "Сначала новые: 30.04 → 01.04",
  defaultValue = "desc",
  legendTemplate = "Сортировка: {field}",
  name = "buttongroup-028",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup028Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-028-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-028" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-028"
        className={className}
        style={palette}
      >
        <legend>{legendTemplate.replace("{field}", field)}</legend>
        <form data-part="track">
          <span data-part="field">{field}</span>
          <label data-part="segment" data-dir="asc">
            <input
              type="radio"
              name={name}
              value="asc"
              defaultChecked={defaultValue === "asc"}
            />
            <span data-part="arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 20V4M6 10l6-6 6 6" />
              </svg>
            </span>
            {ascLabel}
          </label>
          <label data-part="segment" data-dir="desc">
            <input
              type="radio"
              name={name}
              value="desc"
              defaultChecked={defaultValue === "desc"}
            />
            <span data-part="arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 20V4M6 10l6-6 6 6" />
              </svg>
            </span>
            {descLabel}
          </label>
        </form>
        <p data-part="hint">
          <span data-when="asc">{ascHint}</span>
          <span data-when="desc">{descHint}</span>
        </p>
      </fieldset>
    </>
  )
}
