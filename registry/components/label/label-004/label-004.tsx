import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label004Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  hint?: string
  labelWidth?: number
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в плотной десктопной форме подпись сбоку экономит
// вертикаль и даёт полям общий левый край. Раскладка переключается по
// ширине самого блока (container query), а не по ширине окна: в узкой
// колонке настроек подпись возвращается наверх, и это верно даже тогда,
// когда окно широкое.
const STYLES = `
:where([data-vibeui-block="label-004"]){
--vibeui-label-004-surface:transparent;
--vibeui-label-004-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-004-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-004-muted:color-mix(in oklab,var(--vibeui-label-004-fg) 68%,transparent);
--vibeui-label-004-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-label-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-label-004-label-width:9rem;
--vibeui-label-004-radius:0.625rem;
--vibeui-label-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-004"]{color-scheme:dark}
[data-vibeui-block="label-004"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:38rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-004-surface);
border:1px solid var(--vibeui-label-004-surface-border);
font-family:var(--vibeui-label-004-font);color:var(--vibeui-label-004-fg);
}
/* Раскладка живёт на внутренней оболочке: правило внутри @container не
   действует на сам контейнер, поэтому на корне её держать нельзя. */
[data-vibeui-block="label-004"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;gap:0.375rem 1rem;
grid-template-areas:"label" "field" "hint";
}
[data-vibeui-block="label-004"] label{
grid-area:label;
font-size:0.875rem;font-weight:600;line-height:1.35;cursor:pointer;
}
[data-vibeui-block="label-004"] input{
grid-area:field;
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-004-fg);background:var(--vibeui-label-004-surface);
border:1px solid var(--vibeui-label-004-field-border);
border-radius:var(--vibeui-label-004-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-004"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-004-accent) 22%,transparent);
}
[data-vibeui-block="label-004"] [data-part="hint"]{
grid-area:hint;margin:0;
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-label-004-muted);
}
@container (min-width: 28rem){
[data-vibeui-block="label-004"] [data-part="shell"]{
grid-template-columns:var(--vibeui-label-004-label-width) minmax(0,1fr);
grid-template-areas:"label field" ".     hint";
align-items:start;
}
/* Подпись опускается на строку поля: выравнивание по первой строке
   текста внутри поля, а не по его верхнему краю. */
[data-vibeui-block="label-004"] label{padding-top:0.625rem;text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-004"] *{animation:none!important;transition:none!important}}
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
 * Подпись слева от поля для десктопной формы: колонка подписи фиксирована,
 * на узкой ширине блока подпись уходит наверх. Один файл, ноль зависимостей.
 */
export function Label004({
  label = "Название компании",
  hint = "Так, как написано в реквизитах, без кавычек и формы собственности.",
  labelWidth = 9,
  background = "",
  accent,
  className,
  style,
  ...props
}: Label004Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    "--vibeui-label-004-label-width": `${labelWidth}rem`,
    ...(accent ? { "--vibeui-label-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
        data-vibeui-block="label-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type="text"
            name="company"
            autoComplete="organization"
            aria-describedby={hintId}
          />
          <p data-part="hint" id={hintId}>
            {hint}
          </p>
        </div>
      </div>
    </>
  )
}
