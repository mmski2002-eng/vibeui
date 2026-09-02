import type { ComponentProps, CSSProperties } from "react"

export type Avatar012Props = Omit<ComponentProps<"div">, "children"> & {
  names?: string[]
  photos?: string[]
  action?: string
  target?: string
  /** Связка перед числом остальных: «и ещё 3». */
  moreText?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: стопка аватаров с подписью словами. Одни кружки не
// отвечают на вопрос «кто именно»: имена читаются, счётчик — нет. Подпись
// строится по правилу «двое и ещё N», а не перечислением всех: в списке из
// сорока участников строка иначе занимает три экрана.
const STYLES = `
:where([data-vibeui-block="avatar-012"]){
--vibeui-avatar-012-size:2.5rem;
--vibeui-avatar-012-overlap:0.5rem;
--vibeui-avatar-012-bg:transparent;
--vibeui-avatar-012-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-012-muted:color-mix(in oklab,var(--vibeui-avatar-012-fg) 68%,transparent);
--vibeui-avatar-012-border:light-dark(oklch(0.9 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-012-ring:light-dark(oklch(1 0 0),oklch(0.19 0.01 265));
--vibeui-avatar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-012"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;max-width:24rem;padding:0.625rem 0.75rem;
background:var(--vibeui-avatar-012-bg);
border:1px solid var(--vibeui-avatar-012-border);border-radius:9999px;
color:var(--vibeui-avatar-012-fg);font-family:var(--vibeui-avatar-012-font);
}
[data-vibeui-block="avatar-012"] [data-part="stack"]{display:flex;align-items:center;flex:none}
[data-vibeui-block="avatar-012"] [data-part="item"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-012-size);height:var(--vibeui-avatar-012-size);
border-radius:9999px;box-shadow:0 0 0 2px var(--vibeui-avatar-012-ring);
background:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-012-hue,250)),oklch(0.34 0.065 var(--vibeui-avatar-012-hue,250)));
color:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-012-hue,250)),oklch(0.88 0.063 var(--vibeui-avatar-012-hue,250)));
font-size:calc(var(--vibeui-avatar-012-size) * 0.36);font-weight:650;line-height:1;
user-select:none;
}
[data-vibeui-block="avatar-012"] [data-part="item"] + [data-part="item"]{margin-left:calc(var(--vibeui-avatar-012-overlap) * -1)}
[data-vibeui-block="avatar-012"] [data-part="item"]{overflow:hidden}
[data-vibeui-block="avatar-012"] [data-part="item"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
[data-vibeui-block="avatar-012"] [data-part="item"]:nth-child(1){z-index:3}
[data-vibeui-block="avatar-012"] [data-part="item"]:nth-child(2){z-index:2}
[data-vibeui-block="avatar-012"] [data-part="item"]:nth-child(3){z-index:1}
/* Подпись режется многоточием: строка обязана остаться однострочной. */
[data-vibeui-block="avatar-012"] [data-part="caption"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.8125rem;line-height:1.3;color:var(--vibeui-avatar-012-muted);
}
[data-vibeui-block="avatar-012"] [data-part="caption"] b{color:var(--vibeui-avatar-012-fg);font-weight:600}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-012"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Марк Ильин",
  "Мария Гурова",
  "Олег Дроздов",
  "Ирина Ким",
  "Пётр Гай",
]

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

function first(name: string) {
  return name.split(" ")[0]
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
 * Стопка аватаров с подписью словами: «Анна, Марк и ещё трое».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar012({
  background = "",
  names = DEFAULT_NAMES,
  photos = [],
  action = "отметили",
  target = "макет каталога",
  moreText = "и ещё",
  textColor,
  className,
  style,
  ...props
}: Avatar012Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-avatar-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-012-fg": textColor } : null),
    ...style,
  } as CSSProperties

  const shown = names.slice(0, 3)
  const rest = names.length - 2

  return (
    <>
      <style href="vibeui-avatar-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-012"
        className={className}
        style={palette}
      >
        <span data-part="stack" aria-hidden="true">
          {shown.map((name, index) => (
            <span
              key={name}
              data-part="item"
              style={{ "--vibeui-avatar-012-hue": hue(name) } as CSSProperties}
            >
              {photos[index] ? (
                <img src={photos[index]} alt="" />
              ) : (
                initials(name)
              )}
            </span>
          ))}
        </span>
        <span data-part="caption">
          <b>{first(names[0])}</b>
          {names.length > 1 ? (
            <>
              , <b>{first(names[1])}</b>
            </>
          ) : null}
          {rest > 0 ? ` ${moreText} ${rest}` : ""} {action} {target}
        </span>
      </div>
    </>
  )
}
