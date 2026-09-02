import type { CSSProperties } from "react"

export type Dashboard064Tag = {
  name: string
  used: number
  state: "add" | "remove" | "all" | "some"
}

export type Dashboard064Props = {
  title?: string
  selectedCount?: number
  tags?: Dashboard064Tag[]
  suggestions?: string[]
  inputLabel?: string
  applyLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Строка о выборке: {count} выделяется жирным. */
  scopeText?: string
  /** Заголовок поля с тегами. */
  tagsTitle?: string
  /** Заголовок списка частых тегов. */
  suggestionsTitle?: string
  /** Подписи состояний тега; в all доступен {count}. */
  stateText?: Record<Dashboard064Tag["state"], string>
  /** Строки предпросмотра: add, addHint, remove, removeHint, keep, keepHint, none. */
  previewText?: Record<string, string>
  /** Подпись кнопки состояния тега: {name}. */
  toggleAriaText?: string
  /** Подпись поля ввода для скринридера. */
  inputAriaLabel?: string
  /** Сноска под кнопкой. */
  noteText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: при тегировании пачки записей есть третье состояние — тег стоит
// не у всех выбранных. Если показать его как обычный чип, применение молча
// проставит его всем. Поэтому состояний четыре: «у всех», «у части»,
// «будет добавлен», «будет снят», и каждое подписано словом, а не только
// заливкой. Итог сведён в предпросмотр «добавим / снимем / не тронем»: это
// последнее, что читают перед кнопкой. Частота тега рядом с ним не украшение —
// она отличает рабочий тег от чьей-то опечатки.
const STYLES = `
:where([data-vibeui-block="dashboard-064"]){
--vibeui-dashboard-064-bg:transparent;
/* Поле, чипы и предпросмотр: подложка блока прозрачна. */
--vibeui-dashboard-064-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 320));
--vibeui-dashboard-064-inset:light-dark(oklch(0.985 0.003 320),oklch(0.22 0.012 320));
--vibeui-dashboard-064-fg:light-dark(oklch(0.21 0.014 320),oklch(0.94 0.005 320));
--vibeui-dashboard-064-muted:light-dark(oklch(0.55 0.014 320),oklch(0.72 0.012 320));
--vibeui-dashboard-064-border:light-dark(oklch(0.91 0.006 320),oklch(0.36 0.012 320));
--vibeui-dashboard-064-accent:light-dark(oklch(0.52 0.16 320),oklch(0.75 0.14 320));
--vibeui-dashboard-064-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.04 320));
--vibeui-dashboard-064-soft:light-dark(oklch(0.965 0.02 320),oklch(0.29 0.035 320));
--vibeui-dashboard-064-accent-line:light-dark(oklch(0.84 0.05 320),oklch(0.5 0.08 320));
--vibeui-dashboard-064-add:light-dark(oklch(0.55 0.13 155),oklch(0.74 0.14 155));
--vibeui-dashboard-064-add-soft:light-dark(oklch(0.955 0.03 155),oklch(0.3 0.05 155));
--vibeui-dashboard-064-add-line:light-dark(oklch(0.82 0.08 155),oklch(0.49 0.09 155));
--vibeui-dashboard-064-add-ink:light-dark(oklch(0.42 0.11 155),oklch(0.83 0.12 155));
--vibeui-dashboard-064-remove:light-dark(oklch(0.57 0.19 25),oklch(0.75 0.17 25));
--vibeui-dashboard-064-remove-soft:light-dark(oklch(0.96 0.025 25),oklch(0.3 0.06 25));
--vibeui-dashboard-064-remove-line:light-dark(oklch(0.83 0.09 25),oklch(0.49 0.11 25));
--vibeui-dashboard-064-partial:light-dark(oklch(0.68 0.15 72),oklch(0.81 0.14 72));
--vibeui-dashboard-064-partial-line:light-dark(oklch(0.82 0.1 72),oklch(0.56 0.11 72));
--vibeui-dashboard-064-partial-ink:light-dark(oklch(0.5 0.11 72),oklch(0.85 0.12 72));
--vibeui-dashboard-064-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-064"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-064-bg);
color:var(--vibeui-dashboard-064-fg);
font-family:var(--vibeui-dashboard-064-sans);
border:1px solid var(--vibeui-dashboard-064-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-064"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-064"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-064"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-064"] h3{margin:0 0 0.375rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-064-muted)}
[data-vibeui-block="dashboard-064"] [data-part="scope"]{
margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-064-muted);
}
[data-vibeui-block="dashboard-064"] [data-part="scope"] b{color:var(--vibeui-dashboard-064-fg);font-weight:750}
[data-vibeui-block="dashboard-064"] [data-part="field"]{
display:flex;flex-wrap:wrap;gap:0.375rem;align-items:center;
padding:0.5rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-064-card);border:1px solid var(--vibeui-dashboard-064-border);
}
[data-vibeui-block="dashboard-064"] [data-part="field"]:focus-within{
border-color:var(--vibeui-dashboard-064-accent-line);
}
[data-vibeui-block="dashboard-064"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;font-weight:700;
padding:0.25rem 0.5rem;border-radius:0.5rem;white-space:nowrap;
background:var(--vibeui-dashboard-064-inset);border:1px solid var(--vibeui-dashboard-064-border);
}
[data-vibeui-block="dashboard-064"] [data-part="chip"] em{
font-style:normal;font-size:0.625rem;font-weight:650;color:var(--vibeui-dashboard-064-muted);
}
[data-vibeui-block="dashboard-064"] [data-state="add"]{
background:var(--vibeui-dashboard-064-add-soft);
border-color:var(--vibeui-dashboard-064-add-line);
}
[data-vibeui-block="dashboard-064"] [data-state="add"] em{color:var(--vibeui-dashboard-064-add-ink)}
[data-vibeui-block="dashboard-064"] [data-state="remove"]{
background:var(--vibeui-dashboard-064-remove-soft);
border-color:var(--vibeui-dashboard-064-remove-line);
text-decoration:line-through;
}
[data-vibeui-block="dashboard-064"] [data-state="remove"] em{color:var(--vibeui-dashboard-064-remove);text-decoration:none}
[data-vibeui-block="dashboard-064"] [data-state="some"]{
border-style:dashed;border-color:var(--vibeui-dashboard-064-partial-line);
}
[data-vibeui-block="dashboard-064"] [data-state="some"] em{color:var(--vibeui-dashboard-064-partial-ink)}
[data-vibeui-block="dashboard-064"] [data-part="chip"] button{
appearance:none;border:0;background:transparent;cursor:pointer;font:inherit;
line-height:1;font-size:0.875rem;padding:0;color:inherit;
}
[data-vibeui-block="dashboard-064"] input[type="text"]{
flex:1 1 8rem;min-width:6rem;font:inherit;font-size:0.8125rem;border:0;outline:none;
background:transparent;color:inherit;padding:0.25rem;
}
[data-vibeui-block="dashboard-064"] [data-part="suggest"]{display:flex;flex-wrap:wrap;gap:0.3125rem}
[data-vibeui-block="dashboard-064"] [data-part="suggest"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.25rem 0.5625rem;border-radius:9999px;background:var(--vibeui-dashboard-064-card);
color:inherit;border:1px solid var(--vibeui-dashboard-064-border);
}
[data-vibeui-block="dashboard-064"] [data-part="preview"]{
display:grid;grid-template-columns:1fr;gap:0.5rem;padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-064-soft);
border:1px solid var(--vibeui-dashboard-064-accent-line);
}
[data-vibeui-block="dashboard-064"] [data-part="line"]{margin:0;font-size:0.8125rem;display:flex;flex-wrap:wrap;gap:0.3125rem;align-items:baseline}
[data-vibeui-block="dashboard-064"] [data-part="line"] strong{font-weight:750}
[data-vibeui-block="dashboard-064"] [data-part="line"] span{color:var(--vibeui-dashboard-064-muted);font-size:0.75rem}
[data-vibeui-block="dashboard-064"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-064"] [data-part="apply"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-064-accent);color:var(--vibeui-dashboard-064-on-accent);
}
[data-vibeui-block="dashboard-064"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-064-muted);max-width:60ch}
[data-vibeui-block="dashboard-064"] :is(a,button,input):focus-visible{
outline:2px solid var(--vibeui-dashboard-064-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-064"] [data-part="preview"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
`

const DEFAULT_TAGS: Dashboard064Tag[] = [
  { name: "поставка", used: 42, state: "all" },
  { name: "приоритет-2", used: 17, state: "some" },
  { name: "тендер", used: 42, state: "add" },
  { name: "весна-2025", used: 31, state: "remove" },
  { name: "крупный-клиент", used: 8, state: "some" },
]

const DEFAULT_SUGGESTIONS = [
  "склад",
  "сервис",
  "рассрочка",
  "экспорт",
  "повторная",
  "риск-срыва",
]

const STATE_LABELS: Record<Dashboard064Tag["state"], string> = {
  all: "у всех {count}",
  some: "у части",
  add: "будет добавлен",
  remove: "будет снят",
}

const PREVIEW_TEXT: Record<string, string> = {
  add: "Добавим:",
  addHint: "тем записям, где тега ещё нет",
  remove: "Снимем:",
  removeHint: "у всех выбранных записей",
  keep: "Не тронем:",
  keepHint: "останутся там, где стояли",
  none: "ничего",
}

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Экран тегирования записей пачкой: четыре состояния тега, включая «у части
 * выбранных», предпросмотр «добавим / снимем / не тронем» и частые теги
 * со счётчиком. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard064({
  title = "Теги для выбранных заявок",
  selectedCount = 42,
  tags = DEFAULT_TAGS,
  suggestions = DEFAULT_SUGGESTIONS,
  inputLabel = "Добавить тег и нажать Enter",
  applyLabel = "Применить к 42 заявкам",
  accent,
  background = "",
  scopeText = "Выбрано {count} записей. Теги, стоящие не у всех, помечены пунктиром — их состояние не меняется, пока вы не решите явно.",
  tagsTitle = "Теги выборки",
  suggestionsTitle = "Частые теги",
  stateText = STATE_LABELS,
  previewText = PREVIEW_TEXT,
  toggleAriaText = "Изменить состояние тега «{name}»",
  inputAriaLabel = "Новый тег",
  noteText = "Снятие тега не удаляет сам тег из справочника: он останется доступен другим записям и фильтрам.",
  className,
  style,
}: Dashboard064Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-064-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-064-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const [scopeBefore, scopeAfter] = scopeText.split("{count}")
  const preview = { ...PREVIEW_TEXT, ...previewText }

  const adding = tags.filter((tag) => tag.state === "add")
  const removing = tags.filter((tag) => tag.state === "remove")
  const partial = tags.filter((tag) => tag.state === "some")

  return (
    <>
      <style href="vibeui-dashboard-064" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-064"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="scope">
              {scopeBefore}
              <b>{selectedCount}</b>
              {scopeAfter}
            </p>
          </div>

          <div>
            <h3>{tagsTitle}</h3>
            <div data-part="field">
              {tags.map((tag) => (
                <span key={tag.name} data-part="chip" data-state={tag.state}>
                  {tag.name}
                  <em>
                    {(stateText[tag.state] ?? STATE_LABELS[tag.state]).replace(
                      "{count}",
                      String(selectedCount),
                    )}
                  </em>
                  <button
                    type="button"
                    aria-label={toggleAriaText.replace("{name}", tag.name)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={inputLabel}
                aria-label={inputAriaLabel}
              />
            </div>
          </div>

          <div>
            <h3>{suggestionsTitle}</h3>
            <div data-part="suggest">
              {suggestions.map((name) => (
                <button key={name} type="button">
                  + {name}
                </button>
              ))}
            </div>
          </div>

          <div data-part="preview">
            <p data-part="line">
              <strong>{preview.add}</strong>
              {adding.length > 0
                ? adding.map((tag) => tag.name).join(", ")
                : preview.none}
              <span>{preview.addHint}</span>
            </p>
            <p data-part="line">
              <strong>{preview.remove}</strong>
              {removing.length > 0
                ? removing.map((tag) => tag.name).join(", ")
                : preview.none}
              <span>{preview.removeHint}</span>
            </p>
            <p data-part="line">
              <strong>{preview.keep}</strong>
              {partial.length > 0
                ? partial.map((tag) => tag.name).join(", ")
                : preview.none}
              <span>{preview.keepHint}</span>
            </p>
          </div>

          <div data-part="actions">
            <button type="button" data-part="apply">
              {applyLabel}
            </button>
            <p data-part="note">{noteText}</p>
          </div>
        </div>
      </section>
    </>
  )
}
