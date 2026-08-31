import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup021Language = {
  tag: string
  autonym: string
  local: string
  rtl?: boolean
}

export type Buttongroup021Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  languages?: Buttongroup021Language[]
  defaultValue?: string
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: выбор языка подписан на самом языке. Каждая строка несёт
// собственный lang и, где нужно, dir="rtl": без них браузер подставит шрифт
// и направление текущей страницы, и «العربية» приедет наизнанку. Список
// вертикальный, потому что автонимы имеют разную длину и в равные колонки
// не ложатся. Отметка выбора — галочка, а не только заливка: язык выбирают
// в том числе те, кто не читает текущий язык интерфейса.
const STYLES = `
:where([data-vibeui-block="buttongroup-021"]){
--vibeui-buttongroup-021-surface:oklch(1 0 0);
--vibeui-buttongroup-021-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-021-muted:oklch(0.57 0.014 265);
--vibeui-buttongroup-021-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-021-on:oklch(0.97 0.025 265);
--vibeui-buttongroup-021-accent:oklch(0.5 0.15 265);
--vibeui-buttongroup-021-radius:0.75rem;
--vibeui-buttongroup-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-021"]{
box-sizing:border-box;display:block;width:100%;max-width:19rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-021-font);
}
[data-vibeui-block="buttongroup-021"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-021"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-021"] [data-part="track"]{
display:flex;flex-direction:column;isolation:isolate;
}
[data-vibeui-block="buttongroup-021"] [data-part="row"]{
position:relative;z-index:0;
display:flex;align-items:center;gap:0.625rem;
min-height:2.875rem;padding:0.5rem 0.875rem;margin-block-start:-1px;
border:1px solid var(--vibeui-buttongroup-021-border);
background:var(--vibeui-buttongroup-021-surface);
cursor:pointer;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:first-child{
margin-block-start:0;
border-start-start-radius:var(--vibeui-buttongroup-021-radius);
border-start-end-radius:var(--vibeui-buttongroup-021-radius);
}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:last-child{
border-end-start-radius:var(--vibeui-buttongroup-021-radius);
border-end-end-radius:var(--vibeui-buttongroup-021-radius);
}
[data-vibeui-block="buttongroup-021"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-021"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.0625rem;flex:1 1 auto;min-width:0;
}
[data-vibeui-block="buttongroup-021"] [data-part="autonym"]{
color:var(--vibeui-buttongroup-021-fg);
font-size:0.875rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="buttongroup-021"] [data-part="local"]{
color:var(--vibeui-buttongroup-021-muted);
font-size:0.75rem;line-height:1.3;
}
[data-vibeui-block="buttongroup-021"] [data-part="tag"]{
flex:none;padding:0.125rem 0.375rem;border-radius:0.3125rem;
background:oklch(0.96 0.005 265);
color:var(--vibeui-buttongroup-021-muted);
font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="buttongroup-021"] [data-part="tick"]{
flex:none;width:1.125rem;height:1.125rem;
stroke:var(--vibeui-buttongroup-021-accent);fill:none;stroke-width:2.2;
stroke-linecap:round;stroke-linejoin:round;
opacity:0;transition:opacity .16s ease;
}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:hover{background:oklch(0.985 0.003 265)}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-021-on);
border-color:var(--vibeui-buttongroup-021-accent);
}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:has(input:checked) [data-part="tick"]{opacity:1}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-021-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LANGUAGES: Buttongroup021Language[] = [
  { tag: "ru", autonym: "Русский", local: "русский" },
  { tag: "en", autonym: "English", local: "английский" },
  { tag: "de", autonym: "Deutsch", local: "немецкий" },
  { tag: "ar", autonym: "العربية", local: "арабский", rtl: true },
]

/**
 * Выбор языка автонимами: у каждой строки свой lang и, где нужно, dir="rtl".
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup021({
  languages = DEFAULT_LANGUAGES,
  defaultValue = "ru",
  label = "Язык интерфейса",
  name = "buttongroup-021",
  accent,
  className,
  style,
  ...props
}: Buttongroup021Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-021-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-021" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-021"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {languages.map((language) => (
            <label key={language.tag} data-part="row">
              <input
                type="radio"
                name={name}
                value={language.tag}
                defaultChecked={language.tag === defaultValue}
              />
              <span data-part="text">
                <span
                  data-part="autonym"
                  lang={language.tag}
                  dir={language.rtl ? "rtl" : undefined}
                >
                  {language.autonym}
                </span>
                <span data-part="local">{language.local}</span>
              </span>
              <span data-part="tag" aria-hidden="true">
                {language.tag}
              </span>
              <svg data-part="tick" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 13 4.5 4.5L19 7" />
              </svg>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
