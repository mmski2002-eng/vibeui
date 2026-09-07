"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Avatar015Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  name?: string
  src?: string
  hint?: string
  editLabel?: string
  captureLabel?: string
  removeLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: аватар с меню правки. Меню — HTML popover, поэтому закрытие
// по Escape и клику мимо достаётся от браузера. Кнопка правки лежит поверх
// портрета, но не закрывает лицо: она сдвинута в угол и уменьшена, а её
// доступная подпись называет имя — в списке из пяти карточек «изменить фото»
// без имени бесполезно. Удаление отделено чертой и названо действием, а не
// «сбросить»: человек должен понимать, что вернётся заглушка.
const STYLES = `
:where([data-vibeui-block="avatar-015"]){
--vibeui-avatar-015-size:4.5rem;
--vibeui-avatar-015-edit:1.75rem;
--vibeui-avatar-015-bg:transparent;
--vibeui-avatar-015-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-avatar-015-muted:color-mix(in oklab,var(--vibeui-avatar-015-fg) 68%,transparent);
--vibeui-avatar-015-border:light-dark(oklch(0.9 0 265),oklch(0.31 0 265));
--vibeui-avatar-015-hover:oklch(0.55 0 265 / 9%);
--vibeui-avatar-015-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.69 0.2 39.8));
--vibeui-avatar-015-danger:light-dark(oklch(0.56 0.19 25),oklch(0.70 0.19 25));
--vibeui-avatar-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-015"]{
display:inline-flex;align-items:center;gap:0.875rem;
box-sizing:border-box;padding:0.875rem 1.125rem 0.875rem 0.875rem;
background:var(--vibeui-avatar-015-bg);
border:1px solid var(--vibeui-avatar-015-border);border-radius:1rem;
font-family:var(--vibeui-avatar-015-font);color:var(--vibeui-avatar-015-fg);
}
[data-vibeui-block="avatar-015"] *{box-sizing:border-box}
[data-vibeui-block="avatar-015"] [data-part="slot"]{position:relative;flex:none}
[data-vibeui-block="avatar-015"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-015-size);height:var(--vibeui-avatar-015-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.07 var(--vibeui-avatar-015-hue,265)),oklch(0.35 0.07 var(--vibeui-avatar-015-hue,265)));
color:light-dark(oklch(0.35 0.13 var(--vibeui-avatar-015-hue,265)),oklch(0.89 0.065 var(--vibeui-avatar-015-hue,265)));
font-size:calc(var(--vibeui-avatar-015-size) * 0.32);font-weight:700;
}
/* Кнопка в углу и мелкая: правка не должна закрывать лицо. Отделяет её вырез
   в портрете, а не обводка цветом подложки: обводка выдаёт себя, как только
   под кнопкой оказывается фотография или подложку меняет проект. */
[data-vibeui-block="avatar-015"] [data-part="edit"]{
position:absolute;right:0;bottom:0;
appearance:none;cursor:pointer;
width:var(--vibeui-avatar-015-edit);height:var(--vibeui-avatar-015-edit);
border:0;border-radius:9999px;
background:var(--vibeui-avatar-015-accent);color:oklch(1 0 0);
font:inherit;font-size:0.75rem;line-height:1;
}
[data-vibeui-block="avatar-015"] [data-part="face"]{
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-015-edit) / 2 + 2px) at calc(100% - var(--vibeui-avatar-015-edit) / 2) calc(100% - var(--vibeui-avatar-015-edit) / 2),transparent 99%,#000 100%);
}
[data-vibeui-block="avatar-015"] [data-part="edit"]:focus-visible{outline:2px solid var(--vibeui-avatar-015-accent);outline-offset:2px}
[data-vibeui-block="avatar-015"] [data-part="menu"]{
position:fixed;margin:0;padding:0.25rem;min-width:11rem;
border:1px solid var(--vibeui-avatar-015-border);border-radius:0.625rem;
background:var(--vibeui-avatar-015-bg);color:var(--vibeui-avatar-015-fg);
box-shadow:0 16px 36px -18px oklch(0.2 0 265 / 45%);
font-family:var(--vibeui-avatar-015-font);
}
/* Якорь привязывает меню к кнопке; без поддержки оно встанет по центру экрана. */
@supports (anchor-name: --a){
[data-vibeui-block="avatar-015"] [data-part="edit"]{anchor-name:--vibeui-avatar-015-anchor}
[data-vibeui-block="avatar-015"] [data-part="menu"]{
position-anchor:--vibeui-avatar-015-anchor;
position-area:bottom span-right;margin-top:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="avatar-015"] [data-part="item"]{
display:flex;align-items:center;width:100%;
min-height:2rem;padding:0 0.5rem;border-radius:0.4375rem;
appearance:none;border:0;background:none;cursor:pointer;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="avatar-015"] [data-part="item"]:hover{background:var(--vibeui-avatar-015-hover)}
[data-vibeui-block="avatar-015"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-avatar-015-accent);outline-offset:-2px}
/* Удаление отделено чертой: соседство с правкой стоит промаха. */
[data-vibeui-block="avatar-015"] [data-danger="true"]{
margin-top:0.25rem;padding-top:0.625rem;min-height:2.375rem;
border-top:1px solid var(--vibeui-avatar-015-border);border-radius:0 0 0.4375rem 0.4375rem;
color:var(--vibeui-avatar-015-danger);
}
[data-vibeui-block="avatar-015"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="avatar-015"] [data-part="name"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="avatar-015"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-avatar-015-muted)}
[data-vibeui-block="avatar-015"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-015"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-015"]{color-scheme:dark}
/* Развёрнутый режим: меню лежит поверх страницы под кнопкой, как и popover,
   но без верхнего слоя — карточка при этом не меняет размер. */
[data-vibeui-block="avatar-015"] [data-part="menu"][data-open="true"]{
position:absolute;z-index:2;
top:calc(var(--vibeui-avatar-015-size) + 0.375rem);
left:calc(var(--vibeui-avatar-015-size) - var(--vibeui-avatar-015-edit));
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-015"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

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
 * Аватар с меню правки на HTML popover: закрытие и якорь от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar015({
  open = false,
  background = "",
  name = "Анна Реброва",
  src,
  hint = "PNG или JPG до 2 МБ, квадрат от 200 пикселей",
  editLabel = "Загрузить фото",
  captureLabel = "Сделать снимок",
  removeLabel = "Удалить фото",
  accent,
  textColor,
  className,
  style,
  ...props
}: Avatar015Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)

  const palette = {
    "--vibeui-avatar-015-hue": hue(name),
    ...(accent ? { "--vibeui-avatar-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-avatar-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-015-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-015"
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="face" aria-hidden="true">
            {src && !removed ? <img src={src} alt="" /> : initials(name)}
          </span>
          <button
            type="button"
            data-part="edit"
            popoverTarget="vibeui-avatar-015-menu"
            aria-label={`Изменить фото: ${name}`}
          >
            ✎
          </button>
          <div
            id="vibeui-avatar-015-menu"
            data-part="menu"
            popover={open ? undefined : "auto"}
            data-open={open || undefined}
            role="menu"
            ref={menu}
          >
            <button type="button" data-part="item" role="menuitem">
              {editLabel}
            </button>
            <button type="button" data-part="item" role="menuitem">
              {captureLabel}
            </button>
            <button
              type="button"
              data-part="item"
              data-danger="true"
              role="menuitem"
              onClick={() => {
                setRemoved(true)
                menu.current?.hidePopover()
              }}
            >
              {removeLabel}
            </button>
          </div>
        </span>

        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="hint">
            {removed ? "Фото удалено, показаны инициалы" : hint}
          </span>
        </span>
      </div>
    </>
  )
}
