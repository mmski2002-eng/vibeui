import type { CSSProperties } from "react"

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
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Интеграции орбитами: в центре стеклянный кружок с именем продукта, вокруг
// на двух кольцах кружат сервисы-марки — внутреннее кольцо по часовой,
// внешнее против и медленнее; сами марки контрвращаются, чтобы буквы стояли
// прямо. По наведению на секцию орбиты останавливаются, марка под курсором
// подсвечивается. Справа список «что подключается». Всё на CSS.
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
--vibeui-bento-002-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-002"]{color-scheme:dark}
:where([data-vibeui-block="bento-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-002-bg);color:var(--vibeui-bento-002-fg);font-family:var(--vibeui-bento-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-002"] *{box-sizing:border-box}
[data-vibeui-block="bento-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="bento-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-bento-002-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="bento-002"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-bento-002-muted)}
[data-vibeui-block="bento-002"] [data-part="facts"]{margin:1.6rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="bento-002"] [data-part="facts"] li{display:flex;gap:.6rem;align-items:baseline;padding:.7rem 1rem;border-radius:.9rem;background:var(--vibeui-bento-002-glass);border:1px solid var(--vibeui-bento-002-line)}
[data-vibeui-block="bento-002"] [data-part="facts"] li::before{content:"→";font-family:var(--vibeui-bento-002-mono);color:var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="space"]{position:relative;width:min(100%,26rem);aspect-ratio:1;margin:0 auto;display:grid;place-items:center;container-type:inline-size}
[data-vibeui-block="bento-002"] [data-part="space"]:hover [data-part="ring"],[data-vibeui-block="bento-002"] [data-part="space"]:hover [data-part="sat"]{animation-play-state:paused}
[data-vibeui-block="bento-002"] [data-part="core"]{position:relative;z-index:2;width:25cqi;height:25cqi;border-radius:50%;display:grid;place-items:center;font-family:var(--vibeui-bento-002-display);font-weight:800;font-size:1.05rem;background:var(--vibeui-bento-002-accent);color:var(--vibeui-bento-002-on-accent);box-shadow:0 0 0 10px color-mix(in oklab,var(--vibeui-bento-002-accent) 15%,transparent),0 0 60px -10px var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="ring"]{position:absolute;left:50%;top:50%;width:calc(var(--vibeui-bento-002-r) * 2);height:calc(var(--vibeui-bento-002-r) * 2);margin:calc(var(--vibeui-bento-002-r) * -1) 0 0 calc(var(--vibeui-bento-002-r) * -1);border-radius:50%;border:1px dashed var(--vibeui-bento-002-line);animation:vibeui-bento-002-spin var(--vibeui-bento-002-t) linear infinite}
[data-vibeui-block="bento-002"] [data-part="ring"][data-dir="ccw"]{animation-direction:reverse}
[data-vibeui-block="bento-002"] [data-part="hold"]{position:absolute;left:50%;top:0;width:2.8rem;height:2.8rem;margin:-1.4rem 0 0 -1.4rem;transform:rotate(calc(var(--vibeui-bento-002-a) * -1deg))}
[data-vibeui-block="bento-002"] [data-part="sat"]{position:relative;width:100%;height:100%;border-radius:50%;display:grid;place-items:center;background:var(--vibeui-bento-002-bg);border:1px solid var(--vibeui-bento-002-line);box-shadow:0 10px 24px -12px rgb(0 0 0 / .5);font-family:var(--vibeui-bento-002-mono);font-weight:500;font-size:.75rem;animation:vibeui-bento-002-spin var(--vibeui-bento-002-t) linear infinite reverse;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="bento-002"] [data-part="ring"][data-dir="ccw"] [data-part="sat"]{animation-direction:normal}
[data-vibeui-block="bento-002"] [data-part="slot"]{position:absolute;inset:0;transform:rotate(calc(var(--vibeui-bento-002-a) * 1deg))}
[data-vibeui-block="bento-002"] [data-part="sat"]:hover{background:var(--vibeui-bento-002-accent);color:var(--vibeui-bento-002-on-accent);border-color:transparent}
[data-vibeui-block="bento-002"] [data-part="sat"] span{position:absolute;top:calc(100% + .35rem);left:50%;transform:translateX(-50%);white-space:nowrap;font-family:var(--vibeui-bento-002-font);font-size:.68rem;color:var(--vibeui-bento-002-muted);opacity:0;transition:opacity .2s}
[data-vibeui-block="bento-002"] [data-part="sat"]:hover span{opacity:1}
@keyframes vibeui-bento-002-spin{to{transform:rotate(360deg)}}
@container (min-width: 60rem){[data-vibeui-block="bento-002"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-002"] *{animation:none!important;transition:none!important}}`

function Ring({ items, radius, seconds, dir }: { items: readonly Bento002Item[]; radius: string; seconds: number; dir: "cw" | "ccw" }) {
  return (
    <div data-part="ring" data-dir={dir} style={{ ["--vibeui-bento-002-r" as string]: radius, ["--vibeui-bento-002-t" as string]: `${seconds}s` }}>
      {items.map((item, index) => {
        const angle = (360 / items.length) * index
        return (
          <div key={item.name} data-part="slot" style={{ ["--vibeui-bento-002-a" as string]: angle }}>
            <div data-part="hold">
              <div data-part="sat" aria-label={item.name}>
                {item.mark ?? item.name.charAt(0)}
                <span aria-hidden="true">{item.name}</span>
              </div>
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
        <div data-part="shell">
          <div data-part="space" aria-label={`${core}: интеграции`}>
            <div data-part="core">{core}</div>
            <Ring items={inner} radius="27cqi" seconds={speed} dir="cw" />
            <Ring items={outer} radius="44cqi" seconds={speed * 1.5} dir="ccw" />
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
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
