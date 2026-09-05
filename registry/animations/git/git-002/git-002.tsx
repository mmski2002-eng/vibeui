import type { ComponentProps, CSSProperties } from "react"

export type Git002LineType = "context" | "add" | "del"

export type Git002Line = {
  type: Git002LineType
  text: string
}

export type Git002Props = Omit<ComponentProps<"section">, "children" | "title"> & {
  title?: string
  fileName?: string
  lines?: Git002Line[]
  view?: "unified" | "split"
  accent?: string
  /** Отключает петлю анимации: диф сразу показан целиком, без пульса. */
  animate?: boolean
}

type SplitRow =
  | { kind: "context"; text: string }
  | { kind: "change"; left?: string; right?: string }

// Идея: файловый диф на моноширинном шрифте. В unified строки идут одна за
// другой с маркером +/- и цветной подложкой; в split удалённая и добавленная
// строка встают рядом в две колонки. Строки въезжают по очереди, у
// изменённых сразу после появления вспышка яркости (filter: brightness) —
// лёгкий highlight-pulse поверх подложки. Цикл зациклен и обрамлён общим
// fade, чтобы обрыв кадра на стыке петель был не виден.
const STYLES = `
:where([data-vibeui-block="git-002"]){
--vibeui-git-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-git-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-git-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-git-002-muted:color-mix(in oklab,var(--vibeui-git-002-fg) 58%,transparent);
--vibeui-git-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-git-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-git-002-add:light-dark(oklch(0.6 0.15 150),oklch(0.72 0.14 150));
--vibeui-git-002-add-bg:color-mix(in oklab,var(--vibeui-git-002-add) 16%,transparent);
--vibeui-git-002-del:light-dark(oklch(0.58 0.2 25),oklch(0.72 0.16 25));
--vibeui-git-002-del-bg:color-mix(in oklab,var(--vibeui-git-002-del) 16%,transparent);
--vibeui-git-002-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
--vibeui-git-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="git-002"]{color-scheme:dark}
[data-vibeui-block="git-002"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-git-002-fg);font-family:var(--vibeui-git-002-font);
}
[data-vibeui-block="git-002"] *{box-sizing:border-box}
[data-vibeui-block="git-002"] [data-part="card"]{
border-radius:0.875rem;border:1px solid var(--vibeui-git-002-border);
background:var(--vibeui-git-002-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="git-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5625rem 0.75rem;border-bottom:1px solid var(--vibeui-git-002-border);
}
[data-vibeui-block="git-002"] [data-part="gtitle"]{
margin:0;font-family:var(--vibeui-git-002-mono);font-size:0.6875rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="git-002"] [data-part="stat"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
font-family:var(--vibeui-git-002-mono);font-size:0.625rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="git-002"] [data-part="stat-add"]{color:var(--vibeui-git-002-add)}
[data-vibeui-block="git-002"] [data-part="stat-del"]{color:var(--vibeui-git-002-del)}
[data-vibeui-block="git-002"] [data-part="body"]{
display:flex;flex-direction:column;padding:0.375rem 0;
animation:vibeui-git-002-cycle 5s ease-in-out infinite;
}
[data-vibeui-block="git-002"][data-animate="false"] [data-part="body"]{animation:none;opacity:1}
[data-vibeui-block="git-002"] [data-part="row"]{
display:flex;align-items:stretch;min-width:0;opacity:0;
animation:vibeui-git-002-rise 5s linear infinite;
}
[data-vibeui-block="git-002"] [data-part="row"][data-changed="true"]{
animation-name:vibeui-git-002-rise-changed;
}
[data-vibeui-block="git-002"][data-animate="false"] [data-part="row"]{
animation:none;opacity:1;transform:none;filter:none;
}
[data-vibeui-block="git-002"] [data-part="marker"]{
flex:none;width:1.25rem;text-align:center;
font-family:var(--vibeui-git-002-mono);font-size:0.6875rem;font-weight:700;
line-height:1.55;user-select:none;
}
[data-vibeui-block="git-002"] [data-part="code"]{
flex:1;min-width:0;padding:0 0.625rem 0 0;
font-family:var(--vibeui-git-002-mono);font-size:0.6875rem;line-height:1.55;
white-space:pre;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="git-002"] [data-type="add"] [data-part="marker"]{color:var(--vibeui-git-002-add)}
[data-vibeui-block="git-002"] [data-type="add"]{background:var(--vibeui-git-002-add-bg)}
[data-vibeui-block="git-002"] [data-type="del"] [data-part="marker"]{color:var(--vibeui-git-002-del)}
[data-vibeui-block="git-002"] [data-type="del"]{background:var(--vibeui-git-002-del-bg)}
[data-vibeui-block="git-002"] [data-type="context"] [data-part="marker"]{color:var(--vibeui-git-002-muted)}
[data-vibeui-block="git-002"][data-view="split"] [data-part="row"]{
display:grid;grid-template-columns:1fr 1px 1fr;align-items:stretch;
}
[data-vibeui-block="git-002"][data-view="split"] [data-part="row"][data-kind="context"]{
grid-template-columns:1fr;
}
[data-vibeui-block="git-002"] [data-part="col"]{display:flex;align-items:stretch;min-width:0}
[data-vibeui-block="git-002"] [data-part="col"][data-empty="true"]{background:color-mix(in oklab,var(--vibeui-git-002-fg) 3%,transparent)}
[data-vibeui-block="git-002"] [data-part="divider"]{background:var(--vibeui-git-002-border)}
@keyframes vibeui-git-002-cycle{
0%{opacity:0}
4%{opacity:1}
90%{opacity:1}
97%,100%{opacity:0}
}
@keyframes vibeui-git-002-rise{
0%{opacity:0;transform:translateY(4px)}
4%{opacity:1;transform:none}
100%{opacity:1;transform:none}
}
@keyframes vibeui-git-002-rise-changed{
0%{opacity:0;transform:translateY(4px);filter:brightness(1)}
4%{opacity:1;transform:none;filter:brightness(1.7)}
16%{filter:brightness(1)}
100%{opacity:1;transform:none;filter:brightness(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="git-002"] [data-part="body"]{animation:none;opacity:1}
[data-vibeui-block="git-002"] [data-part="row"]{animation:none;opacity:1;transform:none;filter:none}
}
`

const DEFAULT_LINES: Git002Line[] = [
  { type: "context", text: "function Price({ value }: PriceProps) {" },
  { type: "del", text: "  const label = `$${value.toFixed(2)}`" },
  { type: "del", text: "  return <span>{label}</span>" },
  { type: "add", text: "  const label = formatCurrency(value)" },
  { type: "add", text: "  return <span aria-label={label}>{label}</span>" },
  { type: "context", text: "}" },
]

function toSplitRows(lines: Git002Line[]): SplitRow[] {
  const rows: SplitRow[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.type === "context") {
      rows.push({ kind: "context", text: line.text })
      index++
      continue
    }

    const dels: string[] = []
    while (lines[index]?.type === "del") {
      dels.push(lines[index].text)
      index++
    }

    const adds: string[] = []
    while (lines[index]?.type === "add") {
      adds.push(lines[index].text)
      index++
    }

    const pairs = Math.max(dels.length, adds.length)
    for (let pair = 0; pair < pairs; pair++) {
      rows.push({ kind: "change", left: dels[pair], right: adds[pair] })
    }
  }

  return rows
}

const MARKER: Record<Git002LineType, string> = {
  context: " ",
  add: "+",
  del: "-",
}

/**
 * Файловый диф: unified или split, изменённые строки со вспышкой яркости
 * при появлении. Один файл, ноль зависимостей, собственная палитра.
 */
export function Git002({
  title,
  fileName = "price.tsx",
  lines = DEFAULT_LINES,
  view = "unified",
  accent,
  animate = true,
  className,
  style,
  ...props
}: Git002Props) {
  const palette = {
    ...(accent ? { "--vibeui-git-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const additions = lines.filter((line) => line.type === "add").length
  const deletions = lines.filter((line) => line.type === "del").length
  const heading = title ?? fileName

  const rowDelay = (index: number) => `${0.15 + index * 0.3}s`

  return (
    <>
      <style href="vibeui-git-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="git-002"
        data-slot="git-diff"
        data-view={view}
        data-animate={animate ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{heading}</p>
            <span data-part="stat">
              <span data-part="stat-add">+{additions}</span>
              <span data-part="stat-del">-{deletions}</span>
            </span>
          </div>
          <div data-part="body">
            {view === "split"
              ? toSplitRows(lines).map((row, index) =>
                  row.kind === "context" ? (
                    <div
                      data-part="row"
                      data-kind="context"
                      key={`context-${index}`}
                      style={{ animationDelay: rowDelay(index) }}
                    >
                      <span data-type="context" data-part="col">
                        <span data-part="marker">{MARKER.context}</span>
                        <span data-part="code">{row.text}</span>
                      </span>
                    </div>
                  ) : (
                    <div
                      data-part="row"
                      data-kind="change"
                      data-changed="true"
                      key={`change-${index}`}
                      style={{ animationDelay: rowDelay(index) }}
                    >
                      <span
                        data-type="del"
                        data-part="col"
                        data-empty={row.left ? undefined : "true"}
                      >
                        {row.left ? (
                          <>
                            <span data-part="marker">{MARKER.del}</span>
                            <span data-part="code">{row.left}</span>
                          </>
                        ) : null}
                      </span>
                      <span data-part="divider" aria-hidden="true" />
                      <span
                        data-type="add"
                        data-part="col"
                        data-empty={row.right ? undefined : "true"}
                      >
                        {row.right ? (
                          <>
                            <span data-part="marker">{MARKER.add}</span>
                            <span data-part="code">{row.right}</span>
                          </>
                        ) : null}
                      </span>
                    </div>
                  ),
                )
              : lines.map((line, index) => (
                  <div
                    data-part="row"
                    data-type={line.type}
                    data-changed={line.type === "context" ? undefined : "true"}
                    key={`${line.type}-${index}`}
                    style={{ animationDelay: rowDelay(index) }}
                  >
                    <span data-part="marker">{MARKER[line.type]}</span>
                    <span data-part="code">{line.text}</span>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  )
}
