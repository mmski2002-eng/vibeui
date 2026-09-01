import type { CSSProperties } from "react"

export type Codeblock016Props = {
  title?: string
  defaultLanguage?: "TypeScript" | "JavaScript" | "Python"
  group?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: один и тот же пример на трёх языках. Переключатель —
// сегментированный, с бегунком, который едет за отмеченной радиокнопкой;
// сам бегунок двигает CSS через :has(), состояния в JS нет.
const STYLES = `
:where([data-vibeui-block="codeblock-016"]){
--vibeui-codeblock-016-bg:oklch(0.2 0.014 285);
--vibeui-codeblock-016-head:oklch(0.25 0.018 285);
--vibeui-codeblock-016-fg:oklch(0.94 0.006 285);
--vibeui-codeblock-016-muted:oklch(0.68 0.014 285);
--vibeui-codeblock-016-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-016-thumb:oklch(0.42 0.09 285);
--vibeui-codeblock-016-accent:oklch(0.84 0.13 285);
--vibeui-codeblock-016-keyword:oklch(0.8 0.13 320);
--vibeui-codeblock-016-string:oklch(0.83 0.12 145);
--vibeui-codeblock-016-comment:oklch(0.61 0.02 285);
--vibeui-codeblock-016-number:oklch(0.85 0.12 72);
--vibeui-codeblock-016-type:oklch(0.83 0.11 230);
--vibeui-codeblock-016-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-016"]{
display:flex;flex-direction:column;
width:100%;max-width:33rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-016-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-016-bg);color:var(--vibeui-codeblock-016-fg);
font-family:var(--vibeui-codeblock-016-font);
}
[data-vibeui-block="codeblock-016"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
flex-wrap:wrap;padding:0.5rem 0.625rem;
background:var(--vibeui-codeblock-016-head);
border-bottom:1px solid var(--vibeui-codeblock-016-border);
}
[data-vibeui-block="codeblock-016"] [data-part="title"]{
font-size:0.75rem;color:var(--vibeui-codeblock-016-muted);
}
[data-vibeui-block="codeblock-016"] [data-part="switch"]{
position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
padding:0.1875rem;border-radius:999px;background:oklch(0 0 0 / 30%);
}
/* Бегунок едет за отмеченной кнопкой: подсветка не перерисовывается,
   а переезжает, поэтому переключение читается как одно движение. */
[data-vibeui-block="codeblock-016"] [data-part="thumb"]{
position:absolute;top:0.1875rem;bottom:0.1875rem;left:0.1875rem;
width:calc((100% - 0.375rem) / 3);border-radius:999px;
background:var(--vibeui-codeblock-016-thumb);
transition:transform .22s cubic-bezier(.32,.72,0,1);
pointer-events:none;
}
[data-vibeui-block="codeblock-016"]:has(input[value="1"]:checked) [data-part="thumb"]{transform:translateX(100%)}
[data-vibeui-block="codeblock-016"]:has(input[value="2"]:checked) [data-part="thumb"]{transform:translateX(200%)}
[data-vibeui-block="codeblock-016"] label{
position:relative;z-index:1;cursor:pointer;text-align:center;
padding:0.3125rem 0.625rem;border-radius:999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.01em;
color:var(--vibeui-codeblock-016-muted);
transition:color .18s ease;
}
[data-vibeui-block="codeblock-016"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-016"] label:has(input:checked){color:var(--vibeui-codeblock-016-fg)}
[data-vibeui-block="codeblock-016"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-016-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-016"] pre{display:none;margin:0;padding:0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-016"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-016-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-016"]:has(input[value="0"]:checked) pre[data-index="0"],
[data-vibeui-block="codeblock-016"]:has(input[value="1"]:checked) pre[data-index="1"],
[data-vibeui-block="codeblock-016"]:has(input[value="2"]:checked) pre[data-index="2"]{display:block}
[data-vibeui-block="codeblock-016"] [data-token="keyword"]{color:var(--vibeui-codeblock-016-keyword)}
[data-vibeui-block="codeblock-016"] [data-token="string"]{color:var(--vibeui-codeblock-016-string)}
[data-vibeui-block="codeblock-016"] [data-token="comment"]{color:var(--vibeui-codeblock-016-comment);font-style:italic}
[data-vibeui-block="codeblock-016"] [data-token="number"]{color:var(--vibeui-codeblock-016-number)}
[data-vibeui-block="codeblock-016"] [data-token="type"]{color:var(--vibeui-codeblock-016-type)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-016"] *{animation:none!important;transition:none!important}}
`

type Sample = {
  language: Codeblock016Props["defaultLanguage"]
  short: string
  lines: { text: string; kind?: string }[][]
}

const SAMPLES: Sample[] = [
  {
    language: "TypeScript",
    short: "TS",
    lines: [
      [
        { text: "async function ", kind: "keyword" },
        { text: "loadUser", kind: "type" },
        { text: "(id: " },
        { text: "string", kind: "type" },
        { text: ") {" },
      ],
      [
        { text: "  const", kind: "keyword" },
        { text: " res = " },
        { text: "await", kind: "keyword" },
        { text: " fetch(" },
        { text: "`/api/users/${id}`", kind: "string" },
        { text: ")" },
      ],
      [{ text: "  return", kind: "keyword" }, { text: " res.json()" }],
      [{ text: "}" }],
    ],
  },
  {
    language: "JavaScript",
    short: "JS",
    lines: [
      [
        { text: "async function ", kind: "keyword" },
        { text: "loadUser", kind: "type" },
        { text: "(id) {" },
      ],
      [
        { text: "  const", kind: "keyword" },
        { text: " res = " },
        { text: "await", kind: "keyword" },
        { text: " fetch(" },
        { text: "`/api/users/${id}`", kind: "string" },
        { text: ")" },
      ],
      [{ text: "  return", kind: "keyword" }, { text: " res.json()" }],
      [{ text: "}" }],
    ],
  },
  {
    language: "Python",
    short: "PY",
    lines: [
      [{ text: "# тот же запрос, тот же ответ", kind: "comment" }],
      [
        { text: "async def ", kind: "keyword" },
        { text: "load_user", kind: "type" },
        { text: "(user_id: " },
        { text: "str", kind: "type" },
        { text: "):" },
      ],
      [
        { text: "    async with", kind: "keyword" },
        { text: " session.get(" },
        { text: 'f"/api/users/{user_id}"', kind: "string" },
        { text: ") as res:" },
      ],
      [
        { text: "        return await", kind: "keyword" },
        { text: " res.json()" },
      ],
    ],
  },
]

/** Один пример на трёх языках, переключение сегментированным бегунком. */
export function Codeblock016({
  title = "Запрос к API",
  defaultLanguage = "TypeScript",
  group = "vibeui-codeblock-016",
  className,
  style,
}: Codeblock016Props) {
  const active = SAMPLES.findIndex(
    (sample) => sample.language === defaultLanguage,
  )
  const checked = active < 0 ? 0 : active

  return (
    <>
      <style href="vibeui-codeblock-016" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-016"
        className={className}
        style={style}
      >
        <figcaption data-part="head">
          <span data-part="title">{title}</span>
          <div data-part="switch" role="group" aria-label="Язык примера">
            <span data-part="thumb" aria-hidden="true" />
            {SAMPLES.map((sample, index) => (
              <label key={sample.language}>
                <input
                  type="radio"
                  name={group}
                  value={index}
                  defaultChecked={index === checked}
                />
                {sample.short}
              </label>
            ))}
          </div>
        </figcaption>
        {SAMPLES.map((sample, index) => (
          <pre
            key={sample.language}
            data-index={index}
            aria-label={sample.language}
          >
            <code>
              {sample.lines.map((line, row) => (
                <span key={row}>
                  {line.map((token, position) => (
                    <span key={position} data-token={token.kind}>
                      {token.text}
                    </span>
                  ))}
                  {row < sample.lines.length - 1 ? "\n" : null}
                </span>
              ))}
            </code>
          </pre>
        ))}
      </figure>
    </>
  )
}
