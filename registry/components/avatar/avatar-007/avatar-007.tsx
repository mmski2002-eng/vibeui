import type { ComponentProps, CSSProperties } from "react"

export type Avatar007Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  role?: string
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  meta?: string
  src?: string
  href?: string
  status?: "online" | "away" | "offline"
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет основного текста. Пусто — берётся из темы окружения. */
  textColor?: string
  /** Цвет приглушённого текста. Пусто — выводится из основного. */
  mutedColor?: string
}

// Идея компонента: строка личности — аватар и три поля текста. Имя, роль и
// служебная строка стоят в порядке убывания важности и режутся многоточием, а
// не переносятся: в списке из тридцати человек строки обязаны быть одной
// высоты. Статус подписан словом, а не только точкой — цвет не для всех.
const STYLES = `:where([data-vibeui-block="avatar-007"]){
--vibeui-avatar-007-size:2.5rem;
--vibeui-avatar-007-bg:transparent;
--vibeui-avatar-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-007-muted:color-mix(in oklab,var(--vibeui-avatar-007-fg) 68%,transparent);
--vibeui-avatar-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-007-hue:250;
--vibeui-avatar-007-shape:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-007-hue)),oklch(0.34 0.065 var(--vibeui-avatar-007-hue)));
--vibeui-avatar-007-initials:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-007-hue)),oklch(0.88 0.063 var(--vibeui-avatar-007-hue)));
--vibeui-avatar-007-status:light-dark(oklch(0.62 0.17 152),oklch(0.76 0.17 152));
--vibeui-avatar-007-accent:light-dark(oklch(0.55 0.17 265),oklch(0.69 0.17 265));
--vibeui-avatar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-007"]{
container-type:inline-size;flex-wrap:wrap;
position:relative;display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:22rem;padding:0.75rem;
background:var(--vibeui-avatar-007-bg);
border:1px solid var(--vibeui-avatar-007-border);border-radius:0.75rem;
color:var(--vibeui-avatar-007-fg);font-family:var(--vibeui-avatar-007-font);
}
[data-vibeui-block="avatar-007"][data-status="away"]{--vibeui-avatar-007-status:oklch(0.75 0.16 75)}
[data-vibeui-block="avatar-007"][data-status="offline"]{--vibeui-avatar-007-status:light-dark(oklch(0.72 0.012 265),oklch(0.42 0.012 265))}
[data-vibeui-block="avatar-007"] [data-part="shape"]{
position:relative;display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-007-size);height:var(--vibeui-avatar-007-size);
overflow:hidden;border-radius:9999px;
background:var(--vibeui-avatar-007-shape);color:var(--vibeui-avatar-007-initials);
font-size:calc(var(--vibeui-avatar-007-size) * 0.34);font-weight:650;line-height:1;user-select:none;
}
[data-vibeui-block="avatar-007"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="avatar-007"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
/* Обрезка вместо переноса: строки списка обязаны быть одной высоты. */
[data-vibeui-block="avatar-007"] [data-part="name"],
[data-vibeui-block="avatar-007"] [data-part="role"],
[data-vibeui-block="avatar-007"] [data-part="meta"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-007"] [data-part="name"]{font-size:0.9375rem;font-weight:600;line-height:1.25}
[data-vibeui-block="avatar-007"] [data-part="role"]{font-size:0.8125rem;line-height:1.3;color:var(--vibeui-avatar-007-muted)}
[data-vibeui-block="avatar-007"] [data-part="meta"]{font-size:0.75rem;line-height:1.3;color:var(--vibeui-avatar-007-muted)}
[data-vibeui-block="avatar-007"] a{color:inherit;text-decoration:none}
/* Ссылка растянута на всю карточку: попадать надо в строку, а не в имя. */
[data-vibeui-block="avatar-007"] a::after{content:"";position:absolute;inset:0;border-radius:inherit}
[data-vibeui-block="avatar-007"] a:focus-visible{outline:none}
[data-vibeui-block="avatar-007"]:has(a:focus-visible){outline:2px solid var(--vibeui-avatar-007-accent);outline-offset:2px}
[data-vibeui-block="avatar-007"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.3125rem;margin-left:auto;flex:none;
font-size:0.75rem;color:var(--vibeui-avatar-007-muted);
}
[data-vibeui-block="avatar-007"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-avatar-007-status);
}
@container (max-width: 20rem){
[data-vibeui-block="avatar-007"] [data-part="state"]{width:100%;margin-left:calc(var(--vibeui-avatar-007-size) + 0.75rem);justify-content:flex-start}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-007"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-007"] *{animation:none!important;transition:none!important}}
`

const STATUS_TEXT: Record<string, string> = {
  online: "в сети",
  away: "отошёл",
  offline: "не в сети",
}

// Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга.
// Сумма кодов символов не годится — кириллические имена ложатся в один
// розовый сектор; ступени в 30° дают заведомо различимые цвета.
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
 * Строка личности: аватар, имя, роль и подписанный словом статус.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar007({
  background = "",
  name = "Мария Гурова",
  role = "Продуктовый дизайнер",
  meta = "Команда «Каталог» · Москва",
  src = "",
  href = "#",
  status = "online",
  statusText = STATUS_TEXT,
  textColor,
  mutedColor,
  className,
  style,
  ...props
}: Avatar007Props) {
  const palette = {
    "--vibeui-avatar-007-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-007-fg": textColor } : null),
    ...(mutedColor ? { "--vibeui-avatar-007-muted": mutedColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-007"
        data-status={status}
        className={className}
        style={palette}
      >
        <span data-part="shape" aria-hidden="true">
          {src ? (
            <img src={src} alt="" loading="lazy" decoding="async" />
          ) : (
            initials(name)
          )}
        </span>
        <span data-part="text">
          <span data-part="name">
            {href ? <a href={href}>{name}</a> : name}
          </span>
          {role ? <span data-part="role">{role}</span> : null}
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
        <span data-part="state">
          <span data-part="dot" aria-hidden="true" />
          {statusText[status] ?? STATUS_TEXT[status]}
        </span>
      </div>
    </>
  )
}
