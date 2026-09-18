import type { CSSProperties } from "react"

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

// Гости подкаста лентой: круглые портреты с именем, ролью и номером эпизода
// едут бесконечной строкой, по наведению лента останавливается, а карточка
// под курсором вырастает и обводится акцентом. Лента дублируется для
// бесшовности; чётные карточки чуть опущены — ритм вместо ровного ряда.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400&display=swap"

const STYLES = `
:where([data-vibeui-block="people-013"]){
--vibeui-people-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-013-muted:color-mix(in oklab,var(--vibeui-people-013-fg) 60%,var(--vibeui-people-013-bg));
--vibeui-people-013-panel:color-mix(in oklab,var(--vibeui-people-013-fg) 6%,var(--vibeui-people-013-bg));
--vibeui-people-013-line:color-mix(in oklab,var(--vibeui-people-013-fg) 12%,transparent);
--vibeui-people-013-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-people-013-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-013-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-013"]{color-scheme:dark}
:where([data-vibeui-block="people-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-013"]{box-sizing:border-box;overflow:hidden;padding:5rem 0;background:var(--vibeui-people-013-bg);color:var(--vibeui-people-013-fg);font-family:var(--vibeui-people-013-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-013"] *{box-sizing:border-box}
[data-vibeui-block="people-013"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-013"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-people-013-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-people-013-accent)}
[data-vibeui-block="people-013"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-013-display);font-weight:800;font-size:clamp(2.6rem,7cqi,5.5rem);line-height:.92;text-transform:uppercase}
[data-vibeui-block="people-013"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-people-013-muted)}
[data-vibeui-block="people-013"] [data-part="lane"]{display:flex;gap:1rem;width:max-content;margin-top:2.5rem;padding:1.5rem 0;animation:vibeui-people-013-run var(--vibeui-people-013-s) linear infinite}
[data-vibeui-block="people-013"] [data-part="lane"]:hover{animation-play-state:paused}
[data-vibeui-block="people-013"] [data-part="card"]{display:grid;justify-items:center;gap:.6rem;width:11rem;padding:1.2rem 1rem;border-radius:1.2rem;background:var(--vibeui-people-013-panel);box-shadow:0 0 0 1px var(--vibeui-people-013-line);color:inherit;text-decoration:none;text-align:center;transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="people-013"] [data-part="card"]:nth-child(even){transform:translateY(1.2rem)}
[data-vibeui-block="people-013"] [data-part="card"]:hover{transform:scale(1.06);box-shadow:0 0 0 2px var(--vibeui-people-013-accent),0 24px 48px -24px rgb(0 0 0 / .6);z-index:1}
[data-vibeui-block="people-013"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-people-013-accent);outline-offset:3px}
[data-vibeui-block="people-013"] [data-part="pic"]{width:6rem;height:6rem;border-radius:50%;overflow:hidden;background:var(--vibeui-people-013-line);box-shadow:0 0 0 3px var(--vibeui-people-013-bg),0 0 0 4px var(--vibeui-people-013-line)}
[data-vibeui-block="people-013"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(.2)}
[data-vibeui-block="people-013"] [data-part="card"]:hover [data-part="pic"] img{filter:none}
[data-vibeui-block="people-013"] [data-part="name"]{font-family:var(--vibeui-people-013-display);font-weight:700;font-size:1.3rem;line-height:1;text-transform:uppercase}
[data-vibeui-block="people-013"] [data-part="role"]{font-size:.8rem;color:var(--vibeui-people-013-muted);line-height:1.25}
[data-vibeui-block="people-013"] [data-part="ep"]{font-family:var(--vibeui-people-013-mono);font-size:.68rem;letter-spacing:.12em;color:var(--vibeui-people-013-accent)}
@keyframes vibeui-people-013-run{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-013"] [data-part="lane"]{animation:none!important;flex-wrap:wrap;width:auto;padding:1.5rem 1.25rem}[data-vibeui-block="people-013"] [data-part="card"][aria-hidden="true"]{display:none}[data-vibeui-block="people-013"] *{transition:none!important}}`

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

/** Гости бесконечной лентой с остановкой по наведению. */
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
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
        </div>
        <div data-part="lane">
          {tape.map((guest, index) => (
            <a key={`${guest.name}-${index}`} data-part="card" href={guest.href ?? "#"} aria-hidden={index >= guests.length} tabIndex={index >= guests.length ? -1 : undefined}>
              <span data-part="pic">{guest.image ? <img src={guest.image} alt="" /> : null}</span>
              <span data-part="name">{guest.name}</span>
              {guest.role ? <span data-part="role">{guest.role}</span> : null}
              {guest.episode ? <span data-part="ep">{guest.episode}</span> : null}
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
