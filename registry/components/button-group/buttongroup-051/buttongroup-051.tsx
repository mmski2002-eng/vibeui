import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup051Level = {
  id: string
  label: string
  bars: number
  hue: number
}

export type Buttongroup051Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  levels?: Buttongroup051Level[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: приоритет читается не по цвету, а по высоте столбиков —
// один, два, три, четыре. Порядковая величина требует порядкового признака:
// красный и жёлтый не говорят, какой из них выше, а лесенка говорит. Цвет
// остаётся вторым каналом и приходит оттенком в oklch через переменную.
// Столбики нарисованы флексом с align-items:flex-end, высота задаётся в
// процентах от общей высоты значка, поэтому шкалу можно продлить данными,
// не трогая CSS.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-051"]){
--vibeui-buttongroup-051-surface:transparent;
--vibeui-buttongroup-051-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-051-muted:color-mix(in oklab,var(--vibeui-buttongroup-051-fg) 68%,transparent);
--vibeui-buttongroup-051-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-051-off:light-dark(oklch(0.85 0 265),oklch(0.45 0 265));
--vibeui-buttongroup-051-accent:light-dark(oklch(0.45 0 265),oklch(0.82 0 265));
--vibeui-buttongroup-051-hue:265;
--vibeui-buttongroup-051-radius:0.625rem;
--vibeui-buttongroup-051-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-051"]{color-scheme:dark}
[data-vibeui-block="buttongroup-051"]{
box-sizing:border-box;display:block;width:100%;max-width:26rem;min-inline-size:0;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-051-font);
}
[data-vibeui-block="buttongroup-051"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-051"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-051"] [data-part="track"]{display:flex;isolation:isolate;max-inline-size:100%}
[data-vibeui-block="buttongroup-051"] [data-part="level"]{
position:relative;z-index:0;flex:1 1 0;min-width:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
height:2.5rem;padding:0 0.5rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-051-border);
background:var(--vibeui-buttongroup-051-surface);
color:var(--vibeui-buttongroup-051-muted);
font-size:0.8125rem;font-weight:650;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
/* Подпись — единственная часть сегмента, способная не влезть: у неё, а не
   у всего сегмента, отдаём лишний текст многоточию. */
[data-vibeui-block="buttongroup-051"] [data-part="level"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="buttongroup-051"] [data-part="level"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-051-radius);
border-end-start-radius:var(--vibeui-buttongroup-051-radius);
}
[data-vibeui-block="buttongroup-051"] [data-part="level"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-051-radius);
border-end-end-radius:var(--vibeui-buttongroup-051-radius);
}
[data-vibeui-block="buttongroup-051"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Лесенка: порядковую величину показывает высота, а не оттенок. */
[data-vibeui-block="buttongroup-051"] [data-part="bars"]{
display:flex;align-items:flex-end;gap:2px;height:0.9375rem;flex:none;
}
[data-vibeui-block="buttongroup-051"] [data-part="bars"] i{
width:3px;border-radius:1.5px;
background:var(--vibeui-buttongroup-051-off);
}
[data-vibeui-block="buttongroup-051"] [data-part="bars"] i[data-on="true"]{
background:light-dark(oklch(0.62 0.17 var(--vibeui-buttongroup-051-hue)),oklch(0.74 0.16 var(--vibeui-buttongroup-051-hue)));
}
[data-vibeui-block="buttongroup-051"] [data-part="bars"] i:nth-child(1){height:35%}
[data-vibeui-block="buttongroup-051"] [data-part="bars"] i:nth-child(2){height:55%}
[data-vibeui-block="buttongroup-051"] [data-part="bars"] i:nth-child(3){height:78%}
[data-vibeui-block="buttongroup-051"] [data-part="bars"] i:nth-child(4){height:100%}
[data-vibeui-block="buttongroup-051"] [data-part="level"]:hover{color:var(--vibeui-buttongroup-051-fg)}
[data-vibeui-block="buttongroup-051"] [data-part="level"]:has(input:checked){
z-index:1;
background:light-dark(oklch(0.97 0.03 var(--vibeui-buttongroup-051-hue)),oklch(0.31 0.05 var(--vibeui-buttongroup-051-hue)));
border-color:light-dark(oklch(0.62 0.17 var(--vibeui-buttongroup-051-hue)),oklch(0.66 0.15 var(--vibeui-buttongroup-051-hue)));
color:light-dark(oklch(0.42 0.16 var(--vibeui-buttongroup-051-hue)),oklch(0.88 0.1 var(--vibeui-buttongroup-051-hue)));
}
[data-vibeui-block="buttongroup-051"] [data-part="level"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-051-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-051"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEVELS: Buttongroup051Level[] = [
  { id: "low", label: "Низкий", bars: 1, hue: 230 },
  { id: "normal", label: "Обычный", bars: 2, hue: 160 },
  { id: "high", label: "Высокий", bars: 3, hue: 65 },
  { id: "urgent", label: "Срочный", bars: 4, hue: 25 },
]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Приоритет лесенкой из столбиков: порядок виден высотой, а не только цветом.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup051({
  levels = DEFAULT_LEVELS,
  defaultValue = "high",
  label = "Приоритет задачи",
  name = "buttongroup-051",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup051Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-051-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-051-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-051" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-051"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {levels.map((level) => (
            <label
              key={level.id}
              data-part="level"
              style={
                { "--vibeui-buttongroup-051-hue": level.hue } as CSSProperties
              }
            >
              <input
                type="radio"
                name={name}
                value={level.id}
                defaultChecked={level.id === defaultValue}
              />
              <span data-part="bars" aria-hidden="true">
                {[1, 2, 3, 4].map((step) => (
                  <i key={step} data-on={step <= level.bars} />
                ))}
              </span>
              <span data-part="label">{level.label}</span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
