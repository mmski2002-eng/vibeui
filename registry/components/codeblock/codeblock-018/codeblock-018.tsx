import type { CSSProperties } from "react"

export type Codeblock018Note = {
  line: number
  text: string
}

export type Codeblock018Props = {
  path?: string
  showLegend?: boolean
  lines?: string[]
  notes?: Codeblock018Note[]
  className?: string
  style?: CSSProperties
}

// Идея компонента: разбор кода, а не просто листинг. У размеченных строк
// появляется кружок с номером, а под блоком стоит легенда с пояснениями.
// Номер печатает ::after, поэтому объяснения не уезжают в буфер вместе с кодом.
const STYLES = `
:where([data-vibeui-block="codeblock-018"]){
--vibeui-codeblock-018-bg:oklch(0.99 0.003 95);
--vibeui-codeblock-018-code:oklch(0.97 0.006 95);
--vibeui-codeblock-018-fg:oklch(0.26 0.014 95);
--vibeui-codeblock-018-muted:oklch(0.52 0.012 95);
--vibeui-codeblock-018-border:oklch(0.9 0.008 95);
--vibeui-codeblock-018-mark:oklch(0.55 0.16 45);
--vibeui-codeblock-018-mark-bg:oklch(0.94 0.05 60);
--vibeui-codeblock-018-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-018"]{
display:flex;flex-direction:column;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-018-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-018-bg);color:var(--vibeui-codeblock-018-fg);
font-family:var(--vibeui-codeblock-018-font);
}
[data-vibeui-block="codeblock-018"] [data-part="head"]{
padding:0.5rem 0.875rem;
border-bottom:1px solid var(--vibeui-codeblock-018-border);
font-family:var(--vibeui-codeblock-018-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-018-muted);
}
[data-vibeui-block="codeblock-018"] pre{
margin:0;padding:0.75rem 0;overflow-x:auto;
background:var(--vibeui-codeblock-018-code);
}
[data-vibeui-block="codeblock-018"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-018-mono);
font-size:0.8125rem;line-height:1.85;white-space:pre;
}
/* min-height держит пустую строку: блочный span без содержимого схлопнулся
   бы в ноль и в листинге пропал бы отбивка между смысловыми кусками. */
[data-vibeui-block="codeblock-018"] [data-part="row"]{
display:block;padding:0 0.875rem;min-height:1.85em;
}
/* Кружок с номером — псевдоэлемент: в разметке он бы уехал в буфер обмена
   и сломал вставленный код. content берётся из data-note. */
[data-vibeui-block="codeblock-018"] [data-part="row"][data-note]::after{
content:attr(data-note);
display:inline-flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;margin-inline-start:0.625rem;
border-radius:50%;vertical-align:0.0625rem;
background:var(--vibeui-codeblock-018-mark-bg);
color:var(--vibeui-codeblock-018-mark);
font-family:var(--vibeui-codeblock-018-font);
font-size:0.6875rem;font-weight:700;line-height:1;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-018"] [data-part="row"][data-note]{
background:oklch(0.55 0.16 45 / 8%);
}
[data-vibeui-block="codeblock-018"] ol{
margin:0;padding:0.75rem 0.875rem;list-style:none;
counter-reset:note;
border-top:1px solid var(--vibeui-codeblock-018-border);
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="codeblock-018"] li{
display:grid;grid-template-columns:1.125rem 1fr;gap:0.625rem;
align-items:start;font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="codeblock-018"] li::before{
counter-increment:note;content:counter(note);
display:inline-flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;margin-top:0.0625rem;border-radius:50%;
background:var(--vibeui-codeblock-018-mark-bg);
color:var(--vibeui-codeblock-018-mark);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="codeblock-018"] li b{
font-family:var(--vibeui-codeblock-018-mono);font-size:0.75rem;font-weight:600;
color:var(--vibeui-codeblock-018-muted);
}
`

const LINES = [
  "export const config = {",
  "  matcher: ['/dashboard/:path*'],",
  "}",
  "",
  "export function middleware(request) {",
  "  const token = request.cookies.get('session')",
  "  if (!token) return redirect('/login')",
  "}",
]

const NOTES: Codeblock018Note[] = [
  { line: 2, text: "Маршруты, на которых middleware вообще запускается." },
  { line: 6, text: "Куку читаем на краю, до рендера страницы." },
  { line: 7, text: "Без токена уводим на вход и дальше не идём." },
]

/** Листинг с выносками к строкам и легендой под ним. */
export function Codeblock018({
  path = "middleware.ts",
  showLegend = true,
  lines = LINES,
  notes = NOTES,
  className,
  style,
}: Codeblock018Props) {
  const numbers = new Map(notes.map((note, index) => [note.line, index + 1]))

  return (
    <>
      <style href="vibeui-codeblock-018" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-018"
        className={className}
        style={style}
      >
        <figcaption data-part="head">{path}</figcaption>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span
                key={index}
                data-part="row"
                data-note={numbers.get(index + 1)}
              >
                {line}
              </span>
            ))}
          </code>
        </pre>
        {showLegend ? (
          <ol>
            {notes.map((note) => (
              <li key={note.line}>
                <span>
                  <b>строка {note.line}</b> — {note.text}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </figure>
    </>
  )
}
