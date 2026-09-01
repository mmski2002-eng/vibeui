import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button048Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  /** Провайдер входа: от него зависят подпись и знак слева. */
  provider?: "google" | "github" | "apple"
  label?: string
}

// Идея компонента: кнопка входа через провайдера. Знак прибит к левому краю,
// а подпись центрируется по всей кнопке — так ряд кнопок разных провайдеров
// выстраивается в колонку с общей осью текста. Знаки здесь условные, из CSS:
// настоящие логотипы приносит проект, у них свои правила использования.
const STYLES = `
:where([data-vibeui-block="button-048"]){
--vibeui-button-048-surface:oklch(1 0 0);
--vibeui-button-048-border:oklch(0.87 0.006 265);
--vibeui-button-048-fg:oklch(0.24 0.02 265);
--vibeui-button-048-ring:oklch(0.55 0.02 265 / 65%);
--vibeui-button-048-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-048"]{
position:relative;appearance:none;cursor:pointer;box-sizing:border-box;
display:flex;align-items:center;justify-content:center;
width:100%;max-width:20rem;height:2.75rem;padding:0 3rem;
border:1px solid var(--vibeui-button-048-border);border-radius:0.625rem;
background:var(--vibeui-button-048-surface);color:var(--vibeui-button-048-fg);
font-family:var(--vibeui-button-048-font);font-size:0.875rem;font-weight:600;line-height:1;
box-shadow:0 1px 2px oklch(0 0 0 / 6%);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-048"]:hover:not(:disabled){
background:oklch(0.97 0.003 265);border-color:oklch(0.8 0.008 265);
}
[data-vibeui-block="button-048"]:focus-visible{outline:2px solid var(--vibeui-button-048-ring);outline-offset:2px}
[data-vibeui-block="button-048"]:disabled{cursor:not-allowed;opacity:.55}
/* Знак прижат к краю, подпись центрируется по всей ширине кнопки. */
[data-vibeui-block="button-048"] [data-part="mark"]{
position:absolute;left:0.9375rem;top:50%;margin-top:-0.5625rem;
width:1.125rem;height:1.125rem;border-radius:50%;
}
[data-vibeui-block="button-048"][data-provider="google"] [data-part="mark"]{
background:conic-gradient(oklch(0.62 0.22 27) 0 25%,oklch(0.8 0.16 85) 0 50%,oklch(0.6 0.16 150) 0 75%,oklch(0.55 0.19 260) 0);
}
[data-vibeui-block="button-048"][data-provider="google"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.5rem;height:0.5rem;
margin:-0.25rem 0 0 -0.25rem;border-radius:50%;background:var(--vibeui-button-048-surface);
}
[data-vibeui-block="button-048"][data-provider="github"] [data-part="mark"]{
background:oklch(0.24 0.01 265);
}
[data-vibeui-block="button-048"][data-provider="github"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;top:0.5rem;width:0.625rem;height:0.4375rem;
margin-left:-0.3125rem;border-radius:0.25rem 0.25rem 0 0;
background:var(--vibeui-button-048-surface);
}
[data-vibeui-block="button-048"][data-provider="apple"] [data-part="mark"]{
background:oklch(0.2 0 0);border-radius:0.375rem;
}
[data-vibeui-block="button-048"][data-provider="apple"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.4375rem;height:0.4375rem;
margin:-0.21875rem 0 0 -0.21875rem;border-radius:50% 50% 50% 0;
background:var(--vibeui-button-048-surface);transform:rotate(-45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-048"]{transition:none!important}}
`

const LABELS = {
  google: "Продолжить с Google",
  github: "Продолжить с GitHub",
  apple: "Продолжить с Apple",
}

/**
 * Кнопка входа через провайдера: знак у края, подпись по центру.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button048({
  provider = "google",
  label,
  type = "button",
  className,
  style,
  ...props
}: Button048Props) {
  return (
    <>
      <style href="vibeui-button-048" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-048"
        data-provider={provider}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="mark" aria-hidden="true" />
        {label ?? LABELS[provider]}
      </button>
    </>
  )
}
