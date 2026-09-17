import type { CSSProperties } from "react"

export type Hero023Tag = {
  label: string
  /** Цвет капсулы: любой CSS-цвет. */
  color: string
  /** Цвет текста, если капсула тёмная. По умолчанию чёрный. */
  ink?: string
  /** Эмодзи-стикер слева от подписи. */
  emoji?: string
  href?: string
}

export type Hero023Props = {
  /** Заголовок; перенос строки — через \n. */
  title?: string
  /** Строка под заголовком: даты и место. */
  meta?: string
  /** Цветные капсулы направлений. */
  tags?: readonly Hero023Tag[]
  tagsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран фестиваля: гигантский заголовок в одну мысль на всю ширину и
// два ряда цветных капсул направлений со стикерами-эмодзи. Каждая капсула
// своего цвета, стикер лежит на квадрате более тёмного оттенка. Капсулы
// выскакивают каскадом при загрузке, при наведении приподнимаются и чуть
// поворачиваются. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-023"]){
--vibeui-hero-023-bg:light-dark(#ffffff,#0e0f12);
--vibeui-hero-023-fg:light-dark(#111111,#f4f4f5);
--vibeui-hero-023-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-hero-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-023-on-accent:oklch(from var(--vibeui-hero-023-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-023-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-023-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-023"]{color-scheme:dark}
:where([data-vibeui-block="hero-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-023"]{box-sizing:border-box;display:block;background:var(--vibeui-hero-023-bg);color:var(--vibeui-hero-023-fg);font-family:var(--vibeui-hero-023-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="hero-023"] *{box-sizing:border-box}
[data-vibeui-block="hero-023"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2.5rem 1.25rem 3rem}
[data-vibeui-block="hero-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-023-display);font-weight:600;font-size:clamp(3rem,10.5cqi,8.75rem);line-height:.95;letter-spacing:-.045em;white-space:pre-line;text-wrap:balance;animation:vibeui-hero-023-rise .7s cubic-bezier(.2,.8,.2,1) both}
@keyframes vibeui-hero-023-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
[data-vibeui-block="hero-023"] [data-part="title"] i{font-style:normal;color:var(--vibeui-hero-023-accent);filter:brightness(.85)}
[data-vibeui-block="hero-023"] [data-part="meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:1.25rem 0 0;font-size:1.05rem;color:var(--vibeui-hero-023-muted);animation:vibeui-hero-023-rise .7s .15s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-023"] [data-part="meta"]::before{content:"";width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-hero-023-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-hero-023-accent) 30%,transparent)}
[data-vibeui-block="hero-023"] [data-part="tags-label"]{margin:2.25rem 0 .75rem;font-size:.85rem;color:var(--vibeui-hero-023-muted)}
[data-vibeui-block="hero-023"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:.75rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-023"] [data-part="tags"] li{animation:vibeui-hero-023-pop .55s cubic-bezier(.2,.9,.3,1.3) both;animation-delay:calc(.25s + var(--vibeui-hero-023-n) * 45ms)}
@keyframes vibeui-hero-023-pop{from{opacity:0;transform:scale(.7) translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="hero-023"] [data-part="tag"]{display:inline-flex;align-items:center;gap:0;height:4.75rem;padding:0 1.5rem 0 0;border-radius:1.1rem;background:var(--vibeui-hero-023-tag);color:var(--vibeui-hero-023-ink,#111);font-family:var(--vibeui-hero-023-display);font-size:1.3rem;font-weight:500;letter-spacing:-.01em;text-decoration:none;overflow:hidden;transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="hero-023"] [data-part="tag"][data-plain="true"]{padding-left:1.5rem}
[data-vibeui-block="hero-023"] [data-part="tag"]:hover{transform:translateY(-4px) rotate(-1.5deg);box-shadow:0 18px 30px -18px rgb(0 0 0 / .35)}
[data-vibeui-block="hero-023"] [data-part="tag"]:focus-visible{outline:2px solid var(--vibeui-hero-023-fg);outline-offset:3px}
[data-vibeui-block="hero-023"] [data-part="sticker"]{display:grid;place-items:center;width:4.75rem;height:4.75rem;margin-right:1rem;background:color-mix(in oklab,var(--vibeui-hero-023-tag) 82%,#000);font-size:2.4rem;line-height:1;filter:drop-shadow(0 6px 6px rgb(0 0 0 / .25));transition:transform .35s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="hero-023"] [data-part="tag"]:hover [data-part="sticker"]{transform:rotate(8deg) scale(1.12)}
@container (max-width: 40rem){
[data-vibeui-block="hero-023"] [data-part="tags"]{gap:.5rem}
[data-vibeui-block="hero-023"] [data-part="tag"]{height:3.4rem;padding-right:1rem;border-radius:.85rem;font-size:1.05rem}
[data-vibeui-block="hero-023"] [data-part="tag"][data-plain="true"]{padding-left:1rem}
[data-vibeui-block="hero-023"] [data-part="sticker"]{width:3.4rem;height:3.4rem;margin-right:.7rem;font-size:1.7rem}
}
@container (min-width: 60rem){
[data-vibeui-block="hero-023"] [data-part="shell"]{padding:3.5rem 2rem 4rem}
[data-vibeui-block="hero-023"] [data-part="tags"]{gap:.9rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-023"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TAGS: Hero023Tag[] = [
  { label: "#Музыка", color: "#ffe2d6", emoji: "🎸", href: "#program" },
  { label: "#Еда", color: "#c2df37", emoji: "🌮", href: "#program" },
  { label: "#Лекции", color: "#f1ddbc", emoji: "🎙️", href: "#program" },
  { label: "#Дети", color: "#9854d1", ink: "#fff", emoji: "🪁", href: "#program" },
  { label: "#Маркет", color: "#006461", ink: "#fff", emoji: "🧶", href: "#program" },
  { label: "#Кино", color: "#f3c37d", emoji: "🎬", href: "#program" },
  { label: "#Спорт", color: "#ffa5b1", emoji: "🏀", href: "#program" },
  { label: "#Ночь", color: "#122378", ink: "#fff", emoji: "🌙", href: "#program" },
  { label: "#Театр", color: "#d9cafe", emoji: "🎭", href: "#program" },
  { label: "#Город", color: "#464dff", ink: "#fff", emoji: "🚲", href: "#program" },
  { label: "#Воркшопы", color: "#fdb084", emoji: "✂️", href: "#program" },
  { label: "#Утро", color: "#98f5af", emoji: "🧘", href: "#program" },
]

function markup(text: string) {
  return text.split(/(\*[^*]+\*)/).map((part, index) => (part.startsWith("*") && part.endsWith("*") ? <i key={index}>{part.slice(1, -1)}</i> : <span key={index}>{part}</span>))
}

/** Первый экран фестиваля: гигантский заголовок и цветные капсулы направлений со стикерами. */
export function Hero023({
  title = "Три дня города*.*",
  meta = "22–24 августа · парк «Остров» · вход по билетам и бесплатные зоны",
  tags = DEFAULT_TAGS,
  tagsLabel = "Что будет",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero023Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-023-accent": accent } : null),
    ...(background ? { "--vibeui-hero-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <h1 data-part="title">{markup(title)}</h1>
          {meta ? <p data-part="meta">{meta}</p> : null}
          {tags.length > 0 ? (
            <>
              {tagsLabel ? <p data-part="tags-label">{tagsLabel}</p> : null}
              <ul data-part="tags">
                {tags.map((tag, index) => {
                  const tagStyle = { ["--vibeui-hero-023-tag" as string]: tag.color, ["--vibeui-hero-023-ink" as string]: tag.ink ?? "#111", ["--vibeui-hero-023-n" as string]: index } as CSSProperties
                  const body = (
                    <>
                      {tag.emoji ? (
                        <span data-part="sticker" aria-hidden="true">
                          {tag.emoji}
                        </span>
                      ) : null}
                      {tag.label}
                    </>
                  )
                  return (
                    <li key={tag.label} style={tagStyle}>
                      {tag.href ? (
                        <a data-part="tag" data-plain={tag.emoji ? undefined : "true"} href={tag.href}>
                          {body}
                        </a>
                      ) : (
                        <span data-part="tag" data-plain={tag.emoji ? undefined : "true"}>
                          {body}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}
