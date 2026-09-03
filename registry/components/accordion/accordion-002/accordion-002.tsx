import type { ComponentProps, CSSProperties } from "react"

export type Accordion002Item = {
  question: string
  answer: string
}

/** Значок в лунке справа. `chevron` — родной для карточки. */
export type Accordion002Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

/** Чем открытая карточка отделяется от закрытых. */
export type Accordion002Elevation = "lift" | "ring" | "flat"

export type Accordion002Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion002Item[]
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  marker?: Accordion002Marker
  elevation?: Accordion002Elevation
  /** Пусто — заливки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: каждый раздел — отдельная карточка с собственной рамкой,
// а не строка в общем списке. Открытая карточка отделяется от остальных,
// поэтому видно, что это самостоятельная единица, а не часть полотна.
// Разделы независимы: в списке карточек взаимное закрытие выглядит поломкой.
//
// Фона у карточек по умолчанию нет: они лежат на фоне страницы и держатся
// одной рамкой. Тема берётся из color-scheme окружения через light-dark(),
// и тёмная ветка не инверсия светлой: тень наружу на тёмном не читается,
// поэтому подъём там набирается свечением, а не тенью.
const STYLES = `
:where([data-vibeui-block="accordion-002"]){
--vibeui-accordion-002-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-accordion-002-muted:color-mix(in oklab,var(--vibeui-accordion-002-fg) 68%,transparent);
--vibeui-accordion-002-bg:transparent;
--vibeui-accordion-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.32 0.01 265));
--vibeui-accordion-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-accordion-002-lift:light-dark(0 10px 26px -18px oklch(0.2 0.03 265 / 45%),0 0 20px -6px oklch(0.72 0.16 262 / 30%));
--vibeui-accordion-002-radius:0.875rem;
--vibeui-accordion-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;
color:var(--vibeui-accordion-002-fg);font-family:var(--vibeui-accordion-002-font);
}
[data-vibeui-block="accordion-002"] details{
border:1px solid var(--vibeui-accordion-002-border);
border-radius:var(--vibeui-accordion-002-radius);
background:var(--vibeui-accordion-002-bg);
transition:border-color .16s ease,box-shadow .18s ease,background-color .18s ease;
}
[data-vibeui-block="accordion-002"] details:hover{
border-color:color-mix(in oklab,var(--vibeui-accordion-002-accent) 25%,var(--vibeui-accordion-002-border));
}
/* Открытая карточка перестаёт быть строкой списка. Чем именно она это
   показывает — решает elevation: подъёмом, кольцом или одной рамкой. */
[data-vibeui-block="accordion-002"] details[open]{
border-color:color-mix(in oklab,var(--vibeui-accordion-002-accent) 40%,var(--vibeui-accordion-002-border));
}
[data-vibeui-block="accordion-002"][data-elevation="lift"] details[open]{
box-shadow:var(--vibeui-accordion-002-lift);
}
[data-vibeui-block="accordion-002"][data-elevation="ring"] details[open]{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-accordion-002-accent) 18%,transparent);
}
[data-vibeui-block="accordion-002"] summary{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
padding:0.9375rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-002"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-002"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-002-accent);outline-offset:-2px;
border-radius:var(--vibeui-accordion-002-radius);
}
/* Значок в круглой лунке: у карточки собственный угол, значку нужен свой.
   Лунка одна на все фигуры, поэтому смена значка не двигает заголовок. */
[data-vibeui-block="accordion-002"] [data-part="marker"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-accordion-002-border) 45%,transparent);
transition:background-color .16s ease;
}
[data-vibeui-block="accordion-002"] details[open] [data-part="marker"]{
background:color-mix(in oklab,var(--vibeui-accordion-002-accent) 14%,transparent);
}
[data-vibeui-block="accordion-002"] [data-part="marker"]::before{
content:"";display:block;
transition:transform .18s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-002"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-002-muted);
border-bottom:1.5px solid var(--vibeui-accordion-002-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-block="accordion-002"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:rotate(225deg) translate(-0.0625rem,-0.0625rem);
border-right-color:var(--vibeui-accordion-002-accent);
border-bottom-color:var(--vibeui-accordion-002-accent);
}
[data-vibeui-block="accordion-002"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;
background:var(--vibeui-accordion-002-muted);
clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-002"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:rotate(90deg);background:var(--vibeui-accordion-002-accent);
}
[data-vibeui-block="accordion-002"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-002-muted);
}
[data-vibeui-block="accordion-002"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:rotate(45deg);background:var(--vibeui-accordion-002-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-002-accent);
}
[data-vibeui-block="accordion-002"][data-marker="plus"] [data-part="marker"]::before{
width:0.625rem;height:1.5px;
background:var(--vibeui-accordion-002-muted);
box-shadow:0 0 0 0 transparent;
}
[data-vibeui-block="accordion-002"][data-marker="plus"] [data-part="marker"]{position:relative}
[data-vibeui-block="accordion-002"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;width:1.5px;height:0.625rem;
background:var(--vibeui-accordion-002-muted);
transition:transform .18s ease,opacity .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-002"][data-marker="plus"] details[open] [data-part="marker"]::before{
background:var(--vibeui-accordion-002-accent);
}
[data-vibeui-block="accordion-002"][data-marker="plus"] details[open] [data-part="marker"]::after{
transform:scaleY(0);opacity:0;
}
[data-vibeui-block="accordion-002"] [data-part="answer"]{
margin:0;padding:0 1.0625rem 1.0625rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-002-muted);max-width:62ch;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-002"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-002"] [data-part="answer"]{padding:0 1.375rem 1.25rem;font-size:0.9375rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-002"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion002Item[] = [
  {
    question: "Как устроена оплата?",
    answer:
      "Помесячно или за год. Год дешевле на два месяца, счёт выставляется сразу, отказаться можно в любой момент — остаток вернём пропорционально.",
  },
  {
    question: "Данные в безопасности?",
    answer:
      "Шифрование при передаче и в хранилище, ежедневные резервные копии за последние 30 дней, доступ по ролям. Ключи хранятся отдельно от данных.",
  },
  {
    question: "Какие интеграции поддерживаются?",
    answer:
      "Готовые связки с почтой, платежами и аналитикой. Всё остальное — через веб-хуки и открытый API, ключи выдаются в настройках проекта.",
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая карточка досталась бы тексту
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
 * Аккордеон из отдельных карточек: открытая отделяется от остальных.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion002({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  marker = "chevron",
  elevation = "lift",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion002Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-002"
        data-marker={marker}
        data-elevation={elevation}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.question} open={index === defaultOpen}>
            <summary>
              {item.question}
              {marker === "none" ? null : (
                <span data-part="marker" aria-hidden="true" />
              )}
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
