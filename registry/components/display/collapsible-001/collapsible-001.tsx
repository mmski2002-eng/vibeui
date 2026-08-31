import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible001Props = Omit<
  ComponentPropsWithoutRef<"details">,
  "children" | "title"
> & {
  title?: string
  hint?: string
  text?: string
  accent?: string
}

// Идея компонента: самая простая свёртка — один <details> без единой строки
// клиентского кода. Состояние живёт в разметке, поэтому раскрытие работает
// до гидратации, попадает в поиск по странице и печатается развёрнутым.
// Значок нарисован двумя гранями квадрата: подменять символ на ± не нужно.
const STYLES = `
:where([data-vibeui-block="collapsible-001"]){
--vibeui-collapsible-001-bg:oklch(1 0 0);
--vibeui-collapsible-001-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-001-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-001-border:oklch(0.9 0.006 265);
--vibeui-collapsible-001-accent:oklch(0.55 0.19 262);
--vibeui-collapsible-001-radius:0.875rem;
--vibeui-collapsible-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-001"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;
background:var(--vibeui-collapsible-001-bg);color:var(--vibeui-collapsible-001-fg);
border:1px solid var(--vibeui-collapsible-001-border);
border-radius:var(--vibeui-collapsible-001-radius);
font-family:var(--vibeui-collapsible-001-font);
}
[data-vibeui-block="collapsible-001"] summary{
display:flex;align-items:center;gap:0.625rem;
padding:0.8125rem 0.875rem;cursor:pointer;list-style:none;
border-radius:var(--vibeui-collapsible-001-radius);
font-size:0.875rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="collapsible-001"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-001"] summary:hover{background:color-mix(in oklab,var(--vibeui-collapsible-001-accent) 6%,transparent)}
[data-vibeui-block="collapsible-001"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-001-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-001"] [data-part="hint"]{
margin-left:auto;font-size:0.75rem;font-weight:500;color:var(--vibeui-collapsible-001-muted);
}
/* Значок — две грани квадрата: поворот честнее подмены символа. */
[data-vibeui-block="collapsible-001"] [data-part="mark"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:2px solid var(--vibeui-collapsible-001-muted);
border-bottom:2px solid var(--vibeui-collapsible-001-muted);
transform:rotate(-45deg);transform-origin:60% 60%;
transition:transform .18s ease;
}
[data-vibeui-block="collapsible-001"] [data-part="mark"]:only-child{margin-left:auto}
[data-vibeui-block="collapsible-001"][open] [data-part="mark"]{transform:rotate(45deg)}
[data-vibeui-block="collapsible-001"] [data-part="body"]{
margin:0;padding:0 0.875rem 0.875rem;
border-top:1px solid var(--vibeui-collapsible-001-border);
padding-top:0.75rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-collapsible-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Базовая свёртка на нативном details: состояние в разметке, клиентского
 * кода нет. Один файл, ноль зависимостей, собственная палитра.
 */
export function Collapsible001({
  title = "Как устанавливается компонент",
  hint = "30 секунд",
  text = "Скопируйте команду из карточки, выполните её в корне проекта — файл ляжет в components/vibeui и сразу заработает: внешних зависимостей у него нет.",
  accent,
  className,
  style,
  ...props
}: Collapsible001Props) {
  const palette = {
    ...(accent ? { "--vibeui-collapsible-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-001" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-vibeui-block="collapsible-001"
        className={className}
        style={palette}
      >
        <summary>
          {title}
          {hint ? <span data-part="hint">{hint}</span> : null}
          <span data-part="mark" aria-hidden="true" />
        </summary>
        <p data-part="body">{text}</p>
      </details>
    </>
  )
}
