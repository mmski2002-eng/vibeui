"use client"

import { useEffect, useRef, useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"
import type { CSSProperties } from "react"

export type Map001Props = {
  eyebrow?: string
  title?: string
  description?: string
  /** Адрес точки: подпись карточки, ссылки и запрос, если координат нет. */
  address?: string
  /** Координаты метки. Пусто — виджет ищет точку по адресу. */
  latitude?: number
  longitude?: number
  zoom?: number
  /** Ключ JS API. Пусто — работает встроенный виджет Яндекс Карт. */
  apiKey?: string
  /** "auto" следует теме страницы, остальные два фиксируют схему карты. */
  theme?: "auto" | "light" | "dark"
  details?: string[]
  routeLabel?: string
  openLabel?: string
  providerLabel?: string
  /** Подпись поверх карты, когда JS API не загрузился. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

type YandexPoint = [number, number]

type YandexMap = {
  addChild: (child: unknown) => void
  destroy: () => void
}

type YandexApi = {
  ready: Promise<void>
  YMap: new (
    element: HTMLElement,
    props: {
      location: { center: YandexPoint; zoom: number }
      theme?: "light" | "dark"
    },
  ) => YandexMap
  YMapDefaultSchemeLayer: new (props: { theme?: "light" | "dark" }) => unknown
  YMapDefaultFeaturesLayer: new (props: Record<string, never>) => unknown
  YMapMarker: new (
    props: { coordinates: YandexPoint },
    element?: HTMLElement,
  ) => unknown
  search?: (request: {
    text: string
  }) => Promise<{ geometry?: { coordinates: YandexPoint } }[]>
}

declare global {
  interface Window {
    ymaps3?: YandexApi
  }
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: карта — это не картинка, а ответ на вопрос «как до вас
// доехать». Поэтому рядом с картой стоит карточка с адресом, ориентиром и
// кнопкой маршрута: человек копирует адрес или сразу строит путь, не
// разглядывая метку.
//
// Карта настоящая в обоих режимах. Без ключа блок показывает штатный виджет
// Яндекс Карт (iframe, ключ не нужен, тёмная схема включается параметром
// theme). С ключом подключается JS API v3 — тогда картой можно управлять из
// кода и искать точку по адресу.
const STYLES = `
:where([data-vibeui-block="map-001"]){
--vibeui-map-001-bg:transparent;
--vibeui-map-001-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-map-001-fg:light-dark(oklch(0.2 0 265),oklch(0.95 0 265));
--vibeui-map-001-muted:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
--vibeui-map-001-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-map-001-accent:light-dark(oklch(0.58 0.21 25),oklch(0.7 0.19 25));
--vibeui-map-001-on-accent:oklch(from var(--vibeui-map-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-map-001-canvas:light-dark(oklch(0.945 0.005 100),oklch(0.19 0.008 265));
--vibeui-map-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-001"]{color-scheme:dark}
[data-vibeui-block="map-001"]{
min-width:min(100%,16rem);
background:var(--vibeui-map-001-bg);color:var(--vibeui-map-001-fg);
font-family:var(--vibeui-map-001-sans);
}
[data-vibeui-block="map-001"] *{box-sizing:border-box}
[data-vibeui-block="map-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="map-001"] [data-part="head"]{max-width:46ch;margin:0 0 1.5rem}
[data-vibeui-block="map-001"] [data-part="stage"]{
position:relative;overflow:hidden;border-radius:1.5rem;
color:var(--vibeui-map-001-fg);
border:1px solid var(--vibeui-map-001-border);
background:var(--vibeui-map-001-card);
}
/* Кадр карты и карточка адреса — соседи, а не слои: на узкой ширине
   карточка накрывала карту целиком и от карты не оставалось ничего. */
[data-vibeui-block="map-001"] [data-part="map"]{
position:relative;overflow:hidden;
background:var(--vibeui-map-001-canvas);
height:clamp(15rem,52cqi,30rem);
}
[data-vibeui-block="map-001"] [data-part="canvas"]{position:absolute;inset:0}
[data-vibeui-block="map-001"] iframe{
position:absolute;inset:0;width:100%;height:100%;border:0;display:block;
}
[data-vibeui-block="map-001"] [data-part="card"]{
position:relative;z-index:2;display:block;padding:1.125rem;
}
[data-vibeui-block="map-001"] [data-part="card"] h3{
margin:0;font-size:1.0625rem;font-weight:660;letter-spacing:-0.01em;line-height:1.3;
}
[data-vibeui-block="map-001"] ul{margin:0.625rem 0 0;padding:0;list-style:none;display:grid;gap:0.3125rem}
[data-vibeui-block="map-001"] li{
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-map-001-muted);
padding-left:0.875rem;position:relative;
}
[data-vibeui-block="map-001"] li::before{
content:"";position:absolute;left:0;top:0.5rem;
width:0.3125rem;height:0.3125rem;border-radius:50%;
background:var(--vibeui-map-001-accent);color:oklch(from var(--vibeui-map-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="map-001"] [data-part="actions"]{
margin-top:0.875rem;display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="map-001"] a{
display:inline-flex;align-items:center;height:2.375rem;padding:0 0.9375rem;
border-radius:0.6875rem;text-decoration:none;
font-size:0.8125rem;font-weight:640;
background:var(--vibeui-map-001-accent);color:oklch(from var(--vibeui-map-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="map-001"] a[data-variant="ghost"]{
background:transparent;color:var(--vibeui-map-001-fg);
border:1px solid var(--vibeui-map-001-border);
}
[data-vibeui-block="map-001"] [data-part="status"]{
position:absolute;left:0.75rem;top:0.75rem;z-index:2;margin:0;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
background:var(--vibeui-map-001-card);border:1px solid var(--vibeui-map-001-border);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-map-001-muted);max-width:22rem;
}
[data-vibeui-block="map-001"] [data-part="pin"]{
position:absolute;left:50%;top:44%;z-index:1;
width:1.375rem;height:1.375rem;margin:-1.375rem 0 0 -0.6875rem;
border-radius:50% 50% 50% 0;transform:rotate(-45deg);
background:var(--vibeui-map-001-accent);
box-shadow:0 0.5rem 1rem -0.375rem rgb(0 0 0 / 0.5);color:oklch(from var(--vibeui-map-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="map-001"] [data-part="pin"]::after{
content:"";position:absolute;inset:0.375rem;border-radius:50%;
background:var(--vibeui-map-001-card);
}
[data-vibeui-block="map-001"] :focus-visible{outline:2px solid var(--vibeui-map-001-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="map-001"] [data-part="frame"]{padding:4rem 2rem}
[data-vibeui-block="map-001"] [data-part="map"]{height:clamp(22rem,54cqi,34rem)}
[data-vibeui-block="map-001"] [data-part="card"]{
position:absolute;right:1.25rem;bottom:1.25rem;width:23rem;padding:1.375rem;
border-radius:1.125rem;
background:var(--vibeui-map-001-card);border:1px solid var(--vibeui-map-001-border);
box-shadow:0 1.25rem 2.5rem -1.5rem rgb(0 0 0 / 0.45);
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-001"] *{animation:none!important;transition:none!important}}
`

/** Башня «Федерация», Москва-Сити: точка по умолчанию. */
const FALLBACK_POINT = { latitude: 55.7495, longitude: 37.5372 }

const DEFAULT_DETAILS = [
  "Пн–Пт, 10:00–19:00, вход через северный вестибюль",
  "м. «Деловой центр» — 5 минут пешком, м. «Выставочная» — 8 минут",
  "Парковка на −2 этаже, первый час бесплатно по пропуску с ресепшена",
]

const STATUS_TEXT: Record<string, string> = {
  failed:
    "JS API не загрузился — показан встроенный виджет Яндекс Карт. Проверьте ключ и домен в кабинете разработчика.",
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
 * Секция «как добраться»: карта Яндекса во всю ширину и карточка адреса
 * рядом. Один файл, ноль зависимостей, ключ не обязателен.
 */
export function Map001({
  eyebrow = "Как добраться",
  title = "Офис в Москва-Сити",
  description = "Башня «Федерация», 42 этаж. Метка на карте ведёт ко входу, а не к середине квартала: в Сити это разница в пятнадцать минут.",
  address = "Москва, Пресненская наб., 12, башня «Федерация»",
  latitude = FALLBACK_POINT.latitude,
  longitude = FALLBACK_POINT.longitude,
  zoom = 16,
  apiKey = "",
  theme = "auto",
  details = DEFAULT_DETAILS,
  routeLabel = "Построить маршрут",
  openLabel = "Открыть в Яндекс Картах",
  providerLabel = "Яндекс Карты",
  statusText,
  background = "",
  accent,
  className,
  style,
}: Map001Props) {
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

  // Карта пересобирается целиком на смену темы, адреса или ключа: у v3 для
  // каждого из этих случаев свой способ обновления, а перерисовка карты
  // случается раз в сессию и стоит дешевле трёх веток кода.
  useEffect(() => {
    const container = canvasRef.current

    if (!apiKey || !container) {
      return
    }

    let cancelled = false
    let map: YandexMap | null = null

    setStatus("loading")

    const build = async () => {
      await loadScript(
        `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`,
      )

      const api = window.ymaps3

      if (!api) {
        throw new Error("ymaps3")
      }

      await api.ready

      if (cancelled) {
        return
      }

      let center: YandexPoint = [point.longitude, point.latitude]

      // Геокодер вызывается только когда координат нет: явно заданная точка
      // всегда точнее адреса, разобранного по строке.
      if (!hasPoint && address) {
        try {
          const found = await api.search?.({ text: address })
          const coordinates = found?.[0]?.geometry?.coordinates

          if (coordinates) {
            center = coordinates
          }
        } catch {
          // Поиск может быть не подключён к ключу — тогда остаётся запасная точка.
        }
      }

      if (cancelled) {
        return
      }

      container.replaceChildren()

      map = new api.YMap(container, {
        location: { center, zoom },
        theme: mapTheme,
      })
      map.addChild(new api.YMapDefaultSchemeLayer({ theme: mapTheme }))
      map.addChild(new api.YMapDefaultFeaturesLayer({}))

      const marker = document.createElement("div")
      marker.dataset.part = "pin"
      marker.style.position = "relative"
      marker.style.left = "0"
      marker.style.top = "0"
      marker.style.margin = "0"
      map.addChild(new api.YMapMarker({ coordinates: center }, marker))

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
  }, [
    apiKey,
    address,
    hasPoint,
    zoom,
    mapTheme,
    point.latitude,
    point.longitude,
  ])

  // Тема карты — про карту, а не про секцию: схема фиксируется на кадре,
  // иначе заголовок над картой уезжает в чужую тему посреди светлой страницы.
  const stageStyle =
    theme === "auto" ? undefined : ({ colorScheme: theme } as CSSProperties)

  const palette = {
    ...(accent ? { "--vibeui-map-001-accent": accent } : null),
    ...(background ? { "--vibeui-map-001-bg": background } : null),
    ...style,
  } as CSSProperties

  // Виджет Яндекс Карт: ключ не нужен, тёмная схема включается параметром.
  // Координаты дают чистый кадр с меткой, адрес — поиск с карточкой места.
  const widget = hasPoint
    ? `ll=${point.longitude},${point.latitude}&z=${zoom}&pt=${point.longitude},${point.latitude},pm2rdm`
    : `text=${encodeURIComponent(address)}&z=${zoom}`
  const embedSource = `https://yandex.ru/map-widget/v1/?${widget}&lang=ru_RU&theme=${mapTheme}`

  const routeHref = `https://yandex.ru/maps/?rtext=~${point.latitude},${point.longitude}&rtt=auto`
  const openHref = `https://yandex.ru/maps/?pt=${point.longitude},${point.latitude},pm2rdm&z=${zoom}`

  return (
    <>
      <style href="vibeui-map-001" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={rootRef}
        data-vibeui-block="map-001"
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

          <div data-part="stage" style={stageStyle}>
            <div data-part="map">
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

            <aside data-part="card">
              <h3>{address}</h3>
              <ul>
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
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
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
