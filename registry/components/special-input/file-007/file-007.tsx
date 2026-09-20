import type { ComponentProps, CSSProperties } from "react"

export type File007State = "done" | "active" | "queued"

export type File007Entry = {
  name: string
  state: File007State
}

export type File007Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  done?: number
  total?: number
  entries?: File007Entry[]
  /** Подписи состояний: done, active, queued. */
  stateText?: Record<string, string>
  /** Подпись полоски: {done} и {total} подставляют числа. */
  progressLabel?: string
  /** Строка под полоской: {done} и {total} подставляют числа. */
  countText?: string
  /** Подпись раскрывающегося списка. */
  detailsText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одна полоска на всю пачку. Двадцать отдельных прогрессов
// не читаются — важен ответ на вопрос «сколько ещё ждать», а не судьба
// каждого файла. Общая доля стоит наверху нативным <progress>, а подробности
// спрятаны в <details>: список открывается без единой строчки JS, поэтому
// компонент остаётся серверным и ничего не гидрирует.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у сводки
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-007"]){
--vibeui-file-007-surface:transparent;
--vibeui-file-007-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-file-007-muted:color-mix(in oklab,var(--vibeui-file-007-fg) 68%,transparent);
--vibeui-file-007-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-file-007-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-file-007-track:light-dark(oklch(0.93 0 265),oklch(0.32 0 265));
--vibeui-file-007-accent:light-dark(oklch(0.285 0 0),oklch(0.903 0 0));
--vibeui-file-007-ok:light-dark(oklch(0.52 0.13 155),oklch(0.76 0.14 155));
--vibeui-file-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-007"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает сводку на любом фоне. */
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
[data-vibeui-block="file-007"] progress::-webkit-progress-value{background:var(--vibeui-file-007-accent);border-radius:9999px;color:oklch(from var(--vibeui-file-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="file-007"] progress::-moz-progress-bar{background:var(--vibeui-file-007-accent);border-radius:9999px;color:oklch(from var(--vibeui-file-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
[data-vibeui-block="file-007"] li[data-state="done"] [data-part="state"]{color:var(--vibeui-file-007-ok);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: File007Entry[] = [
  { name: "01-обложка.jpg", state: "done" },
  { name: "02-разворот.jpg", state: "done" },
  { name: "03-детали.jpg", state: "done" },
  { name: "04-упаковка.jpg", state: "active" },
  { name: "05-макро.jpg", state: "queued" },
]

const STATE_TEXT: Record<string, string> = {
  done: "готов",
  active: "идёт",
  queued: "в очереди",
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
 * Множественная загрузка одной общей полоской и списком в <details>.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File007({
  title = "Загрузка галереи",
  done = 3,
  total = 5,
  entries = DEFAULT_ENTRIES,
  stateText = STATE_TEXT,
  progressLabel = "Загружено {done} из {total} файлов",
  countText = "Готово {done} из {total}. Вкладку можно не держать открытой.",
  detailsText = "Подробности по файлам",
  background = "",
  accent,
  className,
  style,
  ...props
}: File007Props) {
  const share = total > 0 ? Math.round((done / total) * 100) : 0
  const fill = (template: string) =>
    template.replace("{done}", String(done)).replace("{total}", String(total))

  const palette = {
    ...(accent ? { "--vibeui-file-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{title}</h3>
          <span data-part="share">{share}%</span>
        </div>
        <progress max={total} value={done} aria-label={fill(progressLabel)} />
        <p data-part="count">{fill(countText)}</p>
        <details>
          <summary>{detailsText}</summary>
          <ul>
            {entries.map((entry) => (
              <li key={entry.name} data-state={entry.state}>
                <span>{entry.name}</span>
                <span data-part="state">
                  {stateText[entry.state] ?? STATE_TEXT[entry.state]}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </>
  )
}
