import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge006Stage = "draft" | "review" | "live" | "archived"

export type Badge006Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  stage?: Badge006Stage
  label?: string
}

// Идея компонента: стадия документа со своим знаком. У каждой стадии свой
// значок — круг, полукруг, залитый круг, перечёркнутый — поэтому она читается
// и в чёрно-белой печати, и при дальтонизме. Значки собраны из бордюров и
// градиента, без иконочного пакета.
const STYLES = `
:where([data-vibeui-block="badge-006"]){
--vibeui-badge-006-bg:oklch(0.96 0.004 265);
--vibeui-badge-006-fg:oklch(0.32 0.014 265);
--vibeui-badge-006-border:oklch(0.89 0.006 265);
--vibeui-badge-006-mark:oklch(0.55 0.014 265);
--vibeui-badge-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-006"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.5rem;padding:0 0.625rem;
border:1px solid var(--vibeui-badge-006-border);border-radius:0.4375rem;
background:var(--vibeui-badge-006-bg);color:var(--vibeui-badge-006-fg);
font-family:var(--vibeui-badge-006-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-006"][data-stage="review"]{--vibeui-badge-006-mark:oklch(0.72 0.16 75)}
[data-vibeui-block="badge-006"][data-stage="live"]{--vibeui-badge-006-mark:oklch(0.6 0.17 152)}
[data-vibeui-block="badge-006"][data-stage="archived"]{--vibeui-badge-006-mark:oklch(0.66 0.012 265);color:oklch(0.5 0.014 265)}
/* Форма знака несёт стадию: цвет только усиливает, но не заменяет её. */
[data-vibeui-block="badge-006"] [data-part="mark"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;
border:1.5px solid var(--vibeui-badge-006-mark);border-radius:9999px;
}
[data-vibeui-block="badge-006"][data-stage="review"] [data-part="mark"]{
background:linear-gradient(to right,var(--vibeui-badge-006-mark) 50%,transparent 50%);
}
[data-vibeui-block="badge-006"][data-stage="live"] [data-part="mark"]{background:var(--vibeui-badge-006-mark)}
[data-vibeui-block="badge-006"][data-stage="archived"] [data-part="mark"]::after{
content:"";position:absolute;left:-0.0625rem;right:-0.0625rem;top:50%;
height:1.5px;margin-top:-0.75px;background:var(--vibeui-badge-006-mark);
transform:rotate(-45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-006"] *{animation:none!important;transition:none!important}}
`

const STAGE_TEXT: Record<Badge006Stage, string> = {
  draft: "Черновик",
  review: "На проверке",
  live: "Опубликован",
  archived: "В архиве",
}

/**
 * Стадия документа со знаком-формой: читается и без цвета.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge006({
  stage = "review",
  label,
  className,
  style,
  ...props
}: Badge006Props) {
  return (
    <>
      <style href="vibeui-badge-006" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-006"
        data-stage={stage}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="mark" aria-hidden="true" />
        {label ?? STAGE_TEXT[stage]}
      </span>
    </>
  )
}
