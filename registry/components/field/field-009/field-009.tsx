import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  labelWidth?: string
  name?: string
  accent?: string
}

// Идея компонента: строка формы с подписью слева. На широком экране колонка
// подписей выравнивает всю форму по одной вертикали и глаз находит нужное
// поле за один проход. На узком та же строка складывается в столбец. Ширина
// считается по собственной ширине блока через container query, а не по
// вьюпорту, — форма в боковой панели ведёт себя как узкая, даже на десктопе.
const STYLES = `
:where([data-vibeui-block="field-009"]){
--vibeui-field-009-bg:oklch(1 0 0);
--vibeui-field-009-surface:oklch(1 0 0);
--vibeui-field-009-fg:oklch(0.24 0.014 265);
--vibeui-field-009-muted:oklch(0.55 0.014 265);
--vibeui-field-009-border:oklch(0.88 0.008 265);
--vibeui-field-009-shell:oklch(0.91 0.006 265);
--vibeui-field-009-accent:oklch(0.55 0.2 262);
--vibeui-field-009-label:9rem;
--vibeui-field-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Своя светлая подложка: строку показывают поверх любого фона. */
[data-vibeui-block="field-009"]{
display:block;width:100%;max-width:34rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-009-surface);
border:1px solid var(--vibeui-field-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-009-font);color:var(--vibeui-field-009-fg);
}
[data-vibeui-block="field-009"] *{box-sizing:border-box}
/* Раскладка живёт на shell: правило @container не действует на сам контейнер. */
[data-vibeui-block="field-009"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.75rem;
}
[data-vibeui-block="field-009"] [data-part="row"]{
display:flex;flex-direction:column;gap:0.3125rem;
}
[data-vibeui-block="field-009"] label{
font-size:0.8125rem;font-weight:600;line-height:1.35;
}
[data-vibeui-block="field-009"] [data-part="control"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0}
[data-vibeui-block="field-009"] :is(input,select){
width:100%;height:2.375rem;padding:0 0.75rem;
background:var(--vibeui-field-009-bg);color:inherit;
border:1px solid var(--vibeui-field-009-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="field-009"] :is(input,select):focus-visible{
outline:2px solid var(--vibeui-field-009-accent);outline-offset:1px;
border-color:var(--vibeui-field-009-accent);
}
[data-vibeui-block="field-009"] input::placeholder{color:var(--vibeui-field-009-muted)}
[data-vibeui-block="field-009"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-009-muted);
}
/* От 30rem собственной ширины — колонка подписей и общая вертикаль полей. */
@container (min-width: 30rem){
[data-vibeui-block="field-009"] [data-part="row"]{
flex-direction:row;align-items:baseline;gap:1rem;
}
[data-vibeui-block="field-009"] [data-part="row"] > label{
flex:none;width:var(--vibeui-field-009-label);
text-align:end;color:var(--vibeui-field-009-muted);
}
[data-vibeui-block="field-009"] [data-part="control"]{flex:1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Строка формы с подписью слева, складывающаяся в столбец на узкой ширине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field009({
  label = "Отображаемое имя",
  hint = "Так вас увидят в комментариях и в истории изменений.",
  labelWidth = "9rem",
  name = "profile",
  accent,
  className,
  style,
  ...props
}: Field009Props) {
  const palette = {
    "--vibeui-field-009-label": labelWidth,
    ...(accent ? { "--vibeui-field-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="row">
            <label htmlFor={`${name}-name`}>{label}</label>
            <div data-part="control">
              <input
                id={`${name}-name`}
                name={`${name}-name`}
                type="text"
                defaultValue="Анна Кузнецова"
                aria-describedby={`${name}-hint`}
              />
              <p id={`${name}-hint`} data-part="hint">
                {hint}
              </p>
            </div>
          </div>

          <div data-part="row">
            <label htmlFor={`${name}-role`}>Роль в команде</label>
            <div data-part="control">
              <select id={`${name}-role`} name={`${name}-role`}>
                <option>Владелец</option>
                <option>Редактор</option>
                <option>Наблюдатель</option>
              </select>
            </div>
          </div>

          <div data-part="row">
            <label htmlFor={`${name}-city`}>Город</label>
            <div data-part="control">
              <input
                id={`${name}-city`}
                name={`${name}-city`}
                type="text"
                placeholder="Например, Казань"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
