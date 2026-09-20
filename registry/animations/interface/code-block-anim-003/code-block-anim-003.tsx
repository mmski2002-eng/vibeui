import type { ComponentProps, CSSProperties } from "react"

export type CodeBlockAnim003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  prompt?: string
  command?: string
  output?: string[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой. */
  gradient?: boolean
}

// Идея: окно терминала с командной строкой. Команда печатается посимвольно —
// ширина строки раскрывается через steps(var(--ch)), поэтому символы idut
// дискретными скачками моноширинного шрифта, курсор мигает рядом. После
// набора построчно, с нарастающим сдвигом по времени, проявляется вывод
// команды (fade + лёгкий подъём). Дальше пауза, мгновенный сброс и цикл
// начинается заново — демо повторяется бесконечно на чистом CSS.
const STYLES = `
:where([data-vibeui-block="code-block-anim-003"]){
--vibeui-code-block-anim-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-code-block-anim-003-card:light-dark(oklch(0.14 0 260),oklch(0.12 0 260));
--vibeui-code-block-anim-003-fg:oklch(0.92 0 260);
--vibeui-code-block-anim-003-muted:color-mix(in oklab,var(--vibeui-code-block-anim-003-fg) 42%,transparent);
--vibeui-code-block-anim-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-code-block-anim-003-accent:light-dark(oklch(0.62 0.16 255),oklch(0.72 0.14 255));
--vibeui-code-block-anim-003-ok:oklch(0.72 0.16 150);
--vibeui-code-block-anim-003-dotr:#ff5f57;
--vibeui-code-block-anim-003-doty:#febc2e;
--vibeui-code-block-anim-003-dotg:#28c840;
--vibeui-code-block-anim-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-code-block-anim-003-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="code-block-anim-003"]{color-scheme:dark}
[data-vibeui-block="code-block-anim-003"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-code-block-anim-003-fg);font-family:var(--vibeui-code-block-anim-003-font);
}
[data-vibeui-block="code-block-anim-003"] *{box-sizing:border-box}
[data-vibeui-block="code-block-anim-003"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="code-block-anim-003"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.25rem;border:1px solid var(--vibeui-code-block-anim-003-border);
background:color-mix(in oklab,var(--vibeui-code-block-anim-003-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="code-block-anim-003"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.25rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-code-block-anim-003-dotr),var(--vibeui-code-block-anim-003-doty),var(--vibeui-code-block-anim-003-dotg),var(--vibeui-code-block-anim-003-accent));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-code-block-anim-003-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="code-block-anim-003"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="code-block-anim-003"] [data-part="card"]{
position:relative;z-index:1;overflow:hidden;
border-radius:0.875rem;border:1px solid oklch(0 0 0 / 0.4);
background:var(--vibeui-code-block-anim-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.3);
}
[data-vibeui-block="code-block-anim-003"] [data-part="chrome"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.75rem;border-bottom:1px solid color-mix(in oklab,var(--vibeui-code-block-anim-003-fg) 10%,transparent);
}
[data-vibeui-block="code-block-anim-003"] [data-part="dots"]{display:flex;gap:0.3125rem;flex:none}
[data-vibeui-block="code-block-anim-003"] [data-part="dots"] i{display:block;width:0.5rem;height:0.5rem;border-radius:9999px}
[data-vibeui-block="code-block-anim-003"] [data-part="dots"] i:nth-child(1){background:var(--vibeui-code-block-anim-003-dotr)}
[data-vibeui-block="code-block-anim-003"] [data-part="dots"] i:nth-child(2){background:var(--vibeui-code-block-anim-003-doty)}
[data-vibeui-block="code-block-anim-003"] [data-part="dots"] i:nth-child(3){background:var(--vibeui-code-block-anim-003-dotg)}
[data-vibeui-block="code-block-anim-003"] [data-part="chrome-title"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
text-align:center;font-size:0.625rem;font-weight:600;letter-spacing:0.01em;
font-family:var(--vibeui-code-block-anim-003-mono);color:var(--vibeui-code-block-anim-003-muted);
}
[data-vibeui-block="code-block-anim-003"] [data-part="screen"]{
padding:0.75rem;font-family:var(--vibeui-code-block-anim-003-mono);font-size:0.6875rem;line-height:1.6;
}
[data-vibeui-block="code-block-anim-003"] [data-part="cmdline"]{display:flex;align-items:baseline;gap:0.4375rem}
[data-vibeui-block="code-block-anim-003"] [data-part="prompt"]{flex:none;color:var(--vibeui-code-block-anim-003-accent);font-weight:700}
[data-vibeui-block="code-block-anim-003"] [data-part="cmd"]{
display:inline-block;overflow:hidden;white-space:pre;width:0;max-width:100%;
color:var(--vibeui-code-block-anim-003-fg);
animation:vibeui-code-block-anim-003-type 5.5s linear infinite;
}
[data-vibeui-block="code-block-anim-003"] [data-part="caret"]{
display:inline-block;width:0.5em;height:1em;margin-left:1px;vertical-align:-0.12em;flex:none;
background:var(--vibeui-code-block-anim-003-accent);
animation:vibeui-code-block-anim-003-blink 1s steps(1,end) infinite;color:oklch(from var(--vibeui-code-block-anim-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="code-block-anim-003"] [data-part="output"]{margin-top:0.5rem;display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="code-block-anim-003"] [data-part="line"]{
color:var(--vibeui-code-block-anim-003-muted);opacity:0;transform:translateY(4px);
animation:vibeui-code-block-anim-003-rise 5.5s ease infinite;
}
[data-vibeui-block="code-block-anim-003"] [data-part="line"][data-tone="ok"]{color:var(--vibeui-code-block-anim-003-ok)}
[data-vibeui-block="code-block-anim-003"] [data-part="output"] [data-part="line"]:nth-child(1){animation-delay:2.05s}
[data-vibeui-block="code-block-anim-003"] [data-part="output"] [data-part="line"]:nth-child(2){animation-delay:2.35s}
[data-vibeui-block="code-block-anim-003"] [data-part="output"] [data-part="line"]:nth-child(3){animation-delay:2.65s}
[data-vibeui-block="code-block-anim-003"] [data-part="output"] [data-part="line"]:nth-child(4){animation-delay:2.95s}
[data-vibeui-block="code-block-anim-003"] [data-part="output"] [data-part="line"]:nth-child(5){animation-delay:3.25s}
@keyframes vibeui-code-block-anim-003-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-code-block-anim-003-type{
0%{width:0;animation-timing-function:steps(var(--ch,1),end)}
34%{width:var(--ch,0ch);animation-timing-function:steps(1,end)}
90%{width:var(--ch,0ch)}
100%{width:0}
}
@keyframes vibeui-code-block-anim-003-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes vibeui-code-block-anim-003-rise{
0%{opacity:0;transform:translateY(4px)}
8%{opacity:0;transform:translateY(4px)}
16%{opacity:1;transform:translateY(0)}
82%{opacity:1;transform:translateY(0)}
92%{opacity:0;transform:translateY(0)}
100%{opacity:0;transform:translateY(4px)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="code-block-anim-003"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="code-block-anim-003"] [data-part="cmd"]{animation:none;width:var(--ch,0ch)}
[data-vibeui-block="code-block-anim-003"] [data-part="caret"]{animation:none;opacity:1}
[data-vibeui-block="code-block-anim-003"] [data-part="line"]{animation:none;opacity:1;transform:none}
}
`

const DEFAULT_OUTPUT = [
  "  ▲ Next.js 16.0.1",
  "  - Local:   http://localhost:3000",
  "",
  " ✓ Compiled successfully in 1.2s",
]

/**
 * Окно терминала: команда печатается посимвольно через steps(), затем
 * построчно проявляется вывод. Демо-цикл повторяется бесконечно на чистом
 * CSS. Один файл, ноль зависимостей, собственная палитра.
 */
export function CodeBlockAnim003({
  title = "~/vibeui-app",
  prompt = "$",
  command = "npm run build",
  output = DEFAULT_OUTPUT,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: CodeBlockAnim003Props) {
  const palette = {
    ...(accent ? { "--vibeui-code-block-anim-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const cmdStyle = {
    "--ch": `${Math.max(command.length, 1)}ch`,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-code-block-anim-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="code-block-anim-003"
        data-slot="terminal"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="chrome">
                <span data-part="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="chrome-title">{title}</span>
              </div>
              <div data-part="screen">
                <div data-part="cmdline">
                  <span data-part="prompt" aria-hidden="true">
                    {prompt}
                  </span>
                  <span data-part="cmd" style={cmdStyle}>
                    {command}
                  </span>
                  <span data-part="caret" aria-hidden="true" />
                </div>
                <div data-part="output">
                  {output.map((line, index) => (
                    <span
                      data-part="line"
                      data-tone={line.trim().startsWith("✓") ? "ok" : undefined}
                      key={index}
                    >
                      {line === "" ? " " : line}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
