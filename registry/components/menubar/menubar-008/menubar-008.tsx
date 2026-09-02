import type { CSSProperties } from "react"

export type Menubar008Menu = {
  label: string
  items: string[]
}

export type Menubar008Props = {
  menus?: Menubar008Menu[]
  userName?: string
  unread?: number
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /** Имя кнопки уведомлений: {count} — сколько непрочитанных. */
  notificationsLabel?: string
  /** Заголовок списка уведомлений. */
  notificationsTitle?: string
  /** Подписи уведомлений: компонент несёт русские, проект подставляет свои. */
  notifications?: string[]
  /** Пункты меню профиля. */
  profileItems?: string[]
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: строка меню с правой частью — уведомлениями и профилем.
// Разделы и профиль открываются одним и тем же механизмом (HTML popover), но
// профиль прижат к правому краю через margin-left:auto и открывается «от себя»:
// его меню выравнивается по правому краю кнопки, иначе вылезает за пределы окна.
const STYLES = `
:where([data-vibeui-block="menubar-008"]){
--vibeui-menubar-008-bg:transparent;
--vibeui-menubar-008-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menubar-008-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menubar-008-muted:light-dark(oklch(0.58 0.014 265),oklch(0.68 0.012 265));
--vibeui-menubar-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menubar-008-hover:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.88 0.02 265 / 14%));
--vibeui-menubar-008-badge:light-dark(oklch(0.58 0.2 26),oklch(0.66 0.18 26));
--vibeui-menubar-008-on-badge:oklch(1 0 0);
--vibeui-menubar-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.7 0.17 262));
--vibeui-menubar-008-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="menubar-008"]{
box-sizing:border-box;width:100%;max-width:38rem;
font-family:var(--vibeui-menubar-008-font);color:var(--vibeui-menubar-008-fg);
}
[data-vibeui-block="menubar-008"] [data-part="shell"]{
box-sizing:border-box;padding:0.3125rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-menubar-008-bg);
border:1px solid var(--vibeui-menubar-008-border);border-radius:0.625rem;
}
[data-vibeui-block="menubar-008"] [data-part="slot"]{position:relative;display:flex}
[data-vibeui-block="menubar-008"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="menubar-008"] [data-part="trigger"]{
appearance:none;border:0;background:none;cursor:pointer;
display:flex;align-items:center;gap:0.5rem;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;
}
[data-vibeui-block="menubar-008"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-008-hover)}
[data-vibeui-block="menubar-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-008-accent);outline-offset:-2px}
[data-vibeui-block="menubar-008"] [data-part="slot"]:has([data-part="menu"]:popover-open) [data-part="trigger"]{background:var(--vibeui-menubar-008-hover)}
[data-vibeui-block="menubar-008"] [data-part="bell"]{position:relative;width:1.875rem;padding:0;justify-content:center}
/* Значок с числом: сам он скрыт от скринридера, число уходит в aria-label кнопки. */
[data-vibeui-block="menubar-008"] [data-part="dot"]{
position:absolute;top:0.1875rem;right:0.1875rem;
min-width:0.875rem;height:0.875rem;padding:0 0.1875rem;box-sizing:border-box;
display:grid;place-items:center;border-radius:999px;
background:var(--vibeui-menubar-008-badge);color:var(--vibeui-menubar-008-on-badge);
font-size:0.5625rem;font-variant-numeric:tabular-nums;line-height:1;
}
[data-vibeui-block="menubar-008"] [data-part="face"]{
width:1.375rem;height:1.375rem;border-radius:999px;display:grid;place-items:center;
background:var(--vibeui-menubar-008-accent);color:var(--vibeui-menubar-008-on-badge);
font-size:0.625rem;font-weight:650;
}
[data-vibeui-block="menubar-008"] [data-part="who"]{max-width:8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* В узком блоке имя прячется: остаётся кружок, кнопка не выдавливает разделы. */
@container (max-width: 26rem){
[data-vibeui-block="menubar-008"] [data-part="who"]{display:none}
}
[data-vibeui-block="menubar-008"] [data-part="menu"]{
position:fixed;inset:auto;margin:0;
min-width:12rem;padding:0.25rem;box-sizing:border-box;
background:var(--vibeui-menubar-008-panel);color:var(--vibeui-menubar-008-fg);
border:1px solid var(--vibeui-menubar-008-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-008-font);
box-shadow:0 16px 36px -18px var(--vibeui-menubar-008-shadow);
}
@supports (anchor-name: --a){
[data-vibeui-block="menubar-008"] [data-part="trigger"]{anchor-name:var(--vibeui-menubar-008-anchor)}
[data-vibeui-block="menubar-008"] [data-part="menu"]{
position-anchor:var(--vibeui-menubar-008-anchor);
position-area:bottom span-right;margin-top:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
[data-vibeui-block="menubar-008"] [data-part="menu"][data-align="end"]{position-area:bottom span-left}
}
[data-vibeui-block="menubar-008"] [data-part="item"]{
display:block;width:100%;min-height:1.875rem;padding:0.3125rem 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-008"] [data-part="item"]:hover{background:var(--vibeui-menubar-008-hover)}
[data-vibeui-block="menubar-008"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-008-accent);outline-offset:-2px}
[data-vibeui-block="menubar-008"] [data-part="head"]{
padding:0.4375rem 0.5rem;border-bottom:1px solid var(--vibeui-menubar-008-border);
margin-bottom:0.25rem;font-size:0.75rem;color:var(--vibeui-menubar-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menubar008Menu[] = [
  { label: "Файл", items: ["Новый проект", "Открыть…", "Сохранить"] },
  { label: "Правка", items: ["Отменить", "Повторить", "Найти"] },
  { label: "Вид", items: ["Сетка", "Боковая панель"] },
]

const PROFILE_ITEMS = ["Профиль", "Рабочая область", "Выйти"]

const NOTIFICATIONS = [
  "Сборка прошла",
  "Комментарий к странице",
  "Домен подтверждён",
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
 * Строка меню с правой частью: уведомления и профиль.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Menubar008({
  menus = DEFAULT_MENUS,
  userName = "Анна Крылова",
  unread = 4,
  menubarLabel = "Меню приложения",
  notificationsLabel = "Уведомления, непрочитанных {count}",
  notificationsTitle = "Непрочитанные",
  notifications = NOTIFICATIONS,
  profileItems = PROFILE_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Menubar008Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menubar-008-bg": background,
          "--vibeui-menubar-008-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const initials = userName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)

  return (
    <>
      <style href="vibeui-menubar-008" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="menubar-008"
        className={className}
        style={palette}
      >
        <div data-part="shell" role="menubar" aria-label={menubarLabel}>
          {menus.map((menu, index) => {
            const id = `vibeui-menubar-008-${index}`
            const anchor = {
              "--vibeui-menubar-008-anchor": `--${id}`,
            } as CSSProperties

            return (
              <span key={menu.label} data-part="slot" style={anchor}>
                <button
                  type="button"
                  data-part="trigger"
                  role="menuitem"
                  aria-haspopup="menu"
                  popoverTarget={id}
                >
                  {menu.label}
                </button>
                <div id={id} data-part="menu" popover="auto" role="menu">
                  {menu.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      data-part="item"
                      role="menuitem"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </span>
            )
          })}
          <span data-part="right">
            <span
              data-part="slot"
              style={
                {
                  "--vibeui-menubar-008-anchor": "--vibeui-menubar-008-bell",
                } as CSSProperties
              }
            >
              <button
                type="button"
                data-part="trigger"
                role="menuitem"
                aria-haspopup="menu"
                aria-label={notificationsLabel.replace(
                  "{count}",
                  String(unread),
                )}
                popoverTarget="vibeui-menubar-008-bell-menu"
              >
                <span data-part="bell-glyph" aria-hidden="true">
                  ✉
                </span>
                <span data-part="dot" aria-hidden="true">
                  {unread}
                </span>
              </button>
              <div
                id="vibeui-menubar-008-bell-menu"
                data-part="menu"
                data-align="end"
                popover="auto"
                role="menu"
              >
                <p data-part="head">{notificationsTitle}</p>
                {notifications.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-part="item"
                    role="menuitem"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </span>
            <span
              data-part="slot"
              style={
                {
                  "--vibeui-menubar-008-anchor": "--vibeui-menubar-008-user",
                } as CSSProperties
              }
            >
              <button
                type="button"
                data-part="trigger"
                role="menuitem"
                aria-haspopup="menu"
                popoverTarget="vibeui-menubar-008-user-menu"
              >
                <span data-part="face" aria-hidden="true">
                  {initials}
                </span>
                <span data-part="who">{userName}</span>
              </button>
              <div
                id="vibeui-menubar-008-user-menu"
                data-part="menu"
                data-align="end"
                popover="auto"
                role="menu"
              >
                <p data-part="head">{userName}</p>
                {profileItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-part="item"
                    role="menuitem"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </span>
          </span>
        </div>
      </div>
    </>
  )
}
