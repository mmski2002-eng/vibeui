import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  name?: string
  /** Текст сообщения: одна-две строки, дальше — в переписку. */
  message?: string
  time?: string
  replyLabel?: string
  onReply?: () => void
}

// Идея компонента: уведомление о сообщении, а не о системном событии. Слева
// кружок с инициалами, цвет которого выводится из имени, поэтому у каждого
// собеседника свой оттенок и в потоке они не сливаются.
const STYLES = `
:where([data-vibeui-block="toast-009"]){
--vibeui-toast-009-bg:oklch(1 0 0);
--vibeui-toast-009-fg:oklch(0.23 0.014 265);
--vibeui-toast-009-muted:oklch(0.55 0.014 265);
--vibeui-toast-009-border:oklch(0.9 0.006 265);
--vibeui-toast-009-hue:250;
--vibeui-toast-009-radius:1.125rem;
--vibeui-toast-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-009"]{
display:flex;gap:0.6875rem;align-items:flex-start;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toast-009-border);
border-radius:var(--vibeui-toast-009-radius);
background:var(--vibeui-toast-009-bg);color:var(--vibeui-toast-009-fg);
font-family:var(--vibeui-toast-009-font);
box-shadow:0 20px 42px -28px oklch(0.2 0.02 265 / 50%);
}
/* Оттенок кружка выводится из имени: два собеседника не совпадут случайно. */
[data-vibeui-block="toast-009"] [data-part="face"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;border-radius:9999px;
background:oklch(0.91 0.06 var(--vibeui-toast-009-hue));
color:oklch(0.36 0.1 var(--vibeui-toast-009-hue));
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
border:1px solid var(--vibeui-toast-009-border);background:oklch(0.97 0.004 265);
font:inherit;font-size:0.8125rem;color:var(--vibeui-toast-009-muted);
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-009"] [data-part="reply"]:hover{
background:oklch(1 0 0);color:var(--vibeui-toast-009-fg);
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
 * Уведомление о личном сообщении: инициалы, текст и быстрый ответ.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast009({
  name = "Артём Северов",
  message = "Посмотри последний макет каталога — там поменялась сетка карточек, хочу услышать твоё мнение до вечера.",
  time = "18:04",
  replyLabel = "Ответить…",
  onReply,
  className,
  style,
  ...props
}: Toast009Props) {
  const palette = {
    "--vibeui-toast-009-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
              aria-label={`Ответить: ${name}`}
            >
              {replyLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
