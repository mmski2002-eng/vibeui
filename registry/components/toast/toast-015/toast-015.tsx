"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  message?: string
  avatarSrc?: string
  closeLabel?: string
  /** Уточнение для крестика, {name} — имя собеседника. */
  closeContext?: string
  replyLabel?: string
  /** Цвет аватара и кнопки «Ответить». Пусто — штатная палитра. */
  accent?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  onReply?: () => void
  onClose?: () => void
}

// Идея компонента: уведомление о личном сообщении с настоящей кнопкой
// «Ответить», а не полем-обманкой. Аватар — картинка с провалом на
// инициалы, если src не задан или не загрузился; текст обрезан в одну
// строку, потому что письмо целиком читают в переписке, а не в тосте.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, а граница светлее подложки.
const STYLES = `
:where([data-vibeui-block="toast-015"]){
--vibeui-toast-015-bg:light-dark(oklch(0.99 0.002 265),oklch(0.25 0.014 265));
--vibeui-toast-015-fg:light-dark(oklch(0.22 0.014 265),oklch(0.96 0.003 265));
--vibeui-toast-015-muted:light-dark(oklch(0.56 0.014 265),oklch(0.76 0.01 265));
--vibeui-toast-015-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-toast-015-hover:light-dark(oklch(0.2 0.02 265 / 7%),oklch(1 0 0 / 12%));
--vibeui-toast-015-shadow:light-dark(oklch(0.18 0.02 265 / 55%),oklch(0.05 0.01 265 / 70%));
--vibeui-toast-015-accent:light-dark(oklch(0.55 0.16 260),oklch(0.7 0.15 260));
--vibeui-toast-015-accent-fg:light-dark(oklch(0.99 0.004 265),oklch(0.18 0.03 260));
--vibeui-toast-015-radius:0.875rem;
--vibeui-toast-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-015"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.75rem 0.875rem;border-radius:var(--vibeui-toast-015-radius);
border:1px solid var(--vibeui-toast-015-border);
background:var(--vibeui-toast-015-bg);color:var(--vibeui-toast-015-fg);
font-family:var(--vibeui-toast-015-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-015-shadow);
animation:vibeui-toast-015-in .22s ease;
}
@keyframes vibeui-toast-015-in{from{opacity:0;transform:translateY(-0.375rem)}to{opacity:1;transform:translateY(0)}}
[data-vibeui-block="toast-015"] [data-part="avatar"]{
position:relative;flex:none;width:2.5rem;height:2.5rem;border-radius:9999px;
overflow:hidden;background:var(--vibeui-toast-015-accent);color:var(--vibeui-toast-015-accent-fg);
display:flex;align-items:center;justify-content:center;
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-015"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="toast-015"] [data-part="text"]{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="toast-015"] [data-part="name"]{font-size:0.8438rem;font-weight:600;line-height:1.3}
[data-vibeui-block="toast-015"] [data-part="message"]{
font-size:0.8125rem;color:var(--vibeui-toast-015-muted);line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-015"] [data-part="actions"]{display:flex;align-items:center;gap:0.375rem;flex:none}
[data-vibeui-block="toast-015"] [data-part="reply"]{
appearance:none;cursor:pointer;border:0;border-radius:0.5rem;
height:2rem;padding:0 0.75rem;font:inherit;font-size:0.8125rem;font-weight:700;
background:var(--vibeui-toast-015-accent);color:var(--vibeui-toast-015-accent-fg);
transition:opacity .16s ease;
}
[data-vibeui-block="toast-015"] [data-part="reply"]:hover{opacity:0.88}
[data-vibeui-block="toast-015"] [data-part="reply"]:focus-visible{outline:2px solid var(--vibeui-toast-015-accent);outline-offset:2px}
[data-vibeui-block="toast-015"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-015-muted);font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-015"] [data-part="close"]:hover{background:var(--vibeui-toast-015-hover);color:var(--vibeui-toast-015-fg)}
[data-vibeui-block="toast-015"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-015-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-015"]{animation:none!important}[data-vibeui-block="toast-015"] *{animation:none!important;transition:none!important}}
`

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

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

/**
 * Уведомление о новом сообщении: аватар (картинка с провалом на инициалы),
 * имя, текст в одну строку и настоящая кнопка «Ответить».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast015({
  name = "Марина Ковалёва",
  message = "Отправила обновлённый макет каталога, посмотри при случае",
  avatarSrc,
  closeLabel = "Закрыть",
  closeContext = "сообщение от {name}",
  replyLabel = "Ответить",
  accent = "",
  background = "",
  onReply,
  onClose,
  className,
  style,
  ...props
}: Toast015Props) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(avatarSrc) && !broken

  const palette = {
    ...(accent ? { "--vibeui-toast-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toast-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-015"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="avatar" aria-hidden="true">
          {showImage ? (
            <img src={avatarSrc} alt="" onError={() => setBroken(true)} />
          ) : (
            initialsOf(name)
          )}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="message">{message}</span>
        </span>
        <span data-part="actions">
          <button type="button" data-part="reply" onClick={() => onReply?.()}>
            {replyLabel}
          </button>
          <button
            type="button"
            data-part="close"
            aria-label={`${closeLabel}: ${closeContext.replace("{name}", name)}`}
            onClick={() => onClose?.()}
          >
            ×
          </button>
        </span>
      </div>
    </>
  )
}
