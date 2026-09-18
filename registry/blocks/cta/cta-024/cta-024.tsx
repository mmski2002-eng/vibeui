import type { CSSProperties } from "react"

export type Cta024Sponsor = {
  name: string
  href?: string
}

export type Cta024Props = {
  title?: string
  text?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Команда для копирования рядом с кнопками. */
  command?: string
  sponsorsLabel?: string
  sponsors?: readonly Cta024Sponsor[]
  sponsorHref?: string
  sponsorLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Поставьте звезду»: большая контурная звезда слева, которая заливается
// акцентом по наведению на секцию (clip-path снизу вверх) и слегка
// покачивается; справа заголовок, кнопки «GitHub» и «npm», строка команды и
// ряд спонсоров текстом с ссылкой «стать спонсором». Без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-024"]){
--vibeui-cta-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-024-on-accent:oklch(from var(--vibeui-cta-024-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-024-muted:color-mix(in oklab,var(--vibeui-cta-024-fg) 60%,var(--vibeui-cta-024-bg));
--vibeui-cta-024-line:color-mix(in oklab,var(--vibeui-cta-024-fg) 12%,transparent);
--vibeui-cta-024-panel:color-mix(in oklab,var(--vibeui-cta-024-fg) 4%,var(--vibeui-cta-024-bg));
--vibeui-cta-024-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-024-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-024"]{color-scheme:dark}
:where([data-vibeui-block="cta-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-024"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-cta-024-panel);color:var(--vibeui-cta-024-fg);font-family:var(--vibeui-cta-024-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="cta-024"] *{box-sizing:border-box}
[data-vibeui-block="cta-024"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-024"] [data-part="card"]{display:grid;gap:2rem;padding:2.5rem 1.5rem;border:1px solid var(--vibeui-cta-024-line);border-radius:14px;background:var(--vibeui-cta-024-bg);align-items:center}
[data-vibeui-block="cta-024"] [data-part="star"]{position:relative;width:min(100%,14rem);aspect-ratio:1;margin:0 auto}
[data-vibeui-block="cta-024"] [data-part="star"] svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
[data-vibeui-block="cta-024"] [data-part="star"] [data-part="outline"]{fill:none;stroke:var(--vibeui-cta-024-line);stroke-width:1.5}
[data-vibeui-block="cta-024"] [data-part="star"] [data-part="fill"]{fill:var(--vibeui-cta-024-accent);clip-path:inset(100% 0 0 0);transition:clip-path .9s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="cta-024"] [data-part="card"]:hover [data-part="fill"]{clip-path:inset(0 0 0 0)}
[data-vibeui-block="cta-024"] [data-part="card"]:hover [data-part="star"]{animation:vibeui-cta-024-wiggle .8s ease-in-out}
[data-vibeui-block="cta-024"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(1.8rem,4cqi,2.8rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="cta-024"] [data-part="text"]{margin:.8rem 0 0;color:var(--vibeui-cta-024-muted);max-width:32rem}
[data-vibeui-block="cta-024"] [data-part="actions"]{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;margin-top:1.4rem}
[data-vibeui-block="cta-024"] [data-part="primary"],[data-vibeui-block="cta-024"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.2rem;border-radius:8px;font-weight:600;text-decoration:none;font-size:.95rem;transition:filter .2s,background .2s}
[data-vibeui-block="cta-024"] [data-part="primary"]{background:var(--vibeui-cta-024-accent);color:var(--vibeui-cta-024-on-accent)}
[data-vibeui-block="cta-024"] [data-part="primary"]:hover{filter:brightness(1.08)}
[data-vibeui-block="cta-024"] [data-part="secondary"]{color:inherit;border:1px solid var(--vibeui-cta-024-line)}
[data-vibeui-block="cta-024"] [data-part="secondary"]:hover{background:var(--vibeui-cta-024-panel)}
[data-vibeui-block="cta-024"] [data-part="cmd"]{font-family:var(--vibeui-cta-024-mono);font-size:.82rem;color:var(--vibeui-cta-024-muted);padding:.55rem .8rem;border-radius:6px;border:1px dashed var(--vibeui-cta-024-line)}
[data-vibeui-block="cta-024"] [data-part="sponsors"]{margin-top:1.6rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-cta-024-line);display:flex;flex-wrap:wrap;gap:.4rem .9rem;align-items:baseline;font-size:.85rem}
[data-vibeui-block="cta-024"] [data-part="sponsors"] small{font-family:var(--vibeui-cta-024-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-cta-024-muted);width:100%}
[data-vibeui-block="cta-024"] [data-part="sponsors"] a{color:inherit;text-decoration:none;font-weight:500;border-bottom:1px solid var(--vibeui-cta-024-line)}
[data-vibeui-block="cta-024"] [data-part="sponsors"] a[data-become="true"]{color:var(--vibeui-cta-024-accent);border-color:var(--vibeui-cta-024-accent)}
[data-vibeui-block="cta-024"] a:focus-visible{outline:2px solid var(--vibeui-cta-024-accent);outline-offset:2px}
@keyframes vibeui-cta-024-wiggle{0%,100%{transform:rotate(0)}30%{transform:rotate(-6deg) scale(1.04)}60%{transform:rotate(5deg) scale(1.04)}}
@container (min-width: 56rem){[data-vibeui-block="cta-024"] [data-part="card"]{grid-template-columns:14rem minmax(0,1fr);gap:3.5rem;padding:3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-024"] *{animation:none!important;transition:none!important}}`

const STAR = "M50 6l13.2 27.6 30.3 3.9-22.2 21 5.7 30L50 73.9 22.9 88.5l5.7-30-22.2-21 30.3-3.9z"

/** Призыв поставить звезду: заливается по наведению; кнопки и спонсоры. */
export function Cta024({
  title = "Одна звезда — плюс один мейнтейнер",
  text = "Звёзды на GitHub — единственная метрика, по которой проект попадает в подборки и находит людей. Если tabl сэкономил вам вечер — верните минуту.",
  primaryLabel = "Star on GitHub",
  primaryHref = "#",
  secondaryLabel = "Открыть на npm",
  secondaryHref = "#",
  command = "npm i tabl",
  sponsorsLabel = "Спонсоры",
  sponsors = [{ name: "Vercel" }, { name: "Cloud.ru" }, { name: "Selectel" }, { name: "Тинькофф Open Source" }],
  sponsorHref = "#",
  sponsorLabel = "стать спонсором",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta024Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-024-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-024-fg": ink } : null),
    ...(background ? { "--vibeui-cta-024-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-024" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-024" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="card">
            <div data-part="star" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <path data-part="outline" d={STAR} />
                <path data-part="fill" d={STAR} />
              </svg>
            </div>
            <div>
              <h2 data-part="title">{title}</h2>
              {text ? <p data-part="text">{text}</p> : null}
              <div data-part="actions">
                <a data-part="primary" href={primaryHref}>
                  ★ {primaryLabel}
                </a>
                {secondaryLabel ? (
                  <a data-part="secondary" href={secondaryHref}>
                    {secondaryLabel}
                  </a>
                ) : null}
                {command ? <code data-part="cmd">$ {command}</code> : null}
              </div>
              {sponsors.length > 0 ? (
                <div data-part="sponsors">
                  <small>{sponsorsLabel}</small>
                  {sponsors.map((sponsor) => (
                    <a key={sponsor.name} href={sponsor.href ?? "#"}>
                      {sponsor.name}
                    </a>
                  ))}
                  {sponsorLabel ? (
                    <a data-become="true" href={sponsorHref}>
                      + {sponsorLabel}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
