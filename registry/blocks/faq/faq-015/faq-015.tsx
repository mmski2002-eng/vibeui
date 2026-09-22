import type { CSSProperties } from "react"
import { Card149 } from "@/registry/components/card/card-149/card-149"

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
--vibeui-faq-015-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-015-dur-2:180ms;
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
@container (min-width: 40rem){
[data-vibeui-block="faq-015"] [data-part="shell"]{padding:4.5rem 2rem}
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
              <Card149 key={item.question} data-part="item" question={item.question} answer={item.answer} imageLabel={item.imageLabel} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
