"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid029Row = {
  id: string
  node: string
  region: string
  latency: number
  uptime: string
}

export type Datagrid029Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid029Row[]
  caption?: string
  errorCode?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Состояние в шапке: при сбое и при данных. {count} — число строк. */
  failedStateText?: string
  loadedStateText?: string
  /** Подпись кнопки-переключателя сбоя. */
  simulateText?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Заголовок и объяснение блока ошибки. */
  errorTitle?: string
  errorBody?: string
  /** Подпись кнопки повтора. */
  retryText?: string
  /** Счётчик попыток: до первого повтора и после. {count} — число попыток. */
  triesIdleText?: string
  triesText?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: неудачная загрузка — это состояние таблицы, а не пустой
// экран вместо неё. Шапка остаётся на месте, а в теле стоит объяснение с
// кодом ошибки и кнопкой повтора. Блок помечен role=alert, потому что
// пользователь мог уже увести взгляд; счётчик попыток показывает, что
// повтор действительно происходил, а не кнопка «ничего не делает».
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-029"]){
--vibeui-datagrid-029-bg:transparent;
--vibeui-datagrid-029-fg:light-dark(oklch(0.23 0.014 285),oklch(0.93 0.006 285));
--vibeui-datagrid-029-muted:light-dark(oklch(0.55 0.014 285),oklch(0.68 0.012 285));
--vibeui-datagrid-029-border:light-dark(oklch(0.92 0.006 285),oklch(0.35 0.012 285));
--vibeui-datagrid-029-head:light-dark(oklch(0.975 0.003 285),oklch(0.27 0.012 285));
--vibeui-datagrid-029-accent:light-dark(oklch(0.5 0.15 250),oklch(0.74 0.14 250));
--vibeui-datagrid-029-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 250));
--vibeui-datagrid-029-bad:light-dark(oklch(0.53 0.19 27),oklch(0.76 0.16 27));
--vibeui-datagrid-029-badbg:light-dark(oklch(0.975 0.025 27),oklch(0.28 0.05 27));
--vibeui-datagrid-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-029"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-029-bg);color:var(--vibeui-datagrid-029-fg);
border:1px solid var(--vibeui-datagrid-029-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-029-font);overflow:hidden;
}
[data-vibeui-block="datagrid-029"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-029"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-029-border);
}
[data-vibeui-block="datagrid-029"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-029"] [data-part="state"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-029-muted)}
[data-vibeui-block="datagrid-029"] [data-part="state"][data-bad="true"]{color:var(--vibeui-datagrid-029-bad);font-weight:600}
[data-vibeui-block="datagrid-029"] [data-part="sim"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-029-border);
background:transparent;color:var(--vibeui-datagrid-029-fg);
}
[data-vibeui-block="datagrid-029"] [data-part="sim"]:focus-visible{outline:2px solid var(--vibeui-datagrid-029-accent);outline-offset:2px}
[data-vibeui-block="datagrid-029"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-029"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-029-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-029"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-029"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-029-muted);caption-side:top;
}
[data-vibeui-block="datagrid-029"] th,
[data-vibeui-block="datagrid-029"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-029-border);
}
[data-vibeui-block="datagrid-029"] thead th{background:var(--vibeui-datagrid-029-head);font-weight:600}
[data-vibeui-block="datagrid-029"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-029"] [data-part="node"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem}
[data-vibeui-block="datagrid-029"] [data-part="fail-cell"]{padding:0;border-top:1px solid var(--vibeui-datagrid-029-border)}
[data-vibeui-block="datagrid-029"] [data-part="fail"]{
display:flex;flex-direction:column;align-items:center;gap:0.4375rem;
padding:1.75rem 1.25rem;text-align:center;background:var(--vibeui-datagrid-029-badbg);white-space:normal;
}
/* Значок нарисован рамками: компонент обязан оставаться одним файлом без картинок. */
[data-vibeui-block="datagrid-029"] [data-part="glyph"]{
position:relative;width:2rem;height:2rem;border-radius:999px;
border:2px solid var(--vibeui-datagrid-029-bad);color:var(--vibeui-datagrid-029-bad);
}
[data-vibeui-block="datagrid-029"] [data-part="glyph"]::before{
content:"";position:absolute;inset-inline-start:50%;inset-block-start:0.375rem;
width:2px;height:0.75rem;transform:translateX(-1px);background:currentColor;
}
[data-vibeui-block="datagrid-029"] [data-part="glyph"]::after{
content:"";position:absolute;inset-inline-start:50%;inset-block-end:0.375rem;
width:2px;height:2px;transform:translateX(-1px);background:currentColor;
}
[data-vibeui-block="datagrid-029"] [data-part="fail"] h4{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-029"] [data-part="fail"] p{margin:0;font-size:0.8125rem;color:var(--vibeui-datagrid-029-muted);max-width:26rem;line-height:1.45}
[data-vibeui-block="datagrid-029"] [data-part="code"]{
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.6875rem;
padding:0.125rem 0.4375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-datagrid-029-bad);color:var(--vibeui-datagrid-029-bad);
}
[data-vibeui-block="datagrid-029"] [data-part="retry"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:600;margin-top:0.1875rem;
padding:0.4375rem 0.9375rem;border-radius:0.5rem;border:1px solid transparent;
background:var(--vibeui-datagrid-029-accent);color:var(--vibeui-datagrid-029-on-accent);
}
[data-vibeui-block="datagrid-029"] [data-part="retry"]:focus-visible{outline:2px solid var(--vibeui-datagrid-029-accent);outline-offset:2px}
[data-vibeui-block="datagrid-029"] [data-part="tries"]{font-size:0.6875rem!important}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid029Row[] = [
  {
    id: "s1",
    node: "eu-node-01",
    region: "Франкфурт",
    latency: 24,
    uptime: "99,98 %",
  },
  {
    id: "s2",
    node: "eu-node-02",
    region: "Амстердам",
    latency: 31,
    uptime: "99,91 %",
  },
  {
    id: "s3",
    node: "ru-node-11",
    region: "Москва",
    latency: 12,
    uptime: "99,99 %",
  },
  {
    id: "s4",
    node: "ru-node-12",
    region: "Новосибирск",
    latency: 48,
    uptime: "99,84 %",
  },
]

const COLUMN_TEXT: Record<string, string> = {
  node: "Узел",
  region: "Регион",
  latency: "Задержка, мс",
  uptime: "Доступность",
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
 * Сетка с состоянием ошибки загрузки и повтором: шапка остаётся,
 * в теле стоит код ошибки и кнопка «Повторить». Один файл.
 */
export function Datagrid029({
  rows = DEFAULT_ROWS,
  caption = "Шапка остаётся на месте: понятно, что именно не загрузилось",
  errorCode = "ERR_GATEWAY_504",
  heading = "Узлы сети",
  failedStateText = "Данные не загружены",
  loadedStateText = "Узлов: {count}",
  simulateText = "Симулировать сбой",
  scrollLabel = "Таблица узлов сети, прокручивается вбок",
  columnText = COLUMN_TEXT,
  errorTitle = "Не удалось загрузить список узлов",
  errorBody = "Шлюз мониторинга не ответил за отведённое время. Данные в таблице могли устареть, поэтому она пуста, а не показывает старую выдачу.",
  retryText = "Повторить запрос",
  triesIdleText = "Повтор не запускался",
  triesText = "Попыток повтора: {count}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid029Props) {
  const [failed, setFailed] = useState(true)
  const [tries, setTries] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-029" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-029"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <p data-part="state" data-bad={failed ? "true" : undefined}>
            {failed
              ? failedStateText
              : loadedStateText.replace("{count}", String(rows.length))}
          </p>
          <button
            type="button"
            data-part="sim"
            aria-pressed={failed}
            onClick={() => {
              setFailed((value) => !value)
              setTries(0)
            }}
          >
            {simulateText}
          </button>
        </div>
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
                <th scope="col">{columnText.node ?? COLUMN_TEXT.node}</th>
                <th scope="col">{columnText.region ?? COLUMN_TEXT.region}</th>
                <th scope="col" data-align="end">
                  {columnText.latency ?? COLUMN_TEXT.latency}
                </th>
                <th scope="col" data-align="end">
                  {columnText.uptime ?? COLUMN_TEXT.uptime}
                </th>
              </tr>
            </thead>
            <tbody>
              {failed ? (
                <tr>
                  <td colSpan={4} data-part="fail-cell">
                    <div data-part="fail" role="alert">
                      <span data-part="glyph" aria-hidden="true" />
                      <h4>{errorTitle}</h4>
                      <p>{errorBody}</p>
                      <span data-part="code">{errorCode}</span>
                      <button
                        type="button"
                        data-part="retry"
                        onClick={() => {
                          setTries((value) => value + 1)

                          if (tries >= 1) {
                            setFailed(false)
                          }
                        }}
                      >
                        {retryText}
                      </button>
                      <p data-part="tries" aria-live="polite">
                        {tries === 0
                          ? triesIdleText
                          : triesText.replace("{count}", String(tries))}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" data-part="node">
                      {row.node}
                    </th>
                    <td>{row.region}</td>
                    <td data-align="end">{row.latency}</td>
                    <td data-align="end">{row.uptime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
