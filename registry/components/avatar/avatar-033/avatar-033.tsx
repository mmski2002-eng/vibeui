import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar033Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  state?: "speaking" | "listening" | "muted"
}

// Идея компонента: строка участника звонка. Кто говорит — видно по кольцу,
// которое расходится от портрета: движение ловится боковым зрением, а список
// из десяти человек глазами не сканируют. Но движение не может быть
// единственным признаком: в prefers-reduced-motion пульс заменяется ровным
// кольцом того же цвета, микрофон рисуется отдельным значком, а состояние
// названо словом. Значок микрофона нарисован псевдоэлементами — без иконок.
const STYLES = `
:where([data-vibeui-block="avatar-033"]){
--vibeui-avatar-033-size:2.5rem;
--vibeui-avatar-033-bg:oklch(1 0 0);
--vibeui-avatar-033-fg:oklch(0.24 0.014 265);
--vibeui-avatar-033-muted:oklch(0.55 0.014 265);
--vibeui-avatar-033-border:oklch(0.91 0.006 265);
--vibeui-avatar-033-live:oklch(0.62 0.15 152);
--vibeui-avatar-033-off:oklch(0.6 0.19 25);
--vibeui-avatar-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-033"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:19rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-033-bg);
border:1px solid var(--vibeui-avatar-033-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-033-font);color:var(--vibeui-avatar-033-fg);
}
[data-vibeui-block="avatar-033"] *{box-sizing:border-box}
[data-vibeui-block="avatar-033"] [data-part="slot"]{position:relative;display:grid;place-items:center;flex:none}
[data-vibeui-block="avatar-033"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-033-size);height:var(--vibeui-avatar-033-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-033-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-033-hue,265));
font-size:calc(var(--vibeui-avatar-033-size) * 0.34);font-weight:700;line-height:1;
}
/* Пульс расходится от портрета: движение ловится боковым зрением. */
[data-vibeui-block="avatar-033"] [data-part="pulse"]{
position:absolute;inset:0;border-radius:9999px;opacity:0;
box-shadow:0 0 0 0.125rem var(--vibeui-avatar-033-live);
}
[data-vibeui-block="avatar-033"][data-state="speaking"] [data-part="pulse"]{
opacity:1;animation:vibeui-avatar-033-pulse 1.5s infinite ease-out;
}
@keyframes vibeui-avatar-033-pulse{
from{transform:scale(1);opacity:.9}
to{transform:scale(1.35);opacity:0}
}
/* Значок микрофона: капсула на ножке, у выключенного — перечёркнутая. */
[data-vibeui-block="avatar-033"] [data-part="mic"]{
position:absolute;right:-0.3125rem;bottom:-0.25rem;
display:grid;place-items:center;width:1.125rem;height:1.125rem;
border-radius:9999px;background:var(--vibeui-avatar-033-live);
box-shadow:0 0 0 0.125rem var(--vibeui-avatar-033-bg);
}
[data-vibeui-block="avatar-033"] [data-part="mic"]::before{
content:"";width:0.25rem;height:0.4375rem;border-radius:9999px;background:oklch(1 0 0);
}
[data-vibeui-block="avatar-033"] [data-part="mic"]::after{
content:"";position:absolute;width:0.5rem;height:0.09375rem;border-radius:9999px;
background:oklch(1 0 0);transform:translateY(0.3125rem);
}
[data-vibeui-block="avatar-033"][data-state="muted"] [data-part="mic"]{background:var(--vibeui-avatar-033-off)}
[data-vibeui-block="avatar-033"][data-state="muted"] [data-part="mic"]::after{
width:0.75rem;transform:rotate(-45deg);
}
[data-vibeui-block="avatar-033"][data-state="listening"] [data-part="mic"]{background:oklch(0.62 0.02 265)}
[data-vibeui-block="avatar-033"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="avatar-033"] [data-part="name"]{
font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-033"] [data-part="state"]{font-size:0.75rem;color:var(--vibeui-avatar-033-muted)}
[data-vibeui-block="avatar-033"][data-state="speaking"] [data-part="state"]{color:var(--vibeui-avatar-033-live);font-weight:600}
[data-vibeui-block="avatar-033"][data-state="muted"] [data-part="state"]{color:var(--vibeui-avatar-033-off)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-033"] *{animation:none!important;transition:none!important}
/* Без движения состояние всё равно видно: ровное кольцо того же цвета. */
[data-vibeui-block="avatar-033"][data-state="speaking"] [data-part="pulse"]{transform:scale(1.2);opacity:1}
}
`

const STATE_LABEL = {
  speaking: "говорит",
  listening: "микрофон включён",
  muted: "микрофон выключен",
} as const

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
 * Строка участника звонка: пульс у говорящего, значок микрофона и состояние словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar033({
  name = "Ким Сон",
  state = "speaking",
  className,
  style,
  ...props
}: Avatar033Props) {
  const palette = {
    "--vibeui-avatar-033-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-033" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-033"
        data-state={state}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="pulse" aria-hidden="true" />
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          <span data-part="mic" aria-hidden="true" />
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          {/* Состояние словом: пульс и цвет значка вслух не читаются. */}
          <span data-part="state">{STATE_LABEL[state]}</span>
        </span>
      </div>
    </>
  )
}
