import type { ComponentProps, CSSProperties } from "react"

export type Empty018Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  status?: string
  actionLabel?: string
  onAction?: () => void
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: отсутствие уведомлений — тихое, а не тревожное состояние.
// Перечёркнутый колокольчик и приглушённые цвета не должны выглядеть как
// сбой. Пилюля со статусом каналов подтверждает, что оповещения включены и
// просто нечего показать, а единственное действие ведёт в их настройку.
const STYLES = `
:where([data-vibeui-block="empty-018"]){
--vibeui-empty-018-bg:transparent;
--vibeui-empty-018-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-empty-018-muted:color-mix(in oklab,var(--vibeui-empty-018-fg) 68%,transparent);
--vibeui-empty-018-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-empty-018-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-empty-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-018"]{color-scheme:dark}
[data-vibeui-block="empty-018"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:22rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-018-bg);
border:1px solid var(--vibeui-empty-018-border);border-radius:1rem;
font-family:var(--vibeui-empty-018-font);color:var(--vibeui-empty-018-fg);
}
[data-vibeui-block="empty-018"] [data-part="mark"]{
width:2.375rem;height:2.375rem;color:var(--vibeui-empty-018-muted);
}
[data-vibeui-block="empty-018"] [data-part="title"]{margin:0.125rem 0 0;font-size:1.0625rem;font-weight:700;line-height:1.3}
[data-vibeui-block="empty-018"] [data-part="text"]{
margin:0;max-width:30ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-018-muted);
}
[data-vibeui-block="empty-018"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.125rem;
padding:0.25rem 0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-018-accent) 10%,transparent);
color:var(--vibeui-empty-018-fg);font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-018"] [data-part="status"] span{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-empty-018-accent);
}
[data-vibeui-block="empty-018"] [data-part="action"]{
appearance:none;border:1px solid var(--vibeui-empty-018-border);cursor:pointer;
margin-top:0.375rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.375rem 1.125rem;border-radius:0.75rem;
background:transparent;color:var(--vibeui-empty-018-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-018"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-018-accent);outline-offset:2px;
}
@container (max-width: 18rem){
[data-vibeui-block="empty-018"] [data-part="title"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-018"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Пустой список уведомлений: тихое состояние, статус каналов и
 * действие — перейти в настройку оповещений. Один файл, ноль зависимостей.
 */
export function Empty018({
  title = "Пока нет уведомлений",
  text = "Здесь появятся сообщения о важных событиях: упоминания, ответы, изменения статуса.",
  status = "Уведомления включены",
  actionLabel = "Настроить уведомления",
  onAction,
  background = "",
  accent,
  className,
  style,
  ...props
}: Empty018Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-018"
        role="status"
        className={className}
        style={palette}
      >
        <svg
          data-part="mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 9a6 6 0 0 1 9.5-4.9" />
          <path d="M18 9c0 3.2 1 5 2 6.5H8" />
          <path d="M10 19a2 2 0 0 0 4 0" />
          <line x1="4" y1="4" x2="20" y2="20" />
        </svg>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <span data-part="status">
          <span aria-hidden="true" />
          {status}
        </span>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </>
  )
}
