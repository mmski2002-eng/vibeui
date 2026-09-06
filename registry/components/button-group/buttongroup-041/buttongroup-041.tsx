"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup041Reaction = {
  emoji: string
  name: string
  count: number
}

export type Buttongroup041Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  reactions?: Buttongroup041Reaction[]
  mine?: string[]
  label?: string
  /** Доступное имя кнопки выбора эмодзи: голый плюс его не имеет. */
  addLabel?: string
  onChange?: (name: string, active: boolean) => void
  /** Пусто — заливки нет, пилюли ложатся на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: реакции — не выбор одного из, а набор независимых
// тумблеров, поэтому каждая пилюля несёт своё aria-pressed. Эмодзи помечен
// aria-hidden, а имя реакции лежит текстом: скринридер должен сказать
// «нравится, 12, нажато», а не зачитывать описание символа. Счётчик набран
// табличными цифрами и имеет минимальную ширину, иначе строка дёргается на
// каждом нажатии. Пилюли переносятся: реакций со временем становится
// больше, и фиксированная строка рано или поздно выедет за карточку.
const STYLES = `
:where([data-vibeui-block="buttongroup-041"]){
--vibeui-buttongroup-041-surface:transparent;
--vibeui-buttongroup-041-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-041-muted:color-mix(in oklab,var(--vibeui-buttongroup-041-fg) 68%,transparent);
--vibeui-buttongroup-041-border:light-dark(oklch(0.89 0 265),oklch(0.42 0 265));
--vibeui-buttongroup-041-line:light-dark(oklch(0.8 0 265),oklch(0.56 0 265));
--vibeui-buttongroup-041-on:light-dark(oklch(0.95 0.045 250),oklch(0.33 0.06 250));
--vibeui-buttongroup-041-accent:light-dark(oklch(0.5 0.16 250),oklch(0.78 0.13 250));
--vibeui-buttongroup-041-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-041"]{color-scheme:dark}
[data-vibeui-block="buttongroup-041"]{
box-sizing:border-box;display:flex;flex-wrap:wrap;gap:0.375rem;
width:100%;max-width:26rem;
font-family:var(--vibeui-buttongroup-041-font);
}
[data-vibeui-block="buttongroup-041"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-041"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.3125rem;
height:1.875rem;padding:0 0.5625rem;
border:1px solid var(--vibeui-buttongroup-041-border);border-radius:9999px;
background:var(--vibeui-buttongroup-041-surface);
color:var(--vibeui-buttongroup-041-muted);
font-size:0.75rem;font-weight:650;line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-041"] [data-part="emoji"]{
font-size:0.875rem;line-height:1;
}
[data-vibeui-block="buttongroup-041"] [data-part="count"]{
min-width:0.875rem;text-align:center;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-041"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="buttongroup-041"] button:hover{
border-color:var(--vibeui-buttongroup-041-line);color:var(--vibeui-buttongroup-041-fg);
}
[data-vibeui-block="buttongroup-041"] button[aria-pressed="true"]{
background:var(--vibeui-buttongroup-041-on);
border-color:var(--vibeui-buttongroup-041-accent);
color:var(--vibeui-buttongroup-041-accent);
}
[data-vibeui-block="buttongroup-041"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-041-accent);outline-offset:2px;
}
[data-vibeui-block="buttongroup-041"] [data-part="add"]{
/* Кнопка квадратная, а содержимое одно: без центрирования плюс прижимался
   к левому краю — общее правило кнопок выравнивает по началу строки. */
width:1.875rem;padding:0;justify-content:center;
color:var(--vibeui-buttongroup-041-muted);
border-style:dashed;
}
[data-vibeui-block="buttongroup-041"] [data-part="add"] svg{
width:0.9375rem;height:0.9375rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-041"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REACTIONS: Buttongroup041Reaction[] = [
  { emoji: "👍", name: "нравится", count: 12 },
  { emoji: "🎉", name: "празднование", count: 4 },
  { emoji: "👀", name: "смотрю", count: 7 },
  { emoji: "🐛", name: "нашёл ошибку", count: 2 },
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
 * Реакции со счётчиками: независимые тумблеры с aria-pressed и переносом строк.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup041({
  reactions = DEFAULT_REACTIONS,
  mine = ["нравится"],
  label = "Реакции на запись",
  addLabel = "Добавить реакцию",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup041Props) {
  const [active, setActive] = useState<string[]>(mine)

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-041-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-041-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-041" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-041"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        {reactions.map((reaction) => {
          const pressed = active.includes(reaction.name)

          return (
            <button
              key={reaction.name}
              type="button"
              aria-pressed={pressed}
              onClick={() => {
                setActive(
                  pressed
                    ? active.filter((name) => name !== reaction.name)
                    : [...active, reaction.name],
                )
                onChange?.(reaction.name, !pressed)
              }}
            >
              <span data-part="emoji" aria-hidden="true">
                {reaction.emoji}
              </span>
              <span data-part="name">{reaction.name}</span>
              <span data-part="count">
                {reaction.count + (pressed ? 1 : 0)}
              </span>
            </button>
          )
        })}
        <button type="button" data-part="add" aria-label={addLabel}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </>
  )
}
