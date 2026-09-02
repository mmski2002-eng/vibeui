import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Alert001Tone = "info" | "success" | "warning" | "danger"

export type Alert001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  tone?: Alert001Tone
  title?: string
  description?: string
  /** Действие справа: ссылка «Подробнее», кнопка «Повторить». */
  action?: ReactNode
  /** Пусто — подложки нет, уведомление лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: тон несёт полоса слева и значок, а не заливка во всю
// ширину. Уведомление остаётся частью страницы, а не куском чужого интерфейса,
// и три сообщения подряд не превращают экран в светофор.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-001"]){
--vibeui-alert-001-fg:light-dark(oklch(0.26 0.016 265),oklch(0.93 0.006 265));
--vibeui-alert-001-muted:light-dark(oklch(0.48 0.014 265),oklch(0.72 0.012 265));
--vibeui-alert-001-bg:transparent;
--vibeui-alert-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-001-tone:light-dark(oklch(0.58 0.18 262),oklch(0.74 0.16 262));
--vibeui-alert-001-radius:0.75rem;
--vibeui-alert-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alert-001"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;overflow:hidden;
padding:0.875rem 1rem 0.875rem 1.125rem;
border:1px solid var(--vibeui-alert-001-border);
border-radius:var(--vibeui-alert-001-radius);
background:var(--vibeui-alert-001-bg);color:var(--vibeui-alert-001-fg);
font-family:var(--vibeui-alert-001-font);
}
/* Полоса слева — единственное место, где виден тон. */
[data-vibeui-block="alert-001"]::before{
content:"";position:absolute;left:0;top:0;bottom:0;width:3px;
background:var(--vibeui-alert-001-tone);
}
[data-vibeui-block="alert-001"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.25rem;height:1.25rem;margin-top:0.0625rem;
border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-alert-001-tone) 18%,transparent);
color:var(--vibeui-alert-001-tone);
font-size:0.75rem;font-weight:700;line-height:1;
}
[data-vibeui-block="alert-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-001"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-001-muted)}
[data-vibeui-block="alert-001"] [data-part="action"]{
display:flex;align-items:center;flex:none;gap:0.5rem;
font-size:0.8125rem;font-weight:500;color:var(--vibeui-alert-001-tone);
}
[data-vibeui-block="alert-001"][data-tone="success"]{--vibeui-alert-001-tone:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.14 152))}
[data-vibeui-block="alert-001"][data-tone="warning"]{--vibeui-alert-001-tone:light-dark(oklch(0.68 0.15 70),oklch(0.81 0.14 75))}
[data-vibeui-block="alert-001"][data-tone="danger"]{--vibeui-alert-001-tone:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.17 25))}
/* В узкой колонке действие уходит под текст, а не сжимает его. */
@container (max-width: 26rem){
/* Текст занимает строку целиком, иначе действие сжимает его до нуля. */
[data-vibeui-block="alert-001"] [data-part="text"]{flex:1 1 100%}
[data-vibeui-block="alert-001"] [data-part="action"]{width:100%;padding-left:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-001"] *{animation:none!important;transition:none!important}}
`

const GLYPHS: Record<Alert001Tone, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "!",
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
 * Встроенное уведомление: тон несёт полоса слева, а не заливка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert001({
  tone = "warning",
  title = "Домен ещё не подключён",
  description = "Сайт открывается по временному адресу. Подключите домен, чтобы им можно было делиться.",
  action = "Подключить",
  background = "",
  className,
  style,
  ...props
}: Alert001Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-alert-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-001"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          {GLYPHS[tone]}
        </span>
        <span data-part="text">
          {title ? <span data-part="title">{title}</span> : null}
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {action ? <span data-part="action">{action}</span> : null}
      </div>
    </>
  )
}
