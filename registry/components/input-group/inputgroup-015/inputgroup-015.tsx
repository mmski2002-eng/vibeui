"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup015Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  protocols?: string[]
  zones?: string[]
  defaultValue?: string
  placeholder?: string
  /** Подпись списка протоколов для скринридера. */
  protocolLabel?: string
  /** Подпись списка доменных зон для скринридера. */
  zoneLabel?: string
  /** Вступление к собранному адресу: компонент несёт русское. */
  previewLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-inputgroup-015-surface:transparent;
--vibeui-inputgroup-015-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-inputgroup-015-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-015-muted:color-mix(in oklab,var(--vibeui-inputgroup-015-fg) 68%,transparent);
--vibeui-inputgroup-015-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-015-fixed:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-inputgroup-015-border:light-dark(oklch(0.86 0.008 265),oklch(0.4 0.014 265));
--vibeui-inputgroup-015-accent:light-dark(oklch(0.52 0.16 230),oklch(0.74 0.14 230));
--vibeui-inputgroup-015-radius:0.75rem;
--vibeui-inputgroup-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-015-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-015"]{color-scheme:dark}
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
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
  placeholder = "example",
  protocolLabel = "Протокол",
  zoneLabel = "Доменная зона",
  previewLabel = "Итоговый адрес:",
  hint = "Протокол слева и зона справа — из списка, имя домена — обычный текст между ними.",
  background = "",
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
    ...(background
      ? {
          "--vibeui-inputgroup-015-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-015"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <select
            data-part="protocol"
            name={`${name}-protocol`}
            aria-label={protocolLabel}
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
            placeholder={placeholder}
            value={domain}
            aria-describedby={`${id}-preview`}
            onChange={(event) => setDomain(event.target.value)}
          />
          <select
            data-part="zone"
            name={`${name}-zone`}
            aria-label={zoneLabel}
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
          {previewLabel} <b>{`${protocol}${domain || "…"}${zone}`}</b>
        </p>
        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
