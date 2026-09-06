import type { CSSProperties } from "react"

export type Solutions004File = {
  name: string
  kind: "doc" | "image" | "table" | "archive"
  size: string
  owner: string
  changed: string
  shared?: number
}

export type Solutions004Props = {
  title?: string
  used?: string
  quota?: string
  usedShare?: number
  files?: Solutions004File[]
  upload?: string
  /** Подпись полосы занятого места. */
  quotaLabel?: string
  /** Занято и всего, {used} и {quota} — значения одноимённых пропов. */
  quotaValueText?: string
  /** Шапка таблицы: ключи file, owner, changed, size. */
  columnText?: Record<string, string>
  /** Строка о доступе, {count} — число участников. */
  sharedText?: string
  /** Подписи на плитке типа: ключи doc, image, table, archive. */
  kindText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: файловый список. Тип файла показан подписью на плитке, а не
// цветной иконкой: три буквы читаются и на печати, и при дальтонизме, и не
// требуют набора иконок. Размер и дата стоят в отдельных колонках с
// табличными цифрами, поэтому файлы сравнивают глазами по столбцу. Занятое
// место показано полосой над списком: место кончается внезапно, и узнавать об
// этом при загрузке поздно.
const STYLES = `
:where([data-vibeui-block="solutions-004"]){
--vibeui-solutions-004-bg:transparent;
--vibeui-solutions-004-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-solutions-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-solutions-004-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-solutions-004-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-solutions-004-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-solutions-004-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-solutions-004-onaccent:oklch(0.15 0.02 39.8);
--vibeui-solutions-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-004"]{color-scheme:dark}
[data-vibeui-block="solutions-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-004-bg);
border:1px solid var(--vibeui-solutions-004-border);border-radius:1rem;
font-family:var(--vibeui-solutions-004-sans);color:var(--vibeui-solutions-004-fg);
}
[data-vibeui-block="solutions-004"] *{box-sizing:border-box}
[data-vibeui-block="solutions-004"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.625rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-004"] h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-004"] [data-part="upload"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-solutions-004-accent);color:var(--vibeui-solutions-004-onaccent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="solutions-004"] [data-part="upload"]:focus-visible{outline:2px solid var(--vibeui-solutions-004-accent);outline-offset:2px}
/* Место показано заранее: оно кончается внезапно, узнавать при загрузке поздно. */
[data-vibeui-block="solutions-004"] [data-part="quota"]{padding:0 1rem 0.75rem}
[data-vibeui-block="solutions-004"] [data-part="quotaline"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0 0 0.375rem;
font-size:0.75rem;color:var(--vibeui-solutions-004-muted);
}
[data-vibeui-block="solutions-004"] [data-part="quotavalue"]{color:var(--vibeui-solutions-004-fg);font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-004"] [data-part="track"]{
height:0.375rem;border-radius:9999px;overflow:hidden;background:var(--vibeui-solutions-004-track);
}
[data-vibeui-block="solutions-004"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-solutions-004-used,0%);background:var(--vibeui-solutions-004-accent);
}
[data-vibeui-block="solutions-004"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-004"] th,
[data-vibeui-block="solutions-004"] td{
padding:0.5rem 1rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-004-border);
}
[data-vibeui-block="solutions-004"] th{
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-solutions-004-muted);
background:var(--vibeui-solutions-004-panel);
}
[data-vibeui-block="solutions-004"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-004"] [data-part="file"]{display:flex;align-items:center;gap:0.625rem}
/* Тип — подпись на плитке: три буквы читаются и на печати, и без цвета. */
[data-vibeui-block="solutions-004"] [data-part="kind"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:0.5rem;
background:light-dark(oklch(0.94 0.03 var(--vibeui-solutions-004-hue,262)),oklch(0.33 0.055 var(--vibeui-solutions-004-hue,262)));
color:light-dark(oklch(0.4 0.1 var(--vibeui-solutions-004-hue,262)),oklch(0.86 0.075 var(--vibeui-solutions-004-hue,262)));
font-size:0.5625rem;font-weight:700;letter-spacing:0.04em;
}
[data-vibeui-block="solutions-004"] [data-kind="image"]{--vibeui-solutions-004-hue:152}
[data-vibeui-block="solutions-004"] [data-kind="table"]{--vibeui-solutions-004-hue:75}
[data-vibeui-block="solutions-004"] [data-kind="archive"]{--vibeui-solutions-004-hue:25}
[data-vibeui-block="solutions-004"] [data-part="name"]{font-weight:600}
[data-vibeui-block="solutions-004"] [data-part="shared"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-004"] *{animation:none!important;transition:none!important}}
`

const KIND_LABEL: Record<string, string> = {
  doc: "DOC",
  image: "PNG",
  table: "CSV",
  archive: "ZIP",
}

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  file: "Файл",
  owner: "Владелец",
  changed: "Изменён",
  size: "Размер",
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

const DEFAULT_FILES: Solutions004File[] = [
  {
    name: "Бриф студии.docx",
    kind: "doc",
    size: "240 КБ",
    owner: "Анна Реброва",
    changed: "12 марта",
    shared: 3,
  },
  {
    name: "Палитра.png",
    kind: "image",
    size: "1,2 МБ",
    owner: "Илья Мохов",
    changed: "11 марта",
  },
  {
    name: "Установки.csv",
    kind: "table",
    size: "88 КБ",
    owner: "Система",
    changed: "10 марта",
    shared: 8,
  },
  {
    name: "Архив макетов.zip",
    kind: "archive",
    size: "34 МБ",
    owner: "Пётр Гай",
    changed: "2 марта",
  },
]

/**
 * Файловый список: тип подписью на плитке, занятое место полосой над списком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions004({
  title = "Файлы проекта",
  used = "12,4 ГБ",
  quota = "20 ГБ",
  usedShare = 62,
  files = DEFAULT_FILES,
  upload = "Загрузить",
  quotaLabel = "Занято места",
  quotaValueText = "{used} из {quota}",
  columnText = DEFAULT_COLUMN_TEXT,
  sharedText = "доступ у {count} участников",
  kindText = KIND_LABEL,
  accent,
  background = "",
  className,
  style,
}: Solutions004Props) {
  const palette = {
    "--vibeui-solutions-004-used": `${usedShare}%`,
    ...(accent ? { "--vibeui-solutions-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <button type="button" data-part="upload">
            {upload}
          </button>
        </header>

        <div data-part="quota">
          <p data-part="quotaline">
            {quotaLabel}
            <span data-part="quotavalue">
              {quotaValueText.replace("{used}", used).replace("{quota}", quota)}
            </span>
          </p>
          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={usedShare}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={quotaLabel}
          >
            <span data-part="fill" />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th scope="col">{columnText.file ?? DEFAULT_COLUMN_TEXT.file}</th>
              <th scope="col">
                {columnText.owner ?? DEFAULT_COLUMN_TEXT.owner}
              </th>
              <th scope="col">
                {columnText.changed ?? DEFAULT_COLUMN_TEXT.changed}
              </th>
              <th scope="col" data-align="end">
                {columnText.size ?? DEFAULT_COLUMN_TEXT.size}
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.name} data-kind={file.kind}>
                <td>
                  <span data-part="file">
                    <span data-part="kind" aria-hidden="true">
                      {kindText[file.kind] ?? KIND_LABEL[file.kind]}
                    </span>
                    <span>
                      <span data-part="name">{file.name}</span>
                      {file.shared ? (
                        <span data-part="shared">
                          {sharedText.replace("{count}", String(file.shared))}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </td>
                <td>{file.owner}</td>
                <td>{file.changed}</td>
                <td data-align="end">{file.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
