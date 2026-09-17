import type { CSSProperties } from "react"

export type About009Fact = {
  value: string
  label: string
  /** Цвет капсулы факта. */
  color?: string
  ink?: string
}

export type About009Props = {
  /** Подпись над манифестом: «Привет». */
  label?: string
  /** Манифест; фраза в *звёздочках* становится жирной. */
  text?: string
  /** Второй абзац помельче. */
  note?: string
  facts?: readonly About009Fact[]
  linkLabel?: string
  linkHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Манифест фестиваля: линия сверху, маленькая подпись, крупный текст с
// жирными вставками и ряд цветных капсул с цифрами. Текст проявляется
// построчно при появлении (scroll-driven, в старых браузерах виден сразу).
// Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="about-009"]){
--vibeui-about-009-bg:light-dark(#ffffff,#0e0f12);
--vibeui-about-009-fg:light-dark(#111111,#f4f4f5);
--vibeui-about-009-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-about-009-line:light-dark(#e8e8ea,#26272d);
--vibeui-about-009-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-009-on-accent:oklch(from var(--vibeui-about-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-about-009-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-009-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-009"]{color-scheme:dark}
:where([data-vibeui-block="about-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-009"]{box-sizing:border-box;display:block;background:var(--vibeui-about-009-bg);color:var(--vibeui-about-009-fg);font-family:var(--vibeui-about-009-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="about-009"] *{box-sizing:border-box}
[data-vibeui-block="about-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="about-009"] [data-part="label"]{margin:0;padding-top:1.25rem;border-top:1px solid var(--vibeui-about-009-line);font-size:1.05rem}
[data-vibeui-block="about-009"] [data-part="text"]{margin:1rem 0 0;max-width:22ch;font-family:var(--vibeui-about-009-display);font-size:clamp(1.6rem,4.2cqi,3.25rem);line-height:1.12;letter-spacing:-.03em;font-weight:500;text-wrap:pretty}
[data-vibeui-block="about-009"] [data-part="text"] b{font-weight:700}
[data-vibeui-block="about-009"] [data-part="text"] mark{background:linear-gradient(var(--vibeui-about-009-accent),var(--vibeui-about-009-accent)) no-repeat left 78% / 100% .3em;color:inherit;padding:0 .06em}
[data-vibeui-block="about-009"] [data-part="note"]{margin:1.25rem 0 0;max-width:40rem;font-size:1.1rem;color:var(--vibeui-about-009-muted)}
[data-vibeui-block="about-009"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-009"] [data-part="fact"]{display:inline-flex;align-items:baseline;gap:.5rem;padding:.65rem 1.1rem;border-radius:999px;background:var(--vibeui-about-009-chip,#f1f1f3);color:var(--vibeui-about-009-ink,#111);transition:transform .3s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="about-009"] [data-part="fact"]:hover{transform:translateY(-3px) rotate(-1deg)}
[data-vibeui-block="about-009"] [data-part="fact"] b{font-family:var(--vibeui-about-009-display);font-size:1.35rem;font-weight:700;letter-spacing:-.02em;line-height:1}
[data-vibeui-block="about-009"] [data-part="fact"] span{font-size:.9rem;opacity:.8}
[data-vibeui-block="about-009"] [data-part="link"]{display:inline-flex;align-items:center;height:2.6rem;padding:0 1.15rem;margin-top:1.5rem;border-radius:999px;background:light-dark(#f1f1f3,#1f2026);color:inherit;font-weight:500;text-decoration:none;transition:transform .2s}
[data-vibeui-block="about-009"] [data-part="link"]:hover{transform:translateY(-2px)}
[data-vibeui-block="about-009"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-about-009-fg);outline-offset:3px}
@supports (animation-timeline: view()){
[data-vibeui-block="about-009"] [data-part="text"],[data-vibeui-block="about-009"] [data-part="note"],[data-vibeui-block="about-009"] [data-part="facts"]{animation:vibeui-about-009-in linear both;animation-timeline:view();animation-range:entry 0% entry 40%}
}
@keyframes vibeui-about-009-in{from{opacity:.15;transform:translateY(18px)}to{opacity:1;transform:none}}
@container (min-width: 60rem){
[data-vibeui-block="about-009"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-009"] *{animation:none!important;transition:none!important}}`

function markup(text: string) {
  return text.split(/(\*[^*]+\*|_[^_]+_)/).map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) return <b key={index}>{part.slice(1, -1)}</b>
    if (part.startsWith("_") && part.endsWith("_")) return <mark key={index}>{part.slice(1, -1)}</mark>
    return <span key={index}>{part}</span>
  })
}

/** Манифест фестиваля: подпись, крупный текст с жирными вставками и цветные капсулы фактов. */
export function About009({
  label = "Привет",
  text = "Три дня в августе парк «Остров» становится *городом внутри города*: сцены, кухни, лекторий, маркет и кино под открытым небом. Половина программы _бесплатно_, остальное — по одному билету на всё.",
  note = "Фестиваль делают горожане: 140 волонтёров, 60 локальных проектов и восемь районных сообществ. Мы не про хедлайнеров из телевизора, а про то, что рядом.",
  facts = [
    { value: "3", label: "дня", color: "#c2df37" },
    { value: "6", label: "сцен и площадок", color: "#ffe2d6" },
    { value: "120+", label: "событий", color: "#d9cafe" },
    { value: "48 %", label: "программы бесплатно", color: "#98f5af" },
    { value: "0+", label: "детям до 7 — вход свободный", color: "#f3c37d" },
  ],
  linkLabel = "О фестивале и команде →",
  linkHref = "#",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: About009Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-009-accent": accent } : null),
    ...(background ? { "--vibeui-about-009-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-009" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-009" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {label ? <p data-part="label">{label}</p> : null}
          <p data-part="text">{markup(text)}</p>
          {note ? <p data-part="note">{note}</p> : null}
          {facts.length > 0 ? (
            <ul data-part="facts">
              {facts.map((fact) => (
                <li key={fact.label} data-part="fact" style={{ ["--vibeui-about-009-chip" as string]: fact.color, ["--vibeui-about-009-ink" as string]: fact.ink ?? "#111" }}>
                  <b>{fact.value}</b>
                  <span>{fact.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {linkLabel ? (
            <a data-part="link" href={linkHref}>
              {linkLabel}
            </a>
          ) : null}
        </div>
      </section>
    </>
  )
}
