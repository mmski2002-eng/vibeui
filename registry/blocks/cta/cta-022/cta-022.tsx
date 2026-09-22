"use client"

import { useState, type CSSProperties } from "react"

import { Button015 } from "@/registry/components/button/button-015/button-015"

export type Cta022Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Заголовок карточки: «На следующий рейс». */
  fundTitle?: string
  fundText?: string
  /** Куда «летим» на подарки: подпись на карточке-билете. */
  from?: string
  to?: string
  toCity?: string
  requisite?: string
  requisiteLabel?: string
  copyLabel?: string
  copiedLabel?: string
  /** Шутливая строка внизу: «или привезите бутылку рома». */
  joke?: string
  /** Город вылета под кодом. */
  fromCity?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подарки как посадочный талон на следующий рейс: слева «лучший подарок —
// вы на Кубе», справа карточка-билет с кодами «HAV → ?» и реквизитами,
// кнопка «скопировать» ставит штамп «PAID». Внизу — шутка про ром.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-022"]){
--vibeui-cta-022-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-022-sand:light-dark(#f4f4f4,#242424);
--vibeui-cta-022-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-022-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-cta-022-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-cta-022-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-022-sea:#2aa7a0;
--vibeui-cta-022-sun:#f2c14e;
--vibeui-cta-022-on-accent:oklch(from var(--vibeui-cta-022-accent) clamp(0,(0.72 - l) * 100,1) 0 0);
--vibeui-cta-022-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-cta-022-script:"Lobster","Brush Script MT",cursive;
--vibeui-cta-022-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-022"]{color-scheme:dark}
:where([data-vibeui-block="cta-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-022"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-cta-022-bg);color:var(--vibeui-cta-022-fg);font-family:var(--vibeui-cta-022-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-022"] *{box-sizing:border-box}
[data-vibeui-block="cta-022"]::before{content:"";position:absolute;right:-10%;top:-30%;width:34rem;height:34rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-cta-022-sun) 30%,transparent),transparent 62%);pointer-events:none}
[data-vibeui-block="cta-022"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="cta-022"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="cta-022"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-cta-022-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-cta-022-accent)}
[data-vibeui-block="cta-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-022-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="cta-022"] [data-part="title"] em{font-family:var(--vibeui-cta-022-script);font-style:normal;font-weight:400;text-transform:none;color:var(--vibeui-cta-022-sea);font-size:.8em}
[data-vibeui-block="cta-022"] [data-part="lede"]{max-width:32rem;margin:.8rem 0 0;color:var(--vibeui-cta-022-muted)}
[data-vibeui-block="cta-022"] [data-part="joke"]{margin:1.2rem 0 0;font-family:var(--vibeui-cta-022-script);font-size:1.3rem;color:var(--vibeui-cta-022-accent)}
[data-vibeui-block="cta-022"] [data-part="ticket"]{position:relative;display:grid;grid-template-columns:minmax(0,1fr);border-radius:.9rem;background:var(--vibeui-cta-022-sand);box-shadow:0 30px 60px -40px rgb(18 58 75 / .5);overflow:hidden}
[data-vibeui-block="cta-022"] [data-part="ticket"]::before{content:"";position:absolute;left:0;top:0;bottom:0;width:.6rem;background:var(--vibeui-cta-022-sea)}
[data-vibeui-block="cta-022"] [data-part="ticket"]::after{content:"";position:absolute;left:1.9rem;right:1.9rem;top:5.6rem;height:2px;background:radial-gradient(circle,var(--vibeui-cta-022-bg) 0 2px,transparent 2.5px) 0 0/10px 2px repeat-x}
[data-vibeui-block="cta-022"] [data-part="codes"]{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem;padding:1.3rem 1.6rem 1.2rem 2rem}
[data-vibeui-block="cta-022"] [data-part="codes"] div{display:grid;gap:.05rem}
[data-vibeui-block="cta-022"] [data-part="codes"] div:last-child{text-align:right}
[data-vibeui-block="cta-022"] [data-part="codes"] b{font-family:var(--vibeui-cta-022-display);font-size:2.2rem;font-weight:700;line-height:1;letter-spacing:.02em}
[data-vibeui-block="cta-022"] [data-part="codes"] small{font-size:.66rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-cta-022-muted)}
[data-vibeui-block="cta-022"] [data-part="codes"] svg{width:1.8rem;height:1.8rem;fill:var(--vibeui-cta-022-accent)}
[data-vibeui-block="cta-022"] [data-part="body"]{padding:1.4rem 1.6rem 1.5rem 2rem}
[data-vibeui-block="cta-022"] [data-part="body"] h3{margin:0;font-family:var(--vibeui-cta-022-display);font-size:1.6rem;font-weight:600;line-height:1.1;text-transform:uppercase}
[data-vibeui-block="cta-022"] [data-part="body"] > p{margin:.4rem 0 1.2rem;font-size:.92rem;color:var(--vibeui-cta-022-muted)}
[data-vibeui-block="cta-022"] [data-part="req"]{display:grid;gap:.25rem;padding:.9rem 1rem;border:1px dashed var(--vibeui-cta-022-line);border-radius:.6rem;background:var(--vibeui-cta-022-bg)}
[data-vibeui-block="cta-022"] [data-part="req"] span{font-size:.66rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-cta-022-muted)}
[data-vibeui-block="cta-022"] [data-part="req"] code{font-family:var(--vibeui-cta-022-display);font-size:1.4rem;font-weight:600;letter-spacing:.08em;overflow-wrap:anywhere}
[data-vibeui-block="cta-022"] [data-part="paid"]{position:absolute;right:1.4rem;bottom:1.4rem;padding:.3rem .8rem;border:3px solid var(--vibeui-cta-022-sea);border-radius:.4rem;color:var(--vibeui-cta-022-sea);font-family:var(--vibeui-cta-022-display);font-size:1.1rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;transform:rotate(-10deg);opacity:0;pointer-events:none;mix-blend-mode:multiply}
[data-vibeui-block="cta-022"] [data-part="ticket"][data-copied="true"] [data-part="paid"]{animation:vibeui-cta-022-stamp .5s cubic-bezier(.2,.9,.3,1.4) both}
@keyframes vibeui-cta-022-stamp{from{opacity:0;transform:rotate(-10deg) scale(2)}to{opacity:.9;transform:rotate(-10deg) scale(1)}}
@container (min-width:56rem){
[data-vibeui-block="cta-022"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="cta-022"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;align-items:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-022"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-022"] [data-part="ticket"][data-copied="true"] [data-part="paid"]{opacity:.9}}`

/** Подарки для свадьбы-путешествия: карточка-билет «на следующий рейс» с копированием реквизитов и штампом. */
export function Cta022({
  eyebrow = "Подарки",
  title = "Лучший подарок — вы на Кубе",
  lede = "Честно: вы уже потратились на билет. Если всё-таки хочется — мы копим на следующий рейс. Куда — пока не решили, поэтому на билете вопрос.",
  fundTitle = "На следующий рейс",
  fundText = "Перевод по номеру телефона. В комментарии — ваше имя и, если хотите, куда нам лететь.",
  from = "HAV",
  to = "???",
  toCity = "решим вместе",
  requisite = "+7 900 000-00-00",
  requisiteLabel = "СБП · Тимур К.",
  copyLabel = "Скопировать номер",
  copiedLabel = "Скопировано",
  joke = "Или привезите бутылку рома — у нас на Кубе его нет. Шутка. Есть.",
  fromCity = "Гавана",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta022Props) {
  const [copied, setCopied] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-cta-022-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-022-fg": ink } : null),
    ...(background ? { "--vibeui-cta-022-bg": background } : null),
    ...style,
  } as CSSProperties
  const [head, tail] = title.split(" — ")


  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-022" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
            <div data-part="ticket" data-copied={copied ? "true" : undefined}>
              <div data-part="codes">
                <div>
                  <b>{from}</b>
                  <small>{fromCity}</small>
                </div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                </svg>
                <div>
                  <b>{to}</b>
                  <small>{toCity}</small>
                </div>
              </div>
              <div data-part="body">
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
                  hold={2200}
                  onCopy={() => setCopied(true)}
                  onReset={() => setCopied(false)}
                />
              </div>
              <span data-part="paid" aria-hidden="true">
                Paid
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
