"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Banner015Props = Omit<ComponentProps<"div">, "children"> & {
  appName?: string
  tagline?: string
  /** Пусто или битая ссылка — вместо иконки первая буква названия. */
  iconSrc?: string
  installLabel?: string
  /** Кнопка закрытия. Без обработчика полосу закрывать нечем. */
  onDismiss?: () => void
  dismissLabel?: string
  onInstall?: () => void
  accent?: string
  /** Подложка полосы. Пусто — остаётся собственная. */
  background?: string
}

// Идея компонента: приглашение поставить приложение — не рекламная плашка,
// а карточка самого приложения в миниатюре: значок, имя, что оно делает.
// Человек узнаёт то, что ему предлагают, а не гадает по общей фразе
// «установите нас». Отказ ничего не ломает — полоса просто закрывается.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, граница светлее подложки.
const STYLES = `
:where([data-vibeui-block="banner-015"]){
--vibeui-banner-015-bg:light-dark(oklch(0.99 0 265),oklch(0.24 0 265));
--vibeui-banner-015-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-banner-015-muted:color-mix(in oklab,var(--vibeui-banner-015-fg) 68%,transparent);
--vibeui-banner-015-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-banner-015-tile:light-dark(oklch(0.94 0 265),oklch(0.32 0 265));
--vibeui-banner-015-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-banner-015-on-accent:oklch(from var(--vibeui-banner-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-banner-015-hover:light-dark(oklch(0.2 0 265 / 7%),oklch(1 0 0 / 10%));
--vibeui-banner-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-015"]{color-scheme:dark}
[data-vibeui-block="banner-015"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-banner-015-font);color:var(--vibeui-banner-015-fg);
}
[data-vibeui-block="banner-015"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
box-sizing:border-box;padding:0.8125rem 1rem;
border:1px solid var(--vibeui-banner-015-border);border-radius:0.875rem;
background:var(--vibeui-banner-015-bg);
}
[data-vibeui-block="banner-015"] [data-part="icon"]{
position:relative;flex:none;width:2.75rem;height:2.75rem;border-radius:0.75rem;
overflow:hidden;background:var(--vibeui-banner-015-tile);color:var(--vibeui-banner-015-muted);
display:flex;align-items:center;justify-content:center;
font-size:1.0625rem;font-weight:700;
}
[data-vibeui-block="banner-015"] [data-part="icon"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="banner-015"] [data-part="text"]{flex:1 1 12rem;min-width:0}
[data-vibeui-block="banner-015"] [data-part="name"]{
display:block;font-size:0.9375rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="banner-015"] [data-part="tagline"]{
display:block;margin-top:0.0625rem;font-size:0.8125rem;color:var(--vibeui-banner-015-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="banner-015"] [data-part="actions"]{display:flex;align-items:center;gap:0.375rem;flex:none}
[data-vibeui-block="banner-015"] [data-part="install"]{
appearance:none;cursor:pointer;border:0;border-radius:0.625rem;
min-height:2.125rem;padding:0.25rem 0.9375rem;display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-banner-015-accent);color:var(--vibeui-banner-015-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="banner-015"] [data-part="install"]:hover{filter:brightness(1.08)}
[data-vibeui-block="banner-015"] [data-part="install"]:focus-visible{outline:2px solid var(--vibeui-banner-015-accent);outline-offset:2px}
[data-vibeui-block="banner-015"] [data-part="close"]{
appearance:none;border:0;background:transparent;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
color:var(--vibeui-banner-015-muted);font:inherit;font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="banner-015"] [data-part="close"]:hover{background:var(--vibeui-banner-015-hover);color:var(--vibeui-banner-015-fg)}
[data-vibeui-block="banner-015"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-banner-015-accent);outline-offset:2px}
@container (max-width: 26rem){
[data-vibeui-block="banner-015"] [data-part="text"]{flex:1 1 100%;order:2}
[data-vibeui-block="banner-015"] [data-part="actions"]{order:3;width:100%}
[data-vibeui-block="banner-015"] [data-part="install"]{flex:1}
}
@container (min-width: 32rem){
[data-vibeui-block="banner-015"] [data-part="shell"]{padding:0.9375rem 1.125rem}
[data-vibeui-block="banner-015"] [data-part="name"]{font-size:1rem}
[data-vibeui-block="banner-015"] [data-part="tagline"]{font-size:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-015"] *{animation:none!important;transition:none!important}}
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
 * Полоса «установите приложение»: значок, имя, короткое описание и одна
 * кнопка установки. Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner015({
  appName = "VibeUI",
  tagline = "Работает офлайн и открывается с домашнего экрана",
  iconSrc,
  installLabel = "Установить",
  onDismiss,
  dismissLabel = "Скрыть предложение установить приложение",
  onInstall,
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner015Props) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(iconSrc) && !broken

  const palette = {
    ...(accent ? { "--vibeui-banner-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-banner-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-015"
        role="region"
        aria-label={appName}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <span data-part="icon" aria-hidden="true">
            {showImage ? (
              <img src={iconSrc} alt="" onError={() => setBroken(true)} />
            ) : (
              appName.trim().charAt(0).toUpperCase() || "?"
            )}
          </span>
          <span data-part="text">
            <span data-part="name">{appName}</span>
            <span data-part="tagline">{tagline}</span>
          </span>
          <span data-part="actions">
            <button data-part="install" type="button" onClick={onInstall}>
              {installLabel}
            </button>
            {onDismiss ? (
              <button
                data-part="close"
                type="button"
                onClick={onDismiss}
                aria-label={dismissLabel}
              >
                ×
              </button>
            ) : null}
          </span>
        </div>
      </div>
    </>
  )
}
