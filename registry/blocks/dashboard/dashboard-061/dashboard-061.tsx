import type { CSSProperties } from "react"

export type Dashboard061Change = {
  field: string
  before: string
  after: string
}

export type Dashboard061Version = {
  id: string
  at: string
  author: string
  via: string
  summary: string
  changes: Dashboard061Change[]
  current?: boolean
}

export type Dashboard061Props = {
  title?: string
  recordName?: string
  versions?: Dashboard061Version[]
  restoreLabel?: string
  compareLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись раскрытия версии. */
  expandLabel?: string
  /** Подпись сворачивания версии. */
  collapseLabel?: string
  /** Счётчик изменённых полей: {count}. */
  changedText?: string
  /** Подпись текущей версии вместо кнопок отката. */
  currentText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: история записи нужна не «посмотреть список правок», а ответить
// на вопрос «кто и когда сломал вот это поле». Поэтому каждая версия свёрнута
// в details, а её заголовок несёт готовый ответ: кто, когда, откуда (интерфейс,
// импорт, API) и сколько полей затронуто. Раскрытая версия показывает diff
// «было → стало» построчно — только изменённые поля, без шума неизменных.
// Вертикальная линия слева склеивает список в ленту, а текущая версия помечена
// словом и не предлагает откат: откатывать на саму себя незачем.
const STYLES = `
:where([data-vibeui-block="dashboard-061"]){
--vibeui-dashboard-061-bg:transparent;
/* Карточки версий и точки ленты: подложка блока прозрачна. */
--vibeui-dashboard-061-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 285));
--vibeui-dashboard-061-inset:light-dark(oklch(0.97 0.004 285),oklch(0.22 0.012 285));
--vibeui-dashboard-061-fg:light-dark(oklch(0.21 0.014 285),oklch(0.94 0.005 285));
--vibeui-dashboard-061-muted:light-dark(oklch(0.55 0.014 285),oklch(0.72 0.012 285));
--vibeui-dashboard-061-border:light-dark(oklch(0.91 0.006 285),oklch(0.36 0.012 285));
--vibeui-dashboard-061-accent:light-dark(oklch(0.51 0.16 285),oklch(0.77 0.13 285));
--vibeui-dashboard-061-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.04 285));
--vibeui-dashboard-061-accent-ring:light-dark(oklch(0.84 0.06 285),oklch(0.45 0.08 285));
--vibeui-dashboard-061-soft:light-dark(oklch(0.965 0.02 285),oklch(0.31 0.04 285));
--vibeui-dashboard-061-remove:light-dark(oklch(0.57 0.19 25),oklch(0.75 0.16 25));
--vibeui-dashboard-061-remove-soft:light-dark(oklch(0.965 0.02 25),oklch(0.29 0.05 25));
--vibeui-dashboard-061-add:light-dark(oklch(0.55 0.13 155),oklch(0.75 0.13 155));
--vibeui-dashboard-061-add-ink:light-dark(oklch(0.44 0.11 155),oklch(0.82 0.12 155));
--vibeui-dashboard-061-add-soft:light-dark(oklch(0.96 0.025 155),oklch(0.29 0.045 155));
--vibeui-dashboard-061-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-061-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-061"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-061-bg);
color:var(--vibeui-dashboard-061-fg);
font-family:var(--vibeui-dashboard-061-sans);
border:1px solid var(--vibeui-dashboard-061-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-061"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-061"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-061"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-061"] [data-part="record"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-061-muted)}
[data-vibeui-block="dashboard-061"] [data-part="line"]{
list-style:none;margin:0;padding:0 0 0 1.125rem;display:flex;flex-direction:column;gap:0.5rem;
position:relative;
}
[data-vibeui-block="dashboard-061"] [data-part="line"]::before{
content:"";position:absolute;left:0.3125rem;top:0.75rem;bottom:0.75rem;width:1px;
background:var(--vibeui-dashboard-061-border);
}
[data-vibeui-block="dashboard-061"] [data-part="item"]{position:relative}
[data-vibeui-block="dashboard-061"] [data-part="item"]::before{
content:"";position:absolute;left:-1.0625rem;top:0.9375rem;width:0.625rem;height:0.625rem;
border-radius:50%;background:var(--vibeui-dashboard-061-inset);
box-shadow:0 0 0 2px var(--vibeui-dashboard-061-border);
}
[data-vibeui-block="dashboard-061"] [data-part="item"][data-current="true"]::before{
background:var(--vibeui-dashboard-061-accent);
box-shadow:0 0 0 2px var(--vibeui-dashboard-061-accent-ring);
}
[data-vibeui-block="dashboard-061"] details{
background:var(--vibeui-dashboard-061-card);border:1px solid var(--vibeui-dashboard-061-border);
border-radius:0.8125rem;overflow:hidden;
}
[data-vibeui-block="dashboard-061"] summary{
list-style:none;cursor:pointer;padding:0.6875rem 0.8125rem;
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;
}
[data-vibeui-block="dashboard-061"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-061"] :is([data-part="more"],[data-part="less"]){
margin-left:auto;font-size:0.6875rem;font-weight:700;
color:var(--vibeui-dashboard-061-accent);
}
[data-vibeui-block="dashboard-061"] [data-part="less"]{display:none}
[data-vibeui-block="dashboard-061"] details[open] [data-part="more"]{display:none}
[data-vibeui-block="dashboard-061"] details[open] [data-part="less"]{display:inline}
[data-vibeui-block="dashboard-061"] [data-part="when"]{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-061"] [data-part="who"]{font-size:0.75rem;color:var(--vibeui-dashboard-061-muted)}
[data-vibeui-block="dashboard-061"] [data-part="via"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.125rem 0.375rem;border-radius:0.3125rem;background:var(--vibeui-dashboard-061-soft);
}
[data-vibeui-block="dashboard-061"] [data-part="body"]{padding:0 0.8125rem 0.8125rem;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-061"] [data-part="summary"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-061-muted)}
[data-vibeui-block="dashboard-061"] dl{margin:0;display:grid;grid-template-columns:1fr;gap:0.3125rem 0.75rem}
[data-vibeui-block="dashboard-061"] dt{
font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-061-muted);align-self:center;
}
[data-vibeui-block="dashboard-061"] dd{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;font-size:0.8125rem}
[data-vibeui-block="dashboard-061"] [data-part="before"]{
font-family:var(--vibeui-dashboard-061-mono);padding:0.125rem 0.375rem;border-radius:0.3125rem;
text-decoration:line-through;color:var(--vibeui-dashboard-061-remove);
background:var(--vibeui-dashboard-061-remove-soft);
}
[data-vibeui-block="dashboard-061"] [data-part="after"]{
font-family:var(--vibeui-dashboard-061-mono);padding:0.125rem 0.375rem;border-radius:0.3125rem;
font-weight:700;color:var(--vibeui-dashboard-061-add-ink);
background:var(--vibeui-dashboard-061-add-soft);
}
[data-vibeui-block="dashboard-061"] [data-part="acts"]{display:flex;flex-wrap:wrap;gap:0.4375rem}
[data-vibeui-block="dashboard-061"] [data-part="acts"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:700;
padding:0.3125rem 0.625rem;border-radius:0.4375rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-061-border);
}
[data-vibeui-block="dashboard-061"] [data-part="acts"] button[data-primary="true"]{
background:var(--vibeui-dashboard-061-accent);color:var(--vibeui-dashboard-061-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-061"] [data-part="now"]{
font-size:0.6875rem;font-weight:750;color:var(--vibeui-dashboard-061-accent);
}
[data-vibeui-block="dashboard-061"] :is(a,button,summary):focus-visible{
outline:2px solid var(--vibeui-dashboard-061-accent);outline-offset:2px;
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-061"] dl{grid-template-columns:9rem minmax(0,1fr)}
}
`

const DEFAULT_VERSIONS: Dashboard061Version[] = [
  {
    id: "v-18",
    at: "сегодня, 11:42",
    author: "Ирина Кузнецова",
    via: "интерфейс",
    summary: "Уточнила сумму после звонка в закупку.",
    current: true,
    changes: [
      { field: "Сумма", before: "386 000 ₽", after: "412 000 ₽" },
      { field: "Срок", before: "10 июня", after: "14 июня" },
    ],
  },
  {
    id: "v-17",
    at: "вчера, 18:05",
    author: "Сценарий «Эскалация»",
    via: "автоматизация",
    summary: "Заявка провисела без ответа двое суток.",
    changes: [
      { field: "Приоритет", before: "обычный", after: "высокий" },
      { field: "Наблюдатель", before: "—", after: "Павел Дорохов" },
    ],
  },
  {
    id: "v-16",
    at: "9 июня, 09:14",
    author: "Павел Дорохов",
    via: "импорт",
    summary: "Перенос данных из старой таблицы поставок.",
    changes: [
      { field: "Этап", before: "Новая", after: "Согласование" },
      { field: "Контактное лицо", before: "—", after: "Кузнецова И. П." },
      { field: "Комментарий", before: "—", after: "перезвонить после 15:00" },
    ],
  },
  {
    id: "v-15",
    at: "5 июня, 12:30",
    author: "Форма на сайте",
    via: "API",
    summary: "Запись создана из заявки на сайте.",
    changes: [
      { field: "Клиент", before: "—", after: "ООО «Северный лес»" },
      { field: "Сумма", before: "—", after: "386 000 ₽" },
    ],
  },
]

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
 * История изменений записи: версии в ленте, каждая свёрнута в details, внутри —
 * diff изменённых полей «было → стало» и откат. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard061({
  title = "История изменений",
  recordName = "Заявка ЗК-4821 · ООО «Северный лес» · 18 версий, хранятся 24 месяца",
  versions = DEFAULT_VERSIONS,
  restoreLabel = "Откатить к этой версии",
  compareLabel = "Сравнить с текущей",
  accent,
  background = "",
  expandLabel = "развернуть",
  collapseLabel = "свернуть",
  changedText = "полей изменено: {count}",
  currentText = "Это текущее состояние записи — откатывать не к чему.",
  className,
  style,
}: Dashboard061Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-061-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-061-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-061" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-061"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="record">{recordName}</p>
          </div>

          <ol data-part="line">
            {versions.map((version) => (
              <li
                key={version.id}
                data-part="item"
                data-current={version.current}
              >
                <details open={version.current}>
                  <summary>
                    <span data-part="when">{version.at}</span>
                    <span data-part="who">{version.author}</span>
                    <span data-part="via">{version.via}</span>
                    <span data-part="who">
                      {changedText.replace(
                        "{count}",
                        String(version.changes.length),
                      )}
                    </span>
                    <span data-part="more">{expandLabel}</span>
                    <span data-part="less">{collapseLabel}</span>
                  </summary>
                  <div data-part="body">
                    <p data-part="summary">{version.summary}</p>
                    <dl>
                      {version.changes.map((change) => (
                        <div key={change.field} style={{ display: "contents" }}>
                          <dt>{change.field}</dt>
                          <dd>
                            <span data-part="before">{change.before}</span>
                            <span aria-hidden="true">→</span>
                            <span data-part="after">{change.after}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {version.current ? (
                      <p data-part="now">{currentText}</p>
                    ) : (
                      <div data-part="acts">
                        <button type="button" data-primary="true">
                          {restoreLabel}
                        </button>
                        <button type="button">{compareLabel}</button>
                      </div>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
