import type { CSSProperties } from "react"

export type Dashboard056Column = {
  source: string
  sample: string
  target: string
  state: "mapped" | "guess" | "skip" | "error"
  hint?: string
}

export type Dashboard056Props = {
  title?: string
  fileName?: string
  fileMeta?: string
  columns?: Dashboard056Column[]
  targets?: string[]
  importLabel?: string
  backLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: импорт ломается не на загрузке файла, а на сопоставлении колонок.
// Поэтому центр экрана — таблица «колонка файла → поле системы», где рядом с
// каждым выбором стоит живой пример значения из первой строки: без примера
// человек сопоставляет вслепую и узнаёт об ошибке уже после импорта.
// Угаданное сопоставление помечено отдельным состоянием, а не тихо принято:
// подтверждение догадки — осознанное действие. Итог собран внизу цифрами,
// потому что кнопку «Импортировать» нажимают, глядя именно на них.
const STYLES = `
:where([data-vibeui-block="dashboard-056"]){
--vibeui-dashboard-056-bg:oklch(0.985 0.003 210);
--vibeui-dashboard-056-card:oklch(1 0 0);
--vibeui-dashboard-056-fg:oklch(0.21 0.014 210);
--vibeui-dashboard-056-muted:oklch(0.55 0.014 210);
--vibeui-dashboard-056-border:oklch(0.91 0.006 210);
--vibeui-dashboard-056-accent:oklch(0.52 0.14 210);
--vibeui-dashboard-056-soft:oklch(0.965 0.02 210);
--vibeui-dashboard-056-ok:oklch(0.6 0.13 155);
--vibeui-dashboard-056-guess:oklch(0.68 0.15 72);
--vibeui-dashboard-056-error:oklch(0.57 0.19 25);
--vibeui-dashboard-056-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-056-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-056"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-056-bg);
color:var(--vibeui-dashboard-056-fg);
font-family:var(--vibeui-dashboard-056-sans);
border:1px solid var(--vibeui-dashboard-056-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-056"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-056"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-056"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-056"] [data-part="file"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;
padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-056-card);
border:1px solid var(--vibeui-dashboard-056-border);
}
[data-vibeui-block="dashboard-056"] [data-part="file"] strong{font-size:0.875rem;font-family:var(--vibeui-dashboard-056-mono)}
[data-vibeui-block="dashboard-056"] [data-part="file"] span{font-size:0.75rem;color:var(--vibeui-dashboard-056-muted)}
[data-vibeui-block="dashboard-056"] [data-part="back"]{
margin-left:auto;appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.375rem 0.75rem;border-radius:0.5rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-056-border);
}
[data-vibeui-block="dashboard-056"] [data-part="scroll"]{
overflow-x:auto;background:var(--vibeui-dashboard-056-card);
border:1px solid var(--vibeui-dashboard-056-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-056"] table{border-collapse:collapse;width:100%;min-width:40rem;font-size:0.8125rem}
[data-vibeui-block="dashboard-056"] th{
text-align:left;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-056-muted);padding:0.625rem 0.75rem;
border-bottom:1px solid var(--vibeui-dashboard-056-border);white-space:nowrap;
}
[data-vibeui-block="dashboard-056"] td{padding:0.5rem 0.75rem;border-bottom:1px solid var(--vibeui-dashboard-056-border);vertical-align:middle}
[data-vibeui-block="dashboard-056"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="dashboard-056"] [data-part="source"]{font-family:var(--vibeui-dashboard-056-mono);font-weight:650}
[data-vibeui-block="dashboard-056"] [data-part="sample"]{
display:block;font-family:var(--vibeui-dashboard-056-mono);font-size:0.6875rem;
color:var(--vibeui-dashboard-056-muted);overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-056"] select{
font:inherit;font-size:0.8125rem;width:100%;min-width:11rem;
padding:0.375rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-dashboard-056-bg);
color:inherit;border:1px solid var(--vibeui-dashboard-056-border);
}
[data-vibeui-block="dashboard-056"] tr[data-state="error"] select{border-color:var(--vibeui-dashboard-056-error)}
[data-vibeui-block="dashboard-056"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.6875rem;font-weight:700;white-space:nowrap;
}
[data-vibeui-block="dashboard-056"] [data-part="state"]::before{content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor}
[data-vibeui-block="dashboard-056"] tr[data-state="mapped"] [data-part="state"]{color:var(--vibeui-dashboard-056-ok)}
[data-vibeui-block="dashboard-056"] tr[data-state="guess"] [data-part="state"]{color:var(--vibeui-dashboard-056-guess)}
[data-vibeui-block="dashboard-056"] tr[data-state="guess"] [data-part="state"]::before{border-radius:0.125rem}
[data-vibeui-block="dashboard-056"] tr[data-state="skip"] [data-part="state"]{color:var(--vibeui-dashboard-056-muted)}
[data-vibeui-block="dashboard-056"] tr[data-state="skip"] [data-part="state"]::before{background:transparent;box-shadow:inset 0 0 0 1px currentColor}
[data-vibeui-block="dashboard-056"] tr[data-state="error"] [data-part="state"]{color:var(--vibeui-dashboard-056-error)}
[data-vibeui-block="dashboard-056"] tr[data-state="error"] [data-part="state"]::before{border-radius:0;transform:rotate(45deg)}
[data-vibeui-block="dashboard-056"] [data-part="hint"]{
display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-056-muted);margin-top:0.125rem;
}
[data-vibeui-block="dashboard-056"] [data-part="summary"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;
padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-056-soft);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-056-accent) 22%,white);
}
[data-vibeui-block="dashboard-056"] [data-part="stat"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="dashboard-056"] [data-part="stat"] b{font-size:1.0625rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-056"] [data-part="stat"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-056-muted)}
[data-vibeui-block="dashboard-056"] [data-part="go"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:700;padding:0.5rem 1rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-056-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-056"] [data-part="go"][aria-disabled="true"]{
background:var(--vibeui-dashboard-056-border);color:var(--vibeui-dashboard-056-muted);cursor:not-allowed;
}
[data-vibeui-block="dashboard-056"] :is(a,button,select):focus-visible{
outline:2px solid var(--vibeui-dashboard-056-accent);outline-offset:2px;
}
`

const DEFAULT_TARGETS = [
  "— не импортировать —",
  "Фамилия и имя",
  "Электронная почта",
  "Телефон",
  "Компания",
  "Должность",
  "Город",
  "Источник",
  "Дата регистрации",
  "Сумма сделки",
]

const DEFAULT_COLUMNS: Dashboard056Column[] = [
  {
    source: "full_name",
    sample: "Кузнецова Ирина Павловна",
    target: "Фамилия и имя",
    state: "mapped",
  },
  {
    source: "e-mail",
    sample: "i.kuznetsova@severles.ru",
    target: "Электронная почта",
    state: "mapped",
  },
  {
    source: "phone_mobile",
    sample: "+7 912 445-19-02",
    target: "Телефон",
    state: "guess",
    hint: "Угадано по имени колонки — подтвердите выбор.",
  },
  {
    source: "org",
    sample: "ООО «Северный лес»",
    target: "Компания",
    state: "guess",
    hint: "Угадано по имени колонки — подтвердите выбор.",
  },
  {
    source: "created",
    sample: "13.06.2025 09:41",
    target: "Дата регистрации",
    state: "error",
    hint: "Формат даты не распознан: ожидается ГГГГ-ММ-ДД.",
  },
  {
    source: "utm_campaign",
    sample: "spring-retarget-2",
    target: "— не импортировать —",
    state: "skip",
  },
  {
    source: "notes_internal",
    sample: "перезвонить после 15:00",
    target: "— не импортировать —",
    state: "skip",
  },
]

const STATE_LABELS: Record<Dashboard056Column["state"], string> = {
  mapped: "сопоставлено",
  guess: "угадано",
  skip: "пропущено",
  error: "ошибка",
}

/**
 * Экран импорта CSV: карточка файла, таблица сопоставления колонок с примером
 * значения и состоянием каждой строки, итог цифрами перед запуском. Один файл,
 * ноль зависимостей, клиентского JS нет.
 */
export function Dashboard056({
  title = "Импорт контактов из CSV",
  fileName = "contacts-june.csv",
  fileMeta = "2,4 МБ · 4 812 строк · разделитель «;» · кодировка UTF-8",
  columns = DEFAULT_COLUMNS,
  targets = DEFAULT_TARGETS,
  importLabel = "Импортировать 4 812 строк",
  backLabel = "Другой файл",
  accent,
  className,
  style,
}: Dashboard056Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-056-accent": accent } : null),
    ...style,
  } as CSSProperties

  const mapped = columns.filter(
    (column) => column.state === "mapped" || column.state === "guess",
  ).length
  const skipped = columns.filter((column) => column.state === "skip").length
  const broken = columns.filter((column) => column.state === "error").length

  return (
    <>
      <style href="vibeui-dashboard-056" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-056"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <div data-part="file">
            <strong>{fileName}</strong>
            <span>{fileMeta}</span>
            <button type="button" data-part="back">
              {backLabel}
            </button>
          </div>

          <div data-part="scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Колонка файла</th>
                  <th scope="col">Поле системы</th>
                  <th scope="col">Состояние</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((column) => (
                  <tr key={column.source} data-state={column.state}>
                    <td>
                      <span data-part="source">{column.source}</span>
                      <span data-part="sample">{column.sample}</span>
                    </td>
                    <td>
                      <select
                        defaultValue={column.target}
                        aria-label={`Поле системы для колонки ${column.source}`}
                      >
                        {targets.map((target) => (
                          <option key={target} value={target}>
                            {target}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span data-part="state">
                        {STATE_LABELS[column.state]}
                      </span>
                      {column.hint ? (
                        <span data-part="hint">{column.hint}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div data-part="summary">
            <p data-part="stat">
              <b>{mapped}</b>
              <span>колонок будет импортировано</span>
            </p>
            <p data-part="stat">
              <b>{skipped}</b>
              <span>пропущено осознанно</span>
            </p>
            <p data-part="stat">
              <b>{broken}</b>
              <span>требует исправления</span>
            </p>
            <button
              type="button"
              data-part="go"
              aria-disabled={broken > 0}
              aria-describedby="dashboard-056-note"
            >
              {importLabel}
            </button>
          </div>

          <p id="dashboard-056-note" data-part="hint">
            Пока есть колонка с ошибкой, импорт не запускается: частично
            загруженный файл чинить дороже, чем поправить сопоставление сейчас.
          </p>
        </div>
      </section>
    </>
  )
}
