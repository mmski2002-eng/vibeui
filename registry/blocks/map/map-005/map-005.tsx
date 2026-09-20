"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Map005Hours = {
  days: string
  time: string
}

export type Map005Props = {
  eyebrow?: string
  title?: string
  address?: string
  latitude?: number
  longitude?: number
  zoom?: number
  /** Ключ JS API Яндекс Карт. Пусто — встроенный виджет, без ключа. */
  apiKey?: string
  hours?: readonly Map005Hours[]
  /** Как добраться: метро, парковка, вход. */
  details?: readonly string[]
  phone?: string
  phoneHref?: string
  routeLabel?: string
  providerLabel?: string
  /** Текст, если JS API карт не загрузился. */
  failedText?: string
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

// Как добраться: Яндекс Карта с меткой во всю ширину, поверх — карточка с
// адресом, часами по дням, ориентирами и кнопкой маршрута. Без ключа —
// штатный виджет (iframe) в теме страницы, с ключом — JS API v3 и своя
// брусничная метка. Тема карты в auto следует странице.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="map-005"]){
--vibeui-map-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-005-muted:light-dark(color-mix(in oklab,var(--vibeui-map-005-fg) 60%,var(--vibeui-map-005-bg)),color-mix(in oklab,var(--vibeui-map-005-fg) 58%,var(--vibeui-map-005-bg)));
--vibeui-map-005-card:light-dark(#fffaf3,#1d1917);
--vibeui-map-005-line:color-mix(in oklab,var(--vibeui-map-005-fg) 14%,var(--vibeui-map-005-bg));
--vibeui-map-005-canvas:light-dark(#e7dfd2,#231d1a);
--vibeui-map-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-005-glow:0 0 24px color-mix(in oklab,var(--vibeui-map-005-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-map-005-accent) 35%,transparent);
--vibeui-map-005-accent-ink:light-dark(var(--vibeui-map-005-accent),color-mix(in oklab,var(--vibeui-map-005-accent) 55%,var(--vibeui-map-005-fg)));
--vibeui-map-005-on-accent:oklch(from var(--vibeui-map-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-map-005-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-map-005-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-005"]{color-scheme:dark}
:where([data-vibeui-block="map-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-005"]{box-sizing:border-box;display:block;background:var(--vibeui-map-005-bg);color:var(--vibeui-map-005-fg);font-family:var(--vibeui-map-005-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="map-005"] *{box-sizing:border-box}
[data-vibeui-block="map-005"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="map-005"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-map-005-accent-ink);font-weight:600}
[data-vibeui-block="map-005"] [data-part="title"]{margin:0 0 2rem;font-family:var(--vibeui-map-005-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="map-005"] [data-part="stage"]{position:relative;overflow:hidden;border-radius:1rem;border:1px solid var(--vibeui-map-005-line);background:var(--vibeui-map-005-canvas)}
[data-vibeui-block="map-005"] [data-part="map"]{position:relative;height:clamp(16rem,50cqi,30rem)}
[data-vibeui-block="map-005"] [data-part="canvas"]{position:absolute;inset:0}
[data-vibeui-block="map-005"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;filter:var(--vibeui-map-005-map-filter,none)}
[data-vibeui-block="map-005"] [data-part="pin"]{position:relative;width:1.4rem;height:1.4rem;transform:translate(-50%,-100%);border-radius:50% 50% 50% 0;background:var(--vibeui-map-005-accent);box-shadow:var(--vibeui-map-005-glow);rotate:-45deg}
[data-vibeui-block="map-005"] [data-part="pin"]::after{content:"";position:absolute;inset:.35rem;border-radius:50%;background:var(--vibeui-map-005-card)}
[data-vibeui-block="map-005"] [data-part="card"]{position:relative;z-index:2;display:grid;gap:1.25rem;padding:1.5rem;background:var(--vibeui-map-005-card);border-top:1px solid var(--vibeui-map-005-line)}
[data-vibeui-block="map-005"] [data-part="address"]{margin:0;font-family:var(--vibeui-map-005-display);font-size:1.5rem;font-weight:500;line-height:1.2;font-style:normal}
[data-vibeui-block="map-005"] [data-part="hours"]{margin:0;display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.25rem;font-size:.9rem}
[data-vibeui-block="map-005"] [data-part="hours"] dt{color:var(--vibeui-map-005-muted)}
[data-vibeui-block="map-005"] [data-part="hours"] dd{margin:0;font-variant-numeric:tabular-nums}
[data-vibeui-block="map-005"] [data-part="details"]{margin:0;padding:0;list-style:none;display:grid;gap:.4rem;font-size:.85rem;color:var(--vibeui-map-005-muted)}
[data-vibeui-block="map-005"] [data-part="details"] li{display:flex;gap:.6rem;align-items:flex-start}
[data-vibeui-block="map-005"] [data-part="details"] li::before{content:"";flex:none;width:.4rem;height:.4rem;margin-top:.5rem;border-radius:50%;background:var(--vibeui-map-005-accent)}
[data-vibeui-block="map-005"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.6rem}
[data-vibeui-block="map-005"] [data-part="actions"] a{display:inline-flex;align-items:center;height:2.75rem;padding:0 1.2rem;border-radius:999px;text-decoration:none;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:var(--vibeui-map-005-accent);color:var(--vibeui-map-005-on-accent);box-shadow:var(--vibeui-map-005-glow)}
[data-vibeui-block="map-005"] [data-part="actions"] a[data-variant="ghost"]{background:transparent;color:inherit;border:1px solid var(--vibeui-map-005-line);box-shadow:none}
[data-vibeui-block="map-005"] a:focus-visible{outline:2px solid var(--vibeui-map-005-accent);outline-offset:2px}
[data-vibeui-block="map-005"] [data-part="status"]{position:absolute;left:.75rem;top:.75rem;z-index:2;margin:0;padding:.4rem .7rem;border-radius:.5rem;background:var(--vibeui-map-005-card);border:1px solid var(--vibeui-map-005-line);font-size:.7rem;color:var(--vibeui-map-005-muted);max-width:22rem}
@container (min-width: 56rem){
[data-vibeui-block="map-005"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="map-005"] [data-part="map"]{height:clamp(24rem,46cqi,34rem)}
[data-vibeui-block="map-005"] [data-part="card"]{position:absolute;left:1.5rem;top:1.5rem;max-height:calc(100% - 3rem);width:22rem;border:1px solid var(--vibeui-map-005-line);border-radius:.9rem;box-shadow:0 30px 50px -30px rgb(0 0 0 / .6);align-content:start;overflow:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-005"] *{transition:none!important}}`


function resolveTheme(element: HTMLElement | null): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  if (element?.closest(".dark, [data-theme='dark']")) return "dark"
  const scheme = element ? getComputedStyle(element).colorScheme : ""
  if (scheme.includes("dark") && !scheme.includes("light")) return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

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

/** Как добраться: Яндекс Карта с меткой и карточка с адресом, часами и маршрутом поверх. */
export function Map005({
  eyebrow = "Как добраться",
  title = "Большая Пушкарская, 20",
  address = "Санкт-Петербург, Большая Пушкарская, 20, вход со двора",
  latitude = 59.9585,
  longitude = 30.3085,
  zoom = 16,
  apiKey = "",
  hours = [
    { days: "Пн–Чт", time: "12:00–23:00" },
    { days: "Пт–Сб", time: "12:00–01:00" },
    { days: "Вс", time: "11:00–22:00" },
  ],
  details = ["м. «Горьковская» — 7 минут пешком", "Парковка во дворе, 6 мест, по брони", "Вход со двора, арка слева от аптеки"],
  phone = "+7 812 305-00-40",
  phoneHref = "tel:+78123050040",
  routeLabel = "Построить маршрут",
  providerLabel = "Яндекс Карты",
  failedText = "JS API не загрузился — показан встроенный виджет Яндекс Карт. Проверьте ключ и домен в кабинете разработчика.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map005Props) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">(apiKey ? "loading" : "idle")
  const [scheme, setScheme] = useState<"light" | "dark">("light")
  const mapTheme = tone === "auto" ? scheme : tone

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
      map = new api.YMap(container, { location: { center: [longitude, latitude], zoom }, theme: mapTheme })
      map.addChild(new api.YMapDefaultSchemeLayer({ theme: mapTheme }))
      map.addChild(new api.YMapDefaultFeaturesLayer({}))
      const pin = document.createElement("div")
      pin.dataset.part = "pin"
      map.addChild(new api.YMapMarker({ coordinates: [longitude, latitude] }, pin))
      setStatus("ready")
    }
    build().catch(() => {
      if (!cancelled) setStatus("failed")
    })
    return () => {
      cancelled = true
      map?.destroy()
      container.replaceChildren()
    }
  }, [apiKey, latitude, longitude, zoom, mapTheme])

  const palette = {
    ...(accent ? { "--vibeui-map-005-accent": accent } : null),
    ...(ink ? { "--vibeui-map-005-fg": ink } : null),
    ...(background ? { "--vibeui-map-005-bg": background } : null),
    ...style,
  } as CSSProperties
  const embed = `https://yandex.ru/map-widget/v1/?ll=${longitude},${latitude}&z=${zoom}&pt=${longitude},${latitude},pm2rdm&lang=ru_RU&theme=${mapTheme}`
  const routeHref = `https://yandex.ru/maps/?rtext=~${latitude},${longitude}&rtt=auto`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-005" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="map-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          <div data-part="stage">
            <div data-part="map">
              <div data-part="canvas" ref={canvas} aria-hidden={status !== "ready"} />
              {status === "ready" ? null : <iframe src={embed} title={`${providerLabel}: ${address}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />}
              {status === "failed" ? <p data-part="status">{failedText}</p> : null}
            </div>
            <div data-part="card">
              <address data-part="address">{address}</address>
              {hours.length > 0 ? (
                <dl data-part="hours">
                  {hours.map((row) => (
                    <div key={row.days} style={{ display: "contents" }}>
                      <dt>{row.days}</dt>
                      <dd>{row.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {details.length > 0 ? (
                <ul data-part="details">
                  {details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : null}
              <div data-part="actions">
                <a href={routeHref} target="_blank" rel="noreferrer noopener">
                  {routeLabel}
                </a>
                {phone ? (
                  <a data-variant="ghost" href={phoneHref}>
                    {phone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
