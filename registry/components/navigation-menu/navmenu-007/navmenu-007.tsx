import type { CSSProperties } from "react"

export type Navmenu007Entry = {
  label: string
  items?: string[]
  href?: string
}

export type Navmenu007Props = {
  brand?: string
  entries?: Navmenu007Entry[]
  actionLabel?: string
  secondaryLabel?: string
  /** Подпись группы разделов для скринридера. */
  label?: string
  /** Подложка шапки. Пусто — своя палитра компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: полноценная шапка сайта — логотип слева, разделы по центру,
// вход и главное действие справа. Средняя часть растягивается через flex:1, и
// кнопка остаётся у правого края при любой ширине. Логотип — не картинка, а
// текст со знаком: он масштабируется, читается скринридером и ничего не грузит.
const STYLES = `
:where([data-vibeui-block="navmenu-007"]){
--vibeui-navmenu-007-bg:light-dark(oklch(1 0 0),oklch(0.23 0.013 265));
--vibeui-navmenu-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-navmenu-007-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-navmenu-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-navmenu-007-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 12%));
--vibeui-navmenu-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-navmenu-007-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-navmenu-007-mark-end:light-dark(oklch(0.68 0.16 320),oklch(0.74 0.15 320));
--vibeui-navmenu-007-mark-sheen:light-dark(oklch(1 0 0 / 35%),oklch(1 0 0 / 22%));
--vibeui-navmenu-007-shadow:light-dark(oklch(0.2 0.03 265 / 42%),oklch(0 0 0 / 70%));
--vibeui-navmenu-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navmenu-007"]{
box-sizing:border-box;width:100%;max-width:46rem;
font-family:var(--vibeui-navmenu-007-font);color:var(--vibeui-navmenu-007-fg);
}
[data-vibeui-block="navmenu-007"] [data-part="shell"]{
box-sizing:border-box;padding:0.5rem 0.625rem;
display:flex;align-items:center;gap:0.75rem;
background:var(--vibeui-navmenu-007-bg);
border:1px solid var(--vibeui-navmenu-007-border);border-radius:0.875rem;
}
[data-vibeui-block="navmenu-007"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;
text-decoration:none;color:inherit;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
border-radius:0.5rem;
}
[data-vibeui-block="navmenu-007"] [data-part="brand"]:focus-visible{outline:2px solid var(--vibeui-navmenu-007-accent);outline-offset:3px}
/* Знак логотипа — два наложенных квадрата, нарисованных градиентом. */
[data-vibeui-block="navmenu-007"] [data-part="mark"]{
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:linear-gradient(140deg,var(--vibeui-navmenu-007-accent),var(--vibeui-navmenu-007-mark-end));
box-shadow:inset 0 0 0 1px var(--vibeui-navmenu-007-mark-sheen);
}
[data-vibeui-block="navmenu-007"] [data-part="links"]{display:flex;align-items:center;gap:0.125rem;flex:1}
[data-vibeui-block="navmenu-007"] [data-part="slot"]{position:relative}
[data-vibeui-block="navmenu-007"] [data-part="trigger"],
[data-vibeui-block="navmenu-007"] [data-part="plain"]{
list-style:none;cursor:pointer;text-decoration:none;color:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.625rem;border-radius:0.5rem;font-size:0.875rem;
}
[data-vibeui-block="navmenu-007"] [data-part="trigger"]::-webkit-details-marker{display:none}
[data-vibeui-block="navmenu-007"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-007"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-007-hover)}
[data-vibeui-block="navmenu-007"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-007"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-007-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-007"] [data-part="slot"][open] > [data-part="trigger"]{background:var(--vibeui-navmenu-007-hover)}
[data-vibeui-block="navmenu-007"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.1875rem;
border:1.5px solid var(--vibeui-navmenu-007-muted);border-left:0;border-top:0;transform:rotate(45deg);
}
[data-vibeui-block="navmenu-007"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.5rem);left:0;z-index:30;
min-width:11rem;margin:0;padding:0.25rem;box-sizing:border-box;list-style:none;
background:var(--vibeui-navmenu-007-bg);
border:1px solid var(--vibeui-navmenu-007-border);border-radius:0.75rem;
box-shadow:0 20px 40px -22px var(--vibeui-navmenu-007-shadow);
}
[data-vibeui-block="navmenu-007"] [data-part="link"]{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
text-decoration:none;color:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-007"] [data-part="link"]:hover{background:var(--vibeui-navmenu-007-hover)}
[data-vibeui-block="navmenu-007"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-007-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-007"] [data-part="right"]{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="navmenu-007"] [data-part="ghost"]{
text-decoration:none;color:var(--vibeui-navmenu-007-muted);font-size:0.875rem;
padding:0 0.5rem;border-radius:0.5rem;
}
[data-vibeui-block="navmenu-007"] [data-part="ghost"]:hover{color:var(--vibeui-navmenu-007-fg)}
[data-vibeui-block="navmenu-007"] [data-part="ghost"]:focus-visible{outline:2px solid var(--vibeui-navmenu-007-accent);outline-offset:2px}
[data-vibeui-block="navmenu-007"] [data-part="cta"]{
display:inline-flex;align-items:center;height:2rem;padding:0 0.875rem;
border-radius:0.5rem;text-decoration:none;white-space:nowrap;
background:var(--vibeui-navmenu-007-accent);color:var(--vibeui-navmenu-007-on-accent);
font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="navmenu-007"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-navmenu-007-accent);outline-offset:2px}
/* В узкой шапке ссылки и вторичное действие уходят: место нужно логотипу и CTA. */
@container (max-width: 34rem){
[data-vibeui-block="navmenu-007"] [data-part="links"]{display:none}
[data-vibeui-block="navmenu-007"] [data-part="ghost"]{display:none}
[data-vibeui-block="navmenu-007"] [data-part="right"]{margin-left:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Navmenu007Entry[] = [
  { label: "Продукт", items: ["Редактор", "Шаблоны", "Аналитика"] },
  { label: "Решения", items: ["Студиям", "Магазинам", "Медиа"] },
  { label: "Цены", href: "#" },
  { label: "Блог", href: "#" },
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
 * Шапка сайта: логотип слева, разделы по центру, действие справа.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu007({
  brand = "Полотно",
  entries = DEFAULT_ENTRIES,
  actionLabel = "Начать",
  secondaryLabel = "Войти",
  label = "Разделы сайта",
  background = "",
  accent,
  className,
  style,
}: Navmenu007Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="navmenu-007"
        className={className}
        style={palette}
      >
        <header data-part="shell">
          <a data-part="brand" href="#">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav data-part="links" aria-label={label}>
            {entries.map((entry) =>
              entry.items ? (
                <details
                  key={entry.label}
                  data-part="slot"
                  name="vibeui-navmenu-007"
                >
                  <summary data-part="trigger">
                    {entry.label}
                    <span data-part="caret" aria-hidden="true" />
                  </summary>
                  <ul data-part="menu" aria-label={entry.label}>
                    {entry.items.map((item) => (
                      <li key={item}>
                        <a data-part="link" href="#">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a key={entry.label} data-part="plain" href={entry.href ?? "#"}>
                  {entry.label}
                </a>
              ),
            )}
          </nav>
          <div data-part="right">
            <a data-part="ghost" href="#">
              {secondaryLabel}
            </a>
            <a data-part="cta" href="#">
              {actionLabel}
            </a>
          </div>
        </header>
      </div>
    </>
  )
}
