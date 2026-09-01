import type { CSSProperties } from "react"

export type Codeblock020Props = {
  version?: string
  date?: string
  dateLabel?: string
  runtime?: string
  stale?: boolean
  code?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: у примера кода есть срок годности. Версия и дата стоят в
// шапке рядом с кодом, а признак устаревания перекрашивает штамп и меняет
// подпись в подвале — читатель сразу видит, можно ли этому примеру верить.
const STYLES = `
:where([data-vibeui-block="codeblock-020"]){
--vibeui-codeblock-020-bg:oklch(0.2 0.014 250);
--vibeui-codeblock-020-head:oklch(0.24 0.018 250);
--vibeui-codeblock-020-fg:oklch(0.93 0.008 250);
--vibeui-codeblock-020-muted:oklch(0.67 0.016 250);
--vibeui-codeblock-020-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-020-fresh:oklch(0.83 0.14 152);
--vibeui-codeblock-020-fresh-bg:oklch(0.5 0.13 152 / 22%);
--vibeui-codeblock-020-stale:oklch(0.84 0.14 75);
--vibeui-codeblock-020-stale-bg:oklch(0.55 0.13 75 / 22%);
--vibeui-codeblock-020-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-020"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-020-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-020-bg);color:var(--vibeui-codeblock-020-fg);
font-family:var(--vibeui-codeblock-020-font);
}
[data-vibeui-block="codeblock-020"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
padding:0.5rem 0.75rem;
background:var(--vibeui-codeblock-020-head);
border-bottom:1px solid var(--vibeui-codeblock-020-border);
font-size:0.75rem;color:var(--vibeui-codeblock-020-muted);
}
/* Штамп версии красится тем же признаком, что и подпись в подвале: два
   источника правды разъехались бы, и блок соврал бы про актуальность. */
[data-vibeui-block="codeblock-020"] [data-part="version"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5rem;border-radius:999px;
font-family:var(--vibeui-codeblock-020-mono);font-size:0.6875rem;font-weight:700;
background:var(--vibeui-codeblock-020-fresh-bg);
color:var(--vibeui-codeblock-020-fresh);
}
[data-vibeui-block="codeblock-020"] [data-part="version"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor;
}
[data-vibeui-block="codeblock-020"] time{
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="codeblock-020"] [data-part="runtime"]{
margin-inline-start:auto;font-family:var(--vibeui-codeblock-020-mono);
}
[data-vibeui-block="codeblock-020"] pre{margin:0;padding:0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-020"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-020-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-020"] [data-part="foot"]{
display:flex;align-items:center;gap:0.5rem;margin:0;
padding:0.5rem 0.75rem;
border-top:1px solid var(--vibeui-codeblock-020-border);
background:var(--vibeui-codeblock-020-head);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-codeblock-020-muted);
}
[data-vibeui-block="codeblock-020"] [data-part="foot"]::before{
content:"✓";flex:none;color:var(--vibeui-codeblock-020-fresh);font-weight:700;
}
[data-vibeui-block="codeblock-020"][data-stale="true"] [data-part="version"]{
background:var(--vibeui-codeblock-020-stale-bg);
color:var(--vibeui-codeblock-020-stale);
}
[data-vibeui-block="codeblock-020"][data-stale="true"] [data-part="foot"]::before{
content:"!";color:var(--vibeui-codeblock-020-stale);
}
`

const CODE = `import { defineConfig } from "vibeui/config"

export default defineConfig({
  registry: "https://vibeui.dev/r",
  style: "base-nova",
})`

/** Блок кода со штампом версии и датой проверки примера. */
export function Codeblock020({
  version = "v2.4.0",
  date = "2026-08-14",
  dateLabel = "14 августа 2026",
  runtime = "next@16",
  stale = false,
  code = CODE,
  className,
  style,
}: Codeblock020Props) {
  return (
    <>
      <style href="vibeui-codeblock-020" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-020"
        data-stale={stale || undefined}
        className={className}
        style={style}
      >
        <figcaption data-part="head">
          <span data-part="version">{version}</span>
          <time dateTime={date}>{dateLabel}</time>
          <span data-part="runtime">{runtime}</span>
        </figcaption>
        <pre>
          <code>{code}</code>
        </pre>
        <p data-part="foot">
          {stale
            ? `Пример писали для ${version}: с тех пор вышли новые версии — сверьтесь с документацией.`
            : `Пример проверен на ${version} и ${runtime}.`}
        </p>
      </figure>
    </>
  )
}
