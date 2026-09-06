import type { CSSProperties } from "react"

export type Commerce033Perk = {
  title: string
  note: string
}

export type Commerce033Props = {
  title?: string
  lead?: string
  guestLabel?: string
  guestHint?: string
  accountLabel?: string
  accountHint?: string
  perksTitle?: string
  perks?: Commerce033Perk[]
  offer?: string
  cta?: string
  legal?: string
  /** Скрытая подпись группы способов оформления. */
  waysLegend?: string
  /** Подписи и значения полей обеих форм. */
  fieldLabels?: Record<string, string>
  fieldValues?: Record<string, string>
  /** Пояснения под формами гостя и входа. */
  guestNote?: string
  loginNote?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: заказ без регистрации, где гостевой путь стоит первым и выбран
// по умолчанию. Регистрация не исчезает: она вторая карточка, а её польза
// перечислена списком рядом — иначе выбор превращается в угадывание. Пароль
// предлагается уже после оплаты одним чекбоксом, поэтому форма гостя короткая:
// почта нужна для чека, телефон — курьеру.
const STYLES = `
:where([data-vibeui-block="commerce-033"]){
--vibeui-commerce-033-bg:transparent;
--vibeui-commerce-033-radius:0;
--vibeui-commerce-033-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-033-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-033-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-commerce-033-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-033-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-commerce-033-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-commerce-033-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-033"]{color-scheme:dark}
[data-vibeui-block="commerce-033"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-033-bg);
border-radius:var(--vibeui-commerce-033-radius);
color:var(--vibeui-commerce-033-fg);font-family:var(--vibeui-commerce-033-sans);
}
[data-vibeui-block="commerce-033"] *{box-sizing:border-box}
[data-vibeui-block="commerce-033"] form{display:contents}
[data-vibeui-block="commerce-033"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-033"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-033"] [data-part="lead"]{margin:0 0 1rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-033-muted)}
[data-vibeui-block="commerce-033"] [data-part="ways"]{border:0;padding:0;margin:0;display:grid;gap:0.625rem}
@container (min-width: 38rem){
[data-vibeui-block="commerce-033"] [data-part="ways"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-033"] [data-part="way"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="commerce-033"] [data-part="way"] input{position:absolute;top:0.9375rem;left:0.9375rem;margin:0;width:1.125rem;height:1.125rem;accent-color:var(--vibeui-commerce-033-accent)}
[data-vibeui-block="commerce-033"] [data-part="face"]{
display:block;height:100%;padding:0.875rem 0.875rem 0.875rem 2.75rem;border-radius:1rem;
border:1px solid var(--vibeui-commerce-033-border);
transition:border-color .15s ease,background-color .15s ease;
}
[data-vibeui-block="commerce-033"] [data-part="way"] input:checked + [data-part="face"]{
border-color:var(--vibeui-commerce-033-accent);background:color-mix(in oklab,var(--vibeui-commerce-033-accent) 7%,transparent);
}
[data-vibeui-block="commerce-033"] [data-part="way"] input:focus-visible + [data-part="face"]{outline:2px solid var(--vibeui-commerce-033-accent);outline-offset:2px}
[data-vibeui-block="commerce-033"] [data-part="face"] b{display:block;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="commerce-033"] [data-part="face"] span{display:block;margin-top:0.1875rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-033-muted)}
/* Форма гостя раскрывается на :has(): состояния нет, блок остаётся серверным. */
[data-vibeui-block="commerce-033"] [data-part="guest"]{display:none}
[data-vibeui-block="commerce-033"] [data-part="shell"]:has(#commerce-033-guest:checked) [data-part="guest"]{display:block}
[data-vibeui-block="commerce-033"] [data-part="login"]{display:none}
[data-vibeui-block="commerce-033"] [data-part="shell"]:has(#commerce-033-account:checked) [data-part="login"]{display:block}
[data-vibeui-block="commerce-033"] [data-part="pane"]{
margin-top:0.875rem;padding:0.875rem;border:1px solid var(--vibeui-commerce-033-border);border-radius:1.125rem;
}
[data-vibeui-block="commerce-033"] [data-part="fields"]{display:grid;gap:0.625rem}
@container (min-width: 38rem){
[data-vibeui-block="commerce-033"] [data-part="fields"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-033"] label[data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="commerce-033"] [data-part="field"] > span{font-size:0.75rem;font-weight:600;color:var(--vibeui-commerce-033-muted)}
[data-vibeui-block="commerce-033"] input[type="text"],
[data-vibeui-block="commerce-033"] input[type="email"],
[data-vibeui-block="commerce-033"] input[type="tel"],
[data-vibeui-block="commerce-033"] input[type="password"]{
width:100%;height:2.5rem;padding:0 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-033-border);background:var(--vibeui-commerce-033-bg);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="commerce-033"] input:focus-visible{outline:2px solid var(--vibeui-commerce-033-accent);outline-offset:1px}
[data-vibeui-block="commerce-033"] [data-part="why"]{
margin:0.5rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-commerce-033-muted);
}
[data-vibeui-block="commerce-033"] [data-part="offer"]{
margin-top:0.75rem;padding:0.625rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-033-soft);
display:flex;gap:0.5rem;align-items:flex-start;font-size:0.8125rem;line-height:1.5;cursor:pointer;
}
[data-vibeui-block="commerce-033"] [data-part="offer"] input{margin:0.1875rem 0 0;accent-color:var(--vibeui-commerce-033-accent);width:1rem;height:1rem;flex:0 0 auto}
[data-vibeui-block="commerce-033"] [data-part="perks"]{margin:1rem 0 0;padding:0}
[data-vibeui-block="commerce-033"] [data-part="perks"] h3{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-033-muted);
}
[data-vibeui-block="commerce-033"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
@container (min-width: 38rem){
[data-vibeui-block="commerce-033"] ul{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="commerce-033"] li{
padding:0.625rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-033-soft);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="commerce-033"] li b{display:block;font-size:0.8125rem;font-weight:650;margin-bottom:0.125rem}
[data-vibeui-block="commerce-033"] li span{color:var(--vibeui-commerce-033-muted)}
[data-vibeui-block="commerce-033"] [data-part="cta"]{
margin-top:1rem;width:100%;appearance:none;border:0;cursor:pointer;height:3rem;border-radius:0.875rem;
background:var(--vibeui-commerce-033-accent);color:var(--vibeui-commerce-033-on-accent);font:inherit;font-size:1rem;font-weight:700;
}
[data-vibeui-block="commerce-033"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-033-accent);outline-offset:2px}
[data-vibeui-block="commerce-033"] [data-part="legal"]{margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-commerce-033-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-033"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERKS: Commerce033Perk[] = [
  {
    title: "История заказов",
    note: "Все чеки и статусы в одном месте, не нужно искать письма.",
  },
  {
    title: "Адреса и карты",
    note: "Следующий заказ оформляется в два поля вместо десяти.",
  },
  {
    title: "Возврат в один шаг",
    note: "Заявка собирается из заказа, накладную присылаем сами.",
  },
]

const DEFAULT_FIELD_LABELS: Record<string, string> = {
  name: "Имя и фамилия",
  phone: "Телефон",
  email: "Почта для чека",
  loginEmail: "Почта",
  password: "Пароль",
}

const DEFAULT_FIELD_VALUES: Record<string, string> = {
  name: "Анна Смирнова",
  phone: "+7 921 000-11-22",
  email: "anna@example.com",
  loginEmail: "anna@example.com",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Гостевой заказ без регистрации: гостевой путь первый, аккаунт предлагается после оплаты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce033({
  title = "Как оформить заказ",
  lead = "Регистрация не обязательна. Чек и статус доставки придут на почту, а завести аккаунт можно после оплаты — заказ к нему привяжется сам.",
  guestLabel = "Оформить как гость",
  guestHint = "Два поля и оплата. Пароль придумывать не нужно.",
  accountLabel = "Войти в аккаунт",
  accountHint = "Адреса и карты подставятся автоматически.",
  perksTitle = "Что даёт аккаунт",
  perks = DEFAULT_PERKS,
  offer = "Создать аккаунт после оплаты — пароль придёт письмом, заказ привяжется автоматически",
  cta = "Продолжить к доставке",
  legal = "Продолжая, вы соглашаетесь с условиями продажи и обработкой персональных данных. Почта нужна для чека, телефон — курьеру.",
  waysLegend = "Способ оформления",
  fieldLabels = DEFAULT_FIELD_LABELS,
  fieldValues = DEFAULT_FIELD_VALUES,
  guestNote = "Почта нужна только для чека и статуса доставки. Рассылку без отдельного согласия не отправляем.",
  loginNote = "Забыли пароль? Пришлём ссылку для входа на почту — заказ при этом не потеряется.",
  accent,
  background = "",
  className,
  style,
}: Commerce033Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-033-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-033-bg": background,
          "--vibeui-commerce-033-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const label = (key: string) => fieldLabels[key] ?? DEFAULT_FIELD_LABELS[key]
  const value = (key: string) => fieldValues[key] ?? DEFAULT_FIELD_VALUES[key]

  return (
    <>
      <style href="vibeui-commerce-033" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-033"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <form>
            <fieldset data-part="ways">
              <legend hidden>{waysLegend}</legend>
              <label data-part="way">
                <input
                  type="radio"
                  name="commerce-033-way"
                  id="commerce-033-guest"
                  defaultChecked
                />
                <span data-part="face">
                  <b>{guestLabel}</b>
                  <span>{guestHint}</span>
                </span>
              </label>
              <label data-part="way">
                <input
                  type="radio"
                  name="commerce-033-way"
                  id="commerce-033-account"
                />
                <span data-part="face">
                  <b>{accountLabel}</b>
                  <span>{accountHint}</span>
                </span>
              </label>
            </fieldset>
          </form>

          <div data-part="guest">
            <div data-part="pane">
              <div data-part="fields">
                <label data-part="field">
                  <span>{label("name")}</span>
                  <input type="text" defaultValue={value("name")} />
                </label>
                <label data-part="field">
                  <span>{label("phone")}</span>
                  <input type="tel" defaultValue={value("phone")} />
                </label>
                <label data-part="field">
                  <span>{label("email")}</span>
                  <input type="email" defaultValue={value("email")} />
                </label>
              </div>
              <p data-part="why">{guestNote}</p>
              <label data-part="offer">
                <input type="checkbox" defaultChecked />
                <span>{offer}</span>
              </label>
            </div>
          </div>

          <div data-part="login">
            <div data-part="pane">
              <div data-part="fields">
                <label data-part="field">
                  <span>{label("loginEmail")}</span>
                  <input
                    type="email"
                    autoComplete="username"
                    defaultValue={value("loginEmail")}
                  />
                </label>
                <label data-part="field">
                  <span>{label("password")}</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    defaultValue=""
                  />
                </label>
              </div>
              <p data-part="why">{loginNote}</p>
            </div>
          </div>

          <div data-part="perks">
            <h3>{perksTitle}</h3>
            <ul>
              {perks.map((perk) => (
                <li key={perk.title}>
                  <b>{perk.title}</b>
                  <span>{perk.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <button type="button" data-part="cta">
            {cta}
          </button>
          <p data-part="legal">{legal}</p>
        </div>
      </section>
    </>
  )
}
