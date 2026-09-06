"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button046Props = Omit<ComponentProps<"button">, "children"> & {
  label?: string
  /** Прокрутка в пикселях, после которой кнопка нужна. */
  threshold?: number
  /** Прятать кнопку до порога. По умолчанию она видна всегда. */
  autoHide?: boolean
  accent?: string
  /** Середина кнопки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: кнопка «наверх» знает, сколько страницы позади. Кольцо
// прогресса — conic-gradient по переменной, которую обновляет обработчик
// прокрутки; та же величина решает, показывать ли кнопку. Слушатель повешен
// с passive:true, чтобы не тормозить прокрутку, и снимается при размонтировании.
const STYLES = `
:where([data-vibeui-block="button-046"]){
--vibeui-button-046-progress:0;
--vibeui-button-046-surface:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-button-046-border:light-dark(oklch(0.9 0 265),oklch(0.4 0 265));
--vibeui-button-046-track:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-button-046-fg:light-dark(oklch(0.26 0 265),oklch(0.93 0 265));
--vibeui-button-046-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-046-size:3rem;
--vibeui-button-046-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-046"]{color-scheme:dark}
[data-vibeui-block="button-046"]{
position:relative;appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
width:var(--vibeui-button-046-size);height:var(--vibeui-button-046-size);
padding:3px;border:0;border-radius:50%;
/* Кольцо прогресса и бумажная середина в одном фоне. */
background:
conic-gradient(var(--vibeui-button-046-accent) calc(var(--vibeui-button-046-progress) * 1%),var(--vibeui-button-046-track) 0) border-box;
color:var(--vibeui-button-046-fg);
font-family:var(--vibeui-button-046-font);
box-shadow:0 10px 24px -16px oklch(0 0 0 / 60%);
transition:opacity .2s ease,transform .2s ease;
}
[data-vibeui-block="button-046"][data-visible="false"]{
opacity:0;transform:translateY(0.5rem) scale(.9);pointer-events:none;
}
[data-vibeui-block="button-046"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;
width:100%;height:100%;border-radius:50%;
background:var(--vibeui-button-046-surface);
border:1px solid var(--vibeui-button-046-border);
transition:background-color .16s ease;
}
[data-vibeui-block="button-046"]:hover [data-part="face"]{
background:color-mix(in oklab,var(--vibeui-button-046-accent) 8%,var(--vibeui-button-046-surface));
}
[data-vibeui-block="button-046"]:focus-visible{outline:2px solid var(--vibeui-button-046-accent);outline-offset:3px}
[data-vibeui-block="button-046"] [data-part="arrow"]{position:relative;width:1rem;height:1rem}
[data-vibeui-block="button-046"] [data-part="arrow"]::before{
content:"";position:absolute;left:50%;bottom:0;width:1.75px;height:0.875rem;
margin-left:-0.875px;background:currentColor;border-radius:1px;
}
[data-vibeui-block="button-046"] [data-part="arrow"]::after{
content:"";position:absolute;left:50%;top:0.125rem;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;box-sizing:border-box;
border:1.75px solid currentColor;border-right:0;border-bottom:0;
transform:rotate(45deg);
}
[data-vibeui-block="button-046"] [data-part="arrow"]{transition:transform .18s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-046"]:hover [data-part="arrow"]{transform:translateY(-2px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-046"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной середины. Без неё светлая заливка досталась бы
 * значку тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Кнопка «наверх» с кольцом прочитанного и появлением по прокрутке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button046({
  label = "Наверх",
  threshold = 320,
  autoHide = false,
  accent,
  background = "",
  type = "button",
  className,
  style,
  ...props
}: Button046Props) {
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const read = () => {
      const top = window.scrollY
      const total =
        document.documentElement.scrollHeight - window.innerHeight || 1

      setOffset(top)
      setProgress(Math.min(100, Math.max(0, (top / total) * 100)))
    }

    read()
    window.addEventListener("scroll", read, { passive: true })
    window.addEventListener("resize", read)

    return () => {
      window.removeEventListener("scroll", read)
      window.removeEventListener("resize", read)
    }
  }, [])

  const visible = !autoHide || offset >= threshold

  const palette = {
    "--vibeui-button-046-progress": progress.toFixed(1),
    ...(accent ? { "--vibeui-button-046-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-046-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-046" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-046"
        data-visible={String(visible)}
        className={className}
        style={palette}
        aria-label={label}
        aria-hidden={visible ? undefined : true}
        tabIndex={visible ? undefined : -1}
        onClick={() => {
          const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches

          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
        }}
      >
        <span data-part="face">
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </button>
    </>
  )
}
