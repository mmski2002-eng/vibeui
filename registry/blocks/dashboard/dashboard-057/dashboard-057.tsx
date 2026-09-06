import type { CSSProperties } from "react"

export type Dashboard057Field = {
  label: string
  hint: string
  mode: "set" | "clear" | "append" | "keep"
  before: string
  after: string
}

export type Dashboard057Props = {
  title?: string
  selectedCount?: number
  scope?: string
  fields?: Dashboard057Field[]
  applyLabel?: string
  cancelLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись у счётчика выборки. */
  scopeLabel?: string
  /** Подписи режимов операции: ключ — значение mode. */
  modeText?: Record<string, string>
  /** Предупреждение о необратимости: {count}. */
  dangerText?: string
  /** Счётчик полей в операции: {used} и {total}. */
  countText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: массовое редактирование опасно тем, что затрагивает записи,
// которых человек не видит. Поэтому каждое поле включается отдельным чекбоксом
// и по умолчанию выключено, а выключенное поле визуально гасится через :has() —
// без явного включения ничего не меняется. Рядом с полем показано «было → станет»
// на примере первой записи: абстрактное «изменить статус» не даёт понять,
// что именно потеряется. Внизу — счётчик затронутых записей и предупреждение
// о необратимости, потому что откат такой операции почти никогда не сделан.
const STYLES = `
:where([data-vibeui-block="dashboard-057"]){
--vibeui-dashboard-057-bg:transparent;
/* Карточки полей и плашки значений: подложка блока прозрачна. */
--vibeui-dashboard-057-card:light-dark(oklch(1 0 0),oklch(0.26 0 300));
--vibeui-dashboard-057-inset:light-dark(oklch(0.97 0 300),oklch(0.22 0 300));
--vibeui-dashboard-057-fg:light-dark(oklch(0.21 0 300),oklch(0.94 0 300));
--vibeui-dashboard-057-muted:light-dark(oklch(0.55 0 300),oklch(0.72 0 300));
--vibeui-dashboard-057-border:light-dark(oklch(0.91 0 300),oklch(0.36 0 300));
--vibeui-dashboard-057-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.76 0.14 39.8));
--vibeui-dashboard-057-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-057-accent-line:light-dark(oklch(0.86 0.05 39.8),oklch(0.44 0.08 39.8));
--vibeui-dashboard-057-accent-edge:light-dark(oklch(0.78 0.08 39.8),oklch(0.52 0.11 39.8));
--vibeui-dashboard-057-soft:light-dark(oklch(0.965 0 300),oklch(0.31 0.045 39.8));
--vibeui-dashboard-057-warn:light-dark(oklch(0.57 0.19 25),oklch(0.72 0.17 25));
--vibeui-dashboard-057-warn-soft:light-dark(oklch(0.97 0.018 25),oklch(0.28 0.05 25));
--vibeui-dashboard-057-warn-line:light-dark(oklch(0.84 0.08 25),oklch(0.46 0.1 25));
--vibeui-dashboard-057-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-057"]{color-scheme:dark}
[data-vibeui-block="dashboard-057"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-057-bg);
color:var(--vibeui-dashboard-057-fg);
font-family:var(--vibeui-dashboard-057-sans);
border:1px solid var(--vibeui-dashboard-057-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-057"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-057"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-057"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-057"] [data-part="scope"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;
padding:0.6875rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-057-soft);
border:1px solid var(--vibeui-dashboard-057-accent-line);
font-size:0.8125rem;
}
[data-vibeui-block="dashboard-057"] [data-part="scope"] b{font-size:1rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-057"] [data-part="scope"] span{color:var(--vibeui-dashboard-057-muted);font-size:0.75rem}
[data-vibeui-block="dashboard-057"] [data-part="list"]{display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-057"] [data-part="field"]{
display:grid;gap:0.375rem;padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-057-card);
border:1px solid var(--vibeui-dashboard-057-border);
}
/* Выключённое поле гаснет целиком: так видно, что оно не участвует в операции. */
[data-vibeui-block="dashboard-057"] [data-part="field"]:has(input[type="checkbox"]:not(:checked)) [data-part="values"],
[data-vibeui-block="dashboard-057"] [data-part="field"]:has(input[type="checkbox"]:not(:checked)) [data-part="mode"]{
opacity:0.42;
}
[data-vibeui-block="dashboard-057"] [data-part="field"]:has(input[type="checkbox"]:checked){
border-color:var(--vibeui-dashboard-057-accent-edge);
box-shadow:inset 0.1875rem 0 0 var(--vibeui-dashboard-057-accent);
}
[data-vibeui-block="dashboard-057"] [data-part="toggle"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;font-weight:700;cursor:pointer;
}
[data-vibeui-block="dashboard-057"] input[type="checkbox"]{width:1rem;height:1rem;accent-color:var(--vibeui-dashboard-057-accent);margin:0}
[data-vibeui-block="dashboard-057"] [data-part="hint"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-057-muted)}
[data-vibeui-block="dashboard-057"] [data-part="mode"]{
display:inline-block;font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.125rem 0.375rem;border-radius:0.3125rem;background:var(--vibeui-dashboard-057-soft);
}
[data-vibeui-block="dashboard-057"] [data-part="values"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-057"] [data-part="before"]{
padding:0.1875rem 0.4375rem;border-radius:0.375rem;text-decoration:line-through;
color:var(--vibeui-dashboard-057-muted);background:var(--vibeui-dashboard-057-inset);
border:1px solid var(--vibeui-dashboard-057-border);
}
[data-vibeui-block="dashboard-057"] [data-part="arrow"]{color:var(--vibeui-dashboard-057-muted)}
[data-vibeui-block="dashboard-057"] [data-part="after"]{
padding:0.1875rem 0.4375rem;border-radius:0.375rem;font-weight:700;
background:var(--vibeui-dashboard-057-soft);
border:1px solid var(--vibeui-dashboard-057-accent-line);
}
[data-vibeui-block="dashboard-057"] [data-part="danger"]{
display:flex;gap:0.5rem;padding:0.6875rem 0.875rem;border-radius:0.875rem;
font-size:0.75rem;line-height:1.45;
background:var(--vibeui-dashboard-057-warn-soft);
border:1px solid var(--vibeui-dashboard-057-warn-line);
}
[data-vibeui-block="dashboard-057"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-057"] [data-part="apply"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-057-accent);color:var(--vibeui-dashboard-057-on-accent);
}
[data-vibeui-block="dashboard-057"] [data-part="cancel"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-057-border);
}
[data-vibeui-block="dashboard-057"] [data-part="count"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-dashboard-057-muted);
}
[data-vibeui-block="dashboard-057"] :is(a,button,input,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-057-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-057"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_FIELDS: Dashboard057Field[] = [
  {
    label: "Этап сделки",
    hint: "Заменит этап у всех выбранных заявок.",
    mode: "set",
    before: "Согласование",
    after: "Смета",
  },
  {
    label: "Исполнитель",
    hint: "Прежний исполнитель получит уведомление о снятии.",
    mode: "set",
    before: "Ирина К.",
    after: "Павел Д.",
  },
  {
    label: "Срок ответа",
    hint: "Дата считается от момента применения, а не от исходной.",
    mode: "set",
    before: "12 июня",
    after: "20 июня",
  },
  {
    label: "Теги",
    hint: "Добавляет тег, не затирая уже проставленные.",
    mode: "append",
    before: "поставка",
    after: "поставка, приоритет-2",
  },
  {
    label: "Комментарий к заявке",
    hint: "Очистка удаляет текст без возможности вернуть его.",
    mode: "clear",
    before: "перезвонить после 15:00",
    after: "пусто",
  },
  {
    label: "Источник обращения",
    hint: "Поле не входит в операцию и останется как есть.",
    mode: "keep",
    before: "сайт",
    after: "сайт",
  },
]

const MODE_LABELS: Record<string, string> = {
  set: "заменить",
  clear: "очистить",
  append: "добавить",
  keep: "не трогать",
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
 * Экран массового редактирования: каждое поле включается своим чекбоксом,
 * рядом показано «было → станет» на примере первой записи, а выключенные поля
 * гасятся через :has(). Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard057({
  title = "Массовое редактирование заявок",
  selectedCount = 42,
  scope = "выбрано на странице «Мои на этой неделе», фильтр сохранён",
  fields = DEFAULT_FIELDS,
  applyLabel = "Применить к выбранным",
  cancelLabel = "Отмена",
  accent,
  background = "",
  scopeLabel = "записей будет изменено",
  modeText = MODE_LABELS,
  dangerText = "Операция применяется сразу ко всем {count} записям и не отменяется одной кнопкой: откатывать придётся по журналу изменений. Значения показаны на примере первой записи выборки — у остальных «было» своё.",
  countText = "Полей в операции: {used} из {total}",
  className,
  style,
}: Dashboard057Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-057-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-057-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const changing = fields.filter((field) => field.mode !== "keep")

  return (
    <>
      <style href="vibeui-dashboard-057" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-057"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <p data-part="scope">
            <b>{selectedCount}</b> {scopeLabel}
            <span>{scope}</span>
          </p>

          <div data-part="list">
            {fields.map((field) => (
              <div key={field.label} data-part="field">
                <label data-part="toggle">
                  <input
                    type="checkbox"
                    defaultChecked={field.mode !== "keep"}
                  />
                  {field.label}
                </label>
                <span data-part="mode">
                  {modeText[field.mode] ?? field.mode}
                </span>
                <p data-part="values">
                  <span data-part="before">{field.before}</span>
                  <span data-part="arrow" aria-hidden="true">
                    →
                  </span>
                  <span data-part="after">{field.after}</span>
                </p>
                <p data-part="hint">{field.hint}</p>
              </div>
            ))}
          </div>

          <p data-part="danger">
            {dangerText.replace("{count}", String(selectedCount))}
          </p>

          <div data-part="actions">
            <button type="button" data-part="apply">
              {applyLabel}
            </button>
            <button type="button" data-part="cancel">
              {cancelLabel}
            </button>
            <span data-part="count">
              {countText
                .replace("{used}", String(changing.length))
                .replace("{total}", String(fields.length))}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
