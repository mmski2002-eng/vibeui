import type { CSSProperties } from "react"

export type Dashboard077Event = {
  key: string
  label: string
  perDay: number
  on: boolean
}

export type Dashboard077Group = {
  name: string
  hint: string
  events: Dashboard077Event[]
  open?: boolean
}

export type Dashboard077Props = {
  title?: string
  endpoint?: string
  format?: string
  groups?: Dashboard077Group[]
  saveLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Прочие варианты формата тела, кроме выбранного. */
  formats?: string[]
  /** Подпись поля адреса. */
  endpointLabel?: string
  /** Подпись поля формата. */
  formatLabel?: string
  /** Счётчик группы: {on} и {total}. */
  countText?: string
  /** Частота события: {perDay}. */
  freqText?: string
  /** Сноска у кнопки: {chosen}. */
  noteText?: string
  /** Локаль форматирования чисел. */
  numberLocale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подписка на события — это выбор из полусотни ключей, и плоский
// список чекбоксов тут не работает. Поэтому события собраны в группы на
// вложенных details, а в заголовке группы стоит счётчик «выбрано 3 из 7»:
// свёрнутая группа обязана отвечать, есть ли внутри что-то включённое.
// Рядом с каждым событием — частота в сутки: подписка на «обновление записи»
// в системе с миллионом правок ломает приёмник, и узнать об этом лучше здесь.
// Адрес приёмника и формат стоят наверху: они общие для всех подписок,
// и повторять их у каждого события бессмысленно.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-077"]){
--vibeui-dashboard-077-bg:transparent;
/* Панель группы и поля ввода: подложка самого блока прозрачна. */
--vibeui-dashboard-077-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 210));
--vibeui-dashboard-077-inset:light-dark(oklch(0.985 0.003 210),oklch(0.22 0.012 210));
--vibeui-dashboard-077-fg:light-dark(oklch(0.21 0.014 210),oklch(0.94 0.005 210));
--vibeui-dashboard-077-muted:light-dark(oklch(0.54 0.014 210),oklch(0.72 0.012 210));
--vibeui-dashboard-077-border:light-dark(oklch(0.91 0.006 210),oklch(0.36 0.012 210));
--vibeui-dashboard-077-accent:light-dark(oklch(0.5 0.14 220),oklch(0.74 0.13 220));
--vibeui-dashboard-077-accent-line:light-dark(oklch(0.83 0.06 220),oklch(0.5 0.09 220));
--vibeui-dashboard-077-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 220));
--vibeui-dashboard-077-soft:light-dark(oklch(0.965 0.02 220),oklch(0.3 0.035 220));
--vibeui-dashboard-077-loud:light-dark(oklch(0.55 0.12 72),oklch(0.84 0.13 72));
--vibeui-dashboard-077-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-077-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-077"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-077-bg);
color:var(--vibeui-dashboard-077-fg);
font-family:var(--vibeui-dashboard-077-sans);
border:1px solid var(--vibeui-dashboard-077-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-077"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-077"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-077"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-077"] [data-part="target"]{
display:grid;grid-template-columns:1fr;gap:0.4375rem;padding:0.75rem 0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-077-card);border:1px solid var(--vibeui-dashboard-077-border);
}
[data-vibeui-block="dashboard-077"] [data-part="target"] label{display:flex;flex-direction:column;gap:0.1875rem;font-size:0.6875rem;font-weight:700;color:var(--vibeui-dashboard-077-muted)}
[data-vibeui-block="dashboard-077"] :is(input[type="url"],select){
font:inherit;font-size:0.8125rem;padding:0.4375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-077-inset);color:inherit;
border:1px solid var(--vibeui-dashboard-077-border);width:100%;
}
[data-vibeui-block="dashboard-077"] input[type="url"]{font-family:var(--vibeui-dashboard-077-mono);font-size:0.75rem}
[data-vibeui-block="dashboard-077"] [data-part="groups"]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="dashboard-077"] details{
background:var(--vibeui-dashboard-077-card);border:1px solid var(--vibeui-dashboard-077-border);
border-radius:0.8125rem;overflow:hidden;
}
[data-vibeui-block="dashboard-077"] summary{
list-style:none;cursor:pointer;padding:0.625rem 0.8125rem;
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;
}
[data-vibeui-block="dashboard-077"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-077"] summary b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-077"] summary span{font-size:0.6875rem;color:var(--vibeui-dashboard-077-muted)}
[data-vibeui-block="dashboard-077"] [data-part="count"]{
margin-left:auto;font-size:0.6875rem;font-weight:750;white-space:nowrap;
padding:0.0625rem 0.375rem;border-radius:0.3125rem;background:var(--vibeui-dashboard-077-soft);
color:color-mix(in oklab,var(--vibeui-dashboard-077-accent) 85%,light-dark(black,white));
}
[data-vibeui-block="dashboard-077"] [data-part="events"]{
list-style:none;margin:0;padding:0 0.8125rem 0.75rem;display:grid;grid-template-columns:1fr;gap:0.25rem;
}
[data-vibeui-block="dashboard-077"] [data-part="event"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.375rem 0.5rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-077-inset);border:1px solid transparent;
}
[data-vibeui-block="dashboard-077"] [data-part="event"]:has(input:checked){
border-color:var(--vibeui-dashboard-077-accent-line);
background:var(--vibeui-dashboard-077-soft);
}
[data-vibeui-block="dashboard-077"] input[type="checkbox"]{margin:0;width:0.9375rem;height:0.9375rem;accent-color:var(--vibeui-dashboard-077-accent)}
[data-vibeui-block="dashboard-077"] [data-part="key"]{
font-family:var(--vibeui-dashboard-077-mono);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="dashboard-077"] [data-part="label"]{font-size:0.6875rem;color:var(--vibeui-dashboard-077-muted);min-width:0}
[data-vibeui-block="dashboard-077"] [data-part="freq"]{
margin-left:auto;font-size:0.625rem;font-variant-numeric:tabular-nums;white-space:nowrap;
color:var(--vibeui-dashboard-077-muted);
}
[data-vibeui-block="dashboard-077"] [data-part="freq"][data-loud="true"]{
color:var(--vibeui-dashboard-077-loud);font-weight:700;
}
[data-vibeui-block="dashboard-077"] [data-part="foot"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-077"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-077-accent);color:var(--vibeui-dashboard-077-on-accent);
}
[data-vibeui-block="dashboard-077"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-077-muted);max-width:56ch}
[data-vibeui-block="dashboard-077"] :is(a,button,input,select,summary,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-077-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-077"] [data-part="target"]{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}
[data-vibeui-block="dashboard-077"] [data-part="events"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_GROUPS: Dashboard077Group[] = [
  {
    name: "Заявки",
    hint: "события по карточкам заявок",
    open: true,
    events: [
      { key: "deal.created", label: "заявка создана", perDay: 420, on: true },
      {
        key: "deal.stage_changed",
        label: "сменился этап",
        perDay: 1180,
        on: true,
      },
      {
        key: "deal.updated",
        label: "любое изменение полей",
        perDay: 24800,
        on: false,
      },
      { key: "deal.closed", label: "заявка закрыта", perDay: 260, on: true },
      { key: "deal.deleted", label: "заявка удалена", perDay: 9, on: false },
    ],
  },
  {
    name: "Клиенты",
    hint: "события по карточкам клиентов",
    events: [
      {
        key: "customer.created",
        label: "клиент создан",
        perDay: 180,
        on: true,
      },
      {
        key: "customer.merged",
        label: "клиенты объединены",
        perDay: 14,
        on: false,
      },
      {
        key: "customer.updated",
        label: "любое изменение полей",
        perDay: 8200,
        on: false,
      },
    ],
  },
  {
    name: "Оплаты",
    hint: "события биллинга",
    events: [
      {
        key: "payment.succeeded",
        label: "оплата прошла",
        perDay: 96,
        on: true,
      },
      {
        key: "payment.failed",
        label: "оплата не прошла",
        perDay: 11,
        on: true,
      },
      {
        key: "subscription.canceled",
        label: "подписка отменена",
        perDay: 4,
        on: true,
      },
    ],
  },
  {
    name: "Пользователи",
    hint: "вход, приглашения, права",
    events: [
      {
        key: "user.invited",
        label: "приглашение отправлено",
        perDay: 52,
        on: false,
      },
      {
        key: "user.joined",
        label: "приглашение принято",
        perDay: 38,
        on: false,
      },
      { key: "user.role_changed", label: "изменена роль", perDay: 6, on: true },
    ],
  },
]

const DEFAULT_FORMATS: string[] = ["JSON, версия 2023-01", "form-urlencoded"]

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
 * Экран подписок на события: события собраны в группы на details со счётчиком
 * выбранного, у каждого события подписана частота в сутки, адрес приёмника и
 * формат вынесены наверх. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard077({
  title = "Подписки на события",
  endpoint = "https://hooks.severles.ru/vibeui/events",
  format = "JSON, версия 2024-06",
  groups = DEFAULT_GROUPS,
  saveLabel = "Сохранить подписки",
  accent,
  background = "",
  formats = DEFAULT_FORMATS,
  endpointLabel = "Адрес приёмника",
  formatLabel = "Формат тела",
  countText = "выбрано {on} из {total}",
  freqText = "~{perDay} в сутки",
  noteText = "Выбрано событий: {chosen}. Приёмник должен отвечать за 5 секунд; при трёх подряд неудачах подписка ставится на паузу и вы получите письмо.",
  numberLocale = "ru-RU",
  className,
  style,
}: Dashboard077Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-077-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-077-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const chosen = groups.reduce(
    (sum, group) => sum + group.events.filter((event) => event.on).length,
    0,
  )

  return (
    <>
      <style href="vibeui-dashboard-077" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-077"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <div data-part="target">
            <label>
              {endpointLabel}
              <input type="url" defaultValue={endpoint} />
            </label>
            <label>
              {formatLabel}
              <select defaultValue={format}>
                <option>{format}</option>
                {formats.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div data-part="groups">
            {groups.map((group) => {
              const on = group.events.filter((event) => event.on).length

              return (
                <details key={group.name} open={group.open}>
                  <summary>
                    <b>{group.name}</b>
                    <span>{group.hint}</span>
                    <span data-part="count">
                      {countText
                        .replace("{on}", String(on))
                        .replace("{total}", String(group.events.length))}
                    </span>
                  </summary>
                  <ul data-part="events">
                    {group.events.map((event) => (
                      <li key={event.key}>
                        <label data-part="event">
                          <input type="checkbox" defaultChecked={event.on} />
                          <span data-part="key">{event.key}</span>
                          <span data-part="label">{event.label}</span>
                          <span
                            data-part="freq"
                            data-loud={event.perDay > 5000}
                          >
                            {freqText.replace(
                              "{perDay}",
                              event.perDay.toLocaleString(numberLocale),
                            )}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              )
            })}
          </div>

          <div data-part="foot">
            <button type="button" data-part="save">
              {saveLabel}
            </button>
            <p data-part="note">
              {noteText.replace("{chosen}", String(chosen))}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
