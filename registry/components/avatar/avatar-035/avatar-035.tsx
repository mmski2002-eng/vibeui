import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar035Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  kind?: "person" | "organisation" | "creator"
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  kindText?: Record<string, string>
  since?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: знак подтверждения стоит после имени, а не в углу портрета.
// Подтверждают имя, а не фотографию: в углу аватара галочка соседствует с
// присутствием и ролью и теряется среди них, а рядом с именем она читается
// как часть подписи и переезжает вместе с ней в любую строку. Три вида
// подтверждения различаются формой знака — круг, квадрат, шестиугольник, — и
// каждый расшифрован словами во второй строке: галочка сама по себе немая.
const STYLES = `
:where([data-vibeui-block="avatar-035"]){
--vibeui-avatar-035-size:2.5rem;
--vibeui-avatar-035-tick:1rem;
--vibeui-avatar-035-bg:transparent;
--vibeui-avatar-035-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-035-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.01 265));
--vibeui-avatar-035-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-035-person:oklch(0.55 0.2 262);
--vibeui-avatar-035-org:oklch(0.55 0.13 195);
--vibeui-avatar-035-creator:oklch(0.62 0.17 320);
--vibeui-avatar-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-035"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:20rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-035-bg);
border:1px solid var(--vibeui-avatar-035-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-035-font);color:var(--vibeui-avatar-035-fg);
}
[data-vibeui-block="avatar-035"] *{box-sizing:border-box}
[data-vibeui-block="avatar-035"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-035-size);height:var(--vibeui-avatar-035-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-035-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-035-hue,265));
font-size:calc(var(--vibeui-avatar-035-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-035"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0;flex:1 1 auto}
/* Знак — часть подписи: он стоит в строке имени, а не в углу портрета. */
[data-vibeui-block="avatar-035"] [data-part="name"]{
display:flex;align-items:center;gap:0.3125rem;min-width:0;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="avatar-035"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-035"] [data-part="badge"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-035-tick);height:var(--vibeui-avatar-035-tick);
border-radius:9999px;background:var(--vibeui-avatar-035-person);
}
/* Форма знака различает вид подтверждения, а не только цвет. */
[data-vibeui-block="avatar-035"][data-kind="organisation"] [data-part="badge"]{
border-radius:0.25rem;background:var(--vibeui-avatar-035-org);
}
[data-vibeui-block="avatar-035"][data-kind="creator"] [data-part="badge"]{
border-radius:0;background:var(--vibeui-avatar-035-creator);
clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
}
/* Галочка на двух бордюрах: иконочный пакет ради неё не нужен. */
[data-vibeui-block="avatar-035"] [data-part="badge"]::after{
content:"";width:0.1875rem;height:0.375rem;
border:solid oklch(1 0 0);border-width:0 0.09375rem 0.09375rem 0;
transform:translateY(-0.0625rem) rotate(45deg);
}
[data-vibeui-block="avatar-035"] [data-part="since"]{
font-size:0.75rem;color:var(--vibeui-avatar-035-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-035"] *{animation:none!important;transition:none!important}}
`

const KIND_LABEL: Record<string, string> = {
  person: "Личность подтверждена",
  organisation: "Организация подтверждена",
  creator: "Автор подтверждён",
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
 * Аватар со знаком подтверждения в строке имени: вид различается формой знака.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar035({
  background = "",
  name = "Анна Реброва",
  kind = "person",
  kindText = KIND_LABEL,
  since = "с 12 марта 2025",
  className,
  style,
  ...props
}: Avatar035Props) {
  const palette = {
    "--vibeui-avatar-035-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-035-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-035" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-035"
        data-kind={kind}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {initials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">
            <span data-part="label">{name}</span>
            {/* Знак немой: расшифровку несёт строка под именем. */}
            <span data-part="badge" aria-hidden="true" />
          </span>
          <span data-part="since">
            {kindText[kind] ?? KIND_LABEL[kind]} {since}
          </span>
        </span>
      </div>
    </>
  )
}
