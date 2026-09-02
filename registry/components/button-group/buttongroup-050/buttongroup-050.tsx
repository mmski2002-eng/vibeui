import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup050Role = {
  id: string
  label: string
  scope: string
}

export type Buttongroup050Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  roles?: Buttongroup050Role[]
  defaultValue?: string
  hint?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, лестница ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: роли выстроены лестницей от старшей к младшей, и выбор
// подсвечивает не только сам сегмент, но и все, что правее. Это показывает
// вложенность прав: редактор умеет всё, что умеет читатель. Приём держится
// на соседнем комбинаторе — label:has(input:checked) ~ label, — поэтому
// порядок сегментов не декоративный, а смысловой: перестановка сломает
// логику. Младшие сегменты залиты слабее старшего: включённое право и
// выбранная роль не должны выглядеть одинаково.
const STYLES = `
:where([data-vibeui-block="buttongroup-050"]){
--vibeui-buttongroup-050-surface:transparent;
--vibeui-buttongroup-050-fg:light-dark(oklch(0.25 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-050-muted:light-dark(oklch(0.58 0.014 265),oklch(0.72 0.012 265));
--vibeui-buttongroup-050-border:light-dark(oklch(0.89 0.008 265),oklch(0.41 0.012 265));
--vibeui-buttongroup-050-on:light-dark(oklch(0.95 0.04 285),oklch(0.34 0.06 285));
--vibeui-buttongroup-050-inherited:light-dark(oklch(0.975 0.015 285),oklch(0.28 0.025 285));
--vibeui-buttongroup-050-accent:light-dark(oklch(0.48 0.16 285),oklch(0.78 0.13 285));
--vibeui-buttongroup-050-radius:0.75rem;
--vibeui-buttongroup-050-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-050"]{
box-sizing:border-box;display:block;width:100%;max-width:30rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-050-font);
}
[data-vibeui-block="buttongroup-050"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-050"] legend{
padding:0;margin:0 0 0.5rem;float:left;width:100%;clear:both;
color:var(--vibeui-buttongroup-050-fg);
font-size:0.8125rem;font-weight:650;line-height:1.35;
}
[data-vibeui-block="buttongroup-050"] [data-part="track"]{
display:grid;grid-auto-flow:column;grid-auto-columns:1fr;isolation:isolate;clear:both;
}
[data-vibeui-block="buttongroup-050"] [data-part="step"]{
position:relative;z-index:0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.1875rem;
min-height:3.5rem;padding:0.5rem 0.375rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-050-border);
background:var(--vibeui-buttongroup-050-surface);
cursor:pointer;text-align:center;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-050"] [data-part="step"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-050-radius);
border-end-start-radius:var(--vibeui-buttongroup-050-radius);
}
[data-vibeui-block="buttongroup-050"] [data-part="step"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-050-radius);
border-end-end-radius:var(--vibeui-buttongroup-050-radius);
}
[data-vibeui-block="buttongroup-050"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-050"] [data-part="name"]{
color:var(--vibeui-buttongroup-050-fg);
font-size:0.8125rem;font-weight:650;line-height:1.2;
}
[data-vibeui-block="buttongroup-050"] [data-part="scope"]{
color:var(--vibeui-buttongroup-050-muted);
font-size:0.6875rem;line-height:1.25;
}
/* Выбранная роль включает все, что правее: младшие права залиты слабее. */
[data-vibeui-block="buttongroup-050"] [data-part="step"]:has(input:checked) ~ [data-part="step"]{
background:var(--vibeui-buttongroup-050-inherited);
}
[data-vibeui-block="buttongroup-050"] [data-part="step"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-050-on);
border-color:var(--vibeui-buttongroup-050-accent);
}
[data-vibeui-block="buttongroup-050"] [data-part="step"]:has(input:checked) [data-part="name"]{
color:var(--vibeui-buttongroup-050-accent);
}
[data-vibeui-block="buttongroup-050"] [data-part="step"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-050-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-050"] [data-part="hint"]{
display:flex;align-items:flex-start;gap:0.375rem;
margin:0.5rem 0 0;
color:var(--vibeui-buttongroup-050-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-050"] [data-part="hint"] svg{
width:0.9375rem;height:0.9375rem;flex:none;margin-top:0.0625rem;
stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-050"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROLES: Buttongroup050Role[] = [
  { id: "owner", label: "Владелец", scope: "биллинг и удаление" },
  { id: "admin", label: "Админ", scope: "настройки и люди" },
  { id: "editor", label: "Редактор", scope: "правка контента" },
  { id: "viewer", label: "Читатель", scope: "только просмотр" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Роли лестницей: выбранная подсвечивает все младшие, права видно вложенными.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup050({
  roles = DEFAULT_ROLES,
  defaultValue = "editor",
  hint = "Роль включает все права, что правее неё.",
  label = "Роль участника",
  name = "buttongroup-050",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup050Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-050-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-050-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-050" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-050"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {roles.map((role) => (
            <label key={role.id} data-part="step">
              <input
                type="radio"
                name={name}
                value={role.id}
                defaultChecked={role.id === defaultValue}
              />
              <span data-part="name">{role.label}</span>
              <span data-part="scope">{role.scope}</span>
            </label>
          ))}
        </div>
        <p data-part="hint">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18" />
          </svg>
          <span>{hint}</span>
        </p>
      </fieldset>
    </>
  )
}
