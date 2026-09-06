import type { CSSProperties } from "react"

export type Dashboard018Notice = {
  title: string
  text: string
  time: string
  kind?: "mention" | "system" | "billing"
  unread?: boolean
  action?: string
}

export type Dashboard018Day = {
  day: string
  notices: Dashboard018Notice[]
}

export type Dashboard018Props = {
  title?: string
  tabs?: string[]
  activeTab?: string
  days?: Dashboard018Day[]
  readAllLabel?: string
  /** Шаблон счётчика непрочитанного: {count}. */
  unreadText?: string
  /** Слова типов: компонент несёт русские, проект подставляет свои. */
  kindText?: Record<string, string>
  /** Подпись списка для скринридера. */
  listLabel?: string
  accent?: string
  /** Подложка карточки; пусто — цвет из палитры блока. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: почтовый ящик уведомлений, где непрочитанное помечено полосой
// и точкой, а не только жирным шрифтом: жирный теряется, когда непрочитанных
// половина списка. Группировка по дням даёт времени смысл, а тип уведомления
// подписан словом — иконка без подписи одинаково читается как «оплата» и как
// «система». Кнопка действия живёт внутри строки: возвращаться к списку,
// чтобы найти нужную запись второй раз, никто не хочет.
const STYLES = `
:where([data-vibeui-block="dashboard-018"]){
--vibeui-dashboard-018-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-dashboard-018-fresh:light-dark(oklch(0.975 0 262),oklch(0.28 0 262));
--vibeui-dashboard-018-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-018-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-dashboard-018-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-018-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.15 39.8));
--vibeui-dashboard-018-billing:light-dark(oklch(0.6 0.15 39.8),oklch(0.79 0.13 39.8));
--vibeui-dashboard-018-system:light-dark(oklch(0.6 0 265),oklch(0.72 0 265));
--vibeui-dashboard-018-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-018"]{color-scheme:dark}
[data-vibeui-block="dashboard-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-018-bg);
color:var(--vibeui-dashboard-018-fg);
font-family:var(--vibeui-dashboard-018-sans);
border:1px solid var(--vibeui-dashboard-018-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-018"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-018"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;padding:1rem 1.125rem 0.75rem;
}
[data-vibeui-block="dashboard-018"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-018"] [data-part="badge"]{
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
padding:0.0625rem 0.4375rem;border-radius:9999px;
background:var(--vibeui-dashboard-018-accent);color:var(--vibeui-dashboard-018-on-accent);
}
[data-vibeui-block="dashboard-018"] [data-part="readall"]{
appearance:none;border:0;background:none;cursor:pointer;margin-left:auto;
font:inherit;font-size:0.75rem;font-weight:650;color:var(--vibeui-dashboard-018-accent);
padding:0.25rem;border-radius:0.375rem;
}
[data-vibeui-block="dashboard-018"] [data-part="tabs"]{
display:flex;gap:0.25rem;margin:0;padding:0 1.125rem;list-style:none;
overflow-x:auto;border-bottom:1px solid var(--vibeui-dashboard-018-border);
}
[data-vibeui-block="dashboard-018"] [data-part="tabs"] a{
display:block;padding:0.4375rem 0.625rem;white-space:nowrap;
font-size:0.75rem;font-weight:600;text-decoration:none;
color:var(--vibeui-dashboard-018-muted);
border-bottom:2px solid transparent;margin-bottom:-1px;
}
[data-vibeui-block="dashboard-018"] [data-part="tabs"] a[aria-current="page"]{
color:var(--vibeui-dashboard-018-fg);border-bottom-color:var(--vibeui-dashboard-018-accent);
}
[data-vibeui-block="dashboard-018"] [data-part="day"]{
margin:0;padding:0.4375rem 1.125rem;
background:var(--vibeui-dashboard-018-bg);
border-bottom:1px solid var(--vibeui-dashboard-018-border);
position:sticky;top:0;z-index:1;
font-size:0.6875rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-018-muted);
}
[data-vibeui-block="dashboard-018"] [data-part="list"]{max-height:24rem;overflow-y:auto;overscroll-behavior:contain}
[data-vibeui-block="dashboard-018"] ul{list-style:none;margin:0;padding:0}
[data-vibeui-block="dashboard-018"] [data-part="notice"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.625rem;
padding:0.75rem 1.125rem;border-bottom:1px solid var(--vibeui-dashboard-018-border);
border-left:3px solid transparent;
}
/* Непрочитанное несёт полосу, точку и подложку — жирный шрифт один не тянет. */
[data-vibeui-block="dashboard-018"] [data-unread="true"]{
background:var(--vibeui-dashboard-018-fresh);
border-left-color:var(--vibeui-dashboard-018-accent);
}
[data-vibeui-block="dashboard-018"] [data-part="dot"]{
grid-row:span 2;align-self:start;margin-top:0.3125rem;
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-018-accent);
}
[data-vibeui-block="dashboard-018"] [data-unread="false"] [data-part="dot"]{
background:none;box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-018-border);
}
[data-vibeui-block="dashboard-018"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem;
}
[data-vibeui-block="dashboard-018"] [data-part="subject"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="dashboard-018"] [data-part="kind"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
padding:0.0625rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-dashboard-018-system);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-018-border);
}
[data-vibeui-block="dashboard-018"] [data-kind="mention"] [data-part="kind"]{color:var(--vibeui-dashboard-018-accent)}
[data-vibeui-block="dashboard-018"] [data-kind="billing"] [data-part="kind"]{color:var(--vibeui-dashboard-018-billing)}
[data-vibeui-block="dashboard-018"] [data-part="time"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-dashboard-018-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-018"] [data-part="text"]{
margin:0.125rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-dashboard-018-muted);
}
[data-vibeui-block="dashboard-018"] [data-part="action"]{
justify-self:start;margin-top:0.4375rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:650;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-018-border);
background:var(--vibeui-dashboard-018-bg);color:inherit;
}
[data-vibeui-block="dashboard-018"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-018-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-018"] [data-part="notice"]{padding-inline:1.375rem}
[data-vibeui-block="dashboard-018"] [data-part="day"]{padding-inline:1.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS: Dashboard018Day[] = [
  {
    day: "Сегодня",
    notices: [
      {
        title: "Анна упомянула вас",
        text: "«Проверь, пожалуйста, промпт установки для dashboard-016 — там осталась старая команда».",
        time: "11:04",
        kind: "mention",
        unread: true,
        action: "Открыть обсуждение",
      },
      {
        title: "Счёт за март выставлен",
        text: "24 000 ₽, оплатить до 20 марта. Автосписание включено.",
        time: "09:20",
        kind: "billing",
        unread: true,
        action: "Посмотреть счёт",
      },
    ],
  },
  {
    day: "13 марта",
    notices: [
      {
        title: "Сборка каталога прошла",
        text: "Опубликовано 14 блоков, ошибок валидации нет.",
        time: "22:41",
        kind: "system",
      },
      {
        title: "Ким принял приглашение",
        text: "Роль «редактор», доступ к проекту «Витрина мебели».",
        time: "18:12",
        kind: "system",
      },
    ],
  },
]

const KIND_WORD: Record<string, string> = {
  mention: "упоминание",
  system: "система",
  billing: "оплата",
}

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
 * Уведомления по дням: непрочитанное помечено полосой, точкой и подложкой,
 * тип подписан словом. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard018({
  title = "Уведомления",
  tabs = ["Все", "Упоминания", "Система", "Оплата"],
  activeTab = "Все",
  days = DEFAULT_DAYS,
  readAllLabel = "Отметить все прочитанными",
  unreadText = "{count} новых",
  kindText = KIND_WORD,
  listLabel = "Список уведомлений",
  accent,
  background = "",
  className,
  style,
}: Dashboard018Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const unread = days
    .flatMap((group) => group.notices)
    .filter((notice) => notice.unread).length

  return (
    <>
      <style href="vibeui-dashboard-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-018"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <span data-part="badge">
            {unreadText.replace("{count}", String(unread))}
          </span>
          <button type="button" data-part="readall">
            {readAllLabel}
          </button>
        </header>

        <ul data-part="tabs">
          {tabs.map((tab) => (
            <li key={tab}>
              <a
                href="#dashboard-018"
                aria-current={tab === activeTab ? "page" : undefined}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>

        <div data-part="list" tabIndex={0} role="group" aria-label={listLabel}>
          {days.map((group) => (
            <section key={group.day} aria-label={group.day}>
              <p data-part="day">{group.day}</p>
              <ul>
                {group.notices.map((notice) => (
                  <li
                    key={notice.title}
                    data-part="notice"
                    data-kind={notice.kind ?? "system"}
                    data-unread={notice.unread ? "true" : "false"}
                  >
                    <span data-part="dot" aria-hidden="true" />
                    <div data-part="row">
                      <p data-part="subject">{notice.title}</p>
                      <span data-part="kind">
                        {kindText[notice.kind ?? "system"] ??
                          KIND_WORD[notice.kind ?? "system"]}
                      </span>
                      <span data-part="time">{notice.time}</span>
                    </div>
                    <p data-part="text">{notice.text}</p>
                    {notice.action ? (
                      <button type="button" data-part="action">
                        {notice.action}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
