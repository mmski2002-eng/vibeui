import type { ComponentProps, CSSProperties } from "react"

export type Avatar022Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  src?: string
  typing?: boolean
  idleText?: string
  /** Подпись во время набора текста. */
  typingText?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: аватар с индикатором набора текста. Пузырёк с точками висит
// на портрете, но состояние продублировано строкой в role="status": три
// прыгающие точки для скринридера — пустой элемент, а «печатает» он прочитает.
// Строка держит одну и ту же высоту в обоих состояниях, поэтому список
// участников не дёргается, когда кто-то начинает и перестаёт печатать.
const STYLES = `
:where([data-vibeui-block="avatar-022"]){
--vibeui-avatar-022-size:2.5rem;
--vibeui-avatar-022-bg:transparent;
--vibeui-avatar-022-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-avatar-022-muted:color-mix(in oklab,var(--vibeui-avatar-022-fg) 68%,transparent);
--vibeui-avatar-022-border:light-dark(oklch(0.91 0 265),oklch(0.31 0 265));
--vibeui-avatar-022-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.69 0.2 39.8));
--vibeui-avatar-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-022"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;max-width:20rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-022-bg);
border:1px solid var(--vibeui-avatar-022-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-022-font);color:var(--vibeui-avatar-022-fg);
}
[data-vibeui-block="avatar-022"] *{box-sizing:border-box}
[data-vibeui-block="avatar-022"] [data-part="slot"]{position:relative;flex:none}
[data-vibeui-block="avatar-022"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-022-size);height:var(--vibeui-avatar-022-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-022-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-022-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-022-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-022-hue,265)));
font-size:calc(var(--vibeui-avatar-022-size) * 0.34);font-weight:700;line-height:1;
}
/* Пузырёк отделён обводкой цвета карточки: карточка своя, цвет известен. */
[data-vibeui-block="avatar-022"] [data-part="bubble"]{
position:absolute;right:-0.25rem;bottom:-0.1875rem;
display:flex;align-items:center;gap:0.125rem;
height:1.0625rem;padding:0 0.3125rem;border-radius:9999px;
background:var(--vibeui-avatar-022-accent);
box-shadow:0 0 0 0.125rem var(--vibeui-avatar-022-bg);
}
[data-vibeui-block="avatar-022"] [data-part="dot"]{
/* Точки белые в обеих темах: они лежат на акцентном пузырьке, а не на странице. */
width:0.1875rem;height:0.1875rem;border-radius:9999px;background:oklch(1 0 0);
animation:vibeui-avatar-022-blink 1.2s infinite ease-in-out;
}
[data-vibeui-block="avatar-022"] [data-part="dot"]:nth-child(2){animation-delay:.15s}
[data-vibeui-block="avatar-022"] [data-part="dot"]:nth-child(3){animation-delay:.3s}
@keyframes vibeui-avatar-022-blink{
0%,60%,100%{opacity:.35;transform:translateY(0)}
30%{opacity:1;transform:translateY(-0.125rem)}
}
[data-vibeui-block="avatar-022"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="avatar-022"] [data-part="name"]{
font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Одна высота в обоих состояниях: список не дёргается. */
[data-vibeui-block="avatar-022"] [data-part="state"]{
min-height:1.0625rem;font-size:0.75rem;line-height:1.0625rem;
color:var(--vibeui-avatar-022-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-022"][data-typing="true"] [data-part="state"]{color:var(--vibeui-avatar-022-accent)}
[data-vibeui-block="avatar-022"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-022"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-022"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-022"] *{animation:none!important;transition:none!important}}
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
 * Аватар с индикатором набора текста: пузырёк с точками и та же мысль словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar022({
  background = "",
  name = "Анна Реброва",
  src,
  typing = true,
  idleText = "в сети",
  typingText = "печатает…",
  textColor,
  className,
  style,
  ...props
}: Avatar022Props) {
  const palette = {
    "--vibeui-avatar-022-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-022-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-022"
        data-typing={typing}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="face" aria-hidden="true">
            {src ? <img src={src} alt="" /> : initials(name)}
          </span>
          {typing ? (
            <span data-part="bubble" aria-hidden="true">
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="dot" />
            </span>
          ) : null}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          {/* Точки для скринридера — пустое место, состояние несёт эта строка. */}
          <span data-part="state" role="status">
            {typing ? typingText : idleText}
          </span>
        </span>
      </div>
    </>
  )
}
