import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar034Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  when?: string
  dateTime?: string
  freshness?: "today" | "week" | "long"
}

// Идея компонента: аватар с датой последнего входа. «Был в сети недавно» —
// текст без опоры: браузер не подскажет точную дату, а пересчитывать её на
// клиенте значит уехать в гидрацию. Поэтому подпись живёт в <time> с машинным
// dateTime: человек читает «вчера в 18:40», а разметка несёт точную отметку.
// Давность продублирована формой метки — залитая, полая, пунктирная — потому
// что три оттенка серого между собой не различаются.
const STYLES = `
:where([data-vibeui-block="avatar-034"]){
--vibeui-avatar-034-size:2.5rem;
--vibeui-avatar-034-bg:oklch(1 0 0);
--vibeui-avatar-034-fg:oklch(0.24 0.014 265);
--vibeui-avatar-034-muted:oklch(0.55 0.014 265);
--vibeui-avatar-034-border:oklch(0.91 0.006 265);
--vibeui-avatar-034-fresh:oklch(0.62 0.15 152);
--vibeui-avatar-034-stale:oklch(0.66 0.02 265);
--vibeui-avatar-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-034"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:19rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-034-bg);
border:1px solid var(--vibeui-avatar-034-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-034-font);color:var(--vibeui-avatar-034-fg);
}
[data-vibeui-block="avatar-034"] *{box-sizing:border-box}
[data-vibeui-block="avatar-034"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-034-size);height:var(--vibeui-avatar-034-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-034-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-034-hue,265));
font-size:calc(var(--vibeui-avatar-034-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-034"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="avatar-034"] [data-part="name"]{
font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-034"] [data-part="seen"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-avatar-034-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Форма, а не оттенок серого: три градации давности различимы. */
[data-vibeui-block="avatar-034"] [data-part="mark"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-avatar-034-fresh);
}
[data-vibeui-block="avatar-034"][data-freshness="week"] [data-part="mark"]{
background:none;box-shadow:inset 0 0 0 2px var(--vibeui-avatar-034-stale);
}
[data-vibeui-block="avatar-034"][data-freshness="long"] [data-part="mark"]{
background:none;border:1px dashed var(--vibeui-avatar-034-stale);
}
[data-vibeui-block="avatar-034"] [data-part="time"]{color:inherit;text-decoration:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-034"] *{animation:none!important;transition:none!important}}
`

const FRESHNESS_LABEL = {
  today: "заходил сегодня",
  week: "заходил на этой неделе",
  long: "давно не заходил",
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
 * Аватар с датой последнего входа: подпись в <time>, давность различается формой метки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar034({
  name = "Мария Лоза",
  when = "вчера в 18:40",
  dateTime = "2026-08-30T18:40",
  freshness = "week",
  className,
  style,
  ...props
}: Avatar034Props) {
  const palette = {
    "--vibeui-avatar-034-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-034" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-034"
        data-freshness={freshness}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {initials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="seen">
            <span
              data-part="mark"
              role="img"
              aria-label={FRESHNESS_LABEL[freshness]}
            />
            {/* Машинная отметка рядом с человеческой: считать её нечем. */}
            <time data-part="time" dateTime={dateTime}>
              был в сети {when}
            </time>
          </span>
        </span>
      </div>
    </>
  )
}
