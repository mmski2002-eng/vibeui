import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Files002Kind = "doc" | "image" | "code" | "archive" | "sheet"

export type Files002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  name?: string
  type?: string
  size?: string
  kind?: Files002Kind
  accent?: string
  /** Отскок при появлении карточки. false — карточка сразу на месте. */
  bounce?: boolean
}

// Идея: одна карточка файла — минимум того, что вообще можно назвать файловым
// компонентом. Цветная иконка расширения, имя, тип и размер. При появлении
// карточка чуть подпрыгивает (scale overshoot на cubic-bezier), а иконка
// доезжает следом с небольшой задержкой — вся анимация одноразовая, как
// у карточки, которая только что материализовалась в списке. Наведение
// добавляет лёгкий hover-lift: карточка приподнимается и тень густеет.
const STYLES = `
:where([data-vibeui-block="files-002"]){
--vibeui-files-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-files-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-files-002-muted:color-mix(in oklab,var(--vibeui-files-002-fg) 58%,transparent);
--vibeui-files-002-border:light-dark(oklch(0.91 0 0),oklch(0.3 0 0));
--vibeui-files-002-kind:light-dark(oklch(0.62 0.19 25),oklch(0.68 0.18 25));
--vibeui-files-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="files-002"]{color-scheme:dark}
[data-vibeui-block="files-002"]{
display:block;box-sizing:border-box;width:100%;max-width:14rem;margin:0;
color:var(--vibeui-files-002-fg);font-family:var(--vibeui-files-002-font);
}
[data-vibeui-block="files-002"] *{box-sizing:border-box}
[data-vibeui-block="files-002"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0.875rem;
border-radius:1rem;border:1px solid var(--vibeui-files-002-border);
background:var(--vibeui-files-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
animation:vibeui-files-002-bounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
transition:transform .22s ease,box-shadow .22s ease;
}
[data-vibeui-block="files-002"] [data-part="card"]:hover{
transform:translateY(-0.1875rem);
box-shadow:0 10px 22px -14px oklch(0 0 0 / 0.4),0 2px 6px -2px oklch(0 0 0 / 0.12);
}
[data-vibeui-block="files-002"][data-bounce="false"] [data-part="card"]{animation:none}
[data-vibeui-block="files-002"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.75rem;height:2.75rem;border-radius:0.75rem;color:#fff;
background:var(--vibeui-files-002-kind);
animation:vibeui-files-002-pop 0.5s 0.16s cubic-bezier(0.34,1.56,0.64,1) both;
}
[data-vibeui-block="files-002"][data-bounce="false"] [data-part="icon"]{animation:none}
[data-vibeui-block="files-002"] [data-part="icon"] svg{width:1.375rem;height:1.375rem}
[data-vibeui-block="files-002"][data-kind="doc"]{--vibeui-files-002-kind:light-dark(oklch(0.62 0.19 25),oklch(0.68 0.18 25))}
[data-vibeui-block="files-002"][data-kind="image"]{--vibeui-files-002-kind:light-dark(oklch(0.58 0.2 305),oklch(0.68 0.18 305))}
[data-vibeui-block="files-002"][data-kind="code"]{--vibeui-files-002-kind:light-dark(oklch(0.62 0.13 210),oklch(0.7 0.13 210))}
[data-vibeui-block="files-002"][data-kind="archive"]{--vibeui-files-002-kind:light-dark(oklch(0.7 0.14 75),oklch(0.75 0.13 75))}
[data-vibeui-block="files-002"][data-kind="sheet"]{--vibeui-files-002-kind:light-dark(oklch(0.62 0.15 148),oklch(0.7 0.14 148))}
[data-vibeui-block="files-002"] [data-part="name"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="files-002"] [data-part="meta"]{
display:flex;align-items:center;gap:0.375rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-files-002-muted);
}
[data-vibeui-block="files-002"] [data-part="dot"]{
width:0.1875rem;height:0.1875rem;border-radius:9999px;background:var(--vibeui-files-002-muted);flex:none;
}
@keyframes vibeui-files-002-bounce{
0%{opacity:0;transform:translateY(0.625rem) scale(0.9)}
55%{opacity:1;transform:translateY(-0.125rem) scale(1.03)}
80%{transform:scale(0.99)}
100%{opacity:1;transform:none}
}
@keyframes vibeui-files-002-pop{
0%{opacity:0;transform:scale(0.5) rotate(-8deg)}
60%{opacity:1;transform:scale(1.08) rotate(2deg)}
100%{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="files-002"] [data-part="card"]{animation:none;transition:none}
[data-vibeui-block="files-002"] [data-part="icon"]{animation:none}
}
`

const KIND_ICONS: Record<Files002Kind, ReactNode> = {
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

/**
 * Простая карточка файла: иконка, имя, тип, размер. Появляется с лёгким
 * отскоком, приподнимается при наведении. Один файл, ноль зависимостей.
 */
export function Files002({
  name = "Презентация.pdf",
  type = "PDF документ",
  size = "2.4 МБ",
  kind = "doc",
  accent,
  bounce = true,
  className,
  style,
  ...props
}: Files002Props) {
  const palette = {
    ...(accent ? { "--vibeui-files-002-kind": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-files-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="files-002"
        data-slot="file-card"
        data-bounce={bounce ? undefined : "false"}
        data-kind={kind}
        aria-label={name}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <span data-part="icon">
            {KIND_ICONS[kind]}
          </span>
          <p data-part="name">{name}</p>
          <p data-part="meta">
            <span>{type}</span>
            <span data-part="dot" aria-hidden="true" />
            <span>{size}</span>
          </p>
        </div>
      </section>
    </>
  )
}
