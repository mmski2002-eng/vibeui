import type { ComponentProps, CSSProperties } from "react"

export type Spinner001Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  hint?: string
  size?: "sm" | "md" | "lg"
  accent?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: ожидание с подписью. Крутящееся кольцо само по себе не
// сообщает ничего — ни что происходит, ни сколько ждать; подпись обязательна,
// а не опциональна. При prefers-reduced-motion вращение сменяется пульсацией
// прозрачности: движение уходит, состояние остаётся.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="spinner-001"]){
--vibeui-spinner-001-size:1.5rem;
--vibeui-spinner-001-bg:transparent;
--vibeui-spinner-001-border:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-spinner-001-fg:light-dark(oklch(0.28 0 265),oklch(0.94 0 265));
--vibeui-spinner-001-muted:color-mix(in oklab,var(--vibeui-spinner-001-fg) 68%,transparent);
--vibeui-spinner-001-track:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-spinner-001-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-spinner-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-001"]{color-scheme:dark}
/* Подложки нет по умолчанию: ожидание ложится на фон страницы. */
[data-vibeui-block="spinner-001"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-spinner-001-bg);
border:1px solid var(--vibeui-spinner-001-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-001-font);color:var(--vibeui-spinner-001-fg);
}
[data-vibeui-block="spinner-001"][data-size="sm"]{--vibeui-spinner-001-size:1rem}
[data-vibeui-block="spinner-001"][data-size="lg"]{--vibeui-spinner-001-size:2rem}
[data-vibeui-block="spinner-001"] [data-part="ring"]{
flex:none;box-sizing:border-box;
width:var(--vibeui-spinner-001-size);height:var(--vibeui-spinner-001-size);
border:2px solid var(--vibeui-spinner-001-track);
border-top-color:var(--vibeui-spinner-001-accent);
border-radius:9999px;
animation:vibeui-spinner-001-spin .7s linear infinite;
}
@keyframes vibeui-spinner-001-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-spinner-001-pulse{0%,100%{opacity:.35}50%{opacity:1}}
[data-vibeui-block="spinner-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="spinner-001"] [data-part="label"]{font-size:0.9375rem;font-weight:650;line-height:1.2}
[data-vibeui-block="spinner-001"] [data-part="hint"]{font-size:0.875rem;color:var(--vibeui-spinner-001-muted)}
/* Без движения состояние остаётся: кольцо не крутится, а пульсирует. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-001"] [data-part="ring"]{
animation:vibeui-spinner-001-pulse 1.6s ease-in-out infinite;
border-color:var(--vibeui-spinner-001-accent);
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
 * Ожидание с обязательной подписью: кольцо без слов ничего не сообщает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner001({
  label = "Собираем каталог",
  hint = "Обычно занимает меньше минуты",
  size = "md",
  accent,
  background = "",
  className,
  style,
  ...props
}: Spinner001Props) {
  const palette = {
    ...(accent ? { "--vibeui-spinner-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-spinner-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-001"
        data-size={size}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="ring" aria-hidden="true" />
        <span data-part="text">
          <span data-part="label">{label}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
        </span>
      </div>
    </>
  )
}
