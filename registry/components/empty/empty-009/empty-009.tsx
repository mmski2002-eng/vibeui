import type { ComponentProps, CSSProperties } from "react"

export type Empty009Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  /** Подпись у пульсирующей точки: что происходит прямо сейчас. */
  statusLabel?: string
  updatedAt?: string
  retryLabel?: string
  onRetry?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Цвет ожидания: перечёркивание, метка и пульс. */
  wait?: string
}

// Идея компонента: офлайн-состояние, которое не выглядит поломкой приложения.
// Пульсирующая точка показывает, что попытки продолжаются сами, строка с
// временем последнего обновления говорит, насколько устарели данные на
// экране, а кнопка нужна тем, кто не хочет ждать очередной попытки.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-009"]){
--vibeui-empty-009-bg:transparent;
--vibeui-empty-009-fg:light-dark(oklch(0.21 0 265),oklch(0.95 0 265));
--vibeui-empty-009-muted:color-mix(in oklab,var(--vibeui-empty-009-fg) 68%,transparent);
--vibeui-empty-009-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-empty-009-button:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-empty-009-button-hover:light-dark(oklch(0.97 0 265),oklch(0.33 0 265));
--vibeui-empty-009-wait:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-empty-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-009"]{color-scheme:dark}
[data-vibeui-block="empty-009"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-009-bg);
border:1px solid var(--vibeui-empty-009-border);border-radius:1rem;
font-family:var(--vibeui-empty-009-font);color:var(--vibeui-empty-009-fg);
}
/* Облако с перечёркиванием: связь не «сломана», а отсутствует. */
[data-vibeui-block="empty-009"] [data-part="mark"]{
position:relative;width:3rem;height:2.25rem;color:var(--vibeui-empty-009-muted);
}
[data-vibeui-block="empty-009"] [data-part="mark"]::before{
content:"";position:absolute;left:0.25rem;bottom:0.5rem;width:2.5rem;height:1.125rem;
border:2px solid currentColor;border-radius:9999px 9999px 0.5rem 0.5rem;opacity:.6;
}
[data-vibeui-block="empty-009"] [data-part="mark"]::after{
content:"";position:absolute;left:0.125rem;top:0.1875rem;width:2.75rem;height:2px;
background:var(--vibeui-empty-009-wait);transform:rotate(38deg);transform-origin:left center;
border-radius:9999px;
}
[data-vibeui-block="empty-009"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-009"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-009-muted);
}
/* Точка пульсирует, пока идут повторы: ожидание должно быть видно. */
[data-vibeui-block="empty-009"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin:0.25rem 0 0;
padding:0.3125rem 0.6875rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-009-wait) 14%,transparent);
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-009"] [data-part="pulse"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-empty-009-wait);
animation:vibeui-empty-009-pulse 1.6s ease-in-out infinite;
}
@keyframes vibeui-empty-009-pulse{
0%,100%{opacity:1;transform:scale(1)}
50%{opacity:.35;transform:scale(0.72)}
}
[data-vibeui-block="empty-009"] [data-part="action"]{
appearance:none;cursor:pointer;margin-top:0.5rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.375rem 1.125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-empty-009-border);
background:var(--vibeui-empty-009-button);color:var(--vibeui-empty-009-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-009"] [data-part="action"]:hover{background:var(--vibeui-empty-009-button-hover)}
[data-vibeui-block="empty-009"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-009-wait);outline-offset:2px}
[data-vibeui-block="empty-009"] [data-part="stamp"]{
margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-empty-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-009"] *{animation:none!important;transition:none!important}}
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
 * Офлайн-состояние: видимое ожидание, возраст данных и повтор вручную.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty009({
  title = "Нет соединения",
  text = "Список откроется сам, как только связь вернётся. Ничего из введённого не потеряно.",
  statusLabel = "Пробуем переподключиться",
  updatedAt = "Данные на экране от 14:08",
  retryLabel = "Попробовать сейчас",
  onRetry,
  background = "",
  wait,
  className,
  style,
  ...props
}: Empty009Props) {
  const palette = {
    ...(wait ? { "--vibeui-empty-009-wait": wait } : null),
    ...(background
      ? {
          "--vibeui-empty-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-009"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="status">
          <span data-part="pulse" aria-hidden="true" />
          {statusLabel}
        </p>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onRetry}>
          {retryLabel}
        </button>
        <p data-part="stamp">{updatedAt}</p>
      </div>
    </>
  )
}
