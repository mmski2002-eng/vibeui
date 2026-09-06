import type { CSSProperties } from "react"

type Navbar012Link = {
  label: string
  href: string
  note?: string
}

type Navbar012Group = {
  title: string
  links: Navbar012Link[]
}

export type Navbar012Props = {
  brand?: string
  tagline?: string
  groups?: Navbar012Group[]
  /**
   * Показать панель развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  actionLabel?: string
  actionHref?: string
  callLabel?: string
  callHref?: string
  /** Подпись кнопки меню: компонент несёт русскую. */
  menuLabel?: string
  /** Подпись кнопки закрытия ящика: компонент несёт русскую. */
  closeLabel?: string
  /** Подпись ящика для скринридера: компонент несёт русскую. */
  drawerLabel?: string
  id?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Компактная шапка, у которой меню всегда ящик: полная панель во всю высоту
// уезжает справа и остаётся такой на любой ширине. Это осознанный выбор для
// сайтов с длинным деревом разделов — их всё равно не поместить в строку,
// и попытка это сделать заканчивается «ещё» с невнятным списком.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-012"]){
--vibeui-navbar-012-bg:transparent;
--vibeui-navbar-012-ink:light-dark(oklch(0.21 0.015 30),oklch(0.94 0.006 30));
--vibeui-navbar-012-muted:light-dark(oklch(0.52 0.014 30),oklch(0.71 0.012 30));
--vibeui-navbar-012-border:light-dark(oklch(0.9 0.008 30),oklch(0.35 0.012 30));
--vibeui-navbar-012-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-navbar-012-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-navbar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-012"]{color-scheme:dark}
[data-vibeui-block="navbar-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-012-bg);color:var(--vibeui-navbar-012-ink);
border-bottom:1px solid var(--vibeui-navbar-012-border);
font-family:var(--vibeui-navbar-012-font);
}
[data-vibeui-block="navbar-012"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem;
max-width:80rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-012"] [data-part="brand"]{
display:flex;flex-direction:column;gap:0.0625rem;flex:none;
color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-012"] [data-part="brand"] strong{font-size:1.0625rem;font-weight:730;letter-spacing:-0.03em}
[data-vibeui-block="navbar-012"] [data-part="tagline"]{color:var(--vibeui-navbar-012-muted);font-size:0.6875rem;letter-spacing:0.04em;text-transform:uppercase}
[data-vibeui-block="navbar-012"] [data-part="call"]{
order:3;flex:1 1 100%;
color:var(--vibeui-navbar-012-ink);text-decoration:none;
font-size:0.9375rem;font-weight:640;white-space:nowrap;
}
[data-vibeui-block="navbar-012"] [data-part="burger"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.5rem;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-navbar-012-border);border-radius:0.6875rem;background:transparent;
font:inherit;font-size:0.875rem;font-weight:580;color:inherit;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-012"] [data-part="burger"]:hover{border-color:var(--vibeui-navbar-012-accent)}
[data-vibeui-block="navbar-012"] [data-part="bars"]{
display:grid;gap:0.1875rem;width:1rem;
}
[data-vibeui-block="navbar-012"] [data-part="bars"] i{display:block;height:1.5px;background:currentColor;border-radius:2px}
[data-vibeui-block="navbar-012"] [data-part="bars"] i:last-child{width:0.625rem}
[data-vibeui-block="navbar-012"] button:focus-visible,
[data-vibeui-block="navbar-012"] a:focus-visible{outline:2px solid var(--vibeui-navbar-012-accent);outline-offset:2px}
/* Ящик живёт в верхнем слое, поэтому стилизуется по атрибуту, а не как потомок. */
[data-vibeui-navbar-012-drawer]{
position:fixed;inset:0 0 0 auto;margin:0;width:min(22rem,90vw);height:100dvh;max-height:100dvh;
padding:1.25rem;overflow-y:auto;
border:0;
border-left:1px solid var(--vibeui-navbar-012-border,light-dark(oklch(0.9 0.008 30),oklch(0.35 0.012 30)));
background:light-dark(oklch(1 0 0),oklch(0.24 0.014 30));
color:light-dark(oklch(0.21 0.015 30),oklch(0.94 0.006 30));
font-family:var(--vibeui-navbar-012-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:-30px 0 70px -40px light-dark(oklch(0.2 0.03 30 / 60%),oklch(0 0 0 / 70%));
translate:100% 0;
transition:translate .26s cubic-bezier(.2,.7,.3,1),display .26s allow-discrete,overlay .26s allow-discrete;
}
[data-vibeui-navbar-012-drawer]:popover-open{translate:0 0}
@starting-style{[data-vibeui-navbar-012-drawer]:popover-open{translate:100% 0}}
[data-vibeui-navbar-012-drawer]::backdrop{background:light-dark(oklch(0.2 0.02 30 / 42%),oklch(0.06 0.01 30 / 62%))}
[data-vibeui-navbar-012-drawer] [data-part="close"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;height:2rem;padding:0 0.75rem;margin-bottom:1rem;
border:1px solid light-dark(oklch(0.9 0.008 30),oklch(0.35 0.012 30));
border-radius:0.5rem;background:transparent;
font:inherit;font-size:0.8125rem;font-weight:560;color:inherit;
}
[data-vibeui-navbar-012-drawer] [data-part="group"]{margin-bottom:1.25rem}
[data-vibeui-navbar-012-drawer] [data-part="group-title"]{
margin:0 0 0.375rem;color:light-dark(oklch(0.52 0.014 30),oklch(0.71 0.012 30));
font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-navbar-012-drawer] a{
display:block;padding:0.5rem 0.625rem;border-radius:0.625rem;
color:inherit;text-decoration:none;font-size:1rem;font-weight:560;
}
[data-vibeui-navbar-012-drawer] a:hover{background:light-dark(oklch(0.55 0.02 30 / 8%),oklch(0.85 0.02 30 / 12%))}
[data-vibeui-navbar-012-drawer] [data-part="note"]{
display:block;color:light-dark(oklch(0.52 0.014 30),oklch(0.71 0.012 30));
font-size:0.8125rem;font-weight:420;
}
[data-vibeui-navbar-012-drawer] [data-part="action"]{
display:flex;justify-content:center;margin-top:0.5rem;
background:var(--vibeui-navbar-012-accent,light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8)));
color:var(--vibeui-navbar-012-accent-fg,light-dark(oklch(0.99 0 0),oklch(0.18 0.03 340)));
font-weight:640;
}
@container (min-width: 44rem){
[data-vibeui-block="navbar-012"] [data-part="shell"]{padding:0.9375rem 2rem;gap:1.5rem}
[data-vibeui-block="navbar-012"] [data-part="brand"] strong{font-size:1.25rem}
[data-vibeui-block="navbar-012"] [data-part="call"]{order:0;flex:none;margin-left:auto}
}
/* Развёрнутый режим: ящик встаёт в потоке под шапкой во всю её ширину,
   а не уезжает справа во весь экран. */
[data-vibeui-navbar-012-drawer][data-open="true"]{
position:static;inset:auto;width:100%;height:auto;max-height:none;
overflow-y:visible;margin:0.75rem 0 0;border-left:0;
translate:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-012"] *{animation:none!important;transition:none!important}
[data-vibeui-navbar-012-drawer]{transition:none!important}
}
`

const DEFAULT_GROUPS: Navbar012Group[] = [
  {
    title: "Клиника",
    links: [
      { label: "О центре", href: "#about" },
      { label: "Врачи", href: "#doctors", note: "24 специалиста" },
      { label: "Лицензии", href: "#licenses" },
    ],
  },
  {
    title: "Пациентам",
    links: [
      { label: "Услуги и цены", href: "#services" },
      { label: "Анализы", href: "#labs" },
      { label: "Программы наблюдения", href: "#programs" },
      { label: "Отзывы", href: "#reviews" },
    ],
  },
  {
    title: "Контакты",
    links: [
      { label: "Адреса", href: "#addresses", note: "4 филиала в городе" },
      { label: "Как добраться", href: "#route" },
    ],
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

/** Шапка с меню-ящиком: полная панель во всю высоту уезжает справа. */
export function Navbar012({
  brand = "Ясная",
  tagline = "Семейная клиника",
  groups = DEFAULT_GROUPS,
  open = false,
  actionLabel = "Записаться на приём",
  actionHref = "#appointment",
  callLabel = "+7 495 000-11-22",
  callHref = "tel:+74950001122",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  drawerLabel = "Все разделы",
  id = "vibeui-navbar-012-drawer",
  background = "",
  accent,
  className,
  style,
}: Navbar012Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-012" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <strong>{brand}</strong>
            <span data-part="tagline">{tagline}</span>
          </a>
          <a data-part="call" href={callHref}>
            {callLabel}
          </a>
          <button data-part="burger" type="button" popoverTarget={id}>
            <span data-part="bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {menuLabel}
          </button>
        </div>
        <nav
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-navbar-012-drawer=""
          data-open={open || undefined}
          style={palette}
          aria-label={drawerLabel}
        >
          <button data-part="close" type="button" popoverTarget={id}>
            {closeLabel}
          </button>
          {groups.map((group) => (
            <div key={group.title} data-part="group">
              <p data-part="group-title">{group.title}</p>
              {group.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                  {link.note ? <span data-part="note">{link.note}</span> : null}
                </a>
              ))}
            </div>
          ))}
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </nav>
      </header>
    </>
  )
}
