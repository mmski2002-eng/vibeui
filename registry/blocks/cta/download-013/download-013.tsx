import type { CSSProperties } from "react"
import { Button123 } from "@/registry/components/button/button-123/button-123"

export type Download013Badge = {
  /** Верхняя строка: «Скачать в». */
  top: string
  /** Название магазина: «App Store». */
  store: string
  href: string
}

export type Download013Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Строка, из которой детерминированно рисуется узор QR. */
  qrSeed?: string
  qrCaption?: string
  badges?: readonly Download013Badge[]
  rating?: string
  ratingNote?: string
  phoneBrand?: string
  phoneBalance?: string
  phoneCaption?: string
  /** aria QR и строки на макете телефона. */
  qrLabel?: string
  phoneRows?: readonly [readonly [string, string], readonly [string, string], readonly [string, string]]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Секция «приложение»: слева текст и три бейджа магазинов (текстовые,
// без чужих логотипов), в центре QR-код, нарисованный SVG из строки-сида
// (искатели по углам, синхродорожки, псевдослучайные модули — декоративный
// узор, не сканируется) со сканирующей линией, справа телефон из CSS с
// мини-экраном баланса. Ничего не грузится: ни картинок, ни JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="download-013"]){
--vibeui-download-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-download-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-download-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-download-013-on-accent:oklch(from var(--vibeui-download-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-download-013-mint:color-mix(in oklab,var(--vibeui-download-013-accent) 45%,#99f6e4);
--vibeui-download-013-muted:color-mix(in oklab,var(--vibeui-download-013-fg) 62%,var(--vibeui-download-013-bg));
--vibeui-download-013-line:color-mix(in oklab,var(--vibeui-download-013-fg) 11%,transparent);
--vibeui-download-013-glass:color-mix(in oklab,var(--vibeui-download-013-fg) 5%,transparent);
--vibeui-download-013-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-download-013-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-download-013-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-013"]{color-scheme:dark}
:where([data-vibeui-block="download-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="download-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="download-013"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-download-013-bg);color:var(--vibeui-download-013-fg);font-family:var(--vibeui-download-013-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="download-013"] *{box-sizing:border-box}
[data-vibeui-block="download-013"] [data-part="glow"]{position:absolute;right:-10%;bottom:-30%;width:40rem;height:40rem;border-radius:50%;background:radial-gradient(closest-side,var(--vibeui-download-013-accent),transparent);opacity:.14;filter:blur(70px);pointer-events:none}
[data-vibeui-block="download-013"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="download-013"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-download-013-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-download-013-accent)}
[data-vibeui-block="download-013"] [data-part="title"]{margin:0;font-family:var(--vibeui-download-013-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="download-013"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-download-013-muted)}
[data-vibeui-block="download-013"] [data-part="badges"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="download-013"] [data-part="rating"]{display:flex;align-items:center;gap:.6rem;margin:1.4rem 0 0;font-size:.85rem;color:var(--vibeui-download-013-muted)}
[data-vibeui-block="download-013"] [data-part="rating"] strong{font-family:var(--vibeui-download-013-mono);font-size:1.1rem;color:var(--vibeui-download-013-fg)}
[data-vibeui-block="download-013"] [data-part="rating"] svg{width:.9rem;height:.9rem;color:var(--vibeui-download-013-accent)}
[data-vibeui-block="download-013"] [data-part="qr"]{position:relative;justify-self:center;display:grid;gap:.8rem;justify-items:center;padding:1.2rem;border-radius:1.5rem;background:color-mix(in oklab,var(--vibeui-download-013-bg) 55%,transparent);border:1px solid color-mix(in oklab,var(--vibeui-download-013-fg) 16%,transparent);backdrop-filter:blur(20px);box-shadow:0 1px 0 rgb(255 255 255 / .12) inset,0 30px 60px -30px rgb(0 0 0 / .7)}
[data-vibeui-block="download-013"] [data-part="code"]{position:relative;width:11rem;height:11rem;padding:.6rem;border-radius:.9rem;background:#fff;overflow:hidden}
[data-vibeui-block="download-013"] [data-part="code"] svg{display:block;width:100%;height:100%;fill:#0b0f24}
[data-vibeui-block="download-013"] [data-part="code"]::after{content:"";position:absolute;left:0;right:0;top:0;height:2.5rem;background:linear-gradient(transparent,color-mix(in oklab,var(--vibeui-download-013-accent) 55%,transparent) 70%,var(--vibeui-download-013-accent));animation:vibeui-download-013-scan 2.8s cubic-bezier(.4,0,.2,1) infinite}
[data-vibeui-block="download-013"] [data-part="qr"] p{margin:0;font-family:var(--vibeui-download-013-mono);font-size:.72rem;color:var(--vibeui-download-013-muted);text-align:center;max-width:12rem}
[data-vibeui-block="download-013"] [data-part="phone"]{position:relative;justify-self:center;width:12.5rem;aspect-ratio:9/18;padding:.55rem;border-radius:2.2rem;background:linear-gradient(160deg,#20264a,#0a0e24);border:1px solid rgb(255 255 255 / .2);box-shadow:0 40px 80px -30px rgb(0 0 0 / .9),0 0 0 1px rgb(0 0 0 / .6);animation:vibeui-download-013-hover 8s ease-in-out infinite}
[data-vibeui-block="download-013"] [data-part="phone"]::before{content:"";position:absolute;left:50%;top:.9rem;width:3.4rem;height:.9rem;margin-left:-1.7rem;border-radius:999px;background:#05071a;z-index:2}
[data-vibeui-block="download-013"] [data-part="screen"]{position:relative;height:100%;border-radius:1.7rem;padding:2.3rem .9rem 1rem;background:linear-gradient(180deg,#0b1030,#060818);color:#f4f7ff;display:grid;align-content:start;gap:.7rem;overflow:hidden}
[data-vibeui-block="download-013"] [data-part="screen"]::before{content:"";position:absolute;inset:-40% -30% auto;height:70%;background:radial-gradient(closest-side,var(--vibeui-download-013-accent),transparent);opacity:.35;filter:blur(30px)}
[data-vibeui-block="download-013"] [data-part="screen"] > *{position:relative}
[data-vibeui-block="download-013"] [data-part="screen"] header{display:flex;justify-content:space-between;font-family:var(--vibeui-download-013-display);font-weight:700;font-size:.8rem}
[data-vibeui-block="download-013"] [data-part="screen"] header i{width:1.4rem;height:1.4rem;border-radius:50%;background:linear-gradient(135deg,var(--vibeui-download-013-accent),var(--vibeui-download-013-mint))}
[data-vibeui-block="download-013"] [data-part="screen"] small{display:block;font-size:.55rem;opacity:.6}
[data-vibeui-block="download-013"] [data-part="screen"] strong{display:block;font-family:var(--vibeui-download-013-mono);font-weight:600;font-size:1.1rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="download-013"] [data-part="bars"]{display:flex;align-items:flex-end;gap:.25rem;height:2.6rem;margin:.2rem 0 0}
[data-vibeui-block="download-013"] [data-part="bars"] i{flex:1;border-radius:.2rem .2rem 0 0;background:color-mix(in oklab,var(--vibeui-download-013-accent) 40%,transparent);transform-origin:bottom;animation:vibeui-download-013-bar 3s ease-in-out infinite;animation-delay:calc(var(--vibeui-download-013-i) * .15s)}
[data-vibeui-block="download-013"] [data-part="bars"] i:last-child{background:var(--vibeui-download-013-accent)}
[data-vibeui-block="download-013"] [data-part="row"]{display:flex;justify-content:space-between;gap:.5rem;padding:.5rem .6rem;border-radius:.6rem;background:rgb(255 255 255 / .06);font-size:.6rem}
[data-vibeui-block="download-013"] [data-part="row"] b{font-family:var(--vibeui-download-013-mono);font-weight:500;white-space:nowrap}
[data-vibeui-block="download-013"] [data-part="row"][data-plus="true"] b{color:var(--vibeui-download-013-accent)}
@keyframes vibeui-download-013-scan{0%{transform:translateY(-2.5rem);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translateY(11rem);opacity:0}}
@keyframes vibeui-download-013-hover{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
@keyframes vibeui-download-013-bar{0%,100%{transform:scaleY(.6)}50%{transform:scaleY(1)}}
@container (min-width: 44rem){[data-vibeui-block="download-013"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) auto;column-gap:3rem}[data-vibeui-block="download-013"] [data-part="copy"]{grid-row:span 2}}
@container (min-width: 64rem){[data-vibeui-block="download-013"] [data-part="shell"]{grid-template-columns:minmax(0,1.2fr) auto auto;gap:3rem}[data-vibeui-block="download-013"] [data-part="copy"]{grid-row:auto}[data-vibeui-block="download-013"] [data-part="phone"]{width:14rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-013"] *{animation:none!important;transition:none!important}[data-vibeui-block="download-013"] [data-part="code"]::after{display:none}}`

const SIZE = 25

function hash(seed: string) {
  let value = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function isFinder(x: number, y: number) {
  const inCorner = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7
  return inCorner(0, 0) || inCorner(SIZE - 7, 0) || inCorner(0, SIZE - 7)
}

function finderDark(x: number, y: number) {
  const local = (cx: number, cy: number) => {
    const dx = x - cx
    const dy = y - cy
    const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3))
    return ring === 3 || ring <= 1
  }
  if (x < 7 && y < 7) return local(0, 0)
  if (x >= SIZE - 7 && y < 7) return local(SIZE - 7, 0)
  return local(0, SIZE - 7)
}

function isSeparator(x: number, y: number) {
  return (x === 7 && (y < 8 || y >= SIZE - 8)) || (y === 7 && (x < 8 || x >= SIZE - 8)) || (x === SIZE - 8 && y < 8) || (y === SIZE - 8 && x < 8)
}

function qrPath(seed: string) {
  let state = hash(seed) || 1
  const next = () => {
    state ^= state << 13
    state >>>= 0
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state / 4294967296
  }
  let path = ""
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      let dark: boolean
      if (isFinder(x, y)) dark = finderDark(x, y)
      else if (isSeparator(x, y)) dark = false
      else if (y === 6) dark = x % 2 === 0
      else if (x === 6) dark = y % 2 === 0
      else dark = next() < 0.48
      if (dark) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return path
}

/** Приложение: QR из SVG, бейджи магазинов и телефон из CSS. */
export function Download013({
  eyebrow = "Приложение",
  title = "Банк, который помещается в карман, а не в отделение",
  lede = "Счёт, платежи, карты сотрудников и налоги — в одном приложении. Наведите камеру на код или откройте магазин.",
  qrSeed = "https://os.example/app",
  qrCaption = "наведите камеру — откроется ваш магазин",
  badges = [
    { top: "Скачать в", store: "App Store", href: "#appstore" },
    { top: "Доступно в", store: "Google Play", href: "#googleplay" },
    { top: "Скачать из", store: "RuStore", href: "#rustore" },
  ],
  rating = "4,9",
  ratingNote = "средняя оценка в трёх магазинах",
  phoneBrand = "Ось",
  phoneBalance = "1 284 650 ₽",
  phoneCaption = "Основной счёт",
  qrLabel = "QR-код для скачивания приложения",
  phoneRows = [["Ozon · выплата", "+184 300 ₽"], ["Аренда", "−62 000 ₽"], ["УСН 6 % · аванс", "−41 760 ₽"]],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Download013Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-013-accent": accent } : null),
    ...(ink ? { "--vibeui-download-013-fg": ink } : null),
    ...(background ? { "--vibeui-download-013-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-download-013" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="download-013" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <i data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {badges.length > 0 ? (
              <ul data-part="badges">
                {badges.map((badge) => (
                  <li key={badge.store}>
                    <Button123 data-part="badge" href={badge.href} top={badge.top} store={badge.store} accent={accent} />
                  </li>
                ))}
              </ul>
            ) : null}
            {rating ? (
              <p data-part="rating">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.5l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.5 6 20.8l1.3-6.7-5-4.6 6.8-.8z" />
                </svg>
                <strong>{rating}</strong>
                <span>{ratingNote}</span>
              </p>
            ) : null}
          </div>
          <div data-part="qr">
            <div data-part="code" aria-label={qrLabel} role="img">
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} shapeRendering="crispEdges" aria-hidden="true">
                <path d={qrPath(qrSeed)} />
              </svg>
            </div>
            {qrCaption ? <p>{qrCaption}</p> : null}
          </div>
          <div data-part="phone" aria-hidden="true">
            <div data-part="screen">
              <header>
                <span>{phoneBrand}</span>
                <i />
              </header>
              <div>
                <small>{phoneCaption}</small>
                <strong>{phoneBalance}</strong>
              </div>
              <div data-part="bars">
                {[0.5, 0.7, 0.55, 0.85, 0.65, 0.95, 1].map((height, index) => (
                  <i key={index} style={{ height: `${height * 100}%`, ["--vibeui-download-013-i" as string]: index }} />
                ))}
              </div>
              <div data-part="row" data-plus="true">
                <span>{phoneRows[0][0]}</span>
                <b>{phoneRows[0][1]}</b>
              </div>
              <div data-part="row">
                <span>{phoneRows[1][0]}</span>
                <b>{phoneRows[1][1]}</b>
              </div>
              <div data-part="row">
                <span>{phoneRows[2][0]}</span>
                <b>{phoneRows[2][1]}</b>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
