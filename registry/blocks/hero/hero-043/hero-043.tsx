"use client"

import { useState, type CSSProperties } from "react"

export type Hero043Props = {
  eyebrow?: string
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Моно-факты под кнопками: «1 200 лм», «CRI 97». */
  facts?: readonly string[]
  /** Диапазон температуры света, K. */
  minKelvin?: number
  maxKelvin?: number
  defaultKelvin?: number
  /** Яркость по умолчанию, %. */
  defaultBrightness?: number
  /** Рендер лампы спереди (PNG без фона) с горящим диффузором. Пусто — лампа рисуется CSS. */
  image?: string
  imageAlt?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро гаджета: рендер лампы (PNG без фона) на столе, поверх диффузора два
// слоя — цветовой (mix-blend-mode:color) для температуры и затемняющий
// (multiply) для яркости, плюс ореол и отсвет на столе. Два ползунка
// «тёплый ↔ холодный» и «яркость» меняют свет по-настоящему: цвет
// считается через color-mix из двух переменных, яркость — opacity ореола
// и затемнения. Без рендера лампа рисуется CSS. Заголовок проявляется
// вместе со светом: прозрачность привязана к той же переменной.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-043"]){
--vibeui-hero-043-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-hero-043-fg:light-dark(#111111,#f2ede4);
--vibeui-hero-043-accent:light-dark(#111111,#f2ede4);
--vibeui-hero-043-on-accent:oklch(from var(--vibeui-hero-043-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-043-muted:color-mix(in oklab,var(--vibeui-hero-043-fg) 62%,var(--vibeui-hero-043-bg));
--vibeui-hero-043-line:color-mix(in oklab,var(--vibeui-hero-043-fg) 14%,transparent);
--vibeui-hero-043-glass:color-mix(in oklab,var(--vibeui-hero-043-fg) 6%,transparent);
--vibeui-hero-043-warm:#ffb454;
--vibeui-hero-043-cold:#d6e6ff;
--vibeui-hero-043-k:0%;
--vibeui-hero-043-kn:0;
--vibeui-hero-043-b:.9;
--vibeui-hero-043-light:color-mix(in oklab,var(--vibeui-hero-043-warm),var(--vibeui-hero-043-cold) var(--vibeui-hero-043-k));
--vibeui-hero-043-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-043-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-043-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-043"]{color-scheme:dark}
:where([data-vibeui-block="hero-043"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-043"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-043"]{box-sizing:border-box;position:relative;overflow:hidden;padding:7rem 0 4rem;background:var(--vibeui-hero-043-bg);color:var(--vibeui-hero-043-fg);font-family:var(--vibeui-hero-043-font);font-size:1rem;line-height:1.5;isolation:isolate}
[data-vibeui-block="hero-043"]::before{content:"";position:absolute;inset:-20% -10%;z-index:-1;background:radial-gradient(ellipse at 70% 40%,var(--vibeui-hero-043-light) 0%,transparent 45%);opacity:calc(var(--vibeui-hero-043-b) * .22);transition:opacity .3s;pointer-events:none}
[data-vibeui-block="hero-043"] *{box-sizing:border-box}
[data-vibeui-block="hero-043"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-043"] [data-part="mask"]{overflow:hidden}
[data-vibeui-block="hero-043"] [data-part="mask"]>*{animation:vibeui-hero-043-rise .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--vibeui-hero-043-i) * .1s)}
[data-vibeui-block="hero-043"] [data-part="eyebrow"]{margin:0 0 1rem;font-family:var(--vibeui-hero-043-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-hero-043-muted)}
[data-vibeui-block="hero-043"] [data-part="eyebrow"]::before{content:"";display:inline-block;width:.5rem;height:.5rem;margin-right:.6rem;border-radius:50%;background:var(--vibeui-hero-043-light);box-shadow:0 0 10px var(--vibeui-hero-043-light);vertical-align:middle}
[data-vibeui-block="hero-043"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-043-display);font-weight:800;font-size:clamp(2rem,5.6cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance;opacity:calc(.18 + var(--vibeui-hero-043-b) * .82);transition:opacity .3s;text-shadow:0 0 40px color-mix(in oklab,var(--vibeui-hero-043-light) calc(var(--vibeui-hero-043-b) * 45%),transparent)}
[data-vibeui-block="hero-043"] [data-part="lede"]{margin:1.4rem 0 0;max-width:32rem;font-size:1.1rem;color:var(--vibeui-hero-043-muted)}
[data-vibeui-block="hero-043"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-043"] [data-part="primary"],[data-vibeui-block="hero-043"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.4rem;border-radius:999px;font-weight:600;text-decoration:none;transition:transform .18s,box-shadow .25s,background .2s}
[data-vibeui-block="hero-043"] [data-part="primary"]{background:var(--vibeui-hero-043-accent);color:var(--vibeui-hero-043-on-accent)}
[data-vibeui-block="hero-043"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 16px 40px -14px var(--vibeui-hero-043-accent)}
[data-vibeui-block="hero-043"] [data-part="secondary"]{color:var(--vibeui-hero-043-fg);border:1px solid var(--vibeui-hero-043-line)}
[data-vibeui-block="hero-043"] [data-part="secondary"]:hover{background:var(--vibeui-hero-043-glass)}
[data-vibeui-block="hero-043"] a:focus-visible,[data-vibeui-block="hero-043"] input:focus-visible{outline:2px solid var(--vibeui-hero-043-accent);outline-offset:3px}
[data-vibeui-block="hero-043"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.5rem 1.4rem;margin:1.8rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-hero-043-mono);font-size:.74rem;letter-spacing:.04em;color:var(--vibeui-hero-043-muted)}
[data-vibeui-block="hero-043"] [data-part="facts"] li::before{content:"// ";color:var(--vibeui-hero-043-light)}
[data-vibeui-block="hero-043"] [data-part="scene"]{display:grid;gap:1.5rem;justify-items:center}
[data-vibeui-block="hero-043"] [data-part="lamp"]{position:relative;width:15rem;height:24rem;animation:vibeui-hero-043-in 1.2s cubic-bezier(.2,.7,.2,1) both}
[data-vibeui-block="hero-043"] [data-part="halo"]{position:absolute;left:50%;top:7rem;width:36rem;height:36rem;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,var(--vibeui-hero-043-light) 0%,color-mix(in oklab,var(--vibeui-hero-043-light) 35%,transparent) 20%,transparent 58%);opacity:calc(var(--vibeui-hero-043-b) * .8);transition:opacity .3s;pointer-events:none}
[data-vibeui-block="hero-043"] [data-part="cast"]{position:absolute;left:50%;bottom:-.6rem;width:26rem;height:6rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,color-mix(in oklab,var(--vibeui-hero-043-light) 45%,transparent),transparent 70%);opacity:var(--vibeui-hero-043-b);transition:opacity .3s}
[data-vibeui-block="hero-043"] [data-part="foot"]{position:absolute;left:50%;bottom:.9rem;width:14rem;height:3rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgb(0 0 0/.65),transparent 70%)}
[data-vibeui-block="hero-043"] [data-part="body"]{position:absolute;left:50%;bottom:2rem;width:11rem;height:14rem;transform:translateX(-50%);border-radius:1.6rem 1.6rem 2.8rem 2.8rem/1.6rem 1.6rem 2.2rem 2.2rem;background:linear-gradient(90deg,#141414 0%,#3b3b3b 26%,#4c4c4c 40%,#2a2a2a 74%,#0d0d0d 100%);box-shadow:inset 0 -22px 34px rgb(0 0 0/.55),inset 0 10px 24px color-mix(in oklab,var(--vibeui-hero-043-light) calc(var(--vibeui-hero-043-b) * 30%),transparent),0 34px 60px -24px rgb(0 0 0/.9)}
[data-vibeui-block="hero-043"] [data-part="dome"]{position:absolute;left:50%;top:6.2rem;width:11rem;height:3.6rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#ffffff 0%,var(--vibeui-hero-043-light) 42%,color-mix(in oklab,var(--vibeui-hero-043-light) 60%,#000) 100%);box-shadow:0 0 calc(var(--vibeui-hero-043-b) * 50px) color-mix(in oklab,var(--vibeui-hero-043-light) calc(var(--vibeui-hero-043-b) * 90%),transparent),0 0 calc(var(--vibeui-hero-043-b) * 140px) color-mix(in oklab,var(--vibeui-hero-043-light) calc(var(--vibeui-hero-043-b) * 55%),transparent);filter:brightness(calc(.3 + var(--vibeui-hero-043-b) * .8));transition:filter .3s,box-shadow .3s}
[data-vibeui-block="hero-043"] [data-part="dial"]{position:absolute;left:50%;top:14.6rem;width:2.6rem;height:2.6rem;margin-left:-1.3rem;border-radius:50%;background:radial-gradient(circle at 40% 35%,#3a3a3a,#0f0f0f);box-shadow:inset 0 0 0 2px #4a4a4a,0 2px 6px rgb(0 0 0/.6);transform:rotate(calc(-130deg + var(--vibeui-hero-043-kn) * 260deg));transition:transform .25s}
[data-vibeui-block="hero-043"] [data-part="dial"]::after{content:"";position:absolute;left:50%;top:.3rem;width:2px;height:.7rem;margin-left:-1px;border-radius:2px;background:var(--vibeui-hero-043-light);box-shadow:0 0 6px var(--vibeui-hero-043-light)}
[data-vibeui-block="hero-043"] [data-part="grill"]{position:absolute;left:50%;top:10rem;width:6rem;height:2.2rem;margin-left:-3rem;background:repeating-linear-gradient(90deg,#1a1a1a 0 2px,transparent 2px 6px);opacity:.6;border-radius:.3rem}
[data-vibeui-block="hero-043"] [data-part="panel"]{width:100%;max-width:26rem;display:grid;gap:1rem;padding:1.1rem 1.2rem;border-radius:1.2rem;background:var(--vibeui-hero-043-glass);border:1px solid var(--vibeui-hero-043-line);backdrop-filter:blur(10px);animation:vibeui-hero-043-rise .9s cubic-bezier(.2,.7,.2,1) .5s both}
[data-vibeui-block="hero-043"] [data-part="control"]{display:grid;gap:.5rem}
[data-vibeui-block="hero-043"] [data-part="control"] span{display:flex;justify-content:space-between;font-size:.8rem;color:var(--vibeui-hero-043-muted)}
[data-vibeui-block="hero-043"] [data-part="control"] output{font-family:var(--vibeui-hero-043-mono);font-size:.8rem;color:var(--vibeui-hero-043-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-043"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.45rem;border-radius:999px;background:var(--vibeui-hero-043-track);outline:none;cursor:pointer}
[data-vibeui-block="hero-043"] [data-part="range"][data-kind="kelvin"]{--vibeui-hero-043-track:linear-gradient(90deg,var(--vibeui-hero-043-warm),var(--vibeui-hero-043-cold))}
[data-vibeui-block="hero-043"] [data-part="range"][data-kind="bright"]{--vibeui-hero-043-track:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-hero-043-fg) 15%,transparent),var(--vibeui-hero-043-light))}
[data-vibeui-block="hero-043"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-hero-043-bg);border:3px solid var(--vibeui-hero-043-fg);box-shadow:0 2px 8px rgb(0 0 0/.4);cursor:grab}
[data-vibeui-block="hero-043"] [data-part="range"]::-moz-range-thumb{width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-hero-043-bg);border:3px solid var(--vibeui-hero-043-fg);box-shadow:0 2px 8px rgb(0 0 0/.4);cursor:grab}
@keyframes vibeui-hero-043-rise{from{transform:translateY(110%)}to{transform:none}}
[data-vibeui-block="hero-043"] [data-part="lamp"][data-photo="true"]{width:18rem;height:22.5rem}
[data-vibeui-block="hero-043"] [data-part="render"]{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}
[data-vibeui-block="hero-043"] [data-part="tint"]{position:absolute;left:20%;right:20%;top:7%;height:24%;border-radius:50% 50% 48% 48% / 28% 28% 42% 42%;background:var(--vibeui-hero-043-light);mix-blend-mode:color;opacity:calc(.35 + var(--vibeui-hero-043-kn) * .65);transition:opacity .4s,background .4s;pointer-events:none}
[data-vibeui-block="hero-043"] [data-part="dim"]{position:absolute;left:20%;right:20%;top:7%;height:24%;border-radius:50% 50% 48% 48% / 28% 28% 42% 42%;background:#000;mix-blend-mode:multiply;opacity:calc((1 - var(--vibeui-hero-043-b)) * .85);transition:opacity .4s;pointer-events:none}
[data-vibeui-block="hero-043"] [data-part="lamp"][data-photo="true"] [data-part="halo"]{top:4rem}
@keyframes vibeui-hero-043-in{from{opacity:0;transform:translateY(2rem) scale(.96)}to{opacity:1;transform:none}}
@container (min-width: 60rem){[data-vibeui-block="hero-043"] [data-part="shell"]{grid-template-columns:1.1fr .9fr;gap:3rem}[data-vibeui-block="hero-043"] [data-part="scene"]{order:2}[data-vibeui-block="hero-043"] [data-part="lamp"]{width:18rem;height:28rem}[data-vibeui-block="hero-043"] [data-part="body"]{width:13rem;height:16.5rem}[data-vibeui-block="hero-043"] [data-part="dome"]{width:13rem;height:4.2rem;top:7.4rem}[data-vibeui-block="hero-043"] [data-part="halo"]{top:8rem;width:44rem;height:44rem}[data-vibeui-block="hero-043"] [data-part="dial"]{top:17.4rem}[data-vibeui-block="hero-043"] [data-part="grill"]{top:12rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-043"] *{animation:none!important;transition:none!important}}`

/** Хиро гаджета: CSS-лампа, свет которой меняют ползунки. */
export function Hero043({
  eyebrow = "Луч · умная лампа-будильник · партия 2",
  title = "Просыпайтесь от света, а не от звука",
  lede = "За тридцать минут до будильника Луч разгорается от углей до дневного белого — как настоящий рассвет. Звук птиц включается только если свет не помог.",
  primaryLabel = "Предзаказ — 14 900 ₽",
  primaryHref = "#preorder",
  secondaryLabel = "Смотреть рассвет",
  secondaryHref = "#dawn",
  facts = ["1 200 лм", "CRI 97", "2700–6500 K", "динамик 5 Вт", "датчики CO₂ и света"],
  minKelvin = 2700,
  maxKelvin = 6500,
  defaultKelvin = 2700,
  defaultBrightness = 90,
  image = "/demo/gadget/lamp-front.png",
  imageAlt = "Лампа-будильник Луч",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero043Props) {
  const [kelvin, setKelvin] = useState(defaultKelvin)
  const [brightness, setBrightness] = useState(defaultBrightness)
  const kn = (kelvin - minKelvin) / Math.max(1, maxKelvin - minKelvin)
  const b = brightness / 100

  const palette = {
    ...(accent ? { "--vibeui-hero-043-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-043-fg": ink } : null),
    ...(background ? { "--vibeui-hero-043-bg": background } : null),
    "--vibeui-hero-043-k": `${Math.round(kn * 100)}%`,
    "--vibeui-hero-043-kn": kn,
    "--vibeui-hero-043-b": b,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-043" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-043" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? (
              <div data-part="mask" style={{ ["--vibeui-hero-043-i" as string]: 0 }}>
                <p data-part="eyebrow">{eyebrow}</p>
              </div>
            ) : null}
            <div data-part="mask" style={{ ["--vibeui-hero-043-i" as string]: 1 }}>
              <h1 data-part="title">{title}</h1>
            </div>
            {lede ? (
              <div data-part="mask" style={{ ["--vibeui-hero-043-i" as string]: 2 }}>
                <p data-part="lede">{lede}</p>
              </div>
            ) : null}
            <div data-part="mask" style={{ ["--vibeui-hero-043-i" as string]: 3 }}>
              <div data-part="actions">
                {primaryLabel ? (
                  <a data-part="primary" href={primaryHref}>
                    {primaryLabel}
                  </a>
                ) : null}
                {secondaryLabel ? (
                  <a data-part="secondary" href={secondaryHref}>
                    {secondaryLabel}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </div>
            {facts.length > 0 ? (
              <div data-part="mask" style={{ ["--vibeui-hero-043-i" as string]: 4 }}>
                <ul data-part="facts">
                  {facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div data-part="scene">
            <div data-part="lamp" data-photo={Boolean(image)} aria-hidden="true">
              <i data-part="halo" />
              <i data-part="cast" />
              {image ? (
                <>
                  <img data-part="render" src={image} alt={imageAlt} />
                  <i data-part="tint" />
                  <i data-part="dim" />
                </>
              ) : (
                <>
                  <i data-part="foot" />
                  <i data-part="body" />
                  <i data-part="grill" />
                  <i data-part="dial" />
                  <i data-part="dome" />
                </>
              )}
            </div>
            <div data-part="panel">
              <label data-part="control">
                <span>
                  Температура света
                  <output>{kelvin} K</output>
                </span>
                <input data-part="range" data-kind="kelvin" type="range" min={minKelvin} max={maxKelvin} step={50} value={kelvin} onChange={(event) => setKelvin(Number(event.target.value))} aria-label="Температура света" />
              </label>
              <label data-part="control">
                <span>
                  Яркость
                  <output>{brightness} %</output>
                </span>
                <input data-part="range" data-kind="bright" type="range" min={5} max={100} value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} aria-label="Яркость" />
              </label>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
