import type { ComponentProps, CSSProperties } from "react"

export type Switch009Props = Omit<ComponentProps<"input">, "type" | "size"> & {
  dayLabel?: string
  nightLabel?: string
  /** Пояснение под названием режима. */
  hint?: string
  /** Пусто — подложки нет, карточка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель темы, а не абстрактный тумблер. Дорожка
// перекрашивается из дневного неба в ночное, бегунок из солнца превращается
// в месяц (вырез сделан вторым кругом с цветом фона), а звёзды проступают
// только ночью. Всё состояние держит нативный checkbox, JS не участвует.
const STYLES = `
:where([data-vibeui-block="switch-009"]){
--vibeui-switch-009-bg:transparent;
--vibeui-switch-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-switch-009-muted:color-mix(in oklab,var(--vibeui-switch-009-fg) 68%,transparent);
--vibeui-switch-009-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
/* Небо и светила — это рисунок, а не тема: они одинаковы в обеих ветках,
   иначе день на тёмной странице перестал бы быть днём. */
--vibeui-switch-009-day:oklch(0.82 0.11 230);
--vibeui-switch-009-night:oklch(0.32 0.06 275);
--vibeui-switch-009-sun:oklch(0.88 0.15 85);
--vibeui-switch-009-moon:oklch(0.95 0.02 265);
--vibeui-switch-009-accent:light-dark(oklch(0.55 0.19 275),oklch(0.75 0.16 275));
--vibeui-switch-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-009"]{color-scheme:dark}
[data-vibeui-block="switch-009"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-009-bg);
border:1px solid var(--vibeui-switch-009-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-009-font);color:var(--vibeui-switch-009-fg);
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="switch-009"] [data-part="caption"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="switch-009"] [data-part="mode"]{font-weight:600}
[data-vibeui-block="switch-009"] [data-part="night-text"]{display:none}
[data-vibeui-block="switch-009"]:has(input:checked) [data-part="night-text"]{display:inline}
[data-vibeui-block="switch-009"]:has(input:checked) [data-part="day-text"]{display:none}
[data-vibeui-block="switch-009"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-switch-009-muted)}
[data-vibeui-block="switch-009"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-009"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:3.75rem;height:2rem;border-radius:9999px;cursor:inherit;
background:var(--vibeui-switch-009-day);
box-shadow:inset 0 1px 3px oklch(0.2 0.02 265 / 25%);
transition:background-color .3s ease;
}
[data-vibeui-block="switch-009"] input:checked{background:var(--vibeui-switch-009-night)}
[data-vibeui-block="switch-009"] input:focus-visible{outline:2px solid var(--vibeui-switch-009-accent);outline-offset:2px}
[data-vibeui-block="switch-009"] [data-part="orb"]{
position:absolute;left:0.25rem;top:0.25rem;
width:1.5rem;height:1.5rem;border-radius:9999px;pointer-events:none;overflow:hidden;
background:var(--vibeui-switch-009-sun);
box-shadow:0 0 0.5rem oklch(0.88 0.15 85 / 70%);
transition:transform .3s cubic-bezier(.32,.72,0,1),background-color .3s ease,box-shadow .3s ease;
}
[data-vibeui-block="switch-009"] input:checked + [data-part="orb"]{
transform:translateX(1.75rem);
background:var(--vibeui-switch-009-moon);
box-shadow:0 0 0.5rem oklch(0.95 0.02 265 / 45%);
}
/* Месяц: круг цвета ночного неба наезжает на солнце и выедает из него серп.
   Днём этот круг сдвинут за пределы бегунка. */
[data-vibeui-block="switch-009"] [data-part="orb"]::after{
content:"";position:absolute;left:0.375rem;top:-0.25rem;
width:1.375rem;height:1.375rem;border-radius:9999px;
background:var(--vibeui-switch-009-night);
transform:translateX(1.5rem);
transition:transform .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-009"] input:checked + [data-part="orb"]::after{transform:translateX(0)}
/* Звёзды: три точки одной тенью, появляются вместе с ночью. */
[data-vibeui-block="switch-009"] [data-part="stars"]{
position:absolute;left:0.6875rem;top:0.625rem;
width:2px;height:2px;border-radius:9999px;pointer-events:none;
background:transparent;
box-shadow:0 0 0 0 transparent,0.5rem 0.375rem 0 0 transparent,1rem -0.25rem 0 0 transparent;
transition:box-shadow .3s ease;
}
[data-vibeui-block="switch-009"] input:checked ~ [data-part="stars"]{
box-shadow:0 0 0 1px oklch(1 0 0 / 85%),0.5rem 0.375rem 0 0.5px oklch(1 0 0 / 65%),1rem -0.25rem 0 0 oklch(1 0 0 / 50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-009"] *{animation:none!important;transition:none!important}}
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
 * Переключатель темы день/ночь: солнце превращается в месяц, всходят звёзды.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch009({
  dayLabel = "Светлая тема",
  nightLabel = "Тёмная тема",
  hint = "Переключается вручную",
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch009Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-009" precedence="medium">
        {STYLES}
      </style>
      <label
        data-slot="switch"
        data-vibeui-block="switch-009"
        className={className}
        style={palette}
      >
        <span data-part="caption">
          <span data-part="mode">
            <span data-part="day-text">{dayLabel}</span>
            <span data-part="night-text">{nightLabel}</span>
          </span>
          <span data-part="hint">{hint}</span>
        </span>
        <span data-part="track">
          <input {...props} type="checkbox" role="switch" />
          <span data-part="orb" aria-hidden="true" />
          <span data-part="stars" aria-hidden="true" />
        </span>
      </label>
    </>
  )
}
