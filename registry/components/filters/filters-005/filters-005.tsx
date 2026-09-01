import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  title?: string
  presets?: string[]
  customLabel?: string
  name?: string
  accent?: string
}

// Идея компонента: период выбирают словами, а календарём — в последнюю
// очередь. «За 7 дней» и «этот месяц» закрывают почти все отчёты, поэтому
// они стоят первыми, а пара дат появляется только под пунктом «свой период».
// Раскрытие держит селектор :has по отмеченной радиокнопке — состояния нет,
// компонент серверный, и пустые поля дат не уезжают в форму без надобности.
const STYLES = `
:where([data-vibeui-block="filters-005"]){
--vibeui-filters-005-surface:oklch(1 0 0);
--vibeui-filters-005-fill:oklch(0.975 0.004 265);
--vibeui-filters-005-fg:oklch(0.23 0.014 265);
--vibeui-filters-005-muted:oklch(0.55 0.014 265);
--vibeui-filters-005-border:oklch(0.89 0.008 265);
--vibeui-filters-005-shell:oklch(0.91 0.006 265);
--vibeui-filters-005-accent:oklch(0.52 0.19 290);
--vibeui-filters-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="filters-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-005-surface);
border:1px solid var(--vibeui-filters-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-005-font);color:var(--vibeui-filters-005-fg);
}
[data-vibeui-block="filters-005"] *{box-sizing:border-box}
[data-vibeui-block="filters-005"] fieldset{margin:0;padding:0;border:0;min-inline-size:0}
[data-vibeui-block="filters-005"] legend{
padding:0;margin-bottom:0.5rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-005"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.125rem;
}
[data-vibeui-block="filters-005"] label{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.3125rem 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="filters-005"] label:hover{background:var(--vibeui-filters-005-fill)}
[data-vibeui-block="filters-005"] label:has(input:checked){
background:color-mix(in oklab,var(--vibeui-filters-005-accent) 9%,oklch(1 0 0));
font-weight:650;
}
[data-vibeui-block="filters-005"] label:has(input:focus-visible){outline:2px solid var(--vibeui-filters-005-accent);outline-offset:1px}
[data-vibeui-block="filters-005"] input[type="radio"]{
appearance:none;flex:none;margin:0;cursor:pointer;position:relative;
width:0.9375rem;height:0.9375rem;border-radius:9999px;
border:1.5px solid var(--vibeui-filters-005-border);background:oklch(1 0 0);
transition:border-color .16s ease;
}
[data-vibeui-block="filters-005"] input[type="radio"]:checked{border-color:var(--vibeui-filters-005-accent);border-width:5px}
/* Пара дат появляется только под «своим периодом»: :has, а не состояние. */
[data-vibeui-block="filters-005"] [data-part="custom"]{display:none;gap:0.375rem;margin-top:0.375rem}
[data-vibeui-block="filters-005"]:has([data-choice="custom"]:checked) [data-part="custom"]{display:flex}
[data-vibeui-block="filters-005"] [data-part="cell"]{
flex:1;min-width:0;display:flex;flex-direction:column;gap:0.125rem;
}
[data-vibeui-block="filters-005"] [data-part="cell"] span{
font-size:0.625rem;font-weight:650;color:var(--vibeui-filters-005-muted);
}
[data-vibeui-block="filters-005"] input[type="date"]{
width:100%;min-width:0;height:2.125rem;padding:0 0.5rem;
background:var(--vibeui-filters-005-surface);color:inherit;
border:1px solid var(--vibeui-filters-005-border);border-radius:0.5rem;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="filters-005"] input[type="date"]:focus-visible{
outline:2px solid var(--vibeui-filters-005-accent);outline-offset:1px;
border-color:var(--vibeui-filters-005-accent);
}
[data-vibeui-block="filters-005"] [data-part="note"]{
margin:0;padding-top:0.125rem;
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-filters-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS = ["Сегодня", "За 7 дней", "За 30 дней", "Этот квартал"]

/**
 * Фильтр по датам: пресеты периодов и пара дат под «своим периодом» на :has.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters005({
  title = "Период",
  presets = DEFAULT_PRESETS,
  customLabel = "Свой период",
  name = "period",
  accent,
  className,
  style,
  ...props
}: Filters005Props) {
  const palette = {
    ...(accent ? { "--vibeui-filters-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-005"
        className={className}
        style={palette}
      >
        <fieldset>
          <legend>{title}</legend>
          <div data-part="list">
            {presets.map((preset, index) => (
              <label key={preset}>
                <input
                  type="radio"
                  name={name}
                  value={preset}
                  defaultChecked={index === 1}
                />
                {preset}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name={name}
                value="custom"
                data-choice="custom"
              />
              {customLabel}
            </label>
          </div>

          <div data-part="custom">
            <span data-part="cell">
              <span>Начало</span>
              <input
                type="date"
                name={`${name}-from`}
                aria-label="Начало периода"
              />
            </span>
            <span data-part="cell">
              <span>Конец</span>
              <input
                type="date"
                name={`${name}-to`}
                aria-label="Конец периода"
              />
            </span>
          </div>
        </fieldset>

        <p data-part="note">
          Период считается по вашему часовому поясу, границы включаются целиком.
        </p>
      </div>
    </>
  )
}
