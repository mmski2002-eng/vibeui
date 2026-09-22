import type { CSSProperties } from "react"
import { Badge026 } from "@/registry/components/badge/badge-026/badge-026"

export type Bento002Item = {
  name: string
  /** Короткая марка в кружке: «Z», «N», «TG». Пусто — первая буква. */
  mark?: string
}

export type Bento002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Центр орбит: имя продукта. */
  core?: string
  /** Внутренняя и внешняя орбиты. */
  inner?: readonly Bento002Item[]
  outer?: readonly Bento002Item[]
  /** Секунд на оборот внутренней орбиты; внешняя — в полтора раза медленнее и в другую сторону. */
  speed?: number
  /** Список справа: что делает интеграция. */
  facts?: readonly string[]
  /** aria орбит. */
  spaceLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Интеграции орбитами: в центре кружок с именем продукта пульсирует
// кольцами-«пингами», вокруг на двух кольцах кружат сервисы-марки —
// внутреннее кольцо по часовой, внешнее против и медленнее; за каждой
// маркой по орбите тянется светящийся хвост (conic-gradient в маске-кольце),
// сами марки контрвращаются, чтобы буквы стояли прямо. По наведению на
// секцию орбиты останавливаются, марка под курсором подсвечивается. Справа
// список «что подключается». Заголовок въезжает словами через маску, список
// проявляется каскадом — на scroll-driven animation-timeline: view() с
// фолбэком «видно всегда». Всё на CSS, без клиентского кода.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-002"]){
--vibeui-bento-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-002-on-accent:oklch(from var(--vibeui-bento-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-002-muted:color-mix(in oklab,var(--vibeui-bento-002-fg) 60%,var(--vibeui-bento-002-bg));
--vibeui-bento-002-line:color-mix(in oklab,var(--vibeui-bento-002-fg) 14%,transparent);
--vibeui-bento-002-glass:color-mix(in oklab,var(--vibeui-bento-002-fg) 6%,transparent);
--vibeui-bento-002-a2:color-mix(in oklab,var(--vibeui-bento-002-accent) 40%,#a855f7);
--vibeui-bento-002-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-bento-002-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-002"]{color-scheme:dark}
:where([data-vibeui-block="bento-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-002"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-bento-002-bg);color:var(--vibeui-bento-002-fg);font-family:var(--vibeui-bento-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-002"] *{box-sizing:border-box}
[data-vibeui-block="bento-002"] [data-part="sat"]{width:100%}
[data-vibeui-block="bento-002"] [data-part="glow"]{position:absolute;left:-10%;top:10%;width:55%;aspect-ratio:1;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bento-002-accent) 26%,transparent),transparent);filter:blur(60px);pointer-events:none;animation:vibeui-bento-002-breathe 9s ease-in-out infinite alternate}
[data-vibeui-block="bento-002"] [data-part="glow"]:nth-child(2){left:auto;right:-15%;top:40%;width:45%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bento-002-a2) 24%,transparent),transparent);animation-delay:-4s}
[data-vibeui-block="bento-002"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="bento-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-bento-002-display);font-weight:800;font-size:clamp(2.2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="bento-002"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="bento-002"] [data-part="w"] span{display:inline-block}
[data-vibeui-block="bento-002"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-bento-002-muted)}
[data-vibeui-block="bento-002"] [data-part="facts"]{margin:1.6rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="bento-002"] [data-part="facts"] li{display:flex;gap:.6rem;align-items:baseline;padding:.7rem 1rem;border-radius:.9rem;background:var(--vibeui-bento-002-glass);border:1px solid var(--vibeui-bento-002-line);transition:transform .4s var(--vibeui-bento-002-ease),border-color .4s,background .4s}
[data-vibeui-block="bento-002"] [data-part="facts"] li:hover{transform:translateX(6px);border-color:color-mix(in oklab,var(--vibeui-bento-002-accent) 40%,transparent);background:color-mix(in oklab,var(--vibeui-bento-002-accent) 8%,transparent)}
[data-vibeui-block="bento-002"] [data-part="facts"] li::before{content:"→";font-family:var(--vibeui-bento-002-mono);color:var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="space"]{position:relative;width:min(100%,26rem);aspect-ratio:1;margin:0 auto;display:grid;place-items:center;container-type:inline-size}
[data-vibeui-block="bento-002"] [data-part="space"]:hover [data-part="ring"],[data-vibeui-block="bento-002"] [data-part="space"]:hover [data-vibeui-block="badge-026"]{animation-play-state:paused}
[data-vibeui-block="bento-002"] [data-part="core"]{position:relative;z-index:2;width:25cqi;height:25cqi;border-radius:50%;display:grid;place-items:center;font-family:var(--vibeui-bento-002-display);font-weight:800;font-size:1.05rem;background:var(--vibeui-bento-002-accent);color:var(--vibeui-bento-002-on-accent);box-shadow:0 0 0 10px color-mix(in oklab,var(--vibeui-bento-002-accent) 15%,transparent),0 0 60px -10px var(--vibeui-bento-002-accent);animation:vibeui-bento-002-heart 2.4s ease-in-out infinite}
[data-vibeui-block="bento-002"] [data-part="core"]::before,[data-vibeui-block="bento-002"] [data-part="core"]::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:1.5px solid var(--vibeui-bento-002-accent);opacity:0;animation:vibeui-bento-002-ping 2.4s var(--vibeui-bento-002-ease) infinite;pointer-events:none}
[data-vibeui-block="bento-002"] [data-part="core"]::after{animation-delay:1.2s}
[data-vibeui-block="bento-002"] [data-part="ring"]{position:absolute;left:50%;top:50%;width:calc(var(--vibeui-bento-002-r) * 2);height:calc(var(--vibeui-bento-002-r) * 2);margin:calc(var(--vibeui-bento-002-r) * -1) 0 0 calc(var(--vibeui-bento-002-r) * -1);border-radius:50%;border:1px dashed var(--vibeui-bento-002-line);animation:vibeui-bento-002-spin var(--vibeui-bento-002-t) linear infinite}
[data-vibeui-block="bento-002"] [data-part="ring"][data-dir="ccw"]{animation-direction:reverse}
[data-vibeui-block="bento-002"] [data-part="hold"]{position:absolute;left:50%;top:0;width:2.8rem;height:2.8rem;margin:-1.4rem 0 0 -1.4rem;transform:rotate(calc(var(--vibeui-bento-002-a) * -1deg))}
[data-vibeui-block="bento-002"] [data-part="ring"][data-dir="ccw"] [data-vibeui-block="badge-026"]{animation-direction:normal}
[data-vibeui-block="bento-002"] [data-part="slot"]{position:absolute;inset:0;transform:rotate(calc(var(--vibeui-bento-002-a) * 1deg))}
[data-vibeui-block="bento-002"] [data-part="slot"]::before{content:"";position:absolute;inset:-1px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg 290deg,color-mix(in oklab,var(--vibeui-bento-002-accent) 0%,transparent) 290deg,var(--vibeui-bento-002-accent) 360deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));opacity:.85;pointer-events:none}
[data-vibeui-block="bento-002"] [data-part="ring"][data-dir="ccw"] [data-part="slot"]::before{background:conic-gradient(from 0deg,var(--vibeui-bento-002-accent) 0deg,color-mix(in oklab,var(--vibeui-bento-002-accent) 0%,transparent) 70deg,transparent 70deg 360deg)}
@keyframes vibeui-bento-002-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-bento-002-heart{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes vibeui-bento-002-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@keyframes vibeui-bento-002-breathe{from{opacity:.6;transform:scale(1)}to{opacity:1;transform:scale(1.2)}}
@keyframes vibeui-bento-002-mask{from{translate:0 112%}to{translate:0 0}}
@keyframes vibeui-bento-002-up{from{opacity:0;translate:0 18px}to{opacity:1;translate:0 0}}
@keyframes vibeui-bento-002-pop{from{opacity:0;scale:.9}to{opacity:1;scale:1}}
@supports (animation-timeline: view()){
[data-vibeui-block="bento-002"] [data-part="w"] span{animation:vibeui-bento-002-mask linear both;animation-timeline:view();animation-range:entry calc(5% + var(--vibeui-bento-002-i) * 4%) entry calc(35% + var(--vibeui-bento-002-i) * 4%)}
[data-vibeui-block="bento-002"] [data-part="eyebrow"],[data-vibeui-block="bento-002"] [data-part="lede"]{animation:vibeui-bento-002-up linear both;animation-timeline:view();animation-range:entry 0% entry 40%}
[data-vibeui-block="bento-002"] [data-part="facts"] li{animation:vibeui-bento-002-up linear both;animation-timeline:view();animation-range:entry 0% entry 60%}
[data-vibeui-block="bento-002"] [data-part="space"]{animation:vibeui-bento-002-pop linear both;animation-timeline:view();animation-range:entry 0% entry 45%}
}
@container (min-width: 60rem){[data-vibeui-block="bento-002"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-002"] [data-part="slot"]::before{display:none}}`

function Ring({ items, radius, seconds, dir, accent }: { items: readonly Bento002Item[]; radius: string; seconds: number; dir: "cw" | "ccw"; accent?: string }) {
  return (
    <div data-part="ring" data-dir={dir} style={{ ["--vibeui-bento-002-r" as string]: radius, ["--vibeui-bento-002-t" as string]: `${seconds}s` }}>
      {items.map((item, index) => {
        const angle = (360 / items.length) * index
        return (
          <div key={item.name} data-part="slot" style={{ ["--vibeui-bento-002-a" as string]: angle }}>
            <div data-part="hold">
              <Badge026 data-part="sat" name={item.name} mark={item.mark} accent={accent} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Интеграции на двух орбитах вокруг продукта. */
export function Bento002({
  eyebrow = "Интеграции",
  title = "Живёт там, где уже живёт команда",
  lede = "Подключается к тому, что у вас есть: созвоны, трекер, база знаний, мессенджер. Никаких «перейдите в наше приложение».",
  core = "Сводка",
  inner = [{ name: "Zoom", mark: "Z" }, { name: "Google Meet", mark: "M" }, { name: "Телемост", mark: "Т" }, { name: "Teams", mark: "T" }],
  outer = [{ name: "Jira", mark: "J" }, { name: "Notion", mark: "N" }, { name: "Telegram", mark: "TG" }, { name: "Slack", mark: "S" }, { name: "Linear", mark: "L" }, { name: "Confluence", mark: "C" }, { name: "Google Docs", mark: "D" }, { name: "Trello", mark: "Tr" }],
  speed = 40,
  facts = ["Созвоны: бот заходит участником или берёт запись", "Трекеры: задачи создаются с исполнителем и сроком", "Мессенджеры: сводка приходит через минуту после встречи", "Базы знаний: решения копятся в одном месте"],
  spaceLabel = "{core}: интеграции",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento002Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-002-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-002-fg": ink } : null),
    ...(background ? { "--vibeui-bento-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <i data-part="glow" aria-hidden="true" />
        <i data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="space" aria-label={spaceLabel.replace("{core}", core)}>
            <div data-part="core">{core}</div>
            <Ring items={inner} radius="27cqi" seconds={speed} dir="cw" accent={accent} />
            <Ring items={outer} radius="44cqi" seconds={speed * 1.5} dir="ccw" accent={accent} />
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">
              {title
                .split(" ")
                .filter(Boolean)
                .map((word, index) => (
                  <span key={index} data-part="w">
                    <span style={{ ["--vibeui-bento-002-i" as string]: index }}>{word}</span>
                  </span>
                ))
                .flatMap((node, index) => (index ? [" ", node] : [node]))}
            </h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
