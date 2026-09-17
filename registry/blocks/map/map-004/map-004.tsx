"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Map004Point = {
  name: string
  /** Цена за метр или объекта: «285 тыс ₽». */
  price: string
  /** «164 объекта». */
  count?: string
  note?: string
  image?: string
  latitude: number
  longitude: number
  href?: string
}

export type Map004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  points?: readonly Map004Point[]
  /** Центр карты. Пусто — середина между точками. */
  latitude?: number
  longitude?: number
  zoom?: number
  /** Ключ JS API Яндекс Карт. Пусто — встроенный виджет с метками, без ключа. */
  apiKey?: string
  providerLabel?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

type YandexPoint = [number, number]
type YandexMap = { addChild: (child: unknown) => void; destroy: () => void }
type YandexApi = {
  ready: Promise<void>
  YMap: new (element: HTMLElement, props: { location: { center: YandexPoint; zoom: number }; theme?: "light" | "dark" }) => YandexMap
  YMapDefaultSchemeLayer: new (props: { theme?: "light" | "dark" }) => unknown
  YMapDefaultFeaturesLayer: new (props: Record<string, never>) => unknown
  YMapMarker: new (props: { coordinates: YandexPoint }, element?: HTMLElement) => unknown
}

// Районы или объекты на настоящей Яндекс Карте. Без ключа — штатный виджет
// (iframe) с метками через параметр pt, ключ не нужен. С ключом — JS API
// v3: метки-плашки с ценой, наведение на карточку подсвечивает метку и
// наоборот. Карточки справа: фото, название, цена за метр, число объектов.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="map-004"]){
--vibeui-map-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-004-muted:color-mix(in oklab,var(--vibeui-map-004-fg) 62%,var(--vibeui-map-004-bg));
--vibeui-map-004-card:light-dark(#fffdf9,#242424);
--vibeui-map-004-line:color-mix(in oklab,var(--vibeui-map-004-fg) 14%,var(--vibeui-map-004-bg));
--vibeui-map-004-canvas:light-dark(#e7dfd2,#2a2a2a);
--vibeui-map-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-004-on-accent:oklch(from var(--vibeui-map-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-map-004-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-map-004-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-004"]{color-scheme:dark}
:where([data-vibeui-block="map-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-004"]{box-sizing:border-box;display:block;background:var(--vibeui-map-004-bg);color:var(--vibeui-map-004-fg);font-family:var(--vibeui-map-004-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="map-004"] *{box-sizing:border-box}
[data-vibeui-block="map-004"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="map-004"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-map-004-accent);font-weight:600}
[data-vibeui-block="map-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-map-004-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="map-004"] [data-part="lede"]{margin:.75rem 0 0;max-width:36rem;color:var(--vibeui-map-004-muted)}
[data-vibeui-block="map-004"] [data-part="stage"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="map-004"] [data-part="map"]{position:relative;overflow:hidden;border-radius:1rem;border:1px solid var(--vibeui-map-004-line);background:var(--vibeui-map-004-canvas);min-height:22rem}
[data-vibeui-block="map-004"] [data-part="canvas"]{position:absolute;inset:0}
[data-vibeui-block="map-004"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
[data-vibeui-block="map-004"] [data-part="pin"]{position:relative;transform:translate(-50%,-100%);display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:999px;background:var(--vibeui-map-004-card);color:var(--vibeui-map-004-fg);font:600 .8rem/1 var(--vibeui-map-004-font);white-space:nowrap;box-shadow:0 8px 20px -10px rgb(0 0 0 / .5);border:1px solid var(--vibeui-map-004-line);cursor:pointer;transition:background .2s,color .2s,transform .2s}
[data-vibeui-block="map-004"] [data-part="pin"]::after{content:"";position:absolute;left:50%;bottom:-.35rem;width:.7rem;height:.7rem;margin-left:-.35rem;transform:rotate(45deg);background:inherit;border-right:1px solid var(--vibeui-map-004-line);border-bottom:1px solid var(--vibeui-map-004-line)}
[data-vibeui-block="map-004"] [data-part="pin"][data-active="true"]{background:var(--vibeui-map-004-fg);color:var(--vibeui-map-004-bg);transform:translate(-50%,-100%) scale(1.08)}
[data-vibeui-block="map-004"] [data-part="pin"] b{font-family:var(--vibeui-map-004-display);font-size:.95rem;font-weight:600}
[data-vibeui-block="map-004"] [data-part="list"]{display:grid;gap:.75rem;margin:0;padding:0;list-style:none;align-content:start}
[data-vibeui-block="map-004"] [data-part="card"]{display:grid;grid-template-columns:4rem minmax(0,1fr) auto;gap:.9rem;align-items:center;padding:.6rem .9rem .6rem .6rem;border-radius:.9rem;background:var(--vibeui-map-004-card);border:1px solid var(--vibeui-map-004-line);color:inherit;text-decoration:none;transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s}
[data-vibeui-block="map-004"] [data-part="card"]:hover,[data-vibeui-block="map-004"] [data-part="card"][data-active="true"]{transform:translateX(4px);border-color:var(--vibeui-map-004-accent);box-shadow:0 18px 30px -24px rgb(20 33 27 / .5)}
[data-vibeui-block="map-004"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-map-004-accent);outline-offset:2px}
[data-vibeui-block="map-004"] [data-part="thumb"]{width:4rem;height:3rem;border-radius:.5rem;object-fit:cover;background:var(--vibeui-map-004-canvas)}
[data-vibeui-block="map-004"] [data-part="name"]{display:block;font-weight:600}
[data-vibeui-block="map-004"] [data-part="note"]{display:block;font-size:.78rem;color:var(--vibeui-map-004-muted)}
[data-vibeui-block="map-004"] [data-part="price"]{text-align:right}
[data-vibeui-block="map-004"] [data-part="price"] b{display:block;font-family:var(--vibeui-map-004-display);font-size:1.35rem;font-weight:600;line-height:1;color:var(--vibeui-map-004-accent)}
[data-vibeui-block="map-004"] [data-part="price"] span{display:block;font-size:.72rem;color:var(--vibeui-map-004-muted);margin-top:.2rem;white-space:nowrap}
[data-vibeui-block="map-004"] [data-part="status"]{position:absolute;left:.75rem;top:.75rem;z-index:2;margin:0;padding:.4rem .7rem;border-radius:.5rem;background:var(--vibeui-map-004-card);border:1px solid var(--vibeui-map-004-line);font-size:.7rem;color:var(--vibeui-map-004-muted);max-width:22rem}
@container (min-width: 56rem){
[data-vibeui-block="map-004"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="map-004"] [data-part="stage"]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:2rem;align-items:stretch}
[data-vibeui-block="map-004"] [data-part="map"]{min-height:28rem}
[data-vibeui-block="map-004"] [data-part="list"]{align-content:space-between}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-004"] *{transition:none!important}}`

const DEFAULT_POINTS: Map004Point[] = [
  { name: "Петроградская", price: "285 тыс ₽", count: "164 объекта", note: "модерн, тихие дворы, 10 минут до центра", latitude: 59.9632, longitude: 30.3117 },
  { name: "Васильевский", price: "240 тыс ₽", count: "128 объектов", note: "набережные, линии, тихо вечером", latitude: 59.9412, longitude: 30.2626 },
  { name: "Центральный", price: "310 тыс ₽", count: "402 объекта", note: "парадные, лепнина, лучшие школы", latitude: 59.9343, longitude: 30.3462 },
  { name: "Приморский", price: "205 тыс ₽", count: "356 объектов", note: "новостройки у залива, парки", latitude: 59.9989, longitude: 30.2632 },
]

const STATUS_FAILED = "JS API не загрузился — показан встроенный виджет Яндекс Карт. Проверьте ключ и домен в кабинете разработчика."

function resolveTheme(element: HTMLElement | null): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  if (element?.closest(".dark, [data-theme='dark']")) return "dark"
  const scheme = element ? getComputedStyle(element).colorScheme : ""
  if (scheme.includes("dark") && !scheme.includes("light")) return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** Один тег на адрес: две карты на странице не грузят API дважды. */
function loadScript(source: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[data-vibeui-map="${source}"]`)
  if (existing) {
    return existing.dataset.ready === "true"
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          existing.addEventListener("load", () => resolve())
          existing.addEventListener("error", () => reject(new Error(source)))
        })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = source
    script.async = true
    script.dataset.vibeuiMap = source
    script.addEventListener("load", () => {
      script.dataset.ready = "true"
      resolve()
    })
    script.addEventListener("error", () => reject(new Error(source)))
    document.head.append(script)
  })
}

/** Районы или объекты на Яндекс Карте с метками и карточками рядом. */
export function Map004({
  eyebrow = "Районы",
  title = "Где вы будете жить",
  lede = "Средняя цена метра и живые объекты по районам. Наведите на район — метка на карте подсветится.",
  points = DEFAULT_POINTS,
  latitude,
  longitude,
  zoom = 11,
  apiKey = "",
  providerLabel = "Яндекс Карты",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map004Props) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const pins = useRef<HTMLElement[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">(apiKey ? "loading" : "idle")
  const [scheme, setScheme] = useState<"light" | "dark">("light")
  const [active, setActive] = useState<number | null>(null)
  const mapTheme = tone === "auto" ? scheme : tone

  const centerLongitude = longitude ?? points.reduce((sum, point) => sum + point.longitude, 0) / Math.max(1, points.length)
  const centerLatitude = latitude ?? points.reduce((sum, point) => sum + point.latitude, 0) / Math.max(1, points.length)

  useEffect(() => {
    if (tone !== "auto") return
    const update = () => setScheme(resolveTheme(root.current))
    update()
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const observer = new MutationObserver(update)
    media.addEventListener("change", update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] })
    return () => {
      media.removeEventListener("change", update)
      observer.disconnect()
    }
  }, [tone])

  // С ключом карта собирается JS API: метки — свои плашки с ценой, они же
  // подсвечиваются с карточек. Пересобирается на смену темы или точек.
  useEffect(() => {
    const container = canvas.current
    if (!apiKey || !container) return
    let cancelled = false
    let map: YandexMap | null = null
    setStatus("loading")
    const build = async () => {
      await loadScript(`https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`)
      const api = (window as unknown as { ymaps3?: YandexApi }).ymaps3
      if (!api) throw new Error("ymaps3")
      await api.ready
      if (cancelled) return
      container.replaceChildren()
      map = new api.YMap(container, { location: { center: [centerLongitude, centerLatitude], zoom }, theme: mapTheme })
      map.addChild(new api.YMapDefaultSchemeLayer({ theme: mapTheme }))
      map.addChild(new api.YMapDefaultFeaturesLayer({}))
      pins.current = points.map((point, index) => {
        const pin = document.createElement(point.href ? "a" : "button")
        pin.dataset.part = "pin"
        if (pin instanceof HTMLAnchorElement) pin.href = point.href ?? "#"
        else pin.setAttribute("type", "button")
        pin.innerHTML = `<b>${point.price}</b><span>${point.name}</span>`
        pin.addEventListener("mouseenter", () => setActive(index))
        pin.addEventListener("mouseleave", () => setActive(null))
        pin.addEventListener("focus", () => setActive(index))
        pin.addEventListener("blur", () => setActive(null))
        map?.addChild(new api.YMapMarker({ coordinates: [point.longitude, point.latitude] }, pin))
        return pin
      })
      setStatus("ready")
    }
    build().catch(() => {
      if (!cancelled) setStatus("failed")
    })
    return () => {
      cancelled = true
      map?.destroy()
      container.replaceChildren()
      pins.current = []
    }
  }, [apiKey, zoom, mapTheme, points, centerLongitude, centerLatitude])

  useEffect(() => {
    pins.current.forEach((pin, index) => {
      pin.dataset.active = String(active === index)
    })
  }, [active])

  const palette = {
    ...(accent ? { "--vibeui-map-004-accent": accent } : null),
    ...(ink ? { "--vibeui-map-004-fg": ink } : null),
    ...(background ? { "--vibeui-map-004-bg": background } : null),
    ...style,
  } as CSSProperties

  // Виджет без ключа: метки перечисляются в pt через «~», схема — theme.
  const markers = points.map((point) => `${point.longitude},${point.latitude},pm2dgm`).join("~")
  const embed = `https://yandex.ru/map-widget/v1/?ll=${centerLongitude},${centerLatitude}&z=${zoom}&pt=${markers}&lang=ru_RU&theme=${mapTheme}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-004" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="map-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="stage">
            <div data-part="map">
              <div data-part="canvas" ref={canvas} aria-hidden={status !== "ready"} />
              {status === "ready" ? null : <iframe src={embed} title={`${providerLabel}: ${title}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />}
              {status === "failed" ? <p data-part="status">{STATUS_FAILED}</p> : null}
            </div>
            <ul data-part="list">
              {points.map((point, index) => (
                <li key={point.name}>
                  <a
                    href={point.href ?? "#"}
                    data-part="card"
                    data-active={active === index}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                  >
                    {point.image ? <img data-part="thumb" src={point.image} alt="" loading="lazy" /> : <span data-part="thumb" />}
                    <span>
                      <span data-part="name">{point.name}</span>
                      {point.note ? <span data-part="note">{point.note}</span> : null}
                    </span>
                    <span data-part="price">
                      <b>{point.price}</b>
                      {point.count ? <span>{point.count}</span> : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
