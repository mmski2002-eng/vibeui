import type { ComponentProps, CSSProperties } from "react"

export type Avatar019Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  src?: string
  handle?: string
  bio?: string
  stats?: { label: string; value: string }[]
  action?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: карточка человека под наведение. Она не всплывает сама:
// всплывающая карточка на сенсорном экране либо не появляется, либо
// перекрывает то, на что нажали. Здесь это обычная карточка, которую
// вызывающий код кладёт в hover-card или popover по своему усмотрению.
// Показатели набраны табличными цифрами и стоят в ряд по три — четвёртый
// ломает строку на узком экране, поэтому лишние отбрасываются в разметке.
const STYLES = `
:where([data-vibeui-block="avatar-019"]){
--vibeui-avatar-019-size:2.5rem;
--vibeui-avatar-019-bg:transparent;
--vibeui-avatar-019-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-019-muted:color-mix(in oklab,var(--vibeui-avatar-019-fg) 68%,transparent);
--vibeui-avatar-019-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-019-accent:light-dark(oklch(0.55 0.2 262),oklch(0.69 0.2 262));
--vibeui-avatar-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-019"]{
container-type:inline-size;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,15rem);max-width:19rem;padding:0.875rem;
background:var(--vibeui-avatar-019-bg);
border:1px solid var(--vibeui-avatar-019-border);border-radius:0.875rem;
box-shadow:0 16px 36px -24px oklch(0.2 0.03 265 / 35%);
font-family:var(--vibeui-avatar-019-font);color:var(--vibeui-avatar-019-fg);
}
[data-vibeui-block="avatar-019"] *{box-sizing:border-box}
[data-vibeui-block="avatar-019"] [data-part="head"]{display:flex;align-items:center;gap:0.625rem;margin-bottom:0.625rem}
[data-vibeui-block="avatar-019"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-019-size);height:var(--vibeui-avatar-019-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-019-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-019-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-019-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-019-hue,265)));
font-size:calc(var(--vibeui-avatar-019-size) * 0.34);font-weight:700;
}
[data-vibeui-block="avatar-019"] [data-part="name"]{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="avatar-019"] [data-part="handle"]{margin:0.0625rem 0 0;font-size:0.75rem;color:var(--vibeui-avatar-019-muted)}
[data-vibeui-block="avatar-019"] [data-part="bio"]{
margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-avatar-019-muted);
}
/* Три показателя в ряд: четвёртый ломает строку на узком экране. */
[data-vibeui-block="avatar-019"] dl{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:0 0 0.75rem;
padding:0.5rem 0;border-top:1px solid var(--vibeui-avatar-019-border);
border-bottom:1px solid var(--vibeui-avatar-019-border);
}
[data-vibeui-block="avatar-019"] dd{
margin:0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-019"] dt{font-size:0.625rem;color:var(--vibeui-avatar-019-muted)}
[data-vibeui-block="avatar-019"] [data-part="action"]{
width:100%;appearance:none;cursor:pointer;height:2.125rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-avatar-019-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="avatar-019"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-avatar-019-accent);outline-offset:2px}
[data-vibeui-block="avatar-019"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-019"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
@container (max-width: 18rem){
[data-vibeui-block="avatar-019"] [data-part="stats"]{flex-direction:column;gap:0.5rem}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-019"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS = [
  { label: "Установок", value: "412" },
  { label: "Блоков", value: "18" },
  { label: "В команде", value: "4" },
]

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
 * Карточка человека: содержимое для hover-card, но без всплытия по наведению.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar019({
  background = "",
  name = "Мария Гурова",
  src,
  handle = "@maria · Москва",
  bio = "Собирает интерфейсы из блоков и правит тексты так, чтобы их читали до конца.",
  stats = DEFAULT_STATS,
  action = "Написать сообщение",
  textColor,
  className,
  style,
  ...props
}: Avatar019Props) {
  const palette = {
    "--vibeui-avatar-019-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-019-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-019"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="face" aria-hidden="true">
            {src ? <img src={src} alt="" /> : initials(name)}
          </span>
          <div>
            <p data-part="name">{name}</p>
            <p data-part="handle">{handle}</p>
          </div>
        </div>

        <p data-part="bio">{bio}</p>

        <dl>
          {stats.slice(0, 3).map((stat) => (
            <div key={stat.label}>
              <dd>{stat.value}</dd>
              <dt>{stat.label}</dt>
            </div>
          ))}
        </dl>

        <button type="button" data-part="action">
          {action}
        </button>
      </div>
    </>
  )
}
