import type { ComponentProps, CSSProperties } from "react"

export type Accordion011Item = {
  question: string
  answer: string
}

/** Значок в круге. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion011Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

/** Чем подсвечен открытый раздел. Тени на тёмном не работают. */
export type Accordion011Glow = "edge" | "ring" | "none"

export type Accordion011Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion011Item[]
  defaultOpen?: number
  /** Открытым остаётся только один раздел. */
  exclusive?: boolean
  /**
   * Имя группы взаимного исключения. Двум аккордеонам на одной странице
   * нужны разные имена, иначе они делят одну радиогруппу.
   */
  group?: string
  marker?: Accordion011Marker
  glow?: Accordion011Glow
  accent?: string
}

// Идея компонента: тёмный аккордеон для тёмных секций страницы. Светлый
// вариант на тёмном фоне выглядит вырезанной наклейкой, поэтому здесь своя
// тёмная палитра, а не инверсия готовой. Открытый раздел подсвечивается
// изнутри градиентом от края — тени на тёмном фоне не работают.
const STYLES = `
:where([data-vibeui-block="accordion-011"]){
--vibeui-accordion-011-fg:oklch(0.97 0.003 265);
--vibeui-accordion-011-muted:color-mix(in oklab,var(--vibeui-accordion-011-fg) 68%,transparent);
--vibeui-accordion-011-bg:oklch(0.21 0.018 265);
--vibeui-accordion-011-raised:oklch(0.25 0.02 265);
--vibeui-accordion-011-border:oklch(1 0 0 / 12%);
--vibeui-accordion-011-accent:oklch(0.72 0.16 195);
--vibeui-accordion-011-radius:0.875rem;
--vibeui-accordion-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-011"]{
display:flex;flex-direction:column;
width:100%;max-width:42rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-accordion-011-border);
border-radius:var(--vibeui-accordion-011-radius);
background:var(--vibeui-accordion-011-bg);
color:var(--vibeui-accordion-011-fg);font-family:var(--vibeui-accordion-011-font);
}
[data-vibeui-block="accordion-011"] details{position:relative;transition:background-color .18s ease}
[data-vibeui-block="accordion-011"] details + details{border-top:1px solid var(--vibeui-accordion-011-border)}
[data-vibeui-block="accordion-011"] details:hover{background:oklch(1 0 0 / 3%)}
/* Открытый раздел светится изнутри: тень на тёмном фоне не читается.
   Чем именно — решает glow. */
[data-vibeui-block="accordion-011"] details[open]{background:var(--vibeui-accordion-011-raised)}
[data-vibeui-block="accordion-011"][data-glow="edge"] details[open]{
background:
linear-gradient(90deg,color-mix(in oklab,var(--vibeui-accordion-011-accent) 10%,transparent),transparent 45%),
var(--vibeui-accordion-011-raised);
}
[data-vibeui-block="accordion-011"][data-glow="ring"] details[open]{
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-accordion-011-accent) 35%,transparent);
}
[data-vibeui-block="accordion-011"] summary{
display:flex;align-items:center;gap:0.875rem;
padding:0.9375rem 1.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-011"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-011"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-011-accent);outline-offset:-2px}
[data-vibeui-block="accordion-011"] [data-part="question"]{flex:1 1 auto;min-width:0}
/* Значок в круге: на тёмном фоне тонкая грань теряется без подложки.
   Круг один на все фигуры, поэтому смена значка не двигает заголовок. */
[data-vibeui-block="accordion-011"] [data-part="marker"]{
position:relative;display:flex;align-items:center;justify-content:center;flex:none;
width:1.625rem;height:1.625rem;border-radius:9999px;
border:1px solid var(--vibeui-accordion-011-border);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-011"] details[open] [data-part="marker"]{
background:color-mix(in oklab,var(--vibeui-accordion-011-accent) 18%,transparent);
border-color:color-mix(in oklab,var(--vibeui-accordion-011-accent) 45%,transparent);
}
[data-vibeui-block="accordion-011"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .18s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-011"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-011-muted);
border-bottom:1.5px solid var(--vibeui-accordion-011-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-011"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-011-accent);
border-bottom-color:var(--vibeui-accordion-011-accent);
}
[data-vibeui-block="accordion-011"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-011-muted);clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-011"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-011-accent);
}
[data-vibeui-block="accordion-011"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-011-muted);
}
[data-vibeui-block="accordion-011"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-011-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-011-accent);
}
[data-vibeui-block="accordion-011"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-011"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:50%;top:50%;
width:0.625rem;height:1.5px;margin:-0.75px 0 0 -0.3125rem;border-radius:1px;transform:none;
background:var(--vibeui-accordion-011-muted);
transition:transform .18s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-011"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-011"][data-marker="plus"] details[open] [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-011"][data-marker="plus"] details[open] [data-part="marker"]::before,
[data-vibeui-block="accordion-011"][data-marker="plus"] details[open] [data-part="marker"]::after{background:var(--vibeui-accordion-011-accent)}
[data-vibeui-block="accordion-011"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem 1.125rem;
font-size:0.875rem;line-height:1.65;color:var(--vibeui-accordion-011-muted);max-width:62ch;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-011"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-011"] [data-part="answer"]{padding:0 1.375rem 1.25rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion011Item[] = [
  {
    question: "Компонент подойдёт для тёмной секции?",
    answer:
      "Этот — да: у него собственная тёмная палитра, а не инверсия светлой. Светлый аккордеон на тёмном фоне выглядит вырезанной наклейкой, поэтому вариантов два, и выбирается тот, что совпадает с секцией.",
  },
  {
    question: "Как переопределить цвета под свой бренд?",
    answer:
      "Задайте переменные --vibeui-accordion-011-* у любого родителя. Они объявлены в :where() с нулевой специфичностью, поэтому перебиваются без !important и без правки файла.",
  },
  {
    question: "Почему у открытого раздела градиент, а не тень?",
    answer:
      "На тёмном фоне тень не видна: затемнять уже тёмное нечем. Поэтому активный раздел светлеет и получает подсветку от левого края — приём, который работает и на чёрном, и на графитовом фоне.",
  },
]

/**
 * Тёмный аккордеон для тёмных секций: своя палитра, подсветка вместо тени.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion011({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  marker = "chevron",
  glow = "edge",
  exclusive = true,
  group = "vibeui-accordion-011",
  accent,
  className,
  style,
  ...props
}: Accordion011Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-011"
        data-marker={marker}
        data-glow={glow}
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
              <span data-part="question">{item.question}</span>
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
