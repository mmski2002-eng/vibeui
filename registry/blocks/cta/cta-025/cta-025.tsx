import type { CSSProperties } from "react"

export type Cta025Props = {
  title?: string
  text?: string
  appStoreLabel?: string
  appStoreHref?: string
  playLabel?: string
  playHref?: string
  /** Подпись под QR: «наведите камеру — установится». */
  qrNote?: string
  /** Строка-затравка для узора QR: любые символы, из хеша рисуется сетка. */
  seed?: string
  image?: string
  /** Подписи над названиями магазинов и aria QR-кода. */
  appStoreCaption?: string
  playCaption?: string
  qrLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Скачать»: карточка на фото с затемнением и плывущими пятнами, слева
// заголовок (въезжает пословно через маски) и бейджи магазинов, справа QR-код,
// нарисованный CSS-сеткой 21×21 из детерминированного хеша строки seed (три
// угловых маркера настоящие, остальное — узор). По коду ходит луч сканера,
// вокруг пульсирует рамка-видоискатель, при наведении код наклоняется в 3D.
// Появление — на scroll-driven `animation-timeline: view()` с фолбэком.
// Код декоративный: для боевого сайта замените на картинку из генератора.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"

// Каскад слов заголовка для scroll-driven таймлайна: задержки там не
// работают, поэтому каждому n-му слову сдвигаем диапазон.
const STAGGER = Array.from({ length: 14 }, (_, i) => `[data-vibeui-block="cta-025"] [data-part="w"]:nth-child(${i + 1}) span{animation-range:entry ${20 + i * 3}% entry ${80 + i * 3}%}`).join("\n")

const STYLES = `
:where([data-vibeui-block="cta-025"]){
--vibeui-cta-025-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-025-on-accent:oklch(from var(--vibeui-cta-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-025-muted:color-mix(in oklab,var(--vibeui-cta-025-fg) 60%,var(--vibeui-cta-025-bg));
--vibeui-cta-025-line:color-mix(in oklab,var(--vibeui-cta-025-fg) 12%,transparent);
--vibeui-cta-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-025"]{color-scheme:dark}
:where([data-vibeui-block="cta-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-025"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-cta-025-bg);color:var(--vibeui-cta-025-fg);font-family:var(--vibeui-cta-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-025"] *{box-sizing:border-box}
[data-vibeui-block="cta-025"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-025"] [data-part="card"]{position:relative;overflow:clip;display:grid;gap:2rem;align-items:center;padding:2.5rem 1.5rem;border-radius:2rem;background:#151428;color:#f4f2fb;box-shadow:0 40px 80px -40px rgb(0 0 0 / .7),0 60px 120px -50px color-mix(in oklab,var(--vibeui-cta-025-accent) 60%,transparent)}
[data-vibeui-block="cta-025"] [data-part="mesh"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="cta-025"] [data-part="mesh"] i{position:absolute;border-radius:50%;filter:blur(40px);opacity:.6;animation:vibeui-cta-025-float 18s ease-in-out infinite alternate}
[data-vibeui-block="cta-025"] [data-part="mesh"] i:nth-child(1){left:-10%;top:-40%;width:50%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-cta-025-accent) 45%,transparent),transparent 65%)}
[data-vibeui-block="cta-025"] [data-part="mesh"] i:nth-child(2){right:10%;bottom:-50%;width:45%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-cta-025-accent) 25%,#ff9ad5),transparent 65%);animation-delay:-8s}
[data-vibeui-block="cta-025"] [data-part="mesh"]::after{content:"";position:absolute;inset:0;opacity:.08;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px}
[data-vibeui-block="cta-025"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}
[data-vibeui-block="cta-025"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(100deg,#151428 30%,rgb(21 20 40 / .5))}
[data-vibeui-block="cta-025"] [data-part="copy"]{position:relative}
[data-vibeui-block="cta-025"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1.02;letter-spacing:-.035em}
[data-vibeui-block="cta-025"] [data-part="w"]{display:inline-block;overflow:clip;vertical-align:bottom;padding:.06em .04em .12em 0;margin:-.06em 0 -.12em}
[data-vibeui-block="cta-025"] [data-part="w"] span{display:inline-block}
[data-vibeui-block="cta-025"] [data-part="text"]{margin:.8rem 0 0;max-width:28rem;opacity:.8}
[data-vibeui-block="cta-025"] [data-part="stores"]{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.6rem}
[data-vibeui-block="cta-025"] [data-part="store"]{display:inline-flex;flex-direction:column;padding:.65rem 1.25rem .7rem;border-radius:1rem;background:#f4f2fb;color:#151428;text-decoration:none;line-height:1.1;transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,color .25s,box-shadow .35s}
[data-vibeui-block="cta-025"] [data-part="store"]:hover{transform:translateY(-3px) scale(1.03);background:var(--vibeui-cta-025-accent);color:var(--vibeui-cta-025-on-accent);box-shadow:0 18px 40px -16px var(--vibeui-cta-025-accent)}
[data-vibeui-block="cta-025"] [data-part="store"] small{font-size:.62rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="cta-025"] [data-part="store"] b{font-size:1rem;font-weight:700}
[data-vibeui-block="cta-025"] [data-part="qr"]{position:relative;justify-self:center;display:grid;justify-items:center;gap:1rem;perspective:900px}
[data-vibeui-block="cta-025"] [data-part="frame"]{position:relative;isolation:isolate;padding:.6rem;border-radius:1.4rem;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="cta-025"] [data-part="frame"]::before{content:"";position:absolute;inset:0;border-radius:inherit;border:2px solid var(--vibeui-cta-025-accent);opacity:.7;animation:vibeui-cta-025-pulse 2.6s ease-in-out infinite}
[data-vibeui-block="cta-025"] [data-part="frame"]::after{content:"";position:absolute;inset:-.5rem;border-radius:1.8rem;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-cta-025-accent) 40%,transparent),transparent 70%);filter:blur(14px);z-index:-1;opacity:.7}
[data-vibeui-block="cta-025"] [data-part="qr"]:hover [data-part="frame"]{transform:rotateX(8deg) rotateY(-10deg)}
[data-vibeui-block="cta-025"] [data-part="grid"]{position:relative;display:grid;grid-template-columns:repeat(21,1fr);gap:1px;width:11rem;aspect-ratio:1;padding:.7rem;border-radius:1rem;background:#fff;overflow:hidden}
[data-vibeui-block="cta-025"] [data-part="beam"]{position:absolute;left:0;right:0;top:0;height:2.4rem;background:linear-gradient(to bottom,transparent,color-mix(in oklab,var(--vibeui-cta-025-accent) 45%,transparent) 70%,var(--vibeui-cta-025-accent));animation:vibeui-cta-025-scan 2.6s cubic-bezier(.45,0,.55,1) infinite alternate;pointer-events:none;mix-blend-mode:multiply}
[data-vibeui-block="cta-025"] [data-part="beam"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--vibeui-cta-025-accent);box-shadow:0 0 10px 2px var(--vibeui-cta-025-accent)}
[data-vibeui-block="cta-025"] [data-part="grid"] i{display:block;background:transparent;border-radius:1px}
[data-vibeui-block="cta-025"] [data-part="grid"] i[data-on="true"]{background:#151428}
[data-vibeui-block="cta-025"] [data-part="qr"] small{font-size:.8rem;opacity:.75;text-align:center;max-width:12rem;animation:vibeui-cta-025-blink 2.6s ease-in-out infinite}
[data-vibeui-block="cta-025"] a:focus-visible{outline:2px solid var(--vibeui-cta-025-accent);outline-offset:3px}
@container (min-width: 56rem){[data-vibeui-block="cta-025"] [data-part="card"]{grid-template-columns:minmax(0,1fr) auto;gap:4rem;padding:3.5rem 3.5rem}}
@keyframes vibeui-cta-025-scan{from{transform:translateY(-2.4rem)}to{transform:translateY(11rem)}}
@keyframes vibeui-cta-025-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.9;transform:scale(1.03)}}
@keyframes vibeui-cta-025-blink{0%,100%{opacity:.5}50%{opacity:.9}}
@keyframes vibeui-cta-025-float{from{transform:translate(0,0)}to{transform:translate(10%,14%)}}
@keyframes vibeui-cta-025-rise{from{transform:translateY(112%)}to{transform:none}}
@keyframes vibeui-cta-025-in{from{opacity:0;translate:0 2rem;scale:.97}to{opacity:1;translate:0 0;scale:1}}
@supports (animation-timeline: view()){
[data-vibeui-block="cta-025"] [data-part="card"]{view-timeline:--vibeui-cta-025-card block;animation:vibeui-cta-025-in cubic-bezier(.2,.8,.2,1) both;animation-timeline:--vibeui-cta-025-card;animation-range:entry 0% entry 60%}
[data-vibeui-block="cta-025"] [data-part="w"] span{animation:vibeui-cta-025-rise cubic-bezier(.2,.8,.2,1) both;animation-timeline:--vibeui-cta-025-card;animation-range:entry 20% entry 80%}
${STAGGER}
}
[data-vibeui-block="cta-025"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-025"] *{animation:none!important;transition:none!important}}`

function cells(seed: string) {
  let h = 2166136261
  for (const char of seed) h = Math.imul(h ^ char.charCodeAt(0), 16777619) >>> 0
  const size = 21
  const out: boolean[] = []
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7
    const ring = (ox: number, oy: number) => {
      const dx = x - ox
      const dy = y - oy
      return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
    }
    if (inBox(0, 0)) return ring(0, 0)
    if (inBox(size - 7, 0)) return ring(size - 7, 0)
    if (inBox(0, size - 7)) return ring(0, size - 7)
    return null
  }
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const f = finder(x, y)
      if (f !== null) {
        out.push(f)
        continue
      }
      h = (Math.imul(h, 1103515245) + 12345) >>> 0
      out.push(((h >>> 16) & 1) === 1)
    }
  }
  return out
}

function Words({ text }: { text: string }) {
  return text.split(/\s+/).map((word, index) => (
    <span data-part="w" key={index} style={{ ["--vibeui-cta-025-i" as string]: index }}>
      <span>{word}</span>
    </span>
  ))
}

/** Призыв скачать с бейджами магазинов и «сканируемым» QR из CSS. */
export function Cta025({
  title = "Сегодня вечером — первая практика",
  text = "Установите за минуту, включите дыхание перед сном. Утром расскажете, как спали.",
  appStoreLabel = "App Store",
  appStoreHref = "#",
  playLabel = "Google Play",
  playHref = "#",
  qrNote = "наведите камеру — откроется магазин",
  seed = "tishe.app",
  image = "",
  appStoreCaption = "Скачать в",
  playCaption = "Доступно в",
  qrLabel = "QR-код для скачивания",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta025Props) {
  const grid = cells(seed)
  const palette = {
    ...(accent ? { "--vibeui-cta-025-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-025-fg": ink } : null),
    ...(background ? { "--vibeui-cta-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-025" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="card">
            {image ? <img data-part="photo" src={image} alt="" /> : null}
            <div data-part="shade" aria-hidden="true" />
            <div data-part="mesh" aria-hidden="true">
              <i />
              <i />
            </div>
            <div data-part="copy">
              <h2 data-part="title">
                <Words text={title} />
              </h2>
              {text ? <p data-part="text">{text}</p> : null}
              <div data-part="stores">
                {appStoreLabel ? (
                  <a data-part="store" href={appStoreHref}>
                    <small>{appStoreCaption}</small>
                    <b>{appStoreLabel}</b>
                  </a>
                ) : null}
                {playLabel ? (
                  <a data-part="store" href={playHref}>
                    <small>{playCaption}</small>
                    <b>{playLabel}</b>
                  </a>
                ) : null}
              </div>
            </div>
            <div data-part="qr">
              <div data-part="frame">
                <div data-part="grid" role="img" aria-label={qrLabel}>
                  {grid.map((on, i) => (
                    <i key={i} data-on={on} />
                  ))}
                  <span data-part="beam" aria-hidden="true" />
                </div>
              </div>
              {qrNote ? <small>{qrNote}</small> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
