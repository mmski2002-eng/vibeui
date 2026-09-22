"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card074 } from "@/registry/components/card/card-074/card-074"

export type Layout016Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout016Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 шапка (title — логотип, text — счётчик), 02 рубрики, 03 карточка, 04 карточка, 05 карточка, 06 карточка. Без них — призрак. */
  items?: readonly Layout016Item[]
  /** Число колонок в сетке карточек. */
  density?: "two" | "three"
  /** Показывать рубрики слева. */
  sidebar?: boolean
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Каталог с боковой навигацией — раскладка витрины, как у VibeUI:
// шапка с логотипом, разделами и поиском, панель фильтра, слева рубрики со
// счётчиками, справа сетка карточек с превью и подписью. Активная рубрика
// подсвечена, рубрики закреплены при прокрутке контента.
const SLOTS = ["brand", "rubrics", "k1", "k2", "k3", "k4"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  brand: "empty",
  rubrics: "list",
  k1: "window",
  k2: "image",
  k3: "chart",
  k4: "proof",
}

const STYLES = `
:where([data-vibeui-block="layout-016"]){
--vibeui-layout-016-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-016-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-016-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-016-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-016-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-016-ink:light-dark(#000000,#ffffff);
--vibeui-layout-016-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-016-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-016-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-016-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-016-on-accent:oklch(from var(--vibeui-layout-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-016-glow:color-mix(in oklab,var(--vibeui-layout-016-accent) 42%,transparent);
--vibeui-layout-016-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-016-radius:1.25rem;--vibeui-layout-016-dur-4:340ms;--vibeui-layout-016-dur-5:460ms;
--vibeui-layout-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-016-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-016"]{color-scheme:dark}
:where([data-vibeui-block="layout-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-016"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-016-bg);color:var(--vibeui-layout-016-ink);font-family:var(--vibeui-layout-016-font)}
[data-vibeui-block="layout-016"] *{box-sizing:border-box}
[data-vibeui-block="layout-016"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-016"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-016"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-016"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-016-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-016"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-016-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-016"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-016"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-016-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-016"][data-numbers] [data-part="icon"]{margin-top:2rem}
[data-vibeui-block="layout-016"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-016-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-016-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-016"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-016-ghost-strong)}
[data-vibeui-block="layout-016"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-016-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-016-dur-5) cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-layout-016-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-016-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-016"] [data-part="frame"]{padding:0;max-width:none}
[data-vibeui-block="layout-016"] [data-part="body"]{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr);height:min(46rem,100dvh);border:1px solid var(--vibeui-layout-016-edge);border-radius:var(--vibeui-layout-016-radius);overflow:hidden;background:var(--vibeui-layout-016-tile)}
/* Шапка: логотип, счётчик, разделы, поиск и действия. */
[data-vibeui-block="layout-016"] [data-part="top"]{display:flex;align-items:center;gap:1rem;padding:0.75rem 1.25rem;border-bottom:1px solid var(--vibeui-layout-016-edge)}
[data-vibeui-block="layout-016"] [data-part="logo"]{display:flex;align-items:center;gap:0.5rem;font-weight:700;letter-spacing:-0.02em;font-size:1.125rem}
[data-vibeui-block="layout-016"] [data-part="logo"] i{width:1.25rem;height:1.25rem;border-radius:0.3rem;background:var(--vibeui-layout-016-accent)}
[data-vibeui-block="layout-016"] [data-part="logo"] b{display:block;width:4rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-016-ghost-strong)}
[data-vibeui-block="layout-016"] [data-part="count"]{font:500 0.7rem/1 var(--vibeui-layout-016-mono);letter-spacing:0.08em;color:var(--vibeui-layout-016-muted);text-transform:uppercase}
[data-vibeui-block="layout-016"] [data-part="sections"]{display:none;gap:0.25rem;margin-left:0.5rem}
[data-vibeui-block="layout-016"] [data-part="sections"] span{padding:0.35rem 0.75rem;border-radius:0.5rem;font-size:0.95rem;color:var(--vibeui-layout-016-muted)}
[data-vibeui-block="layout-016"] [data-part="sections"] span:first-child{background:color-mix(in oklab,var(--vibeui-layout-016-ink) 8%,transparent);color:var(--vibeui-layout-016-ink);font-weight:550}
[data-vibeui-block="layout-016"] [data-part="tools"]{margin-left:auto;display:flex;gap:0.5rem}
[data-vibeui-block="layout-016"] [data-part="tools"] i{width:2rem;height:2rem;border-radius:999px;border:1px solid var(--vibeui-layout-016-edge)}
[data-vibeui-block="layout-016"] [data-part="tools"] i:last-child{width:5rem;border-radius:0.5rem;background:var(--vibeui-layout-016-accent);border-color:transparent}
/* Панель фильтра: поиск во всю ширину и переключатель вида. */
[data-vibeui-block="layout-016"] [data-part="filter"]{display:flex;align-items:center;gap:0.75rem;padding:0.6rem 1.25rem;border-bottom:1px solid var(--vibeui-layout-016-edge)}
[data-vibeui-block="layout-016"] [data-part="search"]{flex:1;display:flex;align-items:center;gap:0.5rem;padding:0.45rem 0.75rem;border:1px solid var(--vibeui-layout-016-edge);border-radius:0.5rem;color:var(--vibeui-layout-016-muted);font-size:0.95rem}
[data-vibeui-block="layout-016"] [data-part="search"] i{width:0.9rem;height:0.9rem;border-radius:999px;border:2px solid var(--vibeui-layout-016-muted)}
[data-vibeui-block="layout-016"] [data-part="view"]{display:flex;gap:0.25rem}
[data-vibeui-block="layout-016"] [data-part="view"] i{width:1.75rem;height:1.75rem;border-radius:0.4rem;border:1px solid var(--vibeui-layout-016-edge)}
[data-vibeui-block="layout-016"] [data-part="view"] i:first-child{background:color-mix(in oklab,var(--vibeui-layout-016-ink) 8%,transparent)}
/* Рубрики: закреплённая колонка со счётчиками, активная подсвечена. */
[data-vibeui-block="layout-016"] [data-part="main"]{display:grid;grid-template-columns:minmax(0,1fr);min-height:0}
[data-vibeui-block="layout-016"] [data-part="side"]{display:none;flex-direction:column;gap:0.25rem;padding:1rem;border-right:1px solid var(--vibeui-layout-016-edge);overflow:auto}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"]{background:none;border:0;padding:0;min-height:0;justify-content:flex-start}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"]::before,[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"]::after{display:none}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"]:hover{transform:none}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="num"]{position:static;align-self:flex-start;margin-bottom:0.5rem}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="rows"]{justify-content:flex-start;gap:0.25rem;margin-top:0}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="rows"] span{padding:0.5rem 0.75rem;border-radius:0.5rem;gap:0.5rem}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="rows"] span::after{content:"";width:0.9rem;height:0.5rem;border-radius:999px;background:var(--vibeui-card-074-ghost);flex:none}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="rows"] i{display:none}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="rows"] span:first-child{background:color-mix(in oklab,var(--vibeui-card-074-accent) 12%,transparent);box-shadow:inset 3px 0 0 var(--vibeui-card-074-accent)}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] [data-part="rows"] b{max-width:none}
[data-vibeui-block="layout-016"] [data-part="side"] [data-vibeui-block="card-074"] > [data-part="bar"]{display:none}
[data-vibeui-block="layout-016"] [data-part="group"]{font:500 0.7rem/1 var(--vibeui-layout-016-mono);letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-layout-016-muted);padding:0.75rem 0.75rem 0.25rem}
/* Сетка карточек: превью, код и название, теги. */
[data-vibeui-block="layout-016"] [data-part="grid"]{overflow:auto;padding:1.25rem;display:grid;gap:1rem;grid-template-columns:minmax(0,1fr);align-content:start;scrollbar-width:thin;scrollbar-color:var(--vibeui-layout-016-edge-hover) transparent}
[data-vibeui-block="layout-016"] [data-part="card"]{display:flex;flex-direction:column;border:1px solid var(--vibeui-layout-016-edge);border-radius:1rem;overflow:hidden;background:var(--vibeui-layout-016-tile);transition:border-color var(--vibeui-layout-016-dur-4)}
[data-vibeui-block="layout-016"] [data-part="card"]:hover{border-color:var(--vibeui-layout-016-edge-hover)}
[data-vibeui-block="layout-016"] [data-part="card"] [data-vibeui-block="card-074"]{border:0;border-radius:0;height:11rem;min-height:0;background:var(--vibeui-card-074-tile-2)}
[data-vibeui-block="layout-016"] [data-part="card"] [data-vibeui-block="card-074"]::after{display:none}
[data-vibeui-block="layout-016"] [data-part="card"] [data-vibeui-block="card-074"]:hover{transform:none}
[data-vibeui-block="layout-016"] [data-part="caption"]{display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.75rem;border-top:1px solid var(--vibeui-layout-016-edge);font-size:0.9rem}
[data-vibeui-block="layout-016"] [data-part="code"]{font:500 0.7rem/1 var(--vibeui-layout-016-mono);padding:0.25rem 0.4rem;border:1px solid var(--vibeui-layout-016-edge);border-radius:0.3rem;color:var(--vibeui-layout-016-muted)}
[data-vibeui-block="layout-016"] [data-part="caption"] b{display:block;height:0.6rem;width:7rem;border-radius:999px;background:var(--vibeui-layout-016-ghost-strong)}
[data-vibeui-block="layout-016"] [data-part="caption"] i{margin-left:auto;width:4.5rem;height:1.5rem;border-radius:0.4rem;border:1px solid var(--vibeui-layout-016-edge)}
[data-vibeui-block="layout-016"]:not([data-sidebar]) [data-part="side"]{display:none}
@container (min-width: 40rem){
[data-vibeui-block="layout-016"] [data-part="sections"]{display:flex}
[data-vibeui-block="layout-016"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="layout-016"][data-sidebar] [data-part="main"]{grid-template-columns:15rem minmax(0,1fr)}
[data-vibeui-block="layout-016"][data-sidebar] [data-part="side"]{display:flex}
[data-vibeui-block="layout-016"][data-density="three"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-016"] *{animation:none!important;transition:none!important}
}
`



/** Каталог с боковой навигацией: шапка, панель фильтров, рубрики слева, сетка карточек. */
export function Layout016({
  heading,
  lead,
  items,
  density = "two",
  sidebar = true,
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout016Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-016-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card074 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
  )
  const frame = useRef(0)

  // Один слушатель на раскладку: событие всплывает от плитки, координаты
  // пишутся только ей. Только мышь — на touch свет не нужен.
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return

    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    if (!target) return

    const bounds = target.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--vibeui-card-074-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-074-my", `${y}%`)
      target.style.setProperty("--vibeui-card-074-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-074-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-016"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-density={density === "two" ? undefined : density}
        data-sidebar={sidebar ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">

          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            <header data-part="top">
              <span data-part="logo">
                <i aria-hidden="true" />
                {items?.[0]?.title ?? <b aria-hidden="true" />}
              </span>
              <span data-part="count">{items?.[0]?.text ?? "1538 элементов"}</span>
              <span data-part="sections" aria-hidden="true">
                <span>Компоненты</span>
                <span>Блоки</span>
                <span>Анимации</span>
              </span>
              <span data-part="tools" aria-hidden="true"><i /><i /><i /></span>
            </header>
            <div data-part="filter">
              <span data-part="search"><i aria-hidden="true" />Поиск по всему каталогу…</span>
              <span data-part="view" aria-hidden="true"><i /><i /></span>
            </div>
            <div data-part="main">
              <aside data-part="side">
                <span data-part="group">Популярное</span>
                {tile("rubrics")}
              </aside>
              <div data-part="grid">
                {(["k1", "k2", "k3", "k4"] as const).map((area, index) => (
                  <article data-part="card" key={area}>
                    {tile(area)}
                    <div data-part="caption">
                      <span data-part="code">{`VU00${index + 1}`}</span>
                      {items?.[index + 2]?.title ? <span>{items[index + 2]?.title}</span> : <b aria-hidden="true" />}
                      <i aria-hidden="true" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
