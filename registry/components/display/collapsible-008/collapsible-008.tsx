import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible008Setting = {
  label: string
  value: string
  changed?: boolean
}

export type Collapsible008Props = Omit<
  ComponentPropsWithoutRef<"details">,
  "children" | "title"
> & {
  title?: string
  settings?: Collapsible008Setting[]
  accent?: string
}

// Идея компонента: свёрнутая группа настроек с признаком «изменено».
// Свёрнутый блок скрывает не только значения, но и сам факт правки, поэтому
// количество отличий от значений по умолчанию считается из данных и висит в
// заголовке. Внутри изменённая строка помечена точкой и жирным значением —
// глаз ловит отличие раньше, чем читает подпись.
const STYLES = `
:where([data-vibeui-block="collapsible-008"]){
--vibeui-collapsible-008-bg:oklch(1 0 0);
--vibeui-collapsible-008-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-008-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-008-border:oklch(0.9 0.006 265);
--vibeui-collapsible-008-accent:oklch(0.62 0.16 55);
--vibeui-collapsible-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-collapsible-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="collapsible-008"]{
display:block;box-sizing:border-box;width:100%;max-width:25rem;
background:var(--vibeui-collapsible-008-bg);color:var(--vibeui-collapsible-008-fg);
border:1px solid var(--vibeui-collapsible-008-border);border-radius:1rem;
font-family:var(--vibeui-collapsible-008-font);
}
[data-vibeui-block="collapsible-008"] summary{
display:flex;align-items:center;gap:0.625rem;
padding:0.8125rem 0.875rem;cursor:pointer;list-style:none;border-radius:1rem;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="collapsible-008"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-008"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-008-accent);outline-offset:-2px}
/* Счётчик отличий в заголовке: свёрнутый блок иначе скрывает сам факт правки. */
[data-vibeui-block="collapsible-008"] [data-part="tally"]{
margin-left:auto;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-collapsible-008-accent) 16%,transparent);
color:var(--vibeui-collapsible-008-accent);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="collapsible-008"] [data-part="tally"][data-clean="true"]{
background:oklch(0.55 0.02 265 / 10%);color:var(--vibeui-collapsible-008-muted);
}
[data-vibeui-block="collapsible-008"] [data-part="mark"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:2px solid var(--vibeui-collapsible-008-muted);
border-bottom:2px solid var(--vibeui-collapsible-008-muted);
transform:rotate(-45deg);transform-origin:60% 60%;transition:transform .18s ease;
}
[data-vibeui-block="collapsible-008"][open] [data-part="mark"]{transform:rotate(45deg)}
[data-vibeui-block="collapsible-008"] dl{
margin:0;padding:0.375rem 0.5rem 0.625rem;
border-top:1px solid var(--vibeui-collapsible-008-border);
}
[data-vibeui-block="collapsible-008"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
}
[data-vibeui-block="collapsible-008"] [data-part="row"][data-changed="true"]{
background:color-mix(in oklab,var(--vibeui-collapsible-008-accent) 8%,transparent);
}
[data-vibeui-block="collapsible-008"] dt{
display:flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;color:var(--vibeui-collapsible-008-muted);
}
[data-vibeui-block="collapsible-008"] dt::before{
content:"";flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;
background:transparent;
}
[data-vibeui-block="collapsible-008"] [data-part="row"][data-changed="true"] dt::before{
background:var(--vibeui-collapsible-008-accent);
}
[data-vibeui-block="collapsible-008"] dd{
margin:0 0 0 auto;
font-family:var(--vibeui-collapsible-008-mono);font-size:0.75rem;
color:var(--vibeui-collapsible-008-muted);
}
[data-vibeui-block="collapsible-008"] [data-part="row"][data-changed="true"] dd{
color:var(--vibeui-collapsible-008-fg);font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SETTINGS: Collapsible008Setting[] = [
  { label: "Формат сборки", value: "standalone", changed: true },
  { label: "Кеш реестра", value: "1 час" },
  { label: "Тема превью", value: "auto" },
  { label: "Порог предупреждений", value: "12", changed: true },
  { label: "Телеметрия", value: "выключена" },
]

/**
 * Свёртка настроек с признаком «изменено»: счётчик отличий в заголовке,
 * точка и жирное значение в строках. Один файл, ноль зависимостей.
 */
export function Collapsible008({
  title = "Параметры сборки",
  settings = DEFAULT_SETTINGS,
  accent,
  className,
  style,
  ...props
}: Collapsible008Props) {
  const changed = settings.filter((setting) => setting.changed).length

  const palette = {
    ...(accent ? { "--vibeui-collapsible-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-008" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-vibeui-block="collapsible-008"
        className={className}
        style={palette}
      >
        <summary>
          {title}
          <span data-part="tally" data-clean={changed === 0}>
            {changed === 0 ? "по умолчанию" : `${changed} изменено`}
          </span>
          <span data-part="mark" aria-hidden="true" />
        </summary>
        <dl>
          {settings.map((setting) => (
            <div
              key={setting.label}
              data-part="row"
              data-changed={Boolean(setting.changed)}
            >
              <dt>{setting.label}</dt>
              <dd>{setting.value}</dd>
            </div>
          ))}
        </dl>
      </details>
    </>
  )
}
