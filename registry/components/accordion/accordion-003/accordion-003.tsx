import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion003Item = {
  question: string
  answer: string
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion003Marker =
  "plus" | "chevron" | "triangle" | "square" | "none"

export type Accordion003Divider = "line" | "dashed" | "none"

export type Accordion003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion003Item[]
  defaultOpen?: number
  /** Открытым остаётся только один раздел. */
  exclusive?: boolean
  marker?: Accordion003Marker
  divider?: Accordion003Divider
  /** Пусто — фона нет, список лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: аккордеон без рамок — только строки и волосяные линии
// между ними. Он не выглядит вставкой на странице и годится там, где список
// вопросов идёт внутри текста. Знак «плюс» превращается в «минус» поворотом
// одной полосы: это читается даже боковым зрением.
//
// Тема берётся из color-scheme окружения через light-dark(): собственного
// фона у компонента нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="accordion-003"]){
--vibeui-accordion-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-accordion-003-muted:light-dark(oklch(0.5 0.014 265),oklch(0.68 0.01 265));
--vibeui-accordion-003-line:light-dark(oklch(0.9 0.006 265),oklch(0.3 0.01 265));
--vibeui-accordion-003-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-accordion-003-bg:transparent;
--vibeui-accordion-003-pad:0;
--vibeui-accordion-003-radius:0;
--vibeui-accordion-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-003"]{
display:flex;flex-direction:column;
width:100%;max-width:42rem;box-sizing:border-box;
padding:var(--vibeui-accordion-003-pad);
background:var(--vibeui-accordion-003-bg);
border-radius:var(--vibeui-accordion-003-radius);
color:var(--vibeui-accordion-003-fg);font-family:var(--vibeui-accordion-003-font);
border-top:1px solid transparent;
}
/* Линия всегда занимает свой пиксель: смена разделителей не двигает строки. */
[data-vibeui-block="accordion-003"] details{border-bottom:1px solid transparent}
[data-vibeui-block="accordion-003"][data-divider="line"]{border-top-color:var(--vibeui-accordion-003-line)}
[data-vibeui-block="accordion-003"][data-divider="line"] details{border-bottom-color:var(--vibeui-accordion-003-line)}
[data-vibeui-block="accordion-003"][data-divider="dashed"]{border-top:1px dashed var(--vibeui-accordion-003-line)}
[data-vibeui-block="accordion-003"][data-divider="dashed"] details{border-bottom:1px dashed var(--vibeui-accordion-003-line)}
[data-vibeui-block="accordion-003"] summary{
display:flex;align-items:flex-start;justify-content:space-between;gap:1.25rem;
padding:1rem 0.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.45;
transition:color .16s ease;
}
[data-vibeui-block="accordion-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-003"] summary:hover{color:var(--vibeui-accordion-003-accent)}
[data-vibeui-block="accordion-003"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-003-accent);outline-offset:2px;border-radius:0.375rem}
/* Бокс значка одного размера при любой фигуре: заголовок не перетекает. */
[data-vibeui-block="accordion-003"] [data-part="marker"]{
position:relative;flex:none;width:0.875rem;height:0.875rem;margin-top:0.3125rem;
}
[data-vibeui-block="accordion-003"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .2s cubic-bezier(.32,.72,0,1),background-color .16s ease,border-color .16s ease;
}
/* Плюс и минус: горизонтальная полоса на месте, вертикальная складывается. */
[data-vibeui-block="accordion-003"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-003"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;margin-left:0;border-radius:1px;
transform:none;
background:var(--vibeui-accordion-003-muted);
transition:transform .2s cubic-bezier(.32,.72,0,1),background-color .16s ease;
}
[data-vibeui-block="accordion-003"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-003"][data-marker="plus"] details[open] [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-003"][data-marker="plus"] details[open] [data-part="marker"]::before,
[data-vibeui-block="accordion-003"][data-marker="plus"] details[open] [data-part="marker"]::after{background:var(--vibeui-accordion-003-accent)}
[data-vibeui-block="accordion-003"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-003-muted);
border-bottom:1.5px solid var(--vibeui-accordion-003-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-003"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-003-accent);
border-bottom-color:var(--vibeui-accordion-003-accent);
}
[data-vibeui-block="accordion-003"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-003-muted);
clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-003"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-003-accent);
}
[data-vibeui-block="accordion-003"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-003-muted);
}
[data-vibeui-block="accordion-003"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-003-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-003-accent);
}
[data-vibeui-block="accordion-003"] [data-part="answer"]{
margin:0;padding:0 2.5rem 1.125rem 0.25rem;
font-size:0.875rem;line-height:1.65;color:var(--vibeui-accordion-003-muted);max-width:64ch;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-003"] summary{padding:1.125rem 0.25rem;font-size:1rem}
[data-vibeui-block="accordion-003"] [data-part="answer"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion003Item[] = [
  {
    question: "Сколько времени занимает подключение?",
    answer:
      "Полчаса на первый проект: домен подключается за пять минут, остальное — наполнение страниц. Переносить существующий сайт дольше, обычно день.",
  },
  {
    question: "Что будет с сайтом, если я перестану платить?",
    answer:
      "Сайт остаётся опубликованным до конца оплаченного периода, дальше переходит в режим только для чтения. Исходники ваши и никуда не деваются.",
  },
  {
    question: "Можно ли работать вдвоём над одним проектом?",
    answer:
      "Да, участники приглашаются по почте и получают роль редактора или читателя. Одновременное редактирование одной страницы не блокируется.",
  },
  {
    question: "Есть ли ограничение по трафику?",
    answer:
      "Мягкое: до ста тысяч просмотров в месяц включено, дальше предупредим и предложим перейти на следующий тариф. Сайт при этом не выключается.",
  },
]

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
 * Аккордеон без рамок: строки, волосяные линии и знак «плюс».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion003({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  exclusive = false,
  marker = "plus",
  divider = "line",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion003Props) {
  // Фон появляется вместе с внутренними отступами: без фона список лежит
  // прямо на странице, и поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-accordion-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-003-bg": background,
          "--vibeui-accordion-003-pad": "0.25rem 1.25rem 0.75rem",
          "--vibeui-accordion-003-radius": "0.5rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-003"
        data-marker={marker}
        data-divider={divider}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details
            key={item.question}
            name={exclusive ? "vibeui-accordion-003" : undefined}
            open={index === defaultOpen}
          >
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
