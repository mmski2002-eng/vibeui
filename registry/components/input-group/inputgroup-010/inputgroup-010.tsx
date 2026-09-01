"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "prefix" | "onChange"
> & {
  label?: string
  prefix?: string
  onChange?: (slug: string) => void
  accent?: string
}

// Идея компонента: приставка домена — часть будущего адреса, но не часть
// значения. Она лежит в сцепке слева, её нельзя выделить и нельзя стереть,
// а в форму уходит только сам slug. Ввод чистится на лету: верхний регистр,
// пробелы и запрещённые символы превращаются в дефис прямо под курсором —
// иначе человек видит одно, а сохраняется другое. Приставка сжимается
// многоточием: длинный домен не должен съедать место у самого адреса.
const STYLES = `
:where([data-vibeui-block="inputgroup-010"]){
--vibeui-inputgroup-010-surface:oklch(1 0 0);
--vibeui-inputgroup-010-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-010-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-010-muted:oklch(0.56 0.014 265);
--vibeui-inputgroup-010-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-010-fixed:oklch(0.955 0.004 265);
--vibeui-inputgroup-010-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-010-accent:oklch(0.5 0.15 175);
--vibeui-inputgroup-010-radius:0.75rem;
--vibeui-inputgroup-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-010-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="inputgroup-010"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-010-surface);
border:1px solid var(--vibeui-inputgroup-010-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-010-font);color:var(--vibeui-inputgroup-010-fg);
}
[data-vibeui-block="inputgroup-010"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-010"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-010"] [data-part="group"]{display:flex;align-items:stretch;min-width:0}
[data-vibeui-block="inputgroup-010"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-010-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-010"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-010-radius) 0 0 var(--vibeui-inputgroup-010-radius);
}
[data-vibeui-block="inputgroup-010"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-010-radius) var(--vibeui-inputgroup-010-radius) 0;
}
[data-vibeui-block="inputgroup-010"] [data-part="group"] > *:focus{
z-index:1;outline:2px solid var(--vibeui-inputgroup-010-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-010-accent);
}
/* Приставка неинтерактивна: её не выделяют, не читают отдельно и по ней
   нечего нажимать. Многоточие держит её в разумной ширине. */
[data-vibeui-block="inputgroup-010"] [data-part="prefix"]{
flex:0 1 auto;min-width:0;display:flex;align-items:center;padding:0 0.625rem;
background:var(--vibeui-inputgroup-010-fixed);
color:var(--vibeui-inputgroup-010-muted);
font-family:var(--vibeui-inputgroup-010-mono);font-size:0.8125rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;user-select:none;
}
[data-vibeui-block="inputgroup-010"] input{
flex:1 1 8rem;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-010-field);
font-family:var(--vibeui-inputgroup-010-mono);font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="inputgroup-010"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-010-muted);
}
[data-vibeui-block="inputgroup-010"] [data-part="foot"] b{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-inputgroup-010-mono);font-weight:650;
color:var(--vibeui-inputgroup-010-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-010"] *{animation:none!important;transition:none!important}}
`

// Чистка на вводе, а не на отправке: адрес показывают человеку сразу.
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 32)
}

/**
 * Сцепка «приставка-домен + адрес»: приставку нельзя стереть, адрес чистится на лету.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup010({
  label = "Адрес страницы",
  prefix = "vibeui.ru/",
  onChange,
  accent,
  className,
  style,
  ...props
}: Inputgroup010Props) {
  const id = useId()
  const [slug, setSlug] = useState("moya-komanda")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-010"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="prefix" aria-hidden="true">
            {prefix}
          </span>
          <input
            id={id}
            name="slug"
            type="text"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="none"
            placeholder="moya-stranica"
            value={slug}
            aria-describedby={`${id}-foot`}
            onChange={(event) => {
              const next = slugify(event.target.value)
              setSlug(next)
              onChange?.(next)
            }}
          />
        </div>
        <p data-part="foot" id={`${id}-foot`}>
          <b>
            {prefix}
            {slug || "…"}
          </b>
          <span>{slug.length}/32</span>
        </p>
      </div>
    </>
  )
}
