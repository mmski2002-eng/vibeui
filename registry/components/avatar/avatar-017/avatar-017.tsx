import type { ComponentProps, CSSProperties } from "react"

export type Avatar017Props = Omit<ComponentProps<"a">, "children"> & {
  name?: string
  src?: string
  role?: string
  meta?: string
  action?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
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
--vibeui-avatar-017-bg:transparent;
--vibeui-avatar-017-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-017-muted:color-mix(in oklab,var(--vibeui-avatar-017-fg) 68%,transparent);
--vibeui-avatar-017-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-017-hover:oklch(0.55 0.02 265 / 5%);
--vibeui-avatar-017-accent:light-dark(oklch(0.55 0.2 262),oklch(0.69 0.2 262));
--vibeui-avatar-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Строка целиком — цель ссылки, кнопка поднята над ней z-index. */
[data-vibeui-block="avatar-017"]{
container-type:inline-size;flex-wrap:wrap;
position:relative;display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:24rem;padding:0.5rem 0.625rem;
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
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-017-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-017-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-017-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-017-hue,265)));
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
[data-vibeui-block="avatar-017"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-017"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
@container (max-width: 22rem){
[data-vibeui-block="avatar-017"] [data-part="action"]{width:100%;margin-left:calc(var(--vibeui-avatar-017-size) + 0.625rem)}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-017"]{color-scheme:dark}
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
 * Строка человека: ссылка на всю строку, кнопка действия — отдельная цель.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar017({
  background = "",
  name = "Ирина Ким",
  src,
  role = "Аналитик",
  meta = "был в сети 20 минут назад",
  action = "Написать",
  href = "#",
  textColor,
  className,
  style,
  ...props
}: Avatar017Props) {
  const palette = {
    "--vibeui-avatar-017-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-017-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-017" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="avatar"
        data-vibeui-block="avatar-017"
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {src ? <img src={src} alt="" /> : initials(name)}
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
