import type { ComponentProps, CSSProperties } from "react"

export type Spinner002Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  speed?: number
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: ожидание тремя точками вместо кольца. Точки занимают
// меньше высоты, чем кольцо, и потому встают в строку рядом с текстом, не
// раздвигая её. Волна собрана задержками, посчитанными от одной длительности,
// поэтому темп меняется одним числом. При запрете движения точки замирают
// разной яркостью — сообщение «идёт работа» остаётся, мигание исчезает.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="spinner-002"]){
--vibeui-spinner-002-speed:1.2s;
--vibeui-spinner-002-dot:0.4375rem;
--vibeui-spinner-002-surface:transparent;
--vibeui-spinner-002-border:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-spinner-002-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-spinner-002-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.72 0.16 39.8));
--vibeui-spinner-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-002"]{color-scheme:dark}
/* Подложки нет по умолчанию: плашка появляется только пропом background. */
[data-vibeui-block="spinner-002"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-spinner-002-surface);
border:1px solid var(--vibeui-spinner-002-border);border-radius:9999px;
font-family:var(--vibeui-spinner-002-font);color:var(--vibeui-spinner-002-fg);
font-size:0.9375rem;
}
[data-vibeui-block="spinner-002"] [data-part="dots"]{
display:inline-flex;align-items:center;gap:0.25rem;flex:none;
}
/* Задержки посчитаны от одной длительности: темп меняется одним числом. */
[data-vibeui-block="spinner-002"] [data-part="dot"]{
width:var(--vibeui-spinner-002-dot);height:var(--vibeui-spinner-002-dot);
border-radius:9999px;background:var(--vibeui-spinner-002-accent);
animation:vibeui-spinner-002-wave var(--vibeui-spinner-002-speed) ease-in-out infinite;
}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(2){
animation-delay:calc(var(--vibeui-spinner-002-speed) / -6);
}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(3){
animation-delay:calc(var(--vibeui-spinner-002-speed) / -3);
}
@keyframes vibeui-spinner-002-wave{
0%,60%,100%{opacity:.28;transform:translateY(0)}
30%{opacity:1;transform:translateY(-0.1875rem)}
}
[data-vibeui-block="spinner-002"] [data-part="label"]{font-weight:600}
/* Без движения точки замирают разной яркостью: состояние читается, мигания нет. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(1){opacity:1}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(2){opacity:.6}
[data-vibeui-block="spinner-002"] [data-part="dot"]:nth-child(3){opacity:.3}
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
 * Ожидание тремя точками: волна из задержек, посчитанных от одной длительности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner002({
  label = "Собираем каталог",
  speed = 1.2,
  background = "",
  className,
  style,
  ...props
}: Spinner002Props) {
  const palette = {
    "--vibeui-spinner-002-speed": `${speed}s`,
    ...(background
      ? {
          "--vibeui-spinner-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-002"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="dots" aria-hidden="true">
          <span data-part="dot" />
          <span data-part="dot" />
          <span data-part="dot" />
        </span>
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}
