"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button046Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  label?: string
  /** Прокрутка в пикселях, после которой кнопка нужна. */
  threshold?: number
  /** Прятать кнопку до порога. По умолчанию она видна всегда. */
  autoHide?: boolean
  accent?: string
}

// Идея компонента: кнопка «наверх» знает, сколько страницы позади. Кольцо
// прогресса — conic-gradient по переменной, которую обновляет обработчик
// прокрутки; та же величина решает, показывать ли кнопку. Слушатель повешен
// с passive:true, чтобы не тормозить прокрутку, и снимается при размонтировании.
const STYLES = `
:where([data-vibeui-block="button-046"]){
--vibeui-button-046-progress:0;
--vibeui-button-046-surface:oklch(1 0 0);
--vibeui-button-046-border:oklch(0.9 0.006 265);
--vibeui-button-046-fg:oklch(0.26 0.02 265);
--vibeui-button-046-accent:oklch(0.55 0.17 265);
--vibeui-button-046-size:3rem;
--vibeui-button-046-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-046"]{
position:relative;appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
width:var(--vibeui-button-046-size);height:var(--vibeui-button-046-size);
padding:3px;border:0;border-radius:50%;
/* Кольцо прогресса и бумажная середина в одном фоне. */
background:
conic-gradient(var(--vibeui-button-046-accent) calc(var(--vibeui-button-046-progress) * 1%),oklch(0.9 0.006 265) 0) border-box;
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
 * Кнопка «наверх» с кольцом прочитанного и появлением по прокрутке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button046({
  label = "Наверх",
  threshold = 320,
  autoHide = false,
  accent,
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
