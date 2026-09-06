import type { CSSProperties } from "react"

export type Dashboard024Key = {
  name: string
  prefix: string
  scope: string
  created: string
  lastUsed?: string
  revoked?: boolean
}

export type Dashboard024Props = {
  title?: string
  hint?: string
  scopes?: string[]
  newScope?: string
  freshKey?: string
  freshNote?: string
  keys?: Dashboard024Key[]
  createLabel?: string
  /** Подпись формы создания для скринридера. */
  createSectionLabel?: string
  nameLabel?: string
  namePlaceholder?: string
  scopeLabel?: string
  copyLabel?: string
  /** Заголовки колонок таблицы ключей. */
  columns?: string[]
  revokedLabel?: string
  revokeLabel?: string
  /** Шаблон подписи кнопки отзыва: {name}. */
  revokeForLabel?: string
  accent?: string
  /** Подложка карточки; пусто — цвет из палитры блока. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: ключи API, где только что созданный ключ показан один раз и
// прямо на месте — в рамке с предупреждением, что второй раз его не покажут.
// В таблице лежат только префиксы: полный ключ после создания не существует
// нигде, и притворяться, что его можно «посмотреть», нельзя. Отозванный ключ
// не исчезает, а остаётся зачёркнутой строкой с подписью: пропавшая строка
// читается как «его никогда не было» и рушит разбор инцидента.
const STYLES = `
:where([data-vibeui-block="dashboard-024"]){
--vibeui-dashboard-024-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-dashboard-024-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-dashboard-024-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-024-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-dashboard-024-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-024-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.15 39.8));
--vibeui-dashboard-024-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-024-warn:light-dark(oklch(0.62 0.15 65),oklch(0.82 0.13 65));
--vibeui-dashboard-024-warnbg:light-dark(oklch(0.975 0.03 85),oklch(0.29 0.04 75));
--vibeui-dashboard-024-risk:light-dark(oklch(0.55 0.18 25),oklch(0.74 0.15 25));
--vibeui-dashboard-024-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-024-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-024"]{color-scheme:dark}
[data-vibeui-block="dashboard-024"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-024-bg);
color:var(--vibeui-dashboard-024-fg);
font-family:var(--vibeui-dashboard-024-sans);
border:1px solid var(--vibeui-dashboard-024-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-024"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-024"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-024"] h2{margin:0 0 0.125rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-024"] [data-part="hint"]{margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-dashboard-024-muted)}
[data-vibeui-block="dashboard-024"] [data-part="create"]{
display:grid;grid-template-columns:1fr;gap:0.5rem;align-items:end;
padding:0.875rem;margin-bottom:0.875rem;
background:var(--vibeui-dashboard-024-panel);
border:1px solid var(--vibeui-dashboard-024-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-024"] [data-part="fieldlabel"]{
display:block;margin-bottom:0.25rem;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-dashboard-024-muted);
}
[data-vibeui-block="dashboard-024"] input,
[data-vibeui-block="dashboard-024"] select{
appearance:none;font:inherit;font-size:0.8125rem;color:inherit;width:100%;
padding:0.5rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-024-border);
background:var(--vibeui-dashboard-024-bg);
}
[data-vibeui-block="dashboard-024"] select{
padding-right:1.75rem;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E");
background-repeat:no-repeat;background-position:right 0.5rem center;background-size:0.625rem;
}
[data-vibeui-block="dashboard-024"] [data-part="make"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5rem 0.875rem;border-radius:0.5rem;white-space:nowrap;
background:var(--vibeui-dashboard-024-accent);color:var(--vibeui-dashboard-024-on-accent);
}
/* Ключ виден один раз: в рамке рядом с предупреждением, а не в таблице. */
[data-vibeui-block="dashboard-024"] [data-part="fresh"]{
display:grid;gap:0.375rem;padding:0.75rem 0.875rem;margin-bottom:0.875rem;
background:var(--vibeui-dashboard-024-warnbg);
border:1px solid var(--vibeui-dashboard-024-warn);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-024"] [data-part="freshnote"]{
margin:0;font-size:0.75rem;font-weight:650;color:var(--vibeui-dashboard-024-warn);
}
[data-vibeui-block="dashboard-024"] [data-part="secret"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
}
[data-vibeui-block="dashboard-024"] code{
flex:1 1 14rem;min-width:0;overflow-wrap:anywhere;
font-family:var(--vibeui-dashboard-024-mono);font-size:0.75rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-024-bg);
border:1px solid var(--vibeui-dashboard-024-border);
}
[data-vibeui-block="dashboard-024"] [data-part="copy"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.4375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-024-border);
background:var(--vibeui-dashboard-024-bg);color:inherit;
}
[data-vibeui-block="dashboard-024"] [data-part="tablewrap"]{overflow-x:auto}
[data-vibeui-block="dashboard-024"] table{width:100%;border-collapse:collapse;font-size:0.75rem}
[data-vibeui-block="dashboard-024"] th{
text-align:left;padding:0.375rem 0.75rem 0.375rem 0;white-space:nowrap;
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-024-muted);
border-bottom:1px solid var(--vibeui-dashboard-024-border);
}
[data-vibeui-block="dashboard-024"] td{
padding:0.5rem 0.75rem 0.5rem 0;white-space:nowrap;vertical-align:top;
border-bottom:1px solid var(--vibeui-dashboard-024-border);
}
[data-vibeui-block="dashboard-024"] [data-part="prefix"]{
font-family:var(--vibeui-dashboard-024-mono);color:var(--vibeui-dashboard-024-muted);
}
[data-vibeui-block="dashboard-024"] [data-part="scope"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
padding:0.0625rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-dashboard-024-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-024-border);
}
[data-vibeui-block="dashboard-024"] [data-revoked="true"] th,
[data-vibeui-block="dashboard-024"] [data-revoked="true"] td{
color:var(--vibeui-dashboard-024-muted);text-decoration:line-through;
}
[data-vibeui-block="dashboard-024"] [data-part="dead"]{
text-decoration:none;font-weight:650;color:var(--vibeui-dashboard-024-risk);
}
[data-vibeui-block="dashboard-024"] [data-part="revoke"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:650;
padding:0.25rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-dashboard-024-border);
background:var(--vibeui-dashboard-024-bg);color:var(--vibeui-dashboard-024-risk);
}
[data-vibeui-block="dashboard-024"] :is(input,select,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-024-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-024"] [data-part="shell"]{padding:1.375rem}
[data-vibeui-block="dashboard-024"] [data-part="create"]{grid-template-columns:1fr 12rem auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_KEYS: Dashboard024Key[] = [
  {
    name: "Сборка каталога",
    prefix: "vui_live_9f2c…",
    scope: "чтение",
    created: "4 февраля",
    lastUsed: "сегодня, 14:22",
  },
  {
    name: "CI на GitHub",
    prefix: "vui_live_31ab…",
    scope: "чтение и запись",
    created: "18 января",
    lastUsed: "вчера",
  },
  {
    name: "Черновик витрины",
    prefix: "vui_test_77de…",
    scope: "чтение",
    created: "3 января",
    lastUsed: "не использовался",
  },
  {
    name: "Старый экспорт",
    prefix: "vui_live_04bb…",
    scope: "чтение",
    created: "12 ноября",
    revoked: true,
  },
]

const DEFAULT_COLUMNS = [
  "Название",
  "Префикс",
  "Права",
  "Создан",
  "Последний вызов",
  "Действие",
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Ключи API: создание, показ секрета один раз и отзыв без удаления строки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard024({
  title = "Ключи API",
  hint = "Ключ даёт доступ к реестру от имени проекта. Храните его как пароль.",
  scopes = ["чтение", "чтение и запись", "администрирование"],
  newScope = "чтение",
  freshKey = "vui_live_9f2c4b81a07d5e3fa6c2b9d84e17f0aa",
  freshNote = "Ключ показан один раз. Закроете страницу — восстановить будет нечем.",
  keys = DEFAULT_KEYS,
  createLabel = "Создать ключ",
  createSectionLabel = "Создание ключа",
  nameLabel = "Название ключа",
  namePlaceholder = "Например, «CI на GitHub»",
  scopeLabel = "Права",
  copyLabel = "Скопировать",
  columns = DEFAULT_COLUMNS,
  revokedLabel = "отозван",
  revokeLabel = "Отозвать",
  revokeForLabel = "Отозвать ключ {name}",
  accent,
  background = "",
  className,
  style,
}: Dashboard024Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-024" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-024"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="hint">{hint}</p>

          <div data-part="create" role="group" aria-label={createSectionLabel}>
            <label>
              <span data-part="fieldlabel">{nameLabel}</span>
              <input placeholder={namePlaceholder} />
            </label>
            <label>
              <span data-part="fieldlabel">{scopeLabel}</span>
              <select defaultValue={newScope}>
                {scopes.map((scope) => (
                  <option key={scope}>{scope}</option>
                ))}
              </select>
            </label>
            <button type="button" data-part="make">
              {createLabel}
            </button>
          </div>

          <div data-part="fresh" role="status">
            <p data-part="freshnote">{freshNote}</p>
            <p data-part="secret">
              <code>{freshKey}</code>
              <button type="button" data-part="copy">
                {copyLabel}
              </button>
            </p>
          </div>

          <div data-part="tablewrap">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr
                    key={key.prefix}
                    data-revoked={key.revoked ? "true" : "false"}
                  >
                    <th scope="row">{key.name}</th>
                    <td data-part="prefix">{key.prefix}</td>
                    <td>
                      <span data-part="scope">{key.scope}</span>
                    </td>
                    <td>{key.created}</td>
                    <td>{key.lastUsed ?? "—"}</td>
                    <td>
                      {key.revoked ? (
                        <span data-part="dead">{revokedLabel}</span>
                      ) : (
                        <button
                          type="button"
                          data-part="revoke"
                          aria-label={revokeForLabel.replace(
                            "{name}",
                            key.name,
                          )}
                        >
                          {revokeLabel}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
