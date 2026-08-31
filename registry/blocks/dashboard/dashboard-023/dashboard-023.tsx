import type { CSSProperties } from "react"

export type Dashboard023Entry = {
  time: string
  level: "info" | "warn" | "error"
  source: string
  message: string
  details?: { label: string; value: string }[]
}

export type Dashboard023Props = {
  title?: string
  query?: string
  levels?: string[]
  activeLevel?: string
  ranges?: string[]
  activeRange?: string
  entries?: Dashboard023Entry[]
  foundLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: журнал, где подробности записи раскрываются на месте, а не в
// боковой панели. Панель уводит взгляд от соседних строк, а в логах соседи —
// половина смысла. Каждая строка это details/summary: состояние держит
// браузер, клавиатура работает даром, и раскрытых строк может быть сколько
// угодно одновременно. Уровень помечен буквой и рамкой, а не одним цветом,
// время идёт моноширинным с табличными цифрами, чтобы столбец не дрожал.
const STYLES = `
:where([data-vibeui-block="dashboard-023"]){
--vibeui-dashboard-023-bg:oklch(1 0 0);
--vibeui-dashboard-023-panel:oklch(0.98 0.003 265);
--vibeui-dashboard-023-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-023-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-023-border:oklch(0.91 0.006 265);
--vibeui-dashboard-023-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-023-warn:oklch(0.62 0.15 65);
--vibeui-dashboard-023-error:oklch(0.55 0.18 25);
--vibeui-dashboard-023-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-023-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-023"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-023-bg);
color:var(--vibeui-dashboard-023-fg);
font-family:var(--vibeui-dashboard-023-sans);
border:1px solid var(--vibeui-dashboard-023-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-023"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-023"] [data-part="head"]{padding:1rem 1.125rem 0.75rem}
[data-vibeui-block="dashboard-023"] h2{margin:0 0 0.625rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-023"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
}
[data-vibeui-block="dashboard-023"] input,
[data-vibeui-block="dashboard-023"] select{
appearance:none;font:inherit;font-size:0.75rem;color:inherit;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-023-border);
background:var(--vibeui-dashboard-023-bg);
}
[data-vibeui-block="dashboard-023"] input{flex:1 1 12rem;min-width:0;font-family:var(--vibeui-dashboard-023-mono)}
[data-vibeui-block="dashboard-023"] select{
padding-right:1.75rem;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E");
background-repeat:no-repeat;background-position:right 0.5rem center;background-size:0.625rem;
}
[data-vibeui-block="dashboard-023"] [data-part="found"]{
margin:0.5rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-023-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-023"] [data-part="log"]{
max-height:24rem;overflow:auto;overscroll-behavior:contain;
border-top:1px solid var(--vibeui-dashboard-023-border);
}
[data-vibeui-block="dashboard-023"] [data-part="entry"]{
border-bottom:1px solid var(--vibeui-dashboard-023-border);
}
[data-vibeui-block="dashboard-023"] summary{
display:grid;grid-template-columns:auto auto 1fr;gap:0.125rem 0.625rem;
padding:0.5rem 1.125rem;cursor:pointer;list-style:none;
font-family:var(--vibeui-dashboard-023-mono);font-size:0.75rem;
}
[data-vibeui-block="dashboard-023"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-023"] summary:hover{background:var(--vibeui-dashboard-023-panel)}
[data-vibeui-block="dashboard-023"] summary:focus-visible{
outline:2px solid var(--vibeui-dashboard-023-accent);outline-offset:-2px;
}
[data-vibeui-block="dashboard-023"] [data-part="time"]{
color:var(--vibeui-dashboard-023-muted);font-variant-numeric:tabular-nums;white-space:nowrap;
}
/* Уровень несёт букву и рамку: цвет один в логах читается плохо. */
[data-vibeui-block="dashboard-023"] [data-part="level"]{
justify-self:start;min-width:1.375rem;text-align:center;
font-weight:700;font-size:0.625rem;letter-spacing:0.05em;
padding:0.0625rem 0.25rem;border-radius:0.25rem;
color:var(--vibeui-dashboard-023-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-023-border);
}
[data-vibeui-block="dashboard-023"] [data-level="warn"] [data-part="level"]{
color:var(--vibeui-dashboard-023-warn);box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-023-warn);
}
[data-vibeui-block="dashboard-023"] [data-level="error"] [data-part="level"]{
color:oklch(1 0 0);background:var(--vibeui-dashboard-023-error);box-shadow:none;
}
[data-vibeui-block="dashboard-023"] [data-part="message"]{
grid-column:3;overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-023"] [data-part="source"]{
grid-column:3;font-size:0.6875rem;color:var(--vibeui-dashboard-023-muted);
}
[data-vibeui-block="dashboard-023"] [data-part="body"]{
padding:0.25rem 1.125rem 0.875rem;
background:var(--vibeui-dashboard-023-panel);
}
[data-vibeui-block="dashboard-023"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;margin:0;
font-family:var(--vibeui-dashboard-023-mono);font-size:0.6875rem;
}
[data-vibeui-block="dashboard-023"] dt{color:var(--vibeui-dashboard-023-muted);white-space:nowrap}
[data-vibeui-block="dashboard-023"] dd{margin:0;overflow-wrap:anywhere}
[data-vibeui-block="dashboard-023"] [data-part="copy"]{
margin-top:0.625rem;appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:650;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-023-border);
background:var(--vibeui-dashboard-023-bg);color:inherit;
}
[data-vibeui-block="dashboard-023"] :is(input,select,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-023-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-023"] summary{grid-template-columns:auto auto 1fr auto}
[data-vibeui-block="dashboard-023"] [data-part="source"]{grid-column:4;justify-self:end;text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Dashboard023Entry[] = [
  {
    time: "14:22:07.311",
    level: "error",
    source: "registry/build",
    message: "meta:validate — dashboard-016: в metadata остались TODO",
    details: [
      { label: "item", value: "dashboard-016" },
      { label: "file", value: "registry/blocks/dashboard/registry.json" },
      { label: "exit", value: "1" },
      { label: "trace", value: "validate-meta.mjs:126 → validateBase" },
    ],
  },
  {
    time: "14:22:06.084",
    level: "warn",
    source: "registry/build",
    message: "dashboard-015 → accent: контрол не упомянут в meta.ai.adapt",
    details: [
      { label: "item", value: "dashboard-015" },
      { label: "control", value: "accent" },
      { label: "rule", value: "controls ↔ ai.adapt" },
    ],
  },
  {
    time: "14:22:01.902",
    level: "info",
    source: "next/build",
    message: "Собрано 34 страницы, статических 34, серверных 0",
    details: [
      { label: "duration", value: "18.4 s" },
      { label: "output", value: "standalone" },
    ],
  },
  {
    time: "14:21:44.005",
    level: "info",
    source: "indexes",
    message: "Индексы каталога пересобраны из registry.json",
    details: [
      { label: "categories", value: "15" },
      { label: "items", value: "412" },
    ],
  },
]

const LEVEL_LETTER = { info: "INF", warn: "WRN", error: "ERR" }

/**
 * Журнал событий: фильтры сверху, подробности записи раскрываются на месте
 * через details. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard023({
  title = "Журнал сборки",
  query = "meta:validate",
  levels = ["Все уровни", "Только ошибки", "Ошибки и предупреждения"],
  activeLevel = "Все уровни",
  ranges = ["Последний час", "24 часа", "7 дней"],
  activeRange = "Последний час",
  entries = DEFAULT_ENTRIES,
  foundLabel = "Показано 4 записи из 1 284",
  accent,
  className,
  style,
}: Dashboard023Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-023" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-023"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <div data-part="bar">
            <input
              type="search"
              defaultValue={query}
              aria-label="Поиск по записям"
              placeholder="Подстрока или источник"
            />
            <select defaultValue={activeLevel} aria-label="Уровень">
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
            <select defaultValue={activeRange} aria-label="Период">
              {ranges.map((range) => (
                <option key={range}>{range}</option>
              ))}
            </select>
          </div>
          <p data-part="found" aria-live="polite">
            {foundLabel}
          </p>
        </header>

        <div data-part="log" tabIndex={0} role="group" aria-label="Записи">
          {entries.map((entry) => (
            <details
              key={`${entry.time}-${entry.message}`}
              data-part="entry"
              data-level={entry.level}
            >
              <summary>
                <span data-part="time">{entry.time}</span>
                <span data-part="level">{LEVEL_LETTER[entry.level]}</span>
                <span data-part="message">{entry.message}</span>
                <span data-part="source">{entry.source}</span>
              </summary>
              <div data-part="body">
                <dl>
                  {(entry.details ?? []).map((detail) => (
                    <div key={detail.label} style={{ display: "contents" }}>
                      <dt>{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
                <button type="button" data-part="copy">
                  Скопировать запись
                </button>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
