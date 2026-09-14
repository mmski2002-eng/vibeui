import type { ComponentProps, CSSProperties } from "react"

export type Chart022Row = {
  label: string
  value: number
  wasRank?: number
}

export type Chart022Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart022Row[]
  unit?: string
  showMoves?: boolean
  /** Подпись под списком: {unit}. */
  unitLabel?: string
  /** Движение места: ключи up, down и flat, плейсхолдер {shift}. */
  moveText?: Record<string, string>
  /** Въезжать строками по очереди при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: рейтинг, в котором место важнее величины. Номер позиции
// стоит отдельной колонкой, а рядом — движение относительно прошлого замера:
// «был четвёртым, стал вторым». Без движения таблица топа отвечает только
// «кто сейчас», а спрашивают обычно «что изменилось».
//
// Тема берётся из color-scheme окружения через light-dark(): рейтинг темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-022"]){
--vibeui-chart-022-bg:transparent;
--vibeui-chart-022-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-022-muted:color-mix(in oklab,var(--vibeui-chart-022-fg) 68%,transparent);
--vibeui-chart-022-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-022-track:light-dark(oklch(0.95 0 265),oklch(0.29 0 265));
--vibeui-chart-022-dim:light-dark(oklch(0.9 0 265),oklch(0.42 0 265));
--vibeui-chart-022-accent:light-dark(oklch(0.5 0.2 282),oklch(0.74 0.14 282));
--vibeui-chart-022-dur:0.9s;
--vibeui-chart-022-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-022-up:light-dark(oklch(0.55 0.14 155),oklch(0.76 0.14 155));
--vibeui-chart-022-down:light-dark(oklch(0.58 0.16 25),oklch(0.73 0.15 25));
--vibeui-chart-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-022"]{color-scheme:dark}
[data-vibeui-block="chart-022"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-022-bg);
border:1px solid var(--vibeui-chart-022-border);border-radius:0.875rem;
color:var(--vibeui-chart-022-fg);font-family:var(--vibeui-chart-022-font);
}
\[data\-vibeui\-block="chart\-022"\] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-022"] ol{display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0;list-style:none}
/* Номер, имя, движение и значение живут в одной сетке, полоса занимает всю
   строку снизу: числа не разъезжаются между строками. */
[data-vibeui-block="chart-022"] [data-part="row"]{
display:grid;grid-template-columns:1.25rem 1fr auto auto;align-items:center;
gap:0.125rem 0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="chart-022"] [data-part="rank"]{
font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-chart-022-muted);
}
[data-vibeui-block="chart-022"] li:nth-child(-n+3) [data-part="rank"]{color:var(--vibeui-chart-022-accent)}
[data-vibeui-block="chart-022"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="chart-022"] [data-part="move"]{
font-size:0.6875rem;font-variant-numeric:tabular-nums;color:var(--vibeui-chart-022-muted);
}
[data-vibeui-block="chart-022"] [data-part="move"][data-dir="up"]{color:var(--vibeui-chart-022-up)}
[data-vibeui-block="chart-022"] [data-part="move"][data-dir="down"]{color:var(--vibeui-chart-022-down)}
[data-vibeui-block="chart-022"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-022"] [data-part="track"]{
grid-column:2 / -1;height:0.375rem;border-radius:9999px;
background:var(--vibeui-chart-022-track);overflow:hidden;
}
[data-vibeui-block="chart-022"] [data-part="row"]{transition:opacity 0.2s}
[data-vibeui-block="chart-022"] ol:hover [data-part="row"]:not(:hover){opacity:0.55}
[data-vibeui-block="chart-022"] [data-part="row"]:hover [data-part="value"]{color:var(--vibeui-chart-022-accent)}
[data-vibeui-block="chart-022"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;transform-origin:left;
background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-chart-022-accent) 80%,#fff 8%),var(--vibeui-chart-022-accent));
color:oklch(from var(--vibeui-chart-022-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="chart-022"] li:not(:nth-child(-n+3)) [data-part="fill"]{
background:color-mix(in oklab,var(--vibeui-chart-022-accent) 45%,var(--vibeui-chart-022-dim));
}
[data-vibeui-block="chart-022"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-022-muted)}
/* Появление: строки въезжают по очереди, полосы растут, стрелки выскакивают. */
[data-vibeui-block="chart-022"][data-animate] [data-part="row"]{opacity:0;translate:-0.5rem 0;animation:vibeui-chart-022-slide 0.5s var(--vibeui-chart-022-ease) calc(var(--i) * 70ms) forwards}
[data-vibeui-block="chart-022"][data-animate] [data-part="fill"]{transform:scaleX(0);animation:vibeui-chart-022-grow 0.7s var(--vibeui-chart-022-ease) calc(var(--i) * 70ms + 0.2s) forwards}
[data-vibeui-block="chart-022"][data-animate] [data-part="move"]{opacity:0;translate:0 0.25rem;animation:vibeui-chart-022-slide 0.35s var(--vibeui-chart-022-ease) calc(var(--i) * 70ms + 0.5s) forwards}
@keyframes vibeui-chart-022-slide{to{opacity:1;translate:0 0}}
@keyframes vibeui-chart-022-grow{to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-022"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-022"][data-animate] [data-part="row"],[data-vibeui-block="chart-022"][data-animate] [data-part="move"]{opacity:1;translate:none}
[data-vibeui-block="chart-022"][data-animate] [data-part="fill"]{transform:none}
}
`

const DEFAULT_ROWS: Chart022Row[] = [
  { label: "Тарифы", value: 5240, wasRank: 3 },
  { label: "Каталог", value: 4810, wasRank: 1 },
  { label: "Главная", value: 3960, wasRank: 2 },
  { label: "Документация", value: 2180, wasRank: 6 },
  { label: "Блог", value: 1640, wasRank: 4 },
  { label: "Вакансии", value: 720, wasRank: 5 },
]

const MOVE_TEXT: Record<string, string> = {
  up: "▲ {shift}",
  down: "▼ {shift}",
  flat: "— без движения",
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Рейтинг с номерами мест и движением относительно прошлого замера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart022({
  title = "Топ страниц за неделю",
  rows = DEFAULT_ROWS,
  unit = "визитов",
  showMoves = true,
  unitLabel = "Единица измерения: {unit}. Стрелка — изменение места с прошлой недели.",
  moveText = MOVE_TEXT,
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart022Props) {
  const max = Math.max(...rows.map((row) => row.value), 1)

  const palette = {
    ...(accent ? { "--vibeui-chart-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-022" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-022"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ol>
          {rows.map((row, index) => {
            const rank = index + 1
            // Движение вверх — это уменьшение номера места, поэтому знак
            // считается наоборот привычному «больше значит лучше».
            const shift = row.wasRank ? row.wasRank - rank : 0
            const direction = shift > 0 ? "up" : shift < 0 ? "down" : "flat"

            return (
              <li key={row.label} data-part="row" style={{ "--i": index } as CSSProperties}>
                <span data-part="rank">{rank}</span>
                <span data-part="name">{row.label}</span>
                {showMoves ? (
                  <span data-part="move" data-dir={direction}>
                    {fillTemplate(moveText[direction] ?? MOVE_TEXT[direction], {
                      shift: Math.abs(shift),
                    })}
                  </span>
                ) : (
                  <span data-part="move" />
                )}
                <span data-part="value">{row.value}</span>
                <span data-part="track" aria-hidden="true">
                  <span
                    data-part="fill"
                    style={{
                      width: `${Math.max((row.value / max) * 100, 2)}%`,
                    }}
                  />
                </span>
              </li>
            )
          })}
        </ol>
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
      </figure>
    </>
  )
}
