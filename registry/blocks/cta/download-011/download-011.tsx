"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Download011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Промокод в чипе с кнопкой копирования. */
  code?: string
  /** Строка под QR: «наведи камеру». */
  qrLabel?: string
  /** Строка, из которой рисуется узор QR (декоративный, не сканируется). */
  qrSeed?: string
  appStoreLabel?: string
  appStoreHref?: string
  googlePlayLabel?: string
  googlePlayHref?: string
  phonePlaceholder?: string
  smsLabel?: string
  doneText?: string
  /** Фото блюда в блобе за QR. Пусто — без фото. */
  image?: string
  imageAlt?: string
  /** Кнопка копирования промокода, aria поля и QR. */
  copyLabel?: string
  copiedLabel?: string
  phoneLabel?: string
  qrAria?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Промо приложения: сливочная карточка на угольном фоне, слева «−20 % на
// первый заказ», промокод с кнопкой «скопировать» (буфер обмена, подпись
// меняется на «скопировано»), кнопки магазинов и поле телефона «пришлём
// ссылку» с галочкой после отправки. Справа QR-стикер, нарисованный
// SVG-модулями из seed-строки (три «глаза» настоящие, узор —
// декоративный), под ним фото в блобе. Форма — заглушка.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="download-011"]){
--vibeui-download-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-download-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-download-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-download-011-on-accent:oklch(from var(--vibeui-download-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-download-011-on-fg:oklch(from var(--vibeui-download-011-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-download-011-muted:color-mix(in oklab,var(--vibeui-download-011-on-fg) 65%,var(--vibeui-download-011-fg));
--vibeui-download-011-line:color-mix(in oklab,var(--vibeui-download-011-on-fg) 16%,transparent);
--vibeui-download-011-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-download-011-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-011"]{color-scheme:dark}
:where([data-vibeui-block="download-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="download-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="download-011"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-download-011-bg);color:var(--vibeui-download-011-fg);font-family:var(--vibeui-download-011-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="download-011"] *{box-sizing:border-box}
[data-vibeui-block="download-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="download-011"] [data-part="card"]{position:relative;overflow:hidden;display:grid;gap:2.5rem;padding:clamp(1.5rem,5cqi,3.5rem);border-radius:2.4rem;background:var(--vibeui-download-011-fg);color:var(--vibeui-download-011-on-fg)}
[data-vibeui-block="download-011"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-download-011-accent)}
[data-vibeui-block="download-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-download-011-display);font-weight:900;font-size:clamp(1.9rem,4.6cqi,3.4rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="download-011"] [data-part="title"] em{font-style:normal;color:var(--vibeui-download-011-accent)}
[data-vibeui-block="download-011"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-download-011-muted)}
[data-vibeui-block="download-011"] [data-part="code"]{display:inline-flex;align-items:stretch;margin:1.4rem 0 0;border:2px dashed var(--vibeui-download-011-accent);border-radius:1rem;overflow:hidden}
[data-vibeui-block="download-011"] [data-part="code"] code{display:grid;place-items:center;padding:0 1.1rem;font-family:var(--vibeui-download-011-display);font-weight:900;font-size:1.1rem;letter-spacing:.08em}
[data-vibeui-block="download-011"] [data-part="code"] button{display:inline-flex;align-items:center;gap:.4rem;height:2.9rem;padding:0 1rem;border:0;background:var(--vibeui-download-011-accent);color:var(--vibeui-download-011-on-accent);font:inherit;font-weight:700;font-size:.85rem;cursor:pointer;transition:filter .2s}
[data-vibeui-block="download-011"] [data-part="code"] button:hover{filter:brightness(1.08)}
[data-vibeui-block="download-011"] [data-part="code"] button svg{width:1rem;height:1rem}
[data-vibeui-block="download-011"] [data-part="stores"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="download-011"] [data-part="stores"] a{display:inline-flex;align-items:center;gap:.6rem;height:3rem;padding:0 1.1rem 0 .9rem;border-radius:999px;background:var(--vibeui-download-011-on-fg);color:var(--vibeui-download-011-fg);text-decoration:none;font-weight:700;font-size:.9rem;transition:transform .18s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="download-011"] [data-part="stores"] a:hover{transform:translateY(-2px)}
[data-vibeui-block="download-011"] [data-part="stores"] svg{width:1.2rem;height:1.2rem}
[data-vibeui-block="download-011"] [data-part="form"]{display:grid;gap:.6rem;margin:1.4rem 0 0;max-width:26rem}
[data-vibeui-block="download-011"] [data-part="form"] input{width:100%;height:3rem;padding:0 1.1rem;border-radius:999px;border:1px solid var(--vibeui-download-011-line);background:color-mix(in oklab,var(--vibeui-download-011-on-fg) 6%,transparent);color:inherit;font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="download-011"] [data-part="form"] input::placeholder{color:var(--vibeui-download-011-muted)}
[data-vibeui-block="download-011"] [data-part="form"] input:focus-visible{border-color:var(--vibeui-download-011-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-download-011-accent) 25%,transparent)}
[data-vibeui-block="download-011"] [data-part="form"] button{height:3rem;padding:0 1.3rem;border-radius:999px;border:1px solid var(--vibeui-download-011-on-fg);background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s}
[data-vibeui-block="download-011"] [data-part="form"] button:hover{background:var(--vibeui-download-011-on-fg);color:var(--vibeui-download-011-fg)}
[data-vibeui-block="download-011"] [data-part="done"]{display:inline-flex;align-items:center;gap:.6rem;margin:1.4rem 0 0;font-weight:600}
[data-vibeui-block="download-011"] [data-part="done"] svg{width:1.6rem;height:1.6rem;color:var(--vibeui-download-011-accent)}
[data-vibeui-block="download-011"] [data-part="done"] path{stroke-dasharray:30;stroke-dashoffset:30;animation:vibeui-download-011-draw .5s ease-out .1s forwards}
[data-vibeui-block="download-011"] button:focus-visible,[data-vibeui-block="download-011"] a:focus-visible{outline:2px solid var(--vibeui-download-011-accent);outline-offset:2px}
[data-vibeui-block="download-011"] [data-part="side"]{position:relative;display:grid;place-items:center;min-height:18rem}
[data-vibeui-block="download-011"] [data-part="photo"]{position:absolute;left:50%;top:50%;width:min(100%,22rem);aspect-ratio:1;transform:translate(-50%,-50%) rotate(8deg);object-fit:cover;border-radius:58% 42% 50% 50% / 45% 55% 45% 55%;opacity:.9;animation:vibeui-download-011-morph 10s ease-in-out infinite alternate}
[data-vibeui-block="download-011"] [data-part="qr"]{position:relative;display:grid;gap:.6rem;justify-items:center;width:12rem;padding:.9rem .9rem .7rem;border-radius:1rem;background:#fff;color:#111;box-shadow:0 30px 60px -20px rgb(0 0 0 / .6);transform:rotate(-4deg);transition:transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="download-011"] [data-part="qr"]:hover{transform:rotate(0) scale(1.04)}
[data-vibeui-block="download-011"] [data-part="qr"]::before{content:"";position:absolute;left:50%;top:-.6rem;width:4rem;height:1.2rem;transform:translateX(-50%) rotate(2deg);background:color-mix(in oklab,var(--vibeui-download-011-accent) 70%,#fff);opacity:.85;border-radius:.15rem}
[data-vibeui-block="download-011"] [data-part="qr"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="download-011"] [data-part="qr"] span{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#111}
@keyframes vibeui-download-011-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-download-011-morph{to{border-radius:45% 55% 40% 60% / 55% 45% 60% 40%;transform:translate(-50%,-50%) rotate(-4deg)}}
@container (min-width: 56rem){[data-vibeui-block="download-011"] [data-part="card"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:center}[data-vibeui-block="download-011"] [data-part="form"]{grid-template-columns:1fr auto}[data-vibeui-block="download-011"] [data-part="side"]{min-height:24rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-011"] *{animation:none!important;transition:none!important}[data-vibeui-block="download-011"] [data-part="done"] path{stroke-dashoffset:0}}`

const SIZE = 25

function isFinder(x: number, y: number) {
  const corners = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ]
  return corners.some(([cx, cy]) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7)
}

function finderDark(x: number, y: number) {
  const corners = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ]
  for (const [cx, cy] of corners) {
    if (x >= cx && x < cx + 7 && y >= cy && y < cy + 7) {
      const dx = x - cx
      const dy = y - cy
      const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6
      const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
      return ring || core
    }
  }
  return false
}

function modules(seed: string) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  const cells: string[] = []
  let state = hash >>> 0
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (isFinder(x, y) || (x === 7 && y < 8) || (y === 7 && x < 8) || (x === SIZE - 8 && y < 8) || (y === 7 && x > SIZE - 9) || (x === 7 && y > SIZE - 9) || (y === SIZE - 8 && x < 8)) {
        if (finderDark(x, y)) cells.push(`M${x} ${y}h1v1h-1z`)
        continue
      }
      state = (Math.imul(state, 1103515245) + 12345) >>> 0
      if ((state >>> 16) % 100 < 46) cells.push(`M${x} ${y}h1v1h-1z`)
    }
  }
  return cells.join("")
}

/** Промо приложения: промокод, магазины, SMS-ссылка и QR-стикер. */
export function Download011({
  eyebrow = "Приложение",
  title = "−20 % на первый заказ в приложении",
  lede = "Отслеживание курьера, повтор любимого заказа в одно касание и промокоды по пятницам. Ставится за минуту.",
  code = "GORYACHO20",
  qrLabel = "наведи камеру",
  qrSeed = "goryacho-app",
  appStoreLabel = "App Store",
  appStoreHref = "#app-store",
  googlePlayLabel = "Google Play",
  googlePlayHref = "#google-play",
  phonePlaceholder = "+7 900 000-00-00",
  smsLabel = "Прислать ссылку",
  doneText = "Ссылка ушла в SMS",
  image = "/demo/delivery/promo.webp",
  imageAlt = "",
  copyLabel = "Скопировать",
  copiedLabel = "Скопировано",
  phoneLabel = "Телефон",
  qrAria = "QR-код приложения",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Download011Props) {
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // буфер обмена недоступен (http, старый браузер) — просто покажем подпись
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-download-011-accent": accent } : null),
    ...(ink ? { "--vibeui-download-011-fg": ink } : null),
    ...(background ? { "--vibeui-download-011-bg": background } : null),
    ...style,
  } as CSSProperties

  const titleParts = title.split(/(−?\d+\s?%)/)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-download-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="download-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="card">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{titleParts.map((part, index) => (/\d+\s?%/.test(part) ? <em key={index}>{part}</em> : part))}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {code ? (
                <div data-part="code">
                  <code>{code}</code>
                  <button type="button" onClick={copy} aria-live="polite">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {copied ? <path d="M5 12l5 5 9-11" /> : <path d="M9 9h10v10H9zM5 15V5h10" />}
                    </svg>
                    {copied ? copiedLabel : copyLabel}
                  </button>
                </div>
              ) : null}
              <ul data-part="stores">
                <li>
                  <a href={appStoreHref}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8s2.1-1.2 2.9-2.4c.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.9ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4Z" />
                    </svg>
                    {appStoreLabel}
                  </a>
                </li>
                <li>
                  <a href={googlePlayHref}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M4 3.5v17c0 .5.3.8.6.9L13.9 12 4.6 2.6c-.3.1-.6.4-.6.9Zm11.6 6.2L6.4 3.2l7.6 7.6 1.6-1.1Zm3.9 1.1-2.4-1.4-1.9 2.6 1.9 2.6 2.4-1.4c.7-.5.7-1.9 0-2.4ZM6.4 20.8l9.2-6.5-1.6-1.1-7.6 7.6Z" />
                    </svg>
                    {googlePlayLabel}
                  </a>
                </li>
              </ul>
              {done ? (
                <p data-part="done" role="status">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                  {doneText}
                </p>
              ) : (
                <form data-part="form" onSubmit={submit}>
                  <input type="tel" name="phone" required placeholder={phonePlaceholder} aria-label={phoneLabel} autoComplete="tel" />
                  <button type="submit">{smsLabel}</button>
                </form>
              )}
            </div>
            <div data-part="side">
              {image ? <img data-part="photo" src={image} alt={imageAlt} loading="lazy" /> : null}
              <div data-part="qr" aria-label={qrAria}>
                <svg viewBox={`0 0 ${SIZE} ${SIZE}`} shapeRendering="crispEdges" aria-hidden="true">
                  <path d={modules(qrSeed)} fill="currentColor" />
                </svg>
                {qrLabel ? <span>{qrLabel}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
