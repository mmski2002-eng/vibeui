import type { ComponentProps, CSSProperties } from "react"

export type Dropdown019Item = {
  label: string
  /** Сочетание клавиш в правой колонке: «⌘⇧S». Пусто — колонка пустует. */
  keys?: string
  href?: string
}

export type Dropdown019Props = Omit<ComponentProps<"div">, "children"> & {
  id?: string
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  /** Подпись основного действия — она же срабатывает по нажатию слева. */
  action?: string
  items?: Dropdown019Item[]
  accent?: string
  /** Подложка компонента. Пусто — фон страницы просвечивает. */
  background?: string
}

// Идея компонента: раздвоенная кнопка. Слева обычное действие, справа
// отдельная зона со стрелкой, и она открывает варианты того же действия —
// «сохранить как», «сохранить копию». Смысл в том, что частый путь остаётся
// в одно нажатие, а редкие не занимают место на панели.
//
// Обе половины живут в одной рамке, но остаются двумя кнопками: у каждой своя
// подсказка и свой фокус, поэтому с клавиатуры видно, куда именно ведёт Enter.
const STYLES = `
:where([data-vibeui-block="dropdown-019"]){
--vibeui-dropdown-019-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-dropdown-019-muted:color-mix(in oklab,var(--vibeui-dropdown-019-fg) 62%,transparent);
--vibeui-dropdown-019-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-dropdown-019-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-dropdown-019-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.86 0.02 265 / 12%));
--vibeui-dropdown-019-accent:light-dark(oklch(0.52 0.19 262),oklch(0.72 0.16 262));
--vibeui-dropdown-019-on-accent:oklch(from var(--vibeui-dropdown-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-dropdown-019-radius:0.625rem;
--vibeui-dropdown-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-019"]{color-scheme:dark}
[data-vibeui-block="dropdown-019"]{
display:inline-flex;font-family:var(--vibeui-dropdown-019-font);
}
[data-vibeui-block="dropdown-019"] *{box-sizing:border-box}
[data-vibeui-block="dropdown-019"] [data-part="split"]{
display:inline-flex;align-items:stretch;
border-radius:0.5rem;background:var(--vibeui-dropdown-019-accent);
color:var(--vibeui-dropdown-019-on-accent);
box-shadow:0 1px 2px oklch(0.2 0.03 265 / 22%);
}
/* Подпись действия переводится и настраивается, поэтому высоту набирает
   содержимое: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="dropdown-019"] [data-part="action"],
[data-vibeui-block="dropdown-019"] [data-part="more"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;line-height:1.3;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-019"] [data-part="action"]{
padding:0.3125rem 0.875rem;border-radius:0.5rem 0 0 0.5rem;
}
[data-vibeui-block="dropdown-019"] [data-part="more"]{
padding:0.3125rem 0.5rem;border-radius:0 0.5rem 0.5rem 0;
anchor-name:--vibeui-dropdown-019-anchor;
}
/* Шов между половинами: он показывает, что нажатий здесь два, а не одно. */
[data-vibeui-block="dropdown-019"] [data-part="more"]{
border-inline-start:1px solid color-mix(in oklab,currentColor 30%,transparent);
}
[data-vibeui-block="dropdown-019"] [data-part="action"]:hover,
[data-vibeui-block="dropdown-019"] [data-part="more"]:hover{
background:oklch(from var(--vibeui-dropdown-019-on-accent) l c h / 14%);
}
[data-vibeui-block="dropdown-019"] [data-part="action"]:focus-visible,
[data-vibeui-block="dropdown-019"] [data-part="more"]:focus-visible{
outline:2px solid var(--vibeui-dropdown-019-accent);outline-offset:2px;
}
[data-vibeui-block="dropdown-019"] [data-part="chevron"]{
inline-size:0.375rem;block-size:0.375rem;
border-right:1.5px solid currentColor;
border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-dropdown-019-menu]{
position:fixed;margin:0;padding:0.3125rem;
min-inline-size:14rem;box-sizing:border-box;
border:1px solid var(--vibeui-dropdown-019-border,light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265)));
border-radius:var(--vibeui-dropdown-019-radius,0.625rem);
background:var(--vibeui-dropdown-019-bg,light-dark(oklch(1 0 0),oklch(0.25 0.012 265)));
color:var(--vibeui-dropdown-019-fg,light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265)));
font-family:var(--vibeui-dropdown-019-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-dropdown-019-menu]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dropdown-019-menu]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
/* Меню выравнивается по правому краю кнопки: стрелка стоит справа, и список
   уходит внутрь макета, а не за его границу. */
@supports (anchor-name: --a){
[data-vibeui-dropdown-019-menu]{
position-anchor:--vibeui-dropdown-019-anchor;
position-area:bottom span-left;
margin-block-start:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-dropdown-019-menu] [data-part="item"]{
display:flex;align-items:center;gap:1rem;inline-size:100%;
padding:0.4375rem 0.5rem;border-radius:0.4375rem;
color:inherit;text-decoration:none;
font-size:0.8125rem;line-height:1.3;
transition:background-color .14s ease;
}
[data-vibeui-dropdown-019-menu] [data-part="item"]:hover{
background:var(--vibeui-dropdown-019-hover,light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.86 0.02 265 / 12%)));
}
[data-vibeui-dropdown-019-menu] [data-part="item"]:focus-visible{
outline:2px solid var(--vibeui-dropdown-019-accent,light-dark(oklch(0.52 0.19 262),oklch(0.72 0.16 262)));
outline-offset:-2px;
}
[data-vibeui-dropdown-019-menu] [data-part="keys"]{
margin-inline-start:auto;
color:var(--vibeui-dropdown-019-muted,color-mix(in oklab,currentColor 62%,transparent));
font-size:0.75rem;font-variant-numeric:tabular-nums;white-space:nowrap;
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-019"]:has([data-open="true"]){flex-direction:column;align-items:flex-end}
[data-vibeui-dropdown-019-menu][data-open="true"]{
position:static;opacity:1;transform:none;margin-block-start:0.375rem;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dropdown-019"] *{animation:none!important;transition:none!important}
[data-vibeui-dropdown-019-menu]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_ITEMS: Dropdown019Item[] = [
  { label: "Сохранить как…", keys: "⌘⇧S", href: "#" },
  { label: "Сохранить копию", href: "#" },
  { label: "Сохранить и закрыть", keys: "⌘⏎", href: "#" },
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
 * Раздвоенная кнопка: основное действие слева, варианты того же действия
 * за стрелкой справа. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown019({
  id = "vibeui-dropdown-019",
  open = false,
  action = "Сохранить",
  items = DEFAULT_ITEMS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown019Props) {
  const palette = {
    ...(accent ? { "--vibeui-dropdown-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-019"
        className={className}
        style={palette}
      >
        <div data-part="split">
          <button data-part="action" type="button">
            {action}
          </button>
          <button
            data-part="more"
            type="button"
            popoverTarget={id}
            aria-label={`${action}: другие варианты`}
          >
            <span data-part="chevron" aria-hidden="true" />
          </button>
        </div>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dropdown-019-menu=""
          data-open={open || undefined}
          style={palette}
        >
          {items.map((item) => (
            <a key={item.label} data-part="item" href={item.href}>
              {item.label}
              {item.keys ? <span data-part="keys">{item.keys}</span> : null}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
