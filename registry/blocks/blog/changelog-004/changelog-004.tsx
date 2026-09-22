"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Changelog004Release = {
  version: string
  date: string
  title: string
  /** Пункты: строка с префиксом «!» — breaking change. */
  items: readonly string[]
  breaking?: boolean
}

export type Changelog004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  releases?: readonly Changelog004Release[]
  breakingLabel?: string
  latestLabel?: string
  allLabel?: string
  allHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// История версий лентой: при появлении в кадре вертикальная линия
// прочерчивается сверху вниз, релизы выезжают слева один за другим, у
// последнего точка и чип «latest» пульсируют. Версия моноширинным тегом,
// дата, заголовок, чип «breaking» у релизов с ломающими изменениями.
// Первый релиз раскрыт, остальные раскрываются по клику
// (grid-template-rows 0fr → 1fr, aria-expanded); пункты с «!» помечены
// красной меткой. Заголовок секции въезжает словами через маски.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="changelog-004"]){
--vibeui-changelog-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-changelog-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-changelog-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-changelog-004-on-accent:oklch(from var(--vibeui-changelog-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-changelog-004-muted:color-mix(in oklab,var(--vibeui-changelog-004-fg) 60%,var(--vibeui-changelog-004-bg));
--vibeui-changelog-004-line:color-mix(in oklab,var(--vibeui-changelog-004-fg) 12%,transparent);
--vibeui-changelog-004-panel:color-mix(in oklab,var(--vibeui-changelog-004-fg) 4%,var(--vibeui-changelog-004-bg));
--vibeui-changelog-004-danger:#e5484d;
--vibeui-changelog-004-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-changelog-004-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-changelog-004-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="changelog-004"]{color-scheme:dark}
:where([data-vibeui-block="changelog-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="changelog-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="changelog-004"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-changelog-004-bg);color:var(--vibeui-changelog-004-fg);font-family:var(--vibeui-changelog-004-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="changelog-004"] *{box-sizing:border-box}
[data-vibeui-block="changelog-004"] [data-part="all"]{margin-top:1.2rem}
[data-vibeui-block="changelog-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="changelog-004"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-changelog-004-mono);font-size:.75rem;color:var(--vibeui-changelog-004-accent)}
[data-vibeui-block="changelog-004"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.2rem,5.2cqi,3.8rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="changelog-004"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.05em .1em .18em 0;margin:-.05em -.1em -.18em 0}
[data-vibeui-block="changelog-004"] [data-part="w"] > span{display:inline-block;transform:translateY(110%)}
[data-vibeui-block="changelog-004"][data-shown="true"] [data-part="w"] > span{animation:vibeui-changelog-004-rise .8s var(--vibeui-changelog-004-ease) forwards;animation-delay:calc(var(--vibeui-changelog-004-i,0) * .05s)}
[data-vibeui-block="changelog-004"] [data-reveal]{opacity:0}
[data-vibeui-block="changelog-004"][data-shown="true"] [data-reveal]{opacity:1;animation:vibeui-changelog-004-up .8s var(--vibeui-changelog-004-ease) backwards;animation-delay:calc(.15s + var(--vibeui-changelog-004-i,0) * .1s)}
[data-vibeui-block="changelog-004"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-changelog-004-muted);font-size:1.05rem}
[data-vibeui-block="changelog-004"] [data-part="list"]{position:relative;margin:0;padding:0 0 0 1.6rem;list-style:none}
[data-vibeui-block="changelog-004"] [data-part="list"]::before{content:"";position:absolute;left:0;top:0;bottom:0;width:1px;background:linear-gradient(var(--vibeui-changelog-004-accent),var(--vibeui-changelog-004-line) 40%);transform:scaleY(0);transform-origin:top;transition:transform 1.6s var(--vibeui-changelog-004-ease) .2s}
[data-vibeui-block="changelog-004"][data-shown="true"] [data-part="list"]::before{transform:none}
[data-vibeui-block="changelog-004"] [data-part="rel"]{position:relative;padding:0 0 1.6rem;opacity:0}
[data-vibeui-block="changelog-004"][data-shown="true"] [data-part="rel"]{opacity:1;animation:vibeui-changelog-004-slide .7s var(--vibeui-changelog-004-ease) backwards;animation-delay:calc(.3s + var(--vibeui-changelog-004-i,0) * .16s)}
[data-vibeui-block="changelog-004"] [data-part="rel"]::before{content:"";position:absolute;left:calc(-1.6rem - 5px);top:.9rem;width:9px;height:9px;border-radius:50%;background:var(--vibeui-changelog-004-line);box-shadow:0 0 0 3px var(--vibeui-changelog-004-bg)}
[data-vibeui-block="changelog-004"] [data-part="rel"]:first-child::before{background:var(--vibeui-changelog-004-accent);animation:vibeui-changelog-004-pulse 2s ease-out infinite}
[data-vibeui-block="changelog-004"] [data-part="head"]{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;padding:.5rem 0;transition:transform .35s var(--vibeui-changelog-004-ease)}
[data-vibeui-block="changelog-004"] [data-part="head"]:hover{transform:translateX(4px)}
[data-vibeui-block="changelog-004"] [data-part="ver"]{font-family:var(--vibeui-changelog-004-mono);font-weight:600;font-size:.82rem;padding:.2rem .5rem;border-radius:5px;background:var(--vibeui-changelog-004-panel);border:1px solid var(--vibeui-changelog-004-line)}
[data-vibeui-block="changelog-004"] [data-part="rel"]:first-child [data-part="ver"]{background:var(--vibeui-changelog-004-accent);color:var(--vibeui-changelog-004-on-accent);border-color:transparent}
[data-vibeui-block="changelog-004"] [data-part="date"]{font-family:var(--vibeui-changelog-004-mono);font-size:.72rem;color:var(--vibeui-changelog-004-muted)}
[data-vibeui-block="changelog-004"] [data-part="chip"]{font-family:var(--vibeui-changelog-004-mono);font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;padding:.15rem .4rem;border-radius:4px;background:color-mix(in oklab,var(--vibeui-changelog-004-danger) 14%,transparent);color:var(--vibeui-changelog-004-danger)}
[data-vibeui-block="changelog-004"] [data-part="chip"][data-kind="latest"]{position:relative;background:color-mix(in oklab,var(--vibeui-changelog-004-accent) 14%,transparent);color:var(--vibeui-changelog-004-accent);animation:vibeui-changelog-004-fresh 2s ease-out infinite}
[data-vibeui-block="changelog-004"] [data-part="name"]{width:100%;font-weight:700;font-size:1.1rem;letter-spacing:-.01em;display:flex;justify-content:space-between;gap:1rem}
[data-vibeui-block="changelog-004"] [data-part="name"]::after{content:"+";font-family:var(--vibeui-changelog-004-mono);color:var(--vibeui-changelog-004-muted);transition:transform .3s}
[data-vibeui-block="changelog-004"] [data-part="head"][aria-expanded="true"] [data-part="name"]::after{transform:rotate(45deg)}
[data-vibeui-block="changelog-004"] [data-part="body"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="changelog-004"] [data-part="body"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="changelog-004"] [data-part="body"] > div{overflow:hidden}
[data-vibeui-block="changelog-004"] [data-part="items"]{margin:.4rem 0 0;padding:0;list-style:none;display:grid;gap:.4rem;font-size:.92rem;color:var(--vibeui-changelog-004-muted)}
[data-vibeui-block="changelog-004"] [data-part="items"] li{display:flex;gap:.6rem;align-items:baseline}
[data-vibeui-block="changelog-004"] [data-part="items"] li::before{content:"–";font-family:var(--vibeui-changelog-004-mono);color:var(--vibeui-changelog-004-accent)}
[data-vibeui-block="changelog-004"] [data-part="items"] li[data-breaking="true"]{color:var(--vibeui-changelog-004-fg)}
[data-vibeui-block="changelog-004"] [data-part="items"] li[data-breaking="true"]::before{content:"!";color:var(--vibeui-changelog-004-danger);font-weight:700}
[data-vibeui-block="changelog-004"] [data-part="head"]:focus-visible{outline:2px solid var(--vibeui-changelog-004-accent);outline-offset:2px}
@keyframes vibeui-changelog-004-rise{to{transform:none}}
@keyframes vibeui-changelog-004-up{from{opacity:0;transform:translateY(22px)}}
@keyframes vibeui-changelog-004-slide{from{opacity:0;transform:translateX(-18px)}}
@keyframes vibeui-changelog-004-fresh{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-changelog-004-accent) 45%,transparent)}100%{box-shadow:0 0 0 .55rem transparent}}
@keyframes vibeui-changelog-004-pulse{0%{box-shadow:0 0 0 3px var(--vibeui-changelog-004-bg),0 0 0 3px color-mix(in oklab,var(--vibeui-changelog-004-accent) 50%,transparent)}100%{box-shadow:0 0 0 3px var(--vibeui-changelog-004-bg),0 0 0 12px transparent}}
@container (min-width: 60rem){[data-vibeui-block="changelog-004"] [data-part="shell"]{grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:4rem;align-items:start}}
[data-vibeui-block="changelog-004"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="changelog-004"] *{animation:none!important;transition:none!important}[data-vibeui-block="changelog-004"] [data-part="w"] > span{transform:none}[data-vibeui-block="changelog-004"] [data-reveal],[data-vibeui-block="changelog-004"] [data-part="rel"]{opacity:1}[data-vibeui-block="changelog-004"] [data-part="list"]::before{transform:none}}`

const DEFAULT_RELEASES: Changelog004Release[] = [
  { version: "2.4.1", date: "18 сен 2026", title: "Виртуализация с переменной высотой строк", items: ["строки разной высоты без замера заранее — ResizeObserver по мере появления", "`table.scrollTo(rowIndex)` для программной прокрутки", "исправлен дребезг при быстрой прокрутке на трекпаде"] },
  { version: "2.4.0", date: "2 сен 2026", title: "Группировка с итогами", items: ["`groupBy` принимает функцию, а не только ключ", "агрегаты `sum`, `avg`, `count` в строке группы", "события `onGroupToggle` с состоянием"] },
  { version: "2.3.0", date: "12 авг 2026", title: "Колонки-функции и типы", items: ["колонка может быть функцией от строки — тип выводится автоматически", "`ColumnDef<T>` экспортируется для внешних описаний", "документация по типам переписана"] },
  { version: "2.0.0", date: "1 июн 2026", title: "Headless по-настоящему", breaking: true, items: ["!удалён компонент `<Table>` со стилями — только хук `useTable`", "!`onSort` теперь получает `{ by, dir }` вместо двух аргументов", "размер бандла 4,1 КБ вместо 11", "React 19 и Server Components"] },
]

/** История версий с раскрытием и метками breaking. */
export function Changelog004({
  eyebrow = "// история версий",
  title = "Что менялось",
  lede = "Семантические версии, ломающие изменения помечены. Полный список — в CHANGELOG.md.",
  releases = DEFAULT_RELEASES,
  breakingLabel = "breaking",
  latestLabel = "latest",
  allLabel = "Весь changelog →",
  allHref = "#",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Changelog004Props) {
  const [open, setOpen] = useState<number>(0)
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-12% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const words = title.split(" ").filter(Boolean)
  const at = (value: number) => ({ ["--vibeui-changelog-004-i" as string]: value }) as CSSProperties
  const palette = {
    ...(accent ? { "--vibeui-changelog-004-accent": accent } : null),
    ...(ink ? { "--vibeui-changelog-004-fg": ink } : null),
    ...(background ? { "--vibeui-changelog-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-changelog-004" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="changelog-004" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow" data-reveal="" style={at(-1)}>
                {eyebrow}
              </p>
            ) : null}
            <h2 data-part="title">
              {words.map((word, index) => (
                <span key={index} data-part="w" style={at(index)}>
                  <span>{word}</span>
                  {index < words.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
            {lede ? (
              <p data-part="lede" data-reveal="" style={at(1)}>
                {lede}
              </p>
            ) : null}
            {allLabel ? (
              <Button077
                data-part="all"
                data-reveal=""
                style={at(2)}
                label={allLabel}
                href={allHref}
                accent={accent}
              />
            ) : null}
          </div>
          <ol data-part="list">
            {releases.map((release, index) => (
              <li key={release.version} data-part="rel" style={at(index)}>
                <button type="button" data-part="head" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>
                  <span data-part="ver">v{release.version}</span>
                  <span data-part="date">{release.date}</span>
                  {index === 0 ? (
                    <span data-part="chip" data-kind="latest">
                      {latestLabel}
                    </span>
                  ) : null}
                  {release.breaking ? <span data-part="chip">{breakingLabel}</span> : null}
                  <span data-part="name">{release.title}</span>
                </button>
                <div data-part="body" data-open={open === index}>
                  <div>
                    <ul data-part="items">
                      {release.items.map((item) => (
                        <li key={item} data-breaking={item.startsWith("!")}>
                          {item.replace(/^!/, "")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
