import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  owner?: string
  repo?: string
  about?: string
  language?: string
  languageColor?: string
  stars?: string
  openIssues?: string
  lastCommit?: string
  license?: string
}

// Идея компонента: не строчная упоминалка, а полноценный снимок репозитория —
// заголовок, описание, язык, звёзды и то, что паспорту owner/repo обычно не
// хватает: когда был последний коммит и сколько открыто issue. Триггер —
// компактная пилюля, а не подчёркнутая ссылка в тексте: так её видно сразу,
// а не только при чтении абзаца целиком.
const STYLES = `
:where([data-vibeui-block="hovercard-008"]){
--vibeui-hovercard-008-bg:oklch(1 0 0);
--vibeui-hovercard-008-fg:oklch(0.22 0.014 265);
--vibeui-hovercard-008-muted:oklch(0.53 0.014 265);
--vibeui-hovercard-008-border:oklch(0.9 0.006 265);
--vibeui-hovercard-008-fill:oklch(0.975 0.004 265);
--vibeui-hovercard-008-accent:oklch(0.5 0.16 260);
--vibeui-hovercard-008-lang:oklch(0.72 0.15 85);
--vibeui-hovercard-008-ok:oklch(0.5 0.13 155);
--vibeui-hovercard-008-warn:oklch(0.56 0.16 55);
--vibeui-hovercard-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hovercard-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="hovercard-008"]{
position:relative;width:100%;max-width:24rem;box-sizing:border-box;
font-family:var(--vibeui-hovercard-008-font);color:var(--vibeui-hovercard-008-fg);
}
[data-vibeui-block="hovercard-008"] *{box-sizing:border-box}
[data-vibeui-block="hovercard-008"] [data-part="lede"]{margin:0;font-size:0.875rem;line-height:1.6}
[data-vibeui-block="hovercard-008"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="hovercard-008"] [data-part="trigger"]{
display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.1875rem 0.5625rem 0.1875rem 0.375rem;border-radius:9999px;
background:var(--vibeui-hovercard-008-fill);
border:1px solid var(--vibeui-hovercard-008-border);
font-family:var(--vibeui-hovercard-008-mono);font-size:0.8125rem;
color:var(--vibeui-hovercard-008-accent);text-decoration:none;
}
[data-vibeui-block="hovercard-008"] [data-part="trigger"]:hover{border-color:var(--vibeui-hovercard-008-accent)}
[data-vibeui-block="hovercard-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-hovercard-008-accent);outline-offset:2px}
[data-vibeui-block="hovercard-008"] [data-part="mark"]{
width:0.5rem;height:0.5rem;border-radius:9999px;flex:none;
background:var(--vibeui-hovercard-008-lang);
}
[data-vibeui-block="hovercard-008"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:flex;flex-direction:column;gap:0.5625rem;
width:19rem;max-width:calc(100vw - 2rem);box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-hovercard-008-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-008-bg);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
[data-vibeui-block="hovercard-008"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-008"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
[data-vibeui-block="hovercard-008"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="hovercard-008"] [data-part="path"]{font-size:0.9375rem;line-height:1.25;letter-spacing:-0.01em}
[data-vibeui-block="hovercard-008"] [data-part="owner"]{color:var(--vibeui-hovercard-008-muted);font-weight:450}
[data-vibeui-block="hovercard-008"] [data-part="repo"]{font-weight:700}
[data-vibeui-block="hovercard-008"] [data-part="commit"]{font-size:0.6875rem;color:var(--vibeui-hovercard-008-muted);white-space:nowrap}
[data-vibeui-block="hovercard-008"] [data-part="about"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-hovercard-008-muted)}
[data-vibeui-block="hovercard-008"] [data-part="stats"]{
display:flex;align-items:center;gap:0.875rem;flex-wrap:wrap;
font-size:0.75rem;color:var(--vibeui-hovercard-008-muted);
}
[data-vibeui-block="hovercard-008"] [data-part="lang"]{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="hovercard-008"] [data-part="dot"]{
width:0.625rem;height:0.625rem;border-radius:9999px;flex:none;
background:var(--vibeui-hovercard-008-lang);
box-shadow:inset 0 0 0 1px oklch(0 0 0 / 10%);
}
[data-vibeui-block="hovercard-008"] [data-part="stat"]{display:inline-flex;align-items:center;gap:0.25rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hovercard-008"] [data-part="stat"] b{color:var(--vibeui-hovercard-008-fg);font-weight:650}
[data-vibeui-block="hovercard-008"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding-top:0.5625rem;border-top:1px solid var(--vibeui-hovercard-008-border);
font-size:0.6875rem;color:var(--vibeui-hovercard-008-muted);
}
[data-vibeui-block="hovercard-008"] [data-part="issues"]{
display:inline-flex;align-items:center;gap:0.25rem;
color:var(--vibeui-hovercard-008-warn);font-weight:600;
}
[data-vibeui-block="hovercard-008"] [data-part="license"]{
padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-hovercard-008-fill);
border:1px solid var(--vibeui-hovercard-008-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Снимок репозитория по наведению на пилюлю-ссылку: описание, язык, звёзды,
 * открытые issue и время последнего коммита. Раскрывается по hover и фокусу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard008({
  owner = "vibeui",
  repo = "registry",
  about = "Каталог самодостаточных React-компонентов: один файл, своя палитра, ноль зависимостей.",
  language = "TypeScript",
  languageColor = "oklch(0.62 0.14 250)",
  stars = "3.1k",
  openIssues = "12",
  lastCommit = "3 часа назад",
  license = "MIT",
  className,
  style,
  ...props
}: Hovercard008Props) {
  const palette = {
    "--vibeui-hovercard-008-lang": languageColor,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-008"
        className={className}
        style={palette}
      >
        <p data-part="lede">
          Зависимость собрана на основе{" "}
          <span data-part="host">
            <a
              data-part="trigger"
              href="#repo"
              aria-describedby="vibeui-hovercard-008-card"
            >
              <span data-part="mark" aria-hidden="true" />
              {owner}/{repo}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-008-card"
              role="tooltip"
            >
              <span data-part="head">
                <span data-part="path">
                  <span data-part="owner">{owner}/</span>
                  <span data-part="repo">{repo}</span>
                </span>
                <span data-part="commit">коммит {lastCommit}</span>
              </span>
              <span data-part="about">{about}</span>
              <span data-part="stats">
                <span data-part="lang">
                  <span data-part="dot" aria-hidden="true" />
                  {language}
                </span>
                <span data-part="stat">
                  <span aria-hidden="true">★</span> <b>{stars}</b> звёзд
                </span>
              </span>
              <span data-part="foot">
                <span data-part="issues">{openIssues} открытых issue</span>
                <span data-part="license">{license}</span>
              </span>
            </span>
          </span>
          .
        </p>
      </div>
    </>
  )
}
