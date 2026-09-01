"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  protocols?: string[]
  zones?: string[]
  defaultValue?: string
  hint?: string
  accent?: string
}

// Идея компонента: адрес сайта — три части, но интерактивны только две по
// краям. Протокол и доменная зона — закрытые списки (их незачем печатать
// вручную, они всегда из фиксированного набора), а имя домена — свободный
// текст между ними. Итоговый адрес собирается тут же под рамкой и объявляется
// aria-live, чтобы смена пункта в любом select была слышна сразу, а не только
// видна.
const STYLES = `
:where([data-vibeui-block="inputgroup-015"]){
--vibeui-inputgroup-015-surface:oklch(1 0 0);
--vibeui-inputgroup-015-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-015-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-015-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-015-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-015-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-015-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-015-accent:oklch(0.52 0.16 230);
--vibeui-inputgroup-015-radius:0.75rem;
--vibeui-inputgroup-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-015-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="inputgroup-015"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-015-surface);
border:1px solid var(--vibeui-inputgroup-015-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-015-font);color:var(--vibeui-inputgroup-015-fg);
}
[data-vibeui-block="inputgroup-015"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-015"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-015"] [data-part="group"]{display:flex;align-items:stretch;min-width:0}
[data-vibeui-block="inputgroup-015"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-015-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-015"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-015-radius) 0 0 var(--vibeui-inputgroup-015-radius);
}
[data-vibeui-block="inputgroup-015"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-015-radius) var(--vibeui-inputgroup-015-radius) 0;
}
[data-vibeui-block="inputgroup-015"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-015"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-015-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-015-accent);
}
[data-vibeui-block="inputgroup-015"] select{
appearance:none;flex:none;cursor:pointer;
background:var(--vibeui-inputgroup-015-fixed);
font-family:var(--vibeui-inputgroup-015-mono);font-size:0.8125rem;font-weight:650;
color:var(--vibeui-inputgroup-015-muted);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.85rem) 50%,calc(100% - 0.55rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-015"] select:focus{color:var(--vibeui-inputgroup-015-fg)}
[data-vibeui-block="inputgroup-015"] [data-part="protocol"]{width:7ch;padding:0 1.375rem 0 0.625rem}
[data-vibeui-block="inputgroup-015"] [data-part="zone"]{width:6ch;padding:0 1.375rem 0 0.625rem}
[data-vibeui-block="inputgroup-015"] input{
flex:1 1 6rem;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-015-field);
font-family:var(--vibeui-inputgroup-015-mono);font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="inputgroup-015"] [data-part="preview"]{
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-inputgroup-015-mono);font-size:0.75rem;line-height:1.4;
color:var(--vibeui-inputgroup-015-muted);
}
[data-vibeui-block="inputgroup-015"] [data-part="preview"] b{
font-weight:650;color:var(--vibeui-inputgroup-015-accent);
}
[data-vibeui-block="inputgroup-015"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-015-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROTOCOLS = ["https://", "http://"]
const DEFAULT_ZONES = [".ru", ".com", ".io", ".org"]

/**
 * Сцепка «протокол + домен + зона»: два выпадающих списка по краям, имя
 * домена свободным текстом между ними, итоговый адрес — снизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup015({
  name = "site",
  label = "Адрес сайта",
  protocols = DEFAULT_PROTOCOLS,
  zones = DEFAULT_ZONES,
  defaultValue = "vibeui",
  hint = "Протокол слева и зона справа — из списка, имя домена — обычный текст между ними.",
  accent,
  className,
  style,
  ...props
}: Inputgroup015Props) {
  const id = useId()
  const [protocol, setProtocol] = useState(protocols[0] ?? "https://")
  const [domain, setDomain] = useState(defaultValue)
  const [zone, setZone] = useState(zones[0] ?? ".ru")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-015"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <select
            data-part="protocol"
            name={`${name}-protocol`}
            aria-label="Протокол"
            value={protocol}
            onChange={(event) => setProtocol(event.target.value)}
          >
            {protocols.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            id={id}
            name={name}
            type="text"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="none"
            placeholder="example"
            value={domain}
            aria-describedby={`${id}-preview`}
            onChange={(event) => setDomain(event.target.value)}
          />
          <select
            data-part="zone"
            name={`${name}-zone`}
            aria-label="Доменная зона"
            value={zone}
            onChange={(event) => setZone(event.target.value)}
          >
            {zones.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <p data-part="preview" id={`${id}-preview`} aria-live="polite">
          Итоговый адрес: <b>{`${protocol}${domain || "…"}${zone}`}</b>
        </p>
        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
