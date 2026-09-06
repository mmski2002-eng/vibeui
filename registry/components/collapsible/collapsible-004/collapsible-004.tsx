import type { ComponentProps, CSSProperties } from "react"

export type Collapsible004Line = {
  text: string
  level?: "info" | "warn" | "error"
}

export type Collapsible004Props = Omit<
  ComponentProps<"details">,
  "children" | "title"
> & {
  title?: string
  lines?: Collapsible004Line[]
  /** Счётчик строк. {count} — число строк лога. */
  linesText?: string
  /** Счётчик ошибок. {count} — число строк с уровнем error. */
  errorsText?: string
  accent?: string
}

// Идея компонента: свёрнутый вывод сборки. Пока всё хорошо, лог занимает одну
// строку; развернуть его нужно только когда что-то упало, поэтому итог
// (количество строк и ошибок) считается из данных и показан прямо в summary —
// разворачивать ради подсчёта не приходится. Номера строк рисует счётчик CSS,
// в разметке их нет: копирование лога не тащит за собой нумерацию.
const STYLES = `
:where([data-vibeui-block="collapsible-004"]){
--vibeui-collapsible-004-bg:oklch(0.21 0 265);
--vibeui-collapsible-004-fg:oklch(0.93 0 265);
--vibeui-collapsible-004-muted:color-mix(in oklab,var(--vibeui-collapsible-004-fg) 68%,transparent);
--vibeui-collapsible-004-border:oklch(1 0 0 / 14%);
--vibeui-collapsible-004-warn:oklch(0.82 0.14 85);
--vibeui-collapsible-004-error:oklch(0.7 0.18 22);
--vibeui-collapsible-004-accent:oklch(0.8 0.14 152);
--vibeui-collapsible-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-collapsible-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-004"]{
display:block;box-sizing:border-box;width:100%;max-width:27rem;overflow:hidden;
background:var(--vibeui-collapsible-004-bg);color:var(--vibeui-collapsible-004-fg);
border:1px solid var(--vibeui-collapsible-004-border);border-radius:0.875rem;
font-family:var(--vibeui-collapsible-004-font);
}
[data-vibeui-block="collapsible-004"] summary{
display:flex;align-items:center;gap:0.5rem;
padding:0.6875rem 0.875rem;cursor:pointer;list-style:none;
font-size:0.8125rem;font-weight:640;
}
[data-vibeui-block="collapsible-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-004"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-004-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-004"] [data-part="mark"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:2px solid var(--vibeui-collapsible-004-muted);
border-bottom:2px solid var(--vibeui-collapsible-004-muted);
transform:rotate(-45deg);transform-origin:60% 60%;transition:transform .18s ease;
}
[data-vibeui-block="collapsible-004"][open] [data-part="mark"]{transform:rotate(45deg)}
[data-vibeui-block="collapsible-004"] [data-part="count"]{
margin-left:auto;display:inline-flex;gap:0.5rem;
font-family:var(--vibeui-collapsible-004-mono);font-size:0.6875rem;font-weight:500;
color:var(--vibeui-collapsible-004-muted);
}
[data-vibeui-block="collapsible-004"] [data-part="count"] b{color:var(--vibeui-collapsible-004-error);font-weight:700}
/* Номера строк рисует счётчик: в разметке их нет, копия лога остаётся чистой. */
[data-vibeui-block="collapsible-004"] [data-part="log"]{
counter-reset:vibeui-line;list-style:none;
margin:0;padding:0.625rem 0 0.75rem;
border-top:1px solid var(--vibeui-collapsible-004-border);
max-height:13rem;overflow:auto;
font-family:var(--vibeui-collapsible-004-mono);font-size:0.75rem;line-height:1.7;
}
[data-vibeui-block="collapsible-004"] [data-part="log"] li{
display:flex;gap:0.75rem;padding:0 0.875rem;color:var(--vibeui-collapsible-004-muted);
}
[data-vibeui-block="collapsible-004"] [data-part="log"] li::before{
counter-increment:vibeui-line;content:counter(vibeui-line);
flex:none;width:1.5rem;text-align:right;
color:oklch(1 0 0 / 30%);user-select:none;
}
[data-vibeui-block="collapsible-004"] [data-part="log"] li[data-level="warn"]{color:var(--vibeui-collapsible-004-warn)}
[data-vibeui-block="collapsible-004"] [data-part="log"] li[data-level="error"]{color:var(--vibeui-collapsible-004-error);background:oklch(0.7 0.18 22 / 10%)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Collapsible004Line[] = [
  { text: "▲ Next.js 16.0.1 — compiling registry" },
  { text: "indexes: 39 реестров, 463 items" },
  { text: "meta: проверено, ошибок нет" },
  { text: "warn  collapsible-004: preview шире карточки", level: "warn" },
  { text: "registry:build → public/r (463 файла)" },
  { text: "error  route /r/[name] не отдал JSON", level: "error" },
  { text: "build failed in 12.4s" },
]

/**
 * Свёрнутый лог сборки: итог виден в заголовке, номера строк рисует CSS.
 * Один файл, ноль зависимостей, клиентского кода нет.
 */
export function Collapsible004({
  title = "Вывод сборки",
  lines = DEFAULT_LINES,
  linesText = "{count} строк",
  errorsText = "{count} ошибки",
  accent,
  className,
  style,
  ...props
}: Collapsible004Props) {
  const failed = lines.filter((line) => line.level === "error").length

  const palette = {
    ...(accent ? { "--vibeui-collapsible-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-004" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-slot="collapsible"
        data-vibeui-block="collapsible-004"
        className={className}
        style={palette}
      >
        <summary>
          <span data-part="mark" aria-hidden="true" />
          {title}
          <span data-part="count">
            <span>{linesText.replace("{count}", String(lines.length))}</span>
            {failed > 0 ? (
              <b>{errorsText.replace("{count}", String(failed))}</b>
            ) : null}
          </span>
        </summary>
        <ol data-part="log">
          {lines.map((line) => (
            <li key={line.text} data-level={line.level ?? "info"}>
              <span>{line.text}</span>
            </li>
          ))}
        </ol>
      </details>
    </>
  )
}
