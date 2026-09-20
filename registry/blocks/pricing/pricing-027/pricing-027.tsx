"use client"

import { useEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"

export type Pricing027Item = {
  name: string
  note?: string
  /** Цена строкой: «от 1 200 ₽», «бесплатно». */
  price: string
  popular?: boolean
}

export type Pricing027Group = {
  key: string
  label: string
  items: readonly Pricing027Item[]
}

export type Pricing027Props = {
  eyebrow?: string
  title?: string
  lede?: string
  groups?: readonly Pricing027Group[]
  defaultGroup?: string
  actionLabel?: string
  actionHref?: string
  fine?: string
  /** Событие в window, по которому вкладка переключается снаружи (detail.pet = key группы). Пусто — не слушать. */
  eventName?: string
  /** aria вкладок и стикер популярной позиции. */
  tabsLabel?: string
  popularLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Услуги и цены ветклиники: вкладки по виду питомца, под ними карточки-
// тикеты с перфорацией между названием и ценой, spotlight за курсором
// (--x/--y на карточке через currentTarget, без стейта), стикер «чаще
// всего» с поворотом. Блок слушает CustomEvent из window — хиро с
// переключателем питомца переключает вкладку и здесь.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-027"]){
--vibeui-pricing-027-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-027-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-027-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-027-on-accent:oklch(from var(--vibeui-pricing-027-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-027-muted:color-mix(in oklab,var(--vibeui-pricing-027-fg) 62%,var(--vibeui-pricing-027-bg));
--vibeui-pricing-027-line:color-mix(in oklab,var(--vibeui-pricing-027-fg) 12%,transparent);
--vibeui-pricing-027-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-pricing-027-bg) 88%,#fff));
--vibeui-pricing-027-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-027-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-027"]{color-scheme:dark}
:where([data-vibeui-block="pricing-027"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-027"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-027"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-pricing-027-bg);color:var(--vibeui-pricing-027-fg);font-family:var(--vibeui-pricing-027-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-027"] *{box-sizing:border-box}
[data-vibeui-block="pricing-027"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-027"] [data-part="head"]{display:grid;grid-template-columns:minmax(0,1fr);gap:1.2rem;align-items:end}
[data-vibeui-block="pricing-027"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-pricing-027-accent)}
[data-vibeui-block="pricing-027"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-027-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="pricing-027"] [data-part="lede"]{margin:.9rem 0 0;max-width:34rem;color:var(--vibeui-pricing-027-muted)}
[data-vibeui-block="pricing-027"] [data-part="tabs"]{display:flex;flex-wrap:wrap;gap:.4rem;padding:.3rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-pricing-027-fg) 6%,transparent);width:fit-content;max-width:100%}
[data-vibeui-block="pricing-027"] [data-part="tabs"] button{padding:.55rem 1.05rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-pricing-027-muted);font-family:var(--vibeui-pricing-027-display);font-weight:800;font-size:.92rem;cursor:pointer;transition:background .25s,color .25s,transform .25s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="pricing-027"] [data-part="tabs"] button[aria-selected="true"]{background:var(--vibeui-pricing-027-accent);color:var(--vibeui-pricing-027-on-accent);transform:scale(1.04)}
[data-vibeui-block="pricing-027"] [data-part="tabs"] button:focus-visible{outline:2px solid var(--vibeui-pricing-027-accent);outline-offset:2px}
[data-vibeui-block="pricing-027"] [data-part="grid"]{display:grid;gap:1rem;margin:2.2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="pricing-027"] [data-part="ticket"]{position:relative;display:grid;grid-template-rows:1fr auto;border-radius:1.4rem;background:var(--vibeui-pricing-027-card);border:1px solid var(--vibeui-pricing-027-line);overflow:hidden;isolation:isolate;animation:vibeui-pricing-027-rise .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-pricing-027-i) * 50ms);transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}
[data-vibeui-block="pricing-027"] [data-part="ticket"]:hover{transform:translateY(-4px);box-shadow:0 24px 40px -28px rgb(0 0 0 / .5)}
[data-vibeui-block="pricing-027"] [data-part="ticket"]::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(14rem circle at var(--vibeui-pricing-027-x,50%) var(--vibeui-pricing-027-y,50%),color-mix(in oklab,var(--vibeui-pricing-027-accent) 14%,transparent),transparent 70%);opacity:0;transition:opacity .3s}
[data-vibeui-block="pricing-027"] [data-part="ticket"]:hover::before{opacity:1}
[data-vibeui-block="pricing-027"] [data-part="top"]{padding:1.3rem 1.3rem 1.1rem}
[data-vibeui-block="pricing-027"] [data-part="top"] h3{margin:0;padding-right:4.5rem;font-family:var(--vibeui-pricing-027-display);font-weight:800;font-size:1.15rem;line-height:1.2;letter-spacing:-.01em}
[data-vibeui-block="pricing-027"] [data-part="top"] p{margin:.45rem 0 0;font-size:.88rem;color:var(--vibeui-pricing-027-muted)}
[data-vibeui-block="pricing-027"] [data-part="tear"]{position:relative;height:0;border-top:2px dashed var(--vibeui-pricing-027-line)}
[data-vibeui-block="pricing-027"] [data-part="tear"]::before,[data-vibeui-block="pricing-027"] [data-part="tear"]::after{content:"";position:absolute;top:-.7rem;width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-027-bg);border:1px solid var(--vibeui-pricing-027-line)}
[data-vibeui-block="pricing-027"] [data-part="tear"]::before{left:-.8rem}
[data-vibeui-block="pricing-027"] [data-part="tear"]::after{right:-.8rem}
[data-vibeui-block="pricing-027"] [data-part="bottom"]{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.9rem 1.3rem 1.1rem}
[data-vibeui-block="pricing-027"] [data-part="price"]{font-family:var(--vibeui-pricing-027-display);font-weight:900;font-size:1.5rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="pricing-027"] [data-part="bottom"] a{display:inline-flex;align-items:center;gap:.3rem;padding:.5rem .9rem;border-radius:999px;border:1px solid var(--vibeui-pricing-027-line);color:var(--vibeui-pricing-027-fg);text-decoration:none;font-weight:600;font-size:.85rem;white-space:nowrap;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="pricing-027"] [data-part="bottom"] a:hover{background:var(--vibeui-pricing-027-accent);color:var(--vibeui-pricing-027-on-accent);border-color:transparent}
[data-vibeui-block="pricing-027"] [data-part="bottom"] a:focus-visible{outline:2px solid var(--vibeui-pricing-027-accent);outline-offset:2px}
[data-vibeui-block="pricing-027"] [data-part="sticker"]{position:absolute;top:.9rem;right:-.2rem;padding:.3rem .7rem;border-radius:.5rem;background:var(--vibeui-pricing-027-accent);color:var(--vibeui-pricing-027-on-accent);font-family:var(--vibeui-pricing-027-display);font-weight:800;font-size:.7rem;letter-spacing:.02em;transform:rotate(6deg);box-shadow:0 6px 14px -6px var(--vibeui-pricing-027-accent)}
[data-vibeui-block="pricing-027"] [data-part="fine"]{margin:1.6rem 0 0;font-size:.82rem;color:var(--vibeui-pricing-027-muted)}
@keyframes vibeui-pricing-027-rise{from{opacity:0;transform:translateY(12px)}}
@container (min-width: 40rem){[data-vibeui-block="pricing-027"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 56rem){[data-vibeui-block="pricing-027"] [data-part="head"]{grid-template-columns:1fr auto}}
@container (min-width: 64rem){[data-vibeui-block="pricing-027"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-027"] *{animation:none!important;transition:none!important}}`

const DEFAULT_GROUPS: Pricing027Group[] = [
  {
    key: "cat",
    label: "Кошки",
    items: [
      { name: "Первичный приём терапевта", note: "Осмотр, план лечения, ответы на все «а это нормально?»", price: "1 200 ₽", popular: true },
      { name: "Комплексная прививка", note: "Нобивак Tricat + бешенство, паспорт заполним", price: "2 400 ₽" },
      { name: "Стерилизация кошки", note: "Лапароскопия, шов не снимать, домой в тот же день", price: "9 800 ₽", popular: true },
      { name: "Кастрация кота", note: "20 минут под наркозом, вечером уже требует еду", price: "4 500 ₽" },
      { name: "Чистка зубов ультразвуком", note: "Под седацией, с полировкой", price: "6 900 ₽" },
      { name: "Стрижка когтей", note: "Пока ждёте приём — бесплатно", price: "400 ₽" },
    ],
  },
  {
    key: "dog",
    label: "Собаки",
    items: [
      { name: "Первичный приём терапевта", note: "Осмотр, взвешивание, план, лакомство после", price: "1 400 ₽", popular: true },
      { name: "Комплексная прививка", note: "Нобивак DHPPi + Lepto + бешенство", price: "2 600 ₽" },
      { name: "Стерилизация суки", note: "Лапароскопически, до 25 кг", price: "14 500 ₽" },
      { name: "Приём ортопеда", note: "Хромота, дисплазия, «прыгает, но странно»", price: "2 200 ₽", popular: true },
      { name: "Чистка зубов ультразвуком", note: "Под седацией, с полировкой", price: "8 400 ₽" },
      { name: "Чипирование", note: "Чип + внесение в базу, 5 минут", price: "1 500 ₽" },
    ],
  },
  {
    key: "rabbit",
    label: "Кролики и грызуны",
    items: [
      { name: "Приём ратолога", note: "Врач по кроликам и грызунам — каждый день", price: "1 500 ₽", popular: true },
      { name: "Подпиливание зубов", note: "Резцы, под лёгкой седацией", price: "2 800 ₽" },
      { name: "Кастрация кролика", note: "Ингаляционный наркоз, домой через 3 часа", price: "5 900 ₽" },
      { name: "Прививка ВГБК + миксоматоз", note: "Раз в полгода, паспорт заполним", price: "1 900 ₽" },
      { name: "Стрижка когтей", note: "Пять минут и морковка", price: "350 ₽" },
      { name: "УЗИ брюшной полости", note: "«Не ест со вчера» — это сюда, срочно", price: "2 300 ₽" },
    ],
  },
]

function spotlight(event: ReactPointerEvent<HTMLLIElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--vibeui-pricing-027-x", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--vibeui-pricing-027-y", `${event.clientY - rect.top}px`)
}

/** Прайс-тикеты с вкладками по виду питомца. */
export function Pricing027({
  eyebrow = "Услуги и цены",
  title = "Без «уточняйте у администратора»",
  lede = "Цены фиксированные и написаны заранее. Если во время приёма что-то понадобится сверх плана — сначала спросим, потом сделаем.",
  groups = DEFAULT_GROUPS,
  defaultGroup = "cat",
  actionLabel = "Записаться",
  actionHref = "#contacts",
  fine = "Полный прайс — 140 позиций — выдаём на ресепшене и присылаем в мессенджер. Ночной приём с 22:00 до 8:00 дороже на 30 %.",
  eventName = "vibeui-vet:pet",
  tabsLabel = "Вид питомца",
  popularLabel = "чаще всего",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing027Props) {
  const [active, setActive] = useState(defaultGroup)
  const group = groups.find((item) => item.key === active) ?? groups[0]

  useEffect(() => {
    if (!eventName) return
    const onPet = (event: Event) => {
      const detail = (event as CustomEvent<{ pet?: string }>).detail
      if (detail?.pet && groups.some((item) => item.key === detail.pet)) setActive(detail.pet)
    }
    window.addEventListener(eventName, onPet)
    return () => window.removeEventListener(eventName, onPet)
  }, [eventName, groups])

  const palette = {
    ...(accent ? { "--vibeui-pricing-027-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-027-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-027-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-027" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-027" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {groups.length > 1 ? (
              <div data-part="tabs" role="tablist" aria-label={tabsLabel}>
                {groups.map((item) => (
                  <button key={item.key} type="button" role="tab" aria-selected={item.key === group.key} onClick={() => setActive(item.key)}>
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <ul data-part="grid" key={group.key}>
            {group.items.map((item, index) => (
              <li key={item.name} data-part="ticket" style={{ ["--vibeui-pricing-027-i" as string]: index }} onPointerMove={spotlight}>
                {item.popular ? <span data-part="sticker">{popularLabel}</span> : null}
                <div data-part="top">
                  <h3>{item.name}</h3>
                  {item.note ? <p>{item.note}</p> : null}
                </div>
                <div data-part="tear" aria-hidden="true" />
                <div data-part="bottom">
                  <span data-part="price">{item.price}</span>
                  {actionLabel ? <a href={actionHref}>{actionLabel}</a> : null}
                </div>
              </li>
            ))}
          </ul>
          {fine ? <p data-part="fine">{fine}</p> : null}
        </div>
      </section>
    </>
  )
}
