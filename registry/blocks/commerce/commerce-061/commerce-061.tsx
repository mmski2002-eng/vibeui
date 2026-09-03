import type { CSSProperties } from "react"

export type Commerce061Address = {
  value: string
  label: string
  line: string
  recipient: string
  phone: string
  note?: string
  main?: boolean
}

export type Commerce061Props = {
  step?: string
  title?: string
  lead?: string
  legend?: string
  addresses?: Commerce061Address[]
  mainLabel?: string
  editLabel?: string
  newLabel?: string
  newHint?: string
  cta?: string
  note?: string
  /** Подписи полей нового адреса: city, street, recipient, phone. */
  fieldLabels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: шаг оформления с адресной книгой. Сохранённые адреса — это
// радиогруппа, а «новый адрес» стоит последним вариантом в той же группе:
// форма раскрывается на :has() только под ним, поэтому экран не начинается
// с пустых полей у того, кто заказывает второй раз. У каждого адреса виден
// получатель и телефон — по ним и узнают нужную строку, а не по улице.
const STYLES = `
:where([data-vibeui-block="commerce-061"]){
--vibeui-commerce-061-bg:transparent;
--vibeui-commerce-061-surface:light-dark(oklch(1 0 0),oklch(0.21 0.01 255));
--vibeui-commerce-061-fg:light-dark(oklch(0.21 0.012 255),oklch(0.94 0.006 255));
--vibeui-commerce-061-muted:light-dark(oklch(0.53 0.014 255),oklch(0.73 0.012 255));
--vibeui-commerce-061-border:light-dark(oklch(0.9 0.006 255),oklch(0.38 0.012 255));
--vibeui-commerce-061-soft:light-dark(oklch(0.972 0.004 255),oklch(0.27 0.01 255));
--vibeui-commerce-061-accent:light-dark(oklch(0.49 0.14 255),oklch(0.74 0.13 255));
--vibeui-commerce-061-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 255));
--vibeui-commerce-061-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-061"]{color-scheme:dark}
[data-vibeui-block="commerce-061"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-061-bg);
color:var(--vibeui-commerce-061-fg);font-family:var(--vibeui-commerce-061-sans);
}
[data-vibeui-block="commerce-061"] *{box-sizing:border-box}
[data-vibeui-block="commerce-061"] form{display:contents}
[data-vibeui-block="commerce-061"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-061"] [data-part="step"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-061-accent)}
[data-vibeui-block="commerce-061"] h2{margin:0.375rem 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-061"] [data-part="lead"]{margin:0 0 1.25rem;max-width:52ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-061-muted)}
[data-vibeui-block="commerce-061"] fieldset{border:0;margin:0;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-061"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-061-muted);
}
[data-vibeui-block="commerce-061"] [data-part="book"]{display:grid;gap:0.5rem;clear:both}
[data-vibeui-block="commerce-061"] [data-part="card"]{position:relative}
[data-vibeui-block="commerce-061"] [data-part="card"]>input[type="radio"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-061"] [data-part="face"]{
display:flex;gap:0.75rem;cursor:pointer;border:1px solid var(--vibeui-commerce-061-border);border-radius:0.875rem;
padding:0.75rem 6rem 0.75rem 0.875rem;transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-061"] [data-part="card"]>input:checked+[data-part="face"]{
border-color:var(--vibeui-commerce-061-accent);background:var(--vibeui-commerce-061-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-061-accent);
}
[data-vibeui-block="commerce-061"] [data-part="card"]>input:focus-visible+[data-part="face"]{outline:2px solid var(--vibeui-commerce-061-accent);outline-offset:2px}
[data-vibeui-block="commerce-061"] [data-part="dot"]{
flex:none;width:1.125rem;height:1.125rem;margin-top:0.125rem;border-radius:9999px;
border:2px solid var(--vibeui-commerce-061-border);background:var(--vibeui-commerce-061-surface);
}
[data-vibeui-block="commerce-061"] [data-part="card"]>input:checked+[data-part="face"] [data-part="dot"]{
border-color:var(--vibeui-commerce-061-accent);
box-shadow:inset 0 0 0 3px var(--vibeui-commerce-061-surface),inset 0 0 0 9px var(--vibeui-commerce-061-accent);
}
[data-vibeui-block="commerce-061"] [data-part="texts"]{flex:1;min-width:0}
[data-vibeui-block="commerce-061"] [data-part="row"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem}
[data-vibeui-block="commerce-061"] [data-part="label"]{font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-061"] [data-part="main"]{
display:inline-flex;align-items:center;height:1.25rem;padding:0 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-commerce-061-accent);color:var(--vibeui-commerce-061-onaccent);
font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="commerce-061"] [data-part="line"]{margin:0.1875rem 0 0;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="commerce-061"] [data-part="who"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-061-muted)}
[data-vibeui-block="commerce-061"] [data-part="hint"]{margin:0.25rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-commerce-061-muted)}
[data-vibeui-block="commerce-061"] [data-part="edit"]{
position:absolute;top:0.8125rem;right:0.875rem;z-index:1;appearance:none;border:0;background:transparent;cursor:pointer;
padding:0.125rem 0.25rem;border-radius:0.375rem;font:inherit;font-size:0.8125rem;font-weight:650;
color:var(--vibeui-commerce-061-accent);text-decoration:underline;text-underline-offset:2px;
}
[data-vibeui-block="commerce-061"] [data-part="edit"]:focus-visible{outline:2px solid var(--vibeui-commerce-061-accent);outline-offset:2px}
[data-vibeui-block="commerce-061"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-061"] [data-part="form"]{display:none;margin-top:0.625rem;gap:0.625rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-061"] [data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="commerce-061"] [data-part="field"] span{font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-061-muted)}
[data-vibeui-block="commerce-061"] input[type="text"],
[data-vibeui-block="commerce-061"] input[type="tel"]{
height:2.5rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-061-border);background:var(--vibeui-commerce-061-surface);
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="commerce-061"] input[type="text"]:focus-visible,
[data-vibeui-block="commerce-061"] input[type="tel"]:focus-visible,
[data-vibeui-block="commerce-061"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-061-accent);outline-offset:2px}
[data-vibeui-block="commerce-061"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;margin-top:1.25rem;height:2.875rem;padding:0 1.75rem;border-radius:0.875rem;
background:var(--vibeui-commerce-061-accent);color:var(--vibeui-commerce-061-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-061"] [data-part="note"]{margin:0.875rem 0 0;max-width:52ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-061-muted)}
[data-vibeui-block="commerce-061"] [data-part="book"]:has(#commerce-061-new:checked) [data-part="form"]{display:grid}
@container (min-width: 34rem){
[data-vibeui-block="commerce-061"] [data-part="form"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-061"] [data-part="shell"]{padding:2rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-061"] *{animation:none!important;transition:none!important}}
`

const FIELD_LABEL: Record<string, string> = {
  city: "Город",
  street: "Улица, дом, квартира",
  recipient: "Получатель",
  phone: "Телефон",
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

const DEFAULT_ADDRESSES: Commerce061Address[] = [
  {
    value: "home",
    label: "Дом",
    line: "Санкт-Петербург, набережная реки Карповки, 12, кв. 41",
    recipient: "Анна Ремизова",
    phone: "+7 921 000-14-08",
    note: "Домофон не работает, звоните на телефон у подъезда.",
    main: true,
  },
  {
    value: "work",
    label: "Работа",
    line: "Санкт-Петербург, Кожевенная линия, 40, вход с торца, офис 305",
    recipient: "Анна Ремизова",
    phone: "+7 921 000-14-08",
    note: "Принимают до 18:00, после — только на охране.",
  },
  {
    value: "parents",
    label: "Родители",
    line: "Ленинградская область, Всеволожск, ул. Южная, 3",
    recipient: "Ольга Ремизова",
    phone: "+7 911 555-90-21",
  },
]

/**
 * Шаг оформления с адресной книгой: сохранённые адреса радиогруппой, форма
 * нового раскрывается на :has(). Один файл, ноль зависимостей.
 */
export function Commerce061({
  step = "Шаг 2 из 3",
  title = "Куда привезти заказ",
  lead = "Выберите сохранённый адрес или добавьте новый. Курьер звонит за час до приезда на указанный телефон.",
  legend = "Адрес доставки",
  addresses = DEFAULT_ADDRESSES,
  mainLabel = "По умолчанию",
  editLabel = "Изменить",
  newLabel = "Новый адрес",
  newHint = "Добавим его в книгу после оформления заказа.",
  cta = "Продолжить к оплате",
  note = "Адрес нельзя изменить после того, как заказ уехал на склад: это примерно два часа с момента оплаты.",
  fieldLabels = FIELD_LABEL,
  accent,
  background = "",
  className,
  style,
}: Commerce061Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-061-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-061-bg": background,
          // Точка радиокнопки и поля не должны просвечивать: им нужна
          // непрозрачная подложка, а она задана тем же цветом.
          "--vibeui-commerce-061-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-061" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-061"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="step">{step}</p>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <form>
            <fieldset>
              <legend>{legend}</legend>
              <div data-part="book">
                {addresses.map((address, index) => (
                  <div key={address.value} data-part="card">
                    <input
                      type="radio"
                      id={`commerce-061-${address.value}`}
                      name="commerce-061-address"
                      defaultChecked={index === 0}
                    />
                    <label
                      data-part="face"
                      htmlFor={`commerce-061-${address.value}`}
                    >
                      <span data-part="dot" aria-hidden="true" />
                      <span data-part="texts">
                        <span data-part="row">
                          <span data-part="label">{address.label}</span>
                          {address.main ? (
                            <span data-part="main">{mainLabel}</span>
                          ) : null}
                        </span>
                        <span data-part="line">{address.line}</span>
                        <span data-part="who">
                          {address.recipient} · {address.phone}
                        </span>
                        {address.note ? (
                          <span data-part="hint">{address.note}</span>
                        ) : null}
                      </span>
                    </label>
                    <button type="button" data-part="edit">
                      {editLabel}
                      <span data-part="sr"> — {address.label}</span>
                    </button>
                  </div>
                ))}

                <div data-part="card">
                  <input
                    type="radio"
                    id="commerce-061-new"
                    name="commerce-061-address"
                  />
                  <label data-part="face" htmlFor="commerce-061-new">
                    <span data-part="dot" aria-hidden="true" />
                    <span data-part="texts">
                      <span data-part="row">
                        <span data-part="label">{newLabel}</span>
                      </span>
                      <span data-part="hint">{newHint}</span>
                    </span>
                  </label>
                  <div data-part="form">
                    <label data-part="field" htmlFor="commerce-061-city">
                      <span>{fieldLabels.city ?? FIELD_LABEL.city}</span>
                      <input id="commerce-061-city" name="city" type="text" />
                    </label>
                    <label data-part="field" htmlFor="commerce-061-street">
                      <span>{fieldLabels.street ?? FIELD_LABEL.street}</span>
                      <input
                        id="commerce-061-street"
                        name="street"
                        type="text"
                      />
                    </label>
                    <label data-part="field" htmlFor="commerce-061-name">
                      <span>
                        {fieldLabels.recipient ?? FIELD_LABEL.recipient}
                      </span>
                      <input
                        id="commerce-061-name"
                        name="recipient"
                        type="text"
                      />
                    </label>
                    <label data-part="field" htmlFor="commerce-061-phone">
                      <span>{fieldLabels.phone ?? FIELD_LABEL.phone}</span>
                      <input id="commerce-061-phone" name="phone" type="tel" />
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>

          <button type="button" data-part="go">
            {cta}
          </button>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
