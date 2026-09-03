import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup026Speed = {
  value: string
  note: string
}

export type Buttongroup026Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  speeds?: Buttongroup026Speed[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сегменты не равной ширины — выбранный раздвигается и
// показывает словесное пояснение, остальные ужимаются до множителя. Растёт
// не размер шрифта, а доля во flex: у выбранного flex-grow становится
// больше, и переход анимируется по flex-grow, а не по width, поэтому сумма
// ширин всегда равна треку и группа не дрожит. Пояснение скрыто не
// display:none, а нулевой шириной с overflow:hidden — так его можно плавно
// раскрыть, и оно остаётся в доступном дереве только у выбранного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-026"]){
--vibeui-buttongroup-026-bg:transparent;
--vibeui-buttongroup-026-surface:light-dark(oklch(1 0 0),oklch(0.3 0.014 265));
--vibeui-buttongroup-026-track:light-dark(oklch(0.96 0.004 265),oklch(0.24 0.012 265));
--vibeui-buttongroup-026-fg:light-dark(oklch(0.24 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-026-muted:color-mix(in oklab,var(--vibeui-buttongroup-026-fg) 68%,transparent);
--vibeui-buttongroup-026-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-buttongroup-026-accent:light-dark(oklch(0.45 0.13 305),oklch(0.8 0.13 305));
--vibeui-buttongroup-026-radius:0.5rem;
--vibeui-buttongroup-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-026"]{color-scheme:dark}
[data-vibeui-block="buttongroup-026"]{
box-sizing:border-box;display:block;width:100%;max-width:22rem;
margin:0;padding:0.375rem;border:1px solid var(--vibeui-buttongroup-026-border);
border-radius:0.875rem;
background:var(--vibeui-buttongroup-026-bg);
font-family:var(--vibeui-buttongroup-026-font);
}
[data-vibeui-block="buttongroup-026"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-026"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-026"] [data-part="track"]{
display:flex;gap:0.1875rem;padding:0.1875rem;
border-radius:calc(var(--vibeui-buttongroup-026-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-026-track);
}
/* Анимируется доля во flex, а не ширина: сумма всегда равна треку. */
[data-vibeui-block="buttongroup-026"] [data-part="segment"]{
position:relative;flex:1 1 0;min-width:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.3125rem;
height:2.25rem;padding:0 0.375rem;
border-radius:var(--vibeui-buttongroup-026-radius);
color:var(--vibeui-buttongroup-026-muted);
font-size:0.8125rem;font-weight:650;line-height:1;white-space:nowrap;cursor:pointer;
font-variant-numeric:tabular-nums;
transition:flex-grow .22s cubic-bezier(.2,.7,.3,1),background-color .18s ease,color .18s ease;
}
[data-vibeui-block="buttongroup-026"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-026"] [data-part="note"]{
max-width:0;overflow:hidden;opacity:0;
font-size:0.6875rem;font-weight:600;
transition:max-width .22s cubic-bezier(.2,.7,.3,1),opacity .18s ease;
}
[data-vibeui-block="buttongroup-026"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-026-fg)}
[data-vibeui-block="buttongroup-026"] [data-part="segment"]:has(input:checked){
flex-grow:2.4;
background:var(--vibeui-buttongroup-026-surface);
color:var(--vibeui-buttongroup-026-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 16%);
}
[data-vibeui-block="buttongroup-026"] [data-part="segment"]:has(input:checked) [data-part="note"]{
max-width:8rem;opacity:1;
}
[data-vibeui-block="buttongroup-026"] [data-part="segment"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-026-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-026"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SPEEDS: Buttongroup026Speed[] = [
  { value: "0,5×", note: "медленно" },
  { value: "1×", note: "обычная" },
  { value: "1,5×", note: "быстрее" },
  { value: "2×", note: "вдвое" },
]

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
 * Скорость воспроизведения: выбранный сегмент раздвигается и поясняет себя.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup026({
  speeds = DEFAULT_SPEEDS,
  defaultValue = "1×",
  label = "Скорость воспроизведения",
  name = "buttongroup-026",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup026Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-026" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-026"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {speeds.map((speed) => (
            <label key={speed.value} data-part="segment">
              <input
                type="radio"
                name={name}
                value={speed.value}
                defaultChecked={speed.value === defaultValue}
              />
              <span>{speed.value}</span>
              <span data-part="note">{speed.note}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
