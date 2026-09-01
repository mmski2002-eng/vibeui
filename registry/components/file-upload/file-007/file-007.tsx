import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type File007Entry = {
  name: string
  state: "готов" | "идёт" | "в очереди"
}

export type File007Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title?: string
  done?: number
  total?: number
  entries?: File007Entry[]
  accent?: string
}

// Идея компонента: одна полоска на всю пачку. Двадцать отдельных прогрессов
// не читаются — важен ответ на вопрос «сколько ещё ждать», а не судьба
// каждого файла. Общая доля стоит наверху нативным <progress>, а подробности
// спрятаны в <details>: список открывается без единой строчки JS, поэтому
// компонент остаётся серверным и ничего не гидрирует.
const STYLES = `
:where([data-vibeui-block="file-007"]){
--vibeui-file-007-surface:oklch(1 0 0);
--vibeui-file-007-fg:oklch(0.23 0.014 265);
--vibeui-file-007-muted:oklch(0.55 0.014 265);
--vibeui-file-007-border:oklch(0.89 0.008 265);
--vibeui-file-007-shell:oklch(0.91 0.006 265);
--vibeui-file-007-track:oklch(0.93 0.006 265);
--vibeui-file-007-accent:oklch(0.54 0.17 268);
--vibeui-file-007-ok:oklch(0.52 0.13 155);
--vibeui-file-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: сводку показывают поверх любого фона. */
[data-vibeui-block="file-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-007-surface);
border:1px solid var(--vibeui-file-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-007-font);color:var(--vibeui-file-007-fg);
}
[data-vibeui-block="file-007"] *{box-sizing:border-box}
[data-vibeui-block="file-007"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="file-007"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-007"] [data-part="share"]{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-file-007-accent);
}
/* Одна полоска на всю пачку: важно «сколько ещё ждать», а не судьба каждого файла. */
[data-vibeui-block="file-007"] progress{
appearance:none;width:100%;height:0.4375rem;border:0;
background:var(--vibeui-file-007-track);border-radius:9999px;overflow:hidden;
}
[data-vibeui-block="file-007"] progress::-webkit-progress-bar{background:var(--vibeui-file-007-track);border-radius:9999px}
[data-vibeui-block="file-007"] progress::-webkit-progress-value{background:var(--vibeui-file-007-accent);border-radius:9999px}
[data-vibeui-block="file-007"] progress::-moz-progress-bar{background:var(--vibeui-file-007-accent);border-radius:9999px}
[data-vibeui-block="file-007"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-file-007-muted);
font-variant-numeric:tabular-nums;
}
/* Подробности в <details>: раскрытие без единой строчки JS. */
[data-vibeui-block="file-007"] details{
border-top:1px solid var(--vibeui-file-007-border);padding-top:0.5rem;
}
[data-vibeui-block="file-007"] summary{
cursor:pointer;list-style:none;display:flex;align-items:center;gap:0.375rem;
font-size:0.75rem;font-weight:650;color:var(--vibeui-file-007-muted);
}
[data-vibeui-block="file-007"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="file-007"] summary::before{
content:"";width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(-45deg);transition:transform .16s ease;
}
[data-vibeui-block="file-007"] details[open] summary::before{transform:rotate(45deg)}
[data-vibeui-block="file-007"] summary:focus-visible{outline:2px solid var(--vibeui-file-007-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="file-007"] ul{
display:flex;flex-direction:column;gap:0.1875rem;
margin:0.5rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="file-007"] li{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;
}
[data-vibeui-block="file-007"] li span:first-child{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="file-007"] [data-part="state"]{flex:none;color:var(--vibeui-file-007-muted);font-size:0.6875rem}
[data-vibeui-block="file-007"] li[data-state="готов"] [data-part="state"]{color:var(--vibeui-file-007-ok);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: File007Entry[] = [
  { name: "01-обложка.jpg", state: "готов" },
  { name: "02-разворот.jpg", state: "готов" },
  { name: "03-детали.jpg", state: "готов" },
  { name: "04-упаковка.jpg", state: "идёт" },
  { name: "05-макро.jpg", state: "в очереди" },
]

/**
 * Множественная загрузка одной общей полоской и списком в <details>.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File007({
  title = "Загрузка галереи",
  done = 3,
  total = 5,
  entries = DEFAULT_ENTRIES,
  accent,
  className,
  style,
  ...props
}: File007Props) {
  const share = total > 0 ? Math.round((done / total) * 100) : 0

  const palette = {
    ...(accent ? { "--vibeui-file-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{title}</h3>
          <span data-part="share">{share}%</span>
        </div>
        <progress
          max={total}
          value={done}
          aria-label={`Загружено ${done} из ${total} файлов`}
        />
        <p data-part="count">
          Готово {done} из {total}. Вкладку можно не держать открытой.
        </p>
        <details>
          <summary>Подробности по файлам</summary>
          <ul>
            {entries.map((entry) => (
              <li key={entry.name} data-state={entry.state}>
                <span>{entry.name}</span>
                <span data-part="state">{entry.state}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </>
  )
}
