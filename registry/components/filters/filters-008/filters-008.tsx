import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  active?: number
  found?: string
  name?: string
  accent?: string
}

// Идея компонента: фильтры на телефоне занимают строку, а не экран. Панель
// свёрнута в <details>, и в закрытом виде она всё равно отвечает на главный
// вопрос — сколько условий сейчас включено. Раскрытие держит браузер, поэтому
// состояния нет и компонент серверный. На широкой собственной ширине группы
// встают в ряд: раскладка считается container query, а не по вьюпорту.
const STYLES = `
:where([data-vibeui-block="filters-008"]){
--vibeui-filters-008-surface:oklch(1 0 0);
--vibeui-filters-008-fill:oklch(0.975 0.004 265);
--vibeui-filters-008-fg:oklch(0.23 0.014 265);
--vibeui-filters-008-muted:oklch(0.55 0.014 265);
--vibeui-filters-008-border:oklch(0.89 0.008 265);
--vibeui-filters-008-shell:oklch(0.91 0.006 265);
--vibeui-filters-008-accent:oklch(0.52 0.19 305);
--vibeui-filters-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Своя светлая подложка: свёртку показывают поверх любого фона. */
[data-vibeui-block="filters-008"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-filters-008-surface);
border:1px solid var(--vibeui-filters-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-008-font);color:var(--vibeui-filters-008-fg);
}
[data-vibeui-block="filters-008"] *{box-sizing:border-box}
/* Закрытая панель отвечает на главный вопрос: сколько условий включено. */
[data-vibeui-block="filters-008"] summary{
cursor:pointer;list-style:none;
display:flex;align-items:center;gap:0.5rem;
padding:0.375rem 0.125rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-008"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="filters-008"] summary:focus-visible{outline:2px solid var(--vibeui-filters-008-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="filters-008"] [data-part="bars"]{
position:relative;flex:none;width:0.875rem;height:0.75rem;
}
[data-vibeui-block="filters-008"] [data-part="bars"]::before,
[data-vibeui-block="filters-008"] [data-part="bars"]::after{
content:"";position:absolute;left:0;height:1.5px;border-radius:9999px;
background:var(--vibeui-filters-008-fg);
}
[data-vibeui-block="filters-008"] [data-part="bars"]::before{top:0.125rem;width:100%}
[data-vibeui-block="filters-008"] [data-part="bars"]::after{bottom:0.125rem;width:60%}
[data-vibeui-block="filters-008"] [data-part="badge"]{
flex:none;min-width:1.25rem;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-filters-008-accent);color:oklch(1 0 0);
font-size:0.6875rem;font-weight:700;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-008"] [data-part="found"]{
margin-inline-start:auto;font-size:0.6875rem;font-weight:500;
color:var(--vibeui-filters-008-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-008"] [data-part="chevron"]{
flex:none;width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-filters-008-muted);
border-bottom:1.5px solid var(--vibeui-filters-008-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="filters-008"] details[open] [data-part="chevron"]{transform:rotate(-135deg)}
/* Раскладка живёт на shell: правило @container не действует на сам контейнер. */
[data-vibeui-block="filters-008"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.625rem;
margin-top:0.625rem;padding-top:0.625rem;
border-top:1px solid var(--vibeui-filters-008-border);
}
[data-vibeui-block="filters-008"] [data-part="groups"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="filters-008"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.25rem;min-width:0;flex:1;
}
[data-vibeui-block="filters-008"] [data-part="group"] > span{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-filters-008-muted);
}
[data-vibeui-block="filters-008"] select{
appearance:none;width:100%;height:2.25rem;padding:0 1.75rem 0 0.625rem;
background:var(--vibeui-filters-008-fill);color:inherit;
border:1px solid var(--vibeui-filters-008-border);border-radius:0.5rem;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="filters-008"] select:focus-visible{outline:2px solid var(--vibeui-filters-008-accent);outline-offset:1px}
[data-vibeui-block="filters-008"] [data-part="pick"]{position:relative;display:flex}
[data-vibeui-block="filters-008"] [data-part="pick"]::after{
content:"";position:absolute;right:0.6875rem;top:50%;pointer-events:none;
width:0.375rem;height:0.375rem;margin-top:-0.25rem;
border-right:1.5px solid var(--vibeui-filters-008-muted);
border-bottom:1.5px solid var(--vibeui-filters-008-muted);
transform:rotate(45deg);
}
[data-vibeui-block="filters-008"] [data-part="actions"]{display:flex;gap:0.5rem}
[data-vibeui-block="filters-008"] button{
appearance:none;cursor:pointer;flex:1;
height:2.25rem;border-radius:0.5rem;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-008"] [data-part="apply"]{border:0;background:var(--vibeui-filters-008-accent);color:oklch(1 0 0)}
[data-vibeui-block="filters-008"] [data-part="clear"]{
flex:none;padding:0 0.875rem;
border:1px solid var(--vibeui-filters-008-border);background:none;color:inherit;
}
[data-vibeui-block="filters-008"] button:focus-visible{outline:2px solid var(--vibeui-filters-008-accent);outline-offset:2px}
/* От 28rem собственной ширины группы встают в ряд. */
@container (min-width: 28rem){
[data-vibeui-block="filters-008"] [data-part="groups"]{flex-direction:row;gap:0.625rem}
[data-vibeui-block="filters-008"] [data-part="actions"]{justify-content:flex-end}
[data-vibeui-block="filters-008"] [data-part="apply"]{flex:none;padding:0 1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Компактные фильтры в свёртке: счётчик активных виден в закрытом виде.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters008({
  title = "Фильтры",
  active = 3,
  found = "128 из 412",
  name = "catalog",
  accent,
  className,
  style,
  ...props
}: Filters008Props) {
  const palette = {
    ...(accent ? { "--vibeui-filters-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-008"
        className={className}
        style={palette}
      >
        <details>
          <summary>
            <span data-part="bars" aria-hidden="true" />
            {title}
            {active > 0 ? (
              <span
                data-part="badge"
                aria-label={`активных условий: ${active}`}
              >
                {active}
              </span>
            ) : null}
            <span data-part="found">{found}</span>
            <span data-part="chevron" aria-hidden="true" />
          </summary>

          <div data-part="shell">
            <div data-part="groups">
              <label data-part="group">
                <span>Категория</span>
                <span data-part="pick">
                  <select name={`${name}-category`} defaultValue="Формы">
                    <option>Все</option>
                    <option>Формы</option>
                    <option>Навигация</option>
                    <option>Таблицы</option>
                  </select>
                </span>
              </label>
              <label data-part="group">
                <span>Сортировка</span>
                <span data-part="pick">
                  <select name={`${name}-sort`} defaultValue="Сначала новые">
                    <option>Сначала новые</option>
                    <option>По популярности</option>
                    <option>По названию</option>
                  </select>
                </span>
              </label>
            </div>

            <div data-part="actions">
              <button type="button" data-part="clear">
                Сбросить
              </button>
              <button type="button" data-part="apply">
                Показать {found}
              </button>
            </div>
          </div>
        </details>
      </div>
    </>
  )
}
