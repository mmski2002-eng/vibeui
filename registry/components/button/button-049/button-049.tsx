"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button049Props = Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> & {
  children?: string
  /** Подпись после добавления: она же приглашение перейти в корзину. */
  addedLabel?: string
  /** Что объявляет aria-live после добавления. */
  addedAnnounce?: string
  defaultAdded?: boolean
  onAdd?: () => void
  onOpenCart?: () => void
  accent?: string
}

// Идея компонента: одна кнопка на два разных действия. Пока товара нет
// в корзине — «В корзину»; после добавления она меняет и цвет, и смысл:
// теперь ведёт в корзину. Смена состояния объявляется в aria-live, иначе
// человек со скринридером не узнает, что добавление прошло.
const STYLES = `
:where([data-vibeui-block="button-049"]){
--vibeui-button-049-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-049-hover-filter:light-dark(brightness(1.45),brightness(0.9));
--vibeui-button-049-done:light-dark(oklch(0.5 0.13 155),oklch(0.6 0.13 155));
--vibeui-button-049-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-049-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-049"]{color-scheme:dark}
[data-vibeui-block="button-049"]{
position:relative;appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-width:11.5rem;height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-button-049-accent);color:var(--vibeui-button-049-fg);
font-family:var(--vibeui-button-049-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .2s ease,filter .16s ease;
}
[data-vibeui-block="button-049"][data-added="true"]{background:var(--vibeui-button-049-done)}
[data-vibeui-block="button-049"]:hover:not(:disabled){filter:brightness(1.07)}
[data-vibeui-block="button-049"]:focus-visible{outline:2px solid var(--vibeui-button-049-accent);outline-offset:3px}
[data-vibeui-block="button-049"][data-added="true"]:focus-visible{outline-color:var(--vibeui-button-049-done)}
[data-vibeui-block="button-049"]:disabled{cursor:not-allowed;opacity:.55}
/* Корзина: короб с ручкой, обе части — грани псевдоэлементов. */
[data-vibeui-block="button-049"] [data-part="bag"]{position:relative;flex:none;width:1rem;height:1.0625rem}
[data-vibeui-block="button-049"] [data-part="bag"]::before{
content:"";position:absolute;left:0;bottom:0;width:1rem;height:0.75rem;
box-sizing:border-box;border:1.75px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="button-049"] [data-part="bag"]::after{
content:"";position:absolute;left:0.25rem;top:0;width:0.5rem;height:0.4375rem;
box-sizing:border-box;border:1.75px solid currentColor;border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="button-049"] [data-part="check"]{position:relative;flex:none;width:1rem;height:1.0625rem}
[data-vibeui-block="button-049"] [data-part="check"]::after{
content:"";position:absolute;left:0.1875rem;top:50%;width:0.375rem;height:0.6875rem;
margin-top:-0.4375rem;box-sizing:border-box;
border:2px solid currentColor;border-top:0;border-left:0;transform:rotate(42deg);
}
[data-vibeui-block="button-049"] [data-part="live"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-049"]{transition:none!important}}
`

/**
 * Кнопка «в корзину» с состоянием «в корзине», которое меняет и смысл клика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button049({
  children = "В корзину",
  addedLabel = "В корзине — открыть",
  addedAnnounce = "Товар добавлен в корзину",
  defaultAdded = false,
  onAdd,
  onOpenCart,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button049Props) {
  const [added, setAdded] = useState(defaultAdded)

  const palette = {
    ...(accent ? { "--vibeui-button-049-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-049" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-049"
        data-added={String(added)}
        className={className}
        style={palette}
        onClick={() => {
          if (added) {
            onOpenCart?.()
            return
          }

          setAdded(true)
          onAdd?.()
        }}
      >
        <span
          data-part={added ? "check" : "bag"}
          aria-hidden="true"
          key={added ? "check" : "bag"}
        />
        {added ? addedLabel : children}
        <span data-part="live" role="status" aria-live="polite">
          {added ? addedAnnounce : ""}
        </span>
      </button>
    </>
  )
}
