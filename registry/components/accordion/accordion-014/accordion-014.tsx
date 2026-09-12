import type { ComponentProps, CSSProperties } from "react"

export type Accordion014Item = {
  /** Часть адреса после решётки: должна быть уникальной на странице. */
  id: string
  question: string
  answer: string
}

/** Значок раздела. Рисуется компонентом, картинка одна во всех движках. */
export type Accordion014Marker = "chevron" | "none"

export type Accordion014Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion014Item[]
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /**
   * Имя группы взаимного исключения. Двум аккордеонам на одной странице
   * нужны разные имена, иначе они делят одну радиогруппу.
   */
  group?: string
  /** Номер раздела, открытого при заходе без адреса вопроса. -1 — все закрыты. */
  defaultOpen?: number
  marker?: Accordion014Marker
  /** Подпись кнопки-ссылки для скринридера, {question} подставляется. */
  linkLabel?: string
  /** Пусто — фона нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у каждого вопроса свой адрес. У обычного details есть
// нативное свойство, о котором не все знают: если ссылка ведёт на id
// элемента внутри закрытого details, браузер сам раскрывает предка и
// прокручивает к цели — это часть алгоритма перехода по фрагменту, а не
// поведение, которое нужно писать. Поэтому id стоит на ответе, а не на самом
// details: быть целью самому себе для этого правила недостаточно, нужен
// закрытый предок. Копия ссылки рядом с вопросом превращает любой ответ в
// цитируемый: адрес можно отправить, страница откроет ровно тот раздел,
// «назад» вернёт прежний вид, обновление ничего не потеряет.
//
// Кнопка-ссылка стоит рядом с summary, а не внутри него: клик по интерактивному
// элементу внутри summary всё равно переключает раздел браузером, и вместо
// одной понятной ссылки получаются два конфликтующих действия.
const STYLES = `
:where([data-vibeui-block="accordion-014"]){
--vibeui-accordion-014-fg:light-dark(oklch(0.2 0 255),oklch(0.94 0 255));
--vibeui-accordion-014-muted:color-mix(in oklab,var(--vibeui-accordion-014-fg) 68%,transparent);
--vibeui-accordion-014-rule:light-dark(oklch(0.9 0 250),oklch(0.31 0 250));
--vibeui-accordion-014-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-accordion-014-target:color-mix(in oklab,var(--vibeui-accordion-014-accent) 14%,transparent);
--vibeui-accordion-014-bg:transparent;
--vibeui-accordion-014-pad:0.5rem 0 0.75rem;
--vibeui-accordion-014-radius:0;
--vibeui-accordion-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-014"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;
padding:var(--vibeui-accordion-014-pad);
background:var(--vibeui-accordion-014-bg);
border-radius:var(--vibeui-accordion-014-radius);
color:var(--vibeui-accordion-014-fg);
font-family:var(--vibeui-accordion-014-font);
}
/* Ссылка позиционируется поверх строки вопроса, но лежит рядом с details,
   а не внутри summary — иначе клик по ней запускал бы и переход, и штатное
   переключение раздела браузером. */
[data-vibeui-block="accordion-014"] [data-part="row"]{position:relative}
[data-vibeui-block="accordion-014"] details{
border-radius:0.5rem;transition:background .16s ease;
}
[data-vibeui-block="accordion-014"] summary{
padding:0.9375rem 2.5rem 0.9375rem 0.25rem;cursor:pointer;
font-size:0.9375rem;font-weight:500;letter-spacing:-0.01em;line-height:1.45;
border-bottom:1px solid var(--vibeui-accordion-014-rule);
display:flex;align-items:center;gap:0.75rem;list-style:none;
}
[data-vibeui-block="accordion-014"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-014"] details[open] summary{
box-shadow:0 1px 0 var(--vibeui-accordion-014-fg);border-bottom-color:transparent;
}
[data-vibeui-block="accordion-014"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-014-accent);outline-offset:2px;
}
/* Раздел, на который ведёт текущий адрес: слабая заливка держится, пока
   пользователь не перейдёт к другому вопросу. id стоит на ответе, а не на
   details — тогда попадание в адрес совпадает с алгоритмом браузера,
   который раскрывает предка закрытого :target, а не сам закрытый элемент. */
[data-vibeui-block="accordion-014"] details:has(:target){
background:var(--vibeui-accordion-014-target);
}
[data-vibeui-block="accordion-014"] [data-part="marker"]{
width:0.625rem;height:0.625rem;flex:none;position:relative;
}
[data-vibeui-block="accordion-014"][data-marker="chevron"] [data-part="marker"]::before{
content:"";position:absolute;top:50%;left:50%;
width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-accordion-014-accent);
border-bottom:1.5px solid var(--vibeui-accordion-014-accent);
transform:translate(-70%,-50%) rotate(-45deg);
transition:transform .18s ease;
}
[data-vibeui-block="accordion-014"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
}
[data-vibeui-block="accordion-014"] [data-part="question"]{flex:1}
/* Кнопка-ссылка: видна всегда, а не только на наведении — на телефоне
   наведения нет, а поделиться конкретным ответом хочется и там. */
[data-vibeui-block="accordion-014"] [data-part="link"]{
position:absolute;top:0.5625rem;right:0.25rem;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.4375rem;
color:var(--vibeui-accordion-014-muted);text-decoration:none;
transition:background .14s ease,color .14s ease;
}
[data-vibeui-block="accordion-014"] [data-part="link"]:hover,
[data-vibeui-block="accordion-014"] [data-part="link"]:focus-visible{
background:color-mix(in oklab,var(--vibeui-accordion-014-fg) 8%,transparent);
color:var(--vibeui-accordion-014-accent);
}
[data-vibeui-block="accordion-014"] [data-part="link"]:focus-visible{
outline:2px solid var(--vibeui-accordion-014-accent);outline-offset:1px;
}
[data-vibeui-block="accordion-014"] [data-part="link"] svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="accordion-014"] [data-part="answer"]{
margin:0;padding:0.75rem 2.5rem 1.0625rem 1.625rem;max-width:66ch;
font-size:0.875rem;line-height:1.75;color:var(--vibeui-accordion-014-muted);
}
[data-vibeui-block="accordion-014"][data-marker="none"] [data-part="answer"]{
padding-left:0.25rem;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-014"] summary{padding:1.0625rem 2.5rem 1.0625rem 0.25rem;font-size:1rem}
[data-vibeui-block="accordion-014"] [data-part="answer"]{font-size:0.9375rem}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-014"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion014Item[] = [
  {
    id: "faq-install",
    question: "Как установить компонент себе в проект?",
    answer:
      "Скопируйте команду с карточки и выполните её в корне проекта. Файл ляжет в components/vibeui и заработает сразу: внешних зависимостей нет.",
  },
  {
    id: "faq-share",
    question: "Можно ли прислать коллеге ссылку на конкретный ответ?",
    answer:
      "Да, это и есть смысл компонента: у каждого вопроса собственный адрес после решётки. По ссылке страница откроет ровно этот раздел, не все подряд.",
  },
  {
    id: "faq-reload",
    question: "Раздел останется открытым после обновления страницы?",
    answer:
      "Да, потому что состояние не в памяти, а в адресе. Обновление страницы, кнопка «назад» и пересланная ссылка возвращают тот же открытый вопрос.",
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
 * Аккордеон, где у каждого вопроса свой адрес: браузер сам раскрывает
 * details, на который ведёт ссылка. Один файл, ноль зависимостей.
 */
export function Accordion014({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-014",
  defaultOpen = -1,
  marker = "chevron",
  linkLabel = "Ссылка на вопрос «{question}»",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion014Props) {
  // Фон появляется вместе с внутренними отступами: без фона компонент лежит
  // прямо на странице и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-accordion-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-014-bg": background,
          "--vibeui-accordion-014-pad": "0.75rem 1.25rem 1rem",
          "--vibeui-accordion-014-radius": "0.5rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-014"
        data-marker={marker}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <div key={item.id} data-part="row">
            <details
              name={exclusive ? group : undefined}
              open={index === defaultOpen}
            >
              <summary>
                {marker === "none" ? null : (
                  <span data-part="marker" aria-hidden="true" />
                )}
                <span data-part="question">{item.question}</span>
              </summary>
              <p id={item.id} data-part="answer">
                {item.answer}
              </p>
            </details>
            <a
              data-part="link"
              href={`#${item.id}`}
              aria-label={linkLabel.replace("{question}", item.question)}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6.5 9.5 9.5 6.5M7 4.5 7.94 3.56a2.5 2.5 0 0 1 3.54 3.54L10.5 8M9 11.5l-.94.94a2.5 2.5 0 0 1-3.54-3.54L5.5 8"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </>
  )
}
