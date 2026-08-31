import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge019Plan = "free" | "pro" | "business"

export type Badge019Props = ComponentPropsWithoutRef<"span"> & {
  plan?: Badge019Plan
  label?: string
}

// Идея компонента: метка тарифа, в которой старшинство читается количеством
// ромбов, а не насыщенностью цвета. Тарифы выстроены в ряд, и пользователю
// важно не «какой он», а «выше или ниже соседнего»: цвет такой порядок не
// передаёт, а два ромба против одного — передают, в том числе в чёрно-белой
// печати счёта.
const STYLES = `
:where([data-vibeui-block="badge-019"]){
--vibeui-badge-019-bg:oklch(0.97 0.004 265);
--vibeui-badge-019-fg:oklch(0.38 0.014 265);
--vibeui-badge-019-border:oklch(0.88 0.006 265);
--vibeui-badge-019-mark:oklch(0.6 0.02 265);
--vibeui-badge-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-019"]{
display:inline-flex;align-items:center;gap:0.375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-019-border);border-radius:0.5rem;
background:var(--vibeui-badge-019-bg);color:var(--vibeui-badge-019-fg);
font-family:var(--vibeui-badge-019-font);font-size:0.6875rem;font-weight:700;line-height:1;
letter-spacing:0.07em;text-transform:uppercase;vertical-align:middle;
}
[data-vibeui-block="badge-019"][data-plan="pro"]{
--vibeui-badge-019-fg:oklch(0.36 0.07 75);
--vibeui-badge-019-border:oklch(0.82 0.09 80);
--vibeui-badge-019-mark:oklch(0.66 0.14 78);
background:linear-gradient(135deg,oklch(0.96 0.05 85),oklch(0.91 0.09 78));
}
[data-vibeui-block="badge-019"][data-plan="business"]{
--vibeui-badge-019-fg:oklch(0.97 0.01 265);
--vibeui-badge-019-border:oklch(0.42 0.05 265);
--vibeui-badge-019-mark:oklch(0.86 0.09 85);
background:linear-gradient(135deg,oklch(0.32 0.03 265),oklch(0.24 0.03 275));
}
[data-vibeui-block="badge-019"] [data-part="marks"]{
display:inline-flex;align-items:center;gap:0.1875rem;flex:none;
}
[data-vibeui-block="badge-019"] [data-part="mark"]{
width:0.375rem;height:0.375rem;
background:var(--vibeui-badge-019-mark);
/* Ромб, а не точка: старшинство должно отличаться и формой знака. */
clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-019"] *{animation:none!important;transition:none!important}}
`

const LEVELS: Record<Badge019Plan, number> = { free: 0, pro: 1, business: 2 }

/**
 * Метка тарифа: старшинство плана считывается числом ромбов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge019({
  plan = "pro",
  label = "Pro",
  className,
  style,
  ...props
}: Badge019Props) {
  const level = LEVELS[plan]

  return (
    <>
      <style href="vibeui-badge-019" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-019"
        data-plan={plan}
        className={className}
        style={style as CSSProperties}
      >
        {label}
        {level > 0 ? (
          <span data-part="marks" aria-hidden="true">
            {Array.from({ length: level }, (_, index) => (
              <span key={index} data-part="mark" />
            ))}
          </span>
        ) : null}
      </span>
    </>
  )
}
