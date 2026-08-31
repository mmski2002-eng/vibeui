import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup008Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  page?: number
  total?: number
  label?: string
  accent?: string
}

// Идея компонента: пагинатор из трёх ячеек — назад, счётчик, вперёд. Счётчик
// стоит внутри той же рамки, что и кнопки, поэтому группа читается как один
// орган управления. Ширина ячейки со счётчиком зафиксирована и цифры набраны
// табличными: при переходе с «9 / 12» на «10 / 12» кнопки не прыгают.
// Полное «Страница 3 из 12» лежит рядом текстом для скринридера — дробь
// вслух звучит как «три дробь двенадцать» и смысла не несёт.
const STYLES = `
:where([data-vibeui-block="buttongroup-008"]){
--vibeui-buttongroup-008-surface:oklch(1 0 0);
--vibeui-buttongroup-008-fg:oklch(0.26 0.016 265);
--vibeui-buttongroup-008-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-008-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-008-hover:oklch(0.96 0.004 265);
--vibeui-buttongroup-008-accent:oklch(0.55 0.17 265);
--vibeui-buttongroup-008-radius:0.625rem;
--vibeui-buttongroup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-008"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
font-family:var(--vibeui-buttongroup-008-font);
}
[data-vibeui-block="buttongroup-008"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-008"] button,
[data-vibeui-block="buttongroup-008"] [data-part="count"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-008-border);
background:var(--vibeui-buttongroup-008-surface);
font-size:0.8125rem;font-weight:600;line-height:1;
}
[data-vibeui-block="buttongroup-008"] button{
appearance:none;cursor:pointer;font:inherit;font-weight:600;
gap:0.375rem;padding:0 0.75rem;
color:var(--vibeui-buttongroup-008-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-008"] button:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-008-radius);
border-end-start-radius:var(--vibeui-buttongroup-008-radius);
}
[data-vibeui-block="buttongroup-008"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-008-radius);
border-end-end-radius:var(--vibeui-buttongroup-008-radius);
}
[data-vibeui-block="buttongroup-008"] button:hover:not(:disabled){z-index:1;background:var(--vibeui-buttongroup-008-hover)}
[data-vibeui-block="buttongroup-008"] button:focus-visible{
z-index:2;
outline:2px solid var(--vibeui-buttongroup-008-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-008"] button:disabled{
cursor:not-allowed;color:oklch(0.75 0.01 265);
background:oklch(0.98 0.003 265);
}
/* Ширина счётчика фиксирована, цифры табличные: иначе группа дёргается
   на каждом переходе через десяток. */
[data-vibeui-block="buttongroup-008"] [data-part="count"]{
min-width:4.5rem;padding:0 0.5rem;
color:var(--vibeui-buttongroup-008-muted);
font-variant-numeric:tabular-nums;letter-spacing:0.01em;
}
[data-vibeui-block="buttongroup-008"] [data-part="now"]{color:var(--vibeui-buttongroup-008-fg)}
[data-vibeui-block="buttongroup-008"] [data-part="slash"]{margin:0 0.3125rem;color:oklch(0.8 0.008 265)}
[data-vibeui-block="buttongroup-008"] [data-part="arrow"]{
width:0.4375rem;height:0.4375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
[data-vibeui-block="buttongroup-008"] [data-part="prev"] [data-part="arrow"]{transform:rotate(-135deg)}
[data-vibeui-block="buttongroup-008"] [data-part="next"] [data-part="arrow"]{transform:rotate(45deg)}
[data-vibeui-block="buttongroup-008"] [data-part="spoken"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Пагинатор-группа: назад, счётчик страниц, вперёд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup008({
  page = 3,
  total = 12,
  label = "Постраничная навигация",
  accent,
  className,
  style,
  ...props
}: Buttongroup008Props) {
  const current = Math.min(Math.max(page, 1), Math.max(total, 1))

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="buttongroup-008"
        aria-label={label}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="prev"
          disabled={current <= 1}
          aria-label="Предыдущая страница"
        >
          <span data-part="arrow" aria-hidden="true" />
          Назад
        </button>
        <span data-part="count">
          <span data-part="spoken">
            Страница {current} из {total}
          </span>
          <span aria-hidden="true">
            <span data-part="now">{current}</span>
            <span data-part="slash">/</span>
            {total}
          </span>
        </span>
        <button
          type="button"
          data-part="next"
          disabled={current >= total}
          aria-label="Следующая страница"
        >
          Вперёд
          <span data-part="arrow" aria-hidden="true" />
        </button>
      </nav>
    </>
  )
}
