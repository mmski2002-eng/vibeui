import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Iconstack006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  services?: string[]
  max?: number
  /** Хвост подписи: {count} — сколько сервисов скрыто, {word} — форма слова. */
  restTemplate?: string
  /** Формы слова «сервис» для 1, 2–4 и 5 и больше. */
  serviceWords?: [string, string, string]
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: стопка логотипов интеграций, а не людей. Плитки —
// скруглённые квадраты, как значки приложений, а не кружки аватаров: так
// стопка сразу читается как список подключённых сервисов. Показ ограничен
// max, а остаток не сворачивается в голое число — он договаривается в
// предложение под стопкой, где сперва названы видимые сервисы, а потом
// сказано, сколько ещё подключено. Число согласуется по правилам русского
// счёта, поэтому «1 сервис» не превращается в «1 сервисов».
const STYLES = `
:where([data-vibeui-block="iconstack-006"]){
--vibeui-iconstack-006-size:2.25rem;
--vibeui-iconstack-006-overlap:0.75rem;
--vibeui-iconstack-006-surface:transparent;
--vibeui-iconstack-006-ring:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-iconstack-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.01 265));
--vibeui-iconstack-006-fg:light-dark(oklch(0.26 0.014 265),oklch(0.94 0.005 265));
--vibeui-iconstack-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-iconstack-006-shadow:light-dark(oklch(0.2 0.02 265 / 16%),oklch(0 0 0 / 34%));
--vibeui-iconstack-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="iconstack-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-iconstack-006-surface);
border:1px solid var(--vibeui-iconstack-006-border);border-radius:0.875rem;
font-family:var(--vibeui-iconstack-006-font);color:var(--vibeui-iconstack-006-fg);
}
[data-vibeui-block="iconstack-006"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="iconstack-006"] [data-part="stack"]{
display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;flex:none;
}
[data-vibeui-block="iconstack-006"] [data-part="stack"] > *{
margin-right:calc(var(--vibeui-iconstack-006-overlap) * -1);
}
[data-vibeui-block="iconstack-006"] [data-part="stack"] > *:first-child{margin-right:0}
/* Квадрат со скруглением и тенью читается как значок приложения, а не как
   аватар человека. */
[data-vibeui-block="iconstack-006"] [data-part="logo"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;
width:var(--vibeui-iconstack-006-size);height:var(--vibeui-iconstack-006-size);
border-radius:0.625rem;
border:2px solid var(--vibeui-iconstack-006-ring);
box-shadow:0 1px 2px var(--vibeui-iconstack-006-shadow);
background:oklch(0.9 0.07 var(--vibeui-iconstack-006-hue,265));
color:oklch(0.32 0.13 var(--vibeui-iconstack-006-hue,265));
font-size:0.75rem;font-weight:750;line-height:1;
}
[data-vibeui-block="iconstack-006"] [data-part="caption"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-iconstack-006-muted);
}
[data-vibeui-block="iconstack-006"] [data-part="caption"] strong{
font-weight:650;color:var(--vibeui-iconstack-006-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SERVICES = [
  "Slack",
  "Notion",
  "Figma",
  "Zoom",
  "GitHub",
  "Miro",
  "Linear",
  "Asana",
  "Jira",
  "Trello",
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function mark(name: string) {
  return name.slice(0, 2).toUpperCase()
}

/** Склонение под число: 1 сервис, 2 сервиса, 5 сервисов. */
function serviceWord(count: number, words: [string, string, string]) {
  const teen = count % 100
  const tail = count % 10
  if (teen > 10 && teen < 20) return words[2]
  if (tail === 1) return words[0]
  if (tail > 1 && tail < 5) return words[1]
  return words[2]
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
 * Стопка логотипов интеграций с подписью «и ещё N сервисов» под ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack006({
  title = "Подключённые интеграции",
  services = DEFAULT_SERVICES,
  max = 4,
  restTemplate = " и ещё {count} {word}.",
  serviceWords = ["сервис", "сервиса", "сервисов"],
  background = "",
  className,
  style,
  ...props
}: Iconstack006Props) {
  const shown = services.slice(0, max)
  const rest = services.length - shown.length
  // Число попадает в <strong>, поэтому хвост разрезается по {count}, а не
  // подставляется одной строкой.
  const [restHead, restTail = ""] = restTemplate
    .replace("{word}", serviceWord(rest, serviceWords))
    .split("{count}")
  // Обводка плитки равна подложке: заданный фон красит и её, иначе между
  // плитками останется контур прежнего фона.
  const palette = {
    ...(background
      ? {
          "--vibeui-iconstack-006-surface": background,
          "--vibeui-iconstack-006-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-iconstack-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="iconstack-006"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <span data-part="stack" aria-hidden="true">
          {[...shown].reverse().map((name) => (
            <span
              key={name}
              data-part="logo"
              style={
                { "--vibeui-iconstack-006-hue": hue(name) } as CSSProperties
              }
            >
              {mark(name)}
            </span>
          ))}
        </span>
        <p data-part="caption">
          {shown.join(", ")}
          {rest > 0 ? (
            <>
              {restHead}
              <strong>{rest}</strong>
              {restTail}
            </>
          ) : (
            "."
          )}
        </p>
      </div>
    </>
  )
}
