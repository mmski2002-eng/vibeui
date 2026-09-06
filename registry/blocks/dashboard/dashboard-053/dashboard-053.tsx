import type { CSSProperties } from "react"

export type Dashboard053Topic = {
  label: string
  hint: string
  on: boolean
}

export type Dashboard053Channel = {
  name: string
  address: string
  state: "Подключён" | "Не подключён" | "Ошибка"
  urgentOnly?: boolean
  topics: Dashboard053Topic[]
}

export type Dashboard053Props = {
  title?: string
  hint?: string
  channels?: Dashboard053Channel[]
  quietFrom?: string
  quietTo?: string
  quietOn?: boolean
  quietTitle?: string
  saveLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подписи состояний канала: ключ — значение state. */
  stateText?: Record<string, string>
  /** Сводка в закрытой карточке: {address}, {on} и {total}. */
  summaryText?: string
  /** Подпись поля начала тихих часов. */
  fromLabel?: string
  /** Подпись поля конца тихих часов. */
  toLabel?: string
  /** Подпись переключателя тихих часов для скринридера. */
  quietSwitchLabel?: string
  /** Пояснение под тихими часами. */
  quietNote?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: настройка уведомлений по каналам, а не матрицей «событие ×
// канал». Матрица честнее, но её невозможно читать на телефоне, а решение
// принимают по каналу: «в телеграм — только срочное». Каждый канал — карточка
// с адресом, состоянием подключения и своим набором событий в <details>:
// закрытая карточка показывает сводку словами, открытая — переключатели.
// Тихие часы вынесены отдельно и объяснены текстом: правило про исключение
// для срочных иначе выглядит как ошибка.
const STYLES = `
:where([data-vibeui-block="dashboard-053"]){
--vibeui-dashboard-053-bg:transparent;
/* Карточки и поля ввода: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-053-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 160));
--vibeui-dashboard-053-inset:light-dark(oklch(0.97 0.004 160),oklch(0.22 0.012 160));
--vibeui-dashboard-053-fg:light-dark(oklch(0.22 0.014 160),oklch(0.94 0.005 160));
--vibeui-dashboard-053-muted:light-dark(oklch(0.53 0.014 160),oklch(0.72 0.012 160));
--vibeui-dashboard-053-border:light-dark(oklch(0.91 0.006 160),oklch(0.36 0.012 160));
--vibeui-dashboard-053-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.76 0.12 39.8));
--vibeui-dashboard-053-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-053-soft:light-dark(oklch(0.95 0.025 160),oklch(0.32 0.045 39.8));
--vibeui-dashboard-053-bad:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-dashboard-053-bad-line:light-dark(oklch(0.8 0.09 25),oklch(0.45 0.1 25));
--vibeui-dashboard-053-bad-soft:light-dark(oklch(0.96 0.022 25),oklch(0.3 0.05 25));
--vibeui-dashboard-053-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-053"]{color-scheme:dark}
[data-vibeui-block="dashboard-053"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-053-bg);
color:var(--vibeui-dashboard-053-fg);
font-family:var(--vibeui-dashboard-053-sans);
border:1px solid var(--vibeui-dashboard-053-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-053"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-053"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-053"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-053"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-053"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-053-muted)}
[data-vibeui-block="dashboard-053"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-053-accent);color:var(--vibeui-dashboard-053-on-accent);
}
[data-vibeui-block="dashboard-053"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="dashboard-053"] details{
background:var(--vibeui-dashboard-053-card);
border:1px solid var(--vibeui-dashboard-053-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-053"] details[data-state="Ошибка"]{
border-color:var(--vibeui-dashboard-053-bad-line);
}
[data-vibeui-block="dashboard-053"] summary{
display:grid;grid-template-columns:auto 1fr auto;gap:0.125rem 0.625rem;align-items:center;
cursor:pointer;list-style:none;padding:0.75rem 0.875rem;
}
[data-vibeui-block="dashboard-053"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-053"] [data-part="mark"]{
grid-row:1/3;width:2rem;height:2rem;border-radius:0.625rem;display:grid;place-items:center;
font-size:0.75rem;font-weight:800;
background:var(--vibeui-dashboard-053-soft);color:var(--vibeui-dashboard-053-accent);
}
[data-vibeui-block="dashboard-053"] [data-part="name"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem;font-size:0.875rem;font-weight:750;
}
[data-vibeui-block="dashboard-053"] [data-part="state"]{
font-size:0.625rem;font-weight:750;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
color:var(--vibeui-dashboard-053-accent);background:var(--vibeui-dashboard-053-soft);
}
[data-vibeui-block="dashboard-053"] details[data-state="Не подключён"] [data-part="state"]{
color:var(--vibeui-dashboard-053-muted);background:var(--vibeui-dashboard-053-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-053-border);
}
[data-vibeui-block="dashboard-053"] details[data-state="Ошибка"] [data-part="state"]{
color:var(--vibeui-dashboard-053-bad);
background:var(--vibeui-dashboard-053-bad-soft);
}
[data-vibeui-block="dashboard-053"] [data-part="sum"]{
grid-column:2;font-size:0.6875rem;color:var(--vibeui-dashboard-053-muted);
}
[data-vibeui-block="dashboard-053"] [data-part="chev"]{
grid-column:3;grid-row:1/3;width:0.4375rem;height:0.4375rem;justify-self:end;
border-right:1.5px solid var(--vibeui-dashboard-053-muted);
border-bottom:1.5px solid var(--vibeui-dashboard-053-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="dashboard-053"] details[open] [data-part="chev"]{transform:rotate(-135deg)}
[data-vibeui-block="dashboard-053"] [data-part="topics"]{
padding:0 0.875rem 0.875rem 3.5rem;display:grid;gap:0.4375rem;
}
[data-vibeui-block="dashboard-053"] [data-part="topic"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.5rem;align-items:start;
padding:0.4375rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-053-inset);
}
[data-vibeui-block="dashboard-053"] [data-part="topic"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-053-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-053"] [data-part="topic"] input{
grid-row:1/3;margin:0.125rem 0 0;width:0.9375rem;height:0.9375rem;
accent-color:var(--vibeui-dashboard-053-accent);
}
[data-vibeui-block="dashboard-053"] [data-part="tname"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="dashboard-053"] [data-part="thint"]{
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-dashboard-053-muted);
}
[data-vibeui-block="dashboard-053"] [data-part="quiet"]{
display:grid;gap:0.5rem;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-053-card);
border:1px solid var(--vibeui-dashboard-053-border);
}
[data-vibeui-block="dashboard-053"] h3{margin:0;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-053"] [data-part="hours"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-053"] input[type="time"]{
font:inherit;font-size:0.8125rem;color:inherit;
padding:0.3125rem 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-053-border);background:var(--vibeui-dashboard-053-inset);
}
[data-vibeui-block="dashboard-053"] [data-part="switch"]{
position:relative;width:2.125rem;height:1.25rem;flex:none;margin-left:auto;
border-radius:9999px;background:var(--vibeui-dashboard-053-border);
}
[data-vibeui-block="dashboard-053"] [data-part="switch"] input{
position:absolute;inset:0;margin:0;opacity:0;cursor:pointer;width:100%;height:100%;
}
[data-vibeui-block="dashboard-053"] [data-part="knob"]{
position:absolute;top:0.1875rem;left:0.1875rem;width:0.875rem;height:0.875rem;border-radius:50%;
background:var(--vibeui-dashboard-053-card);transition:left .16s ease;
}
[data-vibeui-block="dashboard-053"] [data-part="switch"]:has(input:checked){background:var(--vibeui-dashboard-053-accent)}
[data-vibeui-block="dashboard-053"] [data-part="switch"]:has(input:checked) [data-part="knob"]{left:1.0625rem}
[data-vibeui-block="dashboard-053"] [data-part="switch"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-053-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-053"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-dashboard-053-muted);
}
[data-vibeui-block="dashboard-053"] :is(a,button,summary,input):focus-visible{
outline:2px solid var(--vibeui-dashboard-053-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-053"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="dashboard-053"] [data-part="topics"]{padding-left:3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-053"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHANNELS: Dashboard053Channel[] = [
  {
    name: "Почта",
    address: "anna@kontur.ru",
    state: "Подключён",
    topics: [
      {
        label: "Новые заявки",
        hint: "письмо на каждую заявку, назначенную на вас",
        on: true,
      },
      {
        label: "Сводка за день",
        hint: "одно письмо в 19:00 с итогами дня",
        on: true,
      },
      {
        label: "Упоминания в комментариях",
        hint: "когда вас упомянули через собаку",
        on: false,
      },
    ],
  },
  {
    name: "Телеграм",
    address: "@anna_rebrova",
    state: "Подключён",
    urgentOnly: true,
    topics: [
      {
        label: "Срочные инциденты",
        hint: "только приоритет P1 и падение сервисов",
        on: true,
      },
      {
        label: "Просроченные заявки",
        hint: "когда срок ответа вышел",
        on: true,
      },
      {
        label: "Новые заявки",
        hint: "каждая заявка в очереди — обычно это слишком часто",
        on: false,
      },
    ],
  },
  {
    name: "Push в браузере",
    address: "Chrome на рабочем ноутбуке",
    state: "Не подключён",
    topics: [
      {
        label: "Ответ клиента",
        hint: "когда клиент написал в открытую заявку",
        on: false,
      },
      {
        label: "Готовые выгрузки",
        hint: "когда фоновое задание закончилось",
        on: false,
      },
    ],
  },
  {
    name: "Вебхук команды",
    address: "https://hooks.kontur.ru/ops/notify",
    state: "Ошибка",
    topics: [
      {
        label: "Инциденты и дежурства",
        hint: "передача смены и эскалации",
        on: true,
      },
      {
        label: "Изменения прав",
        hint: "кто и кому изменил роль",
        on: true,
      },
    ],
  },
]

const STATE_LABEL: Record<string, string> = {
  Подключён: "Подключён",
  "Не подключён": "Не подключён",
  Ошибка: "Ошибка",
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
 * Экран уведомлений: каналы карточками с адресом, состоянием подключения и
 * набором событий внутри details, плюс тихие часы. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard053({
  title = "Уведомления",
  hint = "настройка отдельно для каждого канала",
  channels = DEFAULT_CHANNELS,
  quietFrom = "22:00",
  quietTo = "08:00",
  quietOn = true,
  quietTitle = "Тихие часы",
  saveLabel = "Сохранить настройки",
  accent,
  background = "",
  stateText = STATE_LABEL,
  summaryText = "{address} · включено {on} из {total}",
  fromLabel = "с",
  toLabel = "до",
  quietSwitchLabel = "Включить тихие часы",
  quietNote = "В тихие часы уведомления копятся и приходят одной сводкой утром. Исключение — срочные инциденты приоритета P1: они приходят всегда, иначе тихие часы превращаются в отключённые уведомления.",
  className,
  style,
}: Dashboard053Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-053-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-053-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-053" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-053"
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

          <div data-part="grid">
            {channels.map((channel) => {
              const on = channel.topics.filter((topic) => topic.on).length

              return (
                <details
                  key={channel.name}
                  data-state={channel.state}
                  open={channel.state === "Подключён" && channel.urgentOnly}
                >
                  <summary>
                    <span data-part="mark" aria-hidden="true">
                      {channel.name.charAt(0)}
                    </span>
                    <span data-part="name">
                      {channel.name}
                      <span data-part="state">
                        {stateText[channel.state] ?? channel.state}
                      </span>
                    </span>
                    <span data-part="sum">
                      {summaryText
                        .replace("{address}", channel.address)
                        .replace("{on}", String(on))
                        .replace("{total}", String(channel.topics.length))}
                    </span>
                    <span data-part="chev" aria-hidden="true" />
                  </summary>

                  <div data-part="topics">
                    {channel.topics.map((topic) => (
                      <label key={topic.label} data-part="topic">
                        <input
                          type="checkbox"
                          defaultChecked={topic.on}
                          disabled={channel.state === "Не подключён"}
                        />
                        <span data-part="tname">{topic.label}</span>
                        <span data-part="thint">{topic.hint}</span>
                      </label>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>

          <div data-part="quiet">
            <h3>{quietTitle}</h3>
            <div data-part="hours">
              <label htmlFor="dashboard-053-from">{fromLabel}</label>
              <input
                id="dashboard-053-from"
                type="time"
                defaultValue={quietFrom}
              />
              <label htmlFor="dashboard-053-to">{toLabel}</label>
              <input id="dashboard-053-to" type="time" defaultValue={quietTo} />
              <span data-part="switch">
                <input
                  type="checkbox"
                  defaultChecked={quietOn}
                  aria-label={quietSwitchLabel}
                />
                <span data-part="knob" aria-hidden="true" />
              </span>
            </div>
            <p data-part="note">{quietNote}</p>
          </div>
        </div>
      </section>
    </>
  )
}
