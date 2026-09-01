import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  /** Готово в процентах: определённый прогресс, а не бесконечная крутилка. */
  value?: number
  /** Что именно считается: «7 из 24 файлов». */
  countLabel?: string
  cancelLabel?: string
  onCancel?: () => void
}

// Идея компонента: уведомление длинной операции с честным прогрессом. Процент
// живёт в CSS-переменной, поэтому полосу двигает одно число, а не пересборка
// разметки; рядом — счётчик и отмена, потому что ждать вслепую никто не готов.
const STYLES = `
:where([data-vibeui-block="toast-006"]){
--vibeui-toast-006-bg:oklch(0.22 0.014 265);
--vibeui-toast-006-fg:oklch(0.97 0.002 265);
--vibeui-toast-006-muted:oklch(0.76 0.008 265);
--vibeui-toast-006-track:oklch(1 0 0 / 14%);
--vibeui-toast-006-tone:oklch(0.7 0.16 200);
--vibeui-toast-006-value:0;
--vibeui-toast-006-radius:0.875rem;
--vibeui-toast-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem 0.9375rem;
border-radius:var(--vibeui-toast-006-radius);
background:var(--vibeui-toast-006-bg);color:var(--vibeui-toast-006-fg);
font-family:var(--vibeui-toast-006-font);
box-shadow:0 20px 44px -24px oklch(0.15 0.02 265 / 65%);
}
[data-vibeui-block="toast-006"] [data-part="head"]{display:flex;align-items:baseline;gap:0.75rem}
[data-vibeui-block="toast-006"] [data-part="title"]{
margin:0;flex:1 1 auto;min-width:0;
font-size:0.875rem;font-weight:640;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-006"] [data-part="percent"]{
flex:none;font-size:0.875rem;font-weight:700;
font-variant-numeric:tabular-nums;color:var(--vibeui-toast-006-tone);
}
/* Полоса на переменной: прогресс двигает одно число, разметка не меняется. */
[data-vibeui-block="toast-006"] [data-part="track"]{
position:relative;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-toast-006-track);
}
[data-vibeui-block="toast-006"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:inherit;
width:calc(var(--vibeui-toast-006-value) * 1%);
background:linear-gradient(90deg,var(--vibeui-toast-006-tone),color-mix(in oklab,var(--vibeui-toast-006-tone) 55%,oklch(0.85 0.13 150)));
transition:width .3s ease;
}
[data-vibeui-block="toast-006"] [data-part="foot"]{display:flex;align-items:center;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="toast-006"] [data-part="count"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-toast-006-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="toast-006"] [data-part="cancel"]{
appearance:none;cursor:pointer;border:0;background:transparent;
padding:0.25rem 0.375rem;margin:-0.25rem -0.375rem;border-radius:0.375rem;
font:inherit;font-size:0.75rem;font-weight:600;
color:var(--vibeui-toast-006-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="toast-006"] [data-part="cancel"]:hover{color:var(--vibeui-toast-006-fg);background:oklch(1 0 0 / 10%)}
[data-vibeui-block="toast-006"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-toast-006-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Уведомление длинной операции: полоса прогресса, счётчик и отмена.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast006({
  title = "Загружаем фотографии",
  value = 62,
  countLabel = "15 из 24 файлов",
  cancelLabel = "Отменить",
  onCancel,
  className,
  style,
  ...props
}: Toast006Props) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  const palette = {
    "--vibeui-toast-006-value": clamped,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-006"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="title">{title}</p>
          <span data-part="percent">{clamped}%</span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={title}
        >
          <span data-part="fill" />
        </div>
        <div data-part="foot">
          <span data-part="count">{countLabel}</span>
          {cancelLabel ? (
            <button data-part="cancel" type="button" onClick={onCancel}>
              {cancelLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
