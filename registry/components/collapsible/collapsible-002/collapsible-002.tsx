"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible002Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  text?: string
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: свёртка с честной анимацией высоты. Высота содержимого
// заранее неизвестна, а height:auto не анимируется, поэтому обёртка — грид с
// grid-template-rows от 0fr к 1fr: браузер сам считает конечную высоту и
// плавно к ней едет. Внутренний слой держит overflow:hidden и min-height:0,
// иначе строка грида не сожмётся ниже содержимого.
const STYLES = `
:where([data-vibeui-block="collapsible-002"]){
--vibeui-collapsible-002-bg:oklch(1 0 0);
--vibeui-collapsible-002-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-002-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-002-border:oklch(0.9 0.006 265);
--vibeui-collapsible-002-accent:oklch(0.58 0.16 200);
--vibeui-collapsible-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-002"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;
background:var(--vibeui-collapsible-002-bg);color:var(--vibeui-collapsible-002-fg);
border:1px solid var(--vibeui-collapsible-002-border);border-radius:0.875rem;
font-family:var(--vibeui-collapsible-002-font);
}
[data-vibeui-block="collapsible-002"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;padding:0.8125rem 0.875rem;
appearance:none;border:0;background:none;cursor:pointer;text-align:left;
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
border-radius:0.875rem;
}
[data-vibeui-block="collapsible-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-collapsible-002-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-002"] [data-part="mark"]{
flex:none;margin-left:auto;position:relative;width:0.75rem;height:0.75rem;
}
[data-vibeui-block="collapsible-002"] [data-part="mark"]::before,
[data-vibeui-block="collapsible-002"] [data-part="mark"]::after{
content:"";position:absolute;inset:50% 0 auto;
height:2px;border-radius:2px;background:var(--vibeui-collapsible-002-accent);
transform:translateY(-50%);transition:transform .24s ease,opacity .24s ease;
}
/* Плюс превращается в минус: вторая палка просто ложится и гаснет. */
[data-vibeui-block="collapsible-002"] [data-part="mark"]::after{transform:translateY(-50%) rotate(90deg)}
[data-vibeui-block="collapsible-002"] [data-part="trigger"][aria-expanded="true"] [data-part="mark"]::after{transform:translateY(-50%) rotate(0deg);opacity:0}
/* 0fr → 1fr: единственный способ анимировать высоту неизвестного содержимого. */
[data-vibeui-block="collapsible-002"] [data-part="wrap"]{
display:grid;grid-template-rows:0fr;
transition:grid-template-rows .28s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="collapsible-002"] [data-part="wrap"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="collapsible-002"] [data-part="inner"]{overflow:hidden;min-height:0}
[data-vibeui-block="collapsible-002"] [data-part="body"]{
margin:0;padding:0 0.875rem 0.875rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-collapsible-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Свёртка с плавной анимацией высоты на grid-template-rows 0fr→1fr.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Collapsible002({
  title = "Что входит в поставку",
  text = "Один .tsx-файл со всеми стилями внутри, без npm-зависимостей и без обращений к теме проекта. Палитра объявлена локальными переменными, поэтому компонент выглядит одинаково в любом окружении.",
  defaultOpen = true,
  accent,
  className,
  style,
  ...props
}: Collapsible002Props) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  const palette = {
    ...(accent ? { "--vibeui-collapsible-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="collapsible-002"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <span data-part="mark" aria-hidden="true" />
        </button>
        <div data-part="wrap" data-open={open}>
          <div id={bodyId} data-part="inner" inert={!open}>
            <p data-part="body">{text}</p>
          </div>
        </div>
      </section>
    </>
  )
}
