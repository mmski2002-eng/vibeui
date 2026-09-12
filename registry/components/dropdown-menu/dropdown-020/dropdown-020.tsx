"use client"

import { useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Dropdown020Item = {
  label: string
  /** Строка под подписью: что именно произойдёт. Пусто — пункт в одну строку. */
  hint?: string
  href?: string
  danger?: boolean
}

export type Dropdown020Props = Omit<ComponentProps<"div">, "children"> & {
  id?: string
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  /** Заголовок листа на узком экране. На широком он не показывается. */
  title?: string
  items?: Dropdown020Item[]
  accent?: string
  /** Подложка компонента. Пусто — фон страницы просвечивает. */
  background?: string
}

// Идея компонента: одно меню, две раскладки. На широком экране это обычный
// список у кнопки; на узком тот же список приезжает снизу на всю ширину, с
// крупными зонами нажатия и заголовком — так, как на телефоне ожидают.
//
// Переключает раскладку @media по ширине, а не JS: разметка одна, состояние
// одно, и сервер отдаёт готовую страницу без гидрации.
const STYLES = `
:where([data-vibeui-block="dropdown-020"]){
--vibeui-dropdown-020-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-020-muted:color-mix(in oklab,var(--vibeui-dropdown-020-fg) 60%,transparent);
--vibeui-dropdown-020-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-020-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-020-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.86 0 265 / 12%));
--vibeui-dropdown-020-accent:light-dark(oklch(0.28 0 0),oklch(0.899 0 0));
--vibeui-dropdown-020-danger:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.16 25));
--vibeui-dropdown-020-radius:0.875rem;
--vibeui-dropdown-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-020"]{color-scheme:dark}
[data-vibeui-block="dropdown-020"]{
display:inline-flex;font-family:var(--vibeui-dropdown-020-font);
}
[data-vibeui-block="dropdown-020"] *{box-sizing:border-box}
[data-vibeui-block="dropdown-020"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.25rem;padding:0.3125rem 0.875rem;
border:1px solid var(--vibeui-dropdown-020-border);border-radius:0.5rem;
background:var(--vibeui-dropdown-020-bg);color:var(--vibeui-dropdown-020-fg);
font:inherit;font-size:0.8125rem;font-weight:550;line-height:1.3;
anchor-name:--vibeui-dropdown-020-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-020"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-020-hover)}
[data-vibeui-block="dropdown-020"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-020-accent);outline-offset:2px}
[data-vibeui-block="dropdown-020"] [data-part="chevron"]{
inline-size:0.375rem;block-size:0.375rem;
border-right:1.5px solid var(--vibeui-dropdown-020-muted);
border-bottom:1.5px solid var(--vibeui-dropdown-020-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-dropdown-020-menu]{
position:fixed;margin:0;padding:0.3125rem;
min-inline-size:15rem;box-sizing:border-box;
border:1px solid var(--vibeui-dropdown-020-border,light-dark(oklch(0.9 0 265),oklch(0.37 0 265)));
border-radius:var(--vibeui-dropdown-020-radius,0.875rem);
background:var(--vibeui-dropdown-020-bg,light-dark(oklch(1 0 0),oklch(0.25 0 265)));
color:var(--vibeui-dropdown-020-fg,light-dark(oklch(0.24 0 265),oklch(0.94 0 265)));
font-family:var(--vibeui-dropdown-020-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 18px 40px -20px oklch(0.2 0 265 / 48%);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .16s ease,transform .16s ease,display .16s allow-discrete,overlay .16s allow-discrete;
}
[data-vibeui-dropdown-020-menu]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dropdown-020-menu]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-dropdown-020-menu]{
position-anchor:--vibeui-dropdown-020-anchor;
position-area:bottom span-right;
margin-block-start:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-dropdown-020-menu] [data-part="grip"],
[data-vibeui-dropdown-020-menu] [data-part="title"]{display:none}
[data-vibeui-dropdown-020-menu] [data-part="item"]{
display:flex;flex-direction:column;gap:0.125rem;inline-size:100%;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:inherit;text-decoration:none;
font-size:0.8125rem;line-height:1.3;
transition:background-color .14s ease;
}
[data-vibeui-dropdown-020-menu] [data-part="item"]:hover{
background:var(--vibeui-dropdown-020-hover,light-dark(oklch(0.55 0 265 / 8%),oklch(0.86 0 265 / 12%)));
}
[data-vibeui-dropdown-020-menu] [data-part="item"]:focus-visible{
outline:2px solid var(--vibeui-dropdown-020-accent,light-dark(oklch(0.28 0 0),oklch(0.899 0 0)));
outline-offset:-2px;
}
[data-vibeui-dropdown-020-menu] [data-part="item"][data-danger="true"]{
color:var(--vibeui-dropdown-020-danger,light-dark(oklch(0.55 0.2 25),oklch(0.72 0.16 25)));
}
[data-vibeui-dropdown-020-menu] [data-part="hint"]{
color:var(--vibeui-dropdown-020-muted,color-mix(in oklab,currentColor 60%,transparent));
font-size:0.75rem;line-height:1.35;
}
/* Узкий экран: тот же список приезжает снизу на всю ширину. Popover уже лежит
   в верхнем слое, поэтому лист получается без обёрток и без скрипта. */
@media (max-width:30rem){
[data-vibeui-dropdown-020-menu]{
inset:auto 0 0 0;
inline-size:100%;min-inline-size:0;max-block-size:80svb;overflow-y:auto;
padding:0.5rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-inline:0;border-block-end:0;
border-radius:var(--vibeui-dropdown-020-radius,0.875rem) var(--vibeui-dropdown-020-radius,0.875rem) 0 0;
transform:translateY(0.75rem);
}
@starting-style{[data-vibeui-dropdown-020-menu]:popover-open{transform:translateY(0.75rem)}}
@supports (anchor-name: --a){
[data-vibeui-dropdown-020-menu]{position-area:none;margin-block-start:0}
}
[data-vibeui-dropdown-020-menu] [data-part="grip"]{
display:block;inline-size:2.25rem;block-size:0.25rem;
margin:0.125rem auto 0.5rem;border-radius:999px;
background:color-mix(in oklab,currentColor 22%,transparent);
}
[data-vibeui-dropdown-020-menu] [data-part="title"]{
display:block;margin:0 0 0.375rem;padding-inline:0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-020-muted,color-mix(in oklab,currentColor 60%,transparent));
}
/* Палец крупнее курсора: на листе у пунктов свой размер. */
[data-vibeui-dropdown-020-menu] [data-part="item"]{
min-block-size:2.875rem;justify-content:center;
padding:0.5rem 0.75rem;font-size:0.875rem;
}
[data-vibeui-dropdown-020-menu] [data-part="item"] + [data-part="item"]{
border-block-start:1px solid var(--vibeui-dropdown-020-border,light-dark(oklch(0.9 0 265),oklch(0.37 0 265)));
border-radius:0;
}
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-020"]:has([data-open="true"]){flex-direction:column;align-items:stretch}
[data-vibeui-dropdown-020-menu][data-open="true"]{
position:static;inset:auto;opacity:1;transform:none;
margin-block-start:0.375rem;max-block-size:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dropdown-020"] *{animation:none!important;transition:none!important}
[data-vibeui-dropdown-020-menu]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_ITEMS: Dropdown020Item[] = [
  {
    label: "Открыть доступ",
    hint: "Ссылка для тех, у кого есть код",
    href: "#",
  },
  { label: "Переименовать", href: "#" },
  { label: "Дублировать", hint: "Копия ляжет рядом в той же папке", href: "#" },
  { label: "Переместить в архив", href: "#" },
  {
    label: "Удалить",
    hint: "Останется в корзине 30 дней",
    href: "#",
    danger: true,
  },
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
 * Меню, которое на узком экране превращается в лист снизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown020({
  id = "vibeui-dropdown-020",
  open = false,
  trigger = "Действия",
  title = "Файл",
  items = DEFAULT_ITEMS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown020Props) {
  // Ссылка внутри popover его не закрывает: браузер гасит меню только по
  // клику мимо. В приложении меню убрал бы переход, но пункт может вести и
  // на текущую страницу — закрываем сами.
  const menu = useRef<HTMLDivElement>(null)

  const close = () => {
    if (menu.current?.matches(":popover-open")) {
      menu.current.hidePopover()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-020"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
          <span data-part="chevron" aria-hidden="true" />
        </button>
        <div
          id={id}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-vibeui-dropdown-020-menu=""
          data-open={open || undefined}
          style={palette}
        >
          <span data-part="grip" aria-hidden="true" />
          <p data-part="title">{title}</p>
          {items.map((item) => (
            <a
              key={item.label}
              data-part="item"
              data-danger={item.danger || undefined}
              href={item.href}
              onClick={close}
            >
              {item.label}
              {item.hint ? <span data-part="hint">{item.hint}</span> : null}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
