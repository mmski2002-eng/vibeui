import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button028Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  /** Имя действия. Оно же уходит в aria-label и в подсказку. */
  label?: string
  icon?: "info" | "trash" | "edit"
  side?: "top" | "bottom"
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кнопка со значком, у которой подпись всё-таки есть — она
// живёт в подсказке. Одна строка label уходит и в aria-label, и в видимый
// пузырёк, поэтому имя действия физически не может разойтись между
// скринридером и глазом. Подсказка на CSS: по наведению с задержкой,
// по клавиатуре — сразу, без задержки и без JS.
const STYLES = `
:where([data-vibeui-block="button-028"]){
--vibeui-button-028-bg:transparent;
--vibeui-button-028-fg:light-dark(oklch(0.32 0.016 265),oklch(0.9 0.008 265));
--vibeui-button-028-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-button-028-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-button-028-tip:light-dark(oklch(0.24 0.02 265),oklch(0.93 0.008 265));
--vibeui-button-028-tip-fg:light-dark(oklch(0.98 0.005 265),oklch(0.22 0.02 265));
--vibeui-button-028-size:2.25rem;
--vibeui-button-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-028"]{
position:relative;display:inline-flex;
font-family:var(--vibeui-button-028-font);
}
[data-vibeui-block="button-028"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:var(--vibeui-button-028-size);height:var(--vibeui-button-028-size);
padding:0;box-sizing:border-box;
border:1px solid var(--vibeui-button-028-border);border-radius:0.625rem;
background:var(--vibeui-button-028-bg);color:var(--vibeui-button-028-fg);
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-028"] button:hover{color:var(--vibeui-button-028-accent);border-color:var(--vibeui-button-028-accent)}
[data-vibeui-block="button-028"] button:focus-visible{outline:2px solid var(--vibeui-button-028-accent);outline-offset:2px}
/* Подсказка: по мыши с задержкой, по клавиатуре — сразу. */
[data-vibeui-block="button-028"] [data-part="tip"]{
position:absolute;left:50%;z-index:2;
padding:0.3125rem 0.5rem;border-radius:0.375rem;
background:var(--vibeui-button-028-tip);color:var(--vibeui-button-028-tip-fg);
font-size:0.75rem;font-weight:550;line-height:1.2;white-space:nowrap;
opacity:0;pointer-events:none;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
transition-delay:0s;
}
[data-vibeui-block="button-028"][data-side="top"] [data-part="tip"]{bottom:calc(100% + 0.4375rem)}
[data-vibeui-block="button-028"][data-side="bottom"] [data-part="tip"]{top:calc(100% + 0.4375rem);transform:translate(-50%,-0.25rem)}
[data-vibeui-block="button-028"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="button-028"][data-side="top"] [data-part="tip"]::after{top:calc(100% - 0.25rem)}
[data-vibeui-block="button-028"][data-side="bottom"] [data-part="tip"]::after{bottom:calc(100% - 0.25rem)}
[data-vibeui-block="button-028"] button:hover + [data-part="tip"]{
opacity:1;transform:translate(-50%,0);transition-delay:.35s;
}
[data-vibeui-block="button-028"] button:focus-visible + [data-part="tip"]{
opacity:1;transform:translate(-50%,0);transition-delay:0s;
}
[data-vibeui-block="button-028"] [data-part="glyph"]{position:relative;display:block}
[data-vibeui-block="button-028"] [data-icon="info"]{
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid currentColor;border-radius:9999px;
}
[data-vibeui-block="button-028"] [data-icon="info"]::before{
content:"";position:absolute;left:50%;top:0.1875rem;width:2px;height:2px;
margin-left:-1px;border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-028"] [data-icon="info"]::after{
content:"";position:absolute;left:50%;top:0.4375rem;width:2px;height:0.375rem;
margin-left:-1px;border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-028"] [data-icon="trash"]{
width:0.75rem;height:0.8125rem;margin-top:0.1875rem;box-sizing:border-box;
border:1.5px solid currentColor;border-top:0;border-radius:0 0 0.1875rem 0.1875rem;
}
[data-vibeui-block="button-028"] [data-icon="trash"]::before{
content:"";position:absolute;left:-0.125rem;top:-0.1875rem;width:1rem;height:1.5px;
border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-028"] [data-icon="trash"]::after{
content:"";position:absolute;left:0.25rem;top:-0.375rem;width:0.25rem;height:1.5px;
border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-028"] [data-icon="edit"]{
width:0.3125rem;height:0.8125rem;box-sizing:border-box;
border:1.5px solid currentColor;border-bottom:0;border-radius:0.125rem 0.125rem 0 0;
transform:rotate(45deg);
}
[data-vibeui-block="button-028"] [data-icon="edit"]::after{
content:"";position:absolute;left:-1.5px;top:100%;
border:0.1875rem solid transparent;border-top-color:currentColor;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-028"] *{animation:none!important;transition:none!important}}
`

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
 * Кнопка со значком без подписи: имя действия живёт в aria-label и подсказке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button028({
  label = "Удалить черновик",
  icon = "trash",
  side = "top",
  background = "",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button028Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-028-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-028" precedence="medium">
        {STYLES}
      </style>
      <span
        data-vibeui-block="button-028"
        data-side={side}
        className={className}
        style={palette}
      >
        <button {...props} type={type} aria-label={label}>
          <span data-part="glyph" data-icon={icon} />
        </button>
        {/* Подсказка — украшение: имя действия уже есть в aria-label. */}
        <span data-part="tip" aria-hidden="true">
          {label}
        </span>
      </span>
    </>
  )
}
