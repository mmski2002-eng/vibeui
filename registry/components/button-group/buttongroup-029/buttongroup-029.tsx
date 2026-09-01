import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup029Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  lightLabel?: string
  darkLabel?: string
  systemLabel?: string
  defaultValue?: string
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: выбор темы, где каждый сегмент показывает не значок
// солнца или луны, а сам образец — миниатюру интерфейса с полосками текста.
// «Системная» нарисована диагональным разрезом clip-path: одна половина
// светлая, другая тёмная, и это честно объясняет «как в системе» без слов.
// Образцы держат собственные цвета, не зависящие от темы страницы: иначе
// светлая миниатюра исчезла бы на светлом фоне.
const STYLES = `
:where([data-vibeui-block="buttongroup-029"]){
--vibeui-buttongroup-029-surface:oklch(1 0 0);
--vibeui-buttongroup-029-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-029-muted:oklch(0.57 0.014 265);
--vibeui-buttongroup-029-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-029-accent:oklch(0.52 0.16 285);
--vibeui-buttongroup-029-light:oklch(0.98 0.003 265);
--vibeui-buttongroup-029-dark:oklch(0.29 0.02 265);
--vibeui-buttongroup-029-radius:0.75rem;
--vibeui-buttongroup-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-029"]{
box-sizing:border-box;display:block;width:100%;max-width:23rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-029-font);
}
[data-vibeui-block="buttongroup-029"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-029"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-029"] [data-part="track"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;
}
[data-vibeui-block="buttongroup-029"] [data-part="option"]{
position:relative;
display:flex;flex-direction:column;align-items:center;gap:0.4375rem;
padding:0.5rem 0.375rem 0.625rem;
border:1px solid var(--vibeui-buttongroup-029-border);
border-radius:var(--vibeui-buttongroup-029-radius);
background:var(--vibeui-buttongroup-029-surface);
color:var(--vibeui-buttongroup-029-muted);
font-size:0.75rem;font-weight:650;line-height:1;cursor:pointer;
transition:border-color .16s ease,color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="buttongroup-029"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Миниатюра интерфейса вместо значка. */
[data-vibeui-block="buttongroup-029"] [data-part="swatch"]{
position:relative;display:block;width:100%;height:3rem;
border:1px solid oklch(0.86 0.008 265);border-radius:0.5rem;overflow:hidden;
background:var(--vibeui-buttongroup-029-light);
}
[data-vibeui-block="buttongroup-029"] [data-part="swatch"] i{
position:absolute;left:0.4375rem;height:0.25rem;border-radius:2px;
background:oklch(0.72 0.01 265);
}
[data-vibeui-block="buttongroup-029"] [data-part="swatch"] i:nth-child(1){top:0.5rem;width:55%}
[data-vibeui-block="buttongroup-029"] [data-part="swatch"] i:nth-child(2){top:1.125rem;width:75%}
[data-vibeui-block="buttongroup-029"] [data-part="swatch"] i:nth-child(3){top:1.75rem;width:40%}
[data-vibeui-block="buttongroup-029"] [data-theme="dark"]{background:var(--vibeui-buttongroup-029-dark)}
[data-vibeui-block="buttongroup-029"] [data-theme="dark"] i{background:oklch(0.62 0.014 265)}
/* Диагональный разрез: половина светлая, половина тёмная. */
[data-vibeui-block="buttongroup-029"] [data-theme="system"]::after{
content:"";position:absolute;inset:0;
background:var(--vibeui-buttongroup-029-dark);
clip-path:polygon(100% 0,100% 100%,0 100%);
}
[data-vibeui-block="buttongroup-029"] [data-part="option"]:hover{color:var(--vibeui-buttongroup-029-fg)}
[data-vibeui-block="buttongroup-029"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-buttongroup-029-accent);
color:var(--vibeui-buttongroup-029-accent);
box-shadow:0 0 0 1px var(--vibeui-buttongroup-029-accent);
}
[data-vibeui-block="buttongroup-029"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-029-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-029"] *{animation:none!important;transition:none!important}}
`

/**
 * Выбор темы образцами интерфейса: светлая, тёмная и разрезанная «системная».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup029({
  lightLabel = "Светлая",
  darkLabel = "Тёмная",
  systemLabel = "Системная",
  defaultValue = "system",
  label = "Тема оформления",
  name = "buttongroup-029",
  accent,
  className,
  style,
  ...props
}: Buttongroup029Props) {
  const options = [
    { id: "light", label: lightLabel },
    { id: "dark", label: darkLabel },
    { id: "system", label: systemLabel },
  ]

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-029-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-029" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-029"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {options.map((option) => (
            <label key={option.id} data-part="option">
              <input
                type="radio"
                name={name}
                value={option.id}
                defaultChecked={option.id === defaultValue}
              />
              <span
                data-part="swatch"
                data-theme={option.id}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
