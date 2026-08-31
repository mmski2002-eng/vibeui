import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  note?: string
  /** Окружение: попадает в текст и в подпись для скринридера. */
  environment?: string
}

// Идея компонента: полоса тестового режима. Косая штриховка и моноширинный
// шрифт делают её непохожей на продуктовый интерфейс — именно этого мы и
// добиваемся: она должна кричать «это не боевые данные» с любого скриншота.
const STYLES = `
:where([data-vibeui-block="banner-004"]){
--vibeui-banner-004-bg:oklch(0.97 0.05 95);
--vibeui-banner-004-fg:oklch(0.32 0.07 75);
--vibeui-banner-004-muted:oklch(0.48 0.06 75);
--vibeui-banner-004-stripe:oklch(0.86 0.11 95);
--vibeui-banner-004-border:oklch(0.82 0.11 95);
--vibeui-banner-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-banner-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="banner-004"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-004-font);color:var(--vibeui-banner-004-fg);
}
[data-vibeui-block="banner-004"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;
padding:0.625rem 0.9375rem;
border:1px solid var(--vibeui-banner-004-border);
border-radius:0.75rem;
background:var(--vibeui-banner-004-bg);
}
/* Косая штриховка сверху: полосу невозможно спутать с боевым интерфейсом. */
[data-vibeui-block="banner-004"] [data-part="tape"]{
flex:none;width:2.75rem;height:1.125rem;border-radius:0.25rem;
background:repeating-linear-gradient(
-45deg,
var(--vibeui-banner-004-stripe) 0 0.375rem,
transparent 0.375rem 0.75rem
);
}
[data-vibeui-block="banner-004"] [data-part="label"]{
font-family:var(--vibeui-banner-004-mono);
font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
white-space:nowrap;
}
[data-vibeui-block="banner-004"] [data-part="note"]{
margin:0;min-width:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-banner-004-muted);
}
[data-vibeui-block="banner-004"] [data-part="env"]{
margin-left:auto;flex:none;
padding:0.125rem 0.5rem;border-radius:0.375rem;
border:1px dashed var(--vibeui-banner-004-border);
background:oklch(1 0 0 / 55%);
font-family:var(--vibeui-banner-004-mono);font-size:0.6875rem;font-weight:650;
}
@container (max-width: 30rem){
[data-vibeui-block="banner-004"] [data-part="tape"]{display:none}
[data-vibeui-block="banner-004"] [data-part="env"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса тестового режима: штриховка, моноширинная метка и имя окружения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner004({
  label = "Тестовый режим",
  note = "Платежи не проходят, письма никому не уходят. Данные обнуляются каждую ночь.",
  environment = "staging",
  className,
  style,
  ...props
}: Banner004Props) {
  return (
    <>
      <style href="vibeui-banner-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-004"
        role="note"
        aria-label={`${label}: ${environment}`}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <span data-part="tape" aria-hidden="true" />
          <span data-part="label">{label}</span>
          <p data-part="note">{note}</p>
          {environment ? <span data-part="env">{environment}</span> : null}
        </div>
      </div>
    </>
  )
}
