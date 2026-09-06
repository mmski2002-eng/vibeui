import type { ComponentProps, CSSProperties } from "react"

export type Accordion010Item = {
  question: string
  answer: string
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion010Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

export type Accordion010Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion010Item[]
  defaultOpen?: number
  /** Нумеровать вопросы. Номер помогает ссылаться на пункт в переписке. */
  numbered?: boolean
  marker?: Accordion010Marker
  /** Пусто — фона нет, две колонки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: на широкой раскладке вопрос остаётся в левой колонке, а
// ответ раскрывается в правой — строка не разрывается по вертикали, и глаз
// не теряет вопрос, к которому относится длинный ответ. В узкой колонке блок
// сам складывается в обычный список. Ширина считается от блока, не от окна.
const STYLES = `
:where([data-vibeui-block="accordion-010"]){
--vibeui-accordion-010-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-accordion-010-muted:color-mix(in oklab,var(--vibeui-accordion-010-fg) 68%,transparent);
--vibeui-accordion-010-line:light-dark(oklch(0.91 0 265),oklch(0.31 0 265));
--vibeui-accordion-010-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-accordion-010-bg:transparent;
--vibeui-accordion-010-pad:0;
--vibeui-accordion-010-radius:0;
--vibeui-accordion-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-010"]{
display:flex;flex-direction:column;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:56rem;box-sizing:border-box;
padding:var(--vibeui-accordion-010-pad);
background:var(--vibeui-accordion-010-bg);
border-radius:var(--vibeui-accordion-010-radius);
color:var(--vibeui-accordion-010-fg);font-family:var(--vibeui-accordion-010-font);
border-top:1px solid var(--vibeui-accordion-010-line);
}
[data-vibeui-block="accordion-010"] details{border-bottom:1px solid var(--vibeui-accordion-010-line)}
[data-vibeui-block="accordion-010"] summary{
display:flex;align-items:flex-start;gap:0.75rem;
padding:0.9375rem 0.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.45;
transition:color .16s ease;
}
[data-vibeui-block="accordion-010"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-010"] summary:hover{color:var(--vibeui-accordion-010-accent)}
[data-vibeui-block="accordion-010"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-010-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="accordion-010"] [data-part="number"]{
flex:none;width:1.5rem;
font-size:0.75rem;font-weight:650;line-height:1.6;
color:var(--vibeui-accordion-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="accordion-010"] details[open] [data-part="number"]{color:var(--vibeui-accordion-010-accent)}
[data-vibeui-block="accordion-010"] [data-part="question"]{flex:1 1 auto;min-width:0}
/* Бокс значка постоянного размера: строки остаются выровненными при любой
   фигуре, а отступ ответа считается от него. */
[data-vibeui-block="accordion-010"] [data-part="marker"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;margin-top:0.4375rem;
}
[data-vibeui-block="accordion-010"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .18s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-010"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-010-muted);
border-bottom:1.5px solid var(--vibeui-accordion-010-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-010"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-010-accent);border-bottom-color:var(--vibeui-accordion-010-accent);
}
[data-vibeui-block="accordion-010"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-010-muted);clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-010"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-010-accent);
}
[data-vibeui-block="accordion-010"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-010-muted);
}
[data-vibeui-block="accordion-010"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-010-accent);box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-010-accent);
}
[data-vibeui-block="accordion-010"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-010"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;border-radius:1px;transform:none;
background:var(--vibeui-accordion-010-muted);
transition:transform .18s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-010"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-010"][data-marker="plus"] details[open] [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-010"][data-marker="plus"] details[open] [data-part="marker"]::before,
[data-vibeui-block="accordion-010"][data-marker="plus"] details[open] [data-part="marker"]::after{background:var(--vibeui-accordion-010-accent)}
[data-vibeui-block="accordion-010"] [data-part="answer"]{
margin:0;padding:0 0.25rem 1.0625rem 2.25rem;
font-size:0.875rem;line-height:1.7;color:var(--vibeui-accordion-010-muted);max-width:64ch;
}
/* Две колонки включаются рано, с 28rem: до этого порога компонент неотличим
   от обычного списка, а именно колонки — весь его смысл. Пока места мало,
   колонки делят ширину долями; фиксированные 20rem задаются только там, где
   они действительно помещаются. */
@container (min-width: 28rem){
[data-vibeui-block="accordion-010"] details{
display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);
column-gap:1.75rem;align-items:start;
}
[data-vibeui-block="accordion-010"] [data-part="answer"]{
padding:0.9375rem 0.25rem 1.0625rem 0;
}
[data-vibeui-block="accordion-010"] details:not([open]) [data-part="answer"]{display:none}
}
@container (min-width: 44rem){
[data-vibeui-block="accordion-010"] details{
grid-template-columns:20rem 1fr;column-gap:2.5rem;
}
[data-vibeui-block="accordion-010"] summary{padding:1.0625rem 0.25rem;font-size:1rem}
[data-vibeui-block="accordion-010"] [data-part="answer"]{
padding:1.0625rem 0.25rem 1.0625rem 0;font-size:0.9375rem;
}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-010"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion010Item[] = [
  {
    question: "Чем это отличается от обычной библиотеки компонентов?",
    answer:
      "Библиотека даёт пакет, который живёт в node_modules и обновляется вместе со всем проектом. Здесь компонент приходит одним файлом и становится вашим: его можно править, переименовывать и публиковать вместе с сайтом. Взамен он не обновляется сам — новая версия ставится той же командой.",
  },
  {
    question: "Почему у каждого компонента своя палитра, а не токены темы?",
    answer:
      "Компонент должен выглядеть в вашем проекте так же, как в превью, а токены у всех разные: bg-primary в одном проекте синий, в другом чёрный. Локальные переменные --vibeui-* дают предсказуемый вид сразу и позволяют переопределить цвета одной строкой, когда это нужно.",
  },
  {
    question: "Что именно получает ИИ-агент по ссылке Copy for AI?",
    answer:
      "Текстовую инструкцию: идентификатор компонента, команду установки, адрес файла, список того, что нельзя менять, и того, что можно. Агент скачивает файл из реестра вместо того, чтобы сочинять похожий по описанию — ради этого инструкция и существует.",
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
 * Аккордеон в две колонки: вопрос слева, ответ справа на широкой раскладке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion010({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  numbered = true,
  marker = "chevron",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion010Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-010-bg": background,
          "--vibeui-accordion-010-pad": "0.5rem 1.25rem 1rem",
          "--vibeui-accordion-010-radius": "0.5rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-010"
        data-marker={marker}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.question} open={index === defaultOpen}>
            <summary>
              {numbered ? (
                <span data-part="number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}
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
