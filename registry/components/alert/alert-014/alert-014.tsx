import type { ComponentProps, CSSProperties } from "react"

export type Alert014State = "operational" | "degraded" | "down" | "maintenance"

export type Alert014Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  state?: Alert014State
  title?: string
  description?: string
  /** Когда обновлялась сводка: «обновлено 2 минуты назад». */
  updated?: string
  statusLabel?: string
  statusHref?: string
  /** Название состояния словом: точка называет его только цветом. */
  stateText?: Record<string, string>
  /** Пусто — подложки нет, сводка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: состояние сервиса. Точка слева пульсирует только когда
// что-то не так — ровное состояние не должно моргать на экране часами.
// Время последнего обновления обязательно: сводка без отметки времени не
// отличается от зависшей страницы.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-014"]){
--vibeui-alert-014-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-alert-014-muted:color-mix(in oklab,var(--vibeui-alert-014-fg) 68%,transparent);
--vibeui-alert-014-bg:transparent;
--vibeui-alert-014-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-alert-014-state:light-dark(oklch(0.58 0.15 152),oklch(0.74 0.16 152));
--vibeui-alert-014-radius:0.75rem;
--vibeui-alert-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-014"]{color-scheme:dark}
[data-vibeui-block="alert-014"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
padding:0.8125rem 1rem;
border:1px solid var(--vibeui-alert-014-border);
border-radius:var(--vibeui-alert-014-radius);
background:var(--vibeui-alert-014-bg);color:var(--vibeui-alert-014-fg);
font-family:var(--vibeui-alert-014-font);
}
[data-vibeui-block="alert-014"][data-state="degraded"]{--vibeui-alert-014-state:light-dark(oklch(0.68 0.15 70),oklch(0.8 0.15 70))}
[data-vibeui-block="alert-014"][data-state="down"]{--vibeui-alert-014-state:light-dark(oklch(0.56 0.19 25),oklch(0.71 0.18 25))}
[data-vibeui-block="alert-014"][data-state="maintenance"]{--vibeui-alert-014-state:light-dark(oklch(0.58 0.18 262),oklch(0.76 0.15 262))}
[data-vibeui-block="alert-014"] [data-part="dot"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;border-radius:9999px;
background:var(--vibeui-alert-014-state);
}
/* Пульс только у нештатных состояний: ровное не моргает часами на экране. */
[data-vibeui-block="alert-014"]:not([data-state="operational"]) [data-part="dot"]::after{
content:"";position:absolute;inset:0;border-radius:inherit;
background:inherit;
animation:vibeui-alert-014-pulse 1.8s ease-out infinite;
}
@keyframes vibeui-alert-014-pulse{
0%{transform:scale(1);opacity:.6}
100%{transform:scale(2.6);opacity:0}
}
/* Состояние названо словом: точка отличает сбой от деградации только цветом,
   а цвет читают не все. Слово видно только скринридеру. */
[data-vibeui-block="alert-014"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="alert-014"] [data-part="text"]{position:relative;display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-014"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-014"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-014-muted)}
[data-vibeui-block="alert-014"] [data-part="updated"]{
flex:none;font-size:0.75rem;color:var(--vibeui-alert-014-muted);white-space:nowrap;
}
[data-vibeui-block="alert-014"] [data-part="link"]{
flex:none;color:var(--vibeui-alert-014-state);
font-size:0.8125rem;font-weight:600;text-decoration:none;
border-bottom:1px solid transparent;transition:border-color .16s ease;
}
[data-vibeui-block="alert-014"] [data-part="link"]:hover{border-bottom-color:currentColor}
[data-vibeui-block="alert-014"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-alert-014-state);outline-offset:3px}
@container (max-width: 30rem){
/* Текст держит первую строку, отметка времени уходит под него. */
[data-vibeui-block="alert-014"] [data-part="text"]{flex:1 1 60%}
[data-vibeui-block="alert-014"] [data-part="updated"]{order:4;width:100%;padding-left:1.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-014"] *{animation:none!important;transition:none!important}}
`

const STATE_TEXT: Record<string, string> = {
  operational: "Работает",
  degraded: "Работает с перебоями",
  down: "Сбой",
  maintenance: "Обслуживание",
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
 * Сводка состояния сервиса: точка, отметка времени и ссылка на статус.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert014({
  state = "degraded",
  title = "Публикация идёт медленнее обычного",
  description = "Очередь сборки перегружена. Сайты работают, новые публикации занимают до 10 минут.",
  updated = "обновлено 2 минуты назад",
  statusLabel = "Статус сервисов",
  statusHref = "#status",
  stateText = STATE_TEXT,
  background = "",
  className,
  style,
  ...props
}: Alert014Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-alert-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-014"
        data-state={state}
        role={state === "down" ? "alert" : "status"}
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="text">
          <span data-part="sr">{stateText[state] ?? STATE_TEXT[state]}</span>
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {updated ? <span data-part="updated">{updated}</span> : null}
        {statusLabel ? (
          <a data-part="link" href={statusHref}>
            {statusLabel}
          </a>
        ) : null}
      </div>
    </>
  )
}
