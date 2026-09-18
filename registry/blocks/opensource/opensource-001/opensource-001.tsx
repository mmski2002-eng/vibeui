"use client"

import { useState, type CSSProperties } from "react"

export type Opensource001Row = {
  name: string
  type: string
  size: number
  updated: string
}

export type Opensource001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  rows?: readonly Opensource001Row[]
  sortLabel?: string
  groupLabel?: string
  zebraLabel?: string
  compactLabel?: string
  codeLabel?: string
  resultLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Песочница библиотеки: код слева, живой результат справа. Четыре
// переключателя — сортировка по размеру, группировка по типу, зебра,
// компактно — меняют одновременно и сниппет (строки с опциями появляются и
// исчезают), и таблицу. Код подсвечен тремя цветами через <b>/<i>, без
// внешних библиотек; таблица настоящая, с thead и группами-строками.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="opensource-001"]){
--vibeui-opensource-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-opensource-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-opensource-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-opensource-001-on-accent:oklch(from var(--vibeui-opensource-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-opensource-001-muted:color-mix(in oklab,var(--vibeui-opensource-001-fg) 60%,var(--vibeui-opensource-001-bg));
--vibeui-opensource-001-line:color-mix(in oklab,var(--vibeui-opensource-001-fg) 12%,transparent);
--vibeui-opensource-001-panel:color-mix(in oklab,var(--vibeui-opensource-001-fg) 4%,var(--vibeui-opensource-001-bg));
--vibeui-opensource-001-term:#0f1117;
--vibeui-opensource-001-term-fg:#d7dbe3;
--vibeui-opensource-001-key:#79c0ff;
--vibeui-opensource-001-str:#a5d6ff;
--vibeui-opensource-001-green:#7ee787;
--vibeui-opensource-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-opensource-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="opensource-001"]{color-scheme:dark}
:where([data-vibeui-block="opensource-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="opensource-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="opensource-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-opensource-001-bg);color:var(--vibeui-opensource-001-fg);font-family:var(--vibeui-opensource-001-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="opensource-001"] *{box-sizing:border-box}
[data-vibeui-block="opensource-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="opensource-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-opensource-001-mono);font-size:.75rem;color:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.6cqi,3.2rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="opensource-001"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-opensource-001-muted)}
[data-vibeui-block="opensource-001"] [data-part="toggles"]{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.8rem}
[data-vibeui-block="opensource-001"] [data-part="toggle"]{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .8rem;border-radius:6px;border:1px solid var(--vibeui-opensource-001-line);background:var(--vibeui-opensource-001-panel);color:inherit;font:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:border-color .2s,background .2s}
[data-vibeui-block="opensource-001"] [data-part="toggle"][aria-pressed="true"]{border-color:var(--vibeui-opensource-001-accent);background:color-mix(in oklab,var(--vibeui-opensource-001-accent) 10%,var(--vibeui-opensource-001-bg))}
[data-vibeui-block="opensource-001"] [data-part="toggle"] i{width:1.6rem;height:.9rem;border-radius:999px;background:var(--vibeui-opensource-001-line);position:relative;transition:background .2s}
[data-vibeui-block="opensource-001"] [data-part="toggle"] i::after{content:"";position:absolute;top:.1rem;left:.1rem;width:.7rem;height:.7rem;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgb(0 0 0 / .3);transition:transform .2s}
[data-vibeui-block="opensource-001"] [data-part="toggle"][aria-pressed="true"] i{background:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] [data-part="toggle"][aria-pressed="true"] i::after{transform:translateX(.7rem)}
[data-vibeui-block="opensource-001"] [data-part="panes"]{display:grid;gap:1rem;margin-top:1.2rem}
[data-vibeui-block="opensource-001"] [data-part="pane"]{border:1px solid var(--vibeui-opensource-001-line);border-radius:10px;overflow:hidden;background:var(--vibeui-opensource-001-bg)}
[data-vibeui-block="opensource-001"] [data-part="head"]{display:flex;align-items:center;gap:.5rem;padding:.6rem .9rem;border-bottom:1px solid var(--vibeui-opensource-001-line);font-family:var(--vibeui-opensource-001-mono);font-size:.72rem;color:var(--vibeui-opensource-001-muted)}
[data-vibeui-block="opensource-001"] [data-part="head"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-opensource-001-green)}
[data-vibeui-block="opensource-001"] [data-part="code"]{margin:0;padding:1rem 1.1rem;background:var(--vibeui-opensource-001-term);color:var(--vibeui-opensource-001-term-fg);font-family:var(--vibeui-opensource-001-mono);font-size:.82rem;line-height:1.65;overflow:auto;min-height:18rem}
[data-vibeui-block="opensource-001"] [data-part="code"] b{font-weight:500;color:var(--vibeui-opensource-001-key)}
[data-vibeui-block="opensource-001"] [data-part="code"] i{font-style:normal;color:var(--vibeui-opensource-001-str)}
[data-vibeui-block="opensource-001"] [data-part="code"] u{text-decoration:none;color:var(--vibeui-opensource-001-green)}
[data-vibeui-block="opensource-001"] [data-part="code"] [data-new="true"]{background:color-mix(in oklab,var(--vibeui-opensource-001-green) 16%,transparent);display:inline-block;width:100%;animation:vibeui-opensource-001-in .4s}
[data-vibeui-block="opensource-001"] table{width:100%;border-collapse:collapse;font-size:.88rem}
[data-vibeui-block="opensource-001"] th,[data-vibeui-block="opensource-001"] td{text-align:left;padding:.7rem .9rem;border-bottom:1px solid var(--vibeui-opensource-001-line);transition:padding .2s}
[data-vibeui-block="opensource-001"] [data-compact="true"] th,[data-vibeui-block="opensource-001"] [data-compact="true"] td{padding:.4rem .9rem}
[data-vibeui-block="opensource-001"] th{font-family:var(--vibeui-opensource-001-mono);font-size:.7rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-opensource-001-muted);background:var(--vibeui-opensource-001-panel)}
[data-vibeui-block="opensource-001"] th[data-sorted="true"]{color:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] th[data-sorted="true"]::after{content:" ↓"}
[data-vibeui-block="opensource-001"] [data-zebra="true"] tbody tr:nth-child(even) td{background:var(--vibeui-opensource-001-panel)}
[data-vibeui-block="opensource-001"] tr[data-group="true"] td{font-family:var(--vibeui-opensource-001-mono);font-size:.72rem;color:var(--vibeui-opensource-001-accent);background:color-mix(in oklab,var(--vibeui-opensource-001-accent) 8%,var(--vibeui-opensource-001-bg))!important;padding-top:.5rem;padding-bottom:.5rem}
[data-vibeui-block="opensource-001"] td[data-num]{font-family:var(--vibeui-opensource-001-mono);font-variant-numeric:tabular-nums}
[data-vibeui-block="opensource-001"] [data-part="type"]{display:inline-block;padding:.1rem .45rem;border-radius:4px;font-family:var(--vibeui-opensource-001-mono);font-size:.7rem;border:1px solid var(--vibeui-opensource-001-line)}
[data-vibeui-block="opensource-001"] button:focus-visible{outline:2px solid var(--vibeui-opensource-001-accent);outline-offset:2px}
@keyframes vibeui-opensource-001-in{from{opacity:0;transform:translateX(-.3rem)}to{opacity:1;transform:none}}
@container (min-width: 60rem){[data-vibeui-block="opensource-001"] [data-part="panes"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="opensource-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ROWS: Opensource001Row[] = [
  { name: "invoice-0412.pdf", type: "pdf", size: 412, updated: "сегодня" },
  { name: "logo.svg", type: "image", size: 18, updated: "вчера" },
  { name: "report-q3.xlsx", type: "sheet", size: 1290, updated: "3 дня" },
  { name: "cover.webp", type: "image", size: 240, updated: "неделю" },
  { name: "contract.pdf", type: "pdf", size: 980, updated: "месяц" },
  { name: "budget.xlsx", type: "sheet", size: 2100, updated: "месяц" },
]

/** Песочница: переключатели меняют и код, и живую таблицу. */
export function Opensource001({
  eyebrow = "// песочница",
  title = "Попробуйте, не устанавливая",
  lede = "Каждый переключатель — одна опция в коде. Слева то, что вы напишете, справа то, что получите.",
  rows = DEFAULT_ROWS,
  sortLabel = "сортировать по размеру",
  groupLabel = "группировать по типу",
  zebraLabel = "зебра",
  compactLabel = "компактно",
  codeLabel = "table.tsx",
  resultLabel = "результат",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Opensource001Props) {
  const [sort, setSort] = useState(false)
  const [group, setGroup] = useState(false)
  const [zebra, setZebra] = useState(false)
  const [compact, setCompact] = useState(false)

  const sorted = sort ? [...rows].sort((a, b) => b.size - a.size) : [...rows]
  const groups = group ? [...new Set(sorted.map((row) => row.type))].map((type) => ({ type, rows: sorted.filter((row) => row.type === type) })) : [{ type: "", rows: sorted }]

  const palette = {
    ...(accent ? { "--vibeui-opensource-001-accent": accent } : null),
    ...(ink ? { "--vibeui-opensource-001-fg": ink } : null),
    ...(background ? { "--vibeui-opensource-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const toggles = [
    { label: sortLabel, value: sort, set: setSort },
    { label: groupLabel, value: group, set: setGroup },
    { label: zebraLabel, value: zebra, set: setZebra },
    { label: compactLabel, value: compact, set: setCompact },
  ]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-opensource-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="opensource-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="toggles">
            {toggles.map((toggle) => (
              <button key={toggle.label} type="button" data-part="toggle" aria-pressed={toggle.value} onClick={() => toggle.set(!toggle.value)}>
                <i aria-hidden="true" />
                {toggle.label}
              </button>
            ))}
          </div>
          <div data-part="panes">
            <div data-part="pane">
              <div data-part="head">{codeLabel}</div>
              <pre data-part="code">
                <b>import</b> {"{ useTable }"} <b>from</b> <i>&quot;tabl&quot;</i>
                {"\n\n"}
                <b>const</b> table = <u>useTable</u>({"{"}
                {"\n"}  data,
                {"\n"}  columns: [<i>&quot;name&quot;</i>, <i>&quot;type&quot;</i>, <i>&quot;size&quot;</i>, <i>&quot;updated&quot;</i>],
                {sort ? (
                  <span data-new="true">
                    {"\n"}  sort: {"{ by: "}
                    <i>&quot;size&quot;</i>
                    {", dir: "}
                    <i>&quot;desc&quot;</i>
                    {" }"},
                  </span>
                ) : null}
                {group ? (
                  <span data-new="true">
                    {"\n"}  groupBy: <i>&quot;type&quot;</i>,
                  </span>
                ) : null}
                {zebra || compact ? (
                  <span data-new="true">
                    {"\n"}  view: {"{ "}
                    {zebra ? "zebra: true" : ""}
                    {zebra && compact ? ", " : ""}
                    {compact ? "density: " : ""}
                    {compact ? <i>&quot;compact&quot;</i> : null}
                    {" }"},
                  </span>
                ) : null}
                {"\n})"}
                {"\n\n"}
                <b>return</b> {"<"}
                <u>Table</u> {"{...table.props} />"}
              </pre>
            </div>
            <div data-part="pane">
              <div data-part="head">{resultLabel}</div>
              <table data-zebra={zebra} data-compact={compact}>
                <thead>
                  <tr>
                    <th>name</th>
                    <th>type</th>
                    <th data-sorted={sort}>size, kb</th>
                    <th>updated</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((section) => (
                    <GroupRows key={section.type || "all"} section={section} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function GroupRows({ section }: { section: { type: string; rows: Opensource001Row[] } }) {
  return (
    <>
      {section.type ? (
        <tr data-group="true">
          <td colSpan={4}>
            {section.type} · {section.rows.length}
          </td>
        </tr>
      ) : null}
      {section.rows.map((row) => (
        <tr key={row.name}>
          <td>{row.name}</td>
          <td>
            <span data-part="type">{row.type}</span>
          </td>
          <td data-num="">{row.size}</td>
          <td>{row.updated}</td>
        </tr>
      ))}
    </>
  )
}
