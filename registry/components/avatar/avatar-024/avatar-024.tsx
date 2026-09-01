import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar024Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  country?: "fr" | "de" | "it" | "jp"
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  countryText?: Record<string, string>
  city?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: аватар с флагом страны в углу. Флаг нарисован градиентами,
// а не эмодзи: эмодзи-флаги на Windows рисуются двумя буквами, и «FR» вместо
// полотнища ломает всю затею. Флажок прямоугольный — круглый значок в углу
// уже занят присутствием, и путать эти смыслы нельзя. Страна продублирована
// словом в строке под именем: полоски без подписи угадываются не всеми.
const STYLES = `:where([data-vibeui-block="avatar-024"]){
--vibeui-avatar-024-size:2.75rem;
--vibeui-avatar-024-flag:1.375rem;
--vibeui-avatar-024-bg:transparent;
--vibeui-avatar-024-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-024-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.01 265));
--vibeui-avatar-024-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-024"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:18rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-024-bg);
border:1px solid var(--vibeui-avatar-024-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-024-font);color:var(--vibeui-avatar-024-fg);
}
[data-vibeui-block="avatar-024"] *{box-sizing:border-box}
[data-vibeui-block="avatar-024"] [data-part="slot"]{position:relative;flex:none}
[data-vibeui-block="avatar-024"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-024-size);height:var(--vibeui-avatar-024-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-024-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-024-hue,265));
font-size:calc(var(--vibeui-avatar-024-size) * 0.34);font-weight:700;line-height:1;
}
/* Прямоугольник, а не кружок: круглый значок в углу занят присутствием. */
[data-vibeui-block="avatar-024"] [data-part="flag"]{
position:absolute;right:-0.25rem;bottom:-0.125rem;
width:var(--vibeui-avatar-024-flag);
height:calc(var(--vibeui-avatar-024-flag) * 0.67);
border-radius:0.1875rem;overflow:hidden;
box-shadow:0 0 0 0.125rem var(--vibeui-avatar-024-bg),inset 0 0 0 1px light-dark(oklch(0.2 0 0 / 18%),oklch(0.86 0 0 / 18%));
}
[data-vibeui-block="avatar-024"][data-country="fr"] [data-part="flag"]{background:linear-gradient(90deg,#0055a4 0 33.34%,#ffffff 33.34% 66.67%,#ef4135 66.67%)}
[data-vibeui-block="avatar-024"][data-country="de"] [data-part="flag"]{background:linear-gradient(180deg,#000000 0 33.34%,#dd0000 33.34% 66.67%,#ffce00 66.67%)}
[data-vibeui-block="avatar-024"][data-country="it"] [data-part="flag"]{background:linear-gradient(90deg,#008c45 0 33.34%,#f4f5f0 33.34% 66.67%,#cd212a 66.67%)}
[data-vibeui-block="avatar-024"][data-country="jp"] [data-part="flag"]{background:radial-gradient(circle at 50% 50%,#bc002d 0 32%,#ffffff 32%)}
[data-vibeui-block="avatar-024"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="avatar-024"] [data-part="name"]{
font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-024"] [data-part="place"]{
font-size:0.75rem;color:var(--vibeui-avatar-024-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-024"] *{animation:none!important;transition:none!important}}
`

const COUNTRY_LABEL: Record<string, string> = {
  fr: "Франция",
  de: "Германия",
  it: "Италия",
  jp: "Япония",
}

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
 * Аватар с флагом страны в углу: флаг нарисован градиентом, страна названа словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar024({
  background = "",
  name = "Люси Мартен",
  country = "fr",
  countryText = COUNTRY_LABEL,
  city = "Лион",
  className,
  style,
  ...props
}: Avatar024Props) {
  const palette = {
    "--vibeui-avatar-024-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-024"
        data-country={country}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          <span data-part="flag" aria-hidden="true" />
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          {/* Страна словом: полоски флага угадываются не всеми. */}
          <span data-part="place">
            {city}, {countryText[country] ?? COUNTRY_LABEL[country]}
          </span>
        </span>
      </div>
    </>
  )
}
