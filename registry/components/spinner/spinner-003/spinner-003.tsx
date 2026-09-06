import type { ComponentProps, CSSProperties } from "react"

export type Spinner003Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  hint?: string
  height?: number
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: полоса неопределённого прогресса. У неё нет aria-valuenow —
// и это принципиально: как только атрибут появляется, скринридер называет
// процент, которого никто не считал. Отрезок ходит по дорожке анимацией
// transform, а не изменением left: браузер не пересчитывает раскладку на
// каждом кадре. При запрете движения отрезок занимает дорожку целиком и
// пульсирует — «работа идёт» остаётся, бег исчезает.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="spinner-003"]){
--vibeui-spinner-003-height:4px;
--vibeui-spinner-003-surface:transparent;
--vibeui-spinner-003-border:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-spinner-003-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-spinner-003-muted:color-mix(in oklab,var(--vibeui-spinner-003-fg) 68%,transparent);
--vibeui-spinner-003-track:light-dark(oklch(0.93 0 265),oklch(0.36 0 265));
--vibeui-spinner-003-accent:light-dark(oklch(0.55 0.17 262),oklch(0.72 0.16 262));
--vibeui-spinner-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-003"]{color-scheme:dark}
/* Подложки нет по умолчанию: плашка появляется только пропом background. */
[data-vibeui-block="spinner-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-spinner-003-surface);
border:1px solid var(--vibeui-spinner-003-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-003-font);color:var(--vibeui-spinner-003-fg);
}
[data-vibeui-block="spinner-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
font-size:0.9375rem;
}
[data-vibeui-block="spinner-003"] [data-part="hint"]{
font-size:0.875rem;color:var(--vibeui-spinner-003-muted);
}
[data-vibeui-block="spinner-003"] [data-part="track"]{
position:relative;overflow:hidden;
height:var(--vibeui-spinner-003-height);
border-radius:9999px;background:var(--vibeui-spinner-003-track);
}
/* Отрезок ездит на transform: раскладка не пересчитывается на каждом кадре. */
[data-vibeui-block="spinner-003"] [data-part="beam"]{
position:absolute;inset:0 auto 0 0;
width:40%;border-radius:9999px;
background:var(--vibeui-spinner-003-accent);
animation:vibeui-spinner-003-run 1.4s cubic-bezier(.65,0,.35,1) infinite;
}
@keyframes vibeui-spinner-003-run{
0%{transform:translateX(-100%)}
100%{transform:translateX(250%)}
}
@keyframes vibeui-spinner-003-breathe{0%,100%{opacity:.35}50%{opacity:1}}
/* Без движения отрезок занимает дорожку целиком и дышит. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-003"] [data-part="beam"]{
width:100%;transform:none;
animation:vibeui-spinner-003-breathe 1.8s ease-in-out infinite;
}
}
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
 * Полоса неопределённого прогресса без выдуманных процентов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner003({
  label = "Синхронизация каталога",
  hint = "Осталось немного",
  height = 4,
  background = "",
  className,
  style,
  ...props
}: Spinner003Props) {
  const palette = {
    "--vibeui-spinner-003-height": `${height}px`,
    ...(background
      ? {
          "--vibeui-spinner-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-003"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="label">{label}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-busy="true"
        >
          <span data-part="beam" />
        </div>
      </div>
    </>
  )
}
