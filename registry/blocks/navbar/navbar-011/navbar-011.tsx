import type { CSSProperties } from "react"

export type Navbar011Props = {
  brand?: string
  markLabel?: string
  /** Подпись поля «что». */
  whatLabel?: string
  whatPlaceholder?: string
  /** Подпись поля «где». */
  whereLabel?: string
  wherePlaceholder?: string
  /** Подпись поля «когда»; пустая строка убирает поле. */
  whenLabel?: string
  whenPlaceholder?: string
  searchLabel?: string
  /** Адрес обработчика поиска принимающего проекта. */
  searchAction?: string
  loginLabel?: string
  loginHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка каталога с местом и параметрами: крупный объединённый поиск
// «что / где / когда» и компактные действия по краям. Настоящая форма:
// три поля в одной капсуле с разделителями и оранжевой кнопкой. Состояние
// и выдачу обслуживает принимающий проект; здесь только доступная
// разметка. Поле «когда» необязательно — каталогу специалистов даты не
// нужны. В узкой колонке поля складываются в столбик. Без JS.
const STYLES = `
:where([data-vibeui-block="navbar-011"]){
--vibeui-navbar-011-bg:#ffffff;
--vibeui-navbar-011-ink:#000000;
--vibeui-navbar-011-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-011-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-011-accent:#ff5900;
--vibeui-navbar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-011"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-011-bg);color:var(--vibeui-navbar-011-ink);
border-bottom:1px solid var(--vibeui-navbar-011-line);
font-family:var(--vibeui-navbar-011-font);
}
[data-vibeui-block="navbar-011"] *{box-sizing:border-box}
[data-vibeui-block="navbar-011"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem 1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem 1.125rem;
}
[data-vibeui-block="navbar-011"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-011"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;border-radius:999px;
background:var(--vibeui-navbar-011-accent);color:#000000;
font-size:0.8125rem;font-weight:800;
}
[data-vibeui-block="navbar-011"] [data-part="login"]{
margin-left:auto;flex:none;order:2;
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.25rem 0.9375rem;
border:1px solid var(--vibeui-navbar-011-line);border-radius:999px;
color:var(--vibeui-navbar-011-ink);text-decoration:none;
font-size:0.875rem;font-weight:560;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-011"] [data-part="login"]:hover{border-color:var(--vibeui-navbar-011-ink)}
[data-vibeui-block="navbar-011"] [data-part="search"]{
order:3;flex:1 1 100%;
display:flex;flex-direction:column;
border:1px solid var(--vibeui-navbar-011-line);border-radius:1.25rem;
box-shadow:0 0.375rem 1.25rem color-mix(in oklab,#000000 8%,transparent);
overflow:hidden;
}
[data-vibeui-block="navbar-011"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.125rem;
padding:0.625rem 1.125rem;min-width:0;
border-bottom:1px solid var(--vibeui-navbar-011-line);
}
[data-vibeui-block="navbar-011"] [data-part="field"] span{
font-size:0.6875rem;font-weight:680;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="navbar-011"] [data-part="field"] input{
border:0;padding:0;background:transparent;min-width:0;
font:inherit;font-size:0.9375rem;color:var(--vibeui-navbar-011-ink);
min-height:1.5rem;
}
[data-vibeui-block="navbar-011"] [data-part="field"] input::placeholder{color:var(--vibeui-navbar-011-muted)}
[data-vibeui-block="navbar-011"] [data-part="field"] input:focus-visible{outline:none}
[data-vibeui-block="navbar-011"] [data-part="field"]:focus-within{
background:color-mix(in oklab,var(--vibeui-navbar-011-accent) 7%,transparent);
}
[data-vibeui-block="navbar-011"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:3rem;margin:0.375rem;border-radius:0.9375rem;
background:var(--vibeui-navbar-011-accent);color:#000000;
font:inherit;font-size:0.9375rem;font-weight:660;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-011"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-011"] [data-part="submit"] svg{width:1.0625rem;height:1.0625rem}
[data-vibeui-block="navbar-011"] a:focus-visible,
[data-vibeui-block="navbar-011"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-011-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-011"] [data-part="shell"]{padding:1rem 2rem 1.375rem}
[data-vibeui-block="navbar-011"] [data-part="search"]{
flex-direction:row;align-items:stretch;border-radius:999px;
max-width:52rem;margin:0 auto;
}
[data-vibeui-block="navbar-011"] [data-part="field"]{
flex:1 1 0;border-bottom:0;border-right:1px solid var(--vibeui-navbar-011-line);
padding:0.5625rem 1.375rem;
}
[data-vibeui-block="navbar-011"] [data-part="field"]:last-of-type{border-right:0}
[data-vibeui-block="navbar-011"] [data-part="submit"]{
min-width:3rem;border-radius:999px;margin:0.375rem;padding:0 1.25rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-011"] *{animation:none!important;transition:none!important}}
`

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** Шапка каталога: объединённый поиск «что / где / когда» одной капсулой. */
export function Navbar011({
  brand = "Простор",
  markLabel = "П",
  whatLabel = "Что",
  whatPlaceholder = "Жильё, специалист, событие",
  whereLabel = "Где",
  wherePlaceholder = "Город или район",
  whenLabel = "Когда",
  whenPlaceholder = "Любые даты",
  searchLabel = "Найти",
  searchAction = "#search",
  loginLabel = "Войти",
  loginHref = "#login",
  accent,
  className,
  style,
}: Navbar011Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-011" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-011" className={className} style={palette}>
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
          </a>
          <a data-part="login" href={loginHref}>
            {loginLabel}
          </a>
          <form data-part="search" action={searchAction} role="search">
            <label data-part="field">
              <span>{whatLabel}</span>
              <input type="search" name="q" placeholder={whatPlaceholder} />
            </label>
            <label data-part="field">
              <span>{whereLabel}</span>
              <input type="text" name="place" placeholder={wherePlaceholder} />
            </label>
            {whenLabel ? (
              <label data-part="field">
                <span>{whenLabel}</span>
                <input type="text" name="dates" placeholder={whenPlaceholder} />
              </label>
            ) : null}
            <button data-part="submit" type="submit">
              <SearchIcon />
              {searchLabel}
            </button>
          </form>
        </div>
      </header>
    </>
  )
}
