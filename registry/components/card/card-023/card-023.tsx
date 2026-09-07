"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Card023Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  /** Надпись над заголовком лицевой стороны. */
  eyebrow?: string
  /** Заголовок лицевой стороны. */
  title?: string
  /** Текст лицевой стороны. */
  text?: string
  /** Заголовок оборота. */
  backTitle?: string
  /** Текст оборота. */
  backText?: string
  /** Подпись под карточкой. */
  hint?: string
  /** Название действия для скринридера. */
  toggleLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: две стороны живут в одном объёме, а не подменяют друг
// друга. Обе грани всегда в разметке, лицевая и оборотная развёрнуты на
// 180° и скрыты со спины, поэтому переворот — это один rotateY, а не
// перерисовка содержимого. Пружина с перелётом добавляет карточке веса:
// она доворачивается чуть дальше и возвращается.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="card-023"]){
--vibeui-card-023-bg:transparent;
--vibeui-card-023-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-card-023-muted:color-mix(in oklab,var(--vibeui-card-023-fg) 62%,transparent);
--vibeui-card-023-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-card-023-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-card-023-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-card-023-accent-text:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-card-023-on-accent:oklch(0.15 0.02 39.8);
--vibeui-card-023-radius:0.875rem;
--vibeui-card-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-023"]{color-scheme:dark}
[data-vibeui-block="card-023"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-card-023-bg);color:var(--vibeui-card-023-fg);
font-family:var(--vibeui-card-023-font);
}
[data-vibeui-block="card-023"] *{box-sizing:border-box}
/* Сцена задаёт перспективу: без неё поворот выглядит плоской развёрткой. */
[data-vibeui-block="card-023"] [data-part="scene"]{
appearance:none;border:0;padding:0;margin:0;background:none;cursor:pointer;
display:block;width:100%;font:inherit;color:inherit;text-align:left;
perspective:56rem;border-radius:var(--vibeui-card-023-radius);
}
[data-vibeui-block="card-023"] [data-part="scene"]:focus-visible{
outline:2px solid var(--vibeui-card-023-accent);outline-offset:3px;
}
[data-vibeui-block="card-023"] [data-part="deck"]{
position:relative;display:block;width:100%;aspect-ratio:16 / 10;
transform-style:preserve-3d;
transition:transform .6s cubic-bezier(.22,1.2,.36,1);
transition:transform .6s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="card-023"] [data-part="deck"][data-flipped]{transform:rotateY(180deg)}
/* Обе грани всегда в потоке: скрывает изнанку backface-visibility,
   а не переключение содержимого. */
[data-vibeui-block="card-023"] [data-part="face"]{
position:absolute;inset:0;
display:flex;flex-direction:column;justify-content:center;gap:0.375rem;
padding:1.125rem 1.25rem;
border:1px solid var(--vibeui-card-023-border);
border-radius:var(--vibeui-card-023-radius);
backface-visibility:hidden;
}
[data-vibeui-block="card-023"] [data-part="face"][data-side="front"]{
background:var(--vibeui-card-023-card);color:var(--vibeui-card-023-fg);
}
[data-vibeui-block="card-023"] [data-part="face"][data-side="back"]{
transform:rotateY(180deg);border-color:transparent;
background:var(--vibeui-card-023-accent);color:var(--vibeui-card-023-on-accent);
}
[data-vibeui-block="card-023"] [data-part="eyebrow"]{
font-size:0.6875rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-card-023-accent-text);
}
[data-vibeui-block="card-023"] [data-part="title"]{
font-size:1.0625rem;font-weight:650;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="card-023"] [data-part="text"]{
font-size:0.875rem;line-height:1.45;
}
[data-vibeui-block="card-023"] [data-side="front"] [data-part="text"]{
color:var(--vibeui-card-023-muted);
}
[data-vibeui-block="card-023"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-card-023-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-023"] *{animation:none!important;transition:none!important}}
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
 * Карточка с оборотом: клик или Enter переворачивает её в объёме.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card023({
  eyebrow = "Тариф",
  title = "Команда",
  text = "Общий каталог, роли и история изменений.",
  backTitle = "1 490 ₽ в месяц",
  backText = "До десяти участников, отмена в любой момент.",
  hint = "Нажмите на карточку, чтобы увидеть оборот",
  toggleLabel = "Перевернуть карточку",
  accent,
  background = "",
  className,
  style,
  ...props
}: Card023Props) {
  const [flipped, setFlipped] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-card-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-023-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-023"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="scene"
          aria-pressed={flipped}
          aria-label={toggleLabel}
          onClick={() => setFlipped((previous) => !previous)}
        >
          <span data-part="deck" data-flipped={flipped ? "" : undefined}>
            <span data-part="face" data-side="front" aria-hidden={flipped}>
              <span data-part="eyebrow">{eyebrow}</span>
              <span data-part="title">{title}</span>
              <span data-part="text">{text}</span>
            </span>
            <span data-part="face" data-side="back" aria-hidden={!flipped}>
              <span data-part="title">{backTitle}</span>
              <span data-part="text">{backText}</span>
            </span>
          </span>
        </button>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
