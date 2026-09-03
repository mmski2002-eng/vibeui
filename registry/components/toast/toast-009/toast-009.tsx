import type { ComponentProps, CSSProperties } from "react"

export type Toast009Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  name?: string
  /** Текст сообщения: одна-две строки, дальше — в переписку. */
  message?: string
  time?: string
  replyLabel?: string
  /** Доступная подпись кнопки ответа; {name} заменяется именем. */
  replyText?: string
  onReply?: () => void
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
}

// Идея компонента: уведомление о сообщении, а не о системном событии. Слева
// кружок с инициалами, цвет которого выводится из имени, поэтому у каждого
// собеседника свой оттенок и в потоке они не сливаются.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница карточки светлее её подложки, а не темнее. Оттенок кружка считается
// из имени, а светлота берётся из темы: пастельная плашка на тёмной карточке
// светилась бы, поэтому у кружка своя пара значений.
const STYLES = `
:where([data-vibeui-block="toast-009"]){
--vibeui-toast-009-bg:light-dark(oklch(1 0 0),oklch(0.26 0.014 265));
--vibeui-toast-009-fg:light-dark(oklch(0.23 0.014 265),oklch(0.95 0.004 265));
--vibeui-toast-009-muted:color-mix(in oklab,var(--vibeui-toast-009-fg) 68%,transparent);
--vibeui-toast-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-toast-009-field:light-dark(oklch(0.97 0.004 265),oklch(0.31 0.014 265));
--vibeui-toast-009-field-hover:light-dark(oklch(1 0 0),oklch(0.35 0.014 265));
--vibeui-toast-009-shadow:light-dark(oklch(0.2 0.02 265 / 50%),oklch(0.1 0.02 265 / 70%));
--vibeui-toast-009-hue:250;
--vibeui-toast-009-radius:1.125rem;
--vibeui-toast-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-009"]{color-scheme:dark}
[data-vibeui-block="toast-009"]{
display:flex;gap:0.6875rem;align-items:flex-start;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toast-009-border);
border-radius:var(--vibeui-toast-009-radius);
background:var(--vibeui-toast-009-bg);color:var(--vibeui-toast-009-fg);
font-family:var(--vibeui-toast-009-font);
box-shadow:0 20px 42px -28px var(--vibeui-toast-009-shadow);
}
/* Оттенок кружка выводится из имени: два собеседника не совпадут случайно. */
[data-vibeui-block="toast-009"] [data-part="face"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;border-radius:9999px;
background:light-dark(oklch(0.91 0.06 var(--vibeui-toast-009-hue)),oklch(0.37 0.06 var(--vibeui-toast-009-hue)));
color:light-dark(oklch(0.36 0.1 var(--vibeui-toast-009-hue)),oklch(0.9 0.07 var(--vibeui-toast-009-hue)));
font-size:0.8125rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="toast-009"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="toast-009"] [data-part="head"]{display:flex;align-items:baseline;gap:0.5rem}
[data-vibeui-block="toast-009"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.3;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="toast-009"] [data-part="time"]{flex:none;margin-left:auto;font-size:0.75rem;color:var(--vibeui-toast-009-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="toast-009"] [data-part="message"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-009-muted);
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
/* Поле ответа — не настоящее: уведомление отдаёт клик, а не форму. */
[data-vibeui-block="toast-009"] [data-part="reply"]{
appearance:none;cursor:pointer;text-align:left;
margin-top:0.5rem;width:100%;box-sizing:border-box;
padding:0.4375rem 0.6875rem;border-radius:9999px;
border:1px solid var(--vibeui-toast-009-border);background:var(--vibeui-toast-009-field);
font:inherit;font-size:0.8125rem;color:var(--vibeui-toast-009-muted);
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-009"] [data-part="reply"]:hover{
background:var(--vibeui-toast-009-field-hover);color:var(--vibeui-toast-009-fg);
border-color:oklch(0.72 0.06 var(--vibeui-toast-009-hue));
}
[data-vibeui-block="toast-009"] [data-part="reply"]:focus-visible{outline:2px solid oklch(0.6 0.14 var(--vibeui-toast-009-hue));outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-009"] *{animation:none!important;transition:none!important}}
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
 * Уведомление о личном сообщении: инициалы, текст и быстрый ответ.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast009({
  name = "Артём Северов",
  message = "Посмотри последний макет каталога — там поменялась сетка карточек, хочу услышать твоё мнение до вечера.",
  time = "18:04",
  replyLabel = "Ответить…",
  replyText = "Ответить: {name}",
  onReply,
  background = "",
  className,
  style,
  ...props
}: Toast009Props) {
  const palette = {
    "--vibeui-toast-009-hue": hue(name),
    ...(background
      ? {
          "--vibeui-toast-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-009"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {initials(name)}
        </span>
        <div data-part="body">
          <span data-part="head">
            <span data-part="name">{name}</span>
            <span data-part="time">{time}</span>
          </span>
          <p data-part="message">{message}</p>
          {replyLabel ? (
            <button
              data-part="reply"
              type="button"
              onClick={onReply}
              aria-label={replyText.replace("{name}", name)}
            >
              {replyLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
