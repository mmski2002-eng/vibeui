"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  text?: string
  lines?: number
  accent?: string
}

// Идея компонента: «показать ещё» для длинного текста. Обрезка сделана
// line-clamp по числу строк, а не фиксированной высотой в пикселях: при другом
// кегле или межстрочном интервале обрез остаётся на границе строки. Градиент
// поверх последней строки лежит в ::after и растворяется в фоне карточки —
// поэтому фон подложки берётся из той же переменной, что и весь блок.
const STYLES = `
:where([data-vibeui-block="collapsible-003"]){
--vibeui-collapsible-003-bg:oklch(1 0 0);
--vibeui-collapsible-003-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-003-muted:oklch(0.5 0.014 265);
--vibeui-collapsible-003-border:oklch(0.9 0.006 265);
--vibeui-collapsible-003-accent:oklch(0.55 0.19 28);
--vibeui-collapsible-003-lines:4;
--vibeui-collapsible-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-003"]{
display:block;box-sizing:border-box;width:100%;max-width:26rem;padding:1rem;
background:var(--vibeui-collapsible-003-bg);color:var(--vibeui-collapsible-003-fg);
border:1px solid var(--vibeui-collapsible-003-border);border-radius:1rem;
font-family:var(--vibeui-collapsible-003-font);
}
[data-vibeui-block="collapsible-003"] [data-part="title"]{
margin:0 0 0.5rem;font-size:0.9375rem;font-weight:680;line-height:1.3;
}
[data-vibeui-block="collapsible-003"] [data-part="clip"]{position:relative}
[data-vibeui-block="collapsible-003"] [data-part="body"]{
margin:0;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-collapsible-003-muted);
}
/* Обрез по строкам, а не по пикселям: кегль поменяется — граница останется. */
[data-vibeui-block="collapsible-003"] [data-part="clip"][data-open="false"] [data-part="body"]{
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--vibeui-collapsible-003-lines);overflow:hidden;
}
[data-vibeui-block="collapsible-003"] [data-part="clip"][data-open="false"]::after{
content:"";position:absolute;inset:auto 0 0;height:2.75rem;pointer-events:none;
background:linear-gradient(to bottom,transparent,var(--vibeui-collapsible-003-bg) 88%);
}
[data-vibeui-block="collapsible-003"] [data-part="more"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.625rem;
appearance:none;border:0;background:none;padding:0.25rem 0;cursor:pointer;
color:var(--vibeui-collapsible-003-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="collapsible-003"] [data-part="more"]:hover{text-decoration:underline}
[data-vibeui-block="collapsible-003"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-collapsible-003-accent);outline-offset:3px;border-radius:0.25rem}
[data-vibeui-block="collapsible-003"] [data-part="mark"]{
width:0.4375rem;height:0.4375rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);transform-origin:60% 60%;transition:transform .18s ease;
}
[data-vibeui-block="collapsible-003"] [data-part="more"][aria-expanded="true"] [data-part="mark"]{transform:rotate(-135deg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEXT =
  "VibeUI отдаёт компонент целиком: разметку, стили и палитру в одном файле. Ничего не тянется из темы проекта, поэтому после установки блок выглядит ровно так, как в превью каталога, — та же типографика, те же отступы, то же поведение при сужении. Правки делаются прямо в файле: он ваш, обновлять его из реестра никто не будет, и конфликтов с вашим дизайн-токеном тоже не случится."

/**
 * Свёртка длинного текста: обрез по строкам, градиент вместо резкой границы
 * и кнопка «Показать ещё». Один файл, ноль зависимостей.
 */
export function Collapsible003({
  title = "Почему компонент отдаётся одним файлом",
  text = DEFAULT_TEXT,
  lines = 4,
  accent,
  className,
  style,
  ...props
}: Collapsible003Props) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()

  const palette = {
    "--vibeui-collapsible-003-lines": String(lines),
    ...(accent ? { "--vibeui-collapsible-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="collapsible-003"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <div data-part="clip" data-open={open}>
          <p id={bodyId} data-part="body">
            {text}
          </p>
        </div>
        <button
          type="button"
          data-part="more"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Свернуть" : "Показать ещё"}
          <span data-part="mark" aria-hidden="true" />
        </button>
      </section>
    </>
  )
}
