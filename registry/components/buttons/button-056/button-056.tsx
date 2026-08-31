import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button056Language = { code: string; label: string }

export type Button056Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "children"
> & {
  label?: string
  languages?: Button056Language[]
  accent?: string
}

// Идея компонента: кнопка выбора языка, которой не нужен ни JS, ни слой меню.
// Внутри — настоящий select с appearance:none, растянутый по всей плашке.
// Отсюда бесплатно приходят клавиатура, поиск по первой букве и системный
// список на телефоне; кнопке остаётся нарисовать глобус, рамку и шеврон.
const STYLES = `
:where([data-vibeui-block="button-056"]){
--vibeui-button-056-surface:oklch(1 0 0);
--vibeui-button-056-border:oklch(0.88 0.006 265);
--vibeui-button-056-fg:oklch(0.26 0.02 265);
--vibeui-button-056-muted:oklch(0.56 0.014 265);
--vibeui-button-056-accent:oklch(0.52 0.15 275);
--vibeui-button-056-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-056"]{
position:relative;display:inline-flex;align-items:center;gap:0.5rem;box-sizing:border-box;
height:2.625rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-button-056-border);
background:var(--vibeui-button-056-surface);color:var(--vibeui-button-056-fg);
font-family:var(--vibeui-button-056-font);font-size:0.875rem;font-weight:600;line-height:1;
transition:border-color .16s ease;
}
[data-vibeui-block="button-056"]:hover{border-color:var(--vibeui-button-056-accent)}
/* Фокус приходит на select, а обводку рисует плашка. */
[data-vibeui-block="button-056"]:has(select:focus-visible){
outline:2px solid var(--vibeui-button-056-accent);outline-offset:2px;
}
[data-vibeui-block="button-056"] select{
appearance:none;cursor:pointer;
border:0;background:transparent;color:inherit;
font:inherit;padding:0 1.25rem 0 0;margin:0;
outline:0;
}
[data-vibeui-block="button-056"] select:focus{outline:0}
/* Глобус: круг с двумя меридианами. */
[data-vibeui-block="button-056"] [data-part="globe"]{
position:relative;flex:none;width:1.0625rem;height:1.0625rem;
box-sizing:border-box;border:1.5px solid var(--vibeui-button-056-accent);border-radius:50%;
}
[data-vibeui-block="button-056"] [data-part="globe"]::before{
content:"";position:absolute;left:50%;top:-1.5px;bottom:-1.5px;width:0.5rem;
margin-left:-0.25rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-button-056-accent);border-radius:50%;
}
[data-vibeui-block="button-056"] [data-part="globe"]::after{
content:"";position:absolute;left:-1.5px;right:-1.5px;top:50%;height:1.5px;
margin-top:-0.75px;background:var(--vibeui-button-056-accent);
}
[data-vibeui-block="button-056"] [data-part="chevron"]{
position:absolute;right:0.75rem;top:50%;width:0.4375rem;height:0.4375rem;
margin-top:-0.3125rem;box-sizing:border-box;pointer-events:none;
border:1.5px solid var(--vibeui-button-056-muted);border-left:0;border-top:0;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-056"]{transition:none!important}}
`

/**
 * Кнопка выбора языка на настоящем select: клавиатура и мобильный список даром.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button056({
  label = "Язык интерфейса",
  languages = [
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
  ],
  defaultValue = "ru",
  accent,
  className,
  style,
  ...props
}: Button056Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-056-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-056" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="button-056" className={className} style={palette}>
        <span data-part="globe" aria-hidden="true" />
        <select {...props} defaultValue={defaultValue} aria-label={label}>
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
        <span data-part="chevron" aria-hidden="true" />
      </div>
    </>
  )
}
