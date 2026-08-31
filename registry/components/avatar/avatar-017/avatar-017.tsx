import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar017Props = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  name?: string
  role?: string
  meta?: string
  action?: string
}

// Идея компонента: строка человека, кликабельная целиком. Ссылка растянута
// псевдоэлементом, а кнопка справа поднята над ней z-index: открыть профиль и
// написать сообщение — разные действия, и объединять их в одну цель нельзя.
// Обводка фокуса ставится на строку через :has(), поэтому с клавиатуры видно
// всю цель, а не подчёркнутое имя. Роль и служебная строка разведены по
// начертанию: две одинаковые серые строки сливаются в одну.
const STYLES = `
:where([data-vibeui-block="avatar-017"]){
--vibeui-avatar-017-size:2.5rem;
--vibeui-avatar-017-bg:oklch(1 0 0);
--vibeui-avatar-017-fg:oklch(0.24 0.014 265);
--vibeui-avatar-017-muted:oklch(0.55 0.014 265);
--vibeui-avatar-017-border:oklch(0.91 0.006 265);
--vibeui-avatar-017-hover:oklch(0.55 0.02 265 / 5%);
--vibeui-avatar-017-accent:oklch(0.55 0.2 262);
--vibeui-avatar-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Строка целиком — цель ссылки, кнопка поднята над ней z-index. */
[data-vibeui-block="avatar-017"]{
position:relative;display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;max-width:24rem;padding:0.5rem 0.625rem;
background:var(--vibeui-avatar-017-bg);
border:1px solid var(--vibeui-avatar-017-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-017-font);color:var(--vibeui-avatar-017-fg);
}
[data-vibeui-block="avatar-017"] *{box-sizing:border-box}
[data-vibeui-block="avatar-017"]:hover{background:var(--vibeui-avatar-017-hover)}
[data-vibeui-block="avatar-017"]:has(a:focus-visible){outline:2px solid var(--vibeui-avatar-017-accent);outline-offset:2px}
[data-vibeui-block="avatar-017"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-017-size);height:var(--vibeui-avatar-017-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-017-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-017-hue,265));
font-size:calc(var(--vibeui-avatar-017-size) * 0.34);font-weight:700;
}
[data-vibeui-block="avatar-017"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="avatar-017"] [data-part="name"]{
margin:0;font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-017"] [data-part="name"] a{color:inherit;text-decoration:none}
[data-vibeui-block="avatar-017"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
/* Роль и служебная строка разведены начертанием: серое на сером сливается. */
[data-vibeui-block="avatar-017"] [data-part="role"]{
margin:0;font-size:0.75rem;font-weight:600;color:var(--vibeui-avatar-017-fg);
}
[data-vibeui-block="avatar-017"] [data-part="meta"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-avatar-017-muted);
}
[data-vibeui-block="avatar-017"] [data-part="action"]{
position:relative;z-index:1;flex:none;
appearance:none;cursor:pointer;height:1.875rem;padding:0 0.625rem;
border:1px solid var(--vibeui-avatar-017-border);border-radius:0.5rem;
background:var(--vibeui-avatar-017-bg);color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="avatar-017"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-avatar-017-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-017"] *{animation:none!important;transition:none!important}}
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
 * Строка человека: ссылка на всю строку, кнопка действия — отдельная цель.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar017({
  name = "Ким Сон",
  role = "Аналитик",
  meta = "был в сети 20 минут назад",
  action = "Написать",
  href = "#",
  className,
  style,
  ...props
}: Avatar017Props) {
  const palette = {
    "--vibeui-avatar-017-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-017" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="avatar-017" className={className} style={palette}>
        <span data-part="face" aria-hidden="true">
          {initials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">
            <a {...props} href={href}>
              {name}
            </a>
          </span>
          <span data-part="role">{role}</span>
          <span data-part="meta">{meta}</span>
        </span>
        <button
          type="button"
          data-part="action"
          aria-label={`${action}: ${name}`}
        >
          {action}
        </button>
      </div>
    </>
  )
}
