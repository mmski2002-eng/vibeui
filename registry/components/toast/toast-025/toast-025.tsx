"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast025Props = Omit<ComponentProps<"div">, "children"> & {
  itemName?: string
  /** Уже отформатированная строка: «2 490 ₽», «$24.00» — валюту не считаем. */
  price?: string
  quantity?: number
  /** Пусто или битая ссылка — вместо картинки первая буква названия. */
  imageSrc?: string
  addedLabel?: string
  cartLabel?: string
  closeLabel?: string
  /** Цвет галочки и кнопки «В корзину». Пусто — штатная палитра. */
  accent?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  onViewCart?: () => void
  onClose?: () => void
}

// Идея компонента: подтверждение «в корзину» без карточки товара — глазами
// не узнать, что именно добавилось. Миниатюра тут не декор: покупатель
// сверяет её с товаром на странице, а не верит подписи на слово. Тон отмечен
// не только цветом галочки, но и словом «Добавлено» рядом — сама точка
// aria-hidden и незрячему ничего не сообщит.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, а граница светлее подложки.
const STYLES = `
:where([data-vibeui-block="toast-025"]){
--vibeui-toast-025-bg:light-dark(oklch(0.99 0 265),oklch(0.25 0 265));
--vibeui-toast-025-fg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-toast-025-muted:color-mix(in oklab,var(--vibeui-toast-025-fg) 68%,transparent);
--vibeui-toast-025-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-025-hover:light-dark(oklch(0.2 0 265 / 7%),oklch(1 0 0 / 12%));
--vibeui-toast-025-shadow:light-dark(oklch(0.18 0 265 / 55%),oklch(0.05 0 265 / 70%));
--vibeui-toast-025-tile:light-dark(oklch(0.94 0 265),oklch(0.32 0 265));
--vibeui-toast-025-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-toast-025-on-accent:oklch(from var(--vibeui-toast-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-toast-025-radius:0.875rem;
--vibeui-toast-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-025"]{color-scheme:dark}
[data-vibeui-block="toast-025"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.8125rem;border-radius:var(--vibeui-toast-025-radius);
border:1px solid var(--vibeui-toast-025-border);
background:var(--vibeui-toast-025-bg);color:var(--vibeui-toast-025-fg);
font-family:var(--vibeui-toast-025-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-025-shadow);
animation:vibeui-toast-025-in .22s ease;
}
@keyframes vibeui-toast-025-in{from{opacity:0;transform:translateY(-0.375rem)}to{opacity:1;transform:translateY(0)}}
/* Без overflow:hidden: значок «добавлено» вылезает за угол миниатюры на
   четверть rem, и обрезка съедала его нижний правый край. Скругляет
   картинку её собственный радиус. */
[data-vibeui-block="toast-025"] [data-part="thumb"]{
position:relative;flex:none;width:2.75rem;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-toast-025-tile);color:var(--vibeui-toast-025-muted);
display:flex;align-items:center;justify-content:center;
font-size:1rem;font-weight:700;
}
[data-vibeui-block="toast-025"] [data-part="thumb"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
border-radius:inherit;
}
[data-vibeui-block="toast-025"] [data-part="badge"]{
position:absolute;right:-0.25rem;bottom:-0.25rem;
display:flex;align-items:center;justify-content:center;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:var(--vibeui-toast-025-accent);color:oklch(from var(--vibeui-toast-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.625rem;line-height:1;
box-shadow:0 0 0 2px var(--vibeui-toast-025-bg);
}
[data-vibeui-block="toast-025"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="toast-025"] [data-part="status"]{
display:flex;align-items:baseline;gap:0.375rem;
font-size:0.75rem;font-weight:700;color:var(--vibeui-toast-025-accent);
text-transform:uppercase;letter-spacing:0.02em;
}
[data-vibeui-block="toast-025"] [data-part="name"]{
display:block;margin-top:0.1875rem;font-size:0.875rem;font-weight:600;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-025"] [data-part="meta"]{
margin-top:0.125rem;font-size:0.8125rem;color:var(--vibeui-toast-025-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="toast-025"] [data-part="row"]{display:flex;align-items:center;gap:0.5rem;margin-top:0.5625rem}
[data-vibeui-block="toast-025"] [data-part="cart"]{
appearance:none;cursor:pointer;border:0;border-radius:0.5rem;
min-height:2rem;padding:0.25rem 0.75rem;font:inherit;font-size:0.8125rem;font-weight:700;
background:var(--vibeui-toast-025-accent);color:oklch(from var(--vibeui-toast-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
transition:filter .16s ease;
}
[data-vibeui-block="toast-025"] [data-part="cart"]:hover{filter:brightness(1.06)}
[data-vibeui-block="toast-025"] [data-part="cart"]:focus-visible{outline:2px solid var(--vibeui-toast-025-accent);outline-offset:2px}
[data-vibeui-block="toast-025"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.625rem;height:1.625rem;padding:0;border-radius:9999px;margin:-0.125rem -0.125rem 0 0;
color:var(--vibeui-toast-025-muted);font-size:0.9375rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-025"] [data-part="close"]:hover{background:var(--vibeui-toast-025-hover);color:var(--vibeui-toast-025-fg)}
[data-vibeui-block="toast-025"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-025-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-025"]{animation:none!important}[data-vibeui-block="toast-025"] *{animation:none!important;transition:none!important}}
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

/**
 * Подтверждение «товар добавлен в корзину»: миниатюра узнаваемая, а не
 * подпись на слово, и переход в корзину рядом с ценой и количеством.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast025({
  itemName = "Кофта оверсайз, серый меланж",
  price = "3 290 ₽",
  quantity = 1,
  imageSrc,
  addedLabel = "Добавлено",
  cartLabel = "В корзину",
  closeLabel = "Закрыть уведомление",
  accent = "",
  background = "",
  onViewCart,
  onClose,
  className,
  style,
  ...props
}: Toast025Props) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(imageSrc) && !broken

  const palette = {
    ...(accent ? { "--vibeui-toast-025-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toast-025-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-025"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="thumb" aria-hidden="true">
          {showImage ? (
            <img src={imageSrc} alt="" onError={() => setBroken(true)} />
          ) : (
            itemName.trim().charAt(0).toUpperCase() || "?"
          )}
          <span data-part="badge">✓</span>
        </span>
        <span data-part="body">
          <span data-part="status">{addedLabel}</span>
          <span data-part="name">{itemName}</span>
          <span data-part="meta">
            {quantity} × {price}
          </span>
          <span data-part="row">
            <button type="button" data-part="cart" onClick={onViewCart}>
              {cartLabel}
            </button>
          </span>
        </span>
        <button
          data-part="close"
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>
      </div>
    </>
  )
}
