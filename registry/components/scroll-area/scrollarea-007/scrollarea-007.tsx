import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollarea007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  height?: string
  /** Ширина полосы прокрутки в запасном варианте на WebKit. */
  barWidth?: string
}

// Идея компонента: тонкая полоса прокрутки объявлена дважды. Сначала
// стандартными scrollbar-width и scrollbar-color — их понимают Firefox и
// свежие Chrome с Safari. Потом, под @supports not, тот же вид собирается
// псевдоэлементами ::-webkit-scrollbar для старых сборок. Полосу не прячем:
// без неё исчезает и признак прокрутки, и возможность тащить её мышью.
const STYLES = `
:where([data-vibeui-block="scrollarea-007"]){
--vibeui-scrollarea-007-bg:oklch(1 0 0);
--vibeui-scrollarea-007-fg:oklch(0.26 0.014 265);
--vibeui-scrollarea-007-muted:oklch(0.55 0.014 265);
--vibeui-scrollarea-007-border:oklch(0.9 0.006 265);
--vibeui-scrollarea-007-thumb:oklch(0.78 0.02 265);
--vibeui-scrollarea-007-thumb-hover:oklch(0.66 0.03 265);
--vibeui-scrollarea-007-track:oklch(0.96 0.004 265);
--vibeui-scrollarea-007-accent:oklch(0.55 0.17 265);
--vibeui-scrollarea-007-height:12rem;
--vibeui-scrollarea-007-bar:0.5rem;
--vibeui-scrollarea-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollarea-007"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-007-bg);
border:1px solid var(--vibeui-scrollarea-007-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-007-font);color:var(--vibeui-scrollarea-007-fg);
}
[data-vibeui-block="scrollarea-007"] [data-part="head"]{
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-scrollarea-007-border);
font-size:0.8125rem;font-weight:650;
}
/* Стандартный путь: две строки вместо четырёх псевдоэлементов. */
[data-vibeui-block="scrollarea-007"] [data-part="area"]{
height:var(--vibeui-scrollarea-007-height);
overflow-y:auto;overscroll-behavior:contain;
scrollbar-width:thin;
scrollbar-color:var(--vibeui-scrollarea-007-thumb) var(--vibeui-scrollarea-007-track);
scrollbar-gutter:stable;
}
[data-vibeui-block="scrollarea-007"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-007-accent);outline-offset:-2px;
}
/* Запасной вариант для сборок без scrollbar-width: тот же вид на WebKit. */
@supports not (scrollbar-width: thin){
[data-vibeui-block="scrollarea-007"] [data-part="area"]::-webkit-scrollbar{
width:var(--vibeui-scrollarea-007-bar);
}
[data-vibeui-block="scrollarea-007"] [data-part="area"]::-webkit-scrollbar-track{
background:var(--vibeui-scrollarea-007-track);
}
[data-vibeui-block="scrollarea-007"] [data-part="area"]::-webkit-scrollbar-thumb{
background:var(--vibeui-scrollarea-007-thumb);
border-radius:9999px;
border:2px solid var(--vibeui-scrollarea-007-track);
}
[data-vibeui-block="scrollarea-007"] [data-part="area"]::-webkit-scrollbar-thumb:hover{
background:var(--vibeui-scrollarea-007-thumb-hover);
}
}
[data-vibeui-block="scrollarea-007"] [data-part="body"]{
margin:0;padding:0.875rem;
font-size:0.8125rem;line-height:1.55;
}
[data-vibeui-block="scrollarea-007"] [data-part="body"] p{margin:0 0 0.75rem}
[data-vibeui-block="scrollarea-007"] [data-part="body"] p:last-child{margin-bottom:0}
[data-vibeui-block="scrollarea-007"] [data-part="foot"]{
padding:0.5rem 0.875rem;border-top:1px solid var(--vibeui-scrollarea-007-border);
font-size:0.6875rem;color:var(--vibeui-scrollarea-007-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-007"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TEXT = [
  "Компонент устанавливается одной командой и после установки живёт в вашем проекте: файл ваш, править его можно как угодно.",
  "Палитра объявлена локальными переменными, поэтому блок выглядит одинаково и в тёмной, и в светлой теме проекта-хозяина.",
  "Полосу прокрутки мы намеренно оставляем видимой: она единственная показывает, сколько текста осталось ниже.",
  "Ширина полосы задаётся переменной, поэтому её можно подогнать под плотность интерфейса, не трогая остальные правила.",
  "Всё остальное — обычный поток текста: никакой виртуализации, никакой синхронизации позиций, ноль клиентского кода.",
].join("\n\n")

/**
 * Область с тонкой стилизованной полосой прокрутки и запасным вариантом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea007({
  title = "Условия использования",
  text = DEFAULT_TEXT,
  height = "12rem",
  barWidth = "0.5rem",
  className,
  style,
  ...props
}: Scrollarea007Props) {
  const paragraphs = text.split("\n\n").filter(Boolean)
  const palette = {
    "--vibeui-scrollarea-007-height": height,
    "--vibeui-scrollarea-007-bar": barWidth,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollarea-007"
        className={className}
        style={palette}
      >
        <div data-part="head">{title}</div>
        <div data-part="area" tabIndex={0} role="region" aria-label={title}>
          <div data-part="body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div data-part="foot">Полоса прокрутки остаётся видимой</div>
      </div>
    </>
  )
}
