import type { ComponentProps, CSSProperties } from "react"

export type Avatar034Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  src?: string
  when?: string
  /** Слова перед временем: «был в сети вчера в 18:40». */
  seenText?: string
  dateTime?: string
  freshness?: "today" | "week" | "long"
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  freshnessText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
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
--vibeui-avatar-034-bg:transparent;
--vibeui-avatar-034-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-034-muted:color-mix(in oklab,var(--vibeui-avatar-034-fg) 68%,transparent);
--vibeui-avatar-034-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-034-fresh:oklch(0.62 0.15 152);
--vibeui-avatar-034-stale:oklch(0.66 0.02 265);
--vibeui-avatar-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-034"]{
container-type:inline-size;
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,15rem);max-width:19rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-034-bg);
border:1px solid var(--vibeui-avatar-034-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-034-font);color:var(--vibeui-avatar-034-fg);
}
[data-vibeui-block="avatar-034"] *{box-sizing:border-box}
[data-vibeui-block="avatar-034"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-034-size);height:var(--vibeui-avatar-034-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-034-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-034-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-034-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-034-hue,265)));
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
[data-vibeui-block="avatar-034"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-034"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
@container (max-width: 18rem){
[data-vibeui-block="avatar-034"] [data-part="seen"]{flex-wrap:wrap}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-034"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-034"] *{animation:none!important;transition:none!important}}
`

const FRESHNESS_LABEL: Record<string, string> = {
  today: "заходил сегодня",
  week: "заходил на этой неделе",
  long: "давно не заходил",
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
 * Аватар с датой последнего входа: подпись в <time>, давность различается формой метки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar034({
  background = "",
  name = "Мария Гурова",
  src,
  when = "вчера в 18:40",
  seenText = "был в сети",
  dateTime = "2026-08-30T18:40",
  freshness = "week",
  freshnessText = FRESHNESS_LABEL,
  textColor,
  className,
  style,
  ...props
}: Avatar034Props) {
  const palette = {
    "--vibeui-avatar-034-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-034-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-034-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-034" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-034"
        data-freshness={freshness}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {src ? <img src={src} alt="" /> : initials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="seen">
            <span
              data-part="mark"
              role="img"
              aria-label={
                freshnessText[freshness] ?? FRESHNESS_LABEL[freshness]
              }
            />
            {/* Машинная отметка рядом с человеческой: считать её нечем. */}
            <time data-part="time" dateTime={dateTime}>
              {seenText} {when}
            </time>
          </span>
        </span>
      </div>
    </>
  )
}
