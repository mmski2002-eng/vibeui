import type { ComponentProps, CSSProperties } from "react"

export type Table002Value = boolean | string

export type Table002Row = {
  label: string
  values: Table002Value[]
}

export type Table002Props = Omit<ComponentProps<"div">, "children"> & {
  /** Названия сравниваемых вариантов. */
  options?: string[]
  rows?: Table002Row[]
  /** Номер выделенной колонки, считая с нуля. -1 — без выделения. */
  highlight?: number
  /** Заголовок первой колонки. */
  featureLabel?: string
  /** Подписи для скринридера: компонент несёт русские, проект подставляет свои. */
  valueText?: Record<string, string>
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сравнение читают строками, а глазами держатся за колонку.
// Поэтому первая колонка липнет при горизонтальной прокрутке, а выбранный
// вариант подсвечен целиком, а не только в заголовке.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-002"]){
--vibeui-table-002-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-002-muted:color-mix(in oklab,var(--vibeui-table-002-fg) 68%,transparent);
--vibeui-table-002-bg:transparent;
--vibeui-table-002-head:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-table-002-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-table-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-002-yes:light-dark(oklch(0.58 0.15 152),oklch(0.76 0.14 152));
--vibeui-table-002-radius:0.75rem;
--vibeui-table-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-002"]{color-scheme:dark}
[data-vibeui-block="table-002"]{
width:100%;min-width:min(100%,16rem);box-sizing:border-box;overflow-x:auto;
border:1px solid var(--vibeui-table-002-border);
border-radius:var(--vibeui-table-002-radius);
background:var(--vibeui-table-002-bg);color:var(--vibeui-table-002-fg);
font-family:var(--vibeui-table-002-font);
}
/* table-layout:auto считает ширины колонок по nowrap-содержимому и не
   признаёт border-box контейнера: на узком экране это раздвигает страницу
   мимо overflow-x:auto обёртки. Fixed держит таблицу в её ширине, auto
   возвращается, когда контейнеру хватает места под исходные пропорции. */
[data-vibeui-block="table-002"] table{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;font-size:0.875rem}
@container (min-width: 28rem){
[data-vibeui-block="table-002"] table{table-layout:auto}
}
[data-vibeui-block="table-002"] th,
[data-vibeui-block="table-002"] td{
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-table-002-border);
text-align:center;white-space:nowrap;
}
[data-vibeui-block="table-002"] tr:last-child th,
[data-vibeui-block="table-002"] tr:last-child td{border-bottom:0}
[data-vibeui-block="table-002"] thead th{
font-size:0.8125rem;font-weight:600;
background:var(--vibeui-table-002-head);
}
/* Первая колонка липнет: при прокрутке вправо строка не теряет подпись.
   Плашка под ней непрозрачная — иначе значения проезжали бы сквозь подписи. */
[data-vibeui-block="table-002"] [data-part="label"]{
position:sticky;left:0;z-index:1;
text-align:left;font-weight:500;white-space:normal;
background:var(--vibeui-table-002-head);
box-shadow:1px 0 0 var(--vibeui-table-002-border);
}
/* Выделенный вариант подсвечен во всех строках, а не только в шапке. */
[data-vibeui-block="table-002"] [data-highlight="true"]{
background:color-mix(in oklab,var(--vibeui-table-002-accent) 7%,transparent);
}
[data-vibeui-block="table-002"] thead [data-highlight="true"]{
color:var(--vibeui-table-002-accent);
background:color-mix(in oklab,var(--vibeui-table-002-accent) 12%,transparent);
}
[data-vibeui-block="table-002"] [data-part="yes"]{color:var(--vibeui-table-002-yes);font-weight:600}
[data-vibeui-block="table-002"] [data-part="no"]{color:var(--vibeui-table-002-muted)}
/* Слово для скринридера: галочку и прочерк он прочитает как символы. */
[data-vibeui-block="table-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Старт", "Команда", "Студия"]

const DEFAULT_ROWS: Table002Row[] = [
  { label: "Проектов", values: ["1", "10", "Без ограничений"] },
  { label: "Свой домен", values: [false, true, true] },
  { label: "Совместная работа", values: [false, true, true] },
  { label: "История публикаций", values: ["7 дней", "90 дней", "Навсегда"] },
  { label: "Поддержка", values: ["Почта", "Почта", "Чат за час"] },
]

const VALUE_TEXT: Record<string, string> = { yes: "да", no: "нет" }

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
 * Таблица сравнения вариантов: липкая первая колонка, выделенный столбец.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table002({
  options = DEFAULT_OPTIONS,
  rows = DEFAULT_ROWS,
  highlight = 1,
  featureLabel = "Что входит",
  valueText = VALUE_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Table002Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-002"
        className={className}
        style={palette}
      >
        <table>
          <thead>
            <tr>
              <th data-part="label" scope="col">
                {featureLabel}
              </th>
              {options.map((option, index) => (
                <th
                  key={option}
                  scope="col"
                  data-highlight={index === highlight || undefined}
                >
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th data-part="label" scope="row">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    data-highlight={index === highlight || undefined}
                  >
                    {typeof value === "boolean" ? (
                      <span data-part={value ? "yes" : "no"}>
                        <span aria-hidden="true">{value ? "✓" : "—"}</span>
                        <span data-part="sr">
                          {value
                            ? (valueText.yes ?? VALUE_TEXT.yes)
                            : (valueText.no ?? VALUE_TEXT.no)}
                        </span>
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
