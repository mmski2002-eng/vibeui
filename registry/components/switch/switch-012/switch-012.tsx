"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch012Item = {
  id: string
  label: string
  defaultChecked?: boolean
}

export type Switch012Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  legend?: string
  masterLabel?: string
  items?: Switch012Item[]
  accent?: string
}

// Идея компонента: группа переключателей с общим тумблером «включить всё».
// Общий тумблер не подчиняет себе строки насильно — он читает их состояние
// и встаёт в промежуточное positions, когда включена только часть. Строку
// статуса словами, а не только визуальным indeterminate, потому что
// tri-state у роли switch формально не описан спецификацией ARIA.
const STYLES = `
:where([data-vibeui-block="switch-012"]){
--vibeui-switch-012-bg:oklch(1 0 0);
--vibeui-switch-012-fg:oklch(0.22 0.014 265);
--vibeui-switch-012-muted:oklch(0.55 0.014 265);
--vibeui-switch-012-border:oklch(0.91 0.006 265);
--vibeui-switch-012-track:oklch(0.88 0.008 265);
--vibeui-switch-012-thumb:oklch(1 0 0);
--vibeui-switch-012-accent:oklch(0.55 0.19 262);
--vibeui-switch-012-hover:oklch(0.55 0.02 265 / 6%);
--vibeui-switch-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-012"]{
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0;
background:var(--vibeui-switch-012-bg);
border:1px solid var(--vibeui-switch-012-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-012-font);color:var(--vibeui-switch-012-fg);
}
/* float + clear: без него легенда садится на рамку fieldset, а следующие
   строки начинают обтекать её вместо нормального потока. */
[data-vibeui-block="switch-012"] legend{
float:left;width:100%;padding:0;margin:0.75rem 0.875rem 0;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-switch-012-muted);
}
[data-vibeui-block="switch-012"] [data-part="master"]{
clear:both;display:flex;align-items:center;gap:0.875rem;
padding:0.625rem 0.875rem 0.875rem;cursor:pointer;
box-shadow:inset 0 -1px 0 var(--vibeui-switch-012-border);
}
[data-vibeui-block="switch-012"] [data-part="master-text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-012"] [data-part="master-title"]{font-size:0.9375rem;font-weight:600;line-height:1.3}
[data-vibeui-block="switch-012"] [data-part="master-status"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-switch-012-muted)}
[data-vibeui-block="switch-012"] [data-part="list"]{display:flex;flex-direction:column;padding:0.25rem 0.875rem 0.625rem}
[data-vibeui-block="switch-012"] [data-part="row"]{
display:flex;align-items:center;gap:0.875rem;
padding:0.5rem 0.5rem;margin:0 -0.5rem;border-radius:0.5rem;cursor:pointer;
transition:background-color .16s ease;
}
[data-vibeui-block="switch-012"] [data-part="row"]:hover{background:var(--vibeui-switch-012-hover)}
[data-vibeui-block="switch-012"] [data-part="label"]{font-size:0.875rem;line-height:1.3;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-012"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-012"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.5rem;height:1.4375rem;border-radius:9999px;
background:var(--vibeui-switch-012-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-012"] input:checked,
[data-vibeui-block="switch-012"] input:indeterminate{background:var(--vibeui-switch-012-accent)}
[data-vibeui-block="switch-012"] input:focus-visible{outline:2px solid var(--vibeui-switch-012-accent);outline-offset:2px}
[data-vibeui-block="switch-012"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.0625rem;height:1.0625rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-012-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-012"] input:checked + [data-part="thumb"]{transform:translateX(1.0625rem)}
/* Бегунок общего тумблера в промежуточном положении — по центру дорожки:
   ни «включено», ни «выключено», а честное «частично». */
[data-vibeui-block="switch-012"] input:indeterminate + [data-part="thumb"]{transform:translateX(0.53125rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Switch012Item[] = [
  { id: "email", label: "Письма на почту", defaultChecked: true },
  { id: "push", label: "Push-уведомления", defaultChecked: true },
  { id: "sms", label: "SMS", defaultChecked: false },
  { id: "digest", label: "Еженедельный дайджест", defaultChecked: false },
]

/**
 * Группа переключателей с общим тумблером «включить всё»: индетерминированное
 * состояние и текстовый статус вместо гадания по цвету.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch012({
  legend = "Каналы уведомлений",
  masterLabel = "Включить всё",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
  ...props
}: Switch012Props) {
  const baseId = useId()
  const masterRef = useRef<HTMLInputElement>(null)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set(items.filter((item) => item.defaultChecked).map((item) => item.id)),
  )

  const total = items.length
  const onCount = items.filter((item) => checkedIds.has(item.id)).length
  const allOn = total > 0 && onCount === total
  const someOn = onCount > 0 && onCount < total

  // indeterminate — не HTML-атрибут, а свойство DOM-узла: React его не
  // прокидывает через пропы, поэтому оно ставится вручную через ref.
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = someOn
    }
  }, [someOn])

  const palette = {
    ...(accent ? { "--vibeui-switch-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-012" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="switch-012"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <label data-part="master" htmlFor={`${baseId}-master`}>
          <span data-part="master-text">
            <span data-part="master-title">{masterLabel}</span>
            <span data-part="master-status" role="status">
              Включено {onCount} из {total}
            </span>
          </span>
          <span data-part="track">
            <input
              ref={masterRef}
              id={`${baseId}-master`}
              type="checkbox"
              role="switch"
              checked={allOn}
              onChange={(event) => {
                setCheckedIds(
                  event.target.checked
                    ? new Set(items.map((item) => item.id))
                    : new Set(),
                )
              }}
            />
            <span data-part="thumb" aria-hidden="true" />
          </span>
        </label>
        <div data-part="list">
          {items.map((item) => (
            <label key={item.id} data-part="row" htmlFor={`${baseId}-${item.id}`}>
              <span data-part="label">{item.label}</span>
              <span data-part="track">
                <input
                  id={`${baseId}-${item.id}`}
                  type="checkbox"
                  role="switch"
                  checked={checkedIds.has(item.id)}
                  onChange={(event) => {
                    setCheckedIds((current) => {
                      const next = new Set(current)
                      if (event.target.checked) {
                        next.add(item.id)
                      } else {
                        next.delete(item.id)
                      }
                      return next
                    })
                  }}
                />
                <span data-part="thumb" aria-hidden="true" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
