"use client"

import { useCallback, useEffect, useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollarea006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  /** Индекс активного элемента: к нему область встаёт при первом показе. */
  activeIndex?: number
  height?: string
}

// Идея компонента: при первом показе область сама встаёт на активный элемент.
// Позиция считается руками — scrollTop от offsetTop, — а не через
// scrollIntoView: тот прокручивает и всех предков, и страница уезжает вместе
// с областью. Кнопка «К текущему» возвращает вид на место после ручной
// прокрутки, поэтому активный элемент не теряется в длинном списке.
const STYLES = `
:where([data-vibeui-block="scrollarea-006"]){
--vibeui-scrollarea-006-bg:oklch(1 0 0);
--vibeui-scrollarea-006-fg:oklch(0.24 0.014 265);
--vibeui-scrollarea-006-muted:oklch(0.55 0.014 265);
--vibeui-scrollarea-006-border:oklch(0.9 0.006 265);
--vibeui-scrollarea-006-accent:oklch(0.55 0.19 265);
--vibeui-scrollarea-006-soft:oklch(0.95 0.03 265);
--vibeui-scrollarea-006-height:12rem;
--vibeui-scrollarea-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="scrollarea-006"] button:hover{background:oklch(0.97 0.003 265)}
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
 * Область, которая при показе сама встаёт на активный элемент.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea006({
  title = "Разделы урока",
  items = DEFAULT_ITEMS,
  activeIndex = 5,
  height = "12rem",
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollarea-006"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <button type="button" onClick={() => reveal(true)}>
            К текущему
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
