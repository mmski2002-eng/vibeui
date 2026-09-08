import type { CSSProperties } from "react"

type Faq007Item = {
  question: string
  answer: string
}

type Faq007Group = {
  label: string
  items: Faq007Item[]
}

export type Faq007Props = {
  eyebrow?: string
  title?: string
  /** Подпись чипа «показать всё». */
  allLabel?: string
  /** До четырёх категорий: правила фильтра написаны заранее. */
  groups?: Faq007Group[]
  /** Имя группы радио: на странице с двумя блоками должно различаться. */
  id?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Фильтр по категориям на радио-кнопках: выбранный чип прячет чужие вопросы
// правилами :checked ~, поэтому клиентского JS нет вовсе. Раскладка считается
// от собственной ширины блока (container queries), а не от ширины окна.
const STYLES = `
:where([data-vibeui-block="faq-007"]){
--vibeui-faq-007-bg:transparent;
--vibeui-faq-007-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-007-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-007-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-007-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-007-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-007-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-007-on-accent:oklch(0.15 0.02 39.8);
--vibeui-faq-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-007"]{color-scheme:dark}
[data-vibeui-block="faq-007"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-007-bg);color:var(--vibeui-faq-007-ink);
font-family:var(--vibeui-faq-007-font);
}
[data-vibeui-block="faq-007"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-007"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-faq-007-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-007"] [data-part="title"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-007"] [data-part="radio"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;
overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;
}
[data-vibeui-block="faq-007"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0 0 1.5rem;
}
[data-vibeui-block="faq-007"] [data-part="chip"]{
display:inline-flex;align-items:center;
padding:0.4375rem 0.875rem;border:1px solid var(--vibeui-faq-007-border);border-radius:999px;
color:var(--vibeui-faq-007-muted);font-size:0.8125rem;font-weight:600;cursor:pointer;
transition:border-color .18s ease,background .18s ease,color .18s ease;
}
[data-vibeui-block="faq-007"] [data-part="chip"]:hover{
border-color:color-mix(in oklab,var(--vibeui-faq-007-accent) 45%,var(--vibeui-faq-007-border));
color:var(--vibeui-faq-007-ink);
}
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(1):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(1),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(2):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(2),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(3):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(3),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(4):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(4),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(5):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(5){
background:var(--vibeui-faq-007-accent-fill);border-color:var(--vibeui-faq-007-accent-fill);
color:var(--vibeui-faq-007-on-accent);
}
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(1):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(1),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(2):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(2),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(3):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(3),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(4):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(4),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(5):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(5){
outline:2px solid var(--vibeui-faq-007-accent);outline-offset:2px;
}
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(2):checked ~ [data-part="list"] [data-part="item"]:not([data-group="1"]),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(3):checked ~ [data-part="list"] [data-part="item"]:not([data-group="2"]),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(4):checked ~ [data-part="list"] [data-part="item"]:not([data-group="3"]),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(5):checked ~ [data-part="list"] [data-part="item"]:not([data-group="4"]){
display:none;
}
[data-vibeui-block="faq-007"] [data-part="list"]{display:grid;gap:0.625rem}
[data-vibeui-block="faq-007"] [data-part="item"]{
border:1px solid var(--vibeui-faq-007-border);border-radius:0.875rem;
background:var(--vibeui-faq-007-card);
transition:border-color .18s ease;
}
[data-vibeui-block="faq-007"] [data-part="item"][open],
[data-vibeui-block="faq-007"] [data-part="item"]:hover{
border-color:color-mix(in oklab,var(--vibeui-faq-007-accent) 40%,var(--vibeui-faq-007-border));
}
[data-vibeui-block="faq-007"] [data-part="question"]{
display:flex;align-items:baseline;gap:0.75rem;
padding:1rem 1.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-007"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-007"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-007-accent);outline-offset:2px;border-radius:0.875rem;
}
[data-vibeui-block="faq-007"] [data-part="tag"]{
margin-left:auto;flex:none;
color:var(--vibeui-faq-007-muted);font-size:0.6875rem;font-weight:600;
letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="faq-007"] [data-part="sign"]{
flex:none;align-self:center;width:0.875rem;height:0.875rem;position:relative;
color:var(--vibeui-faq-007-accent);
transition:transform .18s ease;
}
[data-vibeui-block="faq-007"] [data-part="sign"]::before,
[data-vibeui-block="faq-007"] [data-part="sign"]::after{
content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;
}
[data-vibeui-block="faq-007"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="faq-007"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="faq-007"] [data-part="item"][open] [data-part="sign"]{transform:rotate(45deg)}
[data-vibeui-block="faq-007"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;max-width:62ch;
color:var(--vibeui-faq-007-muted);font-size:0.9375rem;line-height:1.6;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-007"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-007"] [data-part="question"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Faq007Group[] = [
  {
    label: "Установка",
    items: [
      {
        question: "Как компонент попадает в мой проект?",
        answer:
          "Командой установки из карточки или ссылкой из Copy for AI: файл скачивается из registry и ложится в components/vibeui. Никакой сборки и настройки — это обычный файл проекта.",
      },
      {
        question: "Нужен ли Tailwind или библиотека компонентов?",
        answer:
          "Нет. Стили лежат в самом файле обычным CSS с собственными переменными, поэтому блок работает в любом React-проекте независимо от вашей системы стилей.",
      },
    ],
  },
  {
    label: "Оплата",
    items: [
      {
        question: "Сколько стоит использование блоков?",
        answer:
          "Каталог открыт: берите блоки и в личные, и в коммерческие проекты. Если появятся платные наборы, они будут помечены отдельно ещё до установки.",
      },
      {
        question: "Нужна ли подписка, чтобы блок продолжал работать?",
        answer:
          "Нет. После установки файл принадлежит вашему проекту и ни к чему не подключается. Обновление — это просто установка новой версии поверх.",
      },
    ],
  },
  {
    label: "Лицензия",
    items: [
      {
        question: "Можно ли использовать блоки в клиентских проектах?",
        answer:
          "Да, без ограничений: файл после установки — часть вашего проекта, его можно менять, переименовывать и передавать заказчику вместе с сайтом.",
      },
      {
        question: "Нужно ли указывать авторство?",
        answer:
          "Нет, ссылка на каталог не обязательна. Мы будем рады упоминанию, но лицензия его не требует.",
      },
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Вопросы с фильтром-чипами по категориям: радио-CSS, без клиентского JS. */
export function Faq007({
  eyebrow = "Вопросы",
  title = "Ответы по каждой части сделки",
  allLabel = "Все",
  groups = DEFAULT_GROUPS,
  id = "vibeui-faq-007",
  background = "",
  accent,
  className,
  style,
}: Faq007Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-faq-007-accent": accent,
          "--vibeui-faq-007-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-faq-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const visibleGroups = groups.slice(0, 4)

  return (
    <>
      <style href="vibeui-faq-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="filter">
            <input
              data-part="radio"
              type="radio"
              name={id}
              id={`${id}-all`}
              defaultChecked
            />
            {visibleGroups.map((group, index) => (
              <input
                key={group.label}
                data-part="radio"
                type="radio"
                name={id}
                id={`${id}-group-${index + 1}`}
              />
            ))}
            <nav data-part="chips" aria-label="Категории вопросов">
              <label data-part="chip" htmlFor={`${id}-all`}>
                {allLabel}
              </label>
              {visibleGroups.map((group, index) => (
                <label
                  key={group.label}
                  data-part="chip"
                  htmlFor={`${id}-group-${index + 1}`}
                >
                  {group.label}
                </label>
              ))}
            </nav>
            <div data-part="list">
              {visibleGroups.flatMap((group, groupIndex) =>
                group.items.map((item) => (
                  <details
                    key={item.question}
                    data-part="item"
                    data-group={String(groupIndex + 1)}
                  >
                    <summary data-part="question">
                      <span data-part="sign" aria-hidden="true" />
                      <span>{item.question}</span>
                      <span data-part="tag">{group.label}</span>
                    </summary>
                    <p data-part="answer">{item.answer}</p>
                  </details>
                )),
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
