import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup008Props = Omit<ComponentProps<"nav">, "children"> & {
  page?: number
  total?: number
  label?: string
  /** Подпись кнопки «назад». Компонент несёт русскую, проект подставляет свою. */
  prevText?: string
  /** Подпись кнопки «вперёд». */
  nextText?: string
  /** Имя кнопки «назад» для скринридера. */
  prevLabel?: string
  /** Имя кнопки «вперёд» для скринридера. */
  nextLabel?: string
  /** Позиция вслух: {page} и {total} подставляются числами. */
  positionText?: string
  /** Пусто — подложки нет, пагинатор лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пагинатор из трёх ячеек — назад, счётчик, вперёд. Счётчик
// стоит внутри той же рамки, что и кнопки, поэтому группа читается как один
// орган управления. Ширина ячейки со счётчиком зафиксирована и цифры набраны
// табличными: при переходе с «9 / 12» на «10 / 12» кнопки не прыгают.
// Полное «Страница 3 из 12» лежит рядом текстом для скринридера — дробь
// вслух звучит как «три дробь двенадцать» и смысла не несёт.
const STYLES = `
:where([data-vibeui-block="buttongroup-008"]){
--vibeui-buttongroup-008-surface:transparent;
--vibeui-buttongroup-008-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-008-muted:color-mix(in oklab,var(--vibeui-buttongroup-008-fg) 68%,transparent);
--vibeui-buttongroup-008-faint:light-dark(oklch(0.8 0 265),oklch(0.5 0 265));
--vibeui-buttongroup-008-border:light-dark(oklch(0.88 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-008-hover:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-buttongroup-008-off:light-dark(oklch(0.98 0 265),oklch(0.26 0 265));
--vibeui-buttongroup-008-off-fg:light-dark(oklch(0.75 0 265),oklch(0.48 0 265));
--vibeui-buttongroup-008-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-buttongroup-008-radius:0.625rem;
--vibeui-buttongroup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-008"]{color-scheme:dark}
[data-vibeui-block="buttongroup-008"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
font-family:var(--vibeui-buttongroup-008-font);
}
[data-vibeui-block="buttongroup-008"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-008"] button,
[data-vibeui-block="buttongroup-008"] [data-part="count"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-008-border);
background:var(--vibeui-buttongroup-008-surface);
font-size:0.8125rem;font-weight:600;line-height:1;
}
[data-vibeui-block="buttongroup-008"] button{
appearance:none;cursor:pointer;font:inherit;font-weight:600;
gap:0.375rem;padding:0 0.75rem;
color:var(--vibeui-buttongroup-008-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-008"] button:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-008-radius);
border-end-start-radius:var(--vibeui-buttongroup-008-radius);
}
[data-vibeui-block="buttongroup-008"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-008-radius);
border-end-end-radius:var(--vibeui-buttongroup-008-radius);
}
[data-vibeui-block="buttongroup-008"] button:hover:not(:disabled){z-index:1;background:var(--vibeui-buttongroup-008-hover)}
[data-vibeui-block="buttongroup-008"] button:focus-visible{
z-index:2;
outline:2px solid var(--vibeui-buttongroup-008-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-008"] button:disabled{
cursor:not-allowed;color:var(--vibeui-buttongroup-008-off-fg);
background:var(--vibeui-buttongroup-008-off);
}
/* Ширина счётчика фиксирована, цифры табличные: иначе группа дёргается
   на каждом переходе через десяток. */
[data-vibeui-block="buttongroup-008"] [data-part="count"]{
min-width:4.5rem;padding:0 0.5rem;
color:var(--vibeui-buttongroup-008-muted);
font-variant-numeric:tabular-nums;letter-spacing:0.01em;
}
[data-vibeui-block="buttongroup-008"] [data-part="now"]{color:var(--vibeui-buttongroup-008-fg)}
[data-vibeui-block="buttongroup-008"] [data-part="slash"]{margin:0 0.3125rem;color:var(--vibeui-buttongroup-008-faint)}
[data-vibeui-block="buttongroup-008"] [data-part="arrow"]{
width:0.4375rem;height:0.4375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
[data-vibeui-block="buttongroup-008"] [data-part="prev"] [data-part="arrow"]{transform:rotate(-135deg)}
[data-vibeui-block="buttongroup-008"] [data-part="next"] [data-part="arrow"]{transform:rotate(45deg)}
[data-vibeui-block="buttongroup-008"] [data-part="spoken"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Пагинатор-группа: назад, счётчик страниц, вперёд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup008({
  page = 3,
  total = 12,
  label = "Постраничная навигация",
  prevText = "Назад",
  nextText = "Вперёд",
  prevLabel = "Предыдущая страница",
  nextLabel = "Следующая страница",
  positionText = "Страница {page} из {total}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup008Props) {
  const current = Math.min(Math.max(page, 1), Math.max(total, 1))
  const spoken = positionText
    .replace("{page}", String(current))
    .replace("{total}", String(total))

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-008"
        aria-label={label}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="prev"
          disabled={current <= 1}
          aria-label={prevLabel}
        >
          <span data-part="arrow" aria-hidden="true" />
          {prevText}
        </button>
        <span data-part="count">
          <span data-part="spoken">{spoken}</span>
          <span aria-hidden="true">
            <span data-part="now">{current}</span>
            <span data-part="slash">/</span>
            {total}
          </span>
        </span>
        <button
          type="button"
          data-part="next"
          disabled={current >= total}
          aria-label={nextLabel}
        >
          {nextText}
          <span data-part="arrow" aria-hidden="true" />
        </button>
      </nav>
    </>
  )
}
