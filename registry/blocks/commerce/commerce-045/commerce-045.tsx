import type { CSSProperties } from "react"

export type Commerce045Address = {
  id: string
  label: string
  lines: string
  recipient: string
  phone: string
  main?: boolean
  note?: string
}

export type Commerce045Stat = {
  label: string
  value: string
}

export type Commerce045Props = {
  name?: string
  email?: string
  phone?: string
  since?: string
  stats?: Commerce045Stat[]
  addressTitle?: string
  addresses?: Commerce045Address[]
  addLabel?: string
  hint?: string
  editLabel?: string
  /** Стаж покупателя: {since} — год. */
  sinceText?: string
  /** Ярлык основного адреса. */
  mainLabel?: string
  /** Действия карточки: ключи edit, makeMain и remove. */
  actionText?: Record<string, string>
  /** Те же действия для читалки: {label} — название адреса. */
  actionAriaText?: Record<string, string>
  /** Подпись блока для читалки: {name} — имя покупателя. */
  profileAriaText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: профиль покупателя, собранный вокруг адресов. Главный адрес
// помечен ярлыком и стоит первым, а не просто подсвечен: в списке из четырёх
// одинаковых карточек человек путается и отправляет заказ на старую квартиру.
// Инициалы вместо аватара — блок не тянет картинку; телефон и почта показаны
// частично, потому что экран профиля часто открывают при других людях.
const STYLES = `
:where([data-vibeui-block="commerce-045"]){
--vibeui-commerce-045-bg:transparent;
--vibeui-commerce-045-fg:light-dark(oklch(0.21 0.014 265),oklch(0.93 0.006 265));
--vibeui-commerce-045-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-commerce-045-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-045-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.009 265));
--vibeui-commerce-045-accent:light-dark(oklch(0.5 0.14 285),oklch(0.74 0.13 285));
--vibeui-commerce-045-onaccent:light-dark(oklch(1 0 0),oklch(0.18 0.02 285));
--vibeui-commerce-045-danger:light-dark(oklch(0.52 0.16 30),oklch(0.74 0.15 30));
--vibeui-commerce-045-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-045"]{color-scheme:dark}
[data-vibeui-block="commerce-045"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-045-bg);
color:var(--vibeui-commerce-045-fg);font-family:var(--vibeui-commerce-045-sans);
}
[data-vibeui-block="commerce-045"] *{box-sizing:border-box}
[data-vibeui-block="commerce-045"] [data-part="shell"]{max-width:58rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-045"] [data-part="head"]{
display:grid;gap:0.875rem;align-items:center;
padding-bottom:1rem;border-bottom:1px solid var(--vibeui-commerce-045-border);
}
@container (min-width: 40rem){
[data-vibeui-block="commerce-045"] [data-part="head"]{grid-template-columns:auto minmax(0,1fr) auto}
}
/* Инициалы вместо аватара: блок остаётся одним файлом без внешних картинок. */
[data-vibeui-block="commerce-045"] [data-part="avatar"]{
width:3.5rem;height:3.5rem;border-radius:9999px;display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-commerce-045-accent) 15%,transparent);
color:var(--vibeui-commerce-045-accent);font-size:1.25rem;font-weight:750;letter-spacing:-0.02em;
}
[data-vibeui-block="commerce-045"] h2{margin:0;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-045"] [data-part="contacts"]{
margin:0.1875rem 0 0;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.8125rem;color:var(--vibeui-commerce-045-muted);
}
[data-vibeui-block="commerce-045"] [data-part="edit"]{
appearance:none;cursor:pointer;height:2.375rem;padding:0 1rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-045-border);background:var(--vibeui-commerce-045-bg);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-045"] [data-part="edit"]:focus-visible{outline:2px solid var(--vibeui-commerce-045-accent);outline-offset:2px}
[data-vibeui-block="commerce-045"] [data-part="stats"]{
margin:0.875rem 0 0;padding:0;display:grid;gap:0.5rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
@container (min-width: 40rem){
[data-vibeui-block="commerce-045"] [data-part="stats"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-045"] [data-part="stat"]{
padding:0.625rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-045-soft);
}
[data-vibeui-block="commerce-045"] [data-part="stat"] dt{font-size:0.6875rem;color:var(--vibeui-commerce-045-muted)}
[data-vibeui-block="commerce-045"] [data-part="stat"] dd{margin:0.125rem 0 0;font-size:1.0625rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-045"] [data-part="bar"]{
margin:1.25rem 0 0.625rem;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:baseline;justify-content:space-between;
}
[data-vibeui-block="commerce-045"] h3{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="commerce-045"] [data-part="add"]{
appearance:none;border:0;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.75rem;
background:var(--vibeui-commerce-045-accent);color:var(--vibeui-commerce-045-onaccent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-045"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-commerce-045-accent);outline-offset:2px}
[data-vibeui-block="commerce-045"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem}
@container (min-width: 40rem){
[data-vibeui-block="commerce-045"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-045"] [data-part="card"]{
position:relative;padding:0.875rem;border-radius:1.125rem;
border:1px solid var(--vibeui-commerce-045-border);display:flex;flex-direction:column;
}
[data-vibeui-block="commerce-045"] [data-part="card"][data-main="yes"]{
border-color:var(--vibeui-commerce-045-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-045-accent);
}
[data-vibeui-block="commerce-045"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-bottom:0.4375rem}
[data-vibeui-block="commerce-045"] [data-part="label"]{
padding:0.125rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-commerce-045-soft);
font-size:0.6875rem;font-weight:650;
}
/* Главный адрес назван словом: подсветки мало, когда карточки одинаковые. */
[data-vibeui-block="commerce-045"] [data-part="main"]{
padding:0.125rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-commerce-045-accent);color:var(--vibeui-commerce-045-onaccent);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="commerce-045"] [data-part="lines"]{margin:0;font-size:0.875rem;font-weight:600;line-height:1.45}
[data-vibeui-block="commerce-045"] [data-part="who"]{margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-045-muted);line-height:1.5}
[data-vibeui-block="commerce-045"] [data-part="note"]{
margin:0.4375rem 0 0;padding:0.375rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-commerce-045-soft);
font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-045-muted);
}
[data-vibeui-block="commerce-045"] [data-part="actions"]{
margin-top:auto;padding-top:0.625rem;display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="commerce-045"] [data-part="actions"] button{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-045-border);background:var(--vibeui-commerce-045-bg);
color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="commerce-045"] [data-part="actions"] button:focus-visible{outline:2px solid var(--vibeui-commerce-045-accent);outline-offset:2px}
[data-vibeui-block="commerce-045"] [data-part="danger"]{color:var(--vibeui-commerce-045-danger)}
[data-vibeui-block="commerce-045"] [data-part="hint"]{
margin:0.875rem 0 0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-commerce-045-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-045"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: Commerce045Stat[] = [
  { label: "заказов всего", value: "27" },
  { label: "в доставке сейчас", value: "1" },
  { label: "баллов на счету", value: "3 240" },
  { label: "с нами с", value: "2019" },
]

const DEFAULT_ADDRESSES: Commerce045Address[] = [
  {
    id: "a1",
    label: "Дом",
    lines: "Петрозаводск, ул. Кирова, 12, кв. 47",
    recipient: "Анна Смирнова",
    phone: "+7 921 ••• ••-22",
    main: true,
    note: "Домофон 47К, лифта нет, пятый этаж.",
  },
  {
    id: "a2",
    label: "Работа",
    lines: "Петрозаводск, пр. Ленина, 90, офис 314",
    recipient: "Анна Смирнова",
    phone: "+7 921 ••• ••-22",
    note: "Принимают с 10 до 18, вход через ресепшн.",
  },
  {
    id: "a3",
    label: "Родителям",
    lines: "Кондопога, ул. Пролетарская, 5, кв. 3",
    recipient: "Смирнова Елена Петровна",
    phone: "+7 911 ••• ••-08",
  },
]

const DEFAULT_ACTIONS: Record<string, string> = {
  edit: "Изменить",
  makeMain: "Сделать основным",
  remove: "Удалить",
}

const DEFAULT_ACTION_ARIA: Record<string, string> = {
  edit: "Изменить адрес «{label}»",
  makeMain: "Сделать адрес «{label}» основным",
  remove: "Удалить адрес «{label}»",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Профиль покупателя с адресами: главный помечен ярлыком, у каждого — свой получатель.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce045({
  name = "Анна Смирнова",
  email = "a•••@example.com",
  phone = "+7 921 ••• ••-22",
  since = "2019",
  stats = DEFAULT_STATS,
  addressTitle = "Адреса доставки",
  addresses = DEFAULT_ADDRESSES,
  addLabel = "Добавить адрес",
  hint = "Контакты и адреса видны только вам. Курьеру передаём имя, телефон получателя и комментарий — остальное остаётся в профиле.",
  editLabel = "Изменить данные",
  sinceText = "покупает с {since} года",
  mainLabel = "Основной",
  actionText = DEFAULT_ACTIONS,
  actionAriaText = DEFAULT_ACTION_ARIA,
  profileAriaText = "Профиль: {name}",
  accent,
  background = "",
  className,
  style,
}: Commerce045Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-045-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-045-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")

  return (
    <>
      <style href="vibeui-commerce-045" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-045"
        className={className}
        style={palette}
        aria-label={profileAriaText.replace("{name}", name)}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="avatar" aria-hidden="true">
              {initials}
            </span>
            <div>
              <h2>{name}</h2>
              <p data-part="contacts">
                <span>{email}</span>
                <span>{phone}</span>
                <span>{sinceText.replace("{since}", since)}</span>
              </p>
            </div>
            <button type="button" data-part="edit">
              {editLabel}
            </button>
          </div>

          <dl data-part="stats">
            {stats.map((stat) => (
              <div data-part="stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div data-part="bar">
            <h3>{addressTitle}</h3>
            <button type="button" data-part="add">
              {addLabel}
            </button>
          </div>

          <ul>
            {addresses.map((address) => (
              <li
                key={address.id}
                data-part="card"
                data-main={address.main ? "yes" : "no"}
              >
                <div data-part="tags">
                  <span data-part="label">{address.label}</span>
                  {address.main ? (
                    <span data-part="main">{mainLabel}</span>
                  ) : null}
                </div>
                <p data-part="lines">{address.lines}</p>
                <p data-part="who">
                  {address.recipient} · {address.phone}
                </p>
                {address.note ? <p data-part="note">{address.note}</p> : null}
                <div data-part="actions">
                  <button
                    type="button"
                    aria-label={(
                      actionAriaText.edit ?? DEFAULT_ACTION_ARIA.edit
                    ).replace("{label}", address.label)}
                  >
                    {actionText.edit ?? DEFAULT_ACTIONS.edit}
                  </button>
                  {address.main ? null : (
                    <button
                      type="button"
                      aria-label={(
                        actionAriaText.makeMain ?? DEFAULT_ACTION_ARIA.makeMain
                      ).replace("{label}", address.label)}
                    >
                      {actionText.makeMain ?? DEFAULT_ACTIONS.makeMain}
                    </button>
                  )}
                  <button
                    type="button"
                    data-part="danger"
                    aria-label={(
                      actionAriaText.remove ?? DEFAULT_ACTION_ARIA.remove
                    ).replace("{label}", address.label)}
                  >
                    {actionText.remove ?? DEFAULT_ACTIONS.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
