import type { ComponentProps, CSSProperties } from "react"

export type Toast004State = "loading" | "success" | "error"

export type Toast004Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  /** Стадия операции: одно уведомление живёт от начала до результата. */
  state?: Toast004State
  loadingText?: string
  successText?: string
  errorText?: string
  /** Вторая строка: подробность результата. Пустая строка убирает её. */
  hint?: string
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
}

// Идея компонента: одно уведомление на всю операцию. Вместо «начали» и потом
// отдельного «готово» карточка остаётся на месте и меняет только значок и
// строку — глазу не надо заново искать, о чём речь.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница карточки светлее её подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-004"]){
--vibeui-toast-004-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-toast-004-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-toast-004-muted:color-mix(in oklab,var(--vibeui-toast-004-fg) 68%,transparent);
--vibeui-toast-004-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-004-track:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toast-004-shadow:light-dark(oklch(0.2 0 265 / 45%),oklch(0.1 0 265 / 70%));
--vibeui-toast-004-on-tone:light-dark(oklch(0.99 0 265),oklch(0.2 0 265));
--vibeui-toast-004-tone:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-toast-004-radius:0.875rem;
--vibeui-toast-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-004"]{color-scheme:dark}
[data-vibeui-block="toast-004"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.8125rem 0.9375rem;
border:1px solid var(--vibeui-toast-004-border);
border-radius:var(--vibeui-toast-004-radius);
background:var(--vibeui-toast-004-bg);color:var(--vibeui-toast-004-fg);
font-family:var(--vibeui-toast-004-font);
box-shadow:0 18px 38px -26px var(--vibeui-toast-004-shadow);
}
[data-vibeui-block="toast-004"][data-state="success"]{--vibeui-toast-004-tone:light-dark(oklch(0.62 0.15 152),oklch(0.76 0.15 152))}
[data-vibeui-block="toast-004"][data-state="error"]{--vibeui-toast-004-tone:light-dark(oklch(0.6 0.2 25),oklch(0.7 0.18 25))}
[data-vibeui-block="toast-004"] [data-part="icon"]{
position:relative;flex:none;width:1.375rem;height:1.375rem;margin-top:0.0625rem;
}
/* Кольцо загрузки: конический градиент, вырезанный маской в тонкий обод. */
[data-vibeui-block="toast-004"] [data-part="spinner"]{
position:absolute;inset:0;border-radius:9999px;
background:conic-gradient(from 0deg,transparent 0deg,var(--vibeui-toast-004-tone) 300deg,transparent 360deg);
-webkit-mask:radial-gradient(circle,transparent 60%,#000 61%);
mask:radial-gradient(circle,transparent 60%,#000 61%);
animation:vibeui-toast-004-spin 0.9s linear infinite;
}
[data-vibeui-block="toast-004"] [data-part="mark"]{
position:absolute;inset:0;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:var(--vibeui-toast-004-tone);color:var(--vibeui-toast-004-on-tone);
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="toast-004"][data-state="loading"] [data-part="mark"]{display:none}
[data-vibeui-block="toast-004"]:not([data-state="loading"]) [data-part="spinner"]{display:none}
@keyframes vibeui-toast-004-spin{to{transform:rotate(1turn)}}
[data-vibeui-block="toast-004"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="toast-004"] [data-part="title"]{font-size:0.875rem;font-weight:640;line-height:1.35}
[data-vibeui-block="toast-004"] [data-part="hint"]{font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-004-muted)}
/* Тонкая полоса-«пульс» вместо процентов: длительность неизвестна. */
[data-vibeui-block="toast-004"] [data-part="track"]{
position:relative;overflow:hidden;height:2px;border-radius:9999px;
margin-top:0.1875rem;background:var(--vibeui-toast-004-track);
}
[data-vibeui-block="toast-004"]:not([data-state="loading"]) [data-part="track"]{display:none}
[data-vibeui-block="toast-004"] [data-part="track"]::after{
content:"";position:absolute;inset:0 auto 0 0;width:40%;border-radius:inherit;
background:var(--vibeui-toast-004-tone);
animation:vibeui-toast-004-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-toast-004-slide{
0%{transform:translateX(-100%)}
100%{transform:translateX(250%)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="toast-004"] *{animation:none!important;transition:none!important}
[data-vibeui-block="toast-004"] [data-part="track"]::after{width:100%}
}
`

const MARKS: Record<Toast004State, string> = {
  loading: "",
  success: "✓",
  error: "!",
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
 * Уведомление операции: загрузка переходит в успех или ошибку в той же карточке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast004({
  state = "loading",
  loadingText = "Собираем архив проекта",
  successText = "Архив готов к скачиванию",
  errorText = "Не удалось собрать архив",
  hint = "Файлы больше 200 МБ пропускаем.",
  background = "",
  className,
  style,
  ...props
}: Toast004Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-toast-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const title =
    state === "loading"
      ? loadingText
      : state === "success"
        ? successText
        : errorText

  return (
    <>
      <style href="vibeui-toast-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-004"
        data-state={state}
        role={state === "error" ? "alert" : "status"}
        aria-live={state === "error" ? "assertive" : "polite"}
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          <span data-part="spinner" />
          <span data-part="mark">{MARKS[state]}</span>
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
          <span data-part="track" />
        </span>
      </div>
    </>
  )
}
