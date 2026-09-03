"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover014Reaction = {
  /** Знак реакции: эмодзи или любой другой символ. */
  glyph: string
  /** Имя реакции: оно уходит скринридеру и во всплывающую подсказку. */
  label: string
  /** Сколько человек уже поставили её. */
  count?: number
}

export type Popover014Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  reactions?: Popover014Reaction[]
  /** Что уже выбрано этим человеком. */
  defaultValue?: string
  /** Подпись выбранной реакции. {label} подставляется. */
  chosenTemplate?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: выбор реакции, у которой есть имя. Ряд эмодзи без подписей
// работает только для тех, кто их различает: одни знаки читаются по-разному в
// разных системах, другие не читаются вовсе. Здесь у каждой кнопки есть имя в
// aria-label и подсказке, а рядом стоит счётчик — он превращает набор картинок
// в понятный итог. Повторное нажатие снимает свою реакцию: поставить и убрать
// должно стоить одинаково.
const STYLES = `
:where([data-vibeui-block="popover-014"]){
--vibeui-popover-014-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-014-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-014-muted:color-mix(in oklab,var(--vibeui-popover-014-fg) 64%,transparent);
--vibeui-popover-014-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-014-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 8%));
--vibeui-popover-014-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-popover-014-chosen:color-mix(in oklab,var(--vibeui-popover-014-accent) 16%,transparent);
--vibeui-popover-014-shadow:light-dark(oklch(0.2 0.02 265 / 24%),oklch(0 0 0 / 60%));
--vibeui-popover-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
anchor-name:--vibeui-popover-014-anchor;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-014"]{color-scheme:dark}
[data-vibeui-block="popover-014"]{
display:inline-block;font-family:var(--vibeui-popover-014-font);color:var(--vibeui-popover-014-fg);
}
[data-vibeui-block="popover-014"] *{box-sizing:border-box}
[data-vibeui-block="popover-014"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:2rem;padding:0.25rem 0.625rem;
border:1px solid var(--vibeui-popover-014-border);border-radius:999px;
background:var(--vibeui-popover-014-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="popover-014"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-014-accent);outline-offset:2px}
[data-vibeui-block="popover-014"] [data-part="trigger"][data-chosen="true"]{
background:var(--vibeui-popover-014-chosen);border-color:var(--vibeui-popover-014-accent);
}
[data-vibeui-block="popover-014"] [popover]{
position:fixed;margin:0;padding:0.375rem;
border:1px solid var(--vibeui-popover-014-border);border-radius:999px;
background:var(--vibeui-popover-014-surface);color:var(--vibeui-popover-014-fg);
box-shadow:0 18px 44px -26px var(--vibeui-popover-014-shadow);
position-anchor:--vibeui-popover-014-anchor;
bottom:anchor(top);left:anchor(left);margin-bottom:0.5rem;
}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-014"]{position:relative}
[data-vibeui-block="popover-014"] [popover]{position:absolute;bottom:calc(100% + 0.5rem);left:0;inset:auto}
}
[data-vibeui-block="popover-014"] [data-part="row"]{display:flex;gap:0.125rem}
[data-vibeui-block="popover-014"] [data-part="pick"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0.0625rem;
width:2.5rem;min-height:2.625rem;padding:0.25rem 0;border-radius:1.25rem;
background:transparent;color:inherit;font:inherit;font-size:1.125rem;line-height:1;
}
[data-vibeui-block="popover-014"] [data-part="pick"]:hover{background:var(--vibeui-popover-014-hover)}
[data-vibeui-block="popover-014"] [data-part="pick"]:focus-visible{outline:2px solid var(--vibeui-popover-014-accent);outline-offset:-2px}
[data-vibeui-block="popover-014"] [data-part="pick"][aria-pressed="true"]{background:var(--vibeui-popover-014-chosen)}
[data-vibeui-block="popover-014"] [data-part="count"]{
font-size:0.75rem;color:var(--vibeui-popover-014-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="popover-014"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя. */
[data-vibeui-block="popover-014"][data-open]{
display:flex;flex-direction:column;align-items:flex-start;
}
[data-vibeui-block="popover-014"][data-open] [popover]{
display:inline-block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REACTIONS: Popover014Reaction[] = [
  { glyph: "👍", label: "Согласен", count: 12 },
  { glyph: "🎉", label: "Отлично", count: 4 },
  { glyph: "👀", label: "Смотрю", count: 3 },
  { glyph: "🤔", label: "Есть вопрос", count: 2 },
  { glyph: "🚀", label: "Берём в работу" },
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
 * Выбор реакции: у каждого знака есть имя, счётчик показывает итог.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover014({
  label = "Реакция",
  title = "Как отметить",
  reactions = DEFAULT_REACTIONS,
  defaultValue = "",
  chosenTemplate = "Ваша реакция: {label}",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover014Props) {
  const id = useId().replace(/:/g, "")
  const [chosen, setChosen] = useState(defaultValue)

  const current = reactions.find((reaction) => reaction.label === chosen)

  const palette = {
    ...(accent ? { "--vibeui-popover-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-014"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          data-chosen={current ? true : undefined}
          popoverTarget={`${id}-panel`}
        >
          {current ? (
            <>
              <span aria-hidden="true">{current.glyph}</span>
              {current.label}
            </>
          ) : (
            label
          )}
        </button>

        <div id={`${id}-panel`} popover="auto" aria-label={title}>
          <div data-part="row">
            {reactions.map((reaction) => {
              const picked = reaction.label === chosen

              return (
                <button
                  key={reaction.label}
                  type="button"
                  data-part="pick"
                  aria-pressed={picked}
                  // Имя реакции идёт и скринридеру, и в подсказку: один и тот
                  // же знак в разных системах читается по-разному.
                  aria-label={reaction.label}
                  title={reaction.label}
                  // Повторное нажатие снимает свою реакцию: поставить и
                  // убрать должно стоить одинаково.
                  onClick={() => setChosen(picked ? "" : reaction.label)}
                >
                  <span aria-hidden="true">{reaction.glyph}</span>
                  {/* Счётчик рядом со знаком: он и превращает набор картинок
                      в понятный итог. */}
                  {reaction.count !== undefined ? (
                    <span data-part="count" aria-hidden="true">
                      {reaction.count}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <span data-part="sr" aria-live="polite">
          {current ? chosenTemplate.replace("{label}", current.label) : ""}
        </span>
      </div>
    </>
  )
}
