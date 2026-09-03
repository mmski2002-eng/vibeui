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
  /** Метка на промо-карточке. */
  badgeText?: string
  /** Заголовок над списком ссылок. */
  linksTitle?: string
  /** Подпись навигации для скринридера. */
  label?: string
  /** Подпись текущего раздела: он помечается aria-current. */
  current?: string
  /** Подложка полосы и панели. Пусто — своя палитра компонента. */
  background?: string
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
--vibeui-navmenu-002-bg:light-dark(oklch(1 0 0),oklch(0.23 0.013 265));
--vibeui-navmenu-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-navmenu-002-muted:color-mix(in oklab,var(--vibeui-navmenu-002-fg) 68%,transparent);
--vibeui-navmenu-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-navmenu-002-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 12%));
--vibeui-navmenu-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-navmenu-002-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-navmenu-002-promo:light-dark(oklch(0.96 0.03 262),oklch(0.3 0.045 262));
--vibeui-navmenu-002-sheen:light-dark(oklch(1 0 0 / 65%),oklch(1 0 0 / 10%));
--vibeui-navmenu-002-shadow:light-dark(oklch(0.2 0.03 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-navmenu-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navmenu-002"]{color-scheme:dark}
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
gap:0.75rem;
background:var(--vibeui-navmenu-002-bg);color:var(--vibeui-navmenu-002-fg);
border:1px solid var(--vibeui-navmenu-002-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-002-font);
box-shadow:0 24px 48px -24px var(--vibeui-navmenu-002-shadow);
}
/* Раскладка только для открытой панели: display на элементе с popover
   перебивает display:none из стилей браузера, и панель видна всегда. */
[data-vibeui-block="navmenu-002"] [data-part="panel"]:popover-open{display:grid;grid-template-columns:minmax(10rem,1fr) minmax(11rem,1.1fr);}
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
radial-gradient(120% 90% at 15% 10%,var(--vibeui-navmenu-002-sheen),transparent 60%),
var(--vibeui-navmenu-002-promo);
border:1px solid var(--vibeui-navmenu-002-border);
min-height:9rem;
}
[data-vibeui-block="navmenu-002"] [data-part="promo"]:hover{border-color:var(--vibeui-navmenu-002-accent)}
[data-vibeui-block="navmenu-002"] [data-part="promo"]:focus-visible{outline:2px solid var(--vibeui-navmenu-002-accent);outline-offset:2px}
[data-vibeui-block="navmenu-002"] [data-part="badge"]{
align-self:flex-start;margin-bottom:auto;
padding:0.125rem 0.4375rem;border-radius:999px;
background:var(--vibeui-navmenu-002-accent);color:var(--vibeui-navmenu-002-on-accent);
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
/* Текущий раздел: подчёркивание и вес, а не один только цвет. */
[data-vibeui-block="navmenu-002"] [aria-current="page"]{
font-weight:700;
text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:0.3125rem;
text-decoration-color:var(--vibeui-navmenu-002-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navmenu002Link[] = [
  { label: "Редактор", hint: "Блоки, сетка и типографика" },
  { label: "Шаблоны", hint: "Готовые страницы под задачу" },
  { label: "Аналитика", hint: "Источники и воронки" },
  { label: "Интеграции", hint: "CRM, почта, платежи" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
  badgeText = "Новое",
  linksTitle = "Всё остальное",
  label = "Основная навигация",
  current = "Цены",
  background = "",
  accent,
  className,
  style,
}: Navmenu002Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="navigation-menu"
        data-vibeui-block="navmenu-002"
        aria-label={label}
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
              <a
                key={entry}
                data-part="plain"
                href="#"
                aria-current={entry === current ? "page" : undefined}
              >
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
            <span data-part="badge">{badgeText}</span>
            <p data-part="promo-title">{promoTitle}</p>
            <p data-part="promo-text">{promoText}</p>
            <span data-part="promo-action">{promoAction}</span>
          </a>
          <div>
            <p data-part="title">{linksTitle}</p>
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
