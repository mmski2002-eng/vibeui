import type { ComponentProps, CSSProperties } from "react"

export type Button043Props = ComponentProps<"button"> & {
  /** Высота подъёма на наведении в пикселях. */
  lift?: number
  /** Поверхность кнопки. Пусто — своя, из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: физика подъёма. Тень собрана из трёх слоёв — контактной,
// средней и дальней; на наведении кнопка уезжает вверх, а тени одновременно
// растут и размываются, как у предмета, оторвавшегося от стола. На :active
// подъём обнуляется и остаётся только контактная тень — предмет прижали.
const STYLES = `
:where([data-vibeui-block="button-043"]){
--vibeui-button-043-lift:6px;
--vibeui-button-043-surface:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-button-043-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-button-043-fg:light-dark(oklch(0.24 0.02 265),oklch(0.94 0.006 265));
--vibeui-button-043-accent:light-dark(oklch(0.58 0.16 45),oklch(0.74 0.16 45));
--vibeui-button-043-shadow:light-dark(oklch(0.3 0.03 265 / 22%),oklch(0 0 0 / 55%));
--vibeui-button-043-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-043"]{color-scheme:dark}
[data-vibeui-block="button-043"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-button-043-border);
background:var(--vibeui-button-043-surface);color:var(--vibeui-button-043-fg);
font-family:var(--vibeui-button-043-font);font-size:0.875rem;font-weight:650;line-height:1;
box-shadow:
0 1px 1px var(--vibeui-button-043-shadow),
0 2px 4px -2px var(--vibeui-button-043-shadow),
0 4px 10px -6px var(--vibeui-button-043-shadow);
transition:transform .2s cubic-bezier(0.16,1,0.3,1),box-shadow .2s cubic-bezier(0.16,1,0.3,1);
}
[data-vibeui-block="button-043"]:hover:not(:disabled){
transform:translateY(calc(-1 * var(--vibeui-button-043-lift)));
box-shadow:
0 1px 1px var(--vibeui-button-043-shadow),
0 8px 14px -8px var(--vibeui-button-043-shadow),
0 20px 34px -18px var(--vibeui-button-043-shadow);
}
/* Нажатие возвращает предмет на стол: остаётся только контактная тень. */
[data-vibeui-block="button-043"]:active:not(:disabled){
transform:translateY(1px);
box-shadow:0 1px 1px var(--vibeui-button-043-shadow);
}
[data-vibeui-block="button-043"]:focus-visible{outline:2px solid var(--vibeui-button-043-accent);outline-offset:3px}
[data-vibeui-block="button-043"]:disabled{cursor:not-allowed;opacity:.55;box-shadow:none}
[data-vibeui-block="button-043"] [data-part="chip"]{
flex:none;width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-button-043-accent) 18%,transparent);
position:relative;
}
[data-vibeui-block="button-043"] [data-part="chip"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.5rem;height:0.5rem;
margin:-0.25rem 0 0 -0.25rem;border-radius:2px;
background:var(--vibeui-button-043-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-043"]{transition:none!important}}
`

/**
 * Ветка темы для заданной поверхности. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Кнопка с тенью-подъёмом: на наведении отрывается от поверхности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button043({
  lift = 6,
  background = "",
  accent,
  type = "button",
  className,
  style,
  children = "Открыть карточку",
  ...props
}: Button043Props) {
  const palette = {
    "--vibeui-button-043-lift": `${lift}px`,
    ...(accent ? { "--vibeui-button-043-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-043-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-043" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-043"
        className={className}
        style={palette}
      >
        <span data-part="chip" aria-hidden="true" />
        {children}
      </button>
    </>
  )
}
