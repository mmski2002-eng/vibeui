import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label003Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  optionalText?: string
  placeholder?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: если обязательных полей в форме большинство, звёздочки
// превращаются в шум — дешевле пометить меньшинство. Пометка стоит на
// правом краю строки подписи: глаз проходит форму по левому краю и по
// правому отдельно, поэтому «необязательно» видно, не мешая читать имена.
const STYLES = `
:where([data-vibeui-block="label-003"]){
--vibeui-label-003-surface:transparent;
--vibeui-label-003-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-label-003-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-label-003-muted:color-mix(in oklab,var(--vibeui-label-003-fg) 68%,transparent);
--vibeui-label-003-tag-bg:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-label-003-field-border:light-dark(oklch(0.85 0.01 265),oklch(0.4 0.014 265));
--vibeui-label-003-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-label-003-radius:0.625rem;
--vibeui-label-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-003"]{color-scheme:dark}
[data-vibeui-block="label-003"]{
box-sizing:border-box;width:100%;max-width:26rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-003-surface);
border:1px solid var(--vibeui-label-003-surface-border);
font-family:var(--vibeui-label-003-font);color:var(--vibeui-label-003-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
/* Подпись и пометка разведены по краям строки: baseline держит их на
   одной линии, даже когда у пометки другой кегль. */
[data-vibeui-block="label-003"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;
gap:0.75rem;
}
[data-vibeui-block="label-003"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-003"] [data-part="tag"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:500;line-height:1.5;letter-spacing:0.01em;
color:var(--vibeui-label-003-muted);background:var(--vibeui-label-003-tag-bg);
}
[data-vibeui-block="label-003"] textarea{
box-sizing:border-box;width:100%;min-height:5rem;resize:vertical;
padding:0.5rem 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.45;
color:var(--vibeui-label-003-fg);background:var(--vibeui-label-003-surface);
border:1px solid var(--vibeui-label-003-field-border);
border-radius:var(--vibeui-label-003-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-003"] textarea::placeholder{color:var(--vibeui-label-003-muted)}
[data-vibeui-block="label-003"] textarea:focus-visible{
outline:none;border-color:var(--vibeui-label-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-003-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-003"] *{animation:none!important;transition:none!important}}
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
 * Подпись с пометкой «необязательно» на правом краю строки: помечено
 * меньшинство, а не большинство. Один файл, ноль зависимостей.
 */
export function Label003({
  label = "Комментарий к заказу",
  optionalText = "необязательно",
  placeholder = "Например: позвонить за час до доставки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label003Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-label-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
        data-vibeui-block="label-003"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor={id}>{label}</label>
          <span data-part="tag">{optionalText}</span>
        </div>
        <textarea id={id} name="comment" rows={3} placeholder={placeholder} />
      </div>
    </>
  )
}
