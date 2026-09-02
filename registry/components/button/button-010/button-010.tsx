import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button010Status = "idle" | "loading" | "done"

export type Button010Props = ComponentPropsWithoutRef<"button"> & {
  status?: Button010Status
  /** 0–100. Управляется снаружи: компонент ничего не качает сам. */
  progress?: number
  /** Подпись загрузки. `{percent}` подставляется значением progress. */
  loadingLabel?: string
  doneLabel?: string
  accent?: string
}

// Идея компонента: прогресс живёт в самой подложке кнопки, а не в отдельной
// полосе рядом. Заливка растёт слева направо по ширине кнопки, подпись
// меняется по статусу, в конце появляется галочка. Прогресс приходит снаружи
// пропом — компонент не знает про сеть и ничего не качает сам.
//
// Пятно кнопки тёмное по замыслу, но через light-dark() в тёмном контексте
// оно светлее фона страницы, а заливка прогресса — светлее пятна: полоса
// должна читаться в обеих темах. Подпись остаётся светлой в обеих ветках.
const STYLES = `
:where([data-vibeui-block="button-010"]){
--vibeui-button-010-bg:light-dark(oklch(0.24 0.014 265),oklch(0.34 0.016 265));
--vibeui-button-010-fg:oklch(0.98 0.003 265);
--vibeui-button-010-fill:light-dark(oklch(0.55 0.14 250),oklch(0.62 0.135 250));
--vibeui-button-010-done:light-dark(oklch(0.6 0.14 158),oklch(0.66 0.135 158));
--vibeui-button-010-ring:light-dark(oklch(0.72 0.012 265),oklch(0.84 0.012 265));
--vibeui-button-010-radius:0.625rem;
--vibeui-button-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-010"]{
position:relative;overflow:hidden;isolation:isolate;appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:var(--vibeui-button-010-radius);
font-family:var(--vibeui-button-010-font);font-size:0.875rem;font-weight:500;line-height:1;
background:var(--vibeui-button-010-bg);color:var(--vibeui-button-010-fg);
font-variant-numeric:tabular-nums;
transition:background-color .2s ease;
}
[data-vibeui-block="button-010"] [data-part="fill"]{
position:absolute;inset:0;z-index:-1;transform-origin:left center;
background:var(--vibeui-button-010-fill);
transition:transform .3s cubic-bezier(0.16,1,0.3,1),background-color .25s ease;
}
[data-vibeui-block="button-010"][data-status="done"] [data-part="fill"]{background:var(--vibeui-button-010-done)}
[data-vibeui-block="button-010"][data-status="idle"]:hover:not(:disabled){background:color-mix(in oklab, var(--vibeui-button-010-bg) 82%, white)}
[data-vibeui-block="button-010"] svg{width:0.875rem;height:0.875rem;flex:none}
[data-vibeui-block="button-010"] [data-part="arrow"]{transition:transform .22s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-010"][data-status="idle"]:hover:not(:disabled) [data-part="arrow"]{transform:translateY(2px)}
[data-vibeui-block="button-010"]:focus-visible{outline:2px solid var(--vibeui-button-010-ring);outline-offset:2px}
[data-vibeui-block="button-010"]:disabled{cursor:not-allowed;opacity:.7}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-010"] *{transition:none!important}}
`

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
}

/**
 * Кнопка загрузки: прогресс заливает подложку кнопки. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Button010({
  status = "idle",
  progress = 0,
  loadingLabel = "Загружаем… {percent}%",
  doneLabel = "Готово",
  accent,
  type = "button",
  disabled,
  className,
  style,
  children = "Скачать отчёт",
  ...props
}: Button010Props) {
  const percent =
    status === "done" ? 100 : status === "loading" ? clampPercent(progress) : 0

  const palette = {
    ...(accent ? { "--vibeui-button-010-fill": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-010" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-010"
        data-status={status}
        disabled={disabled || status === "loading"}
        aria-busy={status === "loading" || undefined}
        className={className}
        style={palette}
      >
        <span
          data-part="fill"
          aria-hidden="true"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
        {status === "idle" ? (
          <svg
            data-part="arrow"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 1v9m0 0 3.5-3.5M7 10 3.5 6.5M1.5 12.5h11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
        {status === "done" ? (
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="m2 7.5 3.5 3.5L12 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
        {status === "loading"
          ? loadingLabel.replace("{percent}", String(clampPercent(progress)))
          : status === "done"
            ? doneLabel
            : children}
      </button>
    </>
  )
}
