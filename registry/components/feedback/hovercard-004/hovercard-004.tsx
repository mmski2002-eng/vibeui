import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  owner?: string
  repo?: string
  about?: string
  language?: string
  /** Цвет точки языка: у каждого языка он свой и узнаваемый. */
  languageColor?: string
  stars?: string
  forks?: string
}

// Идея компонента: карточка репозитория у ссылки вида владелец/имя. Владелец
// набран тонко, имя — жирно: так пара читается одним взглядом. Язык помечен
// точкой и словом, потому что цветная точка без подписи ничего не говорит.
const STYLES = `
:where([data-vibeui-block="hovercard-004"]){
--vibeui-hovercard-004-bg:oklch(1 0 0);
--vibeui-hovercard-004-fg:oklch(0.22 0.014 265);
--vibeui-hovercard-004-muted:oklch(0.53 0.014 265);
--vibeui-hovercard-004-border:oklch(0.9 0.006 265);
--vibeui-hovercard-004-accent:oklch(0.5 0.16 260);
--vibeui-hovercard-004-lang:oklch(0.72 0.15 85);
--vibeui-hovercard-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hovercard-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="hovercard-004"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-004-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-004-bg);
font-family:var(--vibeui-hovercard-004-font);color:var(--vibeui-hovercard-004-fg);
}
[data-vibeui-block="hovercard-004"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Карточка цепляется к паре владелец/имя, а не ко всему абзацу. */
[data-vibeui-block="hovercard-004"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="hovercard-004"] [data-part="link"]{
font-family:var(--vibeui-hovercard-004-mono);font-size:0.9375em;
color:var(--vibeui-hovercard-004-accent);text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-hovercard-004-accent) 35%,transparent);
border-radius:0.125rem;
}
[data-vibeui-block="hovercard-004"] [data-part="link"]:hover{border-bottom-color:var(--vibeui-hovercard-004-accent)}
[data-vibeui-block="hovercard-004"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-004-accent);outline-offset:2px}
[data-vibeui-block="hovercard-004"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:flex;flex-direction:column;gap:0.4375rem;
width:18rem;box-sizing:border-box;padding:0.8125rem 0.875rem;
border:1px solid var(--vibeui-hovercard-004-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-004-bg);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
[data-vibeui-block="hovercard-004"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-004"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
/* Владелец тонкий, имя жирное: пара читается как одно целое. */
[data-vibeui-block="hovercard-004"] [data-part="path"]{font-size:0.9375rem;line-height:1.25;letter-spacing:-0.01em}
[data-vibeui-block="hovercard-004"] [data-part="owner"]{color:var(--vibeui-hovercard-004-muted);font-weight:450}
[data-vibeui-block="hovercard-004"] [data-part="repo"]{font-weight:700}
[data-vibeui-block="hovercard-004"] [data-part="about"]{display:block;margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-hovercard-004-muted)}
[data-vibeui-block="hovercard-004"] [data-part="meta"]{
display:flex;align-items:center;gap:0.875rem;flex-wrap:wrap;
font-size:0.75rem;color:var(--vibeui-hovercard-004-muted);
}
[data-vibeui-block="hovercard-004"] [data-part="lang"]{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="hovercard-004"] [data-part="bullet"]{
width:0.625rem;height:0.625rem;border-radius:9999px;flex:none;
background:var(--vibeui-hovercard-004-lang);
box-shadow:inset 0 0 0 1px oklch(0 0 0 / 10%);
}
[data-vibeui-block="hovercard-004"] [data-part="stat"]{display:inline-flex;align-items:center;gap:0.25rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hovercard-004"] [data-part="stat"] b{color:var(--vibeui-hovercard-004-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Карточка репозитория у ссылки владелец/имя: описание, язык и счётчики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard004({
  owner = "vibeui",
  repo = "registry",
  about = "Каталог самодостаточных React-компонентов: один файл, своя палитра, ноль зависимостей.",
  language = "TypeScript",
  languageColor = "oklch(0.62 0.14 250)",
  stars = "3.1k",
  forks = "214",
  className,
  style,
  ...props
}: Hovercard004Props) {
  const palette = {
    "--vibeui-hovercard-004-lang": languageColor,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-004"
        className={className}
        style={palette}
      >
        <p data-part="line">
          Исходники лежат в{" "}
          <span data-part="host">
            <a
              data-part="link"
              href="#repo"
              aria-describedby="vibeui-hovercard-004-card"
            >
              {owner}/{repo}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-004-card"
              role="tooltip"
            >
              <span data-part="path">
                <span data-part="owner">{owner}/</span>
                <span data-part="repo">{repo}</span>
              </span>
              <span data-part="about">{about}</span>
              <span data-part="meta">
                <span data-part="lang">
                  <span data-part="bullet" aria-hidden="true" />
                  {language}
                </span>
                <span data-part="stat">
                  <span aria-hidden="true">★</span> <b>{stars}</b> звёзд
                </span>
                <span data-part="stat">
                  <span aria-hidden="true">⑂</span> <b>{forks}</b> форков
                </span>
              </span>
            </span>
          </span>{" "}
          — наведите, чтобы не открывать вкладку ради описания.
        </p>
      </div>
    </>
  )
}
