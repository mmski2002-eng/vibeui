import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from "react"

export type Button033Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onClick"
> & {
  children?: ReactNode
  /** Постоянно подсвеченное состояние: кнопка-призрак как активный пункт. */
  active?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  accent?: string
}

// Идея компонента: кнопка без собственного пятна. В покое у неё нет ни фона,
// ни рамки — она живёт на чужой поверхности и берёт вес только на наведении.
// Поэтому корень блока — сама поверхность: без неё призрак не с чем сравнить,
// а на тёмной подложке каталога его было бы не видно.
const STYLES = `
:where([data-vibeui-block="button-033"]){
--vibeui-button-033-surface:oklch(0.99 0.003 265);
--vibeui-button-033-border:oklch(0.9 0.006 265);
--vibeui-button-033-fg:oklch(0.46 0.014 265);
--vibeui-button-033-fg-strong:oklch(0.24 0.02 265);
--vibeui-button-033-accent:oklch(0.55 0.17 265);
--vibeui-button-033-radius:0.5rem;
--vibeui-button-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-033"]{
display:inline-flex;box-sizing:border-box;padding:0.375rem;
background:var(--vibeui-button-033-surface);
border:1px solid var(--vibeui-button-033-border);
border-radius:calc(var(--vibeui-button-033-radius) + 0.375rem);
font-family:var(--vibeui-button-033-font);
}
[data-vibeui-block="button-033"] [data-part="button"]{
appearance:none;border:0;background:transparent;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.75rem;border-radius:var(--vibeui-button-033-radius);
font:inherit;font-size:0.875rem;font-weight:500;line-height:1;
color:var(--vibeui-button-033-fg);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-033"] [data-part="dot"]{
flex:none;width:0.4375rem;height:0.4375rem;border-radius:2px;
background:currentColor;opacity:.45;
transition:opacity .16s ease,transform .16s ease;
}
[data-vibeui-block="button-033"] [data-part="button"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-button-033-accent) 10%,transparent);
color:var(--vibeui-button-033-fg-strong);
}
[data-vibeui-block="button-033"] [data-part="button"]:hover:not(:disabled) [data-part="dot"]{opacity:.9;transform:rotate(45deg)}
[data-vibeui-block="button-033"] [data-part="button"][aria-current="true"]{
background:color-mix(in oklab,var(--vibeui-button-033-accent) 14%,transparent);
color:var(--vibeui-button-033-accent);font-weight:650;
}
[data-vibeui-block="button-033"] [data-part="button"][aria-current="true"] [data-part="dot"]{opacity:1;transform:rotate(45deg)}
[data-vibeui-block="button-033"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-button-033-accent);outline-offset:2px;
}
[data-vibeui-block="button-033"] [data-part="button"]:disabled{cursor:not-allowed;opacity:.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-033"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка-призрак на собственной поверхности: вес появляется только
 * на наведении. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button033({
  children = "Настройки",
  active = false,
  disabled,
  onClick,
  accent,
  className,
  style,
  ...props
}: Button033Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-033-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-033" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-033"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="button"
          aria-current={active ? "true" : undefined}
          disabled={disabled}
          onClick={onClick}
        >
          <span data-part="dot" aria-hidden="true" />
          {children}
        </button>
      </div>
    </>
  )
}
