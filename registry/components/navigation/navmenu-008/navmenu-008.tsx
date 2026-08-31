import type { CSSProperties } from "react"

export type Navmenu008Props = {
  triggerLabel?: string
  placeholder?: string
  suggestions?: string[]
  recent?: string[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: выпадающая панель, которая начинается со строки поиска.
// Поле лежит в настоящей <form method="get">: запрос уходит на страницу
// результатов и без JS, а подсказки под ним — обычные ссылки, поэтому меню
// остаётся работоспособным до гидратации. Панель — HTML popover.
const STYLES = `
:where([data-vibeui-block="navmenu-008"]){
--vibeui-navmenu-008-bg:oklch(1 0 0);
--vibeui-navmenu-008-field:oklch(0.97 0.003 265);
--vibeui-navmenu-008-fg:oklch(0.22 0.014 265);
--vibeui-navmenu-008-muted:oklch(0.55 0.014 265);
--vibeui-navmenu-008-border:oklch(0.91 0.006 265);
--vibeui-navmenu-008-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-navmenu-008-accent:oklch(0.55 0.2 262);
--vibeui-navmenu-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="navmenu-008"]{
box-sizing:border-box;width:100%;max-width:38rem;
font-family:var(--vibeui-navmenu-008-font);color:var(--vibeui-navmenu-008-fg);
}
[data-vibeui-block="navmenu-008"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-008-bg);
border:1px solid var(--vibeui-navmenu-008-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-008-bar;
}
[data-vibeui-block="navmenu-008"] [data-part="plain"],
[data-vibeui-block="navmenu-008"] [data-part="trigger"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;gap:0.5rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="navmenu-008"] [data-part="trigger"]{margin-left:auto;color:var(--vibeui-navmenu-008-muted)}
[data-vibeui-block="navmenu-008"] [data-part="plain"]:hover,
[data-vibeui-block="navmenu-008"] [data-part="trigger"]:hover{background:var(--vibeui-navmenu-008-hover)}
[data-vibeui-block="navmenu-008"] [data-part="plain"]:focus-visible,
[data-vibeui-block="navmenu-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-008"] [data-part="lens"]{
width:0.75rem;height:0.75rem;border:1.5px solid currentColor;border-radius:999px;position:relative;
}
[data-vibeui-block="navmenu-008"] [data-part="lens"]::after{
content:"";position:absolute;right:-0.1875rem;bottom:-0.1875rem;
width:0.3125rem;height:1.5px;background:currentColor;transform:rotate(45deg);
}
[data-vibeui-block="navmenu-008"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(30rem,92vw);padding:0.625rem;box-sizing:border-box;
background:var(--vibeui-navmenu-008-bg);color:var(--vibeui-navmenu-008-fg);
border:1px solid var(--vibeui-navmenu-008-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-008-font);
box-shadow:0 24px 48px -24px oklch(0.2 0.03 265 / 40%);
}
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-008"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-008-bar;
position-area:bottom span-left;margin-top:0.5rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="navmenu-008"] [data-part="form"]{display:flex;gap:0.375rem}
[data-vibeui-block="navmenu-008"] [data-part="input"]{
flex:1;min-width:0;box-sizing:border-box;
height:2.375rem;padding:0 0.75rem;border-radius:0.625rem;
background:var(--vibeui-navmenu-008-field);color:inherit;
border:1px solid var(--vibeui-navmenu-008-border);
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-008"] [data-part="input"]::placeholder{color:var(--vibeui-navmenu-008-muted)}
[data-vibeui-block="navmenu-008"] [data-part="input"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:-1px;border-color:transparent}
[data-vibeui-block="navmenu-008"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;
height:2.375rem;padding:0 0.875rem;border-radius:0.625rem;
background:var(--vibeui-navmenu-008-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="navmenu-008"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:2px}
[data-vibeui-block="navmenu-008"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0.625rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="navmenu-008"] [data-part="chip"]{
display:inline-flex;align-items:center;padding:0.25rem 0.5rem;border-radius:999px;
border:1px solid var(--vibeui-navmenu-008-border);
text-decoration:none;color:var(--vibeui-navmenu-008-muted);font-size:0.75rem;
}
[data-vibeui-block="navmenu-008"] [data-part="chip"]:hover{color:var(--vibeui-navmenu-008-fg);border-color:var(--vibeui-navmenu-008-accent)}
[data-vibeui-block="navmenu-008"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:2px}
[data-vibeui-block="navmenu-008"] [data-part="title"]{
margin:0.875rem 0 0.375rem;font-size:0.6875rem;letter-spacing:0.06em;
text-transform:uppercase;color:var(--vibeui-navmenu-008-muted);
}
[data-vibeui-block="navmenu-008"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.0625rem}
[data-vibeui-block="navmenu-008"] [data-part="link"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
text-decoration:none;color:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-008"] [data-part="link"]:hover{background:var(--vibeui-navmenu-008-hover)}
[data-vibeui-block="navmenu-008"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-008"] [data-part="clock"]{color:var(--vibeui-navmenu-008-muted);font-size:0.75rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUGGESTIONS = [
  "Тарифы",
  "Домены",
  "Импорт из Тильды",
  "Формы",
  "API",
]

const DEFAULT_RECENT = ["Как подключить домен", "Экспорт статистики"]

/**
 * Навигация с панелью, которая начинается со строки поиска.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu008({
  triggerLabel = "Поиск",
  placeholder = "Что ищем в справке?",
  suggestions = DEFAULT_SUGGESTIONS,
  recent = DEFAULT_RECENT,
  accent,
  className,
  style,
}: Navmenu008Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="navmenu-008"
        aria-label="Основная навигация"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <a data-part="plain" href="#">
            Справка
          </a>
          <a data-part="plain" href="#">
            Сообщество
          </a>
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="true"
            popoverTarget="vibeui-navmenu-008-panel"
          >
            <span data-part="lens" aria-hidden="true" />
            {triggerLabel}
          </button>
        </div>
        <div
          id="vibeui-navmenu-008-panel"
          data-part="panel"
          popover="auto"
          aria-label={triggerLabel}
        >
          <form data-part="form" method="get" action="#" role="search">
            <input
              data-part="input"
              type="search"
              name="q"
              placeholder={placeholder}
              aria-label={placeholder}
            />
            <button type="submit" data-part="go">
              Найти
            </button>
          </form>
          <ul data-part="chips">
            {suggestions.map((item) => (
              <li key={item}>
                <a data-part="chip" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <p data-part="title">Недавнее</p>
          <ul data-part="list">
            {recent.map((item) => (
              <li key={item}>
                <a data-part="link" href="#">
                  <span data-part="clock" aria-hidden="true">
                    ↺
                  </span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
