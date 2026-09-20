"use client"

import { useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"

export type Navmenu005Entry = {
  label: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  hint?: string
  shotTitle?: string
  shotText?: string
  href?: string
}

export type Navmenu005Props = {
  entries?: Navmenu005Entry[]
  /**
   * Показать панель развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  triggerLabel?: string
  /** Обычные ссылки полосы рядом с кнопкой. */
  barLinks?: string[]
  /** Подпись навигации для скринридера. */
  label?: string
  /** Подпись текущего раздела: он помечается aria-current. */
  current?: string
  /** Подложка полосы и панели. Пусто — своя палитра компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: меню, у которого справа живёт превью. Наведение или фокус на
// строке показывает свою картинку — и всё это на :has(), без состояния и без JS.
// Картинки нарисованы градиентами по оттенку из подписи: меню остаётся одним
// файлом, не тянет за собой ассеты и не ждёт загрузки изображений.
const STYLES = `
:where([data-vibeui-block="navmenu-005"]){
--vibeui-navmenu-005-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-navmenu-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-navmenu-005-muted:color-mix(in oklab,var(--vibeui-navmenu-005-fg) 68%,transparent);
--vibeui-navmenu-005-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-navmenu-005-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-navmenu-005-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-navmenu-005-sheen:light-dark(oklch(1 0 0 / 70%),oklch(1 0 0 / 12%));
--vibeui-navmenu-005-shot-fg:light-dark(oklch(0.24 0 265),oklch(0.22 0 265));
--vibeui-navmenu-005-shot-text:light-dark(oklch(0.45 0 265),oklch(0.4 0 265));
--vibeui-navmenu-005-shadow:light-dark(oklch(0.2 0 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-navmenu-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navmenu-005"]{color-scheme:dark}
[data-vibeui-block="navmenu-005"]{
box-sizing:border-box;width:100%;max-width:40rem;
font-family:var(--vibeui-navmenu-005-font);color:var(--vibeui-navmenu-005-fg);
}
[data-vibeui-block="navmenu-005"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-005-bg);
border:1px solid var(--vibeui-navmenu-005-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-005-bar;
}
[data-vibeui-block="navmenu-005"] [data-part="trigger"],
[data-vibeui-block="navmenu-005"] [data-part="plain"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;height:2rem;padding:0 0.75rem;
border-radius:0.5rem;font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="navmenu-005"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-005"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-005-hover)}
[data-vibeui-block="navmenu-005"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-005"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-005-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-005"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(36rem,92vw);padding:0.625rem;box-sizing:border-box;
gap:0.625rem;
background:var(--vibeui-navmenu-005-bg);color:var(--vibeui-navmenu-005-fg);
border:1px solid var(--vibeui-navmenu-005-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-005-font);
box-shadow:0 24px 48px -24px var(--vibeui-navmenu-005-shadow);
}
/* Раскладка только для открытой панели: display на элементе с popover
   перебивает display:none из стилей браузера, и панель видна всегда. */
[data-vibeui-block="navmenu-005"] [data-part="panel"]:popover-open{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);}
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-005"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-005-bar;
position-area:bottom span-right;margin-top:0.5rem;
position-try-fallbacks:flip-block;
}
}
[data-vibeui-block="navmenu-005"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.125rem;align-content:start}
[data-vibeui-block="navmenu-005"] [data-part="link"]{
display:block;padding:0.5rem;border-radius:0.5rem;text-decoration:none;color:inherit;
}
[data-vibeui-block="navmenu-005"] [data-part="link"]:hover{background:var(--vibeui-navmenu-005-hover)}
[data-vibeui-block="navmenu-005"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-005-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-005"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:550}
[data-vibeui-block="navmenu-005"] [data-part="hint"]{display:block;margin-top:0.0625rem;font-size:0.75rem;color:var(--vibeui-navmenu-005-muted)}
[data-vibeui-block="navmenu-005"] [data-part="stage"]{position:relative;min-height:11rem;border-radius:0.75rem;overflow:hidden}
/* Превью лежат стопкой: показывается то, чья строка под курсором или в фокусе. */
[data-vibeui-block="navmenu-005"] [data-part="shot"]{
position:absolute;inset:0;opacity:0;
display:flex;flex-direction:column;justify-content:flex-end;gap:0.25rem;
padding:0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-navmenu-005-border);border-radius:0.75rem;
color:var(--vibeui-navmenu-005-shot-fg);
transition:opacity .18s ease;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="navmenu-005"] [data-part="shot"][data-empty="true"]{background:
radial-gradient(120% 80% at 20% 15%,var(--vibeui-navmenu-005-sheen),transparent 62%),
linear-gradient(150deg,oklch(0.92 0.08 var(--vibeui-navmenu-005-hue)),oklch(0.86 0.11 calc(var(--vibeui-navmenu-005-hue) + 40)));}
[data-vibeui-block="navmenu-005"] [data-part="shot"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="navmenu-005"] [data-part="shot-title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="navmenu-005"] [data-part="shot-text"]{margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-navmenu-005-shot-text)}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:not(:has([data-part="link"]:hover)):not(:has([data-part="link"]:focus-visible)) [data-part="shot"][data-index="0"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="0"]:hover) [data-part="shot"][data-index="0"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="0"]:focus-visible) [data-part="shot"][data-index="0"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="1"]:hover) [data-part="shot"][data-index="1"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="1"]:focus-visible) [data-part="shot"][data-index="1"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="2"]:hover) [data-part="shot"][data-index="2"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="2"]:focus-visible) [data-part="shot"][data-index="2"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="3"]:hover) [data-part="shot"][data-index="3"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="3"]:focus-visible) [data-part="shot"][data-index="3"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="4"]:hover) [data-part="shot"][data-index="4"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="4"]:focus-visible) [data-part="shot"][data-index="4"]{opacity:1}
/* Текущий раздел: подчёркивание и вес, а не один только цвет. */
[data-vibeui-block="navmenu-005"] [aria-current="page"]{
font-weight:700;
text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:0.3125rem;
text-decoration-color:var(--vibeui-navmenu-005-accent);
}
/* Развёрнутый режим: панель стоит в потоке под полосой, а не в верхнем слое.
   Показывает состояние по умолчанию — то же первое превью, что видно без
   наведения, потому что правило :not(:has(...)) выше не зависит от popover. */
[data-vibeui-block="navmenu-005"] [data-part="panel"][data-open="true"]{
width:100%;
position:static;inset:auto;margin-top:0.5rem;
display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Navmenu005Entry[] = [
  {
    label: "Редактор",
    hint: "Блоки, сетка, типографика",
    shotTitle: "Холст и блоки",
    shotText: "Страница собирается перетаскиванием, без вёрстки руками.",
  },
  {
    label: "Аналитика",
    hint: "Источники и воронки",
    shotTitle: "Отчёт за неделю",
    shotText: "Видно, откуда приходят и где отваливаются.",
  },
  {
    label: "Формы",
    hint: "Заявки и уведомления",
    shotTitle: "Заявки",
    shotText: "Каждое обращение уходит в почту и в таблицу.",
  },
  {
    label: "Домены",
    hint: "Адреса и сертификаты",
    shotTitle: "Свой адрес",
    shotText: "Сертификат выпускается и продлевается сам.",
  },
]

/**
 * Оттенок картинки берётся из подписи: превью узнаётся по цвету и не требует
 * ни одного файла изображения.
 */
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Меню с превью: наведение на ссылку показывает свою картинку справа.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu005({
  entries = DEFAULT_ENTRIES,
  open = false,
  triggerLabel = "Возможности",
  barLinks = ["Цены", "Блог"],
  label = "Основная навигация",
  current = "Цены",
  background = "",
  accent,
  className,
  style,
}: Navmenu005Props) {
  const [active, setActive] = useState(current)

  // Демо-данные ведут в "#": без этого клик по пункту прокручивает страницу
  // вверх и меняет адрес, а меню остаётся прежним. Ссылка с настоящим href
  // из данных проходит дальше и работает как обычная.
  const onNavigate = (event: ReactMouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest("a")

    if (!link || !link.getAttribute("href")?.startsWith("#")) {
      return
    }

    event.preventDefault()

    // Панель может быть и в верхнем слое, и развёрнутой в потоке витрины:
    // ссылка внутри неё — это переход, а не смена активного раздела.
    const panel = link.closest<HTMLElement>(
      '[popover],[data-part="panel"],[data-part="menu"],[data-part="sheet"],[data-part="sub"]',
    )
    const label = link.textContent?.trim()

    if (panel) {
      if (panel.matches(":popover-open")) {
        panel.hidePopover()
      }

      return
    }

    if (label) {
      setActive(label)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-navmenu-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const shown = entries.slice(0, 5)

  return (
    <>
      <style href="vibeui-navmenu-005" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="navigation-menu"
        data-vibeui-block="navmenu-005"
        onClick={onNavigate}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="true"
            popoverTarget="vibeui-navmenu-005-panel"
          >
            {triggerLabel}
          </button>
          {barLinks.map((entry) => (
            <a
              key={entry}
              data-part="plain"
              href="#"
              aria-current={entry === active ? "page" : undefined}
            >
              {entry}
            </a>
          ))}
        </div>
        <div
          id="vibeui-navmenu-005-panel"
          data-part="panel"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          aria-label={triggerLabel}
        >
          <ul data-part="list">
            {shown.map((entry, index) => (
              <li key={entry.label}>
                <a data-part="link" data-index={index} href={entry.href ?? "#"}>
                  <span data-part="name">{entry.label}</span>
                  {entry.hint ? (
                    <span data-part="hint">{entry.hint}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          <div data-part="stage" aria-hidden="true">
            {shown.map((entry, index) => (
              <div
                key={entry.label}
                data-part="shot"
                data-empty={entry.image ? undefined : "true"}
                data-index={index}
                style={
                  {
                    "--vibeui-navmenu-005-hue": `${hue(entry.label)}`,
                  } as CSSProperties
                }
              >
                {entry.image ? (
                  <img
                    src={entry.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <p data-part="shot-title">{entry.shotTitle ?? entry.label}</p>
                <p data-part="shot-text">{entry.shotText ?? entry.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
