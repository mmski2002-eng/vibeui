"use client"

import { useCallback, useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Scrollarea006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  /** Индекс активного элемента: к нему область встаёт при первом показе. */
  activeIndex?: number
  height?: string
  /** Подпись кнопки возврата к активному элементу. */
  revealLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: при первом показе область сама встаёт на активный элемент.
// Позиция считается руками — scrollTop от offsetTop, — а не через
// scrollIntoView: тот прокручивает и всех предков, и страница уезжает вместе
// с областью. Кнопка «К текущему» возвращает вид на место после ручной
// прокрутки, поэтому активный элемент не теряется в длинном списке.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="scrollarea-006"]){
--vibeui-scrollarea-006-bg:transparent;
--vibeui-scrollarea-006-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-scrollarea-006-muted:color-mix(in oklab,var(--vibeui-scrollarea-006-fg) 68%,transparent);
--vibeui-scrollarea-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.33 0.012 265));
--vibeui-scrollarea-006-accent:light-dark(oklch(0.55 0.19 265),oklch(0.74 0.16 265));
--vibeui-scrollarea-006-soft:light-dark(oklch(0.95 0.03 265),oklch(0.29 0.05 265));
--vibeui-scrollarea-006-hover:light-dark(oklch(0.97 0.003 265),oklch(0.28 0.011 265));
--vibeui-scrollarea-006-height:12rem;
--vibeui-scrollarea-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollarea-006"]{color-scheme:dark}
[data-vibeui-block="scrollarea-006"]{
display:flex;flex-direction:column;
width:100%;max-width:21rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-006-bg);
border:1px solid var(--vibeui-scrollarea-006-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-006-font);color:var(--vibeui-scrollarea-006-fg);
}
[data-vibeui-block="scrollarea-006"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem 0.5rem 0.5rem 0.875rem;
border-bottom:1px solid var(--vibeui-scrollarea-006-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="scrollarea-006"] button{
appearance:none;cursor:pointer;
padding:0.25rem 0.5rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-scrollarea-006-border);
background:var(--vibeui-scrollarea-006-bg);color:var(--vibeui-scrollarea-006-fg);
font:inherit;font-size:0.6875rem;font-weight:600;
transition:background-color .14s ease;
}
[data-vibeui-block="scrollarea-006"] button:hover{background:var(--vibeui-scrollarea-006-hover)}
[data-vibeui-block="scrollarea-006"] button:focus-visible{
outline:2px solid var(--vibeui-scrollarea-006-accent);outline-offset:2px;
}
[data-vibeui-block="scrollarea-006"] [data-part="area"]{
height:var(--vibeui-scrollarea-006-height);
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;
scroll-behavior:smooth;
}
[data-vibeui-block="scrollarea-006"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-006-accent);outline-offset:-2px;
}
[data-vibeui-block="scrollarea-006"] ul{margin:0;padding:0.25rem;list-style:none}
[data-vibeui-block="scrollarea-006"] li{
display:flex;align-items:center;gap:0.5rem;
min-height:2.125rem;padding:0 0.625rem;border-radius:0.5rem;
font-size:0.8125rem;
}
/* Активная строка помечена не только цветом: слева стоит толстая отметка. */
[data-vibeui-block="scrollarea-006"] li[data-active="true"]{
background:var(--vibeui-scrollarea-006-soft);font-weight:650;
box-shadow:inset 0.1875rem 0 0 var(--vibeui-scrollarea-006-accent);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="scrollarea-006"] [data-part="area"]{scroll-behavior:auto}
}
`

const DEFAULT_ITEMS = [
  "00:00 Введение",
  "02:14 Установка",
  "05:40 Первый компонент",
  "09:02 Токены темы",
  "13:35 Копирование для ИИ",
  "18:10 Собственный реестр",
  "23:48 Сборка",
  "27:05 Выкладка",
  "31:22 Частые ошибки",
  "36:00 Итоги",
]

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
 * Область, которая при показе сама встаёт на активный элемент.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea006({
  title = "Разделы урока",
  items = DEFAULT_ITEMS,
  activeIndex = 5,
  height = "12rem",
  revealLabel = "К текущему",
  background = "",
  className,
  style,
  ...props
}: Scrollarea006Props) {
  const areaRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLLIElement>(null)

  // Прокручиваем только область: scrollIntoView увёл бы за собой и страницу.
  const reveal = useCallback((smooth: boolean) => {
    const area = areaRef.current
    const active = activeRef.current

    if (!area || !active) {
      return
    }

    const top = active.offsetTop - (area.clientHeight - active.offsetHeight) / 2

    area.scrollTo({
      top: Math.max(0, top),
      behavior: smooth ? "smooth" : "auto",
    })
  }, [])

  useEffect(() => {
    reveal(false)
  }, [reveal])

  const index = Math.min(Math.max(0, activeIndex), items.length - 1)
  const palette = {
    "--vibeui-scrollarea-006-height": height,
    ...(background
      ? {
          "--vibeui-scrollarea-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scroll-area"
        data-vibeui-block="scrollarea-006"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <button type="button" onClick={() => reveal(true)}>
            {revealLabel}
          </button>
        </div>
        <div
          data-part="area"
          ref={areaRef}
          tabIndex={0}
          role="region"
          aria-label={title}
        >
          <ul>
            {items.map((item, position) => (
              <li
                key={item}
                ref={position === index ? activeRef : undefined}
                data-active={position === index || undefined}
                aria-current={position === index ? "true" : undefined}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
