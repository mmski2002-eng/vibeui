import type { ComponentProps, CSSProperties } from "react"

export type Codeblock030Level = "info" | "warn" | "error"

export type Codeblock030Entry = {
  /** Время записи: показывается как есть, форматирование — забота источника. */
  time: string
  level: Codeblock030Level
  /** Кто написал: имя службы или модуля. */
  source?: string
  text: string
}

export type Codeblock030Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  entries?: Codeblock030Entry[]
  /** Подписи фильтра: ключ «all» — показать всё. */
  filterText?: Record<string, string>
  /** Имя радиогруппы: своё на каждый блок, если их несколько на странице. */
  group?: string
  /** Высота окна прокрутки в rem. */
  maxHeight?: number
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: журнал, в котором можно спрятать шум. Обычный вывод лога
// показывают целиком, и человек ищет ошибку глазами среди сорока строк «ok».
// Здесь уровень записи лежит в data-атрибуте, а фильтр — радиогруппа: при
// выборе «Ошибки» CSS прячет всё остальное, без JS и без перерисовки. Скрытое
// остаётся в разметке, поэтому поиск по странице находит и то, что сейчас не
// показано, а счётчики у кнопок считаются на сервере и не врут.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного фильтра.
const STYLES = `
:where([data-vibeui-block="codeblock-030"]){
--vibeui-codeblock-030-bg:transparent;
--vibeui-codeblock-030-fg:light-dark(oklch(0.27 0 265),oklch(0.94 0 265));
--vibeui-codeblock-030-muted:color-mix(in oklab,var(--vibeui-codeblock-030-fg) 62%,transparent);
--vibeui-codeblock-030-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-030-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
--vibeui-codeblock-030-chip:light-dark(oklch(1 0 0),oklch(1 0 0 / 14%));
--vibeui-codeblock-030-accent:light-dark(oklch(0.275 0 0),oklch(0.914 0 0));
--vibeui-codeblock-030-info:light-dark(oklch(0.52 0.11 235),oklch(0.78 0.1 235));
--vibeui-codeblock-030-warn:light-dark(oklch(0.56 0.13 75),oklch(0.82 0.13 75));
--vibeui-codeblock-030-error:light-dark(oklch(0.52 0.19 25),oklch(0.78 0.16 25));
--vibeui-codeblock-030-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-030"]{color-scheme:dark}
[data-vibeui-block="codeblock-030"]{
display:block;width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-030-border);border-radius:0.875rem;
background:var(--vibeui-codeblock-030-bg);color:var(--vibeui-codeblock-030-fg);
font-family:var(--vibeui-codeblock-030-font);
}
[data-vibeui-block="codeblock-030"] *{box-sizing:border-box}
[data-vibeui-block="codeblock-030"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
gap:0.375rem 0.75rem;padding:0.4375rem 0.5rem 0.4375rem 0.875rem;
background:var(--vibeui-codeblock-030-head);
border-bottom:1px solid var(--vibeui-codeblock-030-border);
font-size:0.75rem;color:var(--vibeui-codeblock-030-muted);
}
[data-vibeui-block="codeblock-030"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-codeblock-030-mono);
}
/* Фильтр на радиокнопках: выбор живёт в форме, а не в состоянии. */
[data-vibeui-block="codeblock-030"] [data-part="filter"]{
display:flex;flex-wrap:wrap;gap:0.125rem;padding:0.125rem;border-radius:0.5rem;
background:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 8%));
}
[data-vibeui-block="codeblock-030"] [data-part="filter"] label{
cursor:pointer;padding:0.1875rem 0.5rem;border-radius:0.375rem;
font-size:0.75rem;font-weight:600;color:var(--vibeui-codeblock-030-muted);
}
[data-vibeui-block="codeblock-030"] [data-part="filter"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="codeblock-030"] [data-part="filter"] label:has(input:checked){
background:var(--vibeui-codeblock-030-chip);color:var(--vibeui-codeblock-030-fg);
box-shadow:0 1px 2px light-dark(oklch(0 0 0 / 12%),oklch(0 0 0 / 40%));
}
[data-vibeui-block="codeblock-030"] [data-part="filter"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-030-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-030"] [data-part="count"]{
margin-inline-start:0.3125rem;font-variant-numeric:tabular-nums;opacity:.75;
}
[data-vibeui-block="codeblock-030"] [data-part="list"]{
margin:0;padding:0.375rem 0;list-style:none;
max-height:var(--vibeui-codeblock-030-max,14rem);overflow:auto;
scrollbar-width:thin;scrollbar-color:var(--vibeui-codeblock-030-border) transparent;
}
[data-vibeui-block="codeblock-030"] [data-part="row"]{
display:flex;align-items:baseline;gap:0.625rem;
padding:0.1875rem 0.875rem;
font-family:var(--vibeui-codeblock-030-mono);font-size:0.8125rem;line-height:1.6;
}
[data-vibeui-block="codeblock-030"] [data-part="time"]{
flex:none;color:var(--vibeui-codeblock-030-muted);font-variant-numeric:tabular-nums;
}
/* Уровень набран словом, а не только цветом: при дальтонизме и в печати
   строка обязана оставаться разбираемой. */
[data-vibeui-block="codeblock-030"] [data-part="level"]{
flex:none;width:3.25rem;font-weight:700;text-transform:uppercase;font-size:0.6875rem;
}
[data-vibeui-block="codeblock-030"] [data-level="info"] [data-part="level"]{color:var(--vibeui-codeblock-030-info)}
[data-vibeui-block="codeblock-030"] [data-level="warn"] [data-part="level"]{color:var(--vibeui-codeblock-030-warn)}
[data-vibeui-block="codeblock-030"] [data-level="error"] [data-part="level"]{color:var(--vibeui-codeblock-030-error)}
/* Источник — колонка: без общей ширины текст записей уезжает по строкам
   и журнал перестаёт читаться сверху вниз. */
[data-vibeui-block="codeblock-030"] [data-part="source"]{
flex:none;min-width:4.5rem;color:var(--vibeui-codeblock-030-muted);
}
[data-vibeui-block="codeblock-030"] [data-part="text"]{min-width:0;overflow-wrap:anywhere}
/* Фильтр прячет чужие уровни, но не удаляет их: поиск по странице должен
   находить и то, что сейчас не показано. */
[data-vibeui-block="codeblock-030"]:has([data-filter="warn"]:checked) [data-level="info"],
[data-vibeui-block="codeblock-030"]:has([data-filter="error"]:checked) [data-level="info"],
[data-vibeui-block="codeblock-030"]:has([data-filter="error"]:checked) [data-level="warn"]{
display:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Codeblock030Entry[] = [
  {
    time: "12:04:11",
    level: "info",
    source: "build",
    text: "собрано 1584 items за 76 с",
  },
  {
    time: "12:04:12",
    level: "info",
    source: "registry",
    text: "public/r обновлён",
  },
  {
    time: "12:04:19",
    level: "warn",
    source: "images",
    text: "avatar-012.png весит 1.8 МБ — больше порога в 500 КБ",
  },
  {
    time: "12:04:23",
    level: "error",
    source: "deploy",
    text: "не удалось подключиться к vps: connection refused",
  },
  {
    time: "12:04:24",
    level: "info",
    source: "deploy",
    text: "повтор через 15 с",
  },
]

const FILTER_TEXT: Record<string, string> = {
  all: "Все",
  warn: "Важное",
  error: "Ошибки",
}

const LEVEL_ORDER: Codeblock030Level[] = ["info", "warn", "error"]

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
 * Журнал с фильтром по уровню: переключение без JS, скрытое остаётся в разметке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Codeblock030({
  title = "logs/deploy.log",
  entries = DEFAULT_ENTRIES,
  filterText = FILTER_TEXT,
  group = "vibeui-codeblock-030",
  maxHeight = 14,
  background = "",
  className,
  style,
  ...props
}: Codeblock030Props) {
  // Счётчики считаются здесь и попадают в разметку готовыми: у фильтра на
  // чистом CSS другого способа сказать «ошибок две» нет.
  const counts = {
    all: entries.length,
    warn: entries.filter((entry) => entry.level !== "info").length,
    error: entries.filter((entry) => entry.level === "error").length,
  }

  const palette = {
    "--vibeui-codeblock-030-max": `${maxHeight}rem`,
    ...(background
      ? {
          "--vibeui-codeblock-030-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-030" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-030"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span data-part="name">{title}</span>
          <form data-part="filter" role="group" aria-label={title}>
            {(["all", "warn", "error"] as const).map((key, index) => (
              <label key={key}>
                <input
                  type="radio"
                  name={group}
                  data-filter={key}
                  defaultChecked={index === 0}
                />
                {filterText[key] ?? FILTER_TEXT[key]}
                <span data-part="count">{counts[key]}</span>
              </label>
            ))}
          </form>
        </figcaption>

        <ul data-part="list">
          {entries.map((entry, index) => (
            <li
              key={index}
              data-part="row"
              data-level={entry.level}
              // Порядок уровня пригодится и стилям, и сортировке на стороне
              // хозяина: строка не теряет смысл, вырванная из списка.
              data-weight={LEVEL_ORDER.indexOf(entry.level)}
            >
              <time data-part="time">{entry.time}</time>
              <span data-part="level">{entry.level}</span>
              {entry.source ? (
                <span data-part="source">{entry.source}</span>
              ) : null}
              <span data-part="text">{entry.text}</span>
            </li>
          ))}
        </ul>
      </figure>
    </>
  )
}
