import type { CSSProperties } from "react"

export type Restaurant002Props = {
  image?: string
  imageAlt?: string
  /** Строка над заголовком: «кухня · бар · терраса». */
  eyebrow?: string
  /** Заголовок по строкам — каждая появляется отдельно. Слово в *звёздочках* — курсивом брусничным свечением. */
  lines?: readonly string[]
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Бегущая строка внизу. Пусто — без неё. */
  ticker?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран ресторана: фото во весь экран с медленным наездом и тёплым
// затемнением, заголовок появляется построчно снизу (clip-path на строку),
// две кнопки, внизу бегущая строка с сезонными анонсами. Серверный: все
// анимации — CSS с задержками, без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="restaurant-002"]){
--vibeui-restaurant-002-bg:#141110;
--vibeui-restaurant-002-fg:#f2ebe0;
--vibeui-restaurant-002-accent:#7d2a3a;
--vibeui-restaurant-002-glow:0 0 24px rgb(125 42 58 / .7),0 0 70px rgb(125 42 58 / .35);
--vibeui-restaurant-002-accent-ink:color-mix(in oklab,var(--vibeui-restaurant-002-accent) 55%,#f2ebe0);
--vibeui-restaurant-002-on-accent:#fff4ee;
--vibeui-restaurant-002-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-restaurant-002-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="restaurant-002"]{box-sizing:border-box;position:relative;display:grid;min-height:100svh;overflow:hidden;background:var(--vibeui-restaurant-002-bg);color:var(--vibeui-restaurant-002-fg);font-family:var(--vibeui-restaurant-002-font);font-size:.9375rem;line-height:1.5;color-scheme:dark}
[data-vibeui-block="restaurant-002"] *{box-sizing:border-box}
[data-vibeui-block="restaurant-002"] [data-part="picture"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:vibeui-restaurant-002-drift 28s ease-in-out infinite alternate;filter:saturate(.9)}
@keyframes vibeui-restaurant-002-drift{from{transform:scale(1.02)}to{transform:scale(1.12)}}
[data-vibeui-block="restaurant-002"] [data-part="shade"]{position:absolute;inset:0;background:radial-gradient(60rem 30rem at 18% 90%,rgb(125 42 58 / .28),transparent 60%),linear-gradient(to top,rgb(20 17 16 / .95) 0%,rgb(20 17 16 / .55) 45%,rgb(20 17 16 / .25) 100%)}
[data-vibeui-block="restaurant-002"] [data-part="shell"]{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;max-width:80rem;width:100%;margin:0 auto;padding:8rem 1.25rem 3rem;min-height:calc(100svh - 3.2rem)}
[data-vibeui-block="restaurant-002"] [data-part="eyebrow"]{margin:0 0 1rem;font-size:.75rem;letter-spacing:.24em;text-transform:uppercase;color:#e8c9a6;font-weight:600;text-shadow:0 1px 10px rgb(0 0 0 / .4);animation:vibeui-restaurant-002-fade .8s .2s both}
[data-vibeui-block="restaurant-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-restaurant-002-display);font-weight:400;font-size:clamp(2.75rem,9cqi,7rem);line-height:.98;letter-spacing:-.02em;text-wrap:balance}
[data-vibeui-block="restaurant-002"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}
[data-vibeui-block="restaurant-002"] [data-part="line"] > span{display:block;transform:translateY(110%);animation:vibeui-restaurant-002-rise 1s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(.3s + var(--vibeui-restaurant-002-n) * .14s)}
[data-vibeui-block="restaurant-002"] [data-part="line"] em{font-style:italic;color:var(--vibeui-restaurant-002-accent-ink);text-shadow:0 0 30px rgb(125 42 58 / .55),0 0 80px rgb(125 42 58 / .3)}
@keyframes vibeui-restaurant-002-rise{to{transform:none}}
@keyframes vibeui-restaurant-002-fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="restaurant-002"] [data-part="lede"]{margin:1.5rem 0 0;max-width:34rem;font-size:1.05rem;color:rgb(242 235 224 / .8);animation:vibeui-restaurant-002-fade .8s .9s both}
[data-vibeui-block="restaurant-002"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem;animation:vibeui-restaurant-002-fade .8s 1.1s both}
[data-vibeui-block="restaurant-002"] [data-part="primary"],[data-vibeui-block="restaurant-002"] [data-part="secondary"]{display:inline-flex;align-items:center;height:3.25rem;padding:0 1.6rem;border-radius:999px;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;transition:transform .2s,background .2s,box-shadow .3s}
[data-vibeui-block="restaurant-002"] [data-part="primary"]{background:var(--vibeui-restaurant-002-accent);color:var(--vibeui-restaurant-002-on-accent)}
[data-vibeui-block="restaurant-002"] [data-part="primary"]{box-shadow:var(--vibeui-restaurant-002-glow)}
[data-vibeui-block="restaurant-002"] [data-part="primary"]:hover{transform:translateY(-2px);filter:brightness(1.08)}
[data-vibeui-block="restaurant-002"] [data-part="secondary"]{border:1px solid rgb(242 235 224 / .4);color:inherit}
[data-vibeui-block="restaurant-002"] [data-part="secondary"]:hover{background:rgb(242 235 224 / .1)}
[data-vibeui-block="restaurant-002"] a:focus-visible{outline:2px solid var(--vibeui-restaurant-002-accent);outline-offset:3px}
[data-vibeui-block="restaurant-002"] [data-part="ticker"]{position:relative;z-index:1;overflow:hidden;border-top:1px solid rgb(242 235 224 / .15);background:rgb(20 17 16 / .6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:.85rem 0;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:rgb(242 235 224 / .75);mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)}
[data-vibeui-block="restaurant-002"] [data-part="track"]{display:flex;gap:3rem;width:max-content;animation:vibeui-restaurant-002-ticker 40s linear infinite}
[data-vibeui-block="restaurant-002"] [data-part="track"] span{display:inline-flex;align-items:center;gap:3rem;white-space:nowrap}
[data-vibeui-block="restaurant-002"] [data-part="track"] span::after{content:"";width:.35rem;height:.35rem;border-radius:50%;background:var(--vibeui-restaurant-002-accent);box-shadow:0 0 10px rgb(125 42 58 / .8)}
@keyframes vibeui-restaurant-002-ticker{to{transform:translateX(-50%)}}
@container (min-width: 56rem){[data-vibeui-block="restaurant-002"] [data-part="shell"]{padding:9rem 2rem 4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="restaurant-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="restaurant-002"] [data-part="line"] > span{transform:none}}`

/** Слово в *звёздочках* → <em>: без innerHTML. */
function emphasize(line: string) {
  return line.split(/(\*[^*]+\*)/).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={index}>{part.slice(1, -1)}</em> : <span key={index}>{part}</span>,
  )
}

/** Первый экран ресторана: фото с наездом, построчный заголовок и бегущая строка. */
export function Restaurant002({
  image = "",
  imageAlt = "",
  eyebrow = "Кухня · бар · терраса",
  lines = ["Север на тарелке,", "тепло за *столом*"],
  lede = "Ладожский сиг, оленина и морошка в получасе от Невского. Открытая кухня, свечи и стол, за который хочется вернуться.",
  primaryLabel = "Забронировать стол",
  primaryHref = "#book",
  secondaryLabel = "Смотреть меню",
  secondaryHref = "#menu",
  ticker = ["Сезонное меню — осень", "Устрицы по средам", "Бранчи в выходные с 11:00", "Джаз по пятницам"],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Restaurant002Props) {
  const palette = {
    ...(accent ? { "--vibeui-restaurant-002-accent": accent } : null),
    ...(background ? { "--vibeui-restaurant-002-bg": background } : null),
    ...style,
  } as CSSProperties
  const tape = [...ticker, ...ticker]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-restaurant-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="restaurant-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {image ? <img data-part="picture" src={image} alt={imageAlt} /> : null}
        <div data-part="shade" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1 data-part="title">
            {lines.map((line, index) => (
              <span key={line} data-part="line" style={{ ["--vibeui-restaurant-002-n" as string]: index }}>
                <span>{emphasize(line)}</span>
              </span>
            ))}
          </h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            {primaryLabel ? (
              <a data-part="primary" href={primaryHref}>
                {primaryLabel}
              </a>
            ) : null}
            {secondaryLabel ? (
              <a data-part="secondary" href={secondaryHref}>
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        </div>
        {ticker.length > 0 ? (
          <div data-part="ticker" aria-hidden="true">
            <div data-part="track">
              {tape.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
