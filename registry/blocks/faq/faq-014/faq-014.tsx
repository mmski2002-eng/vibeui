import type { CSSProperties } from "react"

type Faq014Item = {
  question: string
  answer: string
}

export type Faq014Props = {
  title?: string
  items?: Faq014Item[]
  linkLabel?: string
  linkHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мини-FAQ для конца лендинга: три главных вопроса и ссылка на полную
// страницу. Компактность намеренная — перед призывом к действию человек
// снимает последние сомнения, а не читает справочник. Раскладка считается
// от собственной ширины блока (container queries), а не от ширины окна.
const STYLES = `
:where([data-vibeui-block="faq-014"]){
--vibeui-faq-014-bg:transparent;
--vibeui-faq-014-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-014-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-014-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-014-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-014"]{color-scheme:dark}
[data-vibeui-block="faq-014"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-014-bg);color:var(--vibeui-faq-014-ink);
font-family:var(--vibeui-faq-014-font);
}
[data-vibeui-block="faq-014"] [data-part="shell"]{max-width:40rem;margin:0 auto;padding:2.5rem 1.25rem}
[data-vibeui-block="faq-014"] [data-part="title"]{
margin:0 0 1.25rem;
font-size:clamp(1.375rem,4.5cqi,1.75rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="faq-014"] [data-part="list"]{display:grid;border-top:1px solid var(--vibeui-faq-014-border)}
[data-vibeui-block="faq-014"] [data-part="item"]{border-bottom:1px solid var(--vibeui-faq-014-border)}
[data-vibeui-block="faq-014"] [data-part="question"]{
display:flex;align-items:baseline;gap:0.75rem;
padding:0.875rem 0.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-014"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-014"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-014-accent);outline-offset:2px;border-radius:0.375rem;
}
[data-vibeui-block="faq-014"] [data-part="sign"]{
margin-left:auto;flex:none;align-self:center;width:0.75rem;height:0.75rem;position:relative;
color:var(--vibeui-faq-014-accent);
transition:transform .18s ease;
}
[data-vibeui-block="faq-014"] [data-part="sign"]::before,
[data-vibeui-block="faq-014"] [data-part="sign"]::after{
content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;
}
[data-vibeui-block="faq-014"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="faq-014"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="faq-014"] [data-part="item"][open] [data-part="sign"]{transform:rotate(45deg)}
[data-vibeui-block="faq-014"] [data-part="answer"]{
margin:0;padding:0 0.125rem 1rem;
color:var(--vibeui-faq-014-muted);font-size:0.875rem;line-height:1.6;
}
[data-vibeui-block="faq-014"] [data-part="more"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:1.25rem;
color:var(--vibeui-faq-014-accent);
font-size:0.9375rem;font-weight:700;text-decoration:none;
}
[data-vibeui-block="faq-014"] [data-part="more"]:hover{text-decoration:underline;text-underline-offset:0.2em}
[data-vibeui-block="faq-014"] [data-part="more"]:focus-visible{
outline:2px solid var(--vibeui-faq-014-accent);outline-offset:3px;border-radius:0.25rem;
}
[data-vibeui-block="faq-014"] [data-part="more"]::after{
content:"";width:0.5rem;height:0.5rem;
border-top:2px solid currentColor;border-right:2px solid currentColor;
transform:rotate(45deg);transition:transform .18s ease;
}
[data-vibeui-block="faq-014"] [data-part="more"]:hover::after{transform:rotate(45deg) translate(1px,-1px)}
@container (min-width: 36rem){
[data-vibeui-block="faq-014"] [data-part="shell"]{padding:3.5rem 2rem}
[data-vibeui-block="faq-014"] [data-part="question"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq014Item[] = [
  {
    question: "Это бесплатно?",
    answer:
      "Да, открытая часть каталога бесплатна, включая коммерческие проекты. Платные наборы будут помечены отдельно.",
  },
  {
    question: "Нужно ли уметь программировать?",
    answer:
      "Нет: выбираете блок, копируете инструкцию для AI — агент сам ставит компонент в проект.",
  },
  {
    question: "Что я получаю после установки?",
    answer:
      "Один файл в вашем проекте без зависимостей. Он ваш: меняйте контент и цвета, деплойте куда угодно.",
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

/** Компактный мини-FAQ для конца лендинга: три вопроса и ссылка на все. */
export function Faq014({
  title = "Остались вопросы?",
  items = DEFAULT_ITEMS,
  linkLabel = "Все вопросы и ответы",
  linkHref = "#faq",
  background = "",
  accent,
  className,
  style,
}: Faq014Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-014" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-014" className={className} style={palette}>
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <div data-part="list">
            {items.map((item) => (
              <details key={item.question} data-part="item">
                <summary data-part="question">
                  <span>{item.question}</span>
                  <span data-part="sign" aria-hidden="true" />
                </summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
          <a data-part="more" href={linkHref}>
            {linkLabel}
          </a>
        </div>
      </section>
    </>
  )
}
