"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Map003Note = {
  label: string
  value: string
}

export type Map003Props = {
  eyebrow?: string
  title?: string
  /** Адрес точки: подпись под картой и ссылка в 2ГИС. */
  address?: string
  /** Координаты метки: виджет 2ГИС ставит центр и метку по ним. */
  latitude?: number
  longitude?: number
  zoom?: number
  /** Город виджета в написании 2ГИС: moscow, spb, novosibirsk. */
  city?: string
  /** Готовая ссылка из конструктора виджетов 2ГИС. Перебивает координаты. */
  embedUrl?: string
  /** Ключ MapGL. Пусто — работает встроенный виджет 2ГИС. */
  apiKey?: string
  /** Тема карты. Работает только с ключом: у виджета схемы нет. */
  theme?: "auto" | "light" | "dark"
  /** Идентификаторы оформления MapGL. Пусто — стиль по умолчанию. */
  lightStyleId?: string
  darkStyleId?: string
  notes?: Map003Note[]
  openLabel?: string
  providerLabel?: string
  /** Подпись поверх карты, когда MapGL не загрузился. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

type MapglPoint = [number, number]

type MapglMap = {
  destroy: () => void
}

type MapglApi = {
  Map: new (
    element: HTMLElement,
    options: {
      key: string
      center: MapglPoint
      zoom: number
      style?: string
      zoomControl?: boolean
    },
  ) => MapglMap
  Marker: new (
    map: MapglMap,
    options: { coordinates: MapglPoint },
  ) => { destroy: () => void }
}

declare global {
  interface Window {
    mapgl?: MapglApi
  }
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: карта во всю ширину и строка под ней — адрес, часы и вход.
// Подпись стоит под картой, а не поверх неё: на телефоне плашка поверх
// карты закрывает как раз тот квартал, ради которого карту и открыли.
//
// Карта настоящая в обоих режимах. Без ключа блок показывает штатный виджет
// 2ГИС (iframe, ключ не нужен). С ключом подключается MapGL — тогда
// доступны тёмное оформление и управление картой из кода.
const STYLES = `
:where([data-vibeui-block="map-003"]){
--vibeui-map-003-bg:transparent;
--vibeui-map-003-card:light-dark(oklch(1 0 0),oklch(0.21 0.008 160));
--vibeui-map-003-fg:light-dark(oklch(0.2 0.01 160),oklch(0.95 0 160));
--vibeui-map-003-muted:light-dark(oklch(0.51 0.01 160),oklch(0.72 0 160));
--vibeui-map-003-border:light-dark(oklch(0.9 0.006 160),oklch(0.32 0.01 160));
--vibeui-map-003-accent:light-dark(oklch(0.58 0.16 150),oklch(0.72 0.15 150));
--vibeui-map-003-on-accent:oklch(from var(--vibeui-map-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-map-003-canvas:light-dark(oklch(0.945 0.006 140),oklch(0.18 0.008 160));
--vibeui-map-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-003"]{color-scheme:dark}
[data-vibeui-block="map-003"]{
min-width:min(100%,16rem);
background:var(--vibeui-map-003-bg);color:var(--vibeui-map-003-fg);
font-family:var(--vibeui-map-003-sans);
}
[data-vibeui-block="map-003"] *{box-sizing:border-box}
[data-vibeui-block="map-003"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="map-003"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.75rem;margin:0 0 1.25rem;
}
[data-vibeui-block="map-003"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-map-003-accent);
}
[data-vibeui-block="map-003"] h2{
margin:0;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.375rem,3.2cqi,2rem);line-height:1.16;
}
[data-vibeui-block="map-003"] [data-part="shell"]{
overflow:hidden;border-radius:1.25rem;
border:1px solid var(--vibeui-map-003-border);
background:var(--vibeui-map-003-card);
}
[data-vibeui-block="map-003"] [data-part="stage"]{
position:relative;background:var(--vibeui-map-003-canvas);
color:var(--vibeui-map-003-fg);
height:clamp(17rem,44cqi,26rem);
border-bottom:1px solid var(--vibeui-map-003-border);
}
[data-vibeui-block="map-003"] [data-part="canvas"]{position:absolute;inset:0}
[data-vibeui-block="map-003"] iframe{
position:absolute;inset:0;width:100%;height:100%;border:0;display:block;
}
[data-vibeui-block="map-003"] [data-part="status"]{
position:absolute;left:0.75rem;top:0.75rem;z-index:2;margin:0;
padding:0.375rem 0.6875rem;border-radius:0.5rem;max-width:22rem;
background:var(--vibeui-map-003-card);border:1px solid var(--vibeui-map-003-border);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-map-003-muted);
}
[data-vibeui-block="map-003"] [data-part="bar"]{
padding:1.125rem;display:grid;gap:1rem;align-items:center;
}
[data-vibeui-block="map-003"] [data-part="bar"] h3{
margin:0;font-size:1rem;font-weight:660;line-height:1.35;
}
[data-vibeui-block="map-003"] [data-part="notes"]{
margin:0.5rem 0 0;padding:0;list-style:none;display:grid;gap:0.375rem;
}
[data-vibeui-block="map-003"] [data-part="notes"] li{
display:flex;flex-wrap:wrap;gap:0.375rem;font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="map-003"] [data-part="key"]{color:var(--vibeui-map-003-muted)}
[data-vibeui-block="map-003"] a{
display:inline-flex;align-items:center;justify-content:center;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;text-decoration:none;
font-size:0.8125rem;font-weight:640;
background:var(--vibeui-map-003-accent);color:oklch(from var(--vibeui-map-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="map-003"] :focus-visible{outline:2px solid var(--vibeui-map-003-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="map-003"] [data-part="frame"]{padding:4rem 2rem}
[data-vibeui-block="map-003"] [data-part="bar"]{grid-template-columns:1fr auto;padding:1.375rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-003"] *{animation:none!important;transition:none!important}}
`

/** Башня «Империя», Москва-Сити: точка по умолчанию. */
const FALLBACK_POINT = { latitude: 55.7482, longitude: 37.539 }

const DEFAULT_NOTES: Map003Note[] = [
  { label: "Часы", value: "Пн–Пт, 09:00–20:00" },
  { label: "Вход", value: "Со стороны набережной, подъезд 2, этаж 8" },
  { label: "Телефон", value: "+7 495 120-45-90" },
]

const STATUS_TEXT: Record<string, string> = {
  failed:
    "MapGL не загрузился — показан встроенный виджет 2ГИС. Проверьте ключ и список доменов в кабинете.",
}

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
 * Секция «адрес филиала»: карта 2ГИС во всю ширину и строка справки под ней.
 * Один файл, ноль зависимостей, ключ не обязателен.
 */
export function Map003({
  eyebrow = "Офис",
  title = "Москва-Сити, башня «Империя»",
  address = "Москва, Пресненская наб., 6с2",
  latitude = FALLBACK_POINT.latitude,
  longitude = FALLBACK_POINT.longitude,
  zoom = 16,
  city = "moscow",
  embedUrl = "",
  apiKey = "",
  theme = "auto",
  lightStyleId = "",
  darkStyleId = "e05ac437-fcc2-4845-ad74-b1de9ce07555",
  notes = DEFAULT_NOTES,
  openLabel = "Открыть в 2ГИС",
  providerLabel = "2ГИС",
  statusText,
  background = "",
  accent,
  className,
  style,
}: Map003Props) {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">(
    apiKey ? "loading" : "idle",
  )
  const [scheme, setScheme] = useState<"light" | "dark">("light")

  const point = {
    latitude: latitude ?? FALLBACK_POINT.latitude,
    longitude: longitude ?? FALLBACK_POINT.longitude,
  }
  const labels = { ...STATUS_TEXT, ...statusText }
  const mapTheme = theme === "auto" ? scheme : theme
  const styleId = mapTheme === "dark" ? darkStyleId : lightStyleId

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

  // Карта пересобирается целиком на смену темы, точки или ключа: MapGL
  // меняет оформление отдельным вызовом, но перерисовка случается редко и
  // стоит дешевле лишней ветки кода.
  useEffect(() => {
    const container = canvasRef.current

    if (!apiKey || !container) {
      return
    }

    let cancelled = false
    let map: MapglMap | null = null

    setStatus("loading")

    const build = async () => {
      await loadScript("https://mapgl.2gis.com/api/js/v1")

      const api = window.mapgl

      if (!api) {
        throw new Error("mapgl")
      }

      if (cancelled) {
        return
      }

      const center: MapglPoint = [point.longitude, point.latitude]

      container.replaceChildren()

      map = new api.Map(container, {
        key: apiKey,
        center,
        zoom,
        zoomControl: false,
        ...(styleId ? { style: styleId } : null),
      })

      new api.Marker(map, { coordinates: center })

      setStatus("ready")
    }

    build().catch(() => {
      if (!cancelled) {
        setStatus("failed")
      }
    })

    return () => {
      cancelled = true
      map?.destroy()
      container.replaceChildren()
    }
  }, [apiKey, zoom, styleId, point.latitude, point.longitude])

  // Тема карты — про карту, а не про секцию: схема фиксируется на кадре,
  // иначе строка адреса уезжает в чужую тему посреди светлой страницы.
  const stageStyle =
    theme === "auto" ? undefined : ({ colorScheme: theme } as CSSProperties)

  const palette = {
    ...(accent ? { "--vibeui-map-003-accent": accent } : null),
    ...(background ? { "--vibeui-map-003-bg": background } : null),
    ...style,
  } as CSSProperties

  // Виджет 2ГИС: ключ не нужен, точка и масштаб передаются в options.
  // Ссылка из конструктора виджетов подставляется как есть.
  const widgetOptions = encodeURIComponent(
    JSON.stringify({
      pos: { lat: point.latitude, lon: point.longitude, zoom },
      opt: { city },
    }),
  )
  const embedSource =
    embedUrl ||
    `https://widgets.2gis.com/widget?type=firmsonmap&options=${widgetOptions}`

  const openHref = `https://2gis.ru/${city}/geo/${point.longitude},${point.latitude}`

  return (
    <>
      <style href="vibeui-map-003" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={rootRef}
        data-vibeui-block="map-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div data-part="head">
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>

          <div data-part="shell">
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

            <div data-part="bar">
              <div>
                <h3>{address}</h3>
                <ul data-part="notes">
                  {notes.map((note) => (
                    <li key={note.label}>
                      <span data-part="key">{note.label}:</span>
                      <span>{note.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href={openHref} target="_blank" rel="noreferrer noopener">
                {openLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
