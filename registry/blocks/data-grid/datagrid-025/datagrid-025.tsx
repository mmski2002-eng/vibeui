"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid025Row = {
  id: string
  time: string
  event: string
  source: string
  weight: number
}

export type Datagrid025Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid025Row[]
  caption?: string
  batchSize?: number
  /** Заголовок панели над лентой. */
  heading?: string
  /** Счётчик загруженного. {shown} и {total} — числа строк. */
  countText?: string
  /** Подпись полосы прогресса для скринридера. */
  progressLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись кнопки догрузки. {count} — размер следующей порции. */
  moreText?: string
  /** Подпись после полной загрузки. {total} — число строк. */
  doneText?: string
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный список догружается по мере прокрутки, но
// счётчик и кнопка остаются. Автозагрузка срабатывает у нижней кромки
// окна прокрутки, а «Загрузить ещё» дублирует её для клавиатуры и для
// тех, кто дошёл до низа рывком. Полоса прогресса показывает, сколько
// из общего числа уже подгружено — иначе бесконечный список не имеет дна.
//
// Тема берётся из color-scheme окружения через light-dark(): лента темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-025"]){
--vibeui-datagrid-025-bg:transparent;
--vibeui-datagrid-025-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-025-muted:color-mix(in oklab,var(--vibeui-datagrid-025-fg) 68%,transparent);
--vibeui-datagrid-025-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-025-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-025-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-datagrid-025-height:17rem;
--vibeui-datagrid-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-025-dur-2:180ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-025"]{color-scheme:dark}
[data-vibeui-block="datagrid-025"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-025-bg);color:var(--vibeui-datagrid-025-fg);
border:1px solid var(--vibeui-datagrid-025-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-025-font);overflow:hidden;
}
[data-vibeui-block="datagrid-025"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-025"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem 0.625rem;border-bottom:1px solid var(--vibeui-datagrid-025-border);
}
[data-vibeui-block="datagrid-025"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-025"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-025-muted)}
[data-vibeui-block="datagrid-025"] [data-part="track"]{
flex:0 0 100%;height:0.25rem;border-radius:999px;margin-top:0.125rem;
background:var(--vibeui-datagrid-025-border);overflow:hidden;
}
[data-vibeui-block="datagrid-025"] [data-part="fill"]{
display:block;height:100%;border-radius:999px;
width:var(--vibeui-datagrid-025-progress,0%);background:var(--vibeui-datagrid-025-accent);
transition:width var(--vibeui-datagrid-025-dur-2) ease;color:oklch(from var(--vibeui-datagrid-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="datagrid-025"] [data-part="scroll"]{
overflow:auto;max-height:var(--vibeui-datagrid-025-height);
}
[data-vibeui-block="datagrid-025"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-025-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-025"] table{width:100%;border-collapse:separate;border-spacing:0;font-size:0.8125rem}
[data-vibeui-block="datagrid-025"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-025-muted);caption-side:top;
}
[data-vibeui-block="datagrid-025"] th,
[data-vibeui-block="datagrid-025"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-bottom:1px solid var(--vibeui-datagrid-025-border);
}
[data-vibeui-block="datagrid-025"] thead th{
position:sticky;top:0;z-index:2;background:var(--vibeui-datagrid-025-head);font-weight:600;
}
[data-vibeui-block="datagrid-025"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-025"] [data-part="time"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;font-weight:500}
[data-vibeui-block="datagrid-025"] [data-part="source"]{color:var(--vibeui-datagrid-025-muted)}
[data-vibeui-block="datagrid-025"] [data-part="foot"]{
display:flex;align-items:center;justify-content:center;gap:0.5rem;
padding:0.625rem 0.875rem;border-top:1px solid var(--vibeui-datagrid-025-border);
}
[data-vibeui-block="datagrid-025"] [data-part="more"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-025-accent);background:transparent;color:var(--vibeui-datagrid-025-accent);
}
[data-vibeui-block="datagrid-025"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-datagrid-025-accent);outline-offset:2px}
[data-vibeui-block="datagrid-025"] [data-part="done"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-025-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-025"] *{animation:none!important;transition:none!important}}
`

const SOURCES = ["касса-1", "касса-2", "терминал", "самовывоз", "маркетплейс"]
const EVENTS = [
  "Заказ оплачен",
  "Возврат оформлен",
  "Скидка применена",
  "Чек аннулирован",
  "Заказ собран",
  "Доставка назначена",
]

const DEFAULT_ROWS: Datagrid025Row[] = Array.from(
  { length: 48 },
  (_, index) => ({
    id: `l${index + 1}`,
    time: `12:${String(59 - index).padStart(2, "0")}`,
    event: EVENTS[index % EVENTS.length],
    source: SOURCES[index % SOURCES.length],
    weight: 120 + ((index * 37) % 880),
  }),
)

const COLUMN_TEXT: Record<string, string> = {
  time: "Время",
  event: "Событие",
  source: "Источник",
  weight: "Сумма, ₽",
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
 * Сетка с бесконечной прокруткой и счётчиком загруженного: порция
 * догружается у нижней кромки и по кнопке. Один файл, ноль зависимостей.
 */
export function Datagrid025({
  rows = DEFAULT_ROWS,
  caption = "Порция догружается у нижней кромки окна прокрутки",
  batchSize = 12,
  heading = "Лента событий кассы",
  countText = "Загружено {shown} из {total}",
  progressLabel = "Доля загруженных строк",
  scrollLabel = "Лента событий, прокручивается",
  columnText = COLUMN_TEXT,
  moreText = "Загрузить ещё {count}",
  doneText = "Все {total} строк загружены",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid025Props) {
  const [shown, setShown] = useState(batchSize)

  const visible = rows.slice(0, shown)
  const done = shown >= rows.length
  const percent = Math.round((visible.length / rows.length) * 100)

  const palette = {
    "--vibeui-datagrid-025-progress": `${percent}%`,
    ...(accent ? { "--vibeui-datagrid-025-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-025-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function loadMore() {
    setShown((current) => Math.min(rows.length, current + batchSize))
  }

  return (
    <>
      <style href="vibeui-datagrid-025" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-025"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <p data-part="count" role="status" aria-live="polite">
            {countText
              .replace("{shown}", String(visible.length))
              .replace("{total}", String(rows.length))}
          </p>
          <span
            data-part="track"
            role="progressbar"
            aria-label={progressLabel}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span data-part="fill" />
          </span>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
          onScroll={(event) => {
            const box = event.currentTarget

            if (
              !done &&
              box.scrollTop + box.clientHeight >= box.scrollHeight - 24
            ) {
              loadMore()
            }
          }}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">{columnText.time ?? COLUMN_TEXT.time}</th>
                <th scope="col">{columnText.event ?? COLUMN_TEXT.event}</th>
                <th scope="col">{columnText.source ?? COLUMN_TEXT.source}</th>
                <th scope="col" data-align="end">
                  {columnText.weight ?? COLUMN_TEXT.weight}
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <th scope="row" data-part="time">
                    {row.time}
                  </th>
                  <td>{row.event}</td>
                  <td data-part="source">{row.source}</td>
                  <td data-align="end">{row.weight.toLocaleString("ru-RU")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div data-part="foot">
          {done ? (
            <p data-part="done">
              {doneText.replace("{total}", String(rows.length))}
            </p>
          ) : (
            <button type="button" data-part="more" onClick={loadMore}>
              {moreText.replace(
                "{count}",
                String(Math.min(batchSize, rows.length - shown)),
              )}
            </button>
          )}
        </div>
      </section>
    </>
  )
}
