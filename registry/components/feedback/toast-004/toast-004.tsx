import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast004State = "loading" | "success" | "error"

export type Toast004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  /** Стадия операции: одно уведомление живёт от начала до результата. */
  state?: Toast004State
  loadingText?: string
  successText?: string
  errorText?: string
  /** Вторая строка: подробность результата. Пустая строка убирает её. */
  hint?: string
}

// Идея компонента: одно уведомление на всю операцию. Вместо «начали» и потом
// отдельного «готово» карточка остаётся на месте и меняет только значок и
// строку — глазу не надо заново искать, о чём речь.
const STYLES = `
:where([data-vibeui-block="toast-004"]){
--vibeui-toast-004-bg:oklch(1 0 0);
--vibeui-toast-004-fg:oklch(0.24 0.014 265);
--vibeui-toast-004-muted:oklch(0.55 0.014 265);
--vibeui-toast-004-border:oklch(0.9 0.006 265);
--vibeui-toast-004-track:oklch(0.9 0.01 265);
--vibeui-toast-004-tone:oklch(0.55 0.17 265);
--vibeui-toast-004-radius:0.875rem;
--vibeui-toast-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-004"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.8125rem 0.9375rem;
border:1px solid var(--vibeui-toast-004-border);
border-radius:var(--vibeui-toast-004-radius);
background:var(--vibeui-toast-004-bg);color:var(--vibeui-toast-004-fg);
font-family:var(--vibeui-toast-004-font);
box-shadow:0 18px 38px -26px oklch(0.2 0.02 265 / 45%);
}
[data-vibeui-block="toast-004"][data-state="success"]{--vibeui-toast-004-tone:oklch(0.62 0.15 152)}
[data-vibeui-block="toast-004"][data-state="error"]{--vibeui-toast-004-tone:oklch(0.6 0.2 25)}
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
background:var(--vibeui-toast-004-tone);color:oklch(0.99 0.005 265);
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
 * Уведомление операции: загрузка переходит в успех или ошибку в той же карточке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast004({
  state = "loading",
  loadingText = "Собираем архив проекта",
  successText = "Архив готов к скачиванию",
  errorText = "Не удалось собрать архив",
  hint = "Файлы больше 200 МБ пропускаем.",
  className,
  style,
  ...props
}: Toast004Props) {
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
        data-vibeui-block="toast-004"
        data-state={state}
        role={state === "error" ? "alert" : "status"}
        aria-live={state === "error" ? "assertive" : "polite"}
        className={className}
        style={style as CSSProperties}
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
