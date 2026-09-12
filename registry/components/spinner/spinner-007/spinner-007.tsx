import type { ComponentProps, CSSProperties } from "react"

export type Spinner007Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  speed?: number
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: индикатор набора сообщения — форма чат-пузыря с тремя
// точками, которые подсвечиваются по очереди, а не волной. В отличие от
// общей точечной загрузки, здесь только одна точка ярка в любой момент
// времени: это читается как «идёт набор», а не как абстрактное ожидание.
// Тайминг — steps(), а не ease: подсветка перескакивает, а не перетекает.
//
// Тема берётся из color-scheme окружения через light-dark(): пузырь светлее
// тёмного фона и темнее светлого, собственной тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="spinner-007"]){
--vibeui-spinner-007-speed:1.05s;
--vibeui-spinner-007-dot:0.375rem;
--vibeui-spinner-007-surface:transparent;
--vibeui-spinner-007-border:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-spinner-007-track:light-dark(oklch(0.95 0 265),oklch(0.3 0 265));
--vibeui-spinner-007-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-spinner-007-muted:color-mix(in oklab,var(--vibeui-spinner-007-fg) 68%,transparent);
--vibeui-spinner-007-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-spinner-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-007"]{color-scheme:dark}
/* Подложки нет по умолчанию: плашка появляется только пропом background. */
[data-vibeui-block="spinner-007"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-spinner-007-surface);
border:1px solid var(--vibeui-spinner-007-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-007-font);color:var(--vibeui-spinner-007-fg);
font-size:0.9375rem;
}
/* Форма чат-пузыря с хвостиком: точки читаются как «печатает», а не «грузится». */
[data-vibeui-block="spinner-007"] [data-part="bubble"]{
position:relative;display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.5rem 0.6875rem;border-radius:9999px;
background:var(--vibeui-spinner-007-track);
}
[data-vibeui-block="spinner-007"] [data-part="bubble"]::after{
content:"";position:absolute;left:0.5rem;bottom:-0.25rem;
width:0.5rem;height:0.5rem;border-radius:1px;
background:var(--vibeui-spinner-007-track);
transform:rotate(45deg);
}
[data-vibeui-block="spinner-007"] [data-part="dot"]{
width:var(--vibeui-spinner-007-dot);height:var(--vibeui-spinner-007-dot);
border-radius:9999px;background:var(--vibeui-spinner-007-accent);
opacity:.25;
animation:vibeui-spinner-007-chase var(--vibeui-spinner-007-speed) steps(1,end) infinite;color:oklch(from var(--vibeui-spinner-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
/* Точки перескакивают по очереди: подсвечена ровно одна из трёх. */
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(2){
animation-delay:calc(var(--vibeui-spinner-007-speed) / 3);
}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(3){
animation-delay:calc(var(--vibeui-spinner-007-speed) / 3 * 2);
}
@keyframes vibeui-spinner-007-chase{
0%,33%{opacity:1}
34%,100%{opacity:.25}
}
[data-vibeui-block="spinner-007"] [data-part="label"]{font-weight:600;color:var(--vibeui-spinner-007-muted)}
/* Без движения точки замирают разной яркостью: «идёт набор» остаётся видимым. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-007"] [data-part="dot"]{animation:none!important}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(1){opacity:1}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(2){opacity:.55}
[data-vibeui-block="spinner-007"] [data-part="dot"]:nth-child(3){opacity:.25}
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
 * Индикатор набора сообщения: точки в пузыре подсвечиваются по очереди.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner007({
  label = "Собеседник печатает",
  speed = 1.05,
  background = "",
  className,
  style,
  ...props
}: Spinner007Props) {
  const palette = {
    "--vibeui-spinner-007-speed": `${speed}s`,
    ...(background
      ? {
          "--vibeui-spinner-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-007"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="bubble" aria-hidden="true">
          <span data-part="dot" />
          <span data-part="dot" />
          <span data-part="dot" />
        </span>
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}
