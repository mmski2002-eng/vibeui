import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb013Sibling = {
  label: string
  href?: string
  hint?: string
}

export type Breadcrumb013Props = Omit<ComponentProps<"nav">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trail?: string[]
  current?: string
  siblings?: Breadcrumb013Sibling[]
  menuTitle?: string
  /** Подсказка на кнопке уровня: компонент несёт русскую, проект — свою. */
  triggerHint?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: последний уровень открывает меню соседних страниц —
// не форму выбора, а обычный список ссылок с пояснениями. Меню живёт в
// нативном popover: верхний слой, закрытие по Esc и по клику мимо достаются
// от браузера. Позиция берётся из CSS anchor positioning там, где он есть,
// а где нет — popover остаётся карточкой по центру экрана, и это рабочий
// вид, а не поломка.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей, собственная заливка остаётся только у меню — оно
// висит верхним слоем и обязано быть непрозрачным.
const STYLES = `
:where([data-vibeui-block="breadcrumb-013"]){
--vibeui-breadcrumb-013-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-breadcrumb-013-muted:color-mix(in oklab,var(--vibeui-breadcrumb-013-fg) 68%,transparent);
--vibeui-breadcrumb-013-faint:light-dark(oklch(0.66 0 265),oklch(0.6 0 265));
--vibeui-breadcrumb-013-sep:light-dark(oklch(0.78 0 265),oklch(0.5 0 265));
--vibeui-breadcrumb-013-border:light-dark(oklch(0.9 0 265),oklch(0.4 0 265));
--vibeui-breadcrumb-013-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-breadcrumb-013-menu:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-breadcrumb-013-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0 0 0 / 70%));
--vibeui-breadcrumb-013-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-breadcrumb-013-bg:transparent;
--vibeui-breadcrumb-013-pad:0;
--vibeui-breadcrumb-013-radius:0;
--vibeui-breadcrumb-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-013"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-013"]{
box-sizing:border-box;width:100%;max-width:34rem;
padding:var(--vibeui-breadcrumb-013-pad);
background:var(--vibeui-breadcrumb-013-bg);
border-radius:var(--vibeui-breadcrumb-013-radius);
font-family:var(--vibeui-breadcrumb-013-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-013-muted);
}
[data-vibeui-block="breadcrumb-013"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-013"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="breadcrumb-013"] li + li::before{content:"/";color:var(--vibeui-breadcrumb-013-sep)}
[data-vibeui-block="breadcrumb-013"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-013"] a:hover{color:var(--vibeui-breadcrumb-013-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-013"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-013-accent);outline-offset:2px}
/* Кнопка последнего уровня выглядит как текущая страница, а не как кнопка:
   подсказку о меню несёт только галка справа. */
[data-vibeui-block="breadcrumb-013"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.375rem;margin:-0.125rem -0.375rem;
border:0;border-radius:0.375rem;background:transparent;
color:var(--vibeui-breadcrumb-013-fg);font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="breadcrumb-013"] [data-part="trigger"]:hover{background:var(--vibeui-breadcrumb-013-hover)}
[data-vibeui-block="breadcrumb-013"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-breadcrumb-013-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-013"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.1875rem;
border-right:1.5px solid var(--vibeui-breadcrumb-013-faint);
border-bottom:1.5px solid var(--vibeui-breadcrumb-013-faint);
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"]{
box-sizing:border-box;width:min(17rem,calc(100vw - 2rem));
padding:0.3125rem;border:1px solid var(--vibeui-breadcrumb-013-border);
border-radius:0.625rem;background:var(--vibeui-breadcrumb-013-menu);
font-family:var(--vibeui-breadcrumb-013-font);font-size:0.8125rem;
color:var(--vibeui-breadcrumb-013-muted);
box-shadow:0 18px 40px -22px var(--vibeui-breadcrumb-013-shadow);
}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"]:not(:popover-open){display:none}
[data-vibeui-block="breadcrumb-013"] [data-part="menu-title"]{
display:block;padding:0.25rem 0.5rem 0.375rem;
font-size:0.6875rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-breadcrumb-013-faint);
}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"] ul{
display:flex;flex-direction:column;gap:0.0625rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"] li{display:block}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"] a{
display:block;padding:0.375rem 0.5rem;border-radius:0.4375rem;
}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"] a:hover{background:var(--vibeui-breadcrumb-013-hover);text-decoration:none}
[data-vibeui-block="breadcrumb-013"] [data-part="name"]{display:block;color:var(--vibeui-breadcrumb-013-fg);font-weight:500}
[data-vibeui-block="breadcrumb-013"] [data-part="hint"]{display:block;font-size:0.75rem;color:var(--vibeui-breadcrumb-013-faint)}
/* Текущая строка помечена не только цветом: слева стоит полоса-маркер,
   иначе при дальтонизме «где я» из меню не читается. */
[data-vibeui-block="breadcrumb-013"] [data-part="menu"] [aria-current="page"]{
position:relative;background:var(--vibeui-breadcrumb-013-hover);
}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"] [aria-current="page"]::before{
content:"";position:absolute;left:0;top:0.4375rem;bottom:0.4375rem;width:2px;
border-radius:2px;background:var(--vibeui-breadcrumb-013-accent);
}
@supports (anchor-name:--vibeui-breadcrumb-013-a){
[data-vibeui-block="breadcrumb-013"] [data-part="menu"]{
position:fixed;margin:0.375rem 0 0;
position-area:bottom span-right;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="breadcrumb-013"] ol:has([data-open="true"]){align-items:flex-start}
[data-vibeui-block="breadcrumb-013"] li:has([data-open="true"]){flex-direction:column;align-items:flex-start}
[data-vibeui-block="breadcrumb-013"] [data-part="menu"][data-open="true"]{
display:block;position:static;opacity:1;transform:none;margin:0.375rem 0 0;width:min(17rem,100%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TRAIL = ["Проекты", "Витрина"]

const DEFAULT_SIBLINGS: Breadcrumb013Sibling[] = [
  { label: "Обзор", href: "#", hint: "Сводка и последние события" },
  { label: "Настройки", href: "#", hint: "Домен, доступы, интеграции" },
  { label: "Участники", href: "#", hint: "12 человек, 3 приглашения" },
  { label: "История", href: "#", hint: "Журнал изменений за 90 дней" },
]

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
 * Последний уровень открывает popover-меню соседних страниц.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb013({
  open = false,
  trail = DEFAULT_TRAIL,
  current = "Настройки",
  siblings = DEFAULT_SIBLINGS,
  menuTitle = "Соседние страницы",
  triggerHint = "показать соседние страницы",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb013Props) {
  const menuId = `vibeui-breadcrumb-013-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const anchorName = `--vibeui-breadcrumb-013-${menuId.slice(-8)}`
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-013-bg": background,
          "--vibeui-breadcrumb-013-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-013-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-013" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-013"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <ol>
          {trail.map((label) => (
            <li key={label}>
              <a href="#">{label}</a>
            </li>
          ))}
          <li>
            <button
              type="button"
              data-part="trigger"
              popoverTarget={menuId}
              aria-current="page"
              aria-label={`${current}: ${triggerHint}`}
              style={{ anchorName } as CSSProperties}
            >
              {current}
              <span data-part="caret" aria-hidden="true" />
            </button>
            <div
              id={menuId}
              popover={open ? undefined : "auto"}
              data-open={open || undefined}
              data-part="menu"
              style={{ positionAnchor: anchorName } as CSSProperties}
            >
              <span data-part="menu-title">{menuTitle}</span>
              <ul>
                {siblings.map((sibling) => {
                  const active = sibling.label === current

                  return (
                    <li key={sibling.label}>
                      <a
                        href={sibling.href ?? "#"}
                        aria-current={active ? "page" : undefined}
                      >
                        <span data-part="name">{sibling.label}</span>
                        {sibling.hint ? (
                          <span data-part="hint">{sibling.hint}</span>
                        ) : null}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </li>
        </ol>
      </nav>
    </>
  )
}
