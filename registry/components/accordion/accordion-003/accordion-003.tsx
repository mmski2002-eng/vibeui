import type { ComponentProps, CSSProperties } from "react"

export type Accordion003Item = {
  question: string
  answer: string
}

/** Каретка слева от вопроса: курсор, стоящий на найденной строке. */
export type Accordion003Caret = "bar" | "none"

export type Accordion003Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion003Item[]
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  /** Открытым остаётся только один раздел. */
  exclusive?: boolean
  /**
   * Имя группы взаимного исключения. Двум аккордеонам на одной странице
   * нужны разные имена, иначе они делят одну радиогруппу.
   */
  group?: string
  caret?: Accordion003Caret
  /** Цвет пигмента подсветки. Увести его от жёлтого — потерять приём. */
  highlight?: string
  /** Пусто — фона нет, список лежит прямо на фоне страницы. */
  background?: string
  /** Цвет каретки и обводки фокуса. */
  accent?: string
}

// Идея компонента: единственное, чего не умеет ни один аккордеон на useState,
// — браузер сам раскрывает нативный details, когда находит внутри текст
// поиском по странице. Компонент говорит именно об этом: открытый вопрос
// лежит под пигментом find-in-page, слева стоит каретка. Всё остальное
// убрано — ни рамок, ни скруглений, ни фона строк.
//
// Пигмент не гасится в тёмной теме. Браузер в тёмном режиме тоже красит
// найденное ярким и переводит буквы под ним в тёмный; приглушить пигмент
// «чтобы не резал глаз» — значит превратить приём в обычный акцент.
const STYLES = `
:where([data-vibeui-block="accordion-003"]){
--vibeui-accordion-003-fg:light-dark(oklch(0.18 0 265),oklch(0.95 0 265));
--vibeui-accordion-003-muted:color-mix(in oklab,var(--vibeui-accordion-003-fg) 68%,transparent);
--vibeui-accordion-003-highlight:light-dark(oklch(0.95 0.12 95),oklch(0.86 0.16 95));
/* Буквы под пигментом всегда тёмные — как их красит сам браузер. */
--vibeui-accordion-003-highlight-ink:oklch(0.19 0.02 100);
--vibeui-accordion-003-accent:var(--vibeui-accordion-003-fg);
--vibeui-accordion-003-bg:transparent;
--vibeui-accordion-003-pad:0;
--vibeui-accordion-003-radius:0;
--vibeui-accordion-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-003"]{
display:flex;flex-direction:column;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;
padding:var(--vibeui-accordion-003-pad);
background:var(--vibeui-accordion-003-bg);
border-radius:var(--vibeui-accordion-003-radius);
color:var(--vibeui-accordion-003-fg);
font-family:var(--vibeui-accordion-003-font);
}
[data-vibeui-block="accordion-003"] details{padding:0.375rem 0}
[data-vibeui-block="accordion-003"] details + details{margin-top:0.375rem}
[data-vibeui-block="accordion-003"] summary{
display:flex;align-items:baseline;gap:0.6875rem;cursor:pointer;list-style:none;
font-size:1rem;font-weight:500;letter-spacing:-0.015em;line-height:1.45;
}
[data-vibeui-block="accordion-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-003"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-003-accent);outline-offset:3px;border-radius:2px;
}
/* Каретка — курсор, стоящий на найденной строке: у открытого раздела толще. */
[data-vibeui-block="accordion-003"] [data-part="caret"]{
width:1px;height:1.05em;flex:none;
background:var(--vibeui-accordion-003-muted);
transform:translateY(0.16em);
transition:width .12s ease,background .12s ease;
}
[data-vibeui-block="accordion-003"] details[open] [data-part="caret"]{
width:2px;background:var(--vibeui-accordion-003-accent);color:oklch(from var(--vibeui-accordion-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
/* Пигмент лежит на одном узле с текстом: разбей заголовок на два элемента —
   и подсветка разъедется по строкам вместе с переносом. */
[data-vibeui-block="accordion-003"] [data-part="hit"]{
padding:0.08em 0.3em;margin-left:-0.3em;background:transparent;
box-decoration-break:clone;-webkit-box-decoration-break:clone;
transition:background .14s ease,color .14s ease;
}
/* Наведение показывает механику до клика: пигмент проступает наполовину. */
[data-vibeui-block="accordion-003"] summary:hover [data-part="hit"]{
background:color-mix(in oklab,var(--vibeui-accordion-003-highlight) 40%,transparent);
}
[data-vibeui-block="accordion-003"] details[open] [data-part="hit"]{
background:var(--vibeui-accordion-003-highlight);
color:var(--vibeui-accordion-003-highlight-ink);
}
[data-vibeui-block="accordion-003"] [data-part="answer"]{
margin:0.5rem 0 0;padding-left:1.4375rem;max-width:62ch;
font-size:0.875rem;line-height:1.7;color:var(--vibeui-accordion-003-muted);
}
[data-vibeui-block="accordion-003"][data-caret="none"] [data-part="caret"]{display:none}
[data-vibeui-block="accordion-003"][data-caret="none"] [data-part="answer"]{padding-left:0}
@container (min-width: 32rem){
[data-vibeui-block="accordion-003"] summary{font-size:1.0625rem}
[data-vibeui-block="accordion-003"] [data-part="answer"]{font-size:0.9375rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-003"]{color-scheme:dark}
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
 * Аккордеон с подсветкой поиска: открытый вопрос лежит под пигментом
 * find-in-page. Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion003({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  exclusive = true,
  group = "vibeui-accordion-003",
  caret = "bar",
  highlight,
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion003Props) {
  // Фон появляется вместе с внутренними отступами: без фона список лежит
  // прямо на странице, и поля по бокам ему только мешают.
  const palette = {
    ...(highlight ? { "--vibeui-accordion-003-highlight": highlight } : null),
    ...(accent ? { "--vibeui-accordion-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-003-bg": background,
          "--vibeui-accordion-003-pad": "1.375rem 1.5rem",
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
        data-slot="accordion"
        data-vibeui-block="accordion-003"
        data-caret={caret}
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
              {caret === "none" ? null : (
                <span data-part="caret" aria-hidden="true" />
              )}
              <span data-part="hit">{item.question}</span>
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
