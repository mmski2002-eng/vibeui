"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label011Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: string[]
  defaultValue?: string[]
  /** Счётчик в заголовке. {checked} — отмечено, {total} — всего. */
  countText?: string
  /** Живое сообщение для озвучки. {checked} и {total} — те же числа. */
  liveText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у чекбоксов нет одного «поля», которое можно подписать
// <label>, поэтому счётчик встроен в <legend> — общую подпись группы. Он
// пересчитывается на каждый клик через useState с массивом выбранных
// значений; отдельный <span> с aria-live озвучивает итог, чтобы его не
// приходилось искать глазами после каждого клика.
const STYLES = `
:where([data-vibeui-block="label-011"]){
--vibeui-label-011-surface:transparent;
--vibeui-label-011-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-011-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-011-muted:color-mix(in oklab,var(--vibeui-label-011-fg) 68%,transparent);
--vibeui-label-011-item-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-label-011-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-label-011-radius:0.625rem;
--vibeui-label-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-011"]{color-scheme:dark}
[data-vibeui-block="label-011"]{
box-sizing:border-box;width:100%;max-width:24rem;
margin:0;padding:1rem;
background:var(--vibeui-label-011-surface);
border:1px solid var(--vibeui-label-011-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-label-011-font);color:var(--vibeui-label-011-fg);
}
/* Тот же приём, что и в группах-легендах проекта: float:left + width:100%
   снимает с <legend> его особую раскладку, а внутри уже можно ставить
   flex на обычный <span>. */
[data-vibeui-block="label-011"] legend{
float:left;width:100%;padding:0;margin:0;
}
[data-vibeui-block="label-011"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="label-011"] [data-part="text"]{
font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="label-011"] [data-part="count"]{
flex:none;font-size:0.75rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-label-011-muted);
}
[data-vibeui-block="label-011"] [data-part="live"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="label-011"] [data-part="shell"]{
clear:both;display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;
}
[data-vibeui-block="label-011"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
padding:0.5625rem 0.75rem;
border:1px solid var(--vibeui-label-011-item-border);
border-radius:var(--vibeui-label-011-radius);
font-size:0.9375rem;line-height:1.35;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="label-011"] [data-part="item"]:has(input:checked){
border-color:var(--vibeui-label-011-accent);
background:color-mix(in oklab,var(--vibeui-label-011-accent) 8%,transparent);
}
[data-vibeui-block="label-011"] [data-part="item"]:has(input:focus-visible){
outline:2px solid var(--vibeui-label-011-accent);outline-offset:2px;
}
[data-vibeui-block="label-011"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;
width:1.0625rem;height:1.0625rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-label-011-item-border);
background:var(--vibeui-label-011-surface);cursor:inherit;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="label-011"] input:checked{
border-color:var(--vibeui-label-011-accent);background:var(--vibeui-label-011-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-011"] *{animation:none!important;transition:none!important}}
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
 * Подпись группы чекбоксов со счётчиком выбранного в <legend>: «N из M
 * выбрано» пересчитывается на клик и дублируется в aria-live. Один файл,
 * ноль зависимостей.
 */
export function Label011({
  legend = "Каналы уведомлений",
  options = ["Почта", "SMS", "Push в приложении", "Телеграм-бот", "Звонок"],
  defaultValue = ["Почта", "SMS", "Push в приложении"],
  countText = "{checked} из {total} выбрано",
  liveText = "Выбрано {checked} из {total}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label011Props) {
  const id = useId()
  const [checked, setChecked] = useState<string[]>(defaultValue)
  const fill = (template: string) =>
    template
      .replace("{checked}", String(checked.length))
      .replace("{total}", String(options.length))
  const palette = {
    ...(accent ? { "--vibeui-label-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function toggle(option: string) {
    setChecked((current) =>
      current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option],
    )
  }

  return (
    <>
      <style href="vibeui-label-011" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="label"
        data-vibeui-block="label-011"
        className={className}
        style={palette}
      >
        <legend>
          <span data-part="head">
            <span data-part="text">{legend}</span>
            <span data-part="count">{fill(countText)}</span>
          </span>
        </legend>
        <p data-part="live" aria-live="polite">
          {fill(liveText)}
        </p>
        <div data-part="shell">
          {options.map((option) => (
            <label data-part="item" key={option}>
              <input
                type="checkbox"
                name={`${id}-channels`}
                value={option}
                checked={checked.includes(option)}
                onChange={() => toggle(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
