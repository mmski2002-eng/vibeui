import type { ComponentProps, CSSProperties } from "react"

export type Accordion001Item = {
  question: string
  answer: string
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion001Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

export type Accordion001Divider = "line" | "dashed" | "none"

export type Accordion001Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion001Item[]
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /**
   * Имя группы взаимного исключения. Двум аккордеонам на одной странице
   * нужны разные имена, иначе они делят одну радиогруппу.
   */
  group?: string
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  marker?: Accordion001Marker
  divider?: Accordion001Divider
  /** Пусто — фона нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: аккордеон без единой строки JS, где всю работу делают
// типографика, вертикальный ритм и линия под открытым заголовком. Ни рамки,
// ни плашки: список живёт прямо на странице.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="accordion-001"]){
--vibeui-accordion-001-fg:light-dark(oklch(0.2 0.016 255),oklch(0.94 0.005 255));
--vibeui-accordion-001-muted:color-mix(in oklab,var(--vibeui-accordion-001-fg) 68%,transparent);
--vibeui-accordion-001-rule:light-dark(oklch(0.9 0.009 250),oklch(0.31 0.01 250));
--vibeui-accordion-001-accent:light-dark(oklch(0.5 0.095 195),oklch(0.75 0.11 195));
--vibeui-accordion-001-bg:transparent;
--vibeui-accordion-001-pad:0.5rem 0 0.75rem;
--vibeui-accordion-001-radius:0;
--vibeui-accordion-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-001"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;
padding:var(--vibeui-accordion-001-pad);
background:var(--vibeui-accordion-001-bg);
border-radius:var(--vibeui-accordion-001-radius);
color:var(--vibeui-accordion-001-fg);
font-family:var(--vibeui-accordion-001-font);
}
/* Граница строки всегда занимает свой пиксель: переключение разделителей
   не должно двигать раскладку. */
[data-vibeui-block="accordion-001"] summary{
padding:0.9375rem 0 0.9375rem 0.25rem;cursor:pointer;
font-size:0.9375rem;font-weight:500;letter-spacing:-0.01em;line-height:1.45;
border-bottom:1px solid transparent;
transition:padding-left .14s ease;
}
[data-vibeui-block="accordion-001"][data-divider="line"] summary{
border-bottom-color:var(--vibeui-accordion-001-rule);
}
[data-vibeui-block="accordion-001"][data-divider="dashed"] summary{
border-bottom-style:dashed;border-bottom-color:var(--vibeui-accordion-001-rule);
}
[data-vibeui-block="accordion-001"] summary:hover{padding-left:0.625rem}
/* Открытый раздел подчёркнут, а не подсвечен фоном: тенью, чтобы линия
   не прибавляла высоту строке. */
[data-vibeui-block="accordion-001"] details[open] summary{
box-shadow:0 1px 0 var(--vibeui-accordion-001-fg);
}
[data-vibeui-block="accordion-001"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-001-accent);outline-offset:2px;
}
[data-vibeui-block="accordion-001"] summary{
display:flex;align-items:center;gap:0.75rem;list-style:none;
}
[data-vibeui-block="accordion-001"] summary::-webkit-details-marker{display:none}
/* Своя фигура живёт в постоянном боксе, поэтому текст начинается на одном
   и том же месте при любом значке. */
[data-vibeui-block="accordion-001"] [data-part="marker"]{
width:0.625rem;height:0.625rem;flex:none;
transition:transform .18s ease,background .18s ease;
}
/* Шеврон нарисован двумя гранями квадрата: одна фигура, один поворот. */
[data-vibeui-block="accordion-001"][data-marker="chevron"] [data-part="marker"]{
position:relative;
}
[data-vibeui-block="accordion-001"][data-marker="chevron"] [data-part="marker"]::before{
content:"";position:absolute;top:50%;left:50%;
width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-accordion-001-accent);
border-bottom:1.5px solid var(--vibeui-accordion-001-accent);
transform:translate(-70%,-50%) rotate(-45deg);
transition:transform .18s ease;
}
[data-vibeui-block="accordion-001"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
}
[data-vibeui-block="accordion-001"][data-marker="triangle"] [data-part="marker"]{
background:var(--vibeui-accordion-001-accent);
clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-001"][data-marker="triangle"] details[open] [data-part="marker"]{
transform:rotate(90deg);
}
[data-vibeui-block="accordion-001"][data-marker="square"] [data-part="marker"]{
border-radius:1px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-001-accent);
}
[data-vibeui-block="accordion-001"][data-marker="square"] details[open] [data-part="marker"]{
background:var(--vibeui-accordion-001-accent);transform:rotate(45deg);
}
[data-vibeui-block="accordion-001"][data-marker="plus"] [data-part="marker"]{
position:relative;
}
[data-vibeui-block="accordion-001"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-001"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;inset:calc(50% - 0.75px) 0 auto;height:1.5px;
background:var(--vibeui-accordion-001-accent);
transition:transform .18s ease;
}
[data-vibeui-block="accordion-001"][data-marker="plus"] [data-part="marker"]::after{
transform:rotate(90deg);
}
[data-vibeui-block="accordion-001"][data-marker="plus"] details[open] [data-part="marker"]::after{
transform:rotate(0deg);
}
[data-vibeui-block="accordion-001"] [data-part="answer"]{
margin:0;padding:0.75rem 0 1.0625rem 1.625rem;max-width:66ch;
font-size:0.875rem;line-height:1.75;color:var(--vibeui-accordion-001-muted);
}
[data-vibeui-block="accordion-001"][data-marker="none"] [data-part="answer"]{
padding-left:0.25rem;
}
/* Общая шкала категории: на широкой раскладке строка и ответ подрастают
   на один шаг, тот же, что у соседних аккордеонов. */
@container (min-width: 32rem){
[data-vibeui-block="accordion-001"] summary{padding:1.0625rem 0 1.0625rem 0.25rem;font-size:1rem}
[data-vibeui-block="accordion-001"] [data-part="answer"]{font-size:0.9375rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-001"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion001Item[] = [
  {
    question: "Что именно я получаю после установки?",
    answer:
      "Один файл компонента в вашем проекте. Тот же самый, который вы видели в превью: ни сборки, ни обёрток, ни привязки к нашей теме.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Компонент несёт собственную палитру в локальных переменных. Переопределите их — и он встанет в вашу тему, не трогая остальной проект.",
  },
  {
    question: "Нужно ли ставить дополнительные библиотеки?",
    answer:
      "Нет. Зависимости объявлены в метаданных каждого компонента, и у большинства их ноль: только React.",
  },
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
 * Аккордеон на нативных details/summary: раскрытие без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion001({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-001",
  defaultOpen = -1,
  marker = "chevron",
  divider = "line",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion001Props) {
  // Фон появляется вместе с внутренними отступами: без фона компонент лежит
  // прямо на странице и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-accordion-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-001-bg": background,
          "--vibeui-accordion-001-pad": "0.75rem 1.25rem 1rem",
          "--vibeui-accordion-001-radius": "0.5rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-001"
        data-marker={marker}
        data-divider={divider}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details
            key={item.question}
            name={exclusive ? group : undefined}
            open={index === defaultOpen}
          >
            <summary>
              {marker === "none" ? null : (
                <span data-part="marker" aria-hidden="true" />
              )}
              {item.question}
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
