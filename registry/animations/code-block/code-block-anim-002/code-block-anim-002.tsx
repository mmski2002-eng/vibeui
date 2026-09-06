import type { ComponentProps, CSSProperties } from "react"

export type CodeBlockAnim002TokenType =
  | "kw"
  | "str"
  | "fn"
  | "num"
  | "punct"
  | "plain"

export type CodeBlockAnim002Token = {
  text: string
  type?: CodeBlockAnim002TokenType
}

export type CodeBlockAnim002Line = {
  tokens: CodeBlockAnim002Token[]
}

export type CodeBlockAnim002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  language?: string
  lines?: CodeBlockAnim002Line[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой. */
  gradient?: boolean
}

// Идея: карточка сниппета кода с лейблом языка и кнопкой копирования.
// Код открывается построчной разверткой через clip-path со ступенчатым
// timing-function (steps()) — символы проявляются дискретными сдвигами
// маски слева направо, как настоящий набор. Через паузу иконка кнопки
// «копировать» меняется на галочку с пружинным pop-эффектом (overshoot
// масштаба), держится и возвращается обратно — демо-цикл по CSS-таймеру,
// без единой строчки клиентского JS.
const STYLES = `
:where([data-vibeui-block="code-block-anim-002"]){
--vibeui-code-block-anim-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-code-block-anim-002-card:light-dark(oklch(0.16 0 260),oklch(0.13 0 260));
--vibeui-code-block-anim-002-fg:oklch(0.92 0 260);
--vibeui-code-block-anim-002-muted:color-mix(in oklab,var(--vibeui-code-block-anim-002-fg) 42%,transparent);
--vibeui-code-block-anim-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-code-block-anim-002-accent:light-dark(oklch(0.62 0.16 255),oklch(0.72 0.14 255));
--vibeui-code-block-anim-002-ok:oklch(0.72 0.16 150);
--vibeui-code-block-anim-002-kw:oklch(0.72 0.19 330);
--vibeui-code-block-anim-002-str:oklch(0.76 0.15 150);
--vibeui-code-block-anim-002-fn:oklch(0.78 0.15 95);
--vibeui-code-block-anim-002-num:oklch(0.74 0.16 55);
--vibeui-code-block-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-code-block-anim-002-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="code-block-anim-002"]{color-scheme:dark}
[data-vibeui-block="code-block-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:19rem;margin:0;
color:var(--vibeui-code-block-anim-002-fg);font-family:var(--vibeui-code-block-anim-002-font);
}
[data-vibeui-block="code-block-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="code-block-anim-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="code-block-anim-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.25rem;border:1px solid var(--vibeui-code-block-anim-002-border);
background:color-mix(in oklab,var(--vibeui-code-block-anim-002-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="code-block-anim-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-code-block-anim-002-kw),var(--vibeui-code-block-anim-002-fn),var(--vibeui-code-block-anim-002-ok),var(--vibeui-code-block-anim-002-accent));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-code-block-anim-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="code-block-anim-002"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="code-block-anim-002"] [data-part="card"]{
position:relative;z-index:1;overflow:hidden;
border-radius:0.875rem;border:1px solid oklch(0 0 0 / 0.4);
background:var(--vibeui-code-block-anim-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.3);
}
[data-vibeui-block="code-block-anim-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem 0.5rem 0.5rem 0.75rem;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-code-block-anim-002-fg) 10%,transparent);
}
[data-vibeui-block="code-block-anim-002"] [data-part="lang"]{
display:inline-flex;align-items:center;
padding:0.1875rem 0.5rem;border-radius:9999px;
font-size:0.625rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-code-block-anim-002-accent);
background:color-mix(in oklab,var(--vibeui-code-block-anim-002-accent) 16%,transparent);
}
[data-vibeui-block="code-block-anim-002"] [data-part="copy"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;flex:none;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-code-block-anim-002-fg) 8%,transparent);
}
[data-vibeui-block="code-block-anim-002"] [data-part="copy"] svg{
position:absolute;width:0.8125rem;height:0.8125rem;
}
[data-vibeui-block="code-block-anim-002"] [data-part="icon-copy"]{color:var(--vibeui-code-block-anim-002-muted);animation:vibeui-code-block-anim-002-copy 4.6s ease infinite}
[data-vibeui-block="code-block-anim-002"] [data-part="icon-check"]{color:var(--vibeui-code-block-anim-002-ok);animation:vibeui-code-block-anim-002-check 4.6s ease infinite}
[data-vibeui-block="code-block-anim-002"] [data-part="body"]{padding:0.75rem}
[data-vibeui-block="code-block-anim-002"] [data-part="reveal"]{
display:block;overflow:hidden;
animation:vibeui-code-block-anim-002-reveal 4.6s ease infinite;
}
[data-vibeui-block="code-block-anim-002"] [data-part="code"]{
display:flex;flex-direction:column;
font-family:var(--vibeui-code-block-anim-002-mono);font-size:0.6875rem;line-height:1.55;white-space:pre;
}
[data-vibeui-block="code-block-anim-002"] [data-token="kw"]{color:var(--vibeui-code-block-anim-002-kw)}
[data-vibeui-block="code-block-anim-002"] [data-token="str"]{color:var(--vibeui-code-block-anim-002-str)}
[data-vibeui-block="code-block-anim-002"] [data-token="fn"]{color:var(--vibeui-code-block-anim-002-fn)}
[data-vibeui-block="code-block-anim-002"] [data-token="num"]{color:var(--vibeui-code-block-anim-002-num)}
[data-vibeui-block="code-block-anim-002"] [data-token="punct"]{color:var(--vibeui-code-block-anim-002-muted)}
[data-vibeui-block="code-block-anim-002"] [data-token="plain"]{color:var(--vibeui-code-block-anim-002-fg)}
@keyframes vibeui-code-block-anim-002-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-code-block-anim-002-reveal{
0%{clip-path:inset(0 100% 0 0);animation-timing-function:steps(22,end)}
40%{clip-path:inset(0 0 0 0);animation-timing-function:ease}
88%{clip-path:inset(0 0 0 0)}
100%{clip-path:inset(0 100% 0 0)}
}
@keyframes vibeui-code-block-anim-002-copy{
0%,54%{opacity:1;transform:scale(1)}
60%,88%{opacity:0;transform:scale(.4)}
94%{opacity:1;transform:scale(1.15)}
100%{opacity:1;transform:scale(1)}
}
@keyframes vibeui-code-block-anim-002-check{
0%,54%{opacity:0;transform:scale(.4)}
60%{opacity:1;transform:scale(1.2)}
66%,88%{opacity:1;transform:scale(1)}
94%,100%{opacity:0;transform:scale(.4)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="code-block-anim-002"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="code-block-anim-002"] [data-part="reveal"]{animation:none;clip-path:none}
[data-vibeui-block="code-block-anim-002"] [data-part="icon-copy"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="code-block-anim-002"] [data-part="icon-check"]{animation:none;opacity:0;transform:none}
}
`

const ICON_COPY = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-part="icon-copy"
  >
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const ICON_CHECK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-part="icon-check"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const DEFAULT_LINES: CodeBlockAnim002Line[] = [
  {
    tokens: [
      { text: "export ", type: "kw" },
      { text: "function ", type: "kw" },
      { text: "clamp", type: "fn" },
      { text: "(v, min, max) {", type: "punct" },
    ],
  },
  {
    tokens: [
      { text: "  return ", type: "kw" },
      { text: "Math", type: "plain" },
      { text: ".min(", type: "fn" },
      { text: "Math", type: "plain" },
      { text: ".max(v, min), max)", type: "fn" },
    ],
  },
  { tokens: [{ text: "}", type: "punct" }] },
]

/**
 * Копируемая карточка сниппета: лейбл языка, разворот кода через clip-path
 * со ступенчатым timing-function, кнопка копирования меняет иконку на
 * галочку с pop-эффектом по демо-циклу. Один файл, ноль зависимостей.
 */
export function CodeBlockAnim002({
  language = "tsx",
  lines = DEFAULT_LINES,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: CodeBlockAnim002Props) {
  const palette = {
    ...(accent ? { "--vibeui-code-block-anim-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-code-block-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="code-block-anim-002"
        data-slot="code-snippet"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <span data-part="lang">{language}</span>
                <span data-part="copy" aria-hidden="true">
                  {ICON_COPY}
                  {ICON_CHECK}
                </span>
              </div>
              <div data-part="body">
                <div data-part="reveal">
                  <div data-part="code">
                    {lines.map((line, index) => (
                      <span key={index}>
                        {line.tokens.length === 0 ? (
                          <>&nbsp;</>
                        ) : (
                          line.tokens.map((token, tokenIndex) => (
                            <span
                              data-token={token.type ?? "plain"}
                              key={tokenIndex}
                            >
                              {token.text}
                            </span>
                          ))
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
