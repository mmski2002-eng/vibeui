"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Codeblock013Props = {
  title?: string
  lines?: string[]
  showNumbers?: boolean
  className?: string
  style?: CSSProperties
}

// Идея компонента: копировать не весь блок, а одну строку. У каждой строки
// своя кнопка: она проявляется при наведении и при фокусе с клавиатуры,
// поэтому копирование доступно и без мыши, а не только по hover.
const STYLES = `
:where([data-vibeui-block="codeblock-013"]){
--vibeui-codeblock-013-bg:oklch(0.2 0.006 265);
--vibeui-codeblock-013-head:oklch(0.24 0.008 265);
--vibeui-codeblock-013-fg:oklch(0.93 0.005 265);
--vibeui-codeblock-013-muted:oklch(0.67 0.012 265);
--vibeui-codeblock-013-gutter:oklch(0.5 0.014 265);
--vibeui-codeblock-013-border:oklch(1 0 0 / 13%);
--vibeui-codeblock-013-ok:oklch(0.84 0.14 152);
--vibeui-codeblock-013-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-013"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-013-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-013-bg);color:var(--vibeui-codeblock-013-fg);
font-family:var(--vibeui-codeblock-013-font);
}
[data-vibeui-block="codeblock-013"] figcaption{
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-013-head);
border-bottom:1px solid var(--vibeui-codeblock-013-border);
font-family:var(--vibeui-codeblock-013-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-013-muted);
}
[data-vibeui-block="codeblock-013"] ol{
margin:0;padding:0.375rem 0;list-style:none;
counter-reset:line;
}
[data-vibeui-block="codeblock-013"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.375rem 0 0.875rem;min-height:1.625rem;
transition:background-color .16s ease;
}
[data-vibeui-block="codeblock-013"] li[data-numbered="true"]::before{
counter-increment:line;content:counter(line);
flex:none;width:1.5rem;text-align:right;
font-family:var(--vibeui-codeblock-013-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-013-gutter);font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-013"] li:hover{background:oklch(1 0 0 / 6%)}
[data-vibeui-block="codeblock-013"] li[data-copied="true"]{background:oklch(0.6 0.14 152 / 18%)}
[data-vibeui-block="codeblock-013"] code{
flex:1 1 auto;min-width:0;
font-family:var(--vibeui-codeblock-013-mono);
font-size:0.8125rem;line-height:1.6;
white-space:pre;overflow-x:auto;
}
[data-vibeui-block="codeblock-013"] button{
appearance:none;border:0;cursor:pointer;flex:none;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
display:inline-flex;align-items:center;justify-content:center;
background:oklch(1 0 0 / 10%);color:var(--vibeui-codeblock-013-muted);
opacity:0;transition:opacity .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-013"] li:hover button,
[data-vibeui-block="codeblock-013"] button:focus-visible,
[data-vibeui-block="codeblock-013"] button[data-copied="true"]{opacity:1}
[data-vibeui-block="codeblock-013"] button:hover{color:var(--vibeui-codeblock-013-fg)}
[data-vibeui-block="codeblock-013"] button:focus-visible{outline:2px solid var(--vibeui-codeblock-013-ok);outline-offset:2px}
[data-vibeui-block="codeblock-013"] button[data-copied="true"]{color:var(--vibeui-codeblock-013-ok)}
[data-vibeui-block="codeblock-013"] svg{width:0.875rem;height:0.875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-013"] *{animation:none!important;transition:none!important}}
`

const LINES = [
  "git remote add upstream git@github.com:vibeui/vibeui.git",
  "git fetch upstream --prune",
  "git rebase upstream/main",
  "git push --force-with-lease",
]

/** Список строк, каждую можно скопировать отдельной кнопкой. */
export function Codeblock013({
  title = "Обновление форка",
  lines = LINES,
  showNumbers = true,
  className,
  style,
}: Codeblock013Props) {
  const [copied, setCopied] = useState(-1)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async (line: string, index: number) => {
    try {
      await navigator.clipboard.writeText(line)
    } catch {
      // Буфер недоступен: отметка «скопировано» была бы обманом.
      return
    }
    setCopied(index)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(-1), 1400)
  }

  return (
    <>
      <style href="vibeui-codeblock-013" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-013"
        className={className}
        style={style}
      >
        <figcaption>{title}</figcaption>
        <ol>
          {lines.map((line, index) => (
            <li
              key={index}
              data-numbered={showNumbers || undefined}
              data-copied={copied === index || undefined}
            >
              <code>{line}</code>
              <button
                type="button"
                data-copied={copied === index || undefined}
                onClick={() => copy(line, index)}
                aria-label={
                  copied === index
                    ? `Строка ${index + 1} скопирована`
                    : `Скопировать строку ${index + 1}`
                }
              >
                {copied === index ? (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path
                      d="M2 6.5 4.6 9 10 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <rect
                      x="4"
                      y="1.5"
                      width="6.5"
                      height="6.5"
                      rx="1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M8 10.5H3a1.5 1.5 0 0 1-1.5-1.5V4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ol>
      </figure>
    </>
  )
}
