import type { CSSProperties } from "react"
import { Card106 } from "@/registry/components/card/card-106/card-106"

export type Podcast005Quote = {
  text: string
  /** Кто сказал и в каком эпизоде: «Сергей Волков · № 112». */
  who?: string
  href?: string
}

export type Podcast005Props = {
  eyebrow?: string
  /** Две ленты: верхняя едет влево, нижняя вправо. Пусто во второй — одна лента. */
  top?: readonly Podcast005Quote[]
  bottom?: readonly Podcast005Quote[]
  /** Секунд на полный круг ленты. */
  speed?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Цитаты гостей бегущими строками: две ленты плакатным узким гротеском едут
// в противоположные стороны с разной скоростью под лёгким наклоном, по
// наведению лента останавливается, а под цитатой пробегает «дорожка»
// воспроизведения — светлая искра по акцентной линии; каждая цитата —
// ссылка на эпизод с подписью «кто и где». Секция въезжает в кадр
// scroll-driven (`animation-timeline: view()`, без JS, с фолбэком «видно
// всегда»). Лента дублируется для бесшовного круга; ширина — от содержимого.
// Кинетическая типографика без единого ререндера.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap"

const STYLES = `
:where([data-vibeui-block="podcast-005"]){
--vibeui-podcast-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-podcast-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-005-muted:color-mix(in oklab,var(--vibeui-podcast-005-fg) 60%,var(--vibeui-podcast-005-bg));
--vibeui-podcast-005-line:color-mix(in oklab,var(--vibeui-podcast-005-fg) 12%,transparent);
--vibeui-podcast-005-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-podcast-005-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-podcast-005-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-podcast-005-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-005"]{color-scheme:dark}
:where([data-vibeui-block="podcast-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="podcast-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="podcast-005"]{box-sizing:border-box;position:relative;overflow:hidden;padding:4.5rem 0;background:var(--vibeui-podcast-005-bg);color:var(--vibeui-podcast-005-fg);font-family:var(--vibeui-podcast-005-font);border-top:1px solid var(--vibeui-podcast-005-line);border-bottom:1px solid var(--vibeui-podcast-005-line)}
[data-vibeui-block="podcast-005"] *{box-sizing:border-box}
[data-vibeui-block="podcast-005"]::before{content:"";position:absolute;left:50%;top:50%;width:70%;aspect-ratio:2/1;translate:-50% -50%;border-radius:50%;background:radial-gradient(ellipse,color-mix(in oklab,var(--vibeui-podcast-005-accent) 10%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="podcast-005"] [data-part="eyebrow"]{position:relative;max-width:80rem;margin:0 auto 1.5rem;padding:0 1.25rem;font-family:var(--vibeui-podcast-005-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-podcast-005-accent)}
[data-vibeui-block="podcast-005"] [data-part="tilt"]{rotate:-1.5deg;scale:1.04}
[data-vibeui-block="podcast-005"] [data-part="lane"]{display:flex;width:max-content;gap:0}
[data-vibeui-block="podcast-005"] [data-part="lane"]:hover{animation-play-state:paused}
[data-vibeui-block="podcast-005"] [data-part="lane"][data-dir="left"]{animation:vibeui-podcast-005-left var(--vibeui-podcast-005-s) linear infinite}
[data-vibeui-block="podcast-005"] [data-part="lane"][data-dir="right"]{animation:vibeui-podcast-005-right calc(var(--vibeui-podcast-005-s) * 1.3) linear infinite;margin-top:.8rem}
[data-vibeui-block="podcast-005"] [data-part="lane"][data-dir="right"] [data-vibeui-block="card-106"] b{color:transparent;-webkit-text-stroke:.02em color-mix(in oklab,var(--vibeui-podcast-005-fg) 60%,transparent);paint-order:stroke fill}
[data-vibeui-block="podcast-005"] [data-part="lane"][data-dir="right"] [data-vibeui-block="card-106"]:hover b{-webkit-text-stroke-color:var(--vibeui-card-106-accent)}
@keyframes vibeui-podcast-005-left{to{transform:translateX(-50%)}}
@keyframes vibeui-podcast-005-right{from{transform:translateX(-50%)}to{transform:none}}
@keyframes vibeui-podcast-005-run{from{translate:-100% 0}to{translate:100cqw 0}}
@keyframes vibeui-podcast-005-in{from{opacity:0;translate:0 3rem}}
@supports (animation-timeline: view()){[data-vibeui-block="podcast-005"] [data-part="eyebrow"],[data-vibeui-block="podcast-005"] [data-part="tilt"]{animation:vibeui-podcast-005-in linear both;animation-timeline:view();animation-range:entry 0% entry 60%}[data-vibeui-block="podcast-005"] [data-part="tilt"]{animation-range:entry 0% entry 80%}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-005"] *{animation:none!important;transition:none!important}[data-vibeui-block="podcast-005"] [data-part="tilt"]{rotate:none;scale:none}[data-vibeui-block="podcast-005"] [data-part="lane"]{flex-wrap:wrap;width:auto}}`

const DEFAULT_TOP: Podcast005Quote[] = [
  { text: "Одиночество — это не когда никого нет, а когда некому позвонить", who: "Сергей Волков · № 112", href: "#episodes" },
  { text: "Тысячная чашка ничем не хуже первой", who: "Аня Резник · № 111", href: "#episodes" },
  { text: "Я не устаю от работы. Я устаю от ожидания", who: "Марат Исмаилов · № 110", href: "#episodes" },
]

const DEFAULT_BOTTOM: Podcast005Quote[] = [
  { text: "Лучший код — тот, о котором никто не вспоминает", who: "Лена Царёва · № 109", href: "#episodes" },
  { text: "Рассвет из кабины не надоедает. Проверял двадцать лет", who: "Игорь Найдёнов · № 108", href: "#episodes" },
  { text: "Тишина — это тоже звук, просто редкий", who: "Ольга Мень · № 107", href: "#episodes" },
]

function Lane({ quotes, dir, accent }: { quotes: readonly Podcast005Quote[]; dir: "left" | "right"; accent?: string }) {
  const tape = [...quotes, ...quotes]
  return (
    <div data-part="lane" data-dir={dir}>
      {tape.map((quote, index) => (
        <Card106 key={`${quote.text}-${index}`} data-part="q" text={quote.text} href={quote.href} who={quote.who} aria-hidden={index >= quotes.length} tabIndex={index >= quotes.length ? -1 : undefined} accent={accent} />
      ))}
    </div>
  )
}

/** Цитаты гостей бегущими строками в противоположные стороны. */
export function Podcast005({ eyebrow = "Сказано в эфире", top = DEFAULT_TOP, bottom = DEFAULT_BOTTOM, speed = 60, tone = "auto", accent, ink, background, className, style }: Podcast005Props) {
  const palette = {
    "--vibeui-podcast-005-s": `${speed}s`,
    ...(accent ? { "--vibeui-podcast-005-accent": accent } : null),
    ...(ink ? { "--vibeui-podcast-005-fg": ink } : null),
    ...(background ? { "--vibeui-podcast-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-podcast-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="podcast-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} aria-label={eyebrow}>
        {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
        <div data-part="tilt">
          <Lane quotes={top} dir="left" accent={accent} />
          {bottom.length > 0 ? <Lane quotes={bottom} dir="right" accent={accent} /> : null}
        </div>
      </section>
    </>
  )
}
