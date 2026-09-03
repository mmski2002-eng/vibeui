import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover007Item = {
  title: string
  meta: string
  unread?: boolean
}

export type Popover007Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  /** Число на значке. 0 убирает значок целиком. */
  count?: number
  items?: Popover007Item[]
  footerLabel?: string
  /** Заголовок панели и подпись кнопки без непрочитанных. */
  title?: string
  /** Строка о непрочитанных. {count} подставляется. */
  unreadText?: string
  /** Доступная подпись кнопки со счётчиком. {count} подставляется. */
  unreadHint?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка панели и кнопки. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: колокольчик со счётчиком и списком внутри. Непрочитанное
// помечено точкой и весом, а не только цветом; список — настоящий <ul> со
// ссылками, поэтому по нему ходят стрелками и Tab, а не мышью по div'ам.
const STYLES = `
:where([data-vibeui-block="popover-007"]){
--vibeui-popover-007-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-007-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-007-muted:color-mix(in oklab,var(--vibeui-popover-007-fg) 68%,transparent);
--vibeui-popover-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-007-hover:light-dark(oklch(0.965 0.004 265),oklch(0.27 0.014 265));
--vibeui-popover-007-accent:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-popover-007-on-accent:light-dark(oklch(0.99 0.01 25),oklch(0.18 0.03 25));
--vibeui-popover-007-shadow:light-dark(oklch(0.2 0.02 265 / 62%),oklch(0.02 0.01 265 / 74%));
--vibeui-popover-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-007"]{color-scheme:dark}
[data-vibeui-block="popover-007"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-007-font);color:var(--vibeui-popover-007-fg);
}
[data-vibeui-block="popover-007"] [data-part="trigger"]{
position:relative;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;border-radius:0.75rem;
border:1px solid var(--vibeui-popover-007-border);
background:var(--vibeui-popover-007-bg);color:inherit;
font:inherit;font-size:1.0625rem;line-height:1;
anchor-name:--vibeui-popover-007-anchor;
}
[data-vibeui-block="popover-007"] [data-part="trigger"]:hover{background:var(--vibeui-popover-007-hover)}
[data-vibeui-block="popover-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-007-accent);outline-offset:2px}
[data-vibeui-block="popover-007"] [data-part="badge"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
display:flex;align-items:center;justify-content:center;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;box-sizing:border-box;
border-radius:9999px;border:2px solid var(--vibeui-popover-007-bg);
background:var(--vibeui-popover-007-accent);color:var(--vibeui-popover-007-on-accent);
font-size:0.625rem;font-weight:750;line-height:1;font-variant-numeric:tabular-nums;
}
/* Раскладка панели только в :popover-open, иначе display перебьёт
   браузерный display:none и список будет висеть поверх страницы. */
[data-vibeui-block="popover-007"] [data-part="panel"]{
position:fixed;margin:0;padding:0;
width:min(20rem,100vw - 2rem);box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-popover-007-border);border-radius:1rem;
background:var(--vibeui-popover-007-bg);color:inherit;
box-shadow:0 26px 54px -30px var(--vibeui-popover-007-shadow);
position-anchor:--vibeui-popover-007-anchor;
top:anchor(bottom);right:anchor(right);margin-top:0.5rem;
}
[data-vibeui-block="popover-007"] [data-part="panel"]:popover-open{display:flex;flex-direction:column}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-007"] [data-part="panel"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);right:0}
}
[data-vibeui-block="popover-007"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.75rem 0.875rem 0.5rem;
}
[data-vibeui-block="popover-007"] [data-part="heading"]{margin:0;font-size:0.875rem;font-weight:660}
[data-vibeui-block="popover-007"] [data-part="unreadCount"]{font-size:0.75rem;color:var(--vibeui-popover-007-muted)}
[data-vibeui-block="popover-007"] [data-part="list"]{
margin:0;padding:0;list-style:none;max-height:15rem;overflow-y:auto;
border-top:1px solid var(--vibeui-popover-007-border);
}
[data-vibeui-block="popover-007"] [data-part="link"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.5rem;
padding:0.625rem 0.875rem;color:inherit;text-decoration:none;
border-bottom:1px solid var(--vibeui-popover-007-border);
transition:background-color .14s ease;
}
[data-vibeui-block="popover-007"] [data-part="link"]:hover{background:var(--vibeui-popover-007-hover)}
[data-vibeui-block="popover-007"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-popover-007-accent);outline-offset:-2px}
[data-vibeui-block="popover-007"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;margin-top:0.375rem;border-radius:9999px;
background:var(--vibeui-popover-007-accent);
}
[data-vibeui-block="popover-007"] [data-part="link"][data-read="true"] [data-part="dot"]{background:transparent}
[data-vibeui-block="popover-007"] [data-part="itemTitle"]{font-size:0.8125rem;line-height:1.35;font-weight:600}
[data-vibeui-block="popover-007"] [data-part="link"][data-read="true"] [data-part="itemTitle"]{font-weight:450;color:var(--vibeui-popover-007-muted)}
[data-vibeui-block="popover-007"] [data-part="itemMeta"]{grid-column:2;font-size:0.75rem;color:var(--vibeui-popover-007-muted)}
[data-vibeui-block="popover-007"] [data-part="foot"]{
padding:0.5rem 0.875rem;text-align:center;
font-size:0.8125rem;font-weight:640;
color:var(--vibeui-popover-007-fg);text-decoration:none;
}
[data-vibeui-block="popover-007"] [data-part="foot"]:hover{background:var(--vibeui-popover-007-hover)}
[data-vibeui-block="popover-007"] [data-part="foot"]:focus-visible{outline:2px solid var(--vibeui-popover-007-accent);outline-offset:-2px}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя. */
[data-vibeui-block="popover-007"][data-open] [popover]{
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Popover007Item[] = [
  {
    title: "Сборка 412 прошла",
    meta: "конвейер · 3 минуты назад",
    unread: true,
  },
  {
    title: "Новый комментарий в задаче VU-88",
    meta: "Мария · 20 минут назад",
    unread: true,
  },
  { title: "Счёт за август оплачен", meta: "биллинг · вчера" },
  { title: "Ключ доступа истекает через 7 дней", meta: "безопасность · вчера" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поповер уведомлений: значок со счётчиком и список со ссылками внутри.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover007({
  count = 2,
  items = DEFAULT_ITEMS,
  footerLabel = "Все уведомления",
  title = "Уведомления",
  unreadText = "{count} новых",
  unreadHint = "Уведомления, непрочитанных: {count}",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover007Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-007"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-panel`}
          aria-label={
            count > 0 ? unreadHint.replace("{count}", String(count)) : title
          }
        >
          <span aria-hidden="true">🔔</span>
          {count > 0 ? (
            <span data-part="badge" aria-hidden="true">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </button>
        <div
          data-part="panel"
          id={`${id}-panel`}
          popover="auto"
          aria-label={title}
        >
          <div data-part="head">
            <p data-part="heading">{title}</p>
            <span data-part="unreadCount">
              {unreadText.replace("{count}", String(count))}
            </span>
          </div>
          <ul data-part="list">
            {items.map((item) => (
              <li key={item.title}>
                <a
                  data-part="link"
                  data-read={item.unread ? undefined : "true"}
                  href="#notification"
                >
                  <span data-part="dot" aria-hidden="true" />
                  <span data-part="itemTitle">{item.title}</span>
                  <span data-part="itemMeta">{item.meta}</span>
                </a>
              </li>
            ))}
          </ul>
          <a data-part="foot" href="#all">
            {footerLabel}
          </a>
        </div>
      </div>
    </>
  )
}
