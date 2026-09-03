import type { ComponentProps, CSSProperties } from "react"

export type Empty007Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  retryLabel?: string
  code?: string
  detail?: string
  /** Подпись раскрывающихся подробностей. */
  detailsLabel?: string
  onRetry?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Тревожный цвет: знак и обводка фокуса. */
  danger?: string
}

// Идея компонента: ошибка загрузки, а не пустой раздел. Разница
// принципиальная: данные есть, их не удалось получить, поэтому главное
// действие — повторить, а не «создать первое». Технические подробности
// спрятаны в details: разработчику они нужны, остальным мешают.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-007"]){
--vibeui-empty-007-bg:transparent;
--vibeui-empty-007-fg:light-dark(oklch(0.21 0.014 265),oklch(0.95 0.005 265));
--vibeui-empty-007-muted:color-mix(in oklab,var(--vibeui-empty-007-fg) 68%,transparent);
--vibeui-empty-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-empty-007-code:light-dark(oklch(0.97 0.003 265),oklch(0.29 0.011 265));
--vibeui-empty-007-action-fg:light-dark(oklch(0.99 0.004 265),oklch(0.18 0.012 265));
--vibeui-empty-007-danger:light-dark(oklch(0.55 0.2 25),oklch(0.74 0.16 25));
--vibeui-empty-007-danger-soft:light-dark(color-mix(in oklab,var(--vibeui-empty-007-danger) 14%,oklch(1 0 0)),color-mix(in oklab,var(--vibeui-empty-007-danger) 26%,oklch(0.2 0.01 265)));
--vibeui-empty-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-empty-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-007"]{color-scheme:dark}
[data-vibeui-block="empty-007"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-007-bg);
border:1px solid var(--vibeui-empty-007-border);border-radius:1rem;
font-family:var(--vibeui-empty-007-font);color:var(--vibeui-empty-007-fg);
}
/* Треугольник с восклицанием: тревога читается формой, а не только цветом. */
[data-vibeui-block="empty-007"] [data-part="mark"]{
position:relative;width:2.75rem;height:2.75rem;border-radius:0.875rem;
background:var(--vibeui-empty-007-danger-soft);color:var(--vibeui-empty-007-danger);
}
[data-vibeui-block="empty-007"] [data-part="mark"]::before{
content:"";position:absolute;left:50%;top:0.75rem;width:2px;height:0.8125rem;
margin-left:-1px;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="empty-007"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;bottom:0.6875rem;width:2px;height:2px;
margin-left:-1px;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="empty-007"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-007"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-007-muted);
}
[data-vibeui-block="empty-007"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-007-fg);color:var(--vibeui-empty-007-action-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-007"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-007-danger);outline-offset:2px}
/* Подробности по требованию: details не требует состояния и клиентского кода. */
[data-vibeui-block="empty-007"] details{width:100%;margin-top:0.5rem;font-size:0.75rem}
[data-vibeui-block="empty-007"] summary{
cursor:pointer;list-style:none;
color:var(--vibeui-empty-007-muted);font-weight:650;
}
[data-vibeui-block="empty-007"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="empty-007"] summary:focus-visible{outline:2px solid var(--vibeui-empty-007-danger);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="empty-007"] [data-part="detail"]{
margin:0.5rem 0 0;padding:0.5rem 0.625rem;
background:var(--vibeui-empty-007-code);border-radius:0.5rem;
font-family:var(--vibeui-empty-007-mono);font-size:0.6875rem;line-height:1.45;
color:var(--vibeui-empty-007-muted);text-align:left;overflow-wrap:anywhere;white-space:pre-line;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-007"] *{animation:none!important;transition:none!important}}
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
 * Ошибка загрузки с повтором: подробности спрятаны в details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty007({
  title = "Не удалось загрузить список",
  text = "Данные не потерялись — сервер не ответил вовремя. Обычно помогает повтор через несколько секунд.",
  retryLabel = "Повторить",
  code = "504 Gateway Timeout",
  detail = "GET /api/projects?page=1 — превышено время ожидания 15 000 мс. Запрос 8f2c-41ab.",
  detailsLabel = "Подробности ошибки",
  onRetry,
  background = "",
  danger,
  className,
  style,
  ...props
}: Empty007Props) {
  const palette = {
    ...(danger ? { "--vibeui-empty-007-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-empty-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-007"
        role="alert"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onRetry}>
          {retryLabel}
        </button>
        <details>
          <summary>{detailsLabel}</summary>
          <p data-part="detail">
            {code}
            {"\n"}
            {detail}
          </p>
        </details>
      </div>
    </>
  )
}
