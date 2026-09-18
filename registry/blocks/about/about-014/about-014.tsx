import type { CSSProperties } from "react"

export type About014Fact = {
  value: string
  label: string
}

export type About014Step = {
  years: string
  place: string
  role?: string
}

export type About014Props = {
  eyebrow?: string
  title?: string
  text?: string
  image?: string
  imageAlt?: string
  /** Подпись-каракуля на фото. */
  imageNote?: string
  facts?: readonly About014Fact[]
  skillsLabel?: string
  skills?: readonly string[]
  pathLabel?: string
  path?: readonly About014Step[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Обо мне» для личного сайта: фото чёрно-белое, по наведению — в цвет и с
// лёгким наездом; рядом крупный текст, три факта цифрами, навыки тегами,
// которые по наведению меняют фон на акцент, и короткая линия карьеры
// (годы моноширинным — место — роль). Без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="about-014"]){
--vibeui-about-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-014-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-014-on-accent:oklch(from var(--vibeui-about-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-about-014-muted:color-mix(in oklab,var(--vibeui-about-014-fg) 60%,var(--vibeui-about-014-bg));
--vibeui-about-014-line:color-mix(in oklab,var(--vibeui-about-014-fg) 12%,transparent);
--vibeui-about-014-panel:color-mix(in oklab,var(--vibeui-about-014-fg) 5%,var(--vibeui-about-014-bg));
--vibeui-about-014-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-014-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-014-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-014"]{color-scheme:dark}
:where([data-vibeui-block="about-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-014"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-about-014-panel);color:var(--vibeui-about-014-fg);font-family:var(--vibeui-about-014-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="about-014"] *{box-sizing:border-box}
[data-vibeui-block="about-014"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="about-014"] [data-part="pic"]{position:relative;aspect-ratio:4 / 5;max-width:26rem;border-radius:1.4rem;overflow:hidden;background:var(--vibeui-about-014-line)}
[data-vibeui-block="about-014"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.05);transition:filter .6s,transform 1.2s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="about-014"] [data-part="pic"]:hover img{filter:none;transform:scale(1.03)}
[data-vibeui-block="about-014"] [data-part="note"]{position:absolute;left:1rem;bottom:1rem;padding:.4rem .7rem;border-radius:999px;background:var(--vibeui-about-014-bg);font-family:var(--vibeui-about-014-mono);font-size:.7rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-about-014-mono);font-size:.78rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-014-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.04em}
[data-vibeui-block="about-014"] [data-part="text"]{margin:1.2rem 0 0;font-size:1.1rem;max-width:34rem}
[data-vibeui-block="about-014"] [data-part="facts"]{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-014"] [data-part="facts"] b{display:block;font-family:var(--vibeui-about-014-display);font-weight:800;font-size:clamp(1.8rem,4cqi,2.8rem);letter-spacing:-.04em;line-height:1;color:var(--vibeui-about-014-accent)}
[data-vibeui-block="about-014"] [data-part="facts"] small{display:block;margin-top:.3rem;font-size:.82rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="label"]{margin:2rem 0 .6rem;font-family:var(--vibeui-about-014-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="skills"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="about-014"] [data-part="skills"] li{padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-about-014-line);font-size:.85rem;font-weight:500;transition:background .2s,color .2s,border-color .2s;cursor:default}
[data-vibeui-block="about-014"] [data-part="skills"] li:hover{background:var(--vibeui-about-014-accent);color:var(--vibeui-about-014-on-accent);border-color:transparent}
[data-vibeui-block="about-014"] [data-part="path"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="about-014"] [data-part="path"] li{display:grid;grid-template-columns:7rem 1fr;gap:1rem;padding:.6rem 0;border-top:1px solid var(--vibeui-about-014-line);font-size:.92rem}
[data-vibeui-block="about-014"] [data-part="path"] span:first-child{font-family:var(--vibeui-about-014-mono);font-size:.78rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="path"] b{font-weight:600}
[data-vibeui-block="about-014"] [data-part="path"] small{display:block;color:var(--vibeui-about-014-muted)}
@container (min-width: 56rem){[data-vibeui-block="about-014"] [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-014"] *{transition:none!important}}`

/** «Обо мне»: фото ч/б → цвет, факты, навыки и линия карьеры. */
export function About014({
  eyebrow = "обо мне",
  title = "Дизайнер, который умеет в код. Или наоборот",
  text = "Семь лет делаю продукты: от лендинга за выходные до дизайн-системы на четыре команды. Люблю ранние стадии, когда важнее собрать, чем согласовать, и не боюсь сам открыть терминал.",
  image = "",
  imageAlt = "",
  imageNote = "Тбилиси, 2026",
  facts = [
    { value: "7", label: "лет в продуктах" },
    { value: "40+", label: "запущенных проектов" },
    { value: "3", label: "команды выросли из моих макетов" },
  ],
  skillsLabel = "чем работаю",
  skills = ["Figma", "React", "Next.js", "TypeScript", "дизайн-системы", "прототипы", "исследования", "анимация", "Framer", "Tailwind"],
  pathLabel = "путь",
  path = [
    { years: "2024 — сейчас", place: "фриланс и партнёрства", role: "дизайн + разработка для стартапов" },
    { years: "2021 — 2024", place: "Точка", role: "ведущий продуктовый дизайнер" },
    { years: "2019 — 2021", place: "агентство «Смена»", role: "дизайнер интерфейсов" },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About014Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-014-accent": accent } : null),
    ...(ink ? { "--vibeui-about-014-fg": ink } : null),
    ...(background ? { "--vibeui-about-014-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-014" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-014" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="pic">
            {image ? <img src={image} alt={imageAlt} loading="lazy" /> : null}
            {imageNote ? <span data-part="note">{imageNote}</span> : null}
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {text ? <p data-part="text">{text}</p> : null}
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact.label}>
                    <b>{fact.value}</b>
                    <small>{fact.label}</small>
                  </li>
                ))}
              </ul>
            ) : null}
            {skills.length > 0 ? (
              <>
                <p data-part="label">{skillsLabel}</p>
                <ul data-part="skills">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {path.length > 0 ? (
              <>
                <p data-part="label">{pathLabel}</p>
                <ol data-part="path">
                  {path.map((step) => (
                    <li key={step.years}>
                      <span>{step.years}</span>
                      <span>
                        <b>{step.place}</b>
                        {step.role ? <small>{step.role}</small> : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
