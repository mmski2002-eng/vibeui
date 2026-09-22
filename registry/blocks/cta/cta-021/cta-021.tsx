"use client"

import { useState, type CSSProperties } from "react"

import { Button015 } from "@/registry/components/button/button-015/button-015"

export type Cta021Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Подпись над реквизитами: «Вклад в путешествие». */
  fundTitle?: string
  fundText?: string
  /** Реквизиты: номер карты, телефон для СБП или ссылка. Копируются по клику. */
  requisite?: string
  requisiteLabel?: string
  copyLabel?: string
  copiedLabel?: string
  /** Буквы на печати: «В&А». */
  seal?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подарки без неловкости: слева «лучший подарок — вы», справа карточка
// вклада в путешествие с реквизитами и кнопкой «скопировать»; на углу
// карточки восковая печать с монограммой, при копировании она
// «прижимается».
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-021"]){
--vibeui-cta-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-021-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-cta-021-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-cta-021-card:light-dark(#fffaf3,#242424);
--vibeui-cta-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-021-plum:var(--vibeui-cta-021-fg);
--vibeui-cta-021-sage:#8a9a7b;
--vibeui-cta-021-on-accent:oklch(from var(--vibeui-cta-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-021-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-cta-021-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-021"]{color-scheme:dark}
:where([data-vibeui-block="cta-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-021"]{box-sizing:border-box;display:block;background:var(--vibeui-cta-021-bg);color:var(--vibeui-cta-021-fg);font-family:var(--vibeui-cta-021-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-021"] *{box-sizing:border-box}
[data-vibeui-block="cta-021"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="cta-021"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="cta-021"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-cta-021-accent)}
[data-vibeui-block="cta-021"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-021-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-cta-021-plum);text-wrap:balance}
[data-vibeui-block="cta-021"] [data-part="lede"]{max-width:32rem;margin:.8rem 0 0;color:var(--vibeui-cta-021-muted)}
[data-vibeui-block="cta-021"]{position:relative;overflow:hidden}
[data-vibeui-block="cta-021"]::before{content:"";position:absolute;right:-8%;top:-20%;width:30rem;height:30rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-cta-021-accent) 18%,transparent),transparent 65%);pointer-events:none}
[data-vibeui-block="cta-021"] [data-part="shell"]{position:relative}
[data-vibeui-block="cta-021"] [data-part="fund"]{position:relative;padding:1.75rem;border:1px solid color-mix(in oklab,var(--vibeui-cta-021-line) 70%,transparent);border-radius:1.4rem;background:color-mix(in oklab,var(--vibeui-cta-021-card) 72%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 30px 60px -40px rgb(43 26 36 / .5),inset 0 1px 0 rgb(255 255 255 / .5)}
[data-vibeui-block="cta-021"] [data-part="fund"] h3{margin:0;font-family:var(--vibeui-cta-021-display);font-size:1.7rem;font-weight:500;line-height:1.15;color:var(--vibeui-cta-021-plum)}
[data-vibeui-block="cta-021"] [data-part="fund"] > p{margin:.5rem 0 1.4rem;font-size:.95rem;color:var(--vibeui-cta-021-muted)}
[data-vibeui-block="cta-021"] [data-part="req"]{display:grid;gap:.3rem;padding:1rem 1.1rem;border:1px dashed var(--vibeui-cta-021-line);border-radius:1rem;background:var(--vibeui-cta-021-bg)}
[data-vibeui-block="cta-021"] [data-part="req"] span{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-cta-021-muted)}
[data-vibeui-block="cta-021"] [data-part="req"] code{font-family:var(--vibeui-cta-021-display);font-size:1.5rem;font-weight:500;letter-spacing:.06em;color:var(--vibeui-cta-021-plum);overflow-wrap:anywhere}
[data-vibeui-block="cta-021"] [data-part="seal"]{position:absolute;top:-1.4rem;right:1.4rem;display:grid;place-items:center;width:4.6rem;height:4.6rem;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-cta-021-accent) 70%,#fff) 0,var(--vibeui-cta-021-accent) 35%,color-mix(in oklab,var(--vibeui-cta-021-accent) 70%,#000) 100%);color:var(--vibeui-cta-021-on-accent);font-family:var(--vibeui-cta-021-display);font-style:italic;font-size:1.25rem;box-shadow:0 10px 24px -10px rgb(43 26 36 / .6),inset 0 0 0 .3rem rgb(255 255 255 / .12);transform:rotate(-10deg);transition:transform .35s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="cta-021"] [data-part="fund"][data-copied="true"] [data-part="seal"]{transform:rotate(-10deg) scale(.92)}
@container (min-width:56rem){
[data-vibeui-block="cta-021"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="cta-021"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;align-items:center}
[data-vibeui-block="cta-021"] [data-part="fund"]{padding:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-021"] *{animation:none!important;transition:none!important}}`

/** Подарки на свадьбу без неловкости: вклад в путешествие с копированием реквизитов и восковой печатью. */
export function Cta021({
  eyebrow = "Подарки",
  title = "Лучший подарок — вы",
  lede = "Честно. Но если очень хочется — мы собираем на медовый месяц в Португалии. Любая сумма станет ужином у океана, и мы пришлём оттуда открытку.",
  fundTitle = "Вклад в путешествие",
  fundText = "Перевод по номеру телефона (СБП) или на карту — как удобнее. В комментарии напишите своё имя, чтобы мы знали, кого благодарить.",
  requisite = "+7 900 000-00-00",
  requisiteLabel = "Телефон для СБП · Артём З.",
  copyLabel = "Скопировать номер",
  copiedLabel = "Скопировано",
  seal = "В&А",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta021Props) {
  const [copied, setCopied] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-cta-021-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-021-fg": ink } : null),
    ...(background ? { "--vibeui-cta-021-bg": background } : null),
    ...style,
  } as CSSProperties


  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-021" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div>
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="fund" data-copied={copied ? "true" : undefined}>
              {seal ? (
                <span data-part="seal" aria-hidden="true">
                  {seal}
                </span>
              ) : null}
              <h3>{fundTitle}</h3>
              <p>{fundText}</p>
              <div data-part="req">
                <span>{requisiteLabel}</span>
                <code>{requisite}</code>
              </div>
              <Button015
                data-part="copy-button"
                value={requisite}
                label={copyLabel}
                doneLabel={copiedLabel}
                hold={1800}
                onCopy={() => setCopied(true)}
                onReset={() => setCopied(false)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
