import type { CSSProperties } from "react"

type Footer003Link = {
  label: string
  href: string
}

type Footer003Column = {
  title: string
  links: Footer003Link[]
}

export type Footer003Props = {
  brand?: string
  formTitle?: string
  formText?: string
  /** Видимая подпись поля: она связана с input через htmlFor. */
  emailLabel?: string
  placeholder?: string
  submitLabel?: string
  consent?: string
  columns?: Footer003Column[]
  legal?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал с подпиской. Форма стоит первой и занимает верхний ряд целиком:
// если подписка нужна, она не должна прятаться сбоку от ссылок. Подпись
// поля видимая, а не placeholder-заглушка, и рядом честная строка согласия —
// подвал остаётся тем местом, где обещания дают, а не прячут.
//
// Тема берётся из color-scheme окружения через light-dark(): подвал темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="footer-003"]){
--vibeui-footer-003-bg:transparent;
--vibeui-footer-003-field:light-dark(oklch(1 0 0),oklch(0.26 0 250));
--vibeui-footer-003-ink:light-dark(oklch(0.21 0 250),oklch(0.94 0 250));
--vibeui-footer-003-muted:light-dark(oklch(0.5 0 250),oklch(0.71 0 250));
--vibeui-footer-003-border:light-dark(oklch(0.89 0 250),oklch(0.36 0 250));
--vibeui-footer-003-accent:light-dark(oklch(0.5 0.17 262),oklch(0.72 0.15 262));
--vibeui-footer-003-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0 262));
--vibeui-footer-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-003"]{color-scheme:dark}
[data-vibeui-block="footer-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-003-bg);color:var(--vibeui-footer-003-ink);
border-top:1px solid var(--vibeui-footer-003-border);
font-family:var(--vibeui-footer-003-font);
}
[data-vibeui-block="footer-003"] [data-part="shell"]{
max-width:74rem;margin:0 auto;padding:3rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-003"] [data-part="signup"]{
display:grid;gap:1.25rem;
padding-bottom:2.5rem;margin-bottom:2.5rem;
border-bottom:1px solid var(--vibeui-footer-003-border);
}
[data-vibeui-block="footer-003"] [data-part="form-title"]{
margin:0;max-width:22ch;
font-size:clamp(1.25rem,3.4cqi,1.75rem);line-height:1.15;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="footer-003"] [data-part="form-text"]{
margin:0.5rem 0 0;max-width:46ch;color:var(--vibeui-footer-003-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="footer-003"] [data-part="label"]{display:block;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:620}
[data-vibeui-block="footer-003"] [data-part="row"]{display:grid;gap:0.5rem}
[data-vibeui-block="footer-003"] [data-part="input"]{
height:2.75rem;min-width:0;padding:0 0.875rem;
border:1px solid var(--vibeui-footer-003-border);border-radius:0.6875rem;
background:var(--vibeui-footer-003-field);color:inherit;font:inherit;font-size:0.9375rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="footer-003"] [data-part="input"]:focus{
outline:none;border-color:var(--vibeui-footer-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-footer-003-accent) 20%,transparent);
}
[data-vibeui-block="footer-003"] [data-part="submit"]{
appearance:none;cursor:pointer;border:0;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.25rem;border-radius:0.6875rem;
background:var(--vibeui-footer-003-accent);color:var(--vibeui-footer-003-accent-fg);
font:inherit;font-size:0.9375rem;font-weight:640;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="footer-003"] [data-part="submit"]:hover{background:color-mix(in oklab,var(--vibeui-footer-003-accent) 86%,black)}
[data-vibeui-block="footer-003"] [data-part="consent"]{
margin:0.625rem 0 0;color:var(--vibeui-footer-003-muted);font-size:0.75rem;line-height:1.5;max-width:52ch;
}
[data-vibeui-block="footer-003"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
}
[data-vibeui-block="footer-003"] [data-part="column-title"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-003"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.4375rem}
[data-vibeui-block="footer-003"] [data-part="column"] a{
color:var(--vibeui-footer-003-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-003"] [data-part="column"] a:hover{color:var(--vibeui-footer-003-accent)}
[data-vibeui-block="footer-003"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;gap:0.5rem 1rem;
margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-003-border);
color:var(--vibeui-footer-003-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-003"] [data-part="brand"]{font-weight:700;color:var(--vibeui-footer-003-ink)}
[data-vibeui-block="footer-003"] a:focus-visible,
[data-vibeui-block="footer-003"] button:focus-visible,
[data-vibeui-block="footer-003"] input:focus-visible{outline:2px solid var(--vibeui-footer-003-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="footer-003"] [data-part="shell"]{padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-003"] [data-part="signup"]{grid-template-columns:1fr 1fr;gap:3rem;align-items:start}
[data-vibeui-block="footer-003"] [data-part="row"]{grid-template-columns:1fr auto}
[data-vibeui-block="footer-003"] [data-part="columns"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer003Column[] = [
  {
    title: "Каталог",
    links: [
      { label: "Новые поступления", href: "#new" },
      { label: "Подборки", href: "#collections" },
      { label: "Распродажа", href: "#sale" },
    ],
  },
  {
    title: "Покупателям",
    links: [
      { label: "Доставка и оплата", href: "#delivery" },
      { label: "Возврат", href: "#returns" },
      { label: "Размерная сетка", href: "#sizes" },
    ],
  },
  {
    title: "О нас",
    links: [
      { label: "Мастерская", href: "#workshop" },
      { label: "Материалы", href: "#materials" },
      { label: "Магазины", href: "#stores" },
    ],
  },
  {
    title: "Связь",
    links: [
      { label: "Написать нам", href: "#contact" },
      { label: "Оптовым клиентам", href: "#wholesale" },
      { label: "Сотрудничество", href: "#partners" },
    ],
  },
]

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

/** Подвал с подпиской: форма занимает верхний ряд, ссылки идут под ней. */
export function Footer003({
  brand = "Лоза",
  formTitle = "Письмо о новых партиях",
  formText = "Пишем, когда выходит новая партия и когда на складе остаются последние размеры. Обычно два письма в месяц.",
  emailLabel = "Электронная почта",
  placeholder = "you@example.com",
  submitLabel = "Подписаться",
  consent = "Отправляя адрес, вы соглашаетесь с политикой обработки данных. Отписаться можно ссылкой в любом письме.",
  columns = DEFAULT_COLUMNS,
  legal = "© 2026 Мастерская «Лоза»",
  background = "",
  accent,
  className,
  style,
}: Footer003Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-003" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="signup">
            <div>
              <h2 data-part="form-title">{formTitle}</h2>
              <p data-part="form-text">{formText}</p>
            </div>
            <form action="#subscribe" method="post">
              <label data-part="label" htmlFor="vibeui-footer-003-email">
                {emailLabel}
              </label>
              <div data-part="row">
                <input
                  data-part="input"
                  id="vibeui-footer-003-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={placeholder}
                />
                <button data-part="submit" type="submit">
                  {submitLabel}
                </button>
              </div>
              <p data-part="consent">{consent}</p>
            </form>
          </div>
          <div data-part="columns">
            {columns.map((column) => (
              <nav
                key={column.title}
                data-part="column"
                aria-label={column.title}
              >
                <p data-part="column-title">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div data-part="bottom">
            <span data-part="brand">{brand}</span>
            <span>{legal}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
