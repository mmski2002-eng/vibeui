import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  role?: string
  message?: string
  time?: string
  replyLabel?: string
  /** Подпись тихой кнопки: компонент несёт русскую. */
  dismissLabel?: string
  onReply?: () => void
  onDismiss?: () => void
  accent?: string
  /** Пусто — подложки нет, уведомление лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: уведомление о сообщении от человека. Слева инициалы с
// оттенком, выведенным из имени, — тот же приём, что в аватаре: один человек
// всегда одного цвета. Текст сообщения показывается целиком до трёх строк и
// дальше обрывается многоточием, потому что уведомление — не переписка.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-007"]){
--vibeui-alert-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.006 265));
--vibeui-alert-007-muted:light-dark(oklch(0.5 0.014 265),oklch(0.72 0.012 265));
--vibeui-alert-007-bg:transparent;
--vibeui-alert-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-alert-007-hue:250;
--vibeui-alert-007-radius:0.875rem;
--vibeui-alert-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alert-007"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.875rem 1rem;
border:1px solid var(--vibeui-alert-007-border);
border-radius:var(--vibeui-alert-007-radius);
background:var(--vibeui-alert-007-bg);color:var(--vibeui-alert-007-fg);
font-family:var(--vibeui-alert-007-font);
}
/* Инициалы: оттенок выводится из имени, поэтому автор узнаётся по цвету. */
[data-vibeui-block="alert-007"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:oklch(0.92 0.05 var(--vibeui-alert-007-hue));
color:oklch(0.38 0.09 var(--vibeui-alert-007-hue));
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="alert-007"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-007"] [data-part="head"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="alert-007"] [data-part="name"]{font-size:0.875rem;font-weight:600}
[data-vibeui-block="alert-007"] [data-part="role"]{font-size:0.75rem;color:var(--vibeui-alert-007-muted)}
[data-vibeui-block="alert-007"] [data-part="time"]{margin-left:auto;font-size:0.75rem;color:var(--vibeui-alert-007-muted);white-space:nowrap}
/* До трёх строк: уведомление показывает начало сообщения, а не переписку. */
[data-vibeui-block="alert-007"] [data-part="message"]{
font-size:0.875rem;line-height:1.55;color:var(--vibeui-alert-007-muted);
display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="alert-007"] [data-part="actions"]{display:flex;align-items:center;gap:0.75rem;margin-top:0.4375rem}
[data-vibeui-block="alert-007"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:600;
border:0;background:none;padding:0;
}
[data-vibeui-block="alert-007"] [data-part="reply"]{color:var(--vibeui-alert-007-accent)}
[data-vibeui-block="alert-007"] [data-part="dismiss"]{color:var(--vibeui-alert-007-muted);font-weight:500}
[data-vibeui-block="alert-007"] [data-part="dismiss"]:hover{color:var(--vibeui-alert-007-fg)}
[data-vibeui-block="alert-007"] button:focus-visible{outline:2px solid var(--vibeui-alert-007-accent);outline-offset:2px;border-radius:0.25rem}
@container (max-width: 22rem){
[data-vibeui-block="alert-007"] [data-part="time"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-007"] *{animation:none!important;transition:none!important}}
`

/** Оттенок из имени: один человек всегда одного цвета. */
function hueOf(name: string): number {
  let sum = 0

  for (let index = 0; index < name.length; index += 1) {
    sum = (sum + name.charCodeAt(index) * (index + 1)) % 360
  }

  return sum
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

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Уведомление о сообщении: инициалы, текст до трёх строк и ответ.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert007({
  name = "Анна Ковалёва",
  role = "Арт-директор",
  message = "Посмотрела главную — блок с тарифами лучше поднять выше отзывов. И на мобильном заголовок переносится некрасиво, гляньте.",
  time = "12 минут назад",
  replyLabel = "Ответить",
  dismissLabel = "Скрыть",
  onReply,
  onDismiss,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert007Props) {
  const palette = {
    "--vibeui-alert-007-hue": hueOf(name),
    ...(accent ? { "--vibeui-alert-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-007"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="avatar" aria-hidden="true">
          {initialsOf(name)}
        </span>
        <span data-part="text">
          <span data-part="head">
            <span data-part="name">{name}</span>
            {role ? <span data-part="role">{role}</span> : null}
            {time ? <span data-part="time">{time}</span> : null}
          </span>
          <span data-part="message">{message}</span>
          <span data-part="actions">
            {replyLabel ? (
              <button data-part="reply" type="button" onClick={onReply}>
                {replyLabel}
              </button>
            ) : null}
            {onDismiss && dismissLabel ? (
              <button data-part="dismiss" type="button" onClick={onDismiss}>
                {dismissLabel}
              </button>
            ) : null}
          </span>
        </span>
      </div>
    </>
  )
}
