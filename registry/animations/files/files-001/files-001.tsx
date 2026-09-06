import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Files001TreeItem = {
  name: string
  active?: boolean
  children?: string[]
}

export type Files001FileKind = "doc" | "image" | "code" | "archive" | "sheet"

export type Files001File = {
  name: string
  size: string
  kind?: Files001FileKind
}

export type Files001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Счётчик над списком. {count} подставляется числом. */
  countTemplate?: string
  title?: string
  breadcrumb?: string
  tree?: Files001TreeItem[]
  files?: Files001File[]
  accent?: string
  /** Циклическая демонстрация раскрытия папки. false — папка стоит открытой. */
  animate?: boolean
}

// Идея: классический двухпанельный проводник. Слева дерево папок, одна из
// них — активная и раскрывается на grid-template-rows трюке (0fr → 1fr,
// браузер сам считает конечную высоту без фиксированных px). Справа список
// файлов той же папки: строки появляются внахлёст с открытием, стаггером по
// nth-child. Обе анимации живут в одном бесконечном цикле, поэтому раскрытие
// папки и появление списка выглядят как одно действие, которое повторяется.
const STYLES = `
:where([data-vibeui-block="files-001"]){
--vibeui-files-001-frame:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-files-001-panel:light-dark(oklch(0.976 0 0),oklch(0.225 0 0));
--vibeui-files-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-files-001-muted:color-mix(in oklab,var(--vibeui-files-001-fg) 58%,transparent);
--vibeui-files-001-border:light-dark(oklch(0.91 0 0),oklch(0.3 0 0));
--vibeui-files-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-files-001-doc:light-dark(oklch(0.62 0.19 25),oklch(0.68 0.18 25));
--vibeui-files-001-image:light-dark(oklch(0.58 0.2 305),oklch(0.68 0.18 305));
--vibeui-files-001-code:light-dark(oklch(0.62 0.13 210),oklch(0.7 0.13 210));
--vibeui-files-001-archive:light-dark(oklch(0.7 0.14 75),oklch(0.75 0.13 75));
--vibeui-files-001-sheet:light-dark(oklch(0.62 0.15 148),oklch(0.7 0.14 148));
--vibeui-files-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="files-001"]{color-scheme:dark}
[data-vibeui-block="files-001"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-files-001-fg);font-family:var(--vibeui-files-001-font);
}
[data-vibeui-block="files-001"] *{box-sizing:border-box}
[data-vibeui-block="files-001"] [data-part="window"]{
overflow:hidden;border-radius:0.875rem;border:1px solid var(--vibeui-files-001-border);
background:var(--vibeui-files-001-frame);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05),0 14px 30px -18px oklch(0 0 0 / 0.3);
}
[data-vibeui-block="files-001"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;padding:0.625rem 0.75rem;
border-bottom:1px solid var(--vibeui-files-001-border);
}
[data-vibeui-block="files-001"] [data-part="dots"]{display:flex;gap:0.25rem;flex:none}
[data-vibeui-block="files-001"] [data-part="dot"]{width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-files-001-border)}
[data-vibeui-block="files-001"] [data-part="crumb"]{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-files-001-muted);text-align:center;
}
[data-vibeui-block="files-001"] [data-part="body"]{display:flex;align-items:stretch;min-height:11rem}
[data-vibeui-block="files-001"] [data-part="tree"]{
flex:none;width:8.5rem;padding:0.5rem;margin:0;list-style:none;
border-right:1px solid var(--vibeui-files-001-border);background:var(--vibeui-files-001-panel);
}
[data-vibeui-block="files-001"] [data-part="branch"]{display:flex;flex-direction:column}
[data-vibeui-block="files-001"] [data-part="node"]{
display:flex;align-items:center;gap:0.375rem;padding:0.3125rem 0.375rem;border-radius:0.5rem;
font-size:0.6875rem;font-weight:550;color:var(--vibeui-files-001-muted);
}
[data-vibeui-block="files-001"] [data-part="node"][data-active="true"]{
color:var(--vibeui-files-001-accent);
background:color-mix(in oklab,var(--vibeui-files-001-accent) 12%,transparent);
}
[data-vibeui-block="files-001"] [data-part="node"] svg{width:0.875rem;height:0.875rem;flex:none}
[data-vibeui-block="files-001"] [data-part="folder-icon"]{color:var(--vibeui-files-001-accent)}
[data-vibeui-block="files-001"] [data-part="label"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="files-001"] [data-part="chevron"]{transition:transform .2s ease;color:var(--vibeui-files-001-muted)}
[data-vibeui-block="files-001"] [data-part="kids"]{
display:grid;grid-template-rows:0fr;
animation:vibeui-files-001-fold 7s ease-in-out infinite;
}
[data-vibeui-block="files-001"][data-animate="false"] [data-part="kids"]{animation:none;grid-template-rows:1fr}
[data-vibeui-block="files-001"][data-animate="false"] [data-part="chevron"]{transform:rotate(90deg)}
[data-vibeui-block="files-001"] [data-part="kids-inner"]{overflow:hidden;min-height:0}
[data-vibeui-block="files-001"] [data-part="sub"]{margin:0.125rem 0 0.125rem 0.5rem;padding:0;list-style:none;
border-left:1px solid var(--vibeui-files-001-border);}
[data-vibeui-block="files-001"] [data-part="subnode"]{
display:flex;align-items:center;gap:0.375rem;padding:0.25rem 0 0.25rem 0.5rem;
font-size:0.625rem;color:var(--vibeui-files-001-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="files-001"] [data-part="subnode"] svg{width:0.75rem;height:0.75rem;flex:none;color:var(--vibeui-files-001-muted)}
[data-vibeui-block="files-001"] [data-part="list"]{flex:1 1 auto;min-width:0;display:flex;flex-direction:column}
[data-vibeui-block="files-001"] [data-part="listhead"]{
padding:0.5rem 0.75rem 0.25rem;font-size:0.625rem;font-weight:600;color:var(--vibeui-files-001-muted);
}
[data-vibeui-block="files-001"] [data-part="files"]{margin:0;padding:0.25rem 0.5rem 0.5rem;list-style:none;flex:1 1 auto}
[data-vibeui-block="files-001"] [data-part="file"]{
display:flex;align-items:center;gap:0.5rem;padding:0.3125rem 0.25rem;border-radius:0.5rem;
animation:vibeui-files-001-reveal 7s ease-in-out infinite;
}
[data-vibeui-block="files-001"][data-animate="false"] [data-part="file"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="files-001"] [data-part="file"]:nth-child(2){animation-delay:0.08s}
[data-vibeui-block="files-001"] [data-part="file"]:nth-child(3){animation-delay:0.16s}
[data-vibeui-block="files-001"] [data-part="file"]:nth-child(4){animation-delay:0.24s}
[data-vibeui-block="files-001"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;border-radius:0.4375rem;color:#fff;
}
[data-vibeui-block="files-001"] [data-part="icon"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="files-001"] [data-part="icon"][data-kind="doc"]{background:var(--vibeui-files-001-doc)}
[data-vibeui-block="files-001"] [data-part="icon"][data-kind="image"]{background:var(--vibeui-files-001-image)}
[data-vibeui-block="files-001"] [data-part="icon"][data-kind="code"]{background:var(--vibeui-files-001-code)}
[data-vibeui-block="files-001"] [data-part="icon"][data-kind="archive"]{background:var(--vibeui-files-001-archive)}
[data-vibeui-block="files-001"] [data-part="icon"][data-kind="sheet"]{background:var(--vibeui-files-001-sheet)}
[data-vibeui-block="files-001"] [data-part="finfo"]{min-width:0;flex:1 1 auto;display:flex;flex-direction:column}
[data-vibeui-block="files-001"] [data-part="fname"]{
font-size:0.6875rem;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="files-001"] [data-part="fsize"]{font-size:0.5625rem;color:var(--vibeui-files-001-muted)}
@keyframes vibeui-files-001-fold{
0%,10%{grid-template-rows:0fr}
30%,88%{grid-template-rows:1fr}
100%{grid-template-rows:0fr}
}
[data-vibeui-block="files-001"] [data-part="branch"][data-active="true"] [data-part="chevron"]{
animation:vibeui-files-001-chevron 7s ease-in-out infinite;
}
@keyframes vibeui-files-001-chevron{
0%,10%{transform:rotate(0deg)}
30%,88%{transform:rotate(90deg)}
100%{transform:rotate(0deg)}
}
@keyframes vibeui-files-001-reveal{
0%,26%{opacity:0;transform:translateX(-4px)}
42%,88%{opacity:1;transform:none}
100%{opacity:0;transform:translateX(-4px)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="files-001"] [data-part="kids"]{animation:none;grid-template-rows:1fr}
[data-vibeui-block="files-001"] [data-part="chevron"]{animation:none;transform:rotate(90deg)}
[data-vibeui-block="files-001"] [data-part="file"]{animation:none;opacity:1;transform:none}
}
`

const FOLDER_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    data-part="folder-icon"
  >
    <path d="M3 7a2 2 0 0 1 2-2h4.5l1.7 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
)

const CHEVRON_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-part="chevron"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
)

const SUBFOLDER_ICON = (
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
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
)

const KIND_ICONS: Record<Files001FileKind, ReactNode> = {
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
      <rect
        x="10.5"
        y="7"
        width="3"
        height="4"
        rx="0.5"
        fill="currentColor"
        stroke="none"
      />
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

const DEFAULT_TREE: Files001TreeItem[] = [
  { name: "Проекты" },
  { name: "Дизайн", active: true, children: ["Макеты", "Иконки", "Экспорт"] },
  { name: "Архив" },
  { name: "Общий доступ" },
]

const DEFAULT_FILES: Files001File[] = [
  { name: "Макет.fig", size: "4.2 МБ", kind: "image" },
  { name: "Иконки.svg", size: "128 КБ", kind: "code" },
  { name: "Бриф.pdf", size: "860 КБ", kind: "doc" },
  { name: "Смета.xlsx", size: "96 КБ", kind: "sheet" },
]

/**
 * Двухпанельный проводник: дерево папок слева, список файлов справа.
 * Активная папка раскрывается на grid-template-rows (0fr → 1fr), список
 * файлов появляется стаггером — один файл, ноль зависимостей.
 */
export function Files001({
  countTemplate = "{count} файла",
  title = "Проводник",
  breadcrumb = "Диск / Дизайн",
  tree = DEFAULT_TREE,
  files = DEFAULT_FILES,
  accent,
  animate = true,
  className,
  style,
  ...props
}: Files001Props) {
  const palette = {
    ...(accent ? { "--vibeui-files-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-files-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="files-001"
        data-slot="file-explorer"
        data-animate={animate ? undefined : "false"}
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="window">
          <div data-part="head">
            <span data-part="dots" aria-hidden="true">
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="dot" />
            </span>
            <p data-part="crumb">{breadcrumb}</p>
          </div>
          <div data-part="body">
            <ul data-part="tree">
              {tree.map((item) => (
                <li
                  data-part="branch"
                  data-active={item.active ? "true" : undefined}
                  key={item.name}
                >
                  <span
                    data-part="node"
                    data-active={item.active ? "true" : undefined}
                  >
                    {FOLDER_ICON}
                    <span data-part="label">{item.name}</span>
                    {item.children ? CHEVRON_ICON : null}
                  </span>
                  {item.children ? (
                    <div data-part="kids">
                      <div data-part="kids-inner">
                        <ul data-part="sub">
                          {item.children.map((child) => (
                            <li data-part="subnode" key={child}>
                              {SUBFOLDER_ICON}
                              {child}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
            <div data-part="list">
              <p data-part="listhead">
                {countTemplate.replace("{count}", String(files.length))}
              </p>
              <ul data-part="files">
                {files.map((file) => (
                  <li data-part="file" key={file.name}>
                    <span data-part="icon" data-kind={file.kind ?? "doc"}>
                      {KIND_ICONS[file.kind ?? "doc"]}
                    </span>
                    <span data-part="finfo">
                      <span data-part="fname">{file.name}</span>
                      <span data-part="fsize">{file.size}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
