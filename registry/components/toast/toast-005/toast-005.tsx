import type { ComponentProps, CSSProperties } from "react"

export type Toast005Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  /** Что делать пользователю. Короткая строка, без стека вызовов. */
  message?: string
  retryLabel?: string
  /** Технические подробности под раскрытием: код, адрес, время. */
  details?: string
  /** Подпись строки раскрытия. */
  detailsLabel?: string
  onRetry?: () => void
  /** Цвет тона ошибки: грань, значок и кнопка повтора. */
  tone?: string
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
}

// Идея компонента: уведомление об ошибке, из которого можно выйти. Действие
// «Повторить» стоит первым, а технические подробности спрятаны в <details> —
// они нужны раз в сто ошибок и не должны занимать место в остальных случаях.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница карточки светлее её подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-005"]){
--vibeui-toast-005-bg:light-dark(oklch(0.99 0.008 25),oklch(0.25 0.02 25));
--vibeui-toast-005-fg:light-dark(oklch(0.26 0.03 25),oklch(0.95 0.008 25));
--vibeui-toast-005-muted:color-mix(in oklab,var(--vibeui-toast-005-fg) 68%,transparent);
--vibeui-toast-005-border:light-dark(oklch(0.87 0.04 25),oklch(0.4 0.03 25));
--vibeui-toast-005-tone:light-dark(oklch(0.55 0.2 25),oklch(0.7 0.18 25));
--vibeui-toast-005-on-tone:light-dark(oklch(0.99 0.01 25),oklch(0.22 0.02 25));
--vibeui-toast-005-shadow:light-dark(oklch(0.3 0.06 25 / 45%),oklch(0.12 0.03 25 / 70%));
--vibeui-toast-005-code:light-dark(oklch(0.96 0.012 25),oklch(0.3 0.02 25));
--vibeui-toast-005-radius:0.875rem;
--vibeui-toast-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-toast-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-005"]{color-scheme:dark}
[data-vibeui-block="toast-005"]{
display:flex;gap:0.75rem;align-items:flex-start;
width:100%;max-width:24rem;box-sizing:border-box;
padding:0.875rem;
border:1px solid var(--vibeui-toast-005-border);
border-left:3px solid var(--vibeui-toast-005-tone);
border-radius:var(--vibeui-toast-005-radius);
background:var(--vibeui-toast-005-bg);color:var(--vibeui-toast-005-fg);
font-family:var(--vibeui-toast-005-font);
box-shadow:0 18px 38px -26px var(--vibeui-toast-005-shadow);
}
[data-vibeui-block="toast-005"] [data-part="badge"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.375rem;height:1.375rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-toast-005-tone);color:var(--vibeui-toast-005-on-tone);
font-size:0.8125rem;font-weight:800;line-height:1;
}
[data-vibeui-block="toast-005"] [data-part="body"]{display:flex;flex-direction:column;gap:0.375rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="toast-005"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="toast-005"] [data-part="message"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-005-muted)}
[data-vibeui-block="toast-005"] [data-part="row"]{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.125rem}
[data-vibeui-block="toast-005"] [data-part="retry"]{
appearance:none;cursor:pointer;border:0;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-toast-005-tone);color:var(--vibeui-toast-005-on-tone);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="toast-005"] [data-part="retry"]:hover{filter:brightness(1.08)}
[data-vibeui-block="toast-005"] [data-part="retry"]:focus-visible{outline:2px solid var(--vibeui-toast-005-tone);outline-offset:2px}
/* Подробности под раскрытием: нужны редко, места занимают много. */
[data-vibeui-block="toast-005"] [data-part="more"]{min-width:0}
[data-vibeui-block="toast-005"] [data-part="summary"]{
cursor:pointer;list-style:none;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-toast-005-muted);
text-decoration:underline;text-underline-offset:0.2em;
border-radius:0.25rem;
}
[data-vibeui-block="toast-005"] [data-part="summary"]::-webkit-details-marker{display:none}
[data-vibeui-block="toast-005"] [data-part="summary"]:focus-visible{outline:2px solid var(--vibeui-toast-005-tone);outline-offset:2px}
[data-vibeui-block="toast-005"] [data-part="code"]{
margin:0.5rem 0 0;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-toast-005-code);
font-family:var(--vibeui-toast-005-mono);font-size:0.75rem;line-height:1.5;
white-space:pre-wrap;word-break:break-word;color:var(--vibeui-toast-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-005"] *{animation:none!important;transition:none!important}}
`

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
 * Уведомление об ошибке с повтором и техническими подробностями под раскрытием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast005({
  title = "Не удалось сохранить черновик",
  message = "Соединение оборвалось на середине. Текст остался в браузере.",
  retryLabel = "Повторить",
  details = "PUT /api/drafts/8412 — 504 Gateway Timeout\n17:42:06, попытка 2 из 3",
  detailsLabel = "Подробности",
  onRetry,
  tone,
  background = "",
  className,
  style,
  ...props
}: Toast005Props) {
  const palette = {
    ...(tone ? { "--vibeui-toast-005-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-005"
        role="alert"
        className={className}
        style={palette}
      >
        <span data-part="badge" aria-hidden="true">
          !
        </span>
        <div data-part="body">
          <p data-part="title">{title}</p>
          <p data-part="message">{message}</p>
          <div data-part="row">
            <button data-part="retry" type="button" onClick={onRetry}>
              {retryLabel}
            </button>
            {details ? (
              <details data-part="more">
                <summary data-part="summary">{detailsLabel}</summary>
                <pre data-part="code">{details}</pre>
              </details>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
