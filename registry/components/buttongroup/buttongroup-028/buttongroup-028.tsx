import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup028Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  field?: string
  ascLabel?: string
  descLabel?: string
  ascHint?: string
  descHint?: string
  defaultValue?: "asc" | "desc"
  name?: string
  accent?: string
}

// Идея компонента: направление сортировки как пара сегментов, где стрелка
// не подменяется другим значком, а поворачивается на 180°. Одна и та же
// фигура, повёрнутая по выбору, читается как «то же самое, но наоборот» —
// две разные картинки такого не сообщают. Поворот описан transform у
// псевдоэлемента-обёртки стрелки, поэтому анимация не трогает раскладку.
// Название поля стоит первой, неинтерактивной ячейкой той же рамки: без
// него «по возрастанию» повисает в воздухе.
const STYLES = `
:where([data-vibeui-block="buttongroup-028"]){
--vibeui-buttongroup-028-surface:oklch(1 0 0);
--vibeui-buttongroup-028-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-028-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-028-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-028-on:oklch(0.96 0.03 265);
--vibeui-buttongroup-028-accent:oklch(0.5 0.15 265);
--vibeui-buttongroup-028-radius:0.625rem;
--vibeui-buttongroup-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-028"]{
box-sizing:border-box;display:inline-block;
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
border:1px solid var(--vibeui-buttongroup-028-border);
border-radius:var(--vibeui-buttongroup-028-radius);
background:var(--vibeui-buttongroup-028-surface);
overflow:hidden;
}
[data-vibeui-block="buttongroup-028"] [data-part="field"]{
display:inline-flex;align-items:center;
height:2.375rem;padding:0 0.75rem;
border-inline-end:1px solid var(--vibeui-buttongroup-028-border);
background:oklch(0.975 0.003 265);
color:var(--vibeui-buttongroup-028-fg);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;white-space:nowrap;
}
[data-vibeui-block="buttongroup-028"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.375rem;padding:0 0.75rem;
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
  name = "buttongroup-028",
  accent,
  className,
  style,
  ...props
}: Buttongroup028Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-028" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-028"
        className={className}
        style={palette}
      >
        <legend>Сортировка: {field}</legend>
        <div data-part="track">
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
        </div>
        <p data-part="hint">
          <span data-when="asc">{ascHint}</span>
          <span data-when="desc">{descHint}</span>
        </p>
      </fieldset>
    </>
  )
}
