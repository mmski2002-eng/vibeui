import { Fragment, type CSSProperties } from "react"
import { Card117 } from "@/registry/components/card/card-117/card-117"

export type People013Guest = {
  name: string
  role?: string
  image?: string
  /** Номер эпизода: «№ 112». */
  episode?: string
  href?: string
}

export type People013Props = {
  eyebrow?: string
  title?: string
  lede?: string
  guests?: readonly People013Guest[]
  /** Секунд на полный круг ленты. */
  speed?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Гости подкаста лентой «визиток»: горизонтальные карточки с портретом,
// именем, ролью и номером эпизода, внизу — штрих-код из полосок и уголок
// акцентом, как на настоящей визитке. Лента едет бесконечной строкой, по
// наведению останавливается, карточка под курсором приподнимается и
// обводится акцентом; портрет теряет серость. Заголовок въезжает словами
// через маски, а визитки появляются каскадом, когда лента входит в кадр —
// на scroll-driven `animation-timeline: view()` без JS, с фолбэком «видно
// всегда». Лента дублируется для бесшовности; чётные карточки чуть опущены.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400&display=swap"

const STYLES = `
:where([data-vibeui-block="people-013"]){
--vibeui-people-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-013-on-accent:oklch(from var(--vibeui-people-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-013-muted:color-mix(in oklab,var(--vibeui-people-013-fg) 60%,var(--vibeui-people-013-bg));
--vibeui-people-013-panel:color-mix(in oklab,var(--vibeui-people-013-fg) 6%,var(--vibeui-people-013-bg));
--vibeui-people-013-line:color-mix(in oklab,var(--vibeui-people-013-fg) 12%,transparent);
--vibeui-people-013-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-people-013-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-013-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-people-013-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-013"]{color-scheme:dark}
:where([data-vibeui-block="people-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-013"]{box-sizing:border-box;position:relative;overflow:hidden;padding:6rem 0;background:var(--vibeui-people-013-bg);color:var(--vibeui-people-013-fg);font-family:var(--vibeui-people-013-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-013"] *{box-sizing:border-box}
[data-vibeui-block="people-013"] [data-part="card"]{width:18rem}
[data-vibeui-block="people-013"]::before{content:"";position:absolute;right:-15%;top:-20%;width:50%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-people-013-accent) 12%,transparent),transparent 65%);filter:blur(50px);pointer-events:none}
[data-vibeui-block="people-013"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-013"] [data-part="eyebrow"]{margin:0 0 .9rem;font-family:var(--vibeui-people-013-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-people-013-accent)}
[data-vibeui-block="people-013"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-013-display);font-weight:800;font-size:clamp(3.6rem,10.5cqi,8.25rem);line-height:.88;letter-spacing:-.015em;text-transform:uppercase;text-wrap:balance}
[data-vibeui-block="people-013"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .08em .12em 0;margin:-.04em 0 -.12em 0}
[data-vibeui-block="people-013"] [data-part="w"] i{display:inline-block;font-style:normal}
[data-vibeui-block="people-013"] [data-part="lede"]{margin:1.2rem 0 0;max-width:34rem;color:var(--vibeui-people-013-muted)}
[data-vibeui-block="people-013"] [data-part="lane"]{display:flex;gap:1.2rem;width:max-content;margin-top:2.5rem;padding:1.5rem 0 2rem;animation:vibeui-people-013-run var(--vibeui-people-013-s) linear infinite}
[data-vibeui-block="people-013"] [data-part="lane"]:hover{animation-play-state:paused}
@keyframes vibeui-people-013-run{to{transform:translateX(-50%)}}
@keyframes vibeui-people-013-word{from{translate:0 110%;rotate:3deg}}
@keyframes vibeui-people-013-up{from{opacity:0;translate:0 1.4rem}}
@keyframes vibeui-people-013-deal{from{opacity:0;translate:0 3rem;rotate:-6deg;scale:.9}}
@supports (animation-timeline: view()){
[data-vibeui-block="people-013"] [data-part="eyebrow"],[data-vibeui-block="people-013"] [data-part="lede"]{animation:vibeui-people-013-up linear both;animation-timeline:view();animation-range:entry 0% entry 50%}
[data-vibeui-block="people-013"] [data-part="w"] i{animation:vibeui-people-013-word linear both;animation-timeline:view();animation-range:entry 0% entry 45%}
[data-vibeui-block="people-013"] [data-part="w"]:nth-child(1) i{animation-range:entry 0% entry 35%}
[data-vibeui-block="people-013"] [data-part="w"]:nth-child(2) i{animation-range:entry 0% entry 45%}
[data-vibeui-block="people-013"] [data-part="w"]:nth-child(3) i{animation-range:entry 0% entry 55%}
[data-vibeui-block="people-013"] [data-part="w"]:nth-child(4) i{animation-range:entry 0% entry 65%}
[data-vibeui-block="people-013"] [data-part="w"]:nth-child(5) i{animation-range:entry 0% entry 75%}
[data-vibeui-block="people-013"] [data-part="w"]:nth-child(6) i{animation-range:entry 0% entry 85%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-013"] [data-part="lane"]{animation:none!important;flex-wrap:wrap;width:auto;padding:1.5rem 1.25rem}[data-vibeui-block="people-013"] *,[data-vibeui-block="people-013"] *::before,[data-vibeui-block="people-013"] *::after{transition:none!important;animation:none!important}}`

const DEFAULT_GUESTS: People013Guest[] = [
  { name: "Сергей Волков", role: "смотритель маяка", episode: "№ 112", image: "/demo/podcast/guest-01.webp", href: "#episodes" },
  { name: "Аня Резник", role: "керамист", episode: "№ 111", image: "/demo/podcast/guest-02.webp", href: "#episodes" },
  { name: "Марат Исмаилов", role: "кардиохирург", episode: "№ 110", image: "/demo/podcast/guest-03.webp", href: "#episodes" },
  { name: "Лена Царёва", role: "бэкенд-разработчица", episode: "№ 109", image: "/demo/podcast/guest-04.webp", href: "#episodes" },
  { name: "Игорь Найдёнов", role: "машинист", episode: "№ 108", image: "/demo/podcast/guest-05.webp", href: "#episodes" },
  { name: "Ольга Мень", role: "библиотекарь", episode: "№ 107", image: "/demo/podcast/guest-06.webp", href: "#episodes" },
  { name: "Даниил Штерн", role: "шеф-повар", episode: "№ 106", image: "/demo/podcast/guest-07.webp", href: "#episodes" },
  { name: "Вика Лим", role: "флорист", episode: "№ 105", image: "/demo/podcast/guest-08.webp", href: "#episodes" },
]

/** Гости «визитками» бесконечной лентой с остановкой по наведению. */
export function People013({
  eyebrow = "Гости",
  title = "Кто был в студии",
  lede = "Сто двенадцать человек, которые делают своё дело руками и головой. Наведите — лента остановится.",
  guests = DEFAULT_GUESTS,
  speed = 50,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People013Props) {
  const tape = [...guests, ...guests]
  const words = title.split(/\s+/).filter(Boolean)
  const palette = {
    "--vibeui-people-013-s": `${speed}s`,
    ...(accent ? { "--vibeui-people-013-accent": accent } : null),
    ...(ink ? { "--vibeui-people-013-fg": ink } : null),
    ...(background ? { "--vibeui-people-013-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-013" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-013" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span data-part="w">
                  <i>{word}</i>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
        </div>
        <div data-part="lane">
          {tape.map((guest, index) => (
            <Card117 key={`${guest.name}-${index}`} data-part="card" name={guest.name} href={guest.href} image={guest.image} role={guest.role} episode={guest.episode} aria-hidden={index >= guests.length} tabIndex={index >= guests.length ? -1 : undefined} accent={accent} />
          ))}
        </div>
      </section>
    </>
  )
}
