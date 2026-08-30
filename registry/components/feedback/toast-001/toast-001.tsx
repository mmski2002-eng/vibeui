import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast001Tone = "neutral" | "success" | "danger"

export type Toast001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  tone?: Toast001Tone
  title?: string
  description?: string
  /** Подпись действия отмены. Пустая строка убирает кнопку. */
  undoLabel?: string
  /** Сколько секунд живёт полоса времени. 0 — полосы нет. */
  duration?: number
  onUndo?: () => void
  onClose?: () => void
}

// Идея компонента: уведомление показывает, сколько ему осталось. Полоса
// внизу убывает ровно за отведённое время, поэтому исчезновение не выглядит
// внезапным, а действие «Отменить» видно, пока оно ещё возможно.
const STYLES = `
:where([data-vibeui-block="toast-001"]){
--vibeui-toast-001-fg:oklch(0.97 0.002 265);
--vibeui-toast-001-muted:oklch(0.78 0.008 265);
--vibeui-toast-001-bg:oklch(0.24 0.014 265);
--vibeui-toast-001-tone:oklch(0.72 0.15 152);
--vibeui-toast-001-radius:0.75rem;
--vibeui-toast-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-001"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;overflow:hidden;
padding:0.8125rem 0.875rem;
border-radius:var(--vibeui-toast-001-radius);
background:var(--vibeui-toast-001-bg);color:var(--vibeui-toast-001-fg);
font-family:var(--vibeui-toast-001-font);
box-shadow:0 18px 40px -20px oklch(0.15 0.02 265 / 60%);
}
[data-vibeui-block="toast-001"] [data-part="dot"]{
width:0.5rem;height:0.5rem;flex:none;margin-top:0.3125rem;border-radius:9999px;
background:var(--vibeui-toast-001-tone);
}
[data-vibeui-block="toast-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="toast-001"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="toast-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-001-muted)}
[data-vibeui-block="toast-001"] [data-part="undo"],
[data-vibeui-block="toast-001"] [data-part="close"]{
appearance:none;border:0;background:transparent;cursor:pointer;
font:inherit;color:var(--vibeui-toast-001-fg);flex:none;
border-radius:0.375rem;transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-001"] [data-part="undo"]{
font-size:0.8125rem;font-weight:600;padding:0.25rem 0.5rem;
color:var(--vibeui-toast-001-tone);
}
[data-vibeui-block="toast-001"] [data-part="undo"]:hover{background:oklch(1 0 0 / 10%)}
[data-vibeui-block="toast-001"] [data-part="close"]{
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;font-size:1rem;line-height:1;
color:var(--vibeui-toast-001-muted);
}
[data-vibeui-block="toast-001"] [data-part="close"]:hover{background:oklch(1 0 0 / 10%);color:var(--vibeui-toast-001-fg)}
[data-vibeui-block="toast-001"] [data-part="undo"]:focus-visible,
[data-vibeui-block="toast-001"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-001-tone);outline-offset:2px}
/* Полоса времени: видно, сколько уведомлению осталось. */
[data-vibeui-block="toast-001"] [data-part="timer"]{
position:absolute;left:0;bottom:0;height:2px;width:100%;
background:var(--vibeui-toast-001-tone);opacity:.55;
transform-origin:left center;
animation:vibeui-toast-001-drain linear forwards;
animation-duration:calc(var(--vibeui-toast-001-duration,5) * 1s);
}
@keyframes vibeui-toast-001-drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
[data-vibeui-block="toast-001"][data-tone="danger"]{--vibeui-toast-001-tone:oklch(0.68 0.19 25)}
[data-vibeui-block="toast-001"][data-tone="neutral"]{--vibeui-toast-001-tone:oklch(0.8 0.02 265)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="toast-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="toast-001"] [data-part="timer"]{display:none}
}
`

/**
 * Уведомление с полосой оставшегося времени и действием отмены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast001({
  tone = "success",
  title = "Страница опубликована",
  description = "Изменения уже видны по адресу проекта.",
  undoLabel = "Отменить",
  duration = 5,
  onUndo,
  onClose,
  className,
  style,
  ...props
}: Toast001Props) {
  const palette = {
    "--vibeui-toast-001-duration": duration,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-001"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="text">
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {undoLabel ? (
          <button data-part="undo" type="button" onClick={onUndo}>
            {undoLabel}
          </button>
        ) : null}
        <button
          data-part="close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
        {duration > 0 ? <span data-part="timer" aria-hidden="true" /> : null}
      </div>
    </>
  )
}
