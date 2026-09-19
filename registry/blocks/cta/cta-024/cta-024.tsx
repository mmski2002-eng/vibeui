"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

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
  copyLabel?: string
  copiedLabel?: string
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

// «Поставьте звезду»: большая звезда слева — при появлении в кадре контур
// прочерчивается штрихом, по наведению на карточку заливается акцентом
// снизу вверх (clip-path) и покачивается; за ней дышит размытое пятно
// акцента, подложка — сетка-точки. Справа заголовок, который въезжает
// словами через маски, магнитная главная кнопка (тянется к курсору),
// команда установки с кнопкой «скопировать» (Clipboard API, подпись
// меняется на две секунды) и ряд спонсоров с ссылкой «стать спонсором».
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
--vibeui-cta-024-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-cta-024-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-024-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-024"]{color-scheme:dark}
:where([data-vibeui-block="cta-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-024"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5.5rem 0;background:var(--vibeui-cta-024-panel);color:var(--vibeui-cta-024-fg);font-family:var(--vibeui-cta-024-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="cta-024"] *{box-sizing:border-box}
[data-vibeui-block="cta-024"] [data-part="dots"]{position:absolute;inset:0;background-image:radial-gradient(color-mix(in oklab,var(--vibeui-cta-024-fg) 22%,transparent) 1px,transparent 1.3px);background-size:22px 22px;mask-image:radial-gradient(ellipse 70% 80% at 50% 50%,#000 20%,transparent);pointer-events:none;opacity:.5}
[data-vibeui-block="cta-024"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-024"] [data-part="card"]{position:relative;display:grid;gap:2rem;padding:2.5rem 1.5rem;border:1px solid var(--vibeui-cta-024-line);border-radius:20px;background:var(--vibeui-cta-024-bg);align-items:center;overflow:hidden;box-shadow:0 40px 90px -50px color-mix(in oklab,var(--vibeui-cta-024-accent) 55%,rgb(0 0 0 / .5))}
[data-vibeui-block="cta-024"] [data-part="glow"]{position:absolute;width:26rem;height:26rem;left:-8rem;top:50%;border-radius:50%;background:var(--vibeui-cta-024-accent);filter:blur(80px);opacity:.18;pointer-events:none;transform:translateY(-50%);animation:vibeui-cta-024-breathe 6s ease-in-out infinite alternate}
[data-vibeui-block="cta-024"] [data-part="star"]{position:relative;width:min(100%,14rem);aspect-ratio:1;margin:0 auto}
[data-vibeui-block="cta-024"] [data-part="star"] svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
[data-vibeui-block="cta-024"] [data-part="star"] [data-part="outline"]{fill:none;stroke:color-mix(in oklab,var(--vibeui-cta-024-accent) 60%,var(--vibeui-cta-024-line));stroke-width:1.5;stroke-dasharray:400;stroke-dashoffset:400;transition:stroke-dashoffset 1.8s var(--vibeui-cta-024-ease) .2s}
[data-vibeui-block="cta-024"][data-shown="true"] [data-part="outline"]{stroke-dashoffset:0}
[data-vibeui-block="cta-024"] [data-part="star"] [data-part="fill"]{fill:var(--vibeui-cta-024-accent);clip-path:inset(100% 0 0 0);transition:clip-path .9s var(--vibeui-cta-024-ease)}
[data-vibeui-block="cta-024"] [data-part="card"]:hover [data-part="fill"]{clip-path:inset(0 0 0 0)}
[data-vibeui-block="cta-024"] [data-part="card"]:hover [data-part="star"]{animation:vibeui-cta-024-wiggle .8s ease-in-out}
[data-vibeui-block="cta-024"] [data-part="body"]{position:relative}
[data-vibeui-block="cta-024"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="cta-024"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.05em .1em .18em 0;margin:-.05em -.1em -.18em 0}
[data-vibeui-block="cta-024"] [data-part="w"] > span{display:inline-block;transform:translateY(110%)}
[data-vibeui-block="cta-024"][data-shown="true"] [data-part="w"] > span{animation:vibeui-cta-024-rise .8s var(--vibeui-cta-024-ease) forwards;animation-delay:calc(var(--vibeui-cta-024-i,0) * .05s)}
[data-vibeui-block="cta-024"] [data-reveal]{opacity:0}
[data-vibeui-block="cta-024"][data-shown="true"] [data-reveal]{opacity:1;animation:vibeui-cta-024-up .8s var(--vibeui-cta-024-ease) backwards;animation-delay:calc(.2s + var(--vibeui-cta-024-i,0) * .1s)}
[data-vibeui-block="cta-024"] [data-part="text"]{margin:.9rem 0 0;color:var(--vibeui-cta-024-muted);max-width:32rem;font-size:1.05rem}
[data-vibeui-block="cta-024"] [data-part="actions"]{display:flex;gap:.7rem;flex-wrap:wrap;align-items:center;margin-top:1.5rem}
[data-vibeui-block="cta-024"] [data-part="primary"],[data-vibeui-block="cta-024"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.4rem;border-radius:10px;font-weight:600;text-decoration:none;font-size:.98rem;transform:translate(calc(var(--vibeui-cta-024-mx,0) * 1px),calc(var(--vibeui-cta-024-my,0) * 1px));transition:transform .35s var(--vibeui-cta-024-ease),background .25s,box-shadow .35s,border-color .25s}
[data-vibeui-block="cta-024"] [data-part="primary"]{background:var(--vibeui-cta-024-accent);color:var(--vibeui-cta-024-on-accent);box-shadow:0 12px 30px -14px color-mix(in oklab,var(--vibeui-cta-024-accent) 70%,transparent)}
[data-vibeui-block="cta-024"] [data-part="primary"]:hover{box-shadow:0 20px 40px -14px color-mix(in oklab,var(--vibeui-cta-024-accent) 85%,transparent)}
[data-vibeui-block="cta-024"] [data-part="secondary"]{color:inherit;border:1px solid var(--vibeui-cta-024-line)}
[data-vibeui-block="cta-024"] [data-part="secondary"]:hover{background:var(--vibeui-cta-024-panel);transform:translateY(-2px);border-color:color-mix(in oklab,var(--vibeui-cta-024-fg) 30%,transparent)}
[data-vibeui-block="cta-024"] [data-part="cmd"]{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--vibeui-cta-024-mono);font-size:.84rem;color:var(--vibeui-cta-024-muted);padding:.3rem .3rem .3rem .8rem;border-radius:8px;border:1px dashed var(--vibeui-cta-024-line);transition:border-color .3s}
[data-vibeui-block="cta-024"] [data-part="cmd"]:hover{border-color:var(--vibeui-cta-024-accent)}
[data-vibeui-block="cta-024"] [data-part="cmd"] code{white-space:nowrap}
[data-vibeui-block="cta-024"] [data-part="cmd"] code::before{content:"$ ";color:var(--vibeui-cta-024-accent)}
[data-vibeui-block="cta-024"] [data-part="copy"]{border:1px solid var(--vibeui-cta-024-line);border-radius:6px;background:var(--vibeui-cta-024-panel);color:inherit;font:inherit;font-size:.72rem;padding:.3rem .55rem;cursor:pointer;transition:background .3s,color .2s,border-color .2s,transform .25s var(--vibeui-cta-024-ease)}
[data-vibeui-block="cta-024"] [data-part="copy"]:hover{transform:translateY(-1px);border-color:var(--vibeui-cta-024-accent)}
[data-vibeui-block="cta-024"] [data-part="copy"][data-done="true"]{background:var(--vibeui-cta-024-accent);color:var(--vibeui-cta-024-on-accent);border-color:transparent}
[data-vibeui-block="cta-024"] [data-part="sponsors"]{margin-top:1.6rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-cta-024-line);display:flex;flex-wrap:wrap;gap:.4rem .9rem;align-items:baseline;font-size:.85rem}
[data-vibeui-block="cta-024"] [data-part="sponsors"] small{font-family:var(--vibeui-cta-024-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-cta-024-muted);width:100%}
[data-vibeui-block="cta-024"] [data-part="sponsors"] a{display:inline-block;color:inherit;text-decoration:none;font-weight:500;border-bottom:1px solid var(--vibeui-cta-024-line);transition:transform .3s var(--vibeui-cta-024-ease),border-color .3s,color .3s}
[data-vibeui-block="cta-024"] [data-part="sponsors"] a:hover{transform:translateY(-2px);border-color:var(--vibeui-cta-024-accent);color:var(--vibeui-cta-024-accent)}
[data-vibeui-block="cta-024"] [data-part="sponsors"] a[data-become="true"]{color:var(--vibeui-cta-024-accent);border-color:var(--vibeui-cta-024-accent)}
[data-vibeui-block="cta-024"] a:focus-visible,[data-vibeui-block="cta-024"] button:focus-visible{outline:2px solid var(--vibeui-cta-024-accent);outline-offset:2px}
@keyframes vibeui-cta-024-wiggle{0%,100%{transform:rotate(0)}30%{transform:rotate(-6deg) scale(1.04)}60%{transform:rotate(5deg) scale(1.04)}}
@keyframes vibeui-cta-024-breathe{to{transform:translateY(-50%) scale(1.25);opacity:.28}}
@keyframes vibeui-cta-024-rise{to{transform:none}}
@keyframes vibeui-cta-024-up{from{opacity:0;transform:translateY(22px)}}
@container (min-width: 56rem){[data-vibeui-block="cta-024"] [data-part="card"]{grid-template-columns:14rem minmax(0,1fr);gap:3.5rem;padding:3.5rem}}
[data-vibeui-block="cta-024"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-024"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-024"] [data-part="w"] > span{transform:none}[data-vibeui-block="cta-024"] [data-reveal]{opacity:1}[data-vibeui-block="cta-024"] [data-part="outline"]{stroke-dashoffset:0}}`

const STAR = "M50 6l13.2 27.6 30.3 3.9-22.2 21 5.7 30L50 73.9 22.9 88.5l5.7-30-22.2-21 30.3-3.9z"

/** Призыв поставить звезду: контур прорисовывается, заливается по наведению; магнитная кнопка, команда с копированием, спонсоры. */
export function Cta024({
  title = "Одна звезда — плюс один мейнтейнер",
  text = "Звёзды на GitHub — единственная метрика, по которой проект попадает в подборки и находит людей. Если tabl сэкономил вам вечер — верните минуту.",
  primaryLabel = "Star on GitHub",
  primaryHref = "#",
  secondaryLabel = "Открыть на npm",
  secondaryHref = "#",
  command = "npm i tabl",
  copyLabel = "скопировать",
  copiedLabel = "скопировано",
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
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-12% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* буфер недоступен — подпись не меняем */
    }
  }

  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-cta-024-mx", ((event.clientX - rect.left - rect.width / 2) * 0.22).toFixed(1))
    event.currentTarget.style.setProperty("--vibeui-cta-024-my", ((event.clientY - rect.top - rect.height / 2) * 0.22).toFixed(1))
  }
  const release = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vibeui-cta-024-mx", "0")
    event.currentTarget.style.setProperty("--vibeui-cta-024-my", "0")
  }

  const palette = {
    ...(accent ? { "--vibeui-cta-024-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-024-fg": ink } : null),
    ...(background ? { "--vibeui-cta-024-bg": background } : null),
    ...style,
  } as CSSProperties

  const words = title.split(" ").filter(Boolean)
  const at = (value: number) => ({ ["--vibeui-cta-024-i" as string]: value }) as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-024" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="cta-024" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="dots" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="card" data-reveal="" style={at(-1)}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="star" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <path data-part="outline" d={STAR} />
                <path data-part="fill" d={STAR} />
              </svg>
            </div>
            <div data-part="body">
              <h2 data-part="title">
                {words.map((word, index) => (
                  <span key={index} data-part="w" style={at(index)}>
                    <span>{word}</span>
                    {index < words.length - 1 ? " " : null}
                  </span>
                ))}
              </h2>
              {text ? (
                <p data-part="text" data-reveal="" style={at(1)}>
                  {text}
                </p>
              ) : null}
              <div data-part="actions" data-reveal="" style={at(2)}>
                <a data-part="primary" href={primaryHref} onPointerMove={magnet} onPointerLeave={release}>
                  ★ {primaryLabel}
                </a>
                {secondaryLabel ? (
                  <a data-part="secondary" href={secondaryHref}>
                    {secondaryLabel}
                  </a>
                ) : null}
                {command ? (
                  <span data-part="cmd">
                    <code>{command}</code>
                    <button type="button" data-part="copy" data-done={copied} onClick={copy} aria-label={`${copyLabel}: ${command}`}>
                      {copied ? copiedLabel : copyLabel}
                    </button>
                  </span>
                ) : null}
              </div>
              {sponsors.length > 0 ? (
                <div data-part="sponsors" data-reveal="" style={at(3)}>
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
