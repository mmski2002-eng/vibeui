import type { CSSProperties } from "react"

export type Cta019Props = {
  /** Подпись над баннером: «Ещё не решили?». */
  eyebrow?: string
  image?: string
  imageAlt?: string
  /** Матовая плашка в углу баннера. */
  label?: string
  /** Заголовок внутри баннера; пусто — только кнопки. */
  title?: string
  secondaryLabel?: string
  secondaryHref?: string
  primaryLabel?: string
  primaryHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Баннер-призыв: фото на всю ширину со скруглением, матовая плашка в левом
// верхнем углу, справа снизу две капсулы — стеклянная вторичная и
// акцентная главная. Фото медленно плывёт, капсулы приподнимаются по
// наведению. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-019"]){
--vibeui-cta-019-bg:light-dark(#ffffff,#0e0f12);
--vibeui-cta-019-fg:light-dark(#111111,#f4f4f5);
--vibeui-cta-019-line:light-dark(#e8e8ea,#26272d);
--vibeui-cta-019-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-019-on-accent:oklch(from var(--vibeui-cta-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-019-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-019-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-019"]{color-scheme:dark}
:where([data-vibeui-block="cta-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-019"]{box-sizing:border-box;display:block;background:var(--vibeui-cta-019-bg);color:var(--vibeui-cta-019-fg);font-family:var(--vibeui-cta-019-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="cta-019"] *{box-sizing:border-box}
[data-vibeui-block="cta-019"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="cta-019"] [data-part="eyebrow"]{margin:0 0 1rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-cta-019-line);font-size:1.05rem}
[data-vibeui-block="cta-019"] [data-part="banner"]{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:1.5rem;min-height:18rem;padding:1rem;border-radius:1.5rem;overflow:hidden;background:#111;color:#fff;isolation:isolate}
[data-vibeui-block="cta-019"] [data-part="banner"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;animation:vibeui-cta-019-drift 24s ease-in-out infinite alternate}
@keyframes vibeui-cta-019-drift{from{transform:scale(1.02) translate(0,0)}to{transform:scale(1.1) translate(-1.5%,1.5%)}}
[data-vibeui-block="cta-019"] [data-part="banner"]::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgb(0 0 0 / .05),rgb(0 0 0 / .35))}
[data-vibeui-block="cta-019"] [data-part="label"]{align-self:flex-start;padding:.5rem .95rem;border-radius:999px;background:rgb(255 255 255 / .22);backdrop-filter:blur(10px);font-size:.95rem;font-weight:500}
[data-vibeui-block="cta-019"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem}
[data-vibeui-block="cta-019"] [data-part="title"]{margin:0;max-width:22ch;font-family:var(--vibeui-cta-019-display);font-size:clamp(1.5rem,3.4cqi,2.6rem);font-weight:600;letter-spacing:-.03em;line-height:1.05;text-shadow:0 2px 20px rgb(0 0 0 / .3)}
[data-vibeui-block="cta-019"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.6rem;margin-left:auto}
[data-vibeui-block="cta-019"] [data-part="actions"] a{display:inline-flex;align-items:center;justify-content:center;height:3.6rem;padding:0 1.6rem;border-radius:999px;font-family:var(--vibeui-cta-019-display);font-size:1.2rem;font-weight:500;text-decoration:none;transition:transform .25s cubic-bezier(.2,.9,.3,1.3),filter .2s}
[data-vibeui-block="cta-019"] [data-part="actions"] a:hover{transform:translateY(-3px)}
[data-vibeui-block="cta-019"] [data-part="actions"] a:focus-visible{outline:2px solid #fff;outline-offset:3px}
[data-vibeui-block="cta-019"] [data-part="secondary"]{background:rgb(255 255 255 / .35);backdrop-filter:blur(12px);color:#111}
[data-vibeui-block="cta-019"] [data-part="primary"]{background:var(--vibeui-cta-019-accent);color:var(--vibeui-cta-019-on-accent);font-weight:600}
@container (min-width: 60rem){
[data-vibeui-block="cta-019"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="cta-019"] [data-part="banner"]{min-height:14rem;padding:1.25rem}
[data-vibeui-block="cta-019"] [data-part="actions"] a{padding:0 2rem;height:3.9rem;font-size:1.35rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-019"] *{animation:none!important;transition:none!important}}`

/** Баннер-призыв: фото на всю ширину, матовая плашка и две капсулы действий. */
export function Cta019({
  eyebrow = "Продолжение следует",
  image = "/demo/festival/banner.webp",
  imageAlt = "",
  label = "22–24 августа",
  title = "",
  secondaryLabel = "Программа",
  secondaryHref = "#program",
  primaryLabel = "Купить билет →",
  primaryHref = "#tickets",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Cta019Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-019-accent": accent } : null),
    ...(background ? { "--vibeui-cta-019-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-019" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-019" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <div data-part="banner">
            {image ? <img src={image} alt={imageAlt} loading="lazy" /> : null}
            {label ? <span data-part="label">{label}</span> : null}
            <div data-part="bottom">
              {title ? <p data-part="title">{title}</p> : null}
              <div data-part="actions">
                {secondaryLabel ? (
                  <a data-part="secondary" href={secondaryHref}>
                    {secondaryLabel}
                  </a>
                ) : null}
                {primaryLabel ? (
                  <a data-part="primary" href={primaryHref}>
                    {primaryLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
