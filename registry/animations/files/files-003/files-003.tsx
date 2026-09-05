import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Files003Kind = "doc" | "image" | "code" | "archive" | "sheet"

export type Files003File = {
  name: string
  size?: string
  kind?: Files003Kind
}

export type Files003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  files?: Files003File[]
  accent?: string
  /** Веерное раскрытие стопки при появлении. false — стопка сразу разложена. */
  fanOut?: boolean
}

// Идея: стопка карточек внахлёст — глубина читается по убывающему масштабу,
// сдвигу и тени. При появлении карточки веером расходятся из-под верхней,
// от задней к передней (fan out), а верхняя карточка после сборки продолжает
// мягко покачиваться — единственный элемент стопки, который живёт постоянно.
const STYLES = `
:where([data-vibeui-block="files-003"]){
--vibeui-files-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-files-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-files-003-muted:color-mix(in oklab,var(--vibeui-files-003-fg) 58%,transparent);
--vibeui-files-003-border:light-dark(oklch(0.91 0 0),oklch(0.3 0 0));
--vibeui-files-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-files-003-doc:light-dark(oklch(0.62 0.19 25),oklch(0.68 0.18 25));
--vibeui-files-003-image:light-dark(oklch(0.58 0.2 305),oklch(0.68 0.18 305));
--vibeui-files-003-code:light-dark(oklch(0.62 0.13 210),oklch(0.7 0.13 210));
--vibeui-files-003-archive:light-dark(oklch(0.7 0.14 75),oklch(0.75 0.13 75));
--vibeui-files-003-sheet:light-dark(oklch(0.62 0.15 148),oklch(0.7 0.14 148));
--vibeui-files-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="files-003"]{color-scheme:dark}
[data-vibeui-block="files-003"]{
display:block;box-sizing:border-box;width:100%;max-width:14rem;margin:0;
color:var(--vibeui-files-003-fg);font-family:var(--vibeui-files-003-font);
}
[data-vibeui-block="files-003"] *{box-sizing:border-box}
[data-vibeui-block="files-003"] [data-part="stack"]{
position:relative;height:6.5rem;margin:0 0 0.75rem 0;
}
[data-vibeui-block="files-003"] [data-part="card"]{
position:absolute;inset:0 0.75rem auto 0;display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-radius:0.875rem;border:1px solid var(--vibeui-files-003-border);
background:var(--vibeui-files-003-card);
box-shadow:0 8px 18px -14px oklch(0 0 0 / 0.4),0 1px 2px oklch(0 0 0 / 0.05);
animation:vibeui-files-003-fan 0.6s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="files-003"][data-fan="false"] [data-part="card"]{animation:none}
[data-vibeui-block="files-003"] [data-part="card"]:nth-child(1){
--vibeui-files-003-x:0rem;--vibeui-files-003-y:0rem;--vibeui-files-003-r:0deg;--vibeui-files-003-s:1;
z-index:4;animation-delay:0.18s,0.78s;
animation-name:vibeui-files-003-fan,vibeui-files-003-sway;
animation-duration:0.6s,4.2s;
animation-timing-function:cubic-bezier(0.22,1,0.36,1),ease-in-out;
animation-iteration-count:1,infinite;
animation-fill-mode:both,both;
}
[data-vibeui-block="files-003"][data-fan="false"] [data-part="card"]:nth-child(1){
animation-name:none,vibeui-files-003-sway;
}
[data-vibeui-block="files-003"] [data-part="card"]:nth-child(2){
--vibeui-files-003-x:0.5625rem;--vibeui-files-003-y:0.4375rem;--vibeui-files-003-r:6deg;--vibeui-files-003-s:0.97;
z-index:3;opacity:0.92;animation-delay:0.12s;
}
[data-vibeui-block="files-003"] [data-part="card"]:nth-child(3){
--vibeui-files-003-x:1.0625rem;--vibeui-files-003-y:0.8125rem;--vibeui-files-003-r:-8deg;--vibeui-files-003-s:0.94;
z-index:2;opacity:0.8;animation-delay:0.06s;
}
[data-vibeui-block="files-003"] [data-part="card"]:nth-child(4){
--vibeui-files-003-x:1.5625rem;--vibeui-files-003-y:1.1875rem;--vibeui-files-003-r:10deg;--vibeui-files-003-s:0.91;
z-index:1;opacity:0.66;animation-delay:0s;
}
[data-vibeui-block="files-003"][data-fan="false"] [data-part="card"]{
transform:translate(var(--vibeui-files-003-x),var(--vibeui-files-003-y)) rotate(var(--vibeui-files-003-r)) scale(var(--vibeui-files-003-s));
}
[data-vibeui-block="files-003"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:0.5625rem;color:#fff;
}
[data-vibeui-block="files-003"] [data-part="icon"] svg{width:1rem;height:1rem}
[data-vibeui-block="files-003"] [data-part="icon"][data-kind="doc"]{background:var(--vibeui-files-003-doc)}
[data-vibeui-block="files-003"] [data-part="icon"][data-kind="image"]{background:var(--vibeui-files-003-image)}
[data-vibeui-block="files-003"] [data-part="icon"][data-kind="code"]{background:var(--vibeui-files-003-code)}
[data-vibeui-block="files-003"] [data-part="icon"][data-kind="archive"]{background:var(--vibeui-files-003-archive)}
[data-vibeui-block="files-003"] [data-part="icon"][data-kind="sheet"]{background:var(--vibeui-files-003-sheet)}
[data-vibeui-block="files-003"] [data-part="finfo"]{min-width:0;flex:1 1 auto;display:flex;flex-direction:column}
[data-vibeui-block="files-003"] [data-part="fname"]{
font-size:0.6875rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="files-003"] [data-part="fsize"]{font-size:0.5625rem;color:var(--vibeui-files-003-muted)}
[data-vibeui-block="files-003"] [data-part="count"]{
margin:0;font-size:0.6875rem;font-weight:600;color:var(--vibeui-files-003-muted);text-align:center;
}
@keyframes vibeui-files-003-fan{
0%{transform:translate(0,0) rotate(0deg) scale(0.92);opacity:0}
100%{
transform:translate(var(--vibeui-files-003-x),var(--vibeui-files-003-y)) rotate(var(--vibeui-files-003-r)) scale(var(--vibeui-files-003-s));
opacity:1;
}
}
@keyframes vibeui-files-003-sway{
0%,100%{transform:translate(0,0) rotate(-1.5deg)}
50%{transform:translate(0,-0.125rem) rotate(1.5deg)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="files-003"] [data-part="card"]{animation:none!important}
[data-vibeui-block="files-003"] [data-part="card"]{
transform:translate(var(--vibeui-files-003-x),var(--vibeui-files-003-y)) rotate(var(--vibeui-files-003-r)) scale(var(--vibeui-files-003-s));
opacity:1;
}
}
`

const KIND_ICONS: Record<Files003Kind, ReactNode> = {
  doc: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h14M5 10h14M5 16h9" />
    </svg>
  ),
  image: (
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
      <circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" />
      <path d="m4 18 5-6 4 4 3-4 4 5" />
    </svg>
  ),
  code: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6-5 6 5 6M15 6l5 6-5 6" />
    </svg>
  ),
  archive: (
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
      <rect x="4" y="7" width="16" height="13" rx="1.5" />
      <path d="M4 11h16" />
      <rect x="10.5" y="7" width="3" height="4" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  sheet: (
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
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 10h16M4 15h16M10 4v16" />
    </svg>
  ),
}

const DEFAULT_FILES: Files003File[] = [
  { name: "Отчёт.pdf", size: "1.8 МБ", kind: "doc" },
  { name: "Обложка.png", size: "3.1 МБ", kind: "image" },
  { name: "Скрипт.ts", size: "12 КБ", kind: "code" },
  { name: "Архив.zip", size: "44 МБ", kind: "archive" },
]

/**
 * Стопка карточек файлов внахлёст с убывающей глубиной. При появлении
 * раскрывается веером, верхняя карточка мягко покачивается. Один файл,
 * ноль зависимостей.
 */
export function Files003({
  files = DEFAULT_FILES,
  accent,
  fanOut = true,
  className,
  style,
  ...props
}: Files003Props) {
  const palette = {
    ...(accent ? { "--vibeui-files-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const shown = files.slice(0, 4)

  return (
    <>
      <style href="vibeui-files-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="files-003"
        data-slot="file-stack"
        data-fan={fanOut ? undefined : "false"}
        aria-label={`Стопка файлов, ${shown.length}`}
        className={className}
        style={palette}
      >
        <div data-part="stack">
          {shown.map((file) => (
            <div data-part="card" key={file.name}>
              <span data-part="icon" data-kind={file.kind ?? "doc"}>
                {KIND_ICONS[file.kind ?? "doc"]}
              </span>
              <span data-part="finfo">
                <span data-part="fname">{file.name}</span>
                {file.size ? <span data-part="fsize">{file.size}</span> : null}
              </span>
            </div>
          ))}
        </div>
        <p data-part="count">{shown.length} файла в стопке</p>
      </section>
    </>
  )
}
