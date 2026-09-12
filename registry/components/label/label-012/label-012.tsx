import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label012Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  optionalText?: string
  placeholder?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пометка «необязательно» не всегда заслуживает отдельного
// бейджа с подложкой — иногда это просто более тихая часть той же фразы.
// Здесь она встроена прямым текстом в <label> и приглушена только цветом и
// начертанием, без рамок и фона: подпись читается одной строкой, а не
// подписью плюс наклеенным ярлыком.
const STYLES = `
:where([data-vibeui-block="label-012"]){
--vibeui-label-012-surface:transparent;
--vibeui-label-012-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-012-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-012-muted:color-mix(in oklab,var(--vibeui-label-012-fg) 68%,transparent);
--vibeui-label-012-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-label-012-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-label-012-radius:0.625rem;
--vibeui-label-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-012"]{color-scheme:dark}
[data-vibeui-block="label-012"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-012-surface);
border:1px solid var(--vibeui-label-012-surface-border);
font-family:var(--vibeui-label-012-font);color:var(--vibeui-label-012-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="label-012"] label{
display:block;font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-012"] [data-part="hint"]{
font-weight:400;color:var(--vibeui-label-012-muted);
}
[data-vibeui-block="label-012"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-012-fg);background:var(--vibeui-label-012-surface);
border:1px solid var(--vibeui-label-012-field-border);
border-radius:var(--vibeui-label-012-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-012"] input::placeholder{color:var(--vibeui-label-012-muted)}
[data-vibeui-block="label-012"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-012-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Подпись с пометкой «необязательно» как приглушённой частью той же фразы,
 * без бейджа и подложки. Один файл, ноль зависимостей.
 */
export function Label012({
  label = "Название компании",
  optionalText = "необязательно",
  placeholder = "ООО «Ромашка»",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label012Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-label-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
        data-vibeui-block="label-012"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label} <span data-part="hint">({optionalText})</span>
        </label>
        <input id={id} type="text" name="company" placeholder={placeholder} />
      </div>
    </>
  )
}
