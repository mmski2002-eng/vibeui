import type { CSSProperties } from "react"

type Comparison005Pair = {
  /** Возражение или привычный способ. */
  claim: string
  /** Чем отвечаем. */
  answer: string
}

export type Comparison005Props = {
  eyebrow?: string
  title?: string
  lead?: string
  claimLabel?: string
  answerLabel?: string
  pairs?: Comparison005Pair[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Разбор возражений парами: слева привычное мнение, справа ответ. Таблицы
// нет намеренно — сравниваются не характеристики, а утверждения, и каждая
// пара читается сама по себе, в любом порядке.
//
// Пары идут в две колонки на широком экране и в одну на узком, но карточка
// пары не делится: возражение и ответ обязаны оставаться рядом, иначе на
// телефоне человек прочитает подряд четыре возражения без единого ответа.
const STYLES = `
:where([data-vibeui-block="comparison-005"]){
--vibeui-comparison-005-bg:transparent;
--vibeui-comparison-005-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-comparison-005-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-comparison-005-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-comparison-005-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-comparison-005-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-comparison-005-accent-soft:light-dark(oklch(0.55 0.2144 39.8 / 10%),oklch(0.6803 0.2144 39.8 / 16%));
--vibeui-comparison-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-005"]{color-scheme:dark}
[data-vibeui-block="comparison-005"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-comparison-005-bg);color:var(--vibeui-comparison-005-ink);
font-family:var(--vibeui-comparison-005-font);
}
[data-vibeui-block="comparison-005"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="comparison-005"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-comparison-005-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="comparison-005"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;max-width:22ch}
[data-vibeui-block="comparison-005"] [data-part="lead"]{margin:0 0 2rem;max-width:56ch;color:var(--vibeui-comparison-005-muted);font-size:1rem;line-height:1.6}
[data-vibeui-block="comparison-005"] [data-part="pairs"]{list-style:none;margin:0;padding:0;display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="comparison-005"] [data-part="pair"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.875rem;
padding:1.25rem;border:1px solid var(--vibeui-comparison-005-border);border-radius:1.125rem;
background:var(--vibeui-comparison-005-card);
}
[data-vibeui-block="comparison-005"] [data-part="claim"]{margin:0;font-size:1.0625rem;line-height:1.4;font-weight:600}
/* Кавычки висят на самом тексте, а не на абзаце: внутри абзаца ещё
   подпись стороны, и открывающая кавычка встала бы перед ней. */
[data-vibeui-block="comparison-005"] [data-part="claim"] [data-part="text"]::before{
content:"«";color:var(--vibeui-comparison-005-muted);
}
[data-vibeui-block="comparison-005"] [data-part="claim"] [data-part="text"]::after{
content:"»";color:var(--vibeui-comparison-005-muted);
}
[data-vibeui-block="comparison-005"] [data-part="answer"]{
position:relative;margin:0;padding-left:1.75rem;
color:var(--vibeui-comparison-005-ink);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="comparison-005"] [data-part="answer"]::before{
content:"";position:absolute;left:0;top:0.125rem;
width:1.125rem;height:1.125rem;border-radius:999px;
background:var(--vibeui-comparison-005-accent-soft);
}
[data-vibeui-block="comparison-005"] [data-part="answer"]::after{
content:"";position:absolute;left:0.375rem;top:0.5rem;
width:0.375rem;height:0.1875rem;border-left:2px solid var(--vibeui-comparison-005-accent);
border-bottom:2px solid var(--vibeui-comparison-005-accent);transform:rotate(-45deg);
}
[data-vibeui-block="comparison-005"] [data-part="side"]{
display:block;margin-bottom:0.25rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-comparison-005-muted);
}
[data-vibeui-block="comparison-005"] [data-part="answer"] [data-part="side"]{color:var(--vibeui-comparison-005-accent)}
@container (min-width: 44rem){
[data-vibeui-block="comparison-005"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="comparison-005"] [data-part="pairs"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PAIRS: Comparison005Pair[] = [
  {
    claim: "Проще попросить нейросеть нарисовать такой же блок",
    answer:
      "Нарисует похожий и каждый раз другой. Здесь агент ставит тот самый файл, который вы видели в превью.",
  },
  {
    claim: "Библиотека потянет за собой зависимости и чужую тему",
    answer:
      "Каждый блок — один файл со своей палитрой. Ни пакетов, ни привязки к вашей теме.",
  },
  {
    claim: "Придётся переписывать под свой дизайн",
    answer:
      "Меняются переменные и тексты. Раскладка, типографика и поведение остаются рабочими.",
  },
  {
    claim: "На телефоне всё поедет",
    answer:
      "Раскладка считается от ширины самого блока, а не окна: он одинаково ведёт себя в колонке и на всю страницу.",
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

/** Разбор возражений парами: слева привычное мнение, справа ответ. */
export function Comparison005({
  eyebrow = "Частые сомнения",
  title = "«А зачем это, если…»",
  lead = "Четыре возражения, которые слышим чаще всего, и что на них отвечаем.",
  claimLabel = "Обычно говорят",
  answerLabel = "Как на самом деле",
  pairs = DEFAULT_PAIRS,
  background = "",
  accent,
  className,
  style,
}: Comparison005Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-comparison-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-comparison-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="comparison-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lead ? <p data-part="lead">{lead}</p> : null}

          <ul data-part="pairs">
            {pairs.map((pair) => (
              <li key={pair.claim} data-part="pair">
                <p data-part="claim">
                  <span data-part="side">{claimLabel}</span>
                  <span data-part="text">{pair.claim}</span>
                </p>
                <p data-part="answer">
                  <span data-part="side">{answerLabel}</span>
                  {pair.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
