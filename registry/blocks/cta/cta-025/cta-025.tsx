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
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Скачать»: карточка на фото с затемнением, слева заголовок и бейджи
// магазинов, справа QR-код, нарисованный CSS-сеткой 21×21 из детерминированного
// хеша строки seed (три угловых маркера настоящие, остальное — узор), с
// подписью «наведите камеру». Код декоративный: для боевого сайта замените
// на картинку из генератора.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"

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
[data-vibeui-block="cta-025"] [data-part="card"]{position:relative;overflow:hidden;display:grid;gap:2rem;align-items:center;padding:2.5rem 1.5rem;border-radius:1.8rem;background:#151428;color:#f4f2fb;box-shadow:0 40px 80px -40px rgb(0 0 0 / .7)}
[data-vibeui-block="cta-025"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}
[data-vibeui-block="cta-025"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(100deg,#151428 30%,rgb(21 20 40 / .5))}
[data-vibeui-block="cta-025"] [data-part="copy"]{position:relative}
[data-vibeui-block="cta-025"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(1.8rem,4.6cqi,3.2rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="cta-025"] [data-part="text"]{margin:.8rem 0 0;max-width:28rem;opacity:.8}
[data-vibeui-block="cta-025"] [data-part="stores"]{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.6rem}
[data-vibeui-block="cta-025"] [data-part="store"]{display:inline-flex;flex-direction:column;padding:.55rem 1.1rem .6rem;border-radius:.9rem;background:#f4f2fb;color:#151428;text-decoration:none;line-height:1.1;transition:transform .18s,background .2s,color .2s}
[data-vibeui-block="cta-025"] [data-part="store"]:hover{transform:translateY(-2px);background:var(--vibeui-cta-025-accent);color:var(--vibeui-cta-025-on-accent)}
[data-vibeui-block="cta-025"] [data-part="store"] small{font-size:.62rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="cta-025"] [data-part="store"] b{font-size:1rem;font-weight:700}
[data-vibeui-block="cta-025"] [data-part="qr"]{position:relative;justify-self:center;display:grid;justify-items:center;gap:.8rem}
[data-vibeui-block="cta-025"] [data-part="grid"]{display:grid;grid-template-columns:repeat(21,1fr);gap:1px;width:11rem;aspect-ratio:1;padding:.7rem;border-radius:1rem;background:#fff}
[data-vibeui-block="cta-025"] [data-part="grid"] i{display:block;background:transparent;border-radius:1px}
[data-vibeui-block="cta-025"] [data-part="grid"] i[data-on="true"]{background:#151428}
[data-vibeui-block="cta-025"] [data-part="qr"] small{font-size:.8rem;opacity:.75;text-align:center;max-width:12rem}
[data-vibeui-block="cta-025"] a:focus-visible{outline:2px solid var(--vibeui-cta-025-accent);outline-offset:3px}
@container (min-width: 56rem){[data-vibeui-block="cta-025"] [data-part="card"]{grid-template-columns:minmax(0,1fr) auto;gap:4rem;padding:3.5rem 3.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-025"] *{transition:none!important}}`

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

/** Призыв скачать с бейджами магазинов и декоративным QR из CSS. */
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
            <div data-part="copy">
              <h2 data-part="title">{title}</h2>
              {text ? <p data-part="text">{text}</p> : null}
              <div data-part="stores">
                {appStoreLabel ? (
                  <a data-part="store" href={appStoreHref}>
                    <small>Скачать в</small>
                    <b>{appStoreLabel}</b>
                  </a>
                ) : null}
                {playLabel ? (
                  <a data-part="store" href={playHref}>
                    <small>Доступно в</small>
                    <b>{playLabel}</b>
                  </a>
                ) : null}
              </div>
            </div>
            <div data-part="qr">
              <div data-part="grid" role="img" aria-label="QR-код для скачивания">
                {grid.map((on, i) => (
                  <i key={i} data-on={on} />
                ))}
              </div>
              {qrNote ? <small>{qrNote}</small> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
