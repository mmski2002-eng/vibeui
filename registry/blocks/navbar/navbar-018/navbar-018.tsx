"use client"

import { useEffect, useRef, useState } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
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
  /** Мерить прокрутку документа самому, игнорируя progress. */
  autoProgress?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Контекстная шапка статьи или урока: возврат в раздел, сокращённое
// название, содержание раскрытием и действие «сохранить / следующий
// урок». Полоса прогресса по умолчанию — представление значения,
// переданного владельцем прокрутки: одна страница не должна мерить
// прокрутку дважды. Если считать некому, autoProgress включает
// собственный замер документа.
//
// Панель ниже одной строки не растёт и не съедает высоту чтения.
// Клиентский JS нужен для содержания и — при autoProgress — для замера.
const STYLES = `
:where([data-vibeui-block="navbar-018"]){
--vibeui-navbar-018-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-018-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-018-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-018-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-018-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-018-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-018-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-018-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-018-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-018-on-accent:oklch(from var(--vibeui-navbar-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-018-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-018-dur-1:130ms;
--vibeui-navbar-018-dur-2:180ms;
--vibeui-navbar-018-dur-3:240ms;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-018"]{color-scheme:dark}
:where([data-vibeui-block="navbar-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-018"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-018-bg);color:var(--vibeui-navbar-018-ink);
border-bottom:1px solid var(--vibeui-navbar-018-line);
font-family:var(--vibeui-navbar-018-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-018"] *{box-sizing:border-box}
[data-vibeui-block="navbar-018"] [data-part="action"]{flex:none}
[data-vibeui-block="navbar-018"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
max-width:82rem;margin:0 auto;padding:0.625rem 1rem;min-height:3.5rem;
}

[data-vibeui-block="navbar-018"] [data-part="back"]{
flex:none;display:inline-flex;align-items:center;gap:0.4375rem;
padding:0.375rem 0.625rem 0.375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-navbar-018-muted);text-decoration:none;
font-size:0.875rem;font-weight:560;white-space:nowrap;
transition:color var(--vibeui-navbar-018-dur-1) ease,background-color var(--vibeui-navbar-018-dur-2) ease;
}
[data-vibeui-block="navbar-018"] [data-part="back"] svg{
width:0.875rem;height:0.875rem;
transition:transform var(--vibeui-navbar-018-dur-3) var(--vibeui-navbar-018-ease);
}
[data-vibeui-block="navbar-018"] [data-part="back"]:hover{
color:var(--vibeui-navbar-018-ink);background:var(--vibeui-navbar-018-hover);
}
[data-vibeui-block="navbar-018"] [data-part="back"]:hover svg{transform:translateX(-0.1875rem)}

[data-vibeui-block="navbar-018"] [data-part="title"]{
flex:1 1 auto;min-width:0;
padding-left:0.75rem;border-left:1px solid var(--vibeui-navbar-018-line);
font-size:0.9375rem;font-weight:620;letter-spacing:-0.015em;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

[data-vibeui-block="navbar-018"] [data-part="toc"]{position:relative;flex:none}
[data-vibeui-block="navbar-018"] [data-part="toc-button"]{
cursor:pointer;background:transparent;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.375rem;padding:0.25rem 0.8125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-navbar-018-line);
color:var(--vibeui-navbar-018-ink);font:inherit;
font-size:0.875rem;font-weight:560;white-space:nowrap;
transition:background-color var(--vibeui-navbar-018-dur-2) ease;
}
[data-vibeui-block="navbar-018"] [data-part="toc-button"]:hover{background:var(--vibeui-navbar-018-hover)}
[data-vibeui-block="navbar-018"] [data-part="toc-button"] span{
width:0.375rem;height:0.375rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translateY(-0.0625rem);
transition:transform var(--vibeui-navbar-018-dur-3) var(--vibeui-navbar-018-ease);
}
[data-vibeui-block="navbar-018"] [data-part="toc-button"][aria-expanded="true"] span{
transform:rotate(225deg) translateY(-0.0625rem);
}

[data-vibeui-block="navbar-018"] [data-part="panel"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:60;min-width:16rem;max-width:22rem;
background:var(--vibeui-navbar-018-bg);
border:1px solid var(--vibeui-navbar-018-line);border-radius:0.875rem;
box-shadow:var(--vibeui-navbar-018-shadow);
padding:0.375rem;display:flex;flex-direction:column;
transform-origin:top right;
transition:opacity var(--vibeui-navbar-018-dur-2) ease,transform var(--vibeui-navbar-018-dur-3) var(--vibeui-navbar-018-ease);
}
[data-vibeui-block="navbar-018"] [data-part="panel"][data-open="false"]{
opacity:0;transform:translateY(-0.375rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-018"] [data-part="panel"] a{
padding:0.5625rem 0.75rem;border-radius:0.5rem;
color:var(--vibeui-navbar-018-muted);text-decoration:none;
font-size:0.9375rem;line-height:1.4;
border-left:2px solid transparent;
transition:color var(--vibeui-navbar-018-dur-1) ease,background-color var(--vibeui-navbar-018-dur-1) ease;
}
[data-vibeui-block="navbar-018"] [data-part="panel"] a:hover{
color:var(--vibeui-navbar-018-ink);background:var(--vibeui-navbar-018-hover);
}
[data-vibeui-block="navbar-018"] [data-part="panel"] a[aria-current="true"]{
color:var(--vibeui-navbar-018-ink);font-weight:580;
border-left-color:var(--vibeui-navbar-018-accent);
}

[data-vibeui-block="navbar-018"] [data-part="progress"]{
position:absolute;left:0;bottom:-1px;height:2.5px;width:100%;
background:transparent;pointer-events:none;
}
[data-vibeui-block="navbar-018"] [data-part="progress"] i{
display:block;height:100%;width:var(--vibeui-navbar-018-progress,0%);
border-radius:0 2px 2px 0;
background:linear-gradient(90deg,
color-mix(in oklab,var(--vibeui-navbar-018-accent) 70%,#ffffff),
var(--vibeui-navbar-018-accent));
box-shadow:0 0 0.75rem color-mix(in oklab,var(--vibeui-navbar-018-accent) 55%,transparent);
transition:width var(--vibeui-navbar-018-dur-2) linear;
}


[data-vibeui-block="navbar-018"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-018-accent);outline-offset:3px;
}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-018"] *{animation:none!important;transition:none!important}}
@container (max-width: 39.9375rem){[data-vibeui-block="navbar-018"] [data-part="action"]{display:none}}
`

const DEFAULT_CHAPTERS: Navbar018Chapter[] = [
  { label: "Почему строка не шире 75 знаков", href: "#width", current: true },
  { label: "Воздух и интерлиньяж", href: "#air" },
  { label: "Изображения в тексте", href: "#images" },
]

/** Контекстная шапка статьи: возврат, название, содержание и полоса прогресса. */
export function Navbar018({
  backLabel = "Исследования",
  backHref = "#back",
  title = "Как читается длинный текст",
  chapters = DEFAULT_CHAPTERS,
  chaptersLabel = "Содержание",
  actionLabel = "Следующий урок",
  actionHref = "#next",
  progress = 34,
  autoProgress = false,
  tone = "auto",
  accent,
  className,
  style,
}: Navbar018Props) {
  const tocRef = useRef<HTMLDivElement>(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [measured, setMeasured] = useState<number | null>(null)

  useEffect(() => {
    if (!autoProgress) return

    const read = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      setMeasured(total > 0 ? (doc.scrollTop / total) * 100 : 0)
    }

    read()
    window.addEventListener("scroll", read, { passive: true })
    window.addEventListener("resize", read)

    return () => {
      window.removeEventListener("scroll", read)
      window.removeEventListener("resize", read)
    }
  }, [autoProgress])

  useEffect(() => {
    if (!tocOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTocOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!tocRef.current?.contains(event.target as Node)) setTocOpen(false)
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [tocOpen])

  const shown = autoProgress ? measured : progress
  const palette = {
    ...(accent ? { "--vibeui-navbar-018-accent": accent } : null),
    ...(shown !== null
      ? {
          "--vibeui-navbar-018-progress": `${Math.min(100, Math.max(0, shown))}%`,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-018" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-018"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="back" href={backHref}>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M13.5 8h-11M7 3.5 2.5 8 7 12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel}
          </a>

          <span data-part="title">{title}</span>

          <div ref={tocRef} data-part="toc">
            <button
              type="button"
              data-part="toc-button"
              aria-expanded={tocOpen}
              onClick={() => setTocOpen((open) => !open)}
            >
              {chaptersLabel}
              <span aria-hidden="true" />
            </button>
            <nav
              data-part="panel"
              data-open={tocOpen}
              aria-label={chaptersLabel}
              aria-hidden={!tocOpen}
            >
              {chapters.map((chapter) => (
                <a
                  key={chapter.href}
                  href={chapter.href}
                  tabIndex={tocOpen ? undefined : -1}
                  aria-current={chapter.current ? "true" : undefined}
                  onClick={() => setTocOpen(false)}
                >
                  {chapter.label}
                </a>
              ))}
            </nav>
          </div>

          <Button016
            data-part="action"
            label={actionLabel}
            href={actionHref}
            external={false}
            size="sm"
            tone="accent"
            accent={accent}
          />
        </div>

        {shown !== null ? (
          <div data-part="progress" aria-hidden="true">
            <i />
          </div>
        ) : null}
      </header>
    </>
  )
}
