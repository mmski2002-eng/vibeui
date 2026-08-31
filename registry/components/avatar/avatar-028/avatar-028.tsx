import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar028Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  email?: string
  items?: string[]
  signOutLabel?: string
}

// Идея компонента: аватар в шапке, который сам открывает меню профиля. Меню —
// нативный HTML popover, поэтому Escape, клик мимо и верхний слой достаются от
// браузера, а компонент остаётся серверным: состояния здесь нет вовсе.
// В шапке меню повторены имя и почта — в продуктах с несколькими аккаунтами
// это единственное место, где видно, под кем ты сидишь. Выход отделён чертой:
// соседство с «настройками» стоит случайного выхода из системы.
const STYLES = `
:where([data-vibeui-block="avatar-028"]){
--vibeui-avatar-028-size:2.25rem;
--vibeui-avatar-028-bg:oklch(1 0 0);
--vibeui-avatar-028-fg:oklch(0.24 0.014 265);
--vibeui-avatar-028-muted:oklch(0.55 0.014 265);
--vibeui-avatar-028-border:oklch(0.91 0.006 265);
--vibeui-avatar-028-hover:oklch(0.55 0.02 265 / 9%);
--vibeui-avatar-028-accent:oklch(0.55 0.2 262);
--vibeui-avatar-028-danger:oklch(0.56 0.19 25);
--vibeui-avatar-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-028"]{
display:inline-block;font-family:var(--vibeui-avatar-028-font);
}
[data-vibeui-block="avatar-028"] *{box-sizing:border-box}
[data-vibeui-block="avatar-028"] [data-part="trigger"]{
display:grid;place-items:center;
appearance:none;cursor:pointer;padding:0;
width:var(--vibeui-avatar-028-size);height:var(--vibeui-avatar-028-size);
border:0;border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-028-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-028-hue,265));
font:inherit;font-size:calc(var(--vibeui-avatar-028-size) * 0.36);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-028"] [data-part="trigger"]:hover{box-shadow:0 0 0 0.1875rem oklch(0.55 0.02 265 / 16%)}
[data-vibeui-block="avatar-028"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-avatar-028-accent);outline-offset:2px}
[data-vibeui-block="avatar-028"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:14rem;
border:1px solid var(--vibeui-avatar-028-border);border-radius:0.75rem;
background:var(--vibeui-avatar-028-bg);color:var(--vibeui-avatar-028-fg);
box-shadow:0 18px 40px -20px oklch(0.2 0.03 265 / 45%);
font-family:var(--vibeui-avatar-028-font);
}
/* Якорь привязывает меню к аватару; без поддержки оно встанет по центру. */
@supports (anchor-name: --a){
[data-vibeui-block="avatar-028"] [data-part="trigger"]{anchor-name:--vibeui-avatar-028-anchor}
[data-vibeui-block="avatar-028"] [data-part="menu"]{
position-anchor:--vibeui-avatar-028-anchor;
position-area:bottom span-left;margin-top:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Шапка меню: под каким аккаунтом ты сидишь, видно только здесь. */
[data-vibeui-block="avatar-028"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.0625rem;
padding:0.5rem 0.5rem 0.625rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-avatar-028-border);
}
[data-vibeui-block="avatar-028"] [data-part="head-name"]{
font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-028"] [data-part="head-mail"]{
font-size:0.75rem;color:var(--vibeui-avatar-028-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-028"] [data-part="item"]{
display:flex;align-items:center;width:100%;
min-height:2.125rem;padding:0 0.5rem;border-radius:0.5rem;
appearance:none;border:0;background:none;cursor:pointer;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="avatar-028"] [data-part="item"]:hover{background:var(--vibeui-avatar-028-hover)}
[data-vibeui-block="avatar-028"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-avatar-028-accent);outline-offset:-2px}
/* Выход отделён: соседство с настройками стоит случайного выхода. */
[data-vibeui-block="avatar-028"] [data-danger="true"]{
margin-top:0.3125rem;padding-top:0.625rem;min-height:2.375rem;
border-top:1px solid var(--vibeui-avatar-028-border);border-radius:0 0 0.5rem 0.5rem;
color:var(--vibeui-avatar-028-danger);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-028"] *{animation:none!important;transition:none!important}}
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
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Аватар-кнопка с меню профиля на нативном popover: состояния нет, компонент серверный.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar028({
  name = "Анна Реброва",
  email = "anna@vibeui.dev",
  items = ["Профиль", "Настройки", "Оформление"],
  signOutLabel = "Выйти",
  className,
  style,
  ...props
}: Avatar028Props) {
  const palette = {
    "--vibeui-avatar-028-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-028" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-028"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          popoverTarget="vibeui-avatar-028-menu"
          aria-haspopup="menu"
          aria-label={`Меню профиля: ${name}`}
        >
          <span aria-hidden="true">{initials(name)}</span>
        </button>
        <div
          id="vibeui-avatar-028-menu"
          data-part="menu"
          popover="auto"
          role="menu"
        >
          <div data-part="head">
            <span data-part="head-name">{name}</span>
            <span data-part="head-mail">{email}</span>
          </div>
          {items.map((item) => (
            <button key={item} type="button" data-part="item" role="menuitem">
              {item}
            </button>
          ))}
          <button
            type="button"
            data-part="item"
            data-danger="true"
            role="menuitem"
          >
            {signOutLabel}
          </button>
        </div>
      </div>
    </>
  )
}
