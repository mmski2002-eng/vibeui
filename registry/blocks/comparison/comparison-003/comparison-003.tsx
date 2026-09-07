import type { CSSProperties } from "react"

type Comparison003Row = {
  /** Что человек делает или получает сейчас. */
  before: string
  /** Что становится после. */
  after: string
}

export type Comparison003Props = {
  eyebrow?: string
  title?: string
  beforeLabel?: string
  afterLabel?: string
  rows?: Comparison003Row[]
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// «Было — стало»: две колонки, между ними полоса перехода. Формат для услуги
// и продукта, где сравнивать надо не функции с конкурентом, а жизнь клиента
// до и после. Левая колонка приглушена и перечёркнутая по смыслу — это
// прошлое; правая набрана акцентом.
//
// Строки идут парами и на узком экране складываются в столбик, не теряя
// связки: каждая пара остаётся одной карточкой со стрелкой между половинами.
const STYLES = `
:where([data-vibeui-block="comparison-003"]){
--vibeui-comparison-003-bg:transparent;
--vibeui-comparison-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-comparison-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-comparison-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-comparison-003-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-comparison-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-comparison-003-accent-soft:light-dark(oklch(0.55 0.2144 39.8 / 10%),oklch(0.6803 0.2144 39.8 / 16%));
--vibeui-comparison-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-003"]{color-scheme:dark}
[data-vibeui-block="comparison-003"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-comparison-003-bg);color:var(--vibeui-comparison-003-ink);
font-family:var(--vibeui-comparison-003-font);
}
[data-vibeui-block="comparison-003"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="comparison-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-comparison-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="comparison-003"] [data-part="title"]{margin:0 0 2rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;max-width:24ch}
[data-vibeui-block="comparison-003"] [data-part="heads"]{display:none}
[data-vibeui-block="comparison-003"] [data-part="rows"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="comparison-003"] [data-part="row"]{
display:grid;gap:0.75rem;align-items:stretch;
grid-template-columns:minmax(0,1fr);
padding:1rem;border:1px solid var(--vibeui-comparison-003-border);border-radius:1rem;
background:var(--vibeui-comparison-003-card);
}
[data-vibeui-block="comparison-003"] [data-part="cell"]{min-inline-size:0;display:flex;gap:0.625rem;align-items:flex-start;font-size:0.9375rem;line-height:1.5}
[data-vibeui-block="comparison-003"] [data-part="cell"][data-side="before"]{color:var(--vibeui-comparison-003-muted)}
[data-vibeui-block="comparison-003"] [data-part="mark"]{
flex:none;display:grid;place-items:center;width:1.25rem;height:1.25rem;margin-top:0.125rem;
border-radius:999px;font-size:0.75rem;font-weight:700;line-height:1;
}
[data-vibeui-block="comparison-003"] [data-part="cell"][data-side="before"] [data-part="mark"]{
border:1px solid var(--vibeui-comparison-003-border);color:var(--vibeui-comparison-003-muted);
}
[data-vibeui-block="comparison-003"] [data-part="cell"][data-side="after"] [data-part="mark"]{
background:var(--vibeui-comparison-003-accent-soft);color:var(--vibeui-comparison-003-accent);
}
[data-vibeui-block="comparison-003"] [data-part="label"]{
display:block;margin-bottom:0.125rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-comparison-003-muted);
}
[data-vibeui-block="comparison-003"] [data-part="note"]{margin:1.5rem 0 0;color:var(--vibeui-comparison-003-muted);font-size:0.875rem;line-height:1.5}
@container (min-width: 44rem){
[data-vibeui-block="comparison-003"] [data-part="shell"]{padding:4rem 2rem}
/* На широком экране подписи колонок выносятся в шапку таблицы, а из
   строк уходят: повторять «Было / Стало» в каждой паре незачем. */
[data-vibeui-block="comparison-003"] [data-part="heads"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem;
margin:0 0 0.75rem;padding:0 1rem;
}
[data-vibeui-block="comparison-003"] [data-part="head"]{margin:0;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-comparison-003-muted)}
[data-vibeui-block="comparison-003"] [data-part="head"][data-side="after"]{color:var(--vibeui-comparison-003-accent)}
[data-vibeui-block="comparison-003"] [data-part="row"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem;padding:1rem}
[data-vibeui-block="comparison-003"] [data-part="label"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Comparison003Row[] = [
  {
    before: "Ищете подходящий компонент по десятку вкладок",
    after: "Открываете сценарий и берёте готовую секцию",
  },
  {
    before: "Объясняете агенту дизайн словами",
    after: "Даёте ссылку — агент ставит тот же файл",
  },
  {
    before: "Правите вёрстку после каждой генерации",
    after: "Меняете только тексты и картинки",
  },
  {
    before: "Тянете в проект чужую тему и пакеты",
    after: "Один файл, своя палитра, ноль зависимостей",
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

/** Сравнение «было — стало»: пары строк, прошлое приглушено, будущее в акценте. */
export function Comparison003({
  eyebrow = "Что меняется",
  title = "Было и стало",
  beforeLabel = "Было",
  afterLabel = "Стало",
  rows = DEFAULT_ROWS,
  note = "",
  background = "",
  accent,
  className,
  style,
}: Comparison003Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-comparison-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-comparison-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="comparison-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>

          <div data-part="heads" aria-hidden="true">
            <p data-part="head" data-side="before">
              {beforeLabel}
            </p>
            <p data-part="head" data-side="after">
              {afterLabel}
            </p>
          </div>

          <ul data-part="rows">
            {rows.map((row) => (
              <li key={row.before} data-part="row">
                <div data-part="cell" data-side="before">
                  <span data-part="mark" aria-hidden="true">
                    —
                  </span>
                  <span>
                    <span data-part="label">{beforeLabel}</span>
                    {row.before}
                  </span>
                </div>
                <div data-part="cell" data-side="after">
                  <span data-part="mark" aria-hidden="true">
                    →
                  </span>
                  <span>
                    <span data-part="label">{afterLabel}</span>
                    {row.after}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}
