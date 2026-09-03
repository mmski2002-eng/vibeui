import type { CSSProperties } from "react"

export type Features006Row = {
  feature: string
  hint?: string
  ours: string | true
  theirs: string | false
}

export type Features006Props = {
  eyebrow?: string
  title?: string
  ourName?: string
  theirName?: string
  rows?: Features006Row[]
  footnote?: string
  /** Подпись над таблицей: компонент несёт русскую, проект подставляет свою. */
  caption?: string
  /** Заголовок первой колонки. */
  featureLabel?: string
  /** Слово вместо галочки в своей колонке. */
  yesLabel?: string
  /** Расшифровка прочерка для скринридера. */
  noLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: таблица сравнения с альтернативой. Это настоящая <table> с
// <caption> и scope у заголовков — скринридер объявляет строку и колонку,
// а не читает сетку из div'ов. Наша колонка подсвечена фоном на всю высоту
// через выделение ячеек, поэтому взгляд идёт по ней вертикально. На узкой
// ширине таблица не ломается в карточки, а прокручивается по горизонтали
// внутри своей обёртки: сравнение теряет смысл, если колонки разъехались.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: полотно таблицы там светлее фона страницы, линии светлее
// полотна, а подсветка своей колонки остаётся заметной, но не белой.
const STYLES = `
:where([data-vibeui-block="features-006"]){
--vibeui-features-006-bg:transparent;
--vibeui-features-006-fg:light-dark(oklch(0.2 0.012 250),oklch(0.95 0.005 250));
--vibeui-features-006-muted:light-dark(oklch(0.52 0.012 250),oklch(0.72 0.012 250));
--vibeui-features-006-line:light-dark(oklch(0.9 0.006 250),oklch(0.35 0.012 250));
--vibeui-features-006-card:light-dark(oklch(1 0 0),oklch(0.24 0.011 250));
--vibeui-features-006-mine:light-dark(oklch(0.97 0.02 250),oklch(0.3 0.035 258));
--vibeui-features-006-accent:light-dark(oklch(0.5 0.17 258),oklch(0.78 0.14 258));
--vibeui-features-006-no:light-dark(oklch(0.62 0.03 250),oklch(0.62 0.02 250));
--vibeui-features-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-006"]{color-scheme:dark}
[data-vibeui-block="features-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-006-bg);color:var(--vibeui-features-006-fg);
font-family:var(--vibeui-features-006-sans);
}
[data-vibeui-block="features-006"] *{box-sizing:border-box}
[data-vibeui-block="features-006"] [data-part="shell"]{max-width:60rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-006"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-006-accent);
}
[data-vibeui-block="features-006"] h2{
margin:0 0 2rem;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-006"] [data-part="scroll"]{overflow-x:auto;border:1px solid var(--vibeui-features-006-line);border-radius:1rem;background:var(--vibeui-features-006-card)}
[data-vibeui-block="features-006"] table{width:100%;min-width:32rem;border-collapse:collapse;font-size:0.875rem}
[data-vibeui-block="features-006"] caption{
caption-side:top;padding:1rem 1.25rem;text-align:left;font-size:0.75rem;color:var(--vibeui-features-006-muted);
border-bottom:1px solid var(--vibeui-features-006-line);
}
[data-vibeui-block="features-006"] th{text-align:left;font-weight:650}
[data-vibeui-block="features-006"] thead th{
padding:0.875rem 1rem;font-size:0.75rem;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-features-006-muted);border-bottom:1px solid var(--vibeui-features-006-line);
}
[data-vibeui-block="features-006"] [data-part="mine"]{background:var(--vibeui-features-006-mine);color:var(--vibeui-features-006-accent)}
[data-vibeui-block="features-006"] tbody th{padding:0.875rem 1rem;font-size:0.875rem;color:var(--vibeui-features-006-fg)}
[data-vibeui-block="features-006"] [data-part="hint"]{display:block;margin-top:0.1875rem;font-size:0.75rem;font-weight:400;color:var(--vibeui-features-006-muted)}
[data-vibeui-block="features-006"] td{padding:0.875rem 1rem;vertical-align:top;color:var(--vibeui-features-006-muted)}
[data-vibeui-block="features-006"] tbody tr + tr th{border-top:1px solid var(--vibeui-features-006-line)}
[data-vibeui-block="features-006"] tbody tr + tr td{border-top:1px solid var(--vibeui-features-006-line)}
[data-vibeui-block="features-006"] [data-part="yes"]{display:inline-flex;align-items:center;gap:0.375rem;color:var(--vibeui-features-006-accent);font-weight:650}
[data-vibeui-block="features-006"] [data-part="dash"]{color:var(--vibeui-features-006-no)}
[data-vibeui-block="features-006"] [data-part="footnote"]{margin:1rem 0 0;font-size:0.75rem;color:var(--vibeui-features-006-muted)}
@container (min-width: 34rem){
[data-vibeui-block="features-006"] [data-part="shell"]{padding:5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Features006Row[] = [
  {
    feature: "Установка в проект",
    hint: "Сколько шагов до рабочей секции",
    ours: "Одна команда агента",
    theirs: "Копипаст и правка импортов",
  },
  {
    feature: "Зависимости секции",
    ours: "Нет",
    theirs: "Иконки, motion, утилиты",
  },
  {
    feature: "Совпадение с превью",
    hint: "Превью и поставка — один файл",
    ours: true,
    theirs: false,
  },
  {
    feature: "Работа без вашей темы",
    ours: true,
    theirs: false,
  },
  {
    feature: "Инструкция для ИИ-агента",
    ours: "В каждой секции",
    theirs: false,
  },
  {
    feature: "Раскладка в узком контейнере",
    hint: "Сайдбар, колонка блога, превью",
    ours: "Container queries",
    theirs: "Медиазапросы окна",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/** Таблица сравнения с альтернативой: настоящая table, своя колонка подсвечена. */
export function Features006({
  eyebrow = "Сравнение",
  title = "Чем это отличается от копипаста из чужого лендинга",
  ourName = "VibeUI",
  theirName = "Копипаст с сайта",
  rows = DEFAULT_ROWS,
  footnote = "Сравнение с типичной практикой: скопировать секцию из чужого проекта и чинить её под себя.",
  caption = "Сравнение по шести признакам, важным при переносе секции в рабочий проект.",
  featureLabel = "Признак",
  yesLabel = "Есть",
  noLabel = "Нет",
  background = "",
  accent,
  className,
  style,
}: Features006Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <div data-part="scroll">
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{featureLabel}</th>
                  <th scope="col" data-part="mine">
                    {ourName}
                  </th>
                  <th scope="col">{theirName}</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 8).map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">
                      {row.feature}
                      {row.hint ? (
                        <span data-part="hint">{row.hint}</span>
                      ) : null}
                    </th>
                    <td data-part="mine">
                      {row.ours === true ? (
                        <span data-part="yes">
                          <svg viewBox="0 0 16 16" width="12" height="12">
                            <path
                              d="M3.5 8.5 6.5 11.5 12.5 4.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {yesLabel}
                        </span>
                      ) : (
                        row.ours
                      )}
                    </td>
                    <td>
                      {row.theirs === false ? (
                        <span data-part="dash" aria-label={noLabel}>
                          —
                        </span>
                      ) : (
                        row.theirs
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {footnote ? <p data-part="footnote">{footnote}</p> : null}
        </div>
      </section>
    </>
  )
}
