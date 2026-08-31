import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button029Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  secondaryLabel?: string
  /** Мелкая строка под кнопками: согласие, условия, срок ответа. */
  note?: string
  accent?: string
}

// Идея компонента: концовка формы целиком, а не одна кнопка. На узкой
// колонке основное действие растянуто во всю ширину, отмена стоит под ним
// и тоже во всю ширину — большой палец попадает в любую точку строки.
// От 26rem собственной ширины пара перестраивается в ряд, отмена уходит
// влево и ужимается по содержимому. Считается ширина самого блока через
// container query, поэтому в узкой колонке десктопа раскладка тоже мобильная.
const STYLES = `
:where([data-vibeui-block="button-029"]){
--vibeui-button-029-bg:oklch(1 0 0);
--vibeui-button-029-fg:oklch(0.26 0.016 265);
--vibeui-button-029-muted:oklch(0.55 0.014 265);
--vibeui-button-029-border:oklch(0.9 0.006 265);
--vibeui-button-029-accent:oklch(0.55 0.17 265);
--vibeui-button-029-accent-fg:oklch(0.99 0.01 265);
--vibeui-button-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="button-029"]{
width:100%;max-width:32rem;box-sizing:border-box;
padding:1rem;border:1px solid var(--vibeui-button-029-border);border-radius:0.875rem;
background:var(--vibeui-button-029-bg);color:var(--vibeui-button-029-fg);
font-family:var(--vibeui-button-029-font);
}
[data-vibeui-block="button-029"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="button-029"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:100%;height:2.75rem;padding:0 1.25rem;box-sizing:border-box;
border:1px solid transparent;border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-weight:650;line-height:1;
transition:filter .16s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-029"] [data-part="primary"]{
background:var(--vibeui-button-029-accent);color:var(--vibeui-button-029-accent-fg);
}
[data-vibeui-block="button-029"] [data-part="primary"]:hover{filter:brightness(0.96)}
[data-vibeui-block="button-029"] [data-part="secondary"]{
background:transparent;color:var(--vibeui-button-029-muted);border-color:var(--vibeui-button-029-border);
}
[data-vibeui-block="button-029"] [data-part="secondary"]:hover{color:var(--vibeui-button-029-fg);border-color:var(--vibeui-button-029-muted)}
[data-vibeui-block="button-029"] button:focus-visible{outline:2px solid var(--vibeui-button-029-accent);outline-offset:2px}
[data-vibeui-block="button-029"] [data-part="note"]{
margin:0.75rem 0 0;text-align:center;
color:var(--vibeui-button-029-muted);font-size:0.75rem;line-height:1.4;
}
/* Правила висят на внутренней раскладке: контейнерный запрос не действует
   на сам контейнер, поэтому корню его давать бессмысленно. */
@container (min-width: 26rem){
[data-vibeui-block="button-029"] [data-part="shell"]{flex-direction:row;justify-content:flex-end}
[data-vibeui-block="button-029"] button{width:auto}
[data-vibeui-block="button-029"] [data-part="primary"]{order:2;min-width:11rem}
[data-vibeui-block="button-029"] [data-part="secondary"]{order:1}
[data-vibeui-block="button-029"] [data-part="note"]{text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-029"] *{animation:none!important;transition:none!important}}
`

/**
 * Концовка формы: основная кнопка во всю ширину и отмена под ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button029({
  label = "Отправить заявку",
  secondaryLabel = "Сохранить черновик",
  note = "Отвечаем в течение одного рабочего дня",
  accent,
  className,
  style,
  ...props
}: Button029Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-029-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-029"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <button type="submit" data-part="primary">
            {label}
          </button>
          {secondaryLabel ? (
            <button type="button" data-part="secondary">
              {secondaryLabel}
            </button>
          ) : null}
        </div>
        {note ? <p data-part="note">{note}</p> : null}
      </div>
    </>
  )
}
