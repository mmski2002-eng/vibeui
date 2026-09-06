"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Tabs013Tab = {
  id: string
  label: string
  /** Что показать, когда панель загрузилась. */
  text: string
  /** Сколько миллисекунд «грузить» эту панель. */
  delay?: number
  /** Эта панель заканчивается ошибкой: показ обработки отказа. */
  fails?: boolean
}

export type Tabs013Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  tabs?: Tabs013Tab[]
  currentId?: string
  groupLabel?: string
  loadingText?: string
  errorText?: string
  retryLabel?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: панель вкладки приходит с сервера, и между нажатием и
// содержимым есть пауза. Пустая панель в этой паузе читается как «здесь
// ничего нет», поэтому на её месте стоит скелетон той же формы, что и будущий
// текст: раскладка не прыгает, когда данные приезжают. Отказ — не пустота и
// не бесконечное ожидание: он назван словом и снабжён кнопкой повтора,
// потому что чаще всего достаточно попробовать ещё раз. Полоса вкладок в это
// время не блокируется: уйти с медленной вкладки должно быть можно всегда.
const STYLES = `
:where([data-vibeui-block="tabs-013"]){
--vibeui-tabs-013-bg:transparent;
--vibeui-tabs-013-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-tabs-013-muted:color-mix(in oklab,var(--vibeui-tabs-013-fg) 60%,transparent);
--vibeui-tabs-013-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-tabs-013-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-tabs-013-bone:light-dark(oklch(0 0 0 / 8%),oklch(1 0 0 / 10%));
--vibeui-tabs-013-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-tabs-013-error:light-dark(oklch(0.53 0.19 25),oklch(0.79 0.15 25));
--vibeui-tabs-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-013"]{color-scheme:dark}
[data-vibeui-block="tabs-013"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;box-sizing:border-box;
font-family:var(--vibeui-tabs-013-font);color:var(--vibeui-tabs-013-fg);
}
[data-vibeui-block="tabs-013"] *{box-sizing:border-box}
[data-vibeui-block="tabs-013"] [data-part="strip"]{
display:flex;flex-wrap:wrap;gap:0.25rem;
border-bottom:1px solid var(--vibeui-tabs-013-border);
}
[data-vibeui-block="tabs-013"] [data-part="tab"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.4375rem 0.75rem;margin-bottom:-1px;
border-bottom:2px solid transparent;background:transparent;
color:var(--vibeui-tabs-013-muted);
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="tabs-013"] [data-part="tab"]:hover{background:var(--vibeui-tabs-013-hover);color:var(--vibeui-tabs-013-fg)}
[data-vibeui-block="tabs-013"] [data-part="tab"][aria-selected="true"]{
color:var(--vibeui-tabs-013-fg);border-bottom-color:var(--vibeui-tabs-013-accent);
}
[data-vibeui-block="tabs-013"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-013-accent);outline-offset:-2px;border-radius:0.375rem}
/* Точка ожидания в самой вкладке: пока панель грузится, это видно на полосе,
   даже если человек уже ушёл смотреть соседнюю. */
[data-vibeui-block="tabs-013"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:50%;flex:none;
background:var(--vibeui-tabs-013-accent);
animation:vibeui-tabs-013-pulse 1s ease-in-out infinite;
}
[data-vibeui-block="tabs-013"] [data-part="dot"][data-error="true"]{
background:var(--vibeui-tabs-013-error);animation:none;
}
@keyframes vibeui-tabs-013-pulse{0%,100%{opacity:.35}50%{opacity:1}}
[data-vibeui-block="tabs-013"] [data-part="panel"]{
min-height:4.5rem;font-size:0.875rem;line-height:1.5;
}
/* Скелетон повторяет форму будущего текста: иначе раскладка прыгает в тот
   момент, когда данные наконец приезжают. */
[data-vibeui-block="tabs-013"] [data-part="bones"]{
display:flex;flex-direction:column;gap:0.4375rem;padding-top:0.1875rem;
}
[data-vibeui-block="tabs-013"] [data-part="bone"]{
height:0.6875rem;border-radius:999px;background:var(--vibeui-tabs-013-bone);
}
[data-vibeui-block="tabs-013"] [data-part="bone"]:nth-child(2){width:92%}
[data-vibeui-block="tabs-013"] [data-part="bone"]:nth-child(3){width:64%}
[data-vibeui-block="tabs-013"] [data-part="fail"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
margin:0;color:var(--vibeui-tabs-013-error);font-size:0.875rem;
}
[data-vibeui-block="tabs-013"] [data-part="retry"]{
appearance:none;cursor:pointer;
min-height:1.875rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
border:1px solid currentColor;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="tabs-013"] [data-part="retry"]:focus-visible{outline:2px solid var(--vibeui-tabs-013-accent);outline-offset:2px}
[data-vibeui-block="tabs-013"] [data-part="text"]{margin:0}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tabs-013"] [data-part="dot"]{animation:none;opacity:1}
[data-vibeui-block="tabs-013"] *{transition:none!important}
}
`

const DEFAULT_TABS: Tabs013Tab[] = [
  {
    id: "summary",
    label: "Сводка",
    text: "За сутки 1 284 визита, средняя длительность сеанса — 2 минуты 40 секунд.",
    delay: 700,
  },
  {
    id: "logs",
    label: "Журнал",
    text: "За час 42 записи: 39 обычных, две с предупреждением, одна с ошибкой сборки.",
    delay: 1400,
  },
  {
    id: "billing",
    label: "Счета",
    text: "",
    delay: 900,
    fails: true,
  },
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

type State = "loading" | "ready" | "error"

/**
 * Вкладки с загрузкой панели: скелетон вместо пустоты, отказ с повтором.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs013({
  tabs = DEFAULT_TABS,
  currentId = "summary",
  groupLabel = "Разделы отчёта",
  loadingText = "Загружаем раздел…",
  errorText = "Раздел не загрузился",
  retryLabel = "Попробовать снова",
  accent,
  background = "",
  className,
  style,
  ...props
}: Tabs013Props) {
  const [current, setCurrent] = useState(currentId)
  const [states, setStates] = useState<Record<string, State>>({})
  const [attempt, setAttempt] = useState(0)

  const open = tabs.find((tab) => tab.id === current) ?? tabs[0]
  const state = states[open.id] ?? "loading"

  useEffect(() => {
    if (state !== "loading") {
      return
    }

    const wait = window.setTimeout(() => {
      setStates((current) => ({
        ...current,
        [open.id]: open.fails ? "error" : "ready",
      }))
    }, open.delay ?? 800)

    return () => window.clearTimeout(wait)
    // attempt участвует нарочно: повтор должен запускать загрузку заново.
  }, [open.id, open.fails, open.delay, state, attempt])

  const retry = () => {
    setStates((current) => {
      const next = { ...current }
      delete next[open.id]
      return next
    })
    setAttempt((value) => value + 1)
  }

  const palette = {
    ...(accent ? { "--vibeui-tabs-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tabs-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-013"
        className={className}
        style={palette}
      >
        <div data-part="strip" role="tablist" aria-label={groupLabel}>
          {tabs.map((tab) => {
            const selected = tab.id === current
            const own = states[tab.id]

            return (
              <button
                key={tab.id}
                type="button"
                data-part="tab"
                role="tab"
                aria-selected={selected}
                aria-controls={`vibeui-tabs-013-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                // Полоса не блокируется на время загрузки: уйти с медленной
                // вкладки должно быть можно всегда.
                onClick={() => setCurrent(tab.id)}
              >
                {tab.label}
                {own === undefined && selected ? (
                  <span data-part="dot" aria-hidden="true" />
                ) : null}
                {own === "error" ? (
                  <span data-part="dot" data-error="true" aria-hidden="true" />
                ) : null}
              </button>
            )
          })}
        </div>

        <div
          id={`vibeui-tabs-013-${open.id}`}
          data-part="panel"
          role="tabpanel"
          tabIndex={0}
          aria-busy={state === "loading"}
          aria-label={state === "loading" ? loadingText : undefined}
        >
          {state === "loading" ? (
            // Скелетон молчит для скринридера: об ожидании говорит
            // aria-busy на самой панели, а подпись повторяла бы его.
            <div data-part="bones" aria-hidden="true">
              <span data-part="bone" />
              <span data-part="bone" />
              <span data-part="bone" />
            </div>
          ) : state === "error" ? (
            <p data-part="fail" role="alert">
              {errorText}
              <button type="button" data-part="retry" onClick={retry}>
                {retryLabel}
              </button>
            </p>
          ) : (
            <p data-part="text">{open.text}</p>
          )}
        </div>
      </div>
    </>
  )
}
