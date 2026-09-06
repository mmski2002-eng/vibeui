import type { CSSProperties } from "react"

export type Dashboard065Action = {
  label: string
  hint: string
  hotkey: string
  primary?: boolean
}

export type Dashboard065Recent = {
  label: string
  kind: string
  when: string
}

export type Dashboard065Today = {
  label: string
  value: string
  note: string
}

export type Dashboard065Props = {
  title?: string
  greeting?: string
  actions?: Dashboard065Action[]
  recent?: Dashboard065Recent[]
  today?: Dashboard065Today[]
  recentTitle?: string
  /** Заголовок сводки дня. */
  todayTitle?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: главная приложения существует ради первого клика, а не ради
// красоты. Поэтому крупные быстрые действия стоят выше всего и несут не только
// название, но и подпись «что произойдёт» плюс горячую клавишу — так экран
// сам учит работать без мыши. Ниже «продолжить работу»: восемь из десяти
// заходов — это возврат к вчерашнему объекту, и искать его через каталог
// бессмысленно. Сводка дня замыкает экран цифрами, потому что она отвечает
// не «что сделать», а «всё ли спокойно».
const STYLES = `
:where([data-vibeui-block="dashboard-065"]){
--vibeui-dashboard-065-bg:transparent;
/* Карточки, чипы и клавиши: подложка блока прозрачна. */
--vibeui-dashboard-065-card:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-dashboard-065-inset:light-dark(oklch(0.985 0 265),oklch(0.22 0 265));
--vibeui-dashboard-065-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-dashboard-065-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-dashboard-065-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-065-accent:light-dark(oklch(0.52 0.16 265),oklch(0.72 0.14 265));
--vibeui-dashboard-065-accent-line:light-dark(oklch(0.78 0.08 265),oklch(0.55 0.1 265));
--vibeui-dashboard-065-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.04 265));
--vibeui-dashboard-065-on-accent-muted:light-dark(oklch(0.92 0 265),oklch(0.32 0.06 265));
--vibeui-dashboard-065-on-accent-chip:light-dark(oklch(0.6 0.14 265),oklch(0.62 0.12 265));
--vibeui-dashboard-065-on-accent-line:light-dark(oklch(0.72 0.11 265),oklch(0.5 0.1 265));
--vibeui-dashboard-065-soft:light-dark(oklch(0.965 0 265),oklch(0.3 0.035 265));
--vibeui-dashboard-065-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-065-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-065"]{color-scheme:dark}
[data-vibeui-block="dashboard-065"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-065-bg);
color:var(--vibeui-dashboard-065-fg);
font-family:var(--vibeui-dashboard-065-sans);
border:1px solid var(--vibeui-dashboard-065-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-065"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-065"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.9375rem}
[data-vibeui-block="dashboard-065"] h2{margin:0;font-size:1.25rem;font-weight:750;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-065"] h3{margin:0 0 0.5rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-065-muted)}
[data-vibeui-block="dashboard-065"] [data-part="greeting"]{margin:0.1875rem 0 0;font-size:0.8125rem;color:var(--vibeui-dashboard-065-muted)}
[data-vibeui-block="dashboard-065"] [data-part="actions"]{display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-065"] [data-part="action"]{
display:flex;flex-direction:column;align-items:flex-start;gap:0.1875rem;text-align:left;
appearance:none;cursor:pointer;font:inherit;
padding:0.8125rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-065-card);color:inherit;
border:1px solid var(--vibeui-dashboard-065-border);
transition:border-color 0.15s ease;
}
[data-vibeui-block="dashboard-065"] [data-part="action"]:hover{border-color:var(--vibeui-dashboard-065-accent-line)}
[data-vibeui-block="dashboard-065"] [data-part="action"][data-primary="true"]{
background:var(--vibeui-dashboard-065-accent);color:var(--vibeui-dashboard-065-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-065"] [data-part="action"] b{font-size:0.9375rem;font-weight:750;display:flex;align-items:center;gap:0.4375rem;flex-wrap:wrap}
[data-vibeui-block="dashboard-065"] [data-part="action"] span{font-size:0.75rem;color:var(--vibeui-dashboard-065-muted);line-height:1.4}
[data-vibeui-block="dashboard-065"] [data-part="action"][data-primary="true"] span{color:var(--vibeui-dashboard-065-on-accent-muted)}
[data-vibeui-block="dashboard-065"] kbd{
font-family:var(--vibeui-dashboard-065-mono);font-size:0.625rem;font-weight:650;
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-065-inset);color:var(--vibeui-dashboard-065-muted);
border:1px solid var(--vibeui-dashboard-065-border);
}
[data-vibeui-block="dashboard-065"] [data-part="action"][data-primary="true"] kbd{
background:var(--vibeui-dashboard-065-on-accent-chip);
color:var(--vibeui-dashboard-065-on-accent);border-color:var(--vibeui-dashboard-065-on-accent-line);
}
[data-vibeui-block="dashboard-065"] [data-part="cols"]{display:grid;grid-template-columns:1fr;gap:0.875rem}
[data-vibeui-block="dashboard-065"] [data-part="recent"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="dashboard-065"] [data-part="recent"] a{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;text-decoration:none;color:inherit;
padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-065-card);border:1px solid var(--vibeui-dashboard-065-border);
}
[data-vibeui-block="dashboard-065"] [data-part="recent"] a:hover{background:var(--vibeui-dashboard-065-soft)}
[data-vibeui-block="dashboard-065"] [data-part="recent"] b{font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-065"] [data-part="kind"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;background:var(--vibeui-dashboard-065-soft);
color:var(--vibeui-dashboard-065-muted);
}
[data-vibeui-block="dashboard-065"] [data-part="when"]{margin-left:auto;font-size:0.6875rem;color:var(--vibeui-dashboard-065-muted);white-space:nowrap}
[data-vibeui-block="dashboard-065"] [data-part="today"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.4375rem;
}
[data-vibeui-block="dashboard-065"] [data-part="today"] li{
padding:0.625rem 0.6875rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-065-card);border:1px solid var(--vibeui-dashboard-065-border);
}
[data-vibeui-block="dashboard-065"] [data-part="today"] b{display:block;font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-065"] [data-part="today"] span{display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-065-muted)}
[data-vibeui-block="dashboard-065"] [data-part="today"] em{display:block;font-style:normal;font-size:0.75rem;font-weight:700;margin-top:0.1875rem}
[data-vibeui-block="dashboard-065"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-065-accent);outline-offset:2px;
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-065"] [data-part="actions"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 52rem){
[data-vibeui-block="dashboard-065"] [data-part="actions"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="dashboard-065"] [data-part="cols"]{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-065"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Dashboard065Action[] = [
  {
    label: "Новая заявка",
    hint: "Откроет форму с подставленным клиентом из последнего письма.",
    hotkey: "N",
    primary: true,
  },
  {
    label: "Найти клиента",
    hint: "Поиск по названию, ИНН и телефону сразу во всех разделах.",
    hotkey: "/",
  },
  {
    label: "Загрузить документ",
    hint: "Файл попадёт в разбор и сам подтянется к нужной заявке.",
    hotkey: "U",
  },
  {
    label: "Собрать отчёт",
    hint: "Выгрузка за период в XLSX, придёт письмом за пару минут.",
    hotkey: "R",
  },
]

const DEFAULT_RECENT: Dashboard065Recent[] = [
  {
    label: "ЗК-4821 · Поставка стеллажей",
    kind: "Заявка",
    when: "вы смотрели 12 минут назад",
  },
  {
    label: "ООО «Северный лес»",
    kind: "Клиент",
    when: "вчера, 18:40",
  },
  {
    label: "Выручка по филиалам, июнь",
    kind: "Отчёт",
    when: "вчера, 11:05",
  },
  {
    label: "Договор № 118-СП от 03.06",
    kind: "Документ",
    when: "9 июня",
  },
  {
    label: "Крупные сделки",
    kind: "Представление",
    when: "9 июня",
  },
]

const DEFAULT_TODAY: Dashboard065Today[] = [
  { label: "заявок на вас", value: "18", note: "три из них горят сегодня" },
  { label: "ждут ответа клиента", value: "7", note: "дольше всех — 4 дня" },
  { label: "писем без разбора", value: "12", note: "последнее 20 минут назад" },
  { label: "документов на подпись", value: "3", note: "все на вашем шаге" },
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
 * Главная приложения с быстрыми действиями: крупные кнопки с подписью
 * последствия и горячей клавишей, возврат к недавним объектам и сводка дня.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard065({
  title = "Доброе утро, Ирина",
  greeting = "Пятница, 14 июня. Вчера вы закрыли 6 заявок — это лучший результат недели в отделе.",
  actions = DEFAULT_ACTIONS,
  recent = DEFAULT_RECENT,
  today = DEFAULT_TODAY,
  recentTitle = "Продолжить работу",
  todayTitle = "Сводка дня",
  accent,
  background = "",
  className,
  style,
}: Dashboard065Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-065-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-065-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-065" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-065"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="greeting">{greeting}</p>
          </div>

          <div data-part="actions">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                data-part="action"
                data-primary={action.primary}
              >
                <b>
                  {action.label}
                  <kbd>{action.hotkey}</kbd>
                </b>
                <span>{action.hint}</span>
              </button>
            ))}
          </div>

          <div data-part="cols">
            <div>
              <h3>{recentTitle}</h3>
              <ul data-part="recent">
                {recent.map((entry) => (
                  <li key={entry.label}>
                    <a href="#dashboard-065">
                      <b>{entry.label}</b>
                      <span data-part="kind">{entry.kind}</span>
                      <span data-part="when">{entry.when}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>{todayTitle}</h3>
              <ul data-part="today">
                {today.map((entry) => (
                  <li key={entry.label}>
                    <b>{entry.value}</b>
                    <em>{entry.label}</em>
                    <span>{entry.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
