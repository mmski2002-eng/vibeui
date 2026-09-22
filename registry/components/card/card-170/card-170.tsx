"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card170Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  errorsTemplate?: string
  savedText?: string
  okText?: string
  saveText?: string
  problems?: readonly unknown[]
  saved?: boolean
  setSaved?: (value: boolean) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-022, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-170"]){
--vibeui-card-170-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-card-170-bad:light-dark(oklch(0.53 0.19 27),oklch(0.76 0.16 27));
--vibeui-card-170-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-170-muted:color-mix(in oklab,var(--vibeui-card-170-fg) 68%,transparent);
--vibeui-card-170-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-170"]{color-scheme:dark}
[data-vibeui-block="card-170"]{box-sizing:border-box}
[data-vibeui-block="card-170"] *{box-sizing:border-box}
[data-vibeui-block="card-170"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-card-170-border);}
[data-vibeui-block="card-170"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-170"] [data-part="status"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-170-muted)}
[data-vibeui-block="card-170"] [data-part="status"][data-bad="true"]{color:var(--vibeui-card-170-bad);font-weight:600}
[data-vibeui-block="card-170"] [data-part="save"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;border:1px solid transparent;
background:var(--vibeui-card-170-accent);color:oklch(from var(--vibeui-card-170-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-170"] [data-part="save"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="card-170"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-card-170-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-170"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Проверка ячейки»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card170({
  heading = "Табель за март",
  errorsTemplate = "Ошибок в ячейках: {count}",
  savedText = "Табель сохранён",
  okText = "Ошибок нет",
  saveText = "Сохранить табель",
  problems = [],
  saved = false,
  setSaved = () => {},
  accent,
  className,
  style,
  ...props
}: Card170Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-170-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-170" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-170"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p
          data-part="status"
          data-bad={problems.length > 0 ? "true" : undefined}
          role="status"
          aria-live="polite"
        >
          {problems.length > 0
            ? errorsTemplate.replace("{count}", String(problems.length))
            : saved
              ? savedText
              : okText}
        </p>
        <button
          type="button"
          data-part="save"
          disabled={problems.length > 0}
          onClick={() => setSaved(true)}
        >
          {saveText}
        </button>
      </div>
    </>
  )
}
