"use client"

import { useEffect, useRef, useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"
import type { CSSProperties } from "react"

export type Map002Fact = {
  label: string
  value: string
}

export type Map002Props = {
  eyebrow?: string
  title?: string
  description?: string
  /** Адрес точки: заголовок панели и запрос, по которому карта ставит метку. */
  address?: string
  /** Координаты метки. Заданы — карта встаёт по ним, а не по адресу. */
  latitude?: number
  longitude?: number
  zoom?: number
  /** Ключ Google Maps JavaScript API. Пусто — работает встроенная карта. */
  apiKey?: string
  /** Тема карты. Работает только с ключом: у встроенной карты схемы нет. */
  theme?: "auto" | "light" | "dark"
  language?: string
  facts?: Map002Fact[]
  openLabel?: string
  routeLabel?: string
  providerLabel?: string
  /** Подпись поверх карты, когда JS API не загрузился. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

type GoogleLatLngLiteral = { lat: number; lng: number }

type GoogleMapInstance = object

type GoogleMapsApi = {
  Map: new (
    element: HTMLElement,
    options: {
      center: GoogleLatLngLiteral
      zoom: number
      disableDefaultUI?: boolean
      zoomControl?: boolean
      styles?: unknown[]
    },
  ) => GoogleMapInstance
  Marker: new (options: {
    map: GoogleMapInstance
    position: GoogleLatLngLiteral
    title?: string
  }) => { setMap: (map: GoogleMapInstance | null) => void }
  Geocoder: new () => {
    geocode: (request: { address: string }) => Promise<{
      results: {
        geometry: { location: { lat: () => number; lng: () => number } }
      }[]
    }>
  }
}

declare global {
  interface Window {
    google?: { maps?: GoogleMapsApi }
  }
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: карта и справка стоят рядом, а не одна поверх другой. Адрес,
// часы и телефон читаются с той же строки, что и метка, поэтому их можно
// скопировать, не закрывая карту и не увеличивая её на телефоне.
//
// Карта настоящая в обоих режимах. Без ключа блок показывает встроенную
// карту Google (iframe, ключ не нужен): метка встаёт по адресу из пропа.
// С ключом подключается JavaScript API — тогда доступны тёмная схема,
// геокодер и управление картой из кода.
const STYLES = `
:where([data-vibeui-block="map-002"]){
--vibeui-map-002-bg:transparent;
--vibeui-map-002-card:light-dark(oklch(1 0 0),oklch(0.22 0.01 265));
--vibeui-map-002-fg:light-dark(oklch(0.21 0.01 265),oklch(0.95 0 265));
--vibeui-map-002-muted:light-dark(oklch(0.52 0.01 265),oklch(0.73 0 265));
--vibeui-map-002-border:light-dark(oklch(0.9 0.005 265),oklch(0.33 0.01 265));
--vibeui-map-002-accent:light-dark(oklch(0.55 0.17 255),oklch(0.72 0.14 255));
--vibeui-map-002-on-accent:oklch(from var(--vibeui-map-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-map-002-canvas:light-dark(oklch(0.945 0.004 250),oklch(0.185 0.01 265));
--vibeui-map-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-002"]{color-scheme:dark}
[data-vibeui-block="map-002"]{
min-width:min(100%,16rem);
background:var(--vibeui-map-002-bg);color:var(--vibeui-map-002-fg);
font-family:var(--vibeui-map-002-sans);
}
[data-vibeui-block="map-002"] *{box-sizing:border-box}
[data-vibeui-block="map-002"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.5rem;
}
[data-vibeui-block="map-002"] [data-part="head"]{max-width:46ch}
[data-vibeui-block="map-002"] [data-part="split"]{display:grid;gap:1rem;align-items:stretch}
[data-vibeui-block="map-002"] [data-part="stage"]{
position:relative;overflow:hidden;border-radius:1.25rem;
color:var(--vibeui-map-002-fg);
border:1px solid var(--vibeui-map-002-border);
background:var(--vibeui-map-002-canvas);
height:clamp(18rem,46cqi,28rem);
}
[data-vibeui-block="map-002"] [data-part="canvas"]{position:absolute;inset:0}
[data-vibeui-block="map-002"] iframe{
position:absolute;inset:0;width:100%;height:100%;border:0;display:block;
}
[data-vibeui-block="map-002"] [data-part="status"]{
position:absolute;left:0.75rem;top:0.75rem;z-index:2;margin:0;
padding:0.375rem 0.6875rem;border-radius:0.5rem;max-width:22rem;
background:var(--vibeui-map-002-card);border:1px solid var(--vibeui-map-002-border);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-map-002-muted);
}
[data-vibeui-block="map-002"] [data-part="panel"]{
padding:1.375rem;border-radius:1.25rem;
background:var(--vibeui-map-002-card);border:1px solid var(--vibeui-map-002-border);
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="map-002"] [data-part="panel"] h3{
margin:0;font-size:1.0625rem;font-weight:660;line-height:1.35;letter-spacing:-0.01em;
}
[data-vibeui-block="map-002"] dl{margin:0;display:grid;gap:0.75rem}
[data-vibeui-block="map-002"] dt{
font-size:0.6875rem;font-weight:660;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-map-002-muted);
}
[data-vibeui-block="map-002"] dd{margin:0.125rem 0 0;font-size:0.875rem;line-height:1.5;font-weight:600}
[data-vibeui-block="map-002"] [data-part="actions"]{
margin-top:auto;display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="map-002"] a{
display:inline-flex;align-items:center;height:2.375rem;padding:0 0.9375rem;
border-radius:0.6875rem;text-decoration:none;font-size:0.8125rem;font-weight:640;
background:var(--vibeui-map-002-accent);color:oklch(from var(--vibeui-map-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="map-002"] a[data-variant="ghost"]{
background:transparent;color:var(--vibeui-map-002-fg);
border:1px solid var(--vibeui-map-002-border);
}
[data-vibeui-block="map-002"] :focus-visible{outline:2px solid var(--vibeui-map-002-accent);outline-offset:2px}
@container (min-width: 52rem){
[data-vibeui-block="map-002"] [data-part="frame"]{padding:4rem 2rem;gap:2rem}
[data-vibeui-block="map-002"] [data-part="split"]{grid-template-columns:1.6fr 1fr;gap:1.25rem}
[data-vibeui-block="map-002"] [data-part="stage"]{height:auto;min-height:26rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-002"] *{animation:none!important;transition:none!important}}
`

/** Башня «Око», Москва-Сити: точка по умолчанию для ссылок и JS API. */
const FALLBACK_POINT = { latitude: 55.7496, longitude: 37.5342 }

const DEFAULT_FACTS: Map002Fact[] = [
  { label: "Часы работы", value: "Пн–Пт, 10:00–19:00. Суббота — по записи" },
  { label: "Телефон", value: "+7 495 120-45-90" },
  { label: "Почта", value: "office@studio.ru" },
  {
    label: "Как найти",
    value:
      "1-й Красногвардейский проезд, 21с1, вход А, стойка ресепшена на 1 этаже",
  },
]

const STATUS_TEXT: Record<string, string> = {
  failed:
    "JavaScript API не загрузился — показана встроенная карта Google. Проверьте ключ, биллинг и список доменов.",
}

/**
 * Ночная схема Google. Стили задаются массивом правил, потому что mapId
 * блока нет: облачное оформление привязало бы item к конкретному аккаунту.
 */
const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#232c3b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9aa4b4" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a212c" }] },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8c96a6" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#26382f" }],
  },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#39424f" }] },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#232c3b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4a5261" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3846" }],
  },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#16202e" }] },
]

/**
 * Тема карты для режима «auto»: карта обязана потемнеть вместе со страницей,
 * а страница объявляет тему то классом, то системной настройкой.
 */
function resolveTheme(element: HTMLElement | null): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light"
  }

  if (element?.closest(".dark, [data-theme='dark']")) {
    return "dark"
  }

  const scheme = element ? getComputedStyle(element).colorScheme : ""

  if (scheme.includes("dark") && !scheme.includes("light")) {
    return "dark"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/** Один тег на адрес: две карты на странице не грузят API дважды. */
function loadScript(source: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-vibeui-map="${source}"]`,
  )

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

/**
 * Секция «где мы находимся»: карта Google и панель справки рядом с ней.
 * Один файл, ноль зависимостей, ключ не обязателен.
 */
export function Map002({
  eyebrow = "Адрес офиса",
  title = "Найдите нас в Москва-Сити",
  description = "Башня «Око», 1-й Красногвардейский проезд, 21с1. Рядом с картой — то, что обычно спрашивают по телефону: часы, вход и контакты.",
  address = "Москва, 1-й Красногвардейский проезд, 21с1",
  latitude,
  longitude,
  zoom = 16,
  apiKey = "",
  theme = "auto",
  language = "ru",
  facts = DEFAULT_FACTS,
  openLabel = "Открыть в Google Картах",
  routeLabel = "Маршрут",
  providerLabel = "Google Maps",
  statusText,
  background = "",
  accent,
  className,
  style,
}: Map002Props) {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">(
    apiKey ? "loading" : "idle",
  )
  const [scheme, setScheme] = useState<"light" | "dark">("light")

  const hasPoint = latitude !== undefined && longitude !== undefined
  const point = {
    latitude: latitude ?? FALLBACK_POINT.latitude,
    longitude: longitude ?? FALLBACK_POINT.longitude,
  }
  const labels = { ...STATUS_TEXT, ...statusText }
  const mapTheme = theme === "auto" ? scheme : theme

  // Тема страницы меняется без перезагрузки: и переключателем (класс на
  // <html>), и системной настройкой. Карта обязана поехать следом.
  useEffect(() => {
    if (theme !== "auto") {
      return
    }

    const update = () => setScheme(resolveTheme(rootRef.current))

    update()

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const observer = new MutationObserver(update)

    media.addEventListener("change", update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    return () => {
      media.removeEventListener("change", update)
      observer.disconnect()
    }
  }, [theme])

  // Карта пересобирается целиком на смену темы, адреса или ключа: перерисовка
  // случается редко и стоит дешевле трёх веток обновления.
  useEffect(() => {
    const container = canvasRef.current

    if (!apiKey || !container) {
      return
    }

    let cancelled = false

    setStatus("loading")

    const build = async () => {
      await loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=${encodeURIComponent(language)}&v=weekly`,
      )

      const api = window.google?.maps

      if (!api) {
        throw new Error("google.maps")
      }

      let center: GoogleLatLngLiteral = {
        lat: point.latitude,
        lng: point.longitude,
      }

      // Геокодер вызывается только когда координат нет: явно заданная точка
      // всегда точнее адреса, разобранного по строке.
      if (!hasPoint && address) {
        try {
          const found = await new api.Geocoder().geocode({ address })
          const location = found.results[0]?.geometry.location

          if (location) {
            center = { lat: location.lat(), lng: location.lng() }
          }
        } catch {
          // Geocoding API может быть не включён — тогда остаётся запасная точка.
        }
      }

      if (cancelled) {
        return
      }

      container.replaceChildren()

      const map = new api.Map(container, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: mapTheme === "dark" ? DARK_STYLE : [],
      })

      new api.Marker({ map, position: center, title: address })

      setStatus("ready")
    }

    build().catch(() => {
      if (!cancelled) {
        setStatus("failed")
      }
    })

    return () => {
      cancelled = true
      container.replaceChildren()
    }
  }, [
    apiKey,
    address,
    hasPoint,
    language,
    zoom,
    mapTheme,
    point.latitude,
    point.longitude,
  ])

  // Тема карты — про карту, а не про секцию: схема фиксируется на кадре,
  // иначе панель справки уезжает в чужую тему посреди светлой страницы.
  const stageStyle =
    theme === "auto" ? undefined : ({ colorScheme: theme } as CSSProperties)

  const palette = {
    ...(accent ? { "--vibeui-map-002-accent": accent } : null),
    ...(background ? { "--vibeui-map-002-bg": background } : null),
    ...style,
  } as CSSProperties

  const query = encodeURIComponent(
    hasPoint ? `${point.latitude},${point.longitude}` : address,
  )
  // Встроенная карта Google: ключ не нужен, метка встаёт по запросу.
  const embedSource = `https://www.google.com/maps?q=${query}&z=${zoom}&hl=${encodeURIComponent(language)}&output=embed`
  const linkQuery = encodeURIComponent(address)
  const openHref = `https://www.google.com/maps/search/?api=1&query=${linkQuery}`
  const routeHref = `https://www.google.com/maps/dir/?api=1&destination=${linkQuery}`

  return (
    <>
      <style href="vibeui-map-002" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={rootRef}
        data-vibeui-block="map-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div data-part="head">
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              accent={accent}
            />
          </div>

          <div data-part="split">
            <div data-part="stage" style={stageStyle}>
              <div
                data-part="canvas"
                ref={canvasRef}
                aria-hidden={status !== "ready"}
              />

              {status === "ready" ? null : (
                <iframe
                  src={embedSource}
                  title={`${providerLabel}: ${address}`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              {status === "failed" ? (
                <p data-part="status">{labels.failed}</p>
              ) : null}
            </div>

            <div data-part="panel">
              <h3>{address}</h3>
              <dl>
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div data-part="actions">
                <a href={routeHref} target="_blank" rel="noreferrer noopener">
                  {routeLabel}
                </a>
                <a
                  data-variant="ghost"
                  href={openHref}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {openLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
