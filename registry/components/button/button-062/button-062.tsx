"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button062Props = Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> & {
  label?: string
  /** Подпись во время генерации: она же объясняет, что нажатие остановит. */
  runningLabel?: string
  /** Строка под кнопкой: модель, лимит, что именно генерируется. */
  hint?: string
  /** Начальное состояние: витрине и скриншотам нужна работающая генерация. */
  defaultRunning?: boolean
  onGenerate?: () => void
  onStop?: () => void
  accent?: string
  /** Поверхность страницы под кнопкой. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: одна кнопка на весь цикл генерации. В покое это призыв
// «Сгенерировать», во время работы — та же кнопка, но с бегущей полосой и
// подписью «Остановить»: пользователю не нужно искать вторую кнопку, когда
// ответ пошёл не туда. Отдельная кнопка остановки рядом с работающей —
// главная ошибка ИИ-интерфейсов: она занимает место и путает.
//
// Компонент ничего не генерирует: он держит только вид состояния и зовёт
// onGenerate/onStop. Поток токенов, отмена запроса и ошибки — забота хоста.
const STYLES = `
:where([data-vibeui-block="button-062"]){
--vibeui-button-062-bg:transparent;
--vibeui-button-062-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-062-on-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-062-muted:color-mix(in oklab,var(--vibeui-button-062-fg) 62%,transparent);
--vibeui-button-062-border:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 16%));
--vibeui-button-062-accent:light-dark(oklch(0.58 0.19 39.8),oklch(0.76 0.15 39.8));
--vibeui-button-062-radius:0.75rem;
--vibeui-button-062-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-062"]{color-scheme:dark}
[data-vibeui-block="button-062"]{
display:inline-flex;flex-direction:column;align-items:flex-start;gap:0.375rem;
box-sizing:border-box;background:var(--vibeui-button-062-bg);
font-family:var(--vibeui-button-062-font);color:var(--vibeui-button-062-fg);
}
[data-vibeui-block="button-062"] *{box-sizing:border-box}
[data-vibeui-block="button-062"] [data-part="action"]{
position:relative;overflow:hidden;
appearance:none;border:1px solid transparent;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.5rem;padding:0.375rem 1rem;border-radius:var(--vibeui-button-062-radius);
background:var(--vibeui-button-062-fg);color:var(--vibeui-button-062-on-fg);
font:inherit;font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;line-height:1;
transition:filter .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-062"] [data-part="action"]:hover{
filter:light-dark(brightness(1.45),brightness(0.9));
}
[data-vibeui-block="button-062"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-button-062-accent);outline-offset:2px;
}
/* Во время работы кнопка становится контурной: заливка ушла бы в спор с
   бегущей полосой, а остановка не должна выглядеть как главное действие. */
[data-vibeui-block="button-062"][data-running="true"] [data-part="action"]{
background:transparent;color:var(--vibeui-button-062-fg);
border-color:var(--vibeui-button-062-border);
}
/* Звезда генерации нарисована путём: иконочный шрифт ради одного знака
   тянуть незачем. */
[data-vibeui-block="button-062"] [data-part="spark"]{
width:1rem;height:1rem;flex:none;fill:currentColor;
}
[data-vibeui-block="button-062"][data-running="true"] [data-part="spark"]{display:none}
[data-vibeui-block="button-062"] [data-part="stop"]{
width:0.75rem;height:0.75rem;flex:none;display:none;
border-radius:0.1875rem;background:currentColor;
}
[data-vibeui-block="button-062"][data-running="true"] [data-part="stop"]{display:block}
/* Полоса под подписью: она и есть признак работы. Ширина бежит по кнопке,
   поэтому не нужен ни спиннер, ни проценты — их всё равно неоткуда взять. */
[data-vibeui-block="button-062"] [data-part="stream"]{
position:absolute;left:0;bottom:0;height:2px;width:35%;
background:var(--vibeui-button-062-accent);
opacity:0;translate:-100% 0;
}
[data-vibeui-block="button-062"][data-running="true"] [data-part="stream"]{
opacity:1;animation:vibeui-button-062-run 1.1s linear infinite;
}
@keyframes vibeui-button-062-run{
from{translate:-100% 0}
to{translate:300% 0}
}
[data-vibeui-block="button-062"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.35;color:var(--vibeui-button-062-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-062"] *{animation:none!important;transition:none!important}
/* Без анимации признаком работы остаётся сама полоса. */
[data-vibeui-block="button-062"][data-running="true"] [data-part="stream"]{width:100%;translate:0 0}
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Кнопка ИИ-генерации: в покое запускает, во время работы останавливает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button062({
  label = "Сгенерировать",
  runningLabel = "Остановить",
  hint = "Ответ появится в редакторе, обычно за 5–10 секунд",
  defaultRunning = false,
  onGenerate,
  onStop,
  accent,
  background = "",
  className,
  style,
  type = "button",
  ...props
}: Button062Props) {
  const [running, setRunning] = useState(defaultRunning)
  // Кнопка одна на два действия, поэтому подпись меняется под курсором.
  // Ширину держит самый длинный вариант: без этого соседи прыгают.
  const widest = useRef<HTMLSpanElement>(null)
  const [reserve, setReserve] = useState<number>()

  useEffect(() => {
    const node = widest.current

    if (node) {
      setReserve((current) => {
        const width = Math.ceil(node.getBoundingClientRect().width)
        return current && current >= width ? current : width
      })
    }
  }, [label, runningLabel])

  const palette = {
    ...(accent ? { "--vibeui-button-062-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-062-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-062" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="button"
        data-vibeui-block="button-062"
        data-running={running}
        className={className}
        style={palette}
      >
        <button
          {...props}
          type={type}
          data-part="action"
          aria-live="polite"
          onClick={() => {
            const next = !running

            setRunning(next)

            if (next) {
              onGenerate?.()
            } else {
              onStop?.()
            }
          }}
        >
          <svg data-part="spark" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5 13.9 9l6.6 2-6.6 2-1.9 6.5L10.1 13 3.5 11l6.6-2z" />
          </svg>
          <span data-part="stop" aria-hidden="true" />
          <span style={reserve ? { minWidth: reserve } : undefined}>
            {running ? runningLabel : label}
          </span>
          <span data-part="stream" aria-hidden="true" />
        </button>

        {/* Скрытая копия длинной подписи: по ней считается запас ширины. */}
        <span
          ref={widest}
          aria-hidden="true"
          style={{
            position: "absolute",
            visibility: "hidden",
            whiteSpace: "nowrap",
            fontSize: "0.875rem",
            fontWeight: 650,
          }}
        >
          {label.length >= runningLabel.length ? label : runningLabel}
        </span>

        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
