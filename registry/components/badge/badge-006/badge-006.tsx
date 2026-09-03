import type { ComponentProps, CSSProperties } from "react"

export type Badge006Stage = "draft" | "review" | "live" | "archived"

export type Badge006Props = Omit<ComponentProps<"span">, "children"> & {
  stage?: Badge006Stage
  label?: string
  /** Подписи стадий: компонент несёт русские, проект подставляет свои. */
  stageText?: Record<Badge006Stage, string>
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: стадия документа со своим знаком. У каждой стадии свой
// значок — круг, полукруг, залитый круг, перечёркнутый — поэтому она читается
// и в чёрно-белой печати, и при дальтонизме. Значки собраны из бордюров и
// градиента, без иконочного пакета.
const STYLES = `
:where([data-vibeui-block="badge-006"]){
--vibeui-badge-006-bg:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.009 265));
--vibeui-badge-006-fg:light-dark(oklch(0.32 0.014 265),oklch(0.93 0.006 265));
--vibeui-badge-006-border:light-dark(oklch(0.89 0.006 265),oklch(0.39 0.011 265));
--vibeui-badge-006-mark:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-badge-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-006"]{color-scheme:dark}
[data-vibeui-block="badge-006"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.5rem;padding:0 0.625rem;
border:1px solid var(--vibeui-badge-006-border);border-radius:0.4375rem;
background:var(--vibeui-badge-006-bg);color:var(--vibeui-badge-006-fg);
font-family:var(--vibeui-badge-006-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-006"][data-stage="review"]{--vibeui-badge-006-mark:light-dark(oklch(0.72 0.16 75),oklch(0.81 0.15 75))}
[data-vibeui-block="badge-006"][data-stage="live"]{--vibeui-badge-006-mark:light-dark(oklch(0.6 0.17 152),oklch(0.73 0.16 152))}
[data-vibeui-block="badge-006"][data-stage="archived"]{--vibeui-badge-006-mark:light-dark(oklch(0.66 0.012 265),oklch(0.56 0.012 265));color:light-dark(oklch(0.5 0.014 265),oklch(0.68 0.012 265))}
/* Форма знака несёт стадию: цвет только усиливает, но не заменяет её. */
[data-vibeui-block="badge-006"] [data-part="mark"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;
border:1.5px solid var(--vibeui-badge-006-mark);border-radius:9999px;
}
[data-vibeui-block="badge-006"][data-stage="review"] [data-part="mark"]{
background:linear-gradient(to right,var(--vibeui-badge-006-mark) 50%,transparent 50%);
}
[data-vibeui-block="badge-006"][data-stage="live"] [data-part="mark"]{background:var(--vibeui-badge-006-mark)}
[data-vibeui-block="badge-006"][data-stage="archived"] [data-part="mark"]::after{
content:"";position:absolute;left:-0.0625rem;right:-0.0625rem;top:50%;
height:1.5px;margin-top:-0.75px;background:var(--vibeui-badge-006-mark);
transform:rotate(-45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-006"] *{animation:none!important;transition:none!important}}
`

const STAGE_TEXT: Record<Badge006Stage, string> = {
  draft: "Черновик",
  review: "На проверке",
  live: "Опубликован",
  archived: "В архиве",
}

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
 * Стадия документа со знаком-формой: читается и без цвета.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge006({
  stage = "review",
  label,
  stageText = STAGE_TEXT,
  background = "",
  className,
  style,
  ...props
}: Badge006Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-006" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-006"
        data-stage={stage}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        {label ?? stageText[stage] ?? STAGE_TEXT[stage]}
      </span>
    </>
  )
}
