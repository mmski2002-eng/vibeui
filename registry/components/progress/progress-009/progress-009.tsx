import type { ComponentProps, CSSProperties } from "react"

export type Progress009Props = Omit<ComponentProps<"div">, "children"> & {
  value?: number
  label?: string
  caption?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: число стоит не в углу, а над концом заливки — глазу не
// нужно связывать далеко разнесённые подпись и полосу. Пузырёк едет по
// дорожке на left и прижимается clamp'ом к краям, поэтому у нуля и у ста
// процентов он не вылезает за границу карточки.
const STYLES = `
:where([data-vibeui-block="progress-009"]){
--vibeui-progress-009-bg:transparent;
--vibeui-progress-009-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-progress-009-muted:color-mix(in oklab,var(--vibeui-progress-009-fg) 68%,transparent);
--vibeui-progress-009-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-progress-009-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-progress-009-accent:light-dark(oklch(0.28 0 0),oklch(0.895 0 0));
--vibeui-progress-009-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0 292));
--vibeui-progress-009-fade:light-dark(oklch(1 0 0),oklch(0.24 0 292));
--vibeui-progress-009-value:0;
--vibeui-progress-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-009"]{color-scheme:dark}
[data-vibeui-block="progress-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-009-bg);
border:1px solid var(--vibeui-progress-009-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-009-font);color:var(--vibeui-progress-009-fg);
}
[data-vibeui-block="progress-009"] [data-part="label"]{
font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="progress-009"] [data-part="rail"]{
position:relative;padding-top:1.75rem;
}
/* Пузырёк едет вместе с заливкой, clamp держит его внутри дорожки. */
[data-vibeui-block="progress-009"] [data-part="bubble"]{
position:absolute;top:0;
left:clamp(1.5rem,calc(var(--vibeui-progress-009-value) * 1%),calc(100% - 1.5rem));
transform:translateX(-50%);
padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-progress-009-accent);color:oklch(from var(--vibeui-progress-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.75rem;font-weight:700;line-height:1.2;
font-variant-numeric:tabular-nums;white-space:nowrap;
transition:left .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="progress-009"] [data-part="bubble"]::after{
content:"";position:absolute;left:50%;top:100%;
width:0;height:0;margin-left:-0.25rem;
border:0.25rem solid transparent;
border-top-color:var(--vibeui-progress-009-accent);
}
[data-vibeui-block="progress-009"] [data-part="track"]{
height:0.5rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-progress-009-track);
}
[data-vibeui-block="progress-009"] [data-part="bar"]{
height:100%;border-radius:inherit;
width:calc(var(--vibeui-progress-009-value) * 1%);
background:linear-gradient(90deg,color-mix(in oklch,var(--vibeui-progress-009-accent) 60%,var(--vibeui-progress-009-fade)),var(--vibeui-progress-009-accent));
transition:width .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="progress-009"] [data-part="caption"]{
margin:0;font-size:0.875rem;color:var(--vibeui-progress-009-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-009"] *{animation:none!important;transition:none!important}
}
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
 * Полоса, у которой число едет над концом заливки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress009({
  value = 68,
  label = "Профиль заполнен",
  caption = "Осталось добавить телефон и фотографию",
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress009Props) {
  const percent = Math.min(100, Math.max(0, value))
  const palette = {
    "--vibeui-progress-009-value": percent,
    ...(accent ? { "--vibeui-progress-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-009-bg": background,
          "--vibeui-progress-009-fade": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
        data-vibeui-block="progress-009"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>
        <div data-part="rail">
          <span data-part="bubble" aria-hidden="true">
            {Math.round(percent)}%
          </span>
          <div
            data-part="track"
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
          >
            <div data-part="bar" />
          </div>
        </div>
        <p data-part="caption">{caption}</p>
      </div>
    </>
  )
}
