import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup034Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  title?: string
  subtitle?: string
  actions?: string[]
  primary?: string
  label?: string
  accent?: string
}

// Идея компонента: группа кнопок в шапке карточки, которая знает своё место.
// Порог перестроения берётся из ширины самой карточки (container-type на
// корне), а не из ширины окна: карточка часто стоит в узкой колонке широкого
// экрана, и media query там врёт. Раскладка лежит на внутреннем shell —
// правило внутри @container действует на потомков контейнера, но не на сам
// контейнер, это ловушка, а не деталь. По умолчанию раскладка узкая:
// без поддержки контейнеров шапка останется рабочей, просто в две строки.
const STYLES = `
:where([data-vibeui-block="buttongroup-034"]){
--vibeui-buttongroup-034-surface:oklch(1 0 0);
--vibeui-buttongroup-034-fg:oklch(0.24 0.016 265);
--vibeui-buttongroup-034-muted:oklch(0.55 0.014 265);
--vibeui-buttongroup-034-border:oklch(0.9 0.006 265);
--vibeui-buttongroup-034-accent:oklch(0.5 0.16 265);
--vibeui-buttongroup-034-on-accent:oklch(0.99 0.004 265);
--vibeui-buttongroup-034-radius:0.5rem;
--vibeui-buttongroup-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="buttongroup-034"]{
box-sizing:border-box;display:block;width:100%;max-width:34rem;
border:1px solid var(--vibeui-buttongroup-034-border);border-radius:0.875rem;
background:var(--vibeui-buttongroup-034-surface);
font-family:var(--vibeui-buttongroup-034-font);
}
[data-vibeui-block="buttongroup-034"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-034"] [data-part="shell"]{
display:flex;flex-direction:column;align-items:stretch;gap:0.75rem;
padding:0.875rem 1rem;
border-bottom:1px solid var(--vibeui-buttongroup-034-border);
}
[data-vibeui-block="buttongroup-034"] [data-part="heading"]{margin:0;min-width:0}
[data-vibeui-block="buttongroup-034"] [data-part="title"]{
display:block;color:var(--vibeui-buttongroup-034-fg);
font-size:0.9375rem;font-weight:700;line-height:1.3;
}
[data-vibeui-block="buttongroup-034"] [data-part="subtitle"]{
display:block;margin-top:0.125rem;
color:var(--vibeui-buttongroup-034-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-034"] [data-part="group"]{
display:flex;isolation:isolate;
}
[data-vibeui-block="buttongroup-034"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;flex:1 1 auto;
display:inline-flex;align-items:center;justify-content:center;
height:2.125rem;padding:0 0.75rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-034-border);
background:var(--vibeui-buttongroup-034-surface);
color:var(--vibeui-buttongroup-034-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-034"] button:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-034-radius);
border-end-start-radius:var(--vibeui-buttongroup-034-radius);
}
[data-vibeui-block="buttongroup-034"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-034-radius);
border-end-end-radius:var(--vibeui-buttongroup-034-radius);
}
[data-vibeui-block="buttongroup-034"] button:hover{background:oklch(0.97 0.004 265)}
[data-vibeui-block="buttongroup-034"] [data-part="primary"]{
background:var(--vibeui-buttongroup-034-accent);
border-color:var(--vibeui-buttongroup-034-accent);
color:var(--vibeui-buttongroup-034-on-accent);
}
[data-vibeui-block="buttongroup-034"] [data-part="primary"]:hover{
background:oklch(0.45 0.16 265);
}
[data-vibeui-block="buttongroup-034"] button:focus-visible{
z-index:2;outline:2px solid var(--vibeui-buttongroup-034-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-034"] [data-part="body"]{
padding:0.875rem 1rem 1rem;
color:var(--vibeui-buttongroup-034-muted);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="buttongroup-034"] [data-part="body"] p{margin:0}
/* Порог от ширины карточки: в узкой колонке шапка складывается сама. */
@container (min-width: 30rem){
[data-vibeui-block="buttongroup-034"] [data-part="shell"]{flex-direction:row;align-items:center;justify-content:space-between}
[data-vibeui-block="buttongroup-034"] [data-part="group"]{flex:none}
[data-vibeui-block="buttongroup-034"] button{flex:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-034"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Экспорт", "Настроить"]

/**
 * Шапка карточки с группой действий, складывающейся по ширине самой карточки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup034({
  title = "Отчёт по продажам",
  subtitle = "Обновлён 12 минут назад",
  actions = DEFAULT_ACTIONS,
  primary = "Обновить",
  label = "Действия над отчётом",
  accent,
  className,
  style,
  ...props
}: Buttongroup034Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-034-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-034" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="buttongroup-034"
        className={className}
        style={palette}
      >
        <header data-part="shell">
          <h3 data-part="heading">
            <span data-part="title">{title}</span>
            <span data-part="subtitle">{subtitle}</span>
          </h3>
          <div data-part="group" role="group" aria-label={label}>
            {actions.map((action) => (
              <button key={action} type="button">
                {action}
              </button>
            ))}
            <button type="button" data-part="primary">
              {primary}
            </button>
          </div>
        </header>
        <div data-part="body">
          <p>
            За неделю 128 заказов на 1 240 000 ₽. Средний чек вырос на 4 % по
            сравнению с прошлой неделей.
          </p>
        </div>
      </section>
    </>
  )
}
