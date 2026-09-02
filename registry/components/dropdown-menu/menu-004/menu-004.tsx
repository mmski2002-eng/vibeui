import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Menu004Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  name?: string
  email?: string
  plan?: string
  /** Пункты меню: компонент несёт русские, проект подставляет свои. */
  items?: string[]
  /** Подпись последнего, необратимого действия. */
  exitLabel?: string
  /** Имя слоя для скринридера. */
  menuLabel?: string
  /** Подпись кнопки для скринридера; {name} подставляется. */
  triggerLabel?: string
  accent?: string
  /** Подложка кнопки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: меню профиля с шапкой. Имя и почта стоят внутри меню, а не
// в кнопке: на узкой шапке для них нет места, а знать, под кем ты вошёл, надо
// до нажатия «выйти». Выход отделён чертой и покрашен текстом — это последнее
// действие в списке и единственное необратимое.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="menu-004"]){
--vibeui-menu-004-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menu-004-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-menu-004-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.012 265));
--vibeui-menu-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-menu-004-hover:light-dark(oklch(0.96 0.004 265),oklch(0.32 0.014 265));
--vibeui-menu-004-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-menu-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-menu-004-hue:250;
--vibeui-menu-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menu-004"]{
display:inline-block;font-family:var(--vibeui-menu-004-font);color:var(--vibeui-menu-004-fg);
}
[data-vibeui-block="menu-004"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.625rem 0 0.375rem;
border:1px solid var(--vibeui-menu-004-border);border-radius:9999px;
background:var(--vibeui-menu-004-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-menu-004-anchor;
}
[data-vibeui-block="menu-004"] [data-part="trigger"]:hover{background:var(--vibeui-menu-004-hover)}
[data-vibeui-block="menu-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menu-004-accent);outline-offset:2px}
[data-vibeui-block="menu-004"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:oklch(0.92 0.05 var(--vibeui-menu-004-hue));
color:oklch(0.38 0.09 var(--vibeui-menu-004-hue));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="menu-004"] [popover]{
position:fixed;margin:0;padding:0.3125rem;min-width:14rem;
border:1px solid var(--vibeui-menu-004-border);border-radius:0.875rem;
background:var(--vibeui-menu-004-bg);color:inherit;
box-shadow:0 18px 40px -22px oklch(0.2 0.02 265 / 55%);
position-anchor:--vibeui-menu-004-anchor;
top:anchor(bottom);right:anchor(right);margin-top:0.375rem;
}
@supports not (anchor-name: --a){
[data-vibeui-block="menu-004"]{position:relative}
[data-vibeui-block="menu-004"] [popover]{position:absolute;top:calc(100% + 0.375rem);right:0;inset:auto}
}
/* Шапка внутри меню: под кем вошёл, надо знать до нажатия «выйти». */
[data-vibeui-block="menu-004"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.125rem;
padding:0.5rem 0.5rem 0.625rem;margin-bottom:0.3125rem;
border-bottom:1px solid var(--vibeui-menu-004-border);
}
[data-vibeui-block="menu-004"] [data-part="name"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="menu-004"] [data-part="email"]{font-size:0.75rem;color:var(--vibeui-menu-004-muted)}
[data-vibeui-block="menu-004"] [data-part="plan"]{
align-self:flex-start;margin-top:0.25rem;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-menu-004-accent) 12%,var(--vibeui-menu-004-bg));
color:color-mix(in oklab,var(--vibeui-menu-004-accent) 75%,var(--vibeui-menu-004-fg));
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="menu-004"] [data-part="item"]{
display:block;width:100%;min-height:2rem;padding:0 0.5rem;
appearance:none;border:0;border-radius:0.5rem;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-align:left;cursor:pointer;
}
[data-vibeui-block="menu-004"] [data-part="item"]:hover{background:var(--vibeui-menu-004-hover)}
[data-vibeui-block="menu-004"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menu-004-accent);outline-offset:-2px}
/* Выход отделён чертой: последнее действие и единственное необратимое. */
[data-vibeui-block="menu-004"] [data-part="exit"]{
margin-top:0.3125rem;padding-top:0.3125rem;border-top:1px solid var(--vibeui-menu-004-border);
}
[data-vibeui-block="menu-004"] [data-part="exit"] [data-part="item"]{color:var(--vibeui-menu-004-danger)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-004"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const DEFAULT_ITEMS = [
  "Профиль и настройки",
  "Оплата и счета",
  "Пригласить в команду",
]

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
 * Меню профиля: шапка с именем и почтой, выход отделён чертой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu004({
  name = "Анна Петрова",
  email = "anna@example.com",
  plan = "Команда",
  items = DEFAULT_ITEMS,
  exitLabel = "Выйти",
  menuLabel = "Профиль",
  triggerLabel = "Меню профиля: {name}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Menu004Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    "--vibeui-menu-004-hue": hue(name),
    ...(accent ? { "--vibeui-menu-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menu-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menu-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="menu-004"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-label={triggerLabel.replace("{name}", name)}
        >
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          {name}
        </button>
        <div
          id={`${id}-menu`}
          popover="auto"
          role="menu"
          aria-label={menuLabel}
        >
          <div data-part="head">
            <span data-part="name">{name}</span>
            <span data-part="email">{email}</span>
            {plan ? <span data-part="plan">{plan}</span> : null}
          </div>
          {items.map((item) => (
            <button key={item} type="button" role="menuitem" data-part="item">
              {item}
            </button>
          ))}
          <div data-part="exit">
            <button type="button" role="menuitem" data-part="item">
              {exitLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
