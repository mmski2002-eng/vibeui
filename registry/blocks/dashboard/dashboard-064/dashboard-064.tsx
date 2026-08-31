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
--vibeui-dashboard-064-bg:oklch(0.985 0.003 320);
--vibeui-dashboard-064-card:oklch(1 0 0);
--vibeui-dashboard-064-fg:oklch(0.21 0.014 320);
--vibeui-dashboard-064-muted:oklch(0.55 0.014 320);
--vibeui-dashboard-064-border:oklch(0.91 0.006 320);
--vibeui-dashboard-064-accent:oklch(0.52 0.16 320);
--vibeui-dashboard-064-soft:oklch(0.965 0.02 320);
--vibeui-dashboard-064-add:oklch(0.55 0.13 155);
--vibeui-dashboard-064-remove:oklch(0.57 0.19 25);
--vibeui-dashboard-064-partial:oklch(0.68 0.15 72);
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
border-color:color-mix(in oklab,var(--vibeui-dashboard-064-accent) 50%,white);
}
[data-vibeui-block="dashboard-064"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;font-weight:700;
padding:0.25rem 0.5rem;border-radius:0.5rem;white-space:nowrap;
background:var(--vibeui-dashboard-064-bg);border:1px solid var(--vibeui-dashboard-064-border);
}
[data-vibeui-block="dashboard-064"] [data-part="chip"] em{
font-style:normal;font-size:0.625rem;font-weight:650;color:var(--vibeui-dashboard-064-muted);
}
[data-vibeui-block="dashboard-064"] [data-state="add"]{
background:color-mix(in oklab,var(--vibeui-dashboard-064-add) 12%,white);
border-color:color-mix(in oklab,var(--vibeui-dashboard-064-add) 40%,white);
}
[data-vibeui-block="dashboard-064"] [data-state="add"] em{color:color-mix(in oklab,var(--vibeui-dashboard-064-add) 75%,black)}
[data-vibeui-block="dashboard-064"] [data-state="remove"]{
background:color-mix(in oklab,var(--vibeui-dashboard-064-remove) 10%,white);
border-color:color-mix(in oklab,var(--vibeui-dashboard-064-remove) 38%,white);
text-decoration:line-through;
}
[data-vibeui-block="dashboard-064"] [data-state="remove"] em{color:var(--vibeui-dashboard-064-remove);text-decoration:none}
[data-vibeui-block="dashboard-064"] [data-state="some"]{
border-style:dashed;border-color:color-mix(in oklab,var(--vibeui-dashboard-064-partial) 55%,white);
}
[data-vibeui-block="dashboard-064"] [data-state="some"] em{color:color-mix(in oklab,var(--vibeui-dashboard-064-partial) 75%,black)}
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
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-064-accent) 22%,white);
}
[data-vibeui-block="dashboard-064"] [data-part="line"]{margin:0;font-size:0.8125rem;display:flex;flex-wrap:wrap;gap:0.3125rem;align-items:baseline}
[data-vibeui-block="dashboard-064"] [data-part="line"] strong{font-weight:750}
[data-vibeui-block="dashboard-064"] [data-part="line"] span{color:var(--vibeui-dashboard-064-muted);font-size:0.75rem}
[data-vibeui-block="dashboard-064"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-064"] [data-part="apply"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-064-accent);color:oklch(1 0 0);
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
  all: "у всех 42",
  some: "у части",
  add: "будет добавлен",
  remove: "будет снят",
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
  className,
  style,
}: Dashboard064Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-064-accent": accent } : null),
    ...style,
  } as CSSProperties

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
              Выбрано <b>{selectedCount}</b> записей. Теги, стоящие не у всех,
              помечены пунктиром — их состояние не меняется, пока вы не решите
              явно.
            </p>
          </div>

          <div>
            <h3>Теги выборки</h3>
            <div data-part="field">
              {tags.map((tag) => (
                <span key={tag.name} data-part="chip" data-state={tag.state}>
                  {tag.name}
                  <em>{STATE_LABELS[tag.state]}</em>
                  <button
                    type="button"
                    aria-label={`Изменить состояние тега «${tag.name}»`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={inputLabel}
                aria-label="Новый тег"
              />
            </div>
          </div>

          <div>
            <h3>Частые теги</h3>
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
              <strong>Добавим:</strong>
              {adding.length > 0
                ? adding.map((tag) => tag.name).join(", ")
                : "ничего"}
              <span>тем записям, где тега ещё нет</span>
            </p>
            <p data-part="line">
              <strong>Снимем:</strong>
              {removing.length > 0
                ? removing.map((tag) => tag.name).join(", ")
                : "ничего"}
              <span>у всех выбранных записей</span>
            </p>
            <p data-part="line">
              <strong>Не тронем:</strong>
              {partial.length > 0
                ? partial.map((tag) => tag.name).join(", ")
                : "ничего"}
              <span>останутся там, где стояли</span>
            </p>
          </div>

          <div data-part="actions">
            <button type="button" data-part="apply">
              {applyLabel}
            </button>
            <p data-part="note">
              Снятие тега не удаляет сам тег из справочника: он останется
              доступен другим записям и фильтрам.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
