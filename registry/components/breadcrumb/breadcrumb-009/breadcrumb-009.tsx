import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb009Step = {
  label: string
  href?: string
}

export type Breadcrumb009Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: Breadcrumb009Step[]
  current?: number
  accent?: string
}

// Идея компонента: путь мастера, где пройденное кликабельно, а будущее — нет.
// Разница между «уже был» и «ещё не был» показана не только цветом: у
// пройденных шагов галочка, у будущих — номер. Вперёд через крошки не
// прыгают: следующий шаг может зависеть от ответов на текущем.
const STYLES = `
:where([data-vibeui-block="breadcrumb-009"]){
--vibeui-breadcrumb-009-surface:oklch(1 0 0);
--vibeui-breadcrumb-009-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-009-fg:oklch(0.26 0.016 265);
--vibeui-breadcrumb-009-muted:oklch(0.6 0.014 265);
--vibeui-breadcrumb-009-line:oklch(0.86 0.008 265);
--vibeui-breadcrumb-009-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-009-done:oklch(0.6 0.15 152);
--vibeui-breadcrumb-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-009"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-009-surface);
border:1px solid var(--vibeui-breadcrumb-009-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-009-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-009-muted);
}
[data-vibeui-block="breadcrumb-009"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-009"] li{display:inline-flex;align-items:center;gap:0.5rem}
[data-vibeui-block="breadcrumb-009"] li + li::before{
content:"";width:1rem;height:1px;background:var(--vibeui-breadcrumb-009-line);
}
[data-vibeui-block="breadcrumb-009"] [data-part="step"]{display:inline-flex;align-items:center;gap:0.375rem;color:inherit;text-decoration:none;border-radius:0.3125rem}
[data-vibeui-block="breadcrumb-009"] a[data-part="step"]:hover{color:var(--vibeui-breadcrumb-009-fg)}
[data-vibeui-block="breadcrumb-009"] a[data-part="step"]:focus-visible{outline:2px solid var(--vibeui-breadcrumb-009-accent);outline-offset:2px}
/* Метка шага: у пройденных галочка, у остальных номер. */
[data-vibeui-block="breadcrumb-009"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1px solid var(--vibeui-breadcrumb-009-line);
font-size:0.625rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="breadcrumb-009"] [data-state="done"] [data-part="mark"]{
border-color:transparent;background:var(--vibeui-breadcrumb-009-done);color:oklch(0.99 0.01 152);
}
[data-vibeui-block="breadcrumb-009"] [data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-breadcrumb-009-accent);color:var(--vibeui-breadcrumb-009-accent);
}
[data-vibeui-block="breadcrumb-009"] [data-state="current"]{color:var(--vibeui-breadcrumb-009-fg);font-weight:650}
[data-vibeui-block="breadcrumb-009"] [data-state="todo"]{color:var(--vibeui-breadcrumb-009-muted)}
[data-vibeui-block="breadcrumb-009"] [data-part="tick"]{
width:0.25rem;height:0.4375rem;margin-top:-0.0625rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Breadcrumb009Step[] = [
  { label: "Корзина", href: "#" },
  { label: "Доставка", href: "#" },
  { label: "Оплата" },
  { label: "Готово" },
]

/**
 * Путь мастера: пройденные шаги кликабельны, будущие — нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb009({
  steps = DEFAULT_STEPS,
  current = 2,
  accent,
  className,
  style,
  ...props
}: Breadcrumb009Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-009" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-009"
        aria-label={`Шаг ${current + 1} из ${steps.length}`}
        className={className}
        style={palette}
      >
        <ol>
          {steps.map((step, index) => {
            const state =
              index < current ? "done" : index === current ? "current" : "todo"
            const content = (
              <>
                <span data-part="mark" aria-hidden="true">
                  {state === "done" ? <span data-part="tick" /> : index + 1}
                </span>
                {step.label}
              </>
            )

            return (
              <li key={step.label} data-state={state}>
                {state === "done" && step.href ? (
                  <a data-part="step" href={step.href}>
                    {content}
                  </a>
                ) : (
                  <span
                    data-part="step"
                    aria-current={state === "current" ? "step" : undefined}
                  >
                    {content}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
