import type { CSSProperties, ReactNode } from "react"

type Layout012Item = {
  title: string
  note: string
  price: string
  href: string
  current?: boolean
}

export type Layout012Props = {
  /** Свой список вместо демонстрационного. */
  children?: ReactNode
  heading?: string
  resultsLabel?: string
  items?: Layout012Item[]
  listLabel?: string
  mapLabel?: string
  mapCaption?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Результаты и карта: список объектов рядом с картой, sticky-карта на
// desktop, переключатель «список / карта» на телефоне — нативные radio
// с CSS, без JS. Карта — явно обозначенная демонстрационная схема:
// реальный картографический провайдер и ключи подключает принимающий
// проект в слот-заглушку. Жесты карты не блокируют прокрутку страницы,
// потому что заглушка — обычный блок.
const STYLES = `
:where([data-vibeui-block="layout-012"]){
--vibeui-layout-012-bg:#ffffff;
--vibeui-layout-012-ink:#000000;
--vibeui-layout-012-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-012-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-012-panel:#f2f2f2;
--vibeui-layout-012-accent:#ff5900;
--vibeui-layout-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-012"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-012-bg);color:var(--vibeui-layout-012-ink);
font-family:var(--vibeui-layout-012-font);
}
[data-vibeui-block="layout-012"] *{box-sizing:border-box}
[data-vibeui-block="layout-012"] [data-part="shell"]{
max-width:88rem;margin:0 auto;padding:1.5rem 1rem 3rem;
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-012"] [data-part="top"]{
display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap;
}
[data-vibeui-block="layout-012"] [data-part="top"] h1{
margin:0;font-size:clamp(1.375rem,3cqi,1.875rem);letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-012"] [data-part="top"] span{
font-size:0.9375rem;color:var(--vibeui-layout-012-muted);
}
[data-vibeui-block="layout-012"] [data-part="switch"]{
display:flex;gap:0;margin:0;padding:0;
border:1px solid var(--vibeui-layout-012-line);border-radius:999px;
align-self:flex-start;overflow:hidden;
}
[data-vibeui-block="layout-012"] [data-part="switch"] label{
position:relative;display:inline-flex;
}
[data-vibeui-block="layout-012"] [data-part="switch"] input{
position:absolute;inset:0;opacity:0;margin:0;cursor:pointer;
}
[data-vibeui-block="layout-012"] [data-part="switch"] span{
padding:0.4375rem 1.125rem;font-size:0.875rem;font-weight:580;
}
[data-vibeui-block="layout-012"] [data-part="switch"] input:checked+span{
background:var(--vibeui-layout-012-ink);color:var(--vibeui-layout-012-bg);
}
[data-vibeui-block="layout-012"] [data-part="switch"] input:focus-visible+span{
outline:2px solid var(--vibeui-layout-012-accent);outline-offset:-2px;
}
[data-vibeui-block="layout-012"] [data-part="body"]{
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-012"] [data-part="list"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:0.75rem;
}
[data-vibeui-block="layout-012"] [data-part="card"]{
display:flex;gap:0.875rem;padding:0.75rem;
border:1px solid var(--vibeui-layout-012-line);
color:inherit;text-decoration:none;
transition:border-color .16s ease;
}
[data-vibeui-block="layout-012"] [data-part="card"]:hover{border-color:var(--vibeui-layout-012-ink)}
[data-vibeui-block="layout-012"] [data-part="card"][aria-current="true"]{
border-color:var(--vibeui-layout-012-accent);
box-shadow:inset 3px 0 0 var(--vibeui-layout-012-accent);
}
[data-vibeui-block="layout-012"] [data-part="photo"]{
flex:none;width:7.5rem;aspect-ratio:4/3;
background:linear-gradient(150deg,#2c3238 0%,#6e675c 100%);
}
[data-vibeui-block="layout-012"] [data-part="card"]:nth-child(even) [data-part="photo"]{
background:linear-gradient(150deg,#ececea 0%,#cfccc4 100%);
}
[data-vibeui-block="layout-012"] [data-part="info"]{
display:flex;flex-direction:column;gap:0.25rem;min-width:0;
}
[data-vibeui-block="layout-012"] [data-part="info"] h2{
margin:0;font-size:1rem;font-weight:640;letter-spacing:-0.01em;
}
[data-vibeui-block="layout-012"] [data-part="info"] p{
margin:0;font-size:0.8125rem;color:var(--vibeui-layout-012-muted);
}
[data-vibeui-block="layout-012"] [data-part="info"] strong{
margin-top:auto;font-size:1rem;font-weight:680;
}
[data-vibeui-block="layout-012"] [data-part="map"]{
flex:none;position:relative;overflow:hidden;
border:1px solid var(--vibeui-layout-012-line);
background:
radial-gradient(24rem 16rem at 30% 30%,color-mix(in oklab,#7f9070 26%,#e9e7e0),#e9e7e0),
#e9e7e0;
min-height:20rem;
}
[data-vibeui-block="layout-012"] [data-part="map"]::before{
content:"";position:absolute;inset:0;
background-image:linear-gradient(color-mix(in oklab,#000000 7%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in oklab,#000000 7%,transparent) 1px,transparent 1px);
background-size:3.5rem 3.5rem;
}
[data-vibeui-block="layout-012"] [data-part="pin"]{
position:absolute;width:1rem;height:1rem;border-radius:999px;
background:var(--vibeui-layout-012-accent);border:2.5px solid #ffffff;
box-shadow:0 1px 6px rgb(0 0 0 / 30%);
transform:translate(-50%,-50%);
}
[data-vibeui-block="layout-012"] [data-part="map-note"]{
position:absolute;left:0.75rem;bottom:0.75rem;
padding:0.25rem 0.625rem;background:#ffffff;border:1px solid var(--vibeui-layout-012-line);
font-size:0.75rem;color:var(--vibeui-layout-012-muted);
}
[data-vibeui-block="layout-012"] a:focus-visible{
outline:2px solid var(--vibeui-layout-012-accent);outline-offset:2px;
}
@container (max-width: 53.9375rem){
[data-vibeui-block="layout-012"]:has([data-part="switch"] input[value="map"]:checked) [data-part="list"]{display:none}
[data-vibeui-block="layout-012"]:has([data-part="switch"] input[value="list"]:checked) [data-part="map"]{display:none}
}
@container (min-width: 54rem){
[data-vibeui-block="layout-012"] [data-part="shell"]{padding:2rem 2rem 4rem}
[data-vibeui-block="layout-012"] [data-part="switch"]{display:none}
[data-vibeui-block="layout-012"] [data-part="body"]{flex-direction:row;align-items:flex-start}
[data-vibeui-block="layout-012"] [data-part="list"]{flex:0 0 26rem}
[data-vibeui-block="layout-012"] [data-part="map"]{
flex:1 1 auto;position:sticky;top:1rem;min-height:34rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Layout012Item[] = [
  { title: "Дом у озера", note: "Карелия · 4 гостя · сауна", price: "9 800 ₽ / ночь", href: "#i1", current: true },
  { title: "Квартира-студия", note: "Центр · 2 гостя", price: "4 200 ₽ / ночь", href: "#i2" },
  { title: "Гостевой флигель", note: "Суздаль · 3 гостя · сад", price: "6 500 ₽ / ночь", href: "#i3" },
  { title: "Мансарда «Свет»", note: "Казань · 2 гостя · вид", price: "5 100 ₽ / ночь", href: "#i4" },
]

const PINS = [
  { left: "32%", top: "34%" },
  { left: "58%", top: "52%" },
  { left: "44%", top: "68%" },
  { left: "70%", top: "28%" },
] as const

/** Каркас «список и карта»: sticky-карта, выбранный объект и мобильный переключатель. */
export function Layout012({
  children,
  heading = "Жильё в поездку",
  resultsLabel = "48 вариантов",
  items = DEFAULT_ITEMS,
  listLabel = "Список",
  mapLabel = "Карта",
  mapCaption = "Демонстрационная схема — не карта",
  accent,
  className,
  style,
}: Layout012Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-012" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-012" className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <h1>{heading}</h1>
            <span>{resultsLabel}</span>
          </div>
          <fieldset data-part="switch" aria-label={`${listLabel} / ${mapLabel}`}>
            <label>
              <input type="radio" name="vibeui-layout-012-view" value="list" defaultChecked />
              <span>{listLabel}</span>
            </label>
            <label>
              <input type="radio" name="vibeui-layout-012-view" value="map" />
              <span>{mapLabel}</span>
            </label>
          </fieldset>
          <div data-part="body">
            <div data-part="list">
              {children ??
                items.map((item) => (
                  <a
                    data-part="card"
                    href={item.href}
                    aria-current={item.current ? "true" : undefined}
                    key={item.href}
                  >
                    <span data-part="photo" aria-hidden="true" />
                    <span data-part="info">
                      <h2>{item.title}</h2>
                      <p>{item.note}</p>
                      <strong>{item.price}</strong>
                    </span>
                  </a>
                ))}
            </div>
            <div data-part="map" role="img" aria-label={mapCaption}>
              {PINS.map((pin, index) => (
                <span data-part="pin" style={{ left: pin.left, top: pin.top }} key={index} />
              ))}
              <span data-part="map-note">{mapCaption}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
