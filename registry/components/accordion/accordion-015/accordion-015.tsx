import type { ComponentProps, CSSProperties } from "react"

export type Accordion015Item = {
  question: string
  answer: string
}

export type Accordion015Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion015Item[]
  /** Номер раздела перед вопросом: «01», «02»… */
  numbered?: boolean
  /** Сколько колонок на широкой раскладке. */
  columns?: 1 | 2 | 3
  /** Пусто — заливки нет, карточки лежат на фоне страницы своей плашкой. */
  background?: string
  accent?: string
}

// Идея компонента: карточки вопросов раскладываются в колонки, как газетная
// полоса. Колонки собраны через CSS columns, а не через grid: порядок
// вопросов остаётся вертикальным — читают сверху вниз левую колонку, потом
// правую, и нумерация не путается. break-inside запрещает разрывать карточку
// между колонками. Разделы независимы: в колонках взаимное закрытие
// выглядело бы поломкой.
//
// Раскрытие держат нативные details/summary: ответ доступен поиску по
// странице и работает до гидратации.
const STYLES = `
:where([data-vibeui-block="accordion-015"]){
--vibeui-accordion-015-bg:transparent;
--vibeui-accordion-015-card:light-dark(oklch(0.98 0 255),oklch(0.25 0 255));
--vibeui-accordion-015-fg:light-dark(oklch(0.22 0 255),oklch(0.95 0 255));
--vibeui-accordion-015-muted:light-dark(oklch(0.5 0 255),oklch(0.72 0 255));
--vibeui-accordion-015-border:light-dark(oklch(0.91 0 255),oklch(0.35 0 255));
--vibeui-accordion-015-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-accordion-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-accordion-015-dur:180ms;
--vibeui-accordion-015-columns:1;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-015"]{color-scheme:dark}
[data-vibeui-block="accordion-015"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   компонент схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
background:var(--vibeui-accordion-015-bg);color:var(--vibeui-accordion-015-fg);
font-family:var(--vibeui-accordion-015-font);
}
[data-vibeui-block="accordion-015"] *{box-sizing:border-box}
[data-vibeui-block="accordion-015"] [data-part="deck"]{column-gap:1.5rem}
[data-vibeui-block="accordion-015"] details{
break-inside:avoid;margin:0 0 0.75rem;
border:1px solid var(--vibeui-accordion-015-border);border-radius:1rem;
background:var(--vibeui-accordion-015-card);
}
[data-vibeui-block="accordion-015"] summary{
cursor:pointer;list-style:none;
display:flex;align-items:flex-start;gap:0.75rem;
padding:1rem 1.125rem;
font-size:1rem;font-weight:620;line-height:1.4;
}
[data-vibeui-block="accordion-015"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-015"] summary::after{
content:"";flex:none;width:0.75rem;height:0.75rem;margin-left:auto;margin-top:0.3125rem;
border-right:2px solid var(--vibeui-accordion-015-accent);border-bottom:2px solid var(--vibeui-accordion-015-accent);
transform:rotate(45deg);transform-origin:60% 60%;
transition:transform var(--vibeui-accordion-015-dur) ease;
}
[data-vibeui-block="accordion-015"] details[open] summary::after{transform:rotate(225deg)}
[data-vibeui-block="accordion-015"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-015-accent);outline-offset:-2px;border-radius:1rem}
[data-vibeui-block="accordion-015"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;max-width:56ch;
color:var(--vibeui-accordion-015-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="accordion-015"] [data-part="index"]{
flex:none;min-width:1.5rem;color:var(--vibeui-accordion-015-accent);
font-variant-numeric:tabular-nums;font-size:0.8125rem;font-weight:700;padding-top:0.1875rem;
}
/* Колонки включаются от ширины компонента, а не окна: в узкой колонке
   страницы карточки остаются в один столбец. */
@container (min-width: 40rem){
[data-vibeui-block="accordion-015"] details{margin-bottom:1rem}
[data-vibeui-block="accordion-015"] [data-part="deck"]{column-count:min(2,var(--vibeui-accordion-015-columns))}
}
@container (min-width: 60rem){
[data-vibeui-block="accordion-015"] [data-part="deck"]{column-count:var(--vibeui-accordion-015-columns)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion015Item[] = [
  {
    question: "Как быстро подключают тариф?",
    answer:
      "Сразу после оплаты: доступ открывается автоматически, ждать менеджера не нужно.",
  },
  {
    question: "Можно ли перенести данные из другой системы?",
    answer:
      "Да. Импорт понимает выгрузки в CSV и XLSX, а для больших баз мы делаем перенос руками бесплатно.",
  },
  {
    question: "Что происходит после окончания оплаченного периода?",
    answer:
      "Аккаунт переходит в режим чтения. Данные хранятся ещё год, удалить их можно только вручную.",
  },
  {
    question: "Есть ли ограничение по числу сотрудников?",
    answer:
      "На стартовом тарифе — пять человек, дальше место докупается по одному, без перехода на другой тариф.",
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
 * Карточки вопросов в газетные колонки: порядок вертикальный, карточки не
 * рвутся. Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion015({
  items = DEFAULT_ITEMS,
  numbered = true,
  columns = 2,
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion015Props) {
  const palette = {
    "--vibeui-accordion-015-columns": columns,
    ...(accent ? { "--vibeui-accordion-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-015"
        className={className}
        style={palette}
      >
        <div data-part="deck">
          {items.map((item, index) => (
            <details key={item.question}>
              <summary>
                {numbered ? (
                  <span data-part="index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : null}
                {item.question}
              </summary>
              <p data-part="answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
