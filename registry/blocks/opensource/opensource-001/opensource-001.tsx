"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Opensource001Row = {
  name: string
  type: string
  size: number
  updated: string
}

export type Opensource001Step = {
  title: string
  text: string
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
  /** Шаги scroll-сцены на широком экране: по одному на переключатель, в том же порядке. */
  steps?: readonly Opensource001Step[]
  /** aria списка шагов. */
  stepsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Песочница библиотеки как sticky-сцена: на широком экране слева четыре
// шага-карточки, справа прилипшие код и живая таблица. Прокрутка проходит
// шаги — и опции включаются сами: строка появляется в сниппете, таблица
// пересортировывается, группируется, красится зеброй, уплотняется. Любой
// клик по переключателю отдаёт управление руке. На узком экране шаги
// прячутся, остаются переключатели. Строки таблицы перестраиваются
// каскадом, заголовок въезжает словами через маски.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

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
--vibeui-opensource-001-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-opensource-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-opensource-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="opensource-001"]{color-scheme:dark}
:where([data-vibeui-block="opensource-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="opensource-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="opensource-001"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-opensource-001-bg);color:var(--vibeui-opensource-001-fg);font-family:var(--vibeui-opensource-001-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="opensource-001"] *{box-sizing:border-box}
[data-vibeui-block="opensource-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="opensource-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-opensource-001-mono);font-size:.75rem;color:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] [data-part="title"]{margin:0;max-width:46rem;font-weight:800;font-size:clamp(2.2rem,5.2cqi,3.8rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="opensource-001"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.05em .1em .18em 0;margin:-.05em -.1em -.18em 0}
[data-vibeui-block="opensource-001"] [data-part="w"] > span{display:inline-block;transform:translateY(110%)}
[data-vibeui-block="opensource-001"][data-shown="true"] [data-part="w"] > span{animation:vibeui-opensource-001-rise .8s var(--vibeui-opensource-001-ease) forwards;animation-delay:calc(var(--vibeui-opensource-001-i,0) * .05s)}
[data-vibeui-block="opensource-001"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-opensource-001-muted);font-size:1.05rem}
[data-vibeui-block="opensource-001"] [data-reveal]{opacity:0}
[data-vibeui-block="opensource-001"][data-shown="true"] [data-reveal]{opacity:1;animation:vibeui-opensource-001-up .8s var(--vibeui-opensource-001-ease) backwards;animation-delay:calc(.15s + var(--vibeui-opensource-001-i,0) * .09s)}
[data-vibeui-block="opensource-001"] [data-part="toggles"]{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.8rem}
[data-vibeui-block="opensource-001"] [data-part="toggle"]{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .8rem;border-radius:8px;border:1px solid var(--vibeui-opensource-001-line);background:var(--vibeui-opensource-001-panel);color:inherit;font:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:border-color .2s,background .3s,transform .3s var(--vibeui-opensource-001-ease),box-shadow .3s}
[data-vibeui-block="opensource-001"] [data-part="toggle"]:hover{transform:translateY(-2px);box-shadow:0 10px 24px -14px color-mix(in oklab,var(--vibeui-opensource-001-accent) 60%,transparent)}
[data-vibeui-block="opensource-001"] [data-part="toggle"][aria-pressed="true"]{border-color:var(--vibeui-opensource-001-accent);background:color-mix(in oklab,var(--vibeui-opensource-001-accent) 10%,var(--vibeui-opensource-001-bg))}
[data-vibeui-block="opensource-001"] [data-part="toggle"] i{width:1.6rem;height:.9rem;border-radius:999px;background:var(--vibeui-opensource-001-line);position:relative;transition:background .25s}
[data-vibeui-block="opensource-001"] [data-part="toggle"] i::after{content:"";position:absolute;top:.1rem;left:.1rem;width:.7rem;height:.7rem;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgb(0 0 0 / .3);transition:transform .3s var(--vibeui-opensource-001-ease)}
[data-vibeui-block="opensource-001"] [data-part="toggle"][aria-pressed="true"] i{background:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] [data-part="toggle"][aria-pressed="true"] i::after{transform:translateX(.7rem)}
[data-vibeui-block="opensource-001"] [data-part="scene"]{display:grid;gap:1rem;margin-top:1.4rem}
[data-vibeui-block="opensource-001"] [data-part="steps"]{display:none;margin:0;padding:0;list-style:none}
[data-vibeui-block="opensource-001"] [data-part="step"]{display:flex;align-items:center;min-height:52svh}
[data-vibeui-block="opensource-001"] [data-part="step"] > div{padding:1.4rem 1.5rem;border-radius:14px;border:1px solid var(--vibeui-opensource-001-line);background:var(--vibeui-opensource-001-panel);transition:border-color .4s,background .4s,transform .5s var(--vibeui-opensource-001-ease),box-shadow .5s;width:100%}
[data-vibeui-block="opensource-001"] [data-part="step"][data-active="true"] > div{border-color:var(--vibeui-opensource-001-accent);background:color-mix(in oklab,var(--vibeui-opensource-001-accent) 6%,var(--vibeui-opensource-001-bg));transform:translateX(.4rem);box-shadow:0 20px 40px -28px color-mix(in oklab,var(--vibeui-opensource-001-accent) 70%,transparent)}
[data-vibeui-block="opensource-001"] [data-part="step"] b{display:inline-flex;align-items:center;justify-content:center;width:1.7rem;height:1.7rem;border-radius:50%;border:1px solid var(--vibeui-opensource-001-line);font-family:var(--vibeui-opensource-001-mono);font-size:.75rem;font-weight:500;color:var(--vibeui-opensource-001-muted);transition:background .3s,color .3s,border-color .3s}
[data-vibeui-block="opensource-001"] [data-part="step"][data-active="true"] b{background:var(--vibeui-opensource-001-accent);color:var(--vibeui-opensource-001-on-accent);border-color:transparent}
[data-vibeui-block="opensource-001"] [data-part="step"] h3{margin:.8rem 0 .3rem;font-size:1.15rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="opensource-001"] [data-part="step"] p{margin:0;font-size:.92rem;color:var(--vibeui-opensource-001-muted)}
[data-vibeui-block="opensource-001"] [data-part="step"] code{font-family:var(--vibeui-opensource-001-mono);font-size:.82em;color:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] [data-part="panes"]{display:grid;gap:1rem;align-self:start}
[data-vibeui-block="opensource-001"] [data-part="pane"]{border:1px solid var(--vibeui-opensource-001-line);border-radius:12px;overflow:hidden;background:var(--vibeui-opensource-001-bg);box-shadow:0 30px 60px -40px color-mix(in oklab,var(--vibeui-opensource-001-accent) 40%,rgb(0 0 0 / .4))}
[data-vibeui-block="opensource-001"] [data-part="head"]{display:flex;align-items:center;gap:.5rem;padding:.6rem .9rem;border-bottom:1px solid var(--vibeui-opensource-001-line);font-family:var(--vibeui-opensource-001-mono);font-size:.72rem;color:var(--vibeui-opensource-001-muted)}
[data-vibeui-block="opensource-001"] [data-part="head"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-opensource-001-green);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-opensource-001-green) 50%,transparent);animation:vibeui-opensource-001-ping 2.4s ease-out infinite}
[data-vibeui-block="opensource-001"] [data-part="code"]{margin:0;padding:1rem 1.1rem;background:var(--vibeui-opensource-001-term);color:var(--vibeui-opensource-001-term-fg);font-family:var(--vibeui-opensource-001-mono);font-size:.82rem;line-height:1.65;overflow:auto;min-height:18rem}
[data-vibeui-block="opensource-001"] [data-part="code"] b{font-weight:500;color:var(--vibeui-opensource-001-key)}
[data-vibeui-block="opensource-001"] [data-part="code"] i{font-style:normal;color:var(--vibeui-opensource-001-str)}
[data-vibeui-block="opensource-001"] [data-part="code"] u{text-decoration:none;color:var(--vibeui-opensource-001-green)}
[data-vibeui-block="opensource-001"] [data-part="code"] [data-new="true"]{background:color-mix(in oklab,var(--vibeui-opensource-001-green) 16%,transparent);display:inline-block;width:100%;animation:vibeui-opensource-001-in .45s var(--vibeui-opensource-001-ease)}
[data-vibeui-block="opensource-001"] table{width:100%;border-collapse:collapse;font-size:.88rem}
[data-vibeui-block="opensource-001"] th,[data-vibeui-block="opensource-001"] td{text-align:left;padding:.7rem .9rem;border-bottom:1px solid var(--vibeui-opensource-001-line);transition:padding .3s var(--vibeui-opensource-001-ease),background .3s}
[data-vibeui-block="opensource-001"] [data-compact="true"] th,[data-vibeui-block="opensource-001"] [data-compact="true"] td{padding:.4rem .9rem}
[data-vibeui-block="opensource-001"] th{font-family:var(--vibeui-opensource-001-mono);font-size:.7rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-opensource-001-muted);background:var(--vibeui-opensource-001-panel);transition:color .3s}
[data-vibeui-block="opensource-001"] th[data-sorted="true"]{color:var(--vibeui-opensource-001-accent)}
[data-vibeui-block="opensource-001"] th[data-sorted="true"]::after{content:" ↓"}
[data-vibeui-block="opensource-001"] tbody tr{animation:vibeui-opensource-001-row .5s var(--vibeui-opensource-001-ease) backwards;animation-delay:calc(var(--vibeui-opensource-001-i,0) * .045s)}
[data-vibeui-block="opensource-001"] [data-zebra="true"] tbody tr:nth-child(even) td{background:var(--vibeui-opensource-001-panel)}
[data-vibeui-block="opensource-001"] tr[data-group="true"] td{font-family:var(--vibeui-opensource-001-mono);font-size:.72rem;color:var(--vibeui-opensource-001-accent);background:color-mix(in oklab,var(--vibeui-opensource-001-accent) 8%,var(--vibeui-opensource-001-bg))!important;padding-top:.5rem;padding-bottom:.5rem}
[data-vibeui-block="opensource-001"] td[data-num]{font-family:var(--vibeui-opensource-001-mono);font-variant-numeric:tabular-nums}
[data-vibeui-block="opensource-001"] [data-part="type"]{display:inline-block;padding:.1rem .45rem;border-radius:4px;font-family:var(--vibeui-opensource-001-mono);font-size:.7rem;border:1px solid var(--vibeui-opensource-001-line)}
[data-vibeui-block="opensource-001"] button:focus-visible{outline:2px solid var(--vibeui-opensource-001-accent);outline-offset:2px}
@keyframes vibeui-opensource-001-in{from{opacity:0;transform:translateX(-.3rem)}to{opacity:1;transform:none}}
@keyframes vibeui-opensource-001-row{from{opacity:0;transform:translateY(6px)}}
@keyframes vibeui-opensource-001-rise{to{transform:none}}
@keyframes vibeui-opensource-001-up{from{opacity:0;transform:translateY(22px)}}
@keyframes vibeui-opensource-001-ping{70%,100%{box-shadow:0 0 0 .5rem transparent}}
@container (min-width: 60rem){[data-vibeui-block="opensource-001"] [data-part="scene"]{grid-template-columns:minmax(0,.7fr) minmax(0,1.6fr);gap:3rem;align-items:start;margin-top:2rem}[data-vibeui-block="opensource-001"] [data-part="steps"]{display:grid;gap:1rem;padding:3rem 0}[data-vibeui-block="opensource-001"] [data-part="panes"]{position:sticky;top:5.5rem;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}[data-vibeui-block="opensource-001"] [data-part="toggles"]{margin-top:1.4rem}}
[data-vibeui-block="opensource-001"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="opensource-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="opensource-001"] [data-part="w"] > span{transform:none}[data-vibeui-block="opensource-001"] [data-reveal]{opacity:1}}`

const DEFAULT_ROWS: Opensource001Row[] = [
  { name: "invoice-0412.pdf", type: "pdf", size: 412, updated: "сегодня" },
  { name: "logo.svg", type: "image", size: 18, updated: "вчера" },
  { name: "report-q3.xlsx", type: "sheet", size: 1290, updated: "3 дня" },
  { name: "cover.webp", type: "image", size: 240, updated: "неделю" },
  { name: "contract.pdf", type: "pdf", size: 980, updated: "месяц" },
  { name: "budget.xlsx", type: "sheet", size: 2100, updated: "месяц" },
]

const DEFAULT_STEPS: Opensource001Step[] = [
  { title: "Сортировка", text: "`sort: { by: \"size\" }` — одна строка, и колонка отсортирована. Стабильно, с любым компаратором." },
  { title: "Группировка", text: "`groupBy: \"type\"` — строки собираются под заголовки с числом. Итоги считаются сами." },
  { title: "Зебра", text: "`view.zebra` — чётные строки подкрашены, длинную таблицу читать легче." },
  { title: "Компактно", text: "`density: \"compact\"` — на треть больше строк в том же окне. Всё ещё ваша разметка." },
]

/** Песочница-сцена: прокрутка включает опции, переключатели меняют и код, и живую таблицу. */
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
  steps = DEFAULT_STEPS,
  stepsLabel = "Шаги",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Opensource001Props) {
  const root = useRef<HTMLElement>(null)
  const stepList = useRef<HTMLOListElement>(null)
  const manual = useRef(false)
  const [shown, setShown] = useState(false)
  const [values, setValues] = useState([false, false, false, false])
  const [sort, group, zebra, compact] = values

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-12% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    const sync = () => {
      raf = 0
      const list = stepList.current
      if (!list || manual.current || list.offsetParent === null) return
      const middle = window.innerHeight * 0.55
      const passed = [...list.children].map((step) => step.getBoundingClientRect().top + step.getBoundingClientRect().height / 2 < middle)
      setValues((prev) => (prev.every((value, i) => value === (passed[i] ?? false)) ? prev : [0, 1, 2, 3].map((i) => passed[i] ?? false)))
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(sync)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  const flip = (index: number) => {
    manual.current = true
    setValues((prev) => prev.map((value, i) => (i === index ? !value : value)))
  }

  const sorted = sort ? [...rows].sort((a, b) => b.size - a.size) : [...rows]
  const groups = group ? [...new Set(sorted.map((row) => row.type))].map((type) => ({ type, rows: sorted.filter((row) => row.type === type) })) : [{ type: "", rows: sorted }]

  const palette = {
    ...(accent ? { "--vibeui-opensource-001-accent": accent } : null),
    ...(ink ? { "--vibeui-opensource-001-fg": ink } : null),
    ...(background ? { "--vibeui-opensource-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const toggles = [sortLabel, groupLabel, zebraLabel, compactLabel]
  const words = title.split(" ").filter(Boolean)
  const index = (value: number) => ({ ["--vibeui-opensource-001-i" as string]: value }) as CSSProperties
  const active = values.filter(Boolean).length
  let cursor = 0
  const sections = groups.map((section) => {
    const start = cursor
    cursor += section.rows.length + (section.type ? 1 : 0)
    return { ...section, start }
  })

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-opensource-001" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="opensource-001" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? (
            <p data-part="eyebrow" data-reveal="" style={index(-1)}>
              {eyebrow}
            </p>
          ) : null}
          <h2 data-part="title">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} data-part="w" style={index(wordIndex)}>
                <span>{word}</span>
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          {lede ? (
            <p data-part="lede" data-reveal="" style={index(1)}>
              {lede}
            </p>
          ) : null}
          <div data-part="toggles" data-reveal="" style={index(2)}>
            {toggles.map((label, toggleIndex) => (
              <button key={label} type="button" data-part="toggle" aria-pressed={values[toggleIndex]} onClick={() => flip(toggleIndex)}>
                <i aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <div data-part="scene">
            <ol ref={stepList} data-part="steps" aria-label={stepsLabel}>
              {steps.slice(0, 4).map((step, stepIndex) => (
                <li key={step.title} data-part="step" data-active={values[stepIndex]}>
                  <div>
                    <b aria-hidden="true">{stepIndex + 1}</b>
                    <h3>{step.title}</h3>
                    <p>{step.text.split(/(`[^`]+`)/).map((part, partIndex) => (part.startsWith("`") ? <code key={partIndex}>{part.slice(1, -1)}</code> : part))}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div data-part="panes" data-reveal="" style={index(3)}>
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
                <div data-part="head">
                  {resultLabel}
                  {active > 0 ? ` · ${active}/4` : ""}
                </div>
                <table data-zebra={zebra} data-compact={compact}>
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>type</th>
                      <th data-sorted={sort}>size, kb</th>
                      <th>updated</th>
                    </tr>
                  </thead>
                  <tbody key={`${sort}-${group}`}>
                    {sections.map((section) => (
                      <GroupRows key={section.type || "all"} section={section} start={section.start} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function GroupRows({ section, start }: { section: { type: string; rows: Opensource001Row[] }; start: number }) {
  const offset = section.type ? 1 : 0
  return (
    <>
      {section.type ? (
        <tr data-group="true" style={{ ["--vibeui-opensource-001-i" as string]: start }}>
          <td colSpan={4}>
            {section.type} · {section.rows.length}
          </td>
        </tr>
      ) : null}
      {section.rows.map((row, i) => (
        <tr key={row.name} style={{ ["--vibeui-opensource-001-i" as string]: start + offset + i }}>
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
