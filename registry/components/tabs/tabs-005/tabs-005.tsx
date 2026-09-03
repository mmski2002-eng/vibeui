"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs005Item = {
  id: string
  label: string
  hint?: string
  content?: ReactNode
}

export type Tabs005Props = {
  items?: Tabs005Item[]
  defaultId?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись списка вкладок для скринридера. */
  listLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вертикальные вкладки для настроек. Список слева читается
// сверху вниз, поэтому длинные подписи и пояснения помещаются целиком — в
// горизонтальном ряду они бы не влезли. Ориентация объявлена через
// aria-orientation, и стрелки соответственно вертикальные: вверх и вниз.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее фона, а подсветка строки — светлая полупрозрачная.
const STYLES = `
:where([data-vibeui-block="tabs-005"]){
--vibeui-tabs-005-bg:transparent;
--vibeui-tabs-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-tabs-005-muted:color-mix(in oklab,var(--vibeui-tabs-005-fg) 68%,transparent);
--vibeui-tabs-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-tabs-005-hover:light-dark(oklch(0.55 0.02 265 / 7%),oklch(0.85 0.02 265 / 12%));
--vibeui-tabs-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-tabs-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-005"]{color-scheme:dark}
[data-vibeui-block="tabs-005"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,20rem);max-width:32rem;
background:var(--vibeui-tabs-005-bg);color:var(--vibeui-tabs-005-fg);
border:1px solid var(--vibeui-tabs-005-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-005-font);overflow:hidden;
}
[data-vibeui-block="tabs-005"] [data-part="shell"]{display:grid;grid-template-columns:1fr}
/* Две колонки появляются только когда блоку хватает ширины на обе. */
@container (min-width: 26rem){
[data-vibeui-block="tabs-005"] [data-part="shell"]{grid-template-columns:12rem 1fr}
[data-vibeui-block="tabs-005"] [data-part="list"]{border-right:1px solid var(--vibeui-tabs-005-border);border-bottom:0}
}
[data-vibeui-block="tabs-005"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.125rem;padding:0.375rem;
border-bottom:1px solid var(--vibeui-tabs-005-border);
}
[data-vibeui-block="tabs-005"] [data-part="tab"]{
position:relative;appearance:none;border:0;background:none;cursor:pointer;
display:block;width:100%;padding:0.5rem 0.625rem;box-sizing:border-box;
border-radius:0.5rem;text-align:left;font:inherit;color:var(--vibeui-tabs-005-muted);
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="tabs-005"] [data-part="tab"]:hover{background:var(--vibeui-tabs-005-hover);color:var(--vibeui-tabs-005-fg)}
[data-vibeui-block="tabs-005"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-005-accent);outline-offset:-2px}
[data-vibeui-block="tabs-005"] [data-part="tab"][aria-selected="true"]{background:var(--vibeui-tabs-005-hover);color:var(--vibeui-tabs-005-fg)}
/* Полоса у края активной вкладки: заливки мало, когда рядом наведение. */
[data-vibeui-block="tabs-005"] [data-part="tab"][aria-selected="true"]::before{
content:"";position:absolute;left:0;top:0.375rem;bottom:0.375rem;width:2px;
border-radius:0 2px 2px 0;background:var(--vibeui-tabs-005-accent);
}
[data-vibeui-block="tabs-005"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:550}
[data-vibeui-block="tabs-005"] [data-part="hint"]{display:block;margin-top:0.0625rem;font-size:0.75rem;color:var(--vibeui-tabs-005-muted)}
[data-vibeui-block="tabs-005"] [data-part="panel"]{
padding:1rem;font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-005-muted);
}
[data-vibeui-block="tabs-005"] [data-part="panel"] h3{margin:0 0 0.375rem;font-size:0.9375rem;color:var(--vibeui-tabs-005-fg)}
[data-vibeui-block="tabs-005"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-005-accent);outline-offset:-3px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs005Item[] = [
  {
    id: "profile",
    label: "Профиль",
    hint: "Имя и аватар",
    content: (
      <>
        <h3>Профиль</h3>
        Имя видно всем участникам рабочей области. Аватар подставляется из
        почты, если не загрузить свой.
      </>
    ),
  },
  {
    id: "security",
    label: "Безопасность",
    hint: "Пароль и вход",
    content: (
      <>
        <h3>Безопасность</h3>
        Двухфакторный вход, активные сессии и список устройств, с которых
        заходили за последний месяц.
      </>
    ),
  },
  {
    id: "alerts",
    label: "Уведомления",
    hint: "Почта и браузер",
    content: (
      <>
        <h3>Уведомления</h3>
        Что присылать письмом, а что показывать в браузере. Отдельно — сводка
        раз в неделю.
      </>
    ),
  },
  {
    id: "billing",
    label: "Оплата",
    hint: "Тариф и счета",
    content: (
      <>
        <h3>Оплата</h3>
        Текущий тариф, дата следующего списания и архив счетов за прошлые
        периоды.
      </>
    ),
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

/**
 * Вертикальные вкладки настроек: список слева, содержимое справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs005({
  items = DEFAULT_ITEMS,
  defaultId,
  background = "",
  accent,
  listLabel = "Настройки",
  className,
  style,
  ...props
}: Tabs005Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const index = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  )

  // Ориентация вертикальная, поэтому стрелки тоже вертикальные: горизонтальные
  // в таком списке ничего не значат и должны остаться браузеру.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowUp", "ArrowDown", "Home", "End"]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    const last = items.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowUp"
            ? (index - 1 + items.length) % items.length
            : (index + 1) % items.length

    setActive(items[next].id)
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = items[index]

  return (
    <>
      <style href="vibeui-tabs-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="list"
            role="tablist"
            aria-orientation="vertical"
            aria-label={listLabel}
            ref={listRef}
            onKeyDown={onKeyDown}
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                data-part="tab"
                role="tab"
                id={`vibeui-tabs-005-${item.id}-tab`}
                aria-selected={item.id === active}
                aria-controls={`vibeui-tabs-005-${item.id}-panel`}
                tabIndex={item.id === active ? 0 : -1}
                onClick={() => setActive(item.id)}
              >
                <span data-part="name">{item.label}</span>
                {item.hint ? <span data-part="hint">{item.hint}</span> : null}
              </button>
            ))}
          </div>
          {current ? (
            <div
              data-part="panel"
              role="tabpanel"
              id={`vibeui-tabs-005-${current.id}-panel`}
              aria-labelledby={`vibeui-tabs-005-${current.id}-tab`}
              tabIndex={0}
            >
              {current.content}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
