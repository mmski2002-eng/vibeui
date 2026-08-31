import type { CSSProperties } from "react"

export type Dashboard050Right = {
  group: string
  name: string
  hint: string
  by: ("full" | "some" | "none")[]
}

export type Dashboard050Props = {
  title?: string
  hint?: string
  roles?: string[]
  rights?: Dashboard050Right[]
  saveLabel?: string
  legendLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: права и роли матрицей, где ячейка несёт три состояния, а не
// галочку и пустоту: «полностью», «частично» и «нет». Частичное право —
// главная причина спорных вопросов о доступе, и без отдельного знака оно
// сливается с полным. Состояние обозначено формой и символом, а не цветом:
// матрицу читают быстро и часто печатают. Первая колонка липкая, поэтому при
// горизонтальной прокрутке название права не теряется, а строки сгруппированы
// по разделам заголовками внутри таблицы.
const STYLES = `
:where([data-vibeui-block="dashboard-050"]){
--vibeui-dashboard-050-bg:oklch(0.985 0.003 255);
--vibeui-dashboard-050-card:oklch(1 0 0);
--vibeui-dashboard-050-fg:oklch(0.22 0.014 255);
--vibeui-dashboard-050-muted:oklch(0.55 0.014 255);
--vibeui-dashboard-050-border:oklch(0.91 0.006 255);
--vibeui-dashboard-050-accent:oklch(0.5 0.15 255);
--vibeui-dashboard-050-soft:oklch(0.96 0.02 255);
--vibeui-dashboard-050-part:oklch(0.65 0.15 65);
--vibeui-dashboard-050-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-050"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-050-bg);
color:var(--vibeui-dashboard-050-fg);
font-family:var(--vibeui-dashboard-050-sans);
border:1px solid var(--vibeui-dashboard-050-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-050"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-050"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-050"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-050"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-050"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-050-muted)}
[data-vibeui-block="dashboard-050"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-050-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-050"] [data-part="scroll"]{
overflow-x:auto;
background:var(--vibeui-dashboard-050-card);
border:1px solid var(--vibeui-dashboard-050-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-050"] table{width:100%;min-width:34rem;border-collapse:separate;border-spacing:0}
[data-vibeui-block="dashboard-050"] th,
[data-vibeui-block="dashboard-050"] td{
padding:0.5rem 0.625rem;font-size:0.75rem;text-align:center;
border-bottom:1px solid var(--vibeui-dashboard-050-border);
}
[data-vibeui-block="dashboard-050"] tbody:last-of-type tr:last-child :is(th,td){border-bottom:0}
[data-vibeui-block="dashboard-050"] thead th{
position:sticky;top:0;z-index:2;
background:var(--vibeui-dashboard-050-card);
font-size:0.625rem;font-weight:750;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-050-muted);white-space:nowrap;
}
/* Липкая первая колонка: при прокрутке имя права не должно уезжать. */
[data-vibeui-block="dashboard-050"] [data-part="rowhead"],
[data-vibeui-block="dashboard-050"] thead th:first-child{
position:sticky;left:0;z-index:1;text-align:left;min-width:13rem;
background:var(--vibeui-dashboard-050-card);
box-shadow:1px 0 0 var(--vibeui-dashboard-050-border);
}
[data-vibeui-block="dashboard-050"] thead th:first-child{z-index:3}
[data-vibeui-block="dashboard-050"] [data-part="group"] th{
text-align:left;padding:0.5rem 0.625rem;
background:var(--vibeui-dashboard-050-bg);
font-size:0.5625rem;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-dashboard-050-muted);
}
[data-vibeui-block="dashboard-050"] [data-part="name"]{display:block;font-weight:700;font-size:0.75rem}
[data-vibeui-block="dashboard-050"] [data-part="note"]{
display:block;margin-top:0.125rem;font-size:0.625rem;font-weight:400;line-height:1.4;
color:var(--vibeui-dashboard-050-muted);
}
[data-vibeui-block="dashboard-050"] [data-part="cell"]{
display:inline-grid;place-items:center;width:1.375rem;height:1.375rem;border-radius:0.4375rem;
font-size:0.75rem;font-weight:800;
}
[data-vibeui-block="dashboard-050"] [data-part="cell"][data-level="full"]{
background:var(--vibeui-dashboard-050-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-050"] [data-part="cell"][data-level="some"]{
border:1.5px solid var(--vibeui-dashboard-050-part);color:var(--vibeui-dashboard-050-part);
border-radius:0.25rem;
}
[data-vibeui-block="dashboard-050"] [data-part="cell"][data-level="none"]{
color:var(--vibeui-dashboard-050-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-050-border);border-radius:50%;
}
[data-vibeui-block="dashboard-050"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.5rem 1rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-dashboard-050-muted);
}
[data-vibeui-block="dashboard-050"] [data-part="legend"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-050"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-050-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="dashboard-050"] [data-part="rowhead"]{min-width:17rem}
}
`

const DEFAULT_ROLES = ["Владелец", "Администратор", "Бухгалтер", "Оператор"]

const DEFAULT_RIGHTS: Dashboard050Right[] = [
  {
    group: "Рабочее пространство",
    name: "Просмотр рабочего пространства",
    hint: "Видеть проекты, участников и общие настройки",
    by: ["full", "full", "full", "full"],
  },
  {
    group: "Рабочее пространство",
    name: "Изменение настроек",
    hint: "Название, домен, интеграции, тарифный план",
    by: ["full", "full", "none", "none"],
  },
  {
    group: "Рабочее пространство",
    name: "Удаление пространства",
    hint: "Необратимое действие вместе со всеми данными",
    by: ["full", "none", "none", "none"],
  },
  {
    group: "Участники",
    name: "Приглашение участников",
    hint: "Отправка приглашений на почту",
    by: ["full", "full", "none", "some"],
  },
  {
    group: "Участники",
    name: "Изменение ролей",
    hint: "Повышение и понижение прав других участников",
    by: ["full", "some", "none", "none"],
  },
  {
    group: "Документы и деньги",
    name: "Просмотр счетов",
    hint: "Список счетов, суммы и сроки оплаты",
    by: ["full", "full", "full", "some"],
  },
  {
    group: "Документы и деньги",
    name: "Проведение оплат",
    hint: "Подтверждение платежей и возвратов",
    by: ["full", "none", "full", "none"],
  },
  {
    group: "Документы и деньги",
    name: "Выгрузка данных",
    hint: "Экспорт клиентов и операций в файл",
    by: ["full", "full", "some", "none"],
  },
]

const MARK: Record<string, string> = { full: "✓", some: "~", none: "—" }
const WORD: Record<string, string> = {
  full: "полностью",
  some: "частично",
  none: "нет доступа",
}

/**
 * Страница ролей и прав: матрица с тремя состояниями доступа, липкой первой
 * колонкой и группировкой прав по разделам. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard050({
  title = "Роли и права",
  hint = "4 роли · 8 прав · изменения применяются ко всем участникам роли",
  roles = DEFAULT_ROLES,
  rights = DEFAULT_RIGHTS,
  saveLabel = "Сохранить права",
  legendLabel = "Обозначения",
  accent,
  className,
  style,
}: Dashboard050Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-050-accent": accent } : null),
    ...style,
  } as CSSProperties

  const groups = rights.reduce<string[]>(
    (list, right) =>
      list.includes(right.group) ? list : [...list, right.group],
    [],
  )

  return (
    <>
      <style href="vibeui-dashboard-050" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-050"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
            <button type="button" data-part="save">
              {saveLabel}
            </button>
          </div>

          <div data-part="scroll">
            <table>
              <caption hidden>{title}</caption>
              <thead>
                <tr>
                  <th scope="col">Право</th>
                  {roles.map((role) => (
                    <th key={role} scope="col">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((group) => (
                <tbody key={group}>
                  <tr data-part="group">
                    <th scope="colgroup" colSpan={roles.length + 1}>
                      {group}
                    </th>
                  </tr>
                  {rights
                    .filter((right) => right.group === group)
                    .map((right) => (
                      <tr key={right.name}>
                        <th scope="row" data-part="rowhead">
                          <span data-part="name">{right.name}</span>
                          <span data-part="note">{right.hint}</span>
                        </th>
                        {right.by.map((level, index) => (
                          <td key={roles[index]}>
                            <span
                              data-part="cell"
                              data-level={level}
                              title={`${roles[index]}: ${WORD[level]}`}
                            >
                              {MARK[level]}
                              <span hidden>{WORD[level]}</span>
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              ))}
            </table>
          </div>

          <ul data-part="legend" aria-label={legendLabel}>
            <li>
              <span data-part="cell" data-level="full" aria-hidden="true">
                ✓
              </span>
              полный доступ
            </li>
            <li>
              <span data-part="cell" data-level="some" aria-hidden="true">
                ~
              </span>
              частичный: только свои записи или с подтверждением
            </li>
            <li>
              <span data-part="cell" data-level="none" aria-hidden="true">
                —
              </span>
              доступа нет
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
