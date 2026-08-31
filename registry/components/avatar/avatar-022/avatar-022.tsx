import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar022Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  typing?: boolean
  idleText?: string
}

// Идея компонента: аватар с индикатором набора текста. Пузырёк с точками висит
// на портрете, но состояние продублировано строкой в role="status": три
// прыгающие точки для скринридера — пустой элемент, а «печатает» он прочитает.
// Строка держит одну и ту же высоту в обоих состояниях, поэтому список
// участников не дёргается, когда кто-то начинает и перестаёт печатать.
const STYLES = `
:where([data-vibeui-block="avatar-022"]){
--vibeui-avatar-022-size:2.75rem;
--vibeui-avatar-022-bg:oklch(1 0 0);
--vibeui-avatar-022-fg:oklch(0.24 0.014 265);
--vibeui-avatar-022-muted:oklch(0.55 0.014 265);
--vibeui-avatar-022-border:oklch(0.91 0.006 265);
--vibeui-avatar-022-accent:oklch(0.55 0.2 262);
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
background:oklch(0.9 0.06 var(--vibeui-avatar-022-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-022-hue,265));
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
 * Аватар с индикатором набора текста: пузырёк с точками и та же мысль словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar022({
  name = "Анна Реброва",
  typing = true,
  idleText = "в сети",
  className,
  style,
  ...props
}: Avatar022Props) {
  const palette = {
    "--vibeui-avatar-022-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-022"
        data-typing={typing}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="face" aria-hidden="true">
            {initials(name)}
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
            {typing ? "печатает…" : idleText}
          </span>
        </span>
      </div>
    </>
  )
}
