import type { CSSProperties } from "react"

type Faq015Item = {
  question: string
  answer: string
  /** Подпись слота скриншота. Пусто — ответ без иллюстрации. */
  imageLabel?: string
}

export type Faq015Props = {
  eyebrow?: string
  title?: string
  items?: Faq015Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Ответы с местом под скриншот: там, где словами выходит длинно, внутри
// раскрытого ответа лежит слот-заглушка с градиентной рамкой. При установке
// слот заменяется настоящим <img> — размеры и подпись уже свёрстаны.
// Раскладка считается от собственной ширины блока (container queries).
const STYLES = `
:where([data-vibeui-block="faq-015"]){
--vibeui-faq-015-bg:transparent;
--vibeui-faq-015-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-015-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-015-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-015-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-015-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-015"]{color-scheme:dark}
[data-vibeui-block="faq-015"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-015-bg);color:var(--vibeui-faq-015-ink);
font-family:var(--vibeui-faq-015-font);
}
[data-vibeui-block="faq-015"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-015"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-faq-015-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-015"] [data-part="title"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-015"] [data-part="list"]{display:grid;gap:0.75rem}
[data-vibeui-block="faq-015"] [data-part="item"]{
border:1px solid var(--vibeui-faq-015-border);border-radius:1rem;
background:var(--vibeui-faq-015-card);
transition:border-color .18s ease;
}
[data-vibeui-block="faq-015"] [data-part="item"]:hover,
[data-vibeui-block="faq-015"] [data-part="item"][open]{
border-color:color-mix(in oklab,var(--vibeui-faq-015-accent) 40%,var(--vibeui-faq-015-border));
}
[data-vibeui-block="faq-015"] [data-part="question"]{
display:flex;align-items:baseline;gap:0.75rem;
padding:1.125rem 1.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-015"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-015"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-015-accent);outline-offset:2px;border-radius:1rem;
}
[data-vibeui-block="faq-015"] [data-part="sign"]{
margin-left:auto;flex:none;align-self:center;width:0.875rem;height:0.875rem;position:relative;
color:var(--vibeui-faq-015-accent);
transition:transform .18s ease;
}
[data-vibeui-block="faq-015"] [data-part="sign"]::before,
[data-vibeui-block="faq-015"] [data-part="sign"]::after{
content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;
}
[data-vibeui-block="faq-015"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="faq-015"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="faq-015"] [data-part="item"][open] [data-part="sign"]{transform:rotate(45deg)}
[data-vibeui-block="faq-015"] [data-part="answer"]{
margin:0;padding:0 1.25rem 1.25rem;max-width:62ch;
color:var(--vibeui-faq-015-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-015"] [data-part="slot"]{
margin:0 1.25rem 1.25rem;aspect-ratio:16/9;
display:grid;place-items:center;padding:1rem;
border:1px dashed color-mix(in oklab,var(--vibeui-faq-015-accent) 45%,var(--vibeui-faq-015-border));
border-radius:0.75rem;
background:linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-faq-015-accent) 12%,var(--vibeui-faq-015-card)),
color-mix(in oklab,var(--vibeui-faq-015-accent) 3%,var(--vibeui-faq-015-card)) 55%,
color-mix(in oklab,var(--vibeui-faq-015-accent) 9%,var(--vibeui-faq-015-card)));
}
[data-vibeui-block="faq-015"] [data-part="slot-label"]{
color:color-mix(in oklab,var(--vibeui-faq-015-accent) 70%,var(--vibeui-faq-015-muted));
font-size:0.8125rem;font-weight:600;text-align:center;line-height:1.4;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-015"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-015"] [data-part="question"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq015Item[] = [
  {
    question: "Где на карточке блока кнопка Copy for AI?",
    answer:
      "В правом верхнем углу карточки и на странице блока рядом с превью. Нажатие кладёт в буфер готовую инструкцию для агента.",
    imageLabel: "Скриншот: карточка блока с кнопкой Copy for AI",
  },
  {
    question: "Как выглядит превью на тёмной теме?",
    answer:
      "Переключатель подложки стоит прямо над превью: блок можно посмотреть на светлой и тёмной теме до установки — палитра переключается сама.",
    imageLabel: "Скриншот: превью блока с переключателем темы",
  },
  {
    question: "Что появляется в проекте после установки?",
    answer:
      "Один файл в components/vibeui с понятным именем. Внутри — компонент, его стили и типы; никакие другие файлы проекта не меняются.",
    imageLabel: "Скриншот: дерево проекта с установленным файлом",
  },
  {
    question: "Можно ли посмотреть исходник до установки?",
    answer:
      "Да, вкладка «Код» на странице блока показывает тот же файл, который придёт в проект: что видите — то и получите.",
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

/** Ответы со слотами под скриншоты: заглушка с градиентной рамкой уже свёрстана. */
export function Faq015({
  eyebrow = "Наглядно",
  title = "Вопросы, на которые проще показать",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Faq015Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="list">
            {items.map((item) => (
              <details key={item.question} data-part="item">
                <summary data-part="question">
                  <span>{item.question}</span>
                  <span data-part="sign" aria-hidden="true" />
                </summary>
                <p data-part="answer">{item.answer}</p>
                {item.imageLabel ? (
                  <figure data-part="slot">
                    <figcaption data-part="slot-label">
                      {item.imageLabel}
                    </figcaption>
                  </figure>
                ) : null}
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
