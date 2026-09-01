import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup016Option = {
  label: string
  locked?: boolean
}

export type Buttongroup016Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  options?: Buttongroup016Option[]
  defaultValue?: string
  reason?: string
  reasonId?: string
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: недоступный вариант, который объясняет себя. Обычно
// такой сегмент просто гасят прозрачностью — и пользователь остаётся с
// вопросом «почему». Здесь запертый сегмент несёт значок замка, а причина
// лежит строкой под группой и связана с input через aria-describedby,
// поэтому звучит вслух сразу после имени варианта. Заперт сегмент честным
// атрибутом disabled: визуальная «серость» без него оставляет вариант
// кликабельным для клавиатуры.
const STYLES = `
:where([data-vibeui-block="buttongroup-016"]){
--vibeui-buttongroup-016-surface:oklch(1 0 0);
--vibeui-buttongroup-016-fg:oklch(0.26 0.016 265);
--vibeui-buttongroup-016-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-016-locked:oklch(0.72 0.01 265);
--vibeui-buttongroup-016-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-016-on:oklch(0.96 0.035 285);
--vibeui-buttongroup-016-accent:oklch(0.52 0.16 285);
--vibeui-buttongroup-016-radius:0.625rem;
--vibeui-buttongroup-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-016"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-016-font);
}
[data-vibeui-block="buttongroup-016"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-016"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-016"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.375rem;padding:0 0.875rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-016-border);
background:var(--vibeui-buttongroup-016-surface);
color:var(--vibeui-buttongroup-016-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-016-radius);
border-end-start-radius:var(--vibeui-buttongroup-016-radius);
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-016-radius);
border-end-end-radius:var(--vibeui-buttongroup-016-radius);
}
[data-vibeui-block="buttongroup-016"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:inherit;
}
[data-vibeui-block="buttongroup-016"] svg{
width:0.875rem;height:0.875rem;flex:none;
stroke:currentColor;fill:none;stroke-width:1.8;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:hover:not(:has(input:disabled)){
color:var(--vibeui-buttongroup-016-fg);
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-016-on);
border-color:var(--vibeui-buttongroup-016-accent);
color:var(--vibeui-buttongroup-016-accent);
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-016-accent);outline-offset:1px;
}
/* Полосатая заливка добавляет к бледности второй, не цветовой признак. */
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:has(input:disabled){
cursor:not-allowed;
color:var(--vibeui-buttongroup-016-locked);
background:repeating-linear-gradient(-45deg,oklch(0.98 0.002 265) 0 6px,oklch(0.955 0.003 265) 6px 12px);
}
[data-vibeui-block="buttongroup-016"] [data-part="reason"]{
display:flex;align-items:flex-start;gap:0.375rem;
margin:0.5rem 0 0;max-width:22rem;
color:var(--vibeui-buttongroup-016-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-016"] [data-part="reason"] svg{margin-top:0.125rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-016"] *{animation:none!important;transition:none!important}}
`

const LOCK = "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5zM12 14v2"

const DEFAULT_OPTIONS: Buttongroup016Option[] = [
  { label: "Черновик" },
  { label: "На проверке" },
  { label: "Опубликовано", locked: true },
]

/**
 * Группа с запертым вариантом, который объясняет причину недоступности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup016({
  options = DEFAULT_OPTIONS,
  defaultValue = "На проверке",
  reason = "Публикацию открывает редактор: у вашей роли нет этого права.",
  reasonId = "buttongroup-016-reason",
  label = "Состояние материала",
  name = "buttongroup-016",
  accent,
  className,
  style,
  ...props
}: Buttongroup016Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-016" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-016"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {options.map((option) => (
            <label key={option.label} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option.label}
                defaultChecked={option.label === defaultValue}
                disabled={option.locked}
                aria-describedby={option.locked ? reasonId : undefined}
              />
              {option.locked ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={LOCK} />
                </svg>
              ) : null}
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <p data-part="reason" id={reasonId}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={LOCK} />
          </svg>
          <span>{reason}</span>
        </p>
      </fieldset>
    </>
  )
}
