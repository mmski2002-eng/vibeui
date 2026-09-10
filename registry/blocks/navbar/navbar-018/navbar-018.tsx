import type { CSSProperties } from "react"

type Navbar018Chapter = {
  label: string
  href: string
  current?: boolean
}

export type Navbar018Props = {
  /** Ссылка возврата в раздел. */
  backLabel?: string
  backHref?: string
  /** Сокращённый заголовок материала. */
  title?: string
  /** Содержание материала. */
  chapters?: Navbar018Chapter[]
  chaptersLabel?: string
  /** Действие: сохранить или следующий урок. */
  actionLabel?: string
  actionHref?: string
  /** Прогресс чтения 0–100 от scrollspy проекта; null скрывает полосу. */
  progress?: number | null
  accent?: string
  className?: string
  style?: CSSProperties
}

// Контекстная шапка статьи или урока: возврат в раздел, сокращённое
// название, содержание раскрытием и действие «сохранить / следующий
// урок». Полоса прогресса — представление значения, переданного одним
// владельцем прокрутки (scrollspy принимающего проекта): сама шапка
// ничего не измеряет и не перелистывает. Панель ниже одной строки не
// растёт и не съедает высоту чтения. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-018"]){
--vibeui-navbar-018-bg:#ffffff;
--vibeui-navbar-018-ink:#000000;
--vibeui-navbar-018-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-018-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-018-accent:#ff5900;
--vibeui-navbar-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-018"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-018-bg);color:var(--vibeui-navbar-018-ink);
border-bottom:1px solid var(--vibeui-navbar-018-line);
font-family:var(--vibeui-navbar-018-font);
}
[data-vibeui-block="navbar-018"] *{box-sizing:border-box}
[data-vibeui-block="navbar-018"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
max-width:82rem;margin:0 auto;padding:0.625rem 1rem;min-height:3.25rem;
}
[data-vibeui-block="navbar-018"] [data-part="back"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
color:var(--vibeui-navbar-018-muted);text-decoration:none;
font-size:0.875rem;font-weight:560;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-018"] [data-part="back"]::before{
content:"←";font-size:1rem;line-height:1;
}
[data-vibeui-block="navbar-018"] [data-part="back"]:hover{color:var(--vibeui-navbar-018-ink)}
[data-vibeui-block="navbar-018"] [data-part="title"]{
flex:1 1 auto;min-width:0;
font-size:0.9375rem;font-weight:620;letter-spacing:-0.01em;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-018"] [data-part="toc"]{position:relative;flex:none}
[data-vibeui-block="navbar-018"] [data-part="toc"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.25rem;padding:0.25rem 0.8125rem;
border:1px solid var(--vibeui-navbar-018-line);
font-size:0.875rem;font-weight:560;white-space:nowrap;
}
[data-vibeui-block="navbar-018"] [data-part="toc"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-018"] [data-part="toc"] summary::after{
content:"";width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translateY(-0.0625rem);
}
[data-vibeui-block="navbar-018"] [data-part="panel"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:20;min-width:15rem;max-width:20rem;
background:var(--vibeui-navbar-018-bg);border:1px solid var(--vibeui-navbar-018-line);
box-shadow:0 0.75rem 2rem color-mix(in oklab,#000000 14%,transparent);
padding:0.375rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-018"] [data-part="panel"] a{
padding:0.5625rem 0.75rem;color:var(--vibeui-navbar-018-muted);text-decoration:none;
font-size:0.9375rem;line-height:1.4;
border-left:2px solid transparent;
transition:color .16s ease;
}
[data-vibeui-block="navbar-018"] [data-part="panel"] a:hover{color:var(--vibeui-navbar-018-ink)}
[data-vibeui-block="navbar-018"] [data-part="panel"] a[aria-current="true"]{
color:var(--vibeui-navbar-018-ink);font-weight:580;
border-left-color:var(--vibeui-navbar-018-accent);
}
[data-vibeui-block="navbar-018"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;
min-height:2.25rem;padding:0.25rem 0.9375rem;
background:var(--vibeui-navbar-018-accent);color:#000000;
text-decoration:none;font-size:0.875rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-018"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-018"] [data-part="progress"]{
position:absolute;left:0;bottom:-1px;height:2px;width:100%;
background:transparent;pointer-events:none;
}
[data-vibeui-block="navbar-018"] [data-part="progress"] i{
display:block;height:100%;width:var(--vibeui-navbar-018-progress,0%);
background:var(--vibeui-navbar-018-accent);
}
[data-vibeui-block="navbar-018"] a:focus-visible,
[data-vibeui-block="navbar-018"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-018-accent);outline-offset:2px;
}
@container (max-width: 39.9375rem){
[data-vibeui-block="navbar-018"] [data-part="action"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHAPTERS: Navbar018Chapter[] = [
  { label: "Почему строка не шире 75 знаков", href: "#width", current: true },
  { label: "Воздух и интерлиньяж", href: "#air" },
  { label: "Изображения в тексте", href: "#images" },
]

/** Контекстная шапка статьи: возврат, название, содержание и прогресс от проекта. */
export function Navbar018({
  backLabel = "Исследования",
  backHref = "#back",
  title = "Как читается длинный текст",
  chapters = DEFAULT_CHAPTERS,
  chaptersLabel = "Содержание",
  actionLabel = "Следующий урок",
  actionHref = "#next",
  progress = 34,
  accent,
  className,
  style,
}: Navbar018Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-018-accent": accent } : null),
    ...(progress !== null
      ? { "--vibeui-navbar-018-progress": `${Math.min(100, Math.max(0, progress))}%` }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-018" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-018" className={className} style={palette}>
        <div data-part="shell">
          <a data-part="back" href={backHref}>
            {backLabel}
          </a>
          <span data-part="title">{title}</span>
          <details data-part="toc">
            <summary>{chaptersLabel}</summary>
            <nav data-part="panel" aria-label={chaptersLabel}>
              {chapters.map((chapter) => (
                <a
                  key={chapter.href}
                  href={chapter.href}
                  aria-current={chapter.current ? "true" : undefined}
                >
                  {chapter.label}
                </a>
              ))}
            </nav>
          </details>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        {progress !== null ? (
          <div data-part="progress" aria-hidden="true">
            <i />
          </div>
        ) : null}
      </header>
    </>
  )
}
