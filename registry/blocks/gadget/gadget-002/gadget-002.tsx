"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Gadget002Part = {
  name: string
  text: string
}

export type Gadget002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Пять деталей сверху вниз: диффузор, плата, динамик, корпус, основание. */
  parts?: readonly Gadget002Part[]
  /** Разобрать самостоятельно, когда секция появляется на экране. */
  autoExplode?: boolean
  /** Рендеры: собранная лампа и взрыв-схема (PNG без фона, один ракурс). Заданы оба — вместо CSS-деталей. */
  assembledImage?: string
  explodedImage?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Взрыв-схема гаджета: два рендера (PNG без фона) — собранная лампа и
// разобранная на пять деталей — лежат друг на друге, ползунок «разбор»
// проявляет разобранную через opacity и лёгкий масштаб, а подписи-линии с
// номерами съезжаются к своим деталям (transform по степени разбора). Без
// рендеров детали рисуются CSS и раздвигаются по вертикали. При появлении
// в viewport схема разбирается сама (IntersectionObserver), кнопка
// собирает обратно. Наведение на пункт списка подсвечивает подпись.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="gadget-002"]){
--vibeui-gadget-002-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-gadget-002-fg:light-dark(#111111,#f2ede4);
--vibeui-gadget-002-accent:light-dark(#111111,#f2ede4);
--vibeui-gadget-002-on-accent:oklch(from var(--vibeui-gadget-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-gadget-002-muted:color-mix(in oklab,var(--vibeui-gadget-002-fg) 60%,var(--vibeui-gadget-002-bg));
--vibeui-gadget-002-line:color-mix(in oklab,var(--vibeui-gadget-002-fg) 14%,transparent);
--vibeui-gadget-002-glass:color-mix(in oklab,var(--vibeui-gadget-002-fg) 5%,transparent);
--vibeui-gadget-002-light:#ffb454;
--vibeui-gadget-002-e:0;
--vibeui-gadget-002-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-gadget-002-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-gadget-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gadget-002"]{color-scheme:dark}
:where([data-vibeui-block="gadget-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="gadget-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="gadget-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-gadget-002-bg);color:var(--vibeui-gadget-002-fg);font-family:var(--vibeui-gadget-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="gadget-002"] *{box-sizing:border-box}
[data-vibeui-block="gadget-002"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="gadget-002"] [data-part="head"]{max-width:44rem}
[data-vibeui-block="gadget-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-gadget-002-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-gadget-002-accent)}
[data-vibeui-block="gadget-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-gadget-002-display);font-weight:900;font-size:clamp(2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="gadget-002"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-gadget-002-muted)}
[data-vibeui-block="gadget-002"] [data-part="stage"]{display:grid;gap:2rem}
[data-vibeui-block="gadget-002"] [data-part="scene"]{position:relative;height:37rem;border-radius:1.6rem;background:radial-gradient(ellipse at 50% 70%,color-mix(in oklab,var(--vibeui-gadget-002-light) calc(var(--vibeui-gadget-002-e) * 12%),transparent),transparent 60%),var(--vibeui-gadget-002-glass);border:1px solid var(--vibeui-gadget-002-line);overflow:hidden}
[data-vibeui-block="gadget-002"] [data-part="scene"]::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--vibeui-gadget-002-line) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-gadget-002-line) 1px,transparent 1px);background-size:2rem 2rem;opacity:.5;mask:radial-gradient(ellipse at 50% 50%,#000 30%,transparent 75%);-webkit-mask:radial-gradient(ellipse at 50% 50%,#000 30%,transparent 75%)}
[data-vibeui-block="gadget-002"] [data-part="piece"]{position:absolute;left:33%;transform:translate(-50%,calc(var(--vibeui-gadget-002-o) * var(--vibeui-gadget-002-e)))}
[data-vibeui-block="gadget-002"] [data-scene-smooth="true"] [data-part="piece"]{transition:transform .9s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="gadget-002"] [data-part="piece"]>i{display:block;transition:box-shadow .3s,filter .3s}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-hot="true"]>i{filter:brightness(1.25);box-shadow:0 0 0 3px var(--vibeui-gadget-002-accent)}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="dome"]{top:12rem;z-index:5;--vibeui-gadget-002-o:-11rem}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="dome"]>i{width:11rem;height:3.4rem;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#fff 0%,var(--vibeui-gadget-002-light) 42%,color-mix(in oklab,var(--vibeui-gadget-002-light) 55%,#000) 100%);box-shadow:0 0 40px color-mix(in oklab,var(--vibeui-gadget-002-light) 70%,transparent)}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="board"]{top:13.9rem;z-index:2;--vibeui-gadget-002-o:-7.5rem}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="board"]>i{width:8.6rem;height:1.3rem;border-radius:.4rem;background:linear-gradient(90deg,#123527,#1f5a3f 30%,#174a33 60%,#0f2d20);box-shadow:inset 0 0 0 1px rgb(255 255 255/.08)}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="board"]>i::before{content:"";position:absolute;left:1.2rem;right:1.2rem;top:.3rem;height:.7rem;background:repeating-linear-gradient(90deg,#0a0a0a 0 .9rem,transparent .9rem 1.4rem,#c8a34a 1.4rem 1.6rem,transparent 1.6rem 2.2rem);border-radius:.15rem}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="speaker"]{top:15.6rem;z-index:1;--vibeui-gadget-002-o:-4.4rem}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="speaker"]>i{width:9.4rem;height:2rem;border-radius:1rem/1rem;background:repeating-linear-gradient(90deg,#0c0c0c 0 3px,#3a3a3a 3px 5px);box-shadow:inset 0 0 0 2px #262626}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="body"]{top:13.4rem;z-index:4;--vibeui-gadget-002-o:0rem}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="body"]>i{width:11rem;height:14rem;border-radius:1.6rem 1.6rem 2.8rem 2.8rem/1.6rem 1.6rem 2.2rem 2.2rem;background:linear-gradient(90deg,#141414 0%,#3b3b3b 26%,#4c4c4c 40%,#2a2a2a 74%,#0d0d0d 100%);box-shadow:inset 0 -22px 34px rgb(0 0 0/.55),0 30px 50px -24px rgb(0 0 0/.9)}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="body"]>i::after{content:"";position:absolute;left:50%;top:6.4rem;width:2.6rem;height:2.6rem;margin-left:-1.3rem;border-radius:50%;background:radial-gradient(circle at 40% 35%,#3a3a3a,#0f0f0f);box-shadow:inset 0 0 0 2px #4a4a4a}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="base"]{top:26.6rem;z-index:3;--vibeui-gadget-002-o:2rem}
[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="base"]>i{width:12.4rem;height:2.6rem;border-radius:50%;background:linear-gradient(180deg,#2c2c2c,#101010);box-shadow:0 14px 30px -12px rgb(0 0 0/.9),inset 0 1px 0 rgb(255 255 255/.12)}
[data-vibeui-block="gadget-002"] [data-part="piece"]>i{position:relative}
[data-vibeui-block="gadget-002"] [data-part="tag"]{position:absolute;left:calc(100% + .4rem);top:50%;display:flex;align-items:center;gap:.5rem;transform:translateY(-50%);white-space:nowrap;font-family:var(--vibeui-gadget-002-mono);font-size:.72rem;letter-spacing:.04em;opacity:var(--vibeui-gadget-002-e)}
[data-vibeui-block="gadget-002"] [data-part="tag"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-gadget-002-fg);transform-origin:left;transform:scaleX(var(--vibeui-gadget-002-e))}
[data-vibeui-block="gadget-002"] [data-scene-smooth="true"] [data-part="tag"],[data-vibeui-block="gadget-002"] [data-scene-smooth="true"] [data-part="tag"]::before{transition:opacity .6s,transform .9s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="gadget-002"] [data-part="tag"] b{display:inline-grid;place-items:center;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-gadget-002-accent);color:var(--vibeui-gadget-002-on-accent);font-weight:500;font-size:.66rem}
[data-vibeui-block="gadget-002"] [data-part="controls"]{position:absolute;left:1rem;right:1rem;bottom:1rem;display:flex;align-items:center;gap:.8rem;padding:.7rem .9rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-gadget-002-bg) 75%,transparent);border:1px solid var(--vibeui-gadget-002-line);backdrop-filter:blur(10px);z-index:6}
[data-vibeui-block="gadget-002"] [data-part="controls"] label{display:flex;align-items:center;gap:.6rem;flex:1;font-family:var(--vibeui-gadget-002-mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-gadget-002-muted)}
[data-vibeui-block="gadget-002"] [data-part="range"]{-webkit-appearance:none;appearance:none;flex:1;min-width:0;height:.4rem;border-radius:999px;background:var(--vibeui-gadget-002-line);outline:none;cursor:pointer}
[data-vibeui-block="gadget-002"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.2rem;height:1.2rem;border-radius:50%;background:var(--vibeui-gadget-002-accent);border:3px solid var(--vibeui-gadget-002-bg);box-shadow:0 2px 8px rgb(0 0 0/.4);cursor:grab}
[data-vibeui-block="gadget-002"] [data-part="range"]::-moz-range-thumb{width:1.2rem;height:1.2rem;border-radius:50%;background:var(--vibeui-gadget-002-accent);border:3px solid var(--vibeui-gadget-002-bg);cursor:grab}
[data-vibeui-block="gadget-002"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-gadget-002-accent) 40%,transparent)}
[data-vibeui-block="gadget-002"] [data-part="toggle"]{padding:.55rem .9rem;border-radius:999px;border:1px solid var(--vibeui-gadget-002-line);background:transparent;color:var(--vibeui-gadget-002-fg);font:inherit;font-size:.82rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .2s}
[data-vibeui-block="gadget-002"] [data-part="toggle"]:hover{background:var(--vibeui-gadget-002-glass)}
[data-vibeui-block="gadget-002"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-gadget-002-accent);outline-offset:2px}
[data-vibeui-block="gadget-002"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:.4rem;counter-reset:vibeui-gadget-002}
[data-vibeui-block="gadget-002"] [data-part="item"]{display:grid;grid-template-columns:2rem 1fr;gap:.2rem .8rem;padding:.9rem 1rem;border-radius:1rem;border:1px solid transparent;cursor:default;transition:background .2s,border-color .2s}
[data-vibeui-block="gadget-002"] [data-part="item"]:hover,[data-vibeui-block="gadget-002"] [data-part="item"][data-hot="true"]{background:var(--vibeui-gadget-002-glass);border-color:var(--vibeui-gadget-002-line)}
[data-vibeui-block="gadget-002"] [data-part="item"]::before{counter-increment:vibeui-gadget-002;content:"0" counter(vibeui-gadget-002);grid-row:span 2;font-family:var(--vibeui-gadget-002-mono);font-size:.8rem;color:var(--vibeui-gadget-002-accent);padding-top:.2rem}
[data-vibeui-block="gadget-002"] [data-part="item"] h3{margin:0;font-family:var(--vibeui-gadget-002-display);font-weight:700;font-size:1rem;letter-spacing:-.01em}
[data-vibeui-block="gadget-002"] [data-part="item"] p{margin:0;font-size:.9rem;color:var(--vibeui-gadget-002-muted)}
[data-vibeui-block="gadget-002"] [data-part="renders"]{position:absolute;left:8%;top:1.5rem;bottom:1.5rem;width:56%}
[data-vibeui-block="gadget-002"] [data-part="renders"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 50%;display:block;filter:drop-shadow(0 20px 24px rgb(0 0 0 / .45))}
[data-vibeui-block="gadget-002"] [data-part="assembled"]{opacity:calc(1 - var(--vibeui-gadget-002-e));transform:scale(calc(.82 + (1 - var(--vibeui-gadget-002-e)) * .06))}
[data-vibeui-block="gadget-002"] [data-part="exploded"]{opacity:var(--vibeui-gadget-002-e);transform:scale(calc(.94 + var(--vibeui-gadget-002-e) * .06))}
[data-vibeui-block="gadget-002"] [data-scene-smooth="true"] [data-part="renders"] img{transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"]{left:calc(100% - 4rem);transform:translateY(-50%) translateY(calc((1 - var(--vibeui-gadget-002-e)) * var(--vibeui-gadget-002-ty)))}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"][data-kind="dome"]{top:11%;--vibeui-gadget-002-ty:9rem}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"][data-kind="board"]{top:23%;--vibeui-gadget-002-ty:6rem}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"][data-kind="speaker"]{top:33%;--vibeui-gadget-002-ty:3rem}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"][data-kind="body"]{top:60%;--vibeui-gadget-002-ty:0rem}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"][data-kind="base"]{top:90%;--vibeui-gadget-002-ty:-5rem}
[data-vibeui-block="gadget-002"] [data-part="renders"] [data-part="tag"][data-hot="true"]{color:var(--vibeui-gadget-002-light)}
@container (min-width: 60rem){[data-vibeui-block="gadget-002"] [data-part="stage"]{grid-template-columns:1.15fr .85fr;align-items:center;gap:3rem}[data-vibeui-block="gadget-002"] [data-part="scene"]{height:38rem}[data-vibeui-block="gadget-002"] [data-part="piece"]{left:42%}[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="dome"]{top:14rem}[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="board"]{top:15.9rem}[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="speaker"]{top:17.6rem}[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="body"]{top:15.4rem}[data-vibeui-block="gadget-002"] [data-part="piece"][data-kind="base"]{top:28.6rem}[data-vibeui-block="gadget-002"] [data-part="tag"]::before{width:4rem}[data-vibeui-block="gadget-002"] [data-part="controls"]{left:1.5rem;right:auto;width:22rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gadget-002"] *{animation:none!important;transition:none!important}}`

const KINDS = ["dome", "board", "speaker", "body", "base"] as const

const DEFAULT_PARTS: Gadget002Part[] = [
  { name: "Диффузор", text: "Опаловый поликарбонат, 2 мм. Рассеивает 96 светодиодов в один ровный диск без точек." },
  { name: "Плата", text: "ESP32-S3, датчики CO₂, влажности и света, драйвер двух каналов 2700 и 6500 K." },
  { name: "Динамик", text: "5 Вт, 360°, пассивный радиатор. Птицы и дождь без фанерного дребезга." },
  { name: "Корпус", text: "Анодированный алюминий, тёплый на ощупь. Колесо-регулятор с 24 щелчками." },
  { name: "Основание", text: "Стальной блин 480 г и силиконовое кольцо — лампа не едет по столу." },
]

/** Взрыв-схема лампы: детали разъезжаются по ползунку и в viewport. */
export function Gadget002({
  eyebrow = "Устройство",
  title = "Пять деталей. Ни одной лишней",
  lede = "Разберите Луч, не снимая ни одного винта: потяните ползунок или просто долистайте — схема разложится сама.",
  parts = DEFAULT_PARTS,
  autoExplode = true,
  assembledImage = "/demo/gadget/lamp-front.png",
  explodedImage = "/demo/gadget/exploded.png",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Gadget002Props) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const touched = useRef(false)
  const [explode, setExplode] = useState(0)
  const [smooth, setSmooth] = useState(true)
  const [hot, setHot] = useState<number | null>(null)
  const renders = Boolean(assembledImage && explodedImage)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || !autoExplode) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !touched.current) {
          setSmooth(true)
          setExplode(100)
        }
      },
      { threshold: 0.45 },
    )
    observer.observe(scene)
    return () => observer.disconnect()
  }, [autoExplode])

  const palette = {
    ...(accent ? { "--vibeui-gadget-002-accent": accent } : null),
    ...(ink ? { "--vibeui-gadget-002-fg": ink } : null),
    ...(background ? { "--vibeui-gadget-002-bg": background } : null),
    "--vibeui-gadget-002-e": explode / 100,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-gadget-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="gadget-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="stage">
            <div data-part="scene" data-scene-smooth={smooth} ref={sceneRef}>
              {renders ? (
                <div data-part="renders" aria-hidden="true">
                  <img data-part="assembled" src={assembledImage} alt="" />
                  <img data-part="exploded" src={explodedImage} alt="" />
                  {KINDS.map((kind, index) => (
                    <span key={kind} data-part="tag" data-kind={kind} data-hot={hot === index ? "true" : undefined}>
                      <b>{index + 1}</b>
                      {parts[index]?.name}
                    </span>
                  ))}
                </div>
              ) : (
                KINDS.map((kind, index) => (
                  <div key={kind} data-part="piece" data-kind={kind} data-hot={hot === index ? "true" : undefined} aria-hidden="true">
                    <i />
                    <span data-part="tag">
                      <b>{index + 1}</b>
                      {parts[index]?.name}
                    </span>
                  </div>
                ))
              )}
              <div data-part="controls">
                <label>
                  Разбор
                  <input
                    data-part="range"
                    type="range"
                    min={0}
                    max={100}
                    value={explode}
                    aria-label="Степень разбора"
                    onChange={(event) => {
                      touched.current = true
                      setSmooth(false)
                      setExplode(Number(event.target.value))
                    }}
                  />
                </label>
                <button
                  data-part="toggle"
                  type="button"
                  onClick={() => {
                    touched.current = true
                    setSmooth(true)
                    setExplode((value) => (value > 50 ? 0 : 100))
                  }}
                >
                  {explode > 50 ? "Собрать" : "Разобрать"}
                </button>
              </div>
            </div>
            <ol data-part="list">
              {parts.map((part, index) => (
                <li key={part.name} data-part="item" data-hot={hot === index ? "true" : undefined} onMouseEnter={() => setHot(index)} onMouseLeave={() => setHot(null)}>
                  <h3>{part.name}</h3>
                  <p>{part.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
