import type { CSSProperties } from "react"

export type Commerce031Point = {
  id: string
  name: string
  address: string
  hours: string
  eta: string
  top: number
  left: number
}

export type Commerce031Props = {
  title?: string
  city?: string
  courierLabel?: string
  courierHint?: string
  pickupLabel?: string
  pickupHint?: string
  points?: Commerce031Point[]
  mapNote?: string
  cta?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: доставка и самовывоз в одном экране, где список пунктов
// появляется только под выбранным самовывозом — раскрытие сделано на :has()
// у отмеченной радиокнопки, поэтому состояния нет и блок остаётся серверным.
// Карта — заглушка из CSS-сетки: настоящая карта тянет ключ, скрипт и
// сторонний домен, а блок обязан работать в чужом проекте без них.
const STYLES = `
:where([data-vibeui-block="commerce-031"]){
--vibeui-commerce-031-bg:oklch(1 0 0);
--vibeui-commerce-031-fg:oklch(0.21 0.014 265);
--vibeui-commerce-031-muted:oklch(0.55 0.014 265);
--vibeui-commerce-031-border:oklch(0.91 0.006 265);
--vibeui-commerce-031-soft:oklch(0.975 0.004 265);
--vibeui-commerce-031-accent:oklch(0.53 0.16 250);
--vibeui-commerce-031-land:oklch(0.96 0.015 160);
--vibeui-commerce-031-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-031"]{
box-sizing:border-box;background:var(--vibeui-commerce-031-bg);
color:var(--vibeui-commerce-031-fg);font-family:var(--vibeui-commerce-031-sans);
}
[data-vibeui-block="commerce-031"] *{box-sizing:border-box}
[data-vibeui-block="commerce-031"] [data-part="shell"]{max-width:56rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-031"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-031"] [data-part="city"]{margin:0 0 1rem;font-size:0.8125rem;color:var(--vibeui-commerce-031-muted)}
[data-vibeui-block="commerce-031"] [data-part="city"] a{color:var(--vibeui-commerce-031-accent)}
[data-vibeui-block="commerce-031"] [data-part="ways"]{border:0;margin:0;padding:0;display:grid;gap:0.625rem}
@container (min-width: 40rem){
[data-vibeui-block="commerce-031"] [data-part="ways"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-031"] [data-part="way"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="commerce-031"] [data-part="way"] input{position:absolute;top:0.9375rem;left:0.9375rem;margin:0;accent-color:var(--vibeui-commerce-031-accent);width:1.125rem;height:1.125rem}
[data-vibeui-block="commerce-031"] [data-part="face"]{
display:block;padding:0.875rem 0.875rem 0.875rem 2.75rem;border-radius:1rem;
border:1px solid var(--vibeui-commerce-031-border);background:var(--vibeui-commerce-031-bg);
transition:border-color .15s ease,background-color .15s ease;
}
[data-vibeui-block="commerce-031"] [data-part="way"] input:checked + [data-part="face"]{
border-color:var(--vibeui-commerce-031-accent);
background:color-mix(in oklab,var(--vibeui-commerce-031-accent) 7%,transparent);
}
[data-vibeui-block="commerce-031"] [data-part="way"] input:focus-visible + [data-part="face"]{outline:2px solid var(--vibeui-commerce-031-accent);outline-offset:2px}
[data-vibeui-block="commerce-031"] [data-part="face"] b{display:block;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="commerce-031"] [data-part="face"] span{display:block;margin-top:0.1875rem;font-size:0.8125rem;color:var(--vibeui-commerce-031-muted);line-height:1.45}
/* Список пунктов раскрывается на :has(): состояния нет, блок остаётся серверным. */
[data-vibeui-block="commerce-031"] [data-part="pickup"]{display:none}
[data-vibeui-block="commerce-031"] [data-part="shell"]:has(#commerce-031-pickup:checked) [data-part="pickup"]{display:block}
[data-vibeui-block="commerce-031"] [data-part="courier"]{display:none}
[data-vibeui-block="commerce-031"] [data-part="shell"]:has(#commerce-031-courier:checked) [data-part="courier"]{display:block}
[data-vibeui-block="commerce-031"] [data-part="pane"]{
margin-top:0.875rem;border:1px solid var(--vibeui-commerce-031-border);border-radius:1.125rem;overflow:hidden;
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-031"] [data-part="pane"]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr)}
}
/* Карта — CSS-заглушка: настоящая тянет ключ, скрипт и сторонний домен. */
[data-vibeui-block="commerce-031"] [data-part="map"]{
position:relative;min-height:13rem;
background:
linear-gradient(var(--vibeui-commerce-031-border) 1px,transparent 1px) 0 0 / 100% 3rem,
linear-gradient(90deg,var(--vibeui-commerce-031-border) 1px,transparent 1px) 0 0 / 3rem 100%,
linear-gradient(115deg,oklch(0.93 0.03 250) 0 22%,transparent 22%),
var(--vibeui-commerce-031-land);
}
[data-vibeui-block="commerce-031"] [data-part="pin"]{
position:absolute;transform:translate(-50%,-100%);
width:1.5rem;height:1.5rem;border-radius:9999px 9999px 9999px 2px;rotate:45deg;
background:var(--vibeui-commerce-031-accent);border:2px solid oklch(1 0 0);
box-shadow:0 2px 6px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="commerce-031"] [data-part="pin"] i{
position:absolute;inset:0;display:grid;place-items:center;rotate:-45deg;
font-style:normal;font-size:0.625rem;font-weight:800;color:oklch(1 0 0);
}
[data-vibeui-block="commerce-031"] [data-part="mapnote"]{
position:absolute;left:0.5rem;bottom:0.5rem;margin:0;padding:0.25rem 0.5rem;border-radius:0.5rem;
background:oklch(1 0 0 / 88%);font-size:0.625rem;color:var(--vibeui-commerce-031-muted);
}
[data-vibeui-block="commerce-031"] ul{list-style:none;margin:0;padding:0.5rem;display:grid;gap:0.375rem;max-height:22rem;overflow-y:auto}
[data-vibeui-block="commerce-031"] [data-part="point"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="commerce-031"] [data-part="point"] input{position:absolute;top:0.75rem;left:0.75rem;margin:0;accent-color:var(--vibeui-commerce-031-accent)}
[data-vibeui-block="commerce-031"] [data-part="card"]{
display:block;padding:0.625rem 0.625rem 0.625rem 2.25rem;border-radius:0.875rem;
border:1px solid transparent;
}
[data-vibeui-block="commerce-031"] [data-part="point"] input:checked + [data-part="card"]{
border-color:var(--vibeui-commerce-031-accent);background:var(--vibeui-commerce-031-soft);
}
[data-vibeui-block="commerce-031"] [data-part="point"] input:focus-visible + [data-part="card"]{outline:2px solid var(--vibeui-commerce-031-accent);outline-offset:1px}
[data-vibeui-block="commerce-031"] [data-part="card"] b{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-031"] [data-part="addr"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-commerce-031-muted)}
[data-vibeui-block="commerce-031"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.3125rem;font-size:0.6875rem;color:var(--vibeui-commerce-031-muted)}
[data-vibeui-block="commerce-031"] [data-part="eta"]{color:oklch(0.5 0.13 150);font-weight:650}
[data-vibeui-block="commerce-031"] [data-part="fields"]{padding:0.875rem;display:grid;gap:0.625rem}
@container (min-width: 40rem){
[data-vibeui-block="commerce-031"] [data-part="fields"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-031"] [data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="commerce-031"] [data-part="wide"]{display:grid;gap:0.25rem;grid-column:1 / -1}
[data-vibeui-block="commerce-031"] label span{font-size:0.75rem;font-weight:600;color:var(--vibeui-commerce-031-muted)}
[data-vibeui-block="commerce-031"] input[type="text"]{
width:100%;height:2.5rem;padding:0 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-031-border);background:var(--vibeui-commerce-031-bg);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="commerce-031"] input[type="text"]:focus-visible{outline:2px solid var(--vibeui-commerce-031-accent);outline-offset:1px}
[data-vibeui-block="commerce-031"] [data-part="cta"]{
margin-top:1rem;width:100%;appearance:none;border:0;cursor:pointer;height:3rem;border-radius:0.875rem;
background:var(--vibeui-commerce-031-accent);color:oklch(1 0 0);font:inherit;font-size:1rem;font-weight:700;
}
[data-vibeui-block="commerce-031"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-031-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Commerce031Point[] = [
  {
    id: "p1",
    name: "Пункт выдачи на Марата",
    address: "ул. Марата, 14, вход со двора",
    hours: "10:00–21:00, без выходных",
    eta: "завтра к 12:00",
    top: 34,
    left: 28,
  },
  {
    id: "p2",
    name: "Постамат в «Круге»",
    address: "пр. Ленина, 90, 1 этаж у эскалатора",
    hours: "круглосуточно",
    eta: "завтра к 18:00",
    top: 58,
    left: 62,
  },
  {
    id: "p3",
    name: "Магазин на Речной",
    address: "Речная наб., 3, примерочная есть",
    hours: "09:00–20:00, вс — до 18:00",
    eta: "послезавтра",
    top: 22,
    left: 72,
  },
]

/**
 * Доставка и самовывоз одним экраном: пункты на карте-заглушке раскрываются под самовывозом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce031({
  title = "Как доставить заказ",
  city = "Петрозаводск",
  courierLabel = "Курьером до двери",
  courierHint = "490 ₽ · завтра, 12:00–18:00. Бесплатно при заказе от 5 000 ₽.",
  pickupLabel = "Забрать самому",
  pickupHint = "Бесплатно · 3 пункта рядом. Хранение 7 дней, примерка на месте.",
  points = DEFAULT_POINTS,
  mapNote = "Схема условная",
  cta = "Сохранить способ доставки",
  accent,
  className,
  style,
}: Commerce031Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-031" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-031"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="city">
            Город доставки: <b>{city}</b> · <a href="#city">изменить</a>
          </p>

          <fieldset data-part="ways">
            <legend hidden>Способ получения</legend>
            <label data-part="way">
              <input
                type="radio"
                name="commerce-031-way"
                id="commerce-031-courier"
                defaultChecked
              />
              <span data-part="face">
                <b>{courierLabel}</b>
                <span>{courierHint}</span>
              </span>
            </label>
            <label data-part="way">
              <input
                type="radio"
                name="commerce-031-way"
                id="commerce-031-pickup"
              />
              <span data-part="face">
                <b>{pickupLabel}</b>
                <span>{pickupHint}</span>
              </span>
            </label>
          </fieldset>

          <div data-part="courier">
            <div data-part="pane">
              <div data-part="fields">
                <div data-part="field">
                  <label htmlFor="commerce-031-street">
                    <span>Улица и дом</span>
                  </label>
                  <input
                    id="commerce-031-street"
                    type="text"
                    defaultValue="ул. Кирова, 12"
                  />
                </div>
                <div data-part="field">
                  <label htmlFor="commerce-031-flat">
                    <span>Квартира</span>
                  </label>
                  <input id="commerce-031-flat" type="text" defaultValue="47" />
                </div>
                <div data-part="field">
                  <label htmlFor="commerce-031-code">
                    <span>Код домофона</span>
                  </label>
                  <input
                    id="commerce-031-code"
                    type="text"
                    defaultValue="47К"
                  />
                </div>
                <div data-part="field">
                  <label htmlFor="commerce-031-floor">
                    <span>Этаж</span>
                  </label>
                  <input id="commerce-031-floor" type="text" defaultValue="5" />
                </div>
                <div data-part="wide">
                  <label htmlFor="commerce-031-note">
                    <span>Что сказать курьеру</span>
                  </label>
                  <input
                    id="commerce-031-note"
                    type="text"
                    defaultValue="Позвонить за 20 минут"
                  />
                </div>
              </div>
              <div data-part="map" aria-hidden="true">
                <span
                  data-part="pin"
                  style={{ top: "44%", left: "40%" } as CSSProperties}
                >
                  <i>Д</i>
                </span>
                <p data-part="mapnote">{mapNote}</p>
              </div>
            </div>
          </div>

          <div data-part="pickup">
            <div data-part="pane">
              <div data-part="map" aria-hidden="true">
                {points.map((point, index) => (
                  <span
                    key={point.id}
                    data-part="pin"
                    style={
                      {
                        top: `${point.top}%`,
                        left: `${point.left}%`,
                      } as CSSProperties
                    }
                  >
                    <i>{index + 1}</i>
                  </span>
                ))}
                <p data-part="mapnote">{mapNote}</p>
              </div>
              <ul>
                {points.map((point, index) => (
                  <li key={point.id}>
                    <label data-part="point">
                      <input
                        type="radio"
                        name="commerce-031-point"
                        defaultChecked={index === 0}
                      />
                      <span data-part="card">
                        <b>
                          {index + 1}. {point.name}
                        </b>
                        <span data-part="addr">{point.address}</span>
                        <span data-part="meta">
                          <span>{point.hours}</span>
                          <span data-part="eta">{point.eta}</span>
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button type="button" data-part="cta">
            {cta}
          </button>
        </div>
      </section>
    </>
  )
}
