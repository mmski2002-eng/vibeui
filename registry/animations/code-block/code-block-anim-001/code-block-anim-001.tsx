import type { ComponentProps, CSSProperties } from "react"

export type CodeBlockAnim001TokenType =
  | "kw"
  | "str"
  | "fn"
  | "num"
  | "com"
  | "punct"
  | "plain"

export type CodeBlockAnim001Token = {
  text: string
  type?: CodeBlockAnim001TokenType
}

export type CodeBlockAnim001Line = {
  tokens: CodeBlockAnim001Token[]
}

export type CodeBlockAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  fileName?: string
  lines?: CodeBlockAnim001Line[]
  accent?: string
  /** Колонка номеров строк слева. */
  lineNumbers?: boolean
  /** Мигающий курсор после последней набранной строки. */
  cursor?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой. */
  gradient?: boolean
}

// Идея: окно редактора кода с одной вкладкой файла. Строки печатаются
// построчно каскадом сверху вниз — ширина каждой строки раскрывается через
// steps(), поэтому символы появляются дискретными скачками, как настоящий
// набор текста. У всех строк общая длительность цикла и общие проценты
// раскрытия/паузы/сброса, а старт у каждой сдвинут через nth-child —
// получается бесконечная волна печати, строка за строкой. Ширина цели —
// var(--ch) в единицах ch, поэтому раскрытие совпадает с реальной длиной
// строки в моноширинном шрифте.
const STYLES = `
:where([data-vibeui-block="code-block-anim-001"]){
--vibeui-code-block-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-code-block-anim-001-card:light-dark(oklch(0.16 0.012 260),oklch(0.13 0.012 260));
--vibeui-code-block-anim-001-fg:oklch(0.92 0.006 260);
--vibeui-code-block-anim-001-muted:color-mix(in oklab,var(--vibeui-code-block-anim-001-fg) 42%,transparent);
--vibeui-code-block-anim-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-code-block-anim-001-accent:light-dark(oklch(0.62 0.16 255),oklch(0.72 0.14 255));
--vibeui-code-block-anim-001-kw:oklch(0.72 0.19 330);
--vibeui-code-block-anim-001-str:oklch(0.76 0.15 150);
--vibeui-code-block-anim-001-fn:oklch(0.78 0.15 95);
--vibeui-code-block-anim-001-num:oklch(0.74 0.16 55);
--vibeui-code-block-anim-001-dotr:#ff5f57;
--vibeui-code-block-anim-001-doty:#febc2e;
--vibeui-code-block-anim-001-dotg:#28c840;
--vibeui-code-block-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-code-block-anim-001-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="code-block-anim-001"]{color-scheme:dark}
[data-vibeui-block="code-block-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-code-block-anim-001-fg);font-family:var(--vibeui-code-block-anim-001-font);
}
[data-vibeui-block="code-block-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="code-block-anim-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="code-block-anim-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.25rem;border:1px solid var(--vibeui-code-block-anim-001-border);
background:color-mix(in oklab,var(--vibeui-code-block-anim-001-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="code-block-anim-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-code-block-anim-001-kw),var(--vibeui-code-block-anim-001-fn),var(--vibeui-code-block-anim-001-str),var(--vibeui-code-block-anim-001-accent));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-code-block-anim-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="code-block-anim-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="code-block-anim-001"] [data-part="card"]{
position:relative;z-index:1;overflow:hidden;
border-radius:0.875rem;border:1px solid oklch(0 0 0 / 0.4);
background:var(--vibeui-code-block-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.3);
}
[data-vibeui-block="code-block-anim-001"] [data-part="tabbar"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.75rem;border-bottom:1px solid color-mix(in oklab,var(--vibeui-code-block-anim-001-fg) 10%,transparent);
}
[data-vibeui-block="code-block-anim-001"] [data-part="dots"]{display:flex;gap:0.3125rem;flex:none}
[data-vibeui-block="code-block-anim-001"] [data-part="dots"] i{display:block;width:0.5rem;height:0.5rem;border-radius:9999px}
[data-vibeui-block="code-block-anim-001"] [data-part="dots"] i:nth-child(1){background:var(--vibeui-code-block-anim-001-dotr)}
[data-vibeui-block="code-block-anim-001"] [data-part="dots"] i:nth-child(2){background:var(--vibeui-code-block-anim-001-doty)}
[data-vibeui-block="code-block-anim-001"] [data-part="dots"] i:nth-child(3){background:var(--vibeui-code-block-anim-001-dotg)}
[data-vibeui-block="code-block-anim-001"] [data-part="tab"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-left:0.375rem;
padding:0.1875rem 0.5rem;border-radius:0.375rem 0.375rem 0 0;
font-size:0.625rem;font-weight:600;letter-spacing:0.01em;
color:var(--vibeui-code-block-anim-001-fg);
background:color-mix(in oklab,var(--vibeui-code-block-anim-001-fg) 8%,transparent);
}
[data-vibeui-block="code-block-anim-001"] [data-part="tab"] svg{width:0.6875rem;height:0.6875rem;color:var(--vibeui-code-block-anim-001-accent);flex:none}
[data-vibeui-block="code-block-anim-001"] [data-part="dirty"]{
width:0.375rem;height:0.375rem;border-radius:9999px;flex:none;
background:var(--vibeui-code-block-anim-001-accent);
}
[data-vibeui-block="code-block-anim-001"] [data-part="body"]{
display:flex;gap:0.75rem;padding:0.75rem;
font-family:var(--vibeui-code-block-anim-001-mono);font-size:0.6875rem;line-height:1.45;
}
[data-vibeui-block="code-block-anim-001"] [data-part="gutter"]{
display:flex;flex-direction:column;flex:none;text-align:right;
color:var(--vibeui-code-block-anim-001-muted);user-select:none;
}
[data-vibeui-block="code-block-anim-001"][data-numbers="false"] [data-part="gutter"]{display:none}
[data-vibeui-block="code-block-anim-001"] [data-part="num"]{
opacity:0;
animation:vibeui-code-block-anim-001-fade 6.2s steps(1,end) infinite;
}
[data-vibeui-block="code-block-anim-001"] [data-part="code"]{
display:flex;flex-direction:column;min-width:0;flex:1;white-space:pre;
}
[data-vibeui-block="code-block-anim-001"] [data-part="line"]{
display:inline-block;overflow:hidden;white-space:pre;width:0;max-width:100%;
animation:vibeui-code-block-anim-001-type 6.2s linear infinite;
}
[data-vibeui-block="code-block-anim-001"] [data-part="line-inner"]{display:block;white-space:pre}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(1) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(1) [data-part="num"]{animation-delay:0s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(2) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(2) [data-part="num"]{animation-delay:.32s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(3) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(3) [data-part="num"]{animation-delay:.5s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(4) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(4) [data-part="num"]{animation-delay:.86s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(5) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(5) [data-part="num"]{animation-delay:1.42s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(6) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(6) [data-part="num"]{animation-delay:1.6s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(7) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(7) [data-part="num"]{animation-delay:1.9s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(8) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(8) [data-part="num"]{animation-delay:2.5s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(9) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(9) [data-part="num"]{animation-delay:2.8s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(10) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(10) [data-part="num"]{animation-delay:3.1s}
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(11) [data-part="line"],
[data-vibeui-block="code-block-anim-001"] [data-part="row"]:nth-child(11) [data-part="num"]{animation-delay:3.3s}
[data-vibeui-block="code-block-anim-001"] [data-token="kw"]{color:var(--vibeui-code-block-anim-001-kw)}
[data-vibeui-block="code-block-anim-001"] [data-token="str"]{color:var(--vibeui-code-block-anim-001-str)}
[data-vibeui-block="code-block-anim-001"] [data-token="fn"]{color:var(--vibeui-code-block-anim-001-fn)}
[data-vibeui-block="code-block-anim-001"] [data-token="num"]{color:var(--vibeui-code-block-anim-001-num)}
[data-vibeui-block="code-block-anim-001"] [data-token="com"]{color:var(--vibeui-code-block-anim-001-muted)}
[data-vibeui-block="code-block-anim-001"] [data-token="punct"]{color:var(--vibeui-code-block-anim-001-muted)}
[data-vibeui-block="code-block-anim-001"] [data-token="plain"]{color:var(--vibeui-code-block-anim-001-fg)}
[data-vibeui-block="code-block-anim-001"] [data-part="caret"]{
display:inline-block;width:0.5em;height:1.05em;margin-left:1px;vertical-align:-0.15em;
background:var(--vibeui-code-block-anim-001-accent);
animation:vibeui-code-block-anim-001-blink 1s steps(1,end) infinite;
}
[data-vibeui-block="code-block-anim-001"][data-cursor="false"] [data-part="caret"]{display:none}
@keyframes vibeui-code-block-anim-001-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-code-block-anim-001-type{
0%{width:0;animation-timing-function:steps(var(--ch,1),end)}
42%{width:var(--ch,0ch);animation-timing-function:steps(1,end)}
88%{width:var(--ch,0ch)}
100%{width:0}
}
@keyframes vibeui-code-block-anim-001-fade{
0%{opacity:0}42%{opacity:1}88%{opacity:1}100%{opacity:0}
}
@keyframes vibeui-code-block-anim-001-blink{0%,100%{opacity:1}50%{opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="code-block-anim-001"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="code-block-anim-001"] [data-part="line"]{animation:none;width:var(--ch,0ch)}
[data-vibeui-block="code-block-anim-001"] [data-part="num"]{animation:none;opacity:1}
[data-vibeui-block="code-block-anim-001"] [data-part="caret"]{animation:none;opacity:1}
}
`

const FILE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
)

function textOf(tokens: CodeBlockAnim001Token[]): string {
  return tokens.map((token) => token.text).join("")
}

const DEFAULT_LINES: CodeBlockAnim001Line[] = [
  {
    tokens: [
      { text: "import ", type: "kw" },
      { text: "{ useState } ", type: "plain" },
      { text: "from ", type: "kw" },
      { text: '"react"', type: "str" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "export ", type: "kw" },
      { text: "function ", type: "kw" },
      { text: "Counter", type: "fn" },
      { text: "() {", type: "punct" },
    ],
  },
  {
    tokens: [
      { text: "  const ", type: "kw" },
      { text: "[count, setCount] = ", type: "plain" },
      { text: "useState", type: "fn" },
      { text: "(", type: "punct" },
      { text: "0", type: "num" },
      { text: ")", type: "punct" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "  return (", type: "kw" },
    ],
  },
  {
    tokens: [
      { text: "    <button ", type: "fn" },
      { text: "onClick=", type: "plain" },
      { text: "{() => ", type: "kw" },
      { text: "setCount", type: "fn" },
      { text: "(count + ", type: "plain" },
      { text: "1", type: "num" },
      { text: ")}", type: "punct" },
      { text: ">", type: "fn" },
    ],
  },
  {
    tokens: [{ text: "      Count: {count}", type: "plain" }],
  },
  {
    tokens: [
      { text: "    </", type: "punct" },
      { text: "button", type: "fn" },
      { text: ">", type: "punct" },
    ],
  },
  { tokens: [{ text: "  )", type: "punct" }] },
  { tokens: [{ text: "}", type: "punct" }] },
]

/**
 * Мокап редактора кода: вкладка файла, номера строк, подсветка синтаксиса.
 * Строки печатаются каскадом сверху вниз через steps() и зацикливаются.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function CodeBlockAnim001({
  fileName = "counter.tsx",
  lines = DEFAULT_LINES,
  accent,
  lineNumbers = true,
  cursor = true,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: CodeBlockAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-code-block-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const lastIndex = lines.length - 1

  return (
    <>
      <style href="vibeui-code-block-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="code-block-anim-001"
        data-slot="code-editor"
        data-numbers={lineNumbers ? undefined : "false"}
        data-cursor={cursor ? undefined : "false"}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="tabbar">
                <span data-part="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="tab">
                  {FILE_ICON}
                  {fileName}
                  <span data-part="dirty" aria-hidden="true" />
                </span>
              </div>
              <div data-part="body">
                <div data-part="gutter" aria-hidden="true">
                  {lines.map((_, index) => (
                    <span data-part="num" key={index}>
                      {index + 1}
                    </span>
                  ))}
                </div>
                <div data-part="code">
                  {lines.map((line, index) => {
                    const text = textOf(line.tokens)
                    const charStyle = {
                      "--ch": `${Math.max(text.length, 1)}ch`,
                    } as CSSProperties

                    return (
                      <span data-part="row" key={index}>
                        <span data-part="line" style={charStyle}>
                          <span data-part="line-inner">
                            {line.tokens.map((token, tokenIndex) => (
                              <span
                                data-token={token.type ?? "plain"}
                                key={tokenIndex}
                              >
                                {token.text}
                              </span>
                            ))}
                            {index === lastIndex ? (
                              <span data-part="caret" aria-hidden="true" />
                            ) : null}
                          </span>
                        </span>
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
