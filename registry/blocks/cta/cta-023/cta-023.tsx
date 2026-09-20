"use client"

import { useState, type CSSProperties } from "react"

export type Cta023Props = {
  eyebrow?: string
  /** После « — » уходит в курсив. */
  title?: string
  lede?: string
  fundTitle?: string
  fundText?: string
  requisite?: string
  requisiteLabel?: string
  copyLabel?: string
  copiedLabel?: string
  stampLabel?: string
  /** Рукописная строка под текстом. */
  joke?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подарки зимней свадьбы «на камин»: слева текст и шутка про цветы,
// справа карточка-камин — тёмный портал с живым огнём внутри (три язычка
// на keyframes и тёплый свет на «кирпиче»), над ним полка с реквизитами и
// кнопка «скопировать». По клику огонь вспыхивает ярче и на карточке
// печатается тёплый штамп «Спасибо».
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-023"]){
--vibeui-cta-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-023-card:light-dark(#ffffff,#242424);
--vibeui-cta-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-023-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-cta-023-line:light-dark(color-mix(in oklab,var(--vibeui-cta-023-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-cta-023-fg) 24%,transparent));
--vibeui-cta-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-023-fire:#ff9a3c;
--vibeui-cta-023-silver:#9fb0c8;
--vibeui-cta-023-on-accent:oklch(from var(--vibeui-cta-023-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-023-display:"Cormorant Garamond",Georgia,serif;
--vibeui-cta-023-script:"Marck Script","Segoe Script",cursive;
--vibeui-cta-023-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-023"]{color-scheme:dark}
:where([data-vibeui-block="cta-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-023"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-cta-023-bg);color:var(--vibeui-cta-023-fg);font-family:var(--vibeui-cta-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-023"] *{box-sizing:border-box}
[data-vibeui-block="cta-023"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="cta-023"] [data-part="grid"]{display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="cta-023"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-cta-023-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-cta-023-silver)}
[data-vibeui-block="cta-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-023-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="cta-023"] [data-part="title"] em{font-style:italic;font-weight:400;color:var(--vibeui-cta-023-accent)}
[data-vibeui-block="cta-023"] [data-part="lede"]{max-width:32rem;margin:1rem 0 0;color:var(--vibeui-cta-023-muted)}
[data-vibeui-block="cta-023"] [data-part="joke"]{max-width:32rem;margin:1.2rem 0 0;font-family:var(--vibeui-cta-023-script);font-size:1.35rem;line-height:1.3;color:var(--vibeui-cta-023-accent)}
[data-vibeui-block="cta-023"] [data-part="hearth"]{position:relative;display:grid;gap:0;border:1px solid var(--vibeui-cta-023-line);border-radius:1rem;background:var(--vibeui-cta-023-card);overflow:hidden;box-shadow:0 40px 80px -40px rgb(0 0 0 / .9)}
[data-vibeui-block="cta-023"] [data-part="mantel"]{position:relative;padding:1.4rem 1.5rem 1.2rem;border-bottom:.45rem solid #2a3550;background:linear-gradient(180deg,rgb(159 176 200 / .06),transparent)}
[data-vibeui-block="cta-023"] [data-part="mantel"] h3{margin:0 0 .2rem;font-family:var(--vibeui-cta-023-display);font-size:1.7rem;font-weight:500;line-height:1.1}
[data-vibeui-block="cta-023"] [data-part="mantel"] p{margin:0 0 1rem;font-size:.9rem;color:var(--vibeui-cta-023-muted)}
[data-vibeui-block="cta-023"] [data-part="req"]{display:grid;gap:.15rem;padding:.9rem 1rem;border:1px solid var(--vibeui-cta-023-line);border-radius:.6rem;background:rgb(11 18 32 / .35)}
[data-vibeui-block="cta-023"] [data-part="req"] span{font-family:var(--vibeui-cta-023-display);font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-cta-023-silver)}
[data-vibeui-block="cta-023"] [data-part="req"] code{font-family:var(--vibeui-cta-023-display);font-size:1.55rem;font-weight:500;letter-spacing:.06em;font-variant-numeric:lining-nums tabular-nums}
[data-vibeui-block="cta-023"] [data-part="copy"]{display:inline-flex;align-items:center;gap:.5rem;height:2.9rem;margin-top:.9rem;padding:0 1.3rem;border:0;border-radius:999px;background:var(--vibeui-cta-023-accent);color:var(--vibeui-cta-023-on-accent);font-family:var(--vibeui-cta-023-display);font-size:1.02rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;box-shadow:0 0 26px -6px var(--vibeui-cta-023-accent);transition:transform .2s,box-shadow .25s}
[data-vibeui-block="cta-023"] [data-part="copy"]:hover{transform:translateY(-1px);box-shadow:0 0 34px -4px var(--vibeui-cta-023-accent)}
[data-vibeui-block="cta-023"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-cta-023-fg);outline-offset:3px}
[data-vibeui-block="cta-023"] [data-part="copy"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="cta-023"] [data-part="fire"]{position:relative;height:12rem;overflow:hidden;background:radial-gradient(75% 90% at 50% 118%,#3a2416 0,#1a1410 48%,#0d0b0b 100%)}
[data-vibeui-block="cta-023"] [data-part="fire"] video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="cta-023"] [data-part="fire"]::before{content:"";position:absolute;left:50%;bottom:-4.5rem;width:18rem;height:11rem;margin-left:-9rem;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,rgb(255 154 60 / .5),rgb(242 182 79 / .18) 44%,transparent 72%);filter:blur(7px);animation:vibeui-cta-023-embers 4.5s ease-in-out infinite}
[data-vibeui-block="cta-023"] [data-part="fire"]::after{content:"";position:absolute;inset:0;background:radial-gradient(60% 55% at 50% 106%,rgb(255 154 60 / .3),transparent 70%);mix-blend-mode:screen;opacity:.85;transition:opacity .6s}
[data-vibeui-block="cta-023"] [data-part="hearth"][data-copied="true"] [data-part="fire"]::after{opacity:1}
@keyframes vibeui-cta-023-embers{0%,100%{opacity:.7;transform:scaleY(1) translateY(0)}50%{opacity:1;transform:scaleY(1.09) translateY(-.3rem)}}
[data-vibeui-block="cta-023"] [data-part="hearth"][data-copied="true"] [data-part="fire"]::before{animation-duration:1.8s}
[data-vibeui-block="cta-023"] [data-part="stamp"]{position:absolute;right:1.2rem;top:1.1rem;padding:.3rem .8rem;border:2px solid var(--vibeui-cta-023-accent);border-radius:.4rem;color:var(--vibeui-cta-023-accent);font-family:var(--vibeui-cta-023-script);font-size:1.4rem;transform:rotate(-8deg);opacity:0;pointer-events:none}
[data-vibeui-block="cta-023"] [data-part="hearth"][data-copied="true"] [data-part="stamp"]{animation:vibeui-cta-023-stamp .5s cubic-bezier(.2,.9,.3,1.4) both}
@keyframes vibeui-cta-023-stamp{from{opacity:0;transform:rotate(-8deg) scale(2)}to{opacity:.95;transform:rotate(-8deg) scale(1)}}
@container (min-width:56rem){
[data-vibeui-block="cta-023"] [data-part="shell"]{padding:5.5rem 2.5rem}
[data-vibeui-block="cta-023"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-023"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-023"] [data-part="hearth"][data-copied="true"] [data-part="stamp"]{opacity:.95}}`

/** Подарки «на камин»: карточка-камин с живым огнём, реквизиты на полке, копирование ставит штамп «Спасибо». */
export function Cta023({
  eyebrow = "Подарки",
  title = "Лучший подарок — вы у камина",
  lede = "Честно: главное — приехать. Если всё-таки хочется — мы собираем на камин в первом собственном доме. Настоящий, с дровами.",
  fundTitle = "На камин",
  fundText = "Перевод по номеру телефона. В комментарии — ваше имя, мы обязательно скажем спасибо лично.",
  requisite = "+7 900 000-00-00",
  requisiteLabel = "СБП · Дмитрий В.",
  copyLabel = "Скопировать номер",
  copiedLabel = "Скопировано",
  stampLabel = "Спасибо!",
  joke = "Цветы в декабре замёрзнут по дороге. Свечи — нет. Но и они не нужны: у нас их уже двести.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta023Props) {
  const [copied, setCopied] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-cta-023-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-023-fg": ink } : null),
    ...(background ? { "--vibeui-cta-023-bg": background } : null),
    ...style,
  } as CSSProperties
  const [head, tail] = title.split(" — ")

  async function copy() {
    try {
      await navigator.clipboard.writeText(requisite)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div>
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">
                {head}
                {tail ? <em> — {tail}</em> : null}
              </h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {joke ? <p data-part="joke">{joke}</p> : null}
            </div>
            <div data-part="hearth" data-copied={copied ? "true" : undefined}>
              <div data-part="mantel">
                <h3>{fundTitle}</h3>
                <p>{fundText}</p>
                <div data-part="req">
                  <span>{requisiteLabel}</span>
                  <code>{requisite}</code>
                </div>
                <button type="button" data-part="copy" onClick={copy} aria-live="polite">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {copied ? <path d="M5 12l5 5L20 7" /> : <path d="M9 9h10v11H9zM5 15V4h11" />}
                  </svg>
                  {copied ? copiedLabel : copyLabel}
                </button>
              </div>
              <div data-part="fire" aria-hidden="true">
              </div>
              <span data-part="stamp" aria-hidden="true">
                {stampLabel}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
