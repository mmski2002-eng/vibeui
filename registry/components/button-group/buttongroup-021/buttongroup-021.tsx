import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup021Language = {
  tag: string
  autonym: string
  local: string
  rtl?: boolean
}

export type Buttongroup021Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  languages?: Buttongroup021Language[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — подложки нет, строки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор языка подписан на самом языке. Каждая строка несёт
// собственный lang и, где нужно, dir="rtl": без них браузер подставит шрифт
// и направление текущей страницы, и «العربية» приедет наизнанку. Список
// вертикальный, потому что автонимы имеют разную длину и в равные колонки
// не ложатся. Отметка выбора — галочка, а не только заливка: язык выбирают
// в том числе те, кто не читает текущий язык интерфейса.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-021"]){
--vibeui-buttongroup-021-surface:transparent;
--vibeui-buttongroup-021-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-021-muted:color-mix(in oklab,var(--vibeui-buttongroup-021-fg) 68%,transparent);
--vibeui-buttongroup-021-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-021-chip:light-dark(oklch(0.96 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-021-hover:light-dark(oklch(0.985 0 265),oklch(0.29 0 265));
--vibeui-buttongroup-021-on:light-dark(oklch(0.97 0 265),oklch(0.3 0 0));
--vibeui-buttongroup-021-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-buttongroup-021-radius:0.75rem;
--vibeui-buttongroup-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-021"]{color-scheme:dark}
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
background:var(--vibeui-buttongroup-021-chip);
color:var(--vibeui-buttongroup-021-muted);
font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="buttongroup-021"] [data-part="tick"]{
flex:none;width:1.125rem;height:1.125rem;
stroke:var(--vibeui-buttongroup-021-accent);fill:none;stroke-width:2.2;
stroke-linecap:round;stroke-linejoin:round;
opacity:0;transition:opacity .16s ease;
}
[data-vibeui-block="buttongroup-021"] [data-part="row"]:hover{background:var(--vibeui-buttongroup-021-hover)}
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Выбор языка автонимами: у каждой строки свой lang и, где нужно, dir="rtl".
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup021({
  languages = DEFAULT_LANGUAGES,
  defaultValue = "ru",
  label = "Язык интерфейса",
  name = "buttongroup-021",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup021Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-021-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-021" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-021"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
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
        </form>
      </fieldset>
    </>
  )
}
