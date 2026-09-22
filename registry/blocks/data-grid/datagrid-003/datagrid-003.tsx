import type { ComponentProps, CSSProperties } from "react"
import { Card153 } from "@/registry/components/card/card-153/card-153"

export type Datagrid003Row = {
  region: string
  weeks: number[]
  owner: string
}

export type Datagrid003Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid003Row[]
  weeks?: string[]
  caption?: string
  scrollHint?: string
  /** Заголовок шапки над таблицей. */
  heading?: string
  /** Названия закреплённых колонок: region и owner. */
  columnText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Подложка сетки. Липкие колонки требуют непрозрачного цвета. */
  background?: string
  accent?: string
}

// Идея компонента: широкая сетка, у которой закреплены обе крайние колонки —
// подпись строки слева и колонка действия справа. Между ними уезжают недели.
// Прокрутка живёт в собственном контейнере с tabindex и подписью, поэтому
// она работает с клавиатуры, а не только колесом. Тень у закреплённых колонок
// появляется по прокрутке через scroll-timeline там, где он поддержан.
//
// Тема берётся из color-scheme окружения через light-dark(). Подложка тут
// непрозрачная намеренно: липкие колонки перекрывают уезжающие ячейки только
// собственным фоном.
const STYLES = `
:where([data-vibeui-block="datagrid-003"]){
--vibeui-datagrid-003-bg:light-dark(oklch(1 0 0),oklch(0.2 0 250));
--vibeui-datagrid-003-fg:light-dark(oklch(0.23 0 250),oklch(0.93 0 250));
--vibeui-datagrid-003-muted:color-mix(in oklab,var(--vibeui-datagrid-003-fg) 68%,transparent);
--vibeui-datagrid-003-border:light-dark(oklch(0.92 0 250),oklch(0.34 0 250));
--vibeui-datagrid-003-head:light-dark(oklch(0.975 0 250),oklch(0.27 0 250));
--vibeui-datagrid-003-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-datagrid-003-shadow:light-dark(oklch(0.23 0 250 / 18%),oklch(0 0 0 / 45%));
--vibeui-datagrid-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-003"]{color-scheme:dark}
[data-vibeui-block="datagrid-003"]{
box-sizing:border-box;width:100%;max-width:60rem;margin:0 auto;
background:var(--vibeui-datagrid-003-bg);color:var(--vibeui-datagrid-003-fg);
border:1px solid var(--vibeui-datagrid-003-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-003-font);overflow:hidden;
}
[data-vibeui-block="datagrid-003"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-003"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-003"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-003-accent);outline-offset:-2px}
/* separate, а не collapse: со схлопнутыми границами липкая ячейка теряет
   свою линию, и колонка выглядит оторванной от таблицы. */
[data-vibeui-block="datagrid-003"] table{
width:100%;min-width:52rem;border-collapse:separate;border-spacing:0;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-003"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-003-muted);
}
[data-vibeui-block="datagrid-003"] th,
[data-vibeui-block="datagrid-003"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-bottom:1px solid var(--vibeui-datagrid-003-border);
background:var(--vibeui-datagrid-003-bg);
}
[data-vibeui-block="datagrid-003"] thead th{background:var(--vibeui-datagrid-003-head);font-weight:600}
[data-vibeui-block="datagrid-003"] tbody tr:last-child th,
[data-vibeui-block="datagrid-003"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="datagrid-003"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Закреплённые края. Фон обязателен: без него уезжающие ячейки видно
   насквозь. */
[data-vibeui-block="datagrid-003"] [data-part="lead"]{
position:sticky;left:0;z-index:2;min-width:9rem;
border-right:1px solid var(--vibeui-datagrid-003-border);
}
[data-vibeui-block="datagrid-003"] [data-part="trail"]{
position:sticky;right:0;z-index:2;text-align:right;
border-left:1px solid var(--vibeui-datagrid-003-border);
}
[data-vibeui-block="datagrid-003"] thead [data-part="lead"],
[data-vibeui-block="datagrid-003"] thead [data-part="trail"]{z-index:3;background:var(--vibeui-datagrid-003-head)}
[data-vibeui-block="datagrid-003"] [data-part="owner"]{color:var(--vibeui-datagrid-003-muted)}
[data-vibeui-block="datagrid-003"] [data-part="peak"]{
display:inline-block;padding:0.0625rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-datagrid-003-accent);
background:color-mix(in oklab, var(--vibeui-datagrid-003-accent) 12%, transparent);
font-weight:600;
}
@supports (animation-timeline: scroll(nearest inline)){
[data-vibeui-block="datagrid-003"] [data-part="lead"]{
animation:vibeui-datagrid-003-lead linear both;
animation-timeline:scroll(nearest inline);animation-range:0 2rem;
}
[data-vibeui-block="datagrid-003"] [data-part="trail"]{
animation:vibeui-datagrid-003-trail linear both;
animation-timeline:scroll(nearest inline);animation-range:calc(100% - 2rem) 100%;
}
@keyframes vibeui-datagrid-003-lead{
from{clip-path:inset(0 -1rem 0 0);box-shadow:0 0 0 transparent}
to{clip-path:inset(0 -1rem 0 0);box-shadow:0.5rem 0 0.75rem -0.5rem var(--vibeui-datagrid-003-shadow)}
}
@keyframes vibeui-datagrid-003-trail{
from{clip-path:inset(0 0 0 -1rem);box-shadow:-0.5rem 0 0.75rem -0.5rem var(--vibeui-datagrid-003-shadow)}
to{clip-path:inset(0 0 0 -1rem);box-shadow:0 0 0 transparent}
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WEEKS = [
  "Нед. 1",
  "Нед. 2",
  "Нед. 3",
  "Нед. 4",
  "Нед. 5",
  "Нед. 6",
  "Нед. 7",
  "Нед. 8",
]

const DEFAULT_ROWS: Datagrid003Row[] = [
  {
    region: "Москва",
    weeks: [412, 388, 455, 501, 478, 522, 590, 544],
    owner: "Орлова",
  },
  {
    region: "Петербург",
    weeks: [280, 305, 291, 318, 344, 330, 352, 371],
    owner: "Ким",
  },
  {
    region: "Казань",
    weeks: [141, 158, 162, 149, 173, 181, 176, 194],
    owner: "Гнедин",
  },
  {
    region: "Новосибирск",
    weeks: [98, 112, 121, 108, 133, 127, 140, 152],
    owner: "Савва",
  },
  {
    region: "Екатеринбург",
    weeks: [120, 118, 131, 145, 139, 151, 148, 163],
    owner: "Лебедь",
  },
]

const COLUMN_LABEL: Record<string, string> = {
  region: "Регион",
  owner: "Менеджер",
}

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
 * Широкая сетка с закреплёнными крайними колонками: подпись строки слева,
 * действие справа, недели прокручиваются между ними. Серверный компонент.
 */
export function Datagrid003({
  rows = DEFAULT_ROWS,
  weeks = DEFAULT_WEEKS,
  caption = "Заказы по неделям, штук",
  scrollHint = "Прокрутите вбок: крайние колонки закреплены",
  heading = "Поставки по регионам",
  columnText = COLUMN_LABEL,
  scrollLabel = "Таблица поставок по неделям, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid003Props) {
  const palette = {
    ...(accent ? { "--vibeui-datagrid-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-003"
        className={className}
        style={palette}
      >
        <Card153 data-part="head" heading={heading} scrollHint={scrollHint} accent={accent} />
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="lead">
                  {columnText.region ?? COLUMN_LABEL.region}
                </th>
                {weeks.map((week) => (
                  <th key={week} scope="col" data-align="end">
                    {week}
                  </th>
                ))}
                <th scope="col" data-part="trail">
                  {columnText.owner ?? COLUMN_LABEL.owner}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const peak = Math.max(...row.weeks)

                return (
                  <tr key={row.region}>
                    <th scope="row" data-part="lead">
                      {row.region}
                    </th>
                    {row.weeks.map((value, index) => (
                      <td key={weeks[index] ?? index} data-align="end">
                        {value === peak ? (
                          <span data-part="peak">{value}</span>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                    <td data-part="trail">
                      <span data-part="owner">{row.owner}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
