import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Comparison004Group = {
  title: string
  rows: {
    label: string
    /** Значение по колонкам: строка, `true` — есть, `false` — нет. */
    values: (string | boolean)[]
  }[]
}

type Comparison004Column = {
  name: string
  note?: string
  highlight?: boolean
}

export type Comparison004Props = {
  eyebrow?: string
  title?: string
  columns?: Comparison004Column[]
  groups?: Comparison004Group[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Матрица возможностей: строки сгруппированы по разделам, колонок три и
// больше. От таблицы «мы против них» отличается тем, что сравнивает не два
// лагеря, а несколько тарифов или редакций, и держит подзаголовки групп —
// на длинном списке функций без них теряешься уже к десятой строке.
//
// Первая колонка липкая: на узкой ширине таблица прокручивается вбок, и без
// закреплённого названия строки значения перестают что-либо значить.
const STYLES = `[data-vibeui-block="comparison-004"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="comparison-004"]){
--vibeui-comparison-004-bg:transparent;
--vibeui-comparison-004-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-comparison-004-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-comparison-004-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-comparison-004-card:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-comparison-004-zebra:light-dark(oklch(0.97 0 0),oklch(0.24 0 0));
--vibeui-comparison-004-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-comparison-004-accent-soft:light-dark(oklch(0.287 0 0 / 8%),oklch(0.892 0 0 / 14%));
--vibeui-comparison-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-004"]{color-scheme:dark}
[data-vibeui-block="comparison-004"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-comparison-004-bg);color:var(--vibeui-comparison-004-ink);
font-family:var(--vibeui-comparison-004-font);
}
[data-vibeui-block="comparison-004"] [data-part="shell"]{max-width:68rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="comparison-004"] [data-part="scroller"]{
overflow-x:auto;border:1px solid var(--vibeui-comparison-004-border);border-radius:1rem;
background:var(--vibeui-comparison-004-card);
}
[data-vibeui-block="comparison-004"] table{width:100%;min-width:34rem;border-collapse:collapse;font-size:0.9375rem}
/* Заголовок таблицы и подпись угловой ячейки нужны скринридеру, но не
   глазу: собственные стили, а не класс sr-only — блок не вправе зависеть
   от утилит проекта. */
[data-vibeui-block="comparison-004"] caption,
[data-vibeui-block="comparison-004"] [data-part="hidden"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="comparison-004"] th,
[data-vibeui-block="comparison-004"] td{padding:0.75rem 1rem;text-align:left;vertical-align:top}
[data-vibeui-block="comparison-004"] thead th{
position:sticky;top:0;background:var(--vibeui-comparison-004-card);
border-bottom:1px solid var(--vibeui-comparison-004-border);
font-size:0.9375rem;font-weight:700;
}
/* Первая колонка держится на месте при прокрутке вбок: без неё значения
   в правых колонках теряют строку, к которой относятся. */
[data-vibeui-block="comparison-004"] [data-part="row-head"],
[data-vibeui-block="comparison-004"] thead [data-part="corner"]{
position:sticky;left:0;z-index:1;background:var(--vibeui-comparison-004-card);
}
[data-vibeui-block="comparison-004"] thead [data-part="corner"]{z-index:2}
[data-vibeui-block="comparison-004"] [data-part="col-note"]{display:block;margin-top:0.125rem;font-size:0.75rem;font-weight:400;color:var(--vibeui-comparison-004-muted)}
[data-vibeui-block="comparison-004"] th[data-highlight="true"]{color:var(--vibeui-comparison-004-accent)}
[data-vibeui-block="comparison-004"] td[data-highlight="true"]{background:var(--vibeui-comparison-004-accent-soft)}
[data-vibeui-block="comparison-004"] [data-part="group"] th{
padding-top:1.25rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-comparison-004-muted);background:var(--vibeui-comparison-004-zebra);
}
[data-vibeui-block="comparison-004"] tbody tr + tr th[scope="row"],
[data-vibeui-block="comparison-004"] tbody tr + tr td{border-top:1px solid var(--vibeui-comparison-004-border)}
[data-vibeui-block="comparison-004"] [data-part="row-head"]{font-weight:400;color:var(--vibeui-comparison-004-ink)}
[data-vibeui-block="comparison-004"] [data-part="yes"]{color:var(--vibeui-comparison-004-accent);font-weight:700}
[data-vibeui-block="comparison-004"] [data-part="no"]{color:var(--vibeui-comparison-004-muted)}
@container (min-width: 48rem){
[data-vibeui-block="comparison-004"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="comparison-004"] th,
[data-vibeui-block="comparison-004"] td{padding:0.875rem 1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Comparison004Column[] = [
  { name: "Старт", note: "для одного проекта" },
  { name: "Команда", note: "до десяти человек", highlight: true },
  { name: "Компания", note: "без ограничений" },
]

const DEFAULT_GROUPS: Comparison004Group[] = [
  {
    title: "Каталог",
    rows: [
      { label: "Блоки и компоненты", values: ["Все", "Все", "Все"] },
      { label: "Копирование для ИИ", values: [true, true, true] },
      { label: "Сценарии сборки", values: [false, true, true] },
    ],
  },
  {
    title: "Работа вместе",
    rows: [
      { label: "Участников", values: ["1", "10", "Без ограничений"] },
      { label: "Общие подборки", values: [false, true, true] },
      { label: "История установок", values: [false, true, true] },
    ],
  },
  {
    title: "Поддержка",
    rows: [
      { label: "Ответ на письмо", values: ["3 дня", "1 день", "2 часа"] },
      { label: "Разбор внедрения", values: [false, false, true] },
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

/** Матрица возможностей: строки по группам, значения по колонкам-редакциям. */
export function Comparison004({
  eyebrow = "Сравнение редакций",
  title = "Что входит в каждый план",
  columns = DEFAULT_COLUMNS,
  groups = DEFAULT_GROUPS,
  background = "",
  accent,
  className,
  style,
}: Comparison004Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-comparison-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-comparison-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="comparison-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />

          <div data-part="scroller">
            <table>
              <caption>{title}</caption>
              <thead>
                <tr>
                  <th scope="col" data-part="corner">
                    <span data-part="hidden">{eyebrow}</span>
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.name}
                      scope="col"
                      data-highlight={column.highlight ? "true" : undefined}
                    >
                      {column.name}
                      {column.note ? (
                        <span data-part="col-note">{column.note}</span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>

              {groups.map((group) => (
                <tbody key={group.title}>
                  <tr data-part="group">
                    <th scope="colgroup" colSpan={columns.length + 1}>
                      {group.title}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" data-part="row-head">
                        {row.label}
                      </th>
                      {columns.map((column, index) => {
                        const value = row.values[index]

                        return (
                          <td
                            key={column.name}
                            data-highlight={
                              column.highlight ? "true" : undefined
                            }
                          >
                            {typeof value === "boolean" ? (
                              <span
                                data-part={value ? "yes" : "no"}
                                aria-label={value ? "есть" : "нет"}
                              >
                                {value ? "✓" : "—"}
                              </span>
                            ) : (
                              (value ?? "—")
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
