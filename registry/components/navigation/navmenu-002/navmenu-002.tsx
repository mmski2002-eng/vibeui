import type { CSSProperties } from "react"

export type Navmenu002Link = {
  label: string
  hint?: string
  href?: string
}

export type Navmenu002Props = {
  entries?: string[]
  panelLabel?: string
  links?: Navmenu002Link[]
  promoTitle?: string
  promoText?: string
  promoAction?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: выпадающая панель, у которой есть главный экспонат. Слева
// промо-карточка на всю высоту панели, справа обычные ссылки — так у меню
// появляется приоритет, а не ровный список из десяти равнозначных пунктов.
// Панель открывает HTML popover: Escape и клик мимо достаются от браузера.
const STYLES = `
:where([data-vibeui-block="navmenu-002"]){
--vibeui-navmenu-002-bg:oklch(1 0 0);
--vibeui-navmenu-002-fg:oklch(0.22 0.014 265);
--vibeui-navmenu-002-muted:oklch(0.55 0.014 265);
--vibeui-navmenu-002-border:oklch(0.91 0.006 265);
--vibeui-navmenu-002-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-navmenu-002-accent:oklch(0.55 0.2 262);
--vibeui-navmenu-002-promo:oklch(0.96 0.03 262);
--vibeui-navmenu-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="navmenu-002"]{
box-sizing:border-box;width:100%;max-width:42rem;
font-family:var(--vibeui-navmenu-002-font);color:var(--vibeui-navmenu-002-fg);
}
[data-vibeui-block="navmenu-002"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-002-bg);
border:1px solid var(--vibeui-navmenu-002-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-002-bar;
}
[data-vibeui-block="navmenu-002"] [data-part="trigger"],
[data-vibeui-block="navmenu-002"] [data-part="plain"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="navmenu-002"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-002"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-002-hover)}
[data-vibeui-block="navmenu-002"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-002"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-002-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-002"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(38rem,92vw);padding:0.75rem;box-sizing:border-box;
display:grid;grid-template-columns:minmax(10rem,1fr) minmax(11rem,1.1fr);gap:0.75rem;
background:var(--vibeui-navmenu-002-bg);color:var(--vibeui-navmenu-002-fg);
border:1px solid var(--vibeui-navmenu-002-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-002-font);
box-shadow:0 24px 48px -24px oklch(0.2 0.03 265 / 40%);
}
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-002"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-002-bar;
position-area:bottom span-right;margin-top:0.5rem;
position-try-fallbacks:flip-block;
}
}
/* Промо — целиком ссылка: кликается вся карточка, а не только заголовок. */
[data-vibeui-block="navmenu-002"] [data-part="promo"]{
display:flex;flex-direction:column;justify-content:flex-end;gap:0.375rem;
padding:0.875rem;border-radius:0.75rem;text-decoration:none;color:inherit;
background:
radial-gradient(120% 90% at 15% 10%,oklch(1 0 0 / 65%),transparent 60%),
var(--vibeui-navmenu-002-promo);
border:1px solid var(--vibeui-navmenu-002-border);
min-height:9rem;
}
[data-vibeui-block="navmenu-002"] [data-part="promo"]:hover{border-color:var(--vibeui-navmenu-002-accent)}
[data-vibeui-block="navmenu-002"] [data-part="promo"]:focus-visible{outline:2px solid var(--vibeui-navmenu-002-accent);outline-offset:2px}
[data-vibeui-block="navmenu-002"] [data-part="badge"]{
align-self:flex-start;margin-bottom:auto;
padding:0.125rem 0.4375rem;border-radius:999px;
background:var(--vibeui-navmenu-002-accent);color:oklch(1 0 0);
font-size:0.625rem;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="navmenu-002"] [data-part="promo-title"]{margin:0;font-size:1rem;line-height:1.25}
[data-vibeui-block="navmenu-002"] [data-part="promo-text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-navmenu-002-muted)}
[data-vibeui-block="navmenu-002"] [data-part="promo-action"]{font-size:0.8125rem;font-weight:600;color:var(--vibeui-navmenu-002-accent)}
[data-vibeui-block="navmenu-002"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.125rem;align-content:start}
[data-vibeui-block="navmenu-002"] [data-part="title"]{
margin:0.25rem 0 0.375rem 0.5rem;font-size:0.6875rem;letter-spacing:0.06em;
text-transform:uppercase;color:var(--vibeui-navmenu-002-muted);
}
[data-vibeui-block="navmenu-002"] [data-part="link"]{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;text-decoration:none;color:inherit;
}
[data-vibeui-block="navmenu-002"] [data-part="link"]:hover{background:var(--vibeui-navmenu-002-hover)}
[data-vibeui-block="navmenu-002"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-002-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-002"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:550}
[data-vibeui-block="navmenu-002"] [data-part="hint"]{display:block;margin-top:0.0625rem;font-size:0.75rem;color:var(--vibeui-navmenu-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navmenu002Link[] = [
  { label: "Редактор", hint: "Блоки, сетка и типографика" },
  { label: "Шаблоны", hint: "Готовые страницы под задачу" },
  { label: "Аналитика", hint: "Источники и воронки" },
  { label: "Интеграции", hint: "CRM, почта, платежи" },
]

/**
 * Навигация с выпадающей панелью, где слева промо-блок, справа ссылки.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu002({
  entries = ["Возможности", "Цены", "Блог"],
  panelLabel = "Возможности",
  links = DEFAULT_LINKS,
  promoTitle = "Конструктор писем",
  promoText = "Рассылка собирается из тех же блоков, что и страницы сайта.",
  promoAction = "Смотреть →",
  accent,
  className,
  style,
}: Navmenu002Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="navmenu-002"
        aria-label="Основная навигация"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="true"
            popoverTarget="vibeui-navmenu-002-panel"
          >
            {panelLabel}
          </button>
          {entries
            .filter((entry) => entry !== panelLabel)
            .map((entry) => (
              <a key={entry} data-part="plain" href="#">
                {entry}
              </a>
            ))}
        </div>
        <div
          id="vibeui-navmenu-002-panel"
          data-part="panel"
          popover="auto"
          aria-label={panelLabel}
        >
          <a data-part="promo" href="#">
            <span data-part="badge">Новое</span>
            <p data-part="promo-title">{promoTitle}</p>
            <p data-part="promo-text">{promoText}</p>
            <span data-part="promo-action">{promoAction}</span>
          </a>
          <div>
            <p data-part="title">Всё остальное</p>
            <ul data-part="list">
              {links.map((link) => (
                <li key={link.label}>
                  <a data-part="link" href={link.href ?? "#"}>
                    <span data-part="name">{link.label}</span>
                    {link.hint ? (
                      <span data-part="hint">{link.hint}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
