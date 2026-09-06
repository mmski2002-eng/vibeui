import type { ComponentProps, CSSProperties, ReactElement } from "react"

export type Button028Props = Omit<ComponentProps<"button">, "children"> & {
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
--vibeui-button-028-fg:light-dark(oklch(0.32 0 265),oklch(0.9 0 265));
--vibeui-button-028-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-028-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-028-tip:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-button-028-tip-fg:light-dark(oklch(0.98 0 265),oklch(0.22 0 265));
--vibeui-button-028-size:2.25rem;
--vibeui-button-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-028"]{color-scheme:dark}
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
/* Значок — квадратный svg по центру кнопки: у нарисованных на псевдо-
   элементах фигур центр не совпадал с центром квадрата, и значок съезжал. */
[data-vibeui-block="button-028"] [data-part="glyph"]{
display:block;width:1.125rem;height:1.125rem;
}
[data-vibeui-block="button-028"] [data-part="glyph"] svg{
display:block;width:100%;height:100%;
fill:none;stroke:currentColor;stroke-width:1.7;
stroke-linecap:round;stroke-linejoin:round;
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

const GLYPHS: Record<"info" | "trash" | "edit", ReactElement> = {
  info: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h16" />
      <path d="M9.5 7V5h5v2" />
      <path d="M6.5 7 7.5 20h9L17.5 7" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24">
      <path d="m4 20 .9-3.7L15.6 5.6a1.6 1.6 0 0 1 2.3 0l.5.5a1.6 1.6 0 0 1 0 2.3L7.7 19.1z" />
      <path d="m14.4 6.8 2.8 2.8" />
    </svg>
  ),
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
        data-slot="button"
        data-vibeui-block="button-028"
        data-side={side}
        className={className}
        style={palette}
      >
        <button {...props} type={type} aria-label={label}>
          <span data-part="glyph" data-icon={icon} aria-hidden="true">
            {GLYPHS[icon]}
          </span>
        </button>
        {/* Подсказка — украшение: имя действия уже есть в aria-label. */}
        <span data-part="tip" aria-hidden="true">
          {label}
        </span>
      </span>
    </>
  )
}
