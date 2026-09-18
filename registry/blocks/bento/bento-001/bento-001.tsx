import type { CSSProperties } from "react"

export type Bento001Feature = {
  title: string
  text: string
  /** Микродемо на CSS: rows — бегущие строки, sort — стрелка и перестановка, group — свёртка, types — подсказка типов, size — линейка, none. */
  demo?: "rows" | "sort" | "group" | "types" | "size" | "none"
  /** Плитка на две колонки. */
  wide?: boolean
}

export type Bento001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  features?: readonly Bento001Feature[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Возможности библиотеки bento-плитками, в каждой — микродемо на чистом
// CSS: строки, которые бесконечно бегут вверх (виртуализация), три
// строки, меняющиеся местами по наведению (сортировка), группа, которая
// сворачивается по наведению, всплывающая подсказка типов, линейка размера.
// Плитки на линиях без теней; широкая плитка занимает две колонки.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-001"]){
--vibeui-bento-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-001-muted:color-mix(in oklab,var(--vibeui-bento-001-fg) 60%,var(--vibeui-bento-001-bg));
--vibeui-bento-001-line:color-mix(in oklab,var(--vibeui-bento-001-fg) 12%,transparent);
--vibeui-bento-001-panel:color-mix(in oklab,var(--vibeui-bento-001-fg) 4%,var(--vibeui-bento-001-bg));
--vibeui-bento-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-001"]{color-scheme:dark}
:where([data-vibeui-block="bento-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-001-panel);color:var(--vibeui-bento-001-fg);font-family:var(--vibeui-bento-001-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bento-001"] *{box-sizing:border-box}
[data-vibeui-block="bento-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-001-mono);font-size:.75rem;color:var(--vibeui-bento-001-accent)}
[data-vibeui-block="bento-001"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.6cqi,3.2rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="bento-001"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-bento-001-muted)}
[data-vibeui-block="bento-001"] [data-part="grid"]{display:grid;gap:1px;margin-top:2.5rem;background:var(--vibeui-bento-001-line);border:1px solid var(--vibeui-bento-001-line);border-radius:12px;overflow:hidden}
[data-vibeui-block="bento-001"] [data-part="tile"]{display:flex;flex-direction:column;gap:1rem;padding:1.5rem;background:var(--vibeui-bento-001-bg);min-height:16rem;transition:background .25s}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover{background:color-mix(in oklab,var(--vibeui-bento-001-accent) 4%,var(--vibeui-bento-001-bg))}
[data-vibeui-block="bento-001"] [data-part="tile"] h3{margin:0;font-size:1.15rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="bento-001"] [data-part="tile"] p{margin:0;color:var(--vibeui-bento-001-muted);font-size:.92rem}
[data-vibeui-block="bento-001"] [data-part="demo"]{margin-top:auto;height:6.5rem;border-radius:8px;border:1px solid var(--vibeui-bento-001-line);background:var(--vibeui-bento-001-panel);overflow:hidden;position:relative;font-family:var(--vibeui-bento-001-mono);font-size:.72rem;color:var(--vibeui-bento-001-muted)}
[data-vibeui-block="bento-001"] [data-part="row"]{display:flex;gap:.6rem;align-items:center;padding:.45rem .8rem;border-bottom:1px solid var(--vibeui-bento-001-line);background:var(--vibeui-bento-001-bg)}
[data-vibeui-block="bento-001"] [data-part="row"] i{display:block;height:.45rem;border-radius:3px;background:var(--vibeui-bento-001-line)}
[data-vibeui-block="bento-001"] [data-part="row"] i:first-child{width:38%}
[data-vibeui-block="bento-001"] [data-part="row"] i:nth-child(2){width:18%}
[data-vibeui-block="bento-001"] [data-part="row"] i:nth-child(3){width:24%;margin-left:auto;background:color-mix(in oklab,var(--vibeui-bento-001-accent) 45%,var(--vibeui-bento-001-line))}
[data-vibeui-block="bento-001"] [data-demo="rows"] [data-part="stack"]{animation:vibeui-bento-001-scroll 6s linear infinite}
[data-vibeui-block="bento-001"] [data-demo="rows"]::after{content:"virtual · 12 of 48 000";position:absolute;right:.6rem;bottom:.5rem;padding:.15rem .4rem;border-radius:4px;background:var(--vibeui-bento-001-accent);color:var(--vibeui-bento-001-bg);font-size:.62rem}
[data-vibeui-block="bento-001"] [data-demo="sort"] [data-part="row"]{transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-demo="sort"] [data-part="row"]:nth-child(1){transform:translateY(200%)}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-demo="sort"] [data-part="row"]:nth-child(3){transform:translateY(-200%)}
[data-vibeui-block="bento-001"] [data-demo="sort"]::after{content:"size ↓";position:absolute;right:.6rem;top:.5rem;color:var(--vibeui-bento-001-accent);font-size:.62rem;opacity:0;transition:opacity .3s}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-demo="sort"]::after{opacity:1}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="row"][data-head="true"]{color:var(--vibeui-bento-001-accent);cursor:default}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="row"][data-head="true"]::before{content:"▾";display:inline-block;transition:transform .3s}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-demo="group"] [data-part="row"][data-head="true"]::before{transform:rotate(-90deg)}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="fold"]{display:grid;grid-template-rows:1fr;transition:grid-template-rows .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-demo="group"] [data-part="fold"]{grid-template-rows:0fr}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="fold"] > div{overflow:hidden}
[data-vibeui-block="bento-001"] [data-demo="types"]{padding:.8rem;font-size:.75rem;color:var(--vibeui-bento-001-fg)}
[data-vibeui-block="bento-001"] [data-demo="types"] b{color:var(--vibeui-bento-001-accent);font-weight:500}
[data-vibeui-block="bento-001"] [data-demo="types"] [data-part="tip"]{position:absolute;left:1.6rem;top:2.9rem;padding:.5rem .7rem;border-radius:6px;background:var(--vibeui-bento-001-fg);color:var(--vibeui-bento-001-bg);font-size:.68rem;opacity:0;transform:translateY(.3rem);transition:opacity .3s,transform .3s;white-space:nowrap}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-demo="types"] [data-part="tip"]{opacity:1;transform:none}
[data-vibeui-block="bento-001"] [data-demo="size"]{display:grid;align-content:center;gap:.5rem;padding:.9rem}
[data-vibeui-block="bento-001"] [data-demo="size"] div{display:grid;grid-template-columns:5rem 1fr auto;gap:.6rem;align-items:center}
[data-vibeui-block="bento-001"] [data-demo="size"] i{display:block;height:.5rem;border-radius:3px;background:var(--vibeui-bento-001-line);width:calc(var(--vibeui-bento-001-w) * 100%);transform-origin:left;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bento-001"] [data-demo="size"] div:first-child i{background:var(--vibeui-bento-001-accent)}
@keyframes vibeui-bento-001-scroll{to{transform:translateY(-50%)}}
@container (min-width: 44rem){[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}[data-vibeui-block="bento-001"] [data-part="tile"][data-wide="true"]{grid-column:span 2}}
@container (min-width: 64rem){[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_FEATURES: Bento001Feature[] = [
  { title: "Виртуализация из коробки", text: "48 000 строк рендерятся как 12: в DOM только то, что в окне. Включается сама, когда строк больше двухсот.", demo: "rows", wide: true },
  { title: "Сортировка", text: "По любой колонке, с кастомным компаратором и стабильным порядком.", demo: "sort" },
  { title: "Группировка", text: "Один ключ — и строки собираются в раскрывающиеся группы с итогами.", demo: "group" },
  { title: "Типы выводятся из данных", text: "Колонки знают тип ячеек: редактор подскажет, TypeScript проверит.", demo: "types" },
  { title: "4 КБ и ноль зависимостей", text: "Меньше, чем иконка. Дерево-шейкинг: берёте только то, что используете.", demo: "size" },
]

function Demo({ kind }: { kind: NonNullable<Bento001Feature["demo"]> }) {
  const row = (key: number) => (
    <div key={key} data-part="row">
      <i />
      <i />
      <i />
    </div>
  )
  if (kind === "rows")
    return (
      <div data-part="demo" data-demo="rows" aria-hidden="true">
        <div data-part="stack">{Array.from({ length: 12 }, (_, i) => row(i))}</div>
      </div>
    )
  if (kind === "sort")
    return (
      <div data-part="demo" data-demo="sort" aria-hidden="true">
        {[0, 1, 2].map(row)}
      </div>
    )
  if (kind === "group")
    return (
      <div data-part="demo" data-demo="group" aria-hidden="true">
        <div data-part="row" data-head="true">
          pdf · 2
        </div>
        <div data-part="fold">
          <div>
            {[0, 1].map(row)}
          </div>
        </div>
        <div data-part="row" data-head="true">
          image · 3
        </div>
      </div>
    )
  if (kind === "types")
    return (
      <div data-part="demo" data-demo="types" aria-hidden="true">
        <div>
          row.<b>size</b>
        </div>
        <div data-part="tip">(property) size: number</div>
      </div>
    )
  if (kind === "size")
    return (
      <div data-part="demo" data-demo="size" aria-hidden="true">
        {[
          ["tabl", 0.12, "4.1"],
          ["другие", 0.55, "19"],
          ["ещё одни", 1, "38"],
        ].map(([name, w, kb]) => (
          <div key={String(name)}>
            <span>{name}</span>
            <i style={{ ["--vibeui-bento-001-w" as string]: w }} />
            <span>{kb} кб</span>
          </div>
        ))}
      </div>
    )
  return null
}

/** Возможности bento-плитками с CSS-микродемо. */
export function Bento001({
  eyebrow = "// возможности",
  title = "Всё, что нужно таблице. Ничего, что не нужно",
  lede = "Пять вещей, которые вы обычно пишете сами и потом чините. Здесь они написаны один раз.",
  features = DEFAULT_FEATURES,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento001Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-001-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-001-fg": ink } : null),
    ...(background ? { "--vibeui-bento-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            {features.map((feature) => (
              <article key={feature.title} data-part="tile" data-wide={feature.wide ?? false}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                {feature.demo && feature.demo !== "none" ? <Demo kind={feature.demo} /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
