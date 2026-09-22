"use client"

import type { Dispatch, SetStateAction, ComponentProps, CSSProperties } from "react"

export type Card177Row = {
  id: string
  node: string
  region: string
  latency: number
  uptime: string
}

export type Card177Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  failedStateText?: string
  loadedStateText?: string
  rows?: Card177Row[]
  simulateText?: string
  failed?: boolean
  setFailed?: Dispatch<SetStateAction<boolean>>
  setTries?: (value: number) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card177Row[] = [
  {
    id: "s1",
    node: "eu-node-01",
    region: "Франкфурт",
    latency: 24,
    uptime: "99,98 %",
  },
  {
    id: "s2",
    node: "eu-node-02",
    region: "Амстердам",
    latency: 31,
    uptime: "99,91 %",
  },
  {
    id: "s3",
    node: "ru-node-11",
    region: "Москва",
    latency: 12,
    uptime: "99,99 %",
  },
  {
    id: "s4",
    node: "ru-node-12",
    region: "Новосибирск",
    latency: 48,
    uptime: "99,84 %",
  },
]

// Часть блока datagrid-029, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-177"]){
--vibeui-card-177-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-card-177-bad:light-dark(oklch(0.53 0.19 27),oklch(0.76 0.16 27));
--vibeui-card-177-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-177-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-card-177-muted:color-mix(in oklab,var(--vibeui-card-177-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-177"]{color-scheme:dark}
[data-vibeui-block="card-177"]{box-sizing:border-box}
[data-vibeui-block="card-177"] *{box-sizing:border-box}
[data-vibeui-block="card-177"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-card-177-border);}
[data-vibeui-block="card-177"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-177"] [data-part="state"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-177-muted)}
[data-vibeui-block="card-177"] [data-part="state"][data-bad="true"]{color:var(--vibeui-card-177-bad);font-weight:600}
[data-vibeui-block="card-177"] [data-part="sim"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-177-border);
background:transparent;color:var(--vibeui-card-177-fg);}
[data-vibeui-block="card-177"] [data-part="sim"]:focus-visible{outline:2px solid var(--vibeui-card-177-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-177"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Ошибка загрузки»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card177({
  heading = "Узлы сети",
  failedStateText = "Данные не загружены",
  loadedStateText = "Узлов: {count}",
  rows = DEFAULT_ROWS,
  simulateText = "Симулировать сбой",
  failed = true,
  setFailed = () => {},
  setTries = () => {},
  accent,
  className,
  style,
  ...props
}: Card177Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-177-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-177" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-177"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="state" data-bad={failed ? "true" : undefined}>
          {failed
            ? failedStateText
            : loadedStateText.replace("{count}", String(rows.length))}
        </p>
        <button
          type="button"
          data-part="sim"
          aria-pressed={failed}
          onClick={() => {
            setFailed((value) => !value)
            setTries(0)
          }}
        >
          {simulateText}
        </button>
      </div>
    </>
  )
}
