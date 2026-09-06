import type { CSSProperties } from "react"

export type Ai012File = {
  name: string
  size: string
  kind?: string
  progress?: number
  state?: "indexed" | "reading" | "failed"
  note?: string
}

export type Ai012Props = {
  title?: string
  description?: string
  dropLabel?: string
  dropHint?: string
  accept?: string
  files?: Ai012File[]
  budgetLabel?: string
  budgetUsed?: number
  /** Подпись полосы файла для скринридера: {name} — имя файла. */
  fileProgressLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: показать не «загрузку файлов», а сбор контекста. Файл здесь
// проходит две стадии — прочитан и проиндексирован; пока индекс не готов,
// модель файл не видит, и это состояние подписано словами, а не только
// цветом полоски.
//
// Зона перетаскивания — обычный <label> вокруг <input type="file">: он
// открывает диалог по клику, ловит фокус и работает с клавиатуры без
// единой строки JS. Ошибочный файл не исчезает из списка: строка остаётся
// с причиной, иначе человек не понимает, почему ответ неполный.
const STYLES = `
:where([data-vibeui-block="ai-012"]){
--vibeui-ai-012-bg:transparent;
--vibeui-ai-012-chip:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-ai-012-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-ai-012-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-ai-012-muted:light-dark(oklch(0.53 0 265),oklch(0.69 0 265));
--vibeui-ai-012-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-ai-012-accent:light-dark(oklch(0.52 0.16 258),oklch(0.73 0.14 258));
--vibeui-ai-012-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 258));
--vibeui-ai-012-ok:light-dark(oklch(0.57 0.13 155),oklch(0.72 0.13 155));
--vibeui-ai-012-fail:light-dark(oklch(0.57 0.19 25),oklch(0.7 0.17 25));
--vibeui-ai-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-012"]{color-scheme:dark}
[data-vibeui-block="ai-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-012-bg);color:var(--vibeui-ai-012-fg);
font-family:var(--vibeui-ai-012-sans);
border:1px solid var(--vibeui-ai-012-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-012"] *{box-sizing:border-box}
[data-vibeui-block="ai-012"] [data-part="shell"]{padding:1.25rem;display:grid;gap:1rem}
[data-vibeui-block="ai-012"] h2{margin:0;font-size:1rem;font-weight:680;letter-spacing:-0.01em}
[data-vibeui-block="ai-012"] [data-part="lede"]{
margin:0.25rem 0 0;max-width:58ch;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-ai-012-muted);
}
/* Зона перетаскивания — label вокруг input[type=file]: фокус и клавиатура даром. */
[data-vibeui-block="ai-012"] [data-part="drop"]{
display:grid;justify-items:center;gap:0.3125rem;cursor:pointer;text-align:center;
padding:1.5rem 1rem;border-radius:1rem;
border:1.5px dashed color-mix(in oklab,var(--vibeui-ai-012-accent) 35%,var(--vibeui-ai-012-border));
background:color-mix(in oklab,var(--vibeui-ai-012-accent) 4%,var(--vibeui-ai-012-bg));
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="ai-012"] [data-part="drop"]:hover{
border-color:var(--vibeui-ai-012-accent);
background:color-mix(in oklab,var(--vibeui-ai-012-accent) 8%,var(--vibeui-ai-012-bg));
}
[data-vibeui-block="ai-012"] [data-part="drop"]:has(input:focus-visible){outline:2px solid var(--vibeui-ai-012-accent);outline-offset:2px}
[data-vibeui-block="ai-012"] [data-part="drop"] input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
[data-vibeui-block="ai-012"] [data-part="glyph"]{
display:inline-flex;align-items:center;justify-content:center;
width:2.125rem;height:2.125rem;border-radius:0.75rem;
background:var(--vibeui-ai-012-accent);color:var(--vibeui-ai-012-on-accent);font-size:1rem;font-weight:700;
}
[data-vibeui-block="ai-012"] [data-part="drop-title"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="ai-012"] [data-part="drop-hint"]{font-size:0.75rem;color:var(--vibeui-ai-012-muted)}
[data-vibeui-block="ai-012"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="ai-012"] li{
display:grid;gap:0.375rem;padding:0.625rem 0.75rem;border-radius:0.8125rem;
border:1px solid var(--vibeui-ai-012-border);background:var(--vibeui-ai-012-soft);
}
[data-vibeui-block="ai-012"] [data-state="failed"]{
border-color:color-mix(in oklab,var(--vibeui-ai-012-fail) 45%,var(--vibeui-ai-012-border));
}
[data-vibeui-block="ai-012"] [data-part="file-top"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="ai-012"] [data-part="kind"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-ai-012-chip);border:1px solid var(--vibeui-ai-012-border);
font-size:0.5625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-ai-012-muted);
}
[data-vibeui-block="ai-012"] [data-part="file-name"]{
font-size:0.8125rem;font-weight:620;overflow-wrap:anywhere;
}
[data-vibeui-block="ai-012"] [data-part="size"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-ai-012-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-012"] [data-part="track"]{
height:0.25rem;border-radius:9999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-ai-012-fg) 10%,transparent);
}
[data-vibeui-block="ai-012"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-ai-012-accent);
transition:width .3s ease;
}
[data-vibeui-block="ai-012"] [data-state="indexed"] [data-part="fill"]{background:var(--vibeui-ai-012-ok)}
[data-vibeui-block="ai-012"] [data-state="failed"] [data-part="fill"]{background:var(--vibeui-ai-012-fail)}
/* Состояние подписано словами: полоска цветом одна ничего не объясняет. */
[data-vibeui-block="ai-012"] [data-part="note"]{font-size:0.6875rem;line-height:1.45;color:var(--vibeui-ai-012-muted)}
[data-vibeui-block="ai-012"] [data-state="failed"] [data-part="note"]{color:var(--vibeui-ai-012-fail)}
[data-vibeui-block="ai-012"] [data-part="budget"]{
display:grid;gap:0.375rem;padding-top:0.875rem;border-top:1px solid var(--vibeui-ai-012-border);
}
[data-vibeui-block="ai-012"] [data-part="budget-top"]{
display:flex;justify-content:space-between;gap:0.75rem;
font-size:0.6875rem;color:var(--vibeui-ai-012-muted);font-variant-numeric:tabular-nums;
}
@container (min-width: 44rem){
[data-vibeui-block="ai-012"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-012"] [data-part="drop"]{padding:2rem 1.5rem}
[data-vibeui-block="ai-012"] ul{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILES: Ai012File[] = [
  {
    name: "brief-studio.pdf",
    size: "1,2 МБ",
    kind: "pdf",
    progress: 100,
    state: "indexed",
    note: "Проиндексирован, 14 фрагментов. Модель видит файл.",
  },
  {
    name: "brand-guide.md",
    size: "38 КБ",
    kind: "md",
    progress: 100,
    state: "indexed",
    note: "Проиндексирован, 6 фрагментов.",
  },
  {
    name: "analytics-2024.csv",
    size: "6,4 МБ",
    kind: "csv",
    progress: 62,
    state: "reading",
    note: "Читается: 62%. До конца индексации файл в ответах не участвует.",
  },
  {
    name: "photos.zip",
    size: "48 МБ",
    kind: "zip",
    progress: 100,
    state: "failed",
    note: "Архивы не читаются. Распакуйте и добавьте файлы по отдельности.",
  },
]

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
 * Сбор контекста файлами: зона перетаскивания, стадии индексации и бюджет.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai012({
  title = "Контекст для ассистента",
  description = "Файл участвует в ответах только после индексации: до этого он числится в списке, но модель его не видит.",
  dropLabel = "Перетащите файлы или нажмите, чтобы выбрать",
  dropHint = "PDF, Markdown, CSV и текст. До 25 МБ на файл.",
  accept = ".pdf,.md,.txt,.csv",
  files = DEFAULT_FILES,
  budgetLabel = "Занято в окне контекста",
  budgetUsed = 46,
  fileProgressLabel = "Обработка файла {name}",
  accent,
  background = "",
  className,
  style,
}: Ai012Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-012-bg": background,
          "--vibeui-ai-012-chip": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-012"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
          </header>

          <label data-part="drop">
            <span data-part="glyph" aria-hidden="true">
              +
            </span>
            <span data-part="drop-title">{dropLabel}</span>
            <span data-part="drop-hint">{dropHint}</span>
            <input type="file" multiple accept={accept} />
          </label>

          <ul>
            {files.map((file) => (
              <li key={file.name} data-state={file.state ?? "reading"}>
                <div data-part="file-top">
                  {file.kind ? <span data-part="kind">{file.kind}</span> : null}
                  <span data-part="file-name">{file.name}</span>
                  <span data-part="size">{file.size}</span>
                </div>
                <div
                  data-part="track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={file.progress ?? 0}
                  aria-label={fileProgressLabel.replace("{name}", file.name)}
                >
                  <span
                    data-part="fill"
                    style={{ width: `${file.progress ?? 0}%` }}
                  />
                </div>
                {file.note ? <span data-part="note">{file.note}</span> : null}
              </li>
            ))}
          </ul>

          <div data-part="budget">
            <div data-part="budget-top">
              <span>{budgetLabel}</span>
              <span>{budgetUsed}%</span>
            </div>
            <div
              data-part="track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={budgetUsed}
              aria-label={budgetLabel}
            >
              <span data-part="fill" style={{ width: `${budgetUsed}%` }} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
