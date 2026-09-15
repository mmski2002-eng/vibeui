"use client"

import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"

export type Restaurant003Dish = {
  name: string
  /** Состав: «сиг, укропное масло, копчёный картофель». */
  text?: string
  price: string
  /** Метки: «острое», «вег», «шеф». */
  tags?: readonly string[]
  /** Фото всплывает у курсора по наведению. */
  image?: string
}

export type Restaurant003Section = {
  title: string
  note?: string
  dishes: readonly Restaurant003Dish[]
}

export type Restaurant003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  sections?: readonly Restaurant003Section[]
  /** Ссылка на полное меню в PDF. Пусто — без ссылки. */
  fullLabel?: string
  fullHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Меню: разделы табами, блюда списком с точечным лидером до цены и
// метками. Смена раздела пересобирает список (новый key) — блюда въезжают
// каскадом. Фото блюда всплывает у курсора: одна картинка на секцию,
// координаты пишутся в CSS-переменные без ререндера.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="restaurant-003"]){
--vibeui-restaurant-003-bg:light-dark(#f6f1ea,#141110);
--vibeui-restaurant-003-fg:light-dark(#1c1714,#f2ebe0);
--vibeui-restaurant-003-muted:light-dark(color-mix(in oklab,#1c1714 60%,#f6f1ea),color-mix(in oklab,#f2ebe0 58%,#141110));
--vibeui-restaurant-003-line:light-dark(color-mix(in oklab,#1c1714 16%,#f6f1ea),color-mix(in oklab,#f2ebe0 16%,#141110));
--vibeui-restaurant-003-accent:#7d2a3a;
--vibeui-restaurant-003-glow:0 0 24px rgb(125 42 58 / .7),0 0 70px rgb(125 42 58 / .35);
--vibeui-restaurant-003-accent-ink:light-dark(var(--vibeui-restaurant-003-accent),color-mix(in oklab,var(--vibeui-restaurant-003-accent) 55%,#f2ebe0));
--vibeui-restaurant-003-on-accent:#fff4ee;
--vibeui-restaurant-003-olive:#8a9a5b;
--vibeui-restaurant-003-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-restaurant-003-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="restaurant-003"]{color-scheme:dark}
:where([data-vibeui-block="restaurant-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="restaurant-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="restaurant-003"]{box-sizing:border-box;display:block;position:relative;background:var(--vibeui-restaurant-003-bg);color:var(--vibeui-restaurant-003-fg);font-family:var(--vibeui-restaurant-003-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="restaurant-003"] *{box-sizing:border-box}
[data-vibeui-block="restaurant-003"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="restaurant-003"] [data-part="head"]{text-align:center;max-width:36rem;margin:0 auto 2.5rem}
[data-vibeui-block="restaurant-003"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-restaurant-003-accent-ink);font-weight:600}
[data-vibeui-block="restaurant-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-restaurant-003-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="restaurant-003"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-restaurant-003-muted)}
[data-vibeui-block="restaurant-003"] [data-part="tabs"]{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem;margin:0 0 2.5rem;padding:0;list-style:none}
[data-vibeui-block="restaurant-003"] [data-part="pill"]{position:absolute;top:0;left:0;height:0;width:0;border-radius:999px;background:var(--vibeui-restaurant-003-accent);box-shadow:var(--vibeui-restaurant-003-glow);opacity:0;transform:translate(var(--vibeui-restaurant-003-px,0),var(--vibeui-restaurant-003-py,0));transition:transform .5s cubic-bezier(.3,.9,.2,1),width .5s cubic-bezier(.3,.9,.2,1),height .5s cubic-bezier(.3,.9,.2,1),opacity .3s;pointer-events:none}
[data-vibeui-block="restaurant-003"] [data-part="pill"][data-ready="true"]{opacity:1}
[data-vibeui-block="restaurant-003"] [data-part="tab"]{position:relative;z-index:1;appearance:none;border:1px solid var(--vibeui-restaurant-003-line);border-radius:999px;background:transparent;padding:.6rem 1.1rem;font:inherit;font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-restaurant-003-fg);cursor:pointer;transition:color .35s,border-color .35s}
[data-vibeui-block="restaurant-003"] [data-part="tab"]:hover{border-color:var(--vibeui-restaurant-003-accent-ink)}
[data-vibeui-block="restaurant-003"] [data-part="tab"][aria-selected="true"]{color:var(--vibeui-restaurant-003-on-accent);border-color:transparent}
[data-vibeui-block="restaurant-003"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-restaurant-003-accent);outline-offset:2px}
[data-vibeui-block="restaurant-003"] [data-part="note"]{margin:-1.5rem 0 2rem;text-align:center;font-size:.85rem;font-style:italic;font-family:var(--vibeui-restaurant-003-display);color:var(--vibeui-restaurant-003-muted)}
[data-vibeui-block="restaurant-003"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:1.35rem}
[data-vibeui-block="restaurant-003"] [data-part="dish"]{display:grid;gap:.3rem;animation:vibeui-restaurant-003-in .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-restaurant-003-n) * 60ms);cursor:default}
@keyframes vibeui-restaurant-003-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
[data-vibeui-block="restaurant-003"] [data-part="row"]{display:flex;align-items:baseline;gap:.75rem}
[data-vibeui-block="restaurant-003"] [data-part="name"]{font-family:var(--vibeui-restaurant-003-display);font-size:1.3rem;font-weight:500;line-height:1.2;transition:color .2s}
[data-vibeui-block="restaurant-003"] [data-part="dish"]:hover [data-part="name"]{color:var(--vibeui-restaurant-003-accent-ink)}
[data-vibeui-block="restaurant-003"] [data-part="leader"]{flex:1;border-bottom:1px dotted var(--vibeui-restaurant-003-line);transform:translateY(-.35em);min-width:1.5rem}
[data-vibeui-block="restaurant-003"] [data-part="price"]{font-family:var(--vibeui-restaurant-003-display);font-size:1.15rem;white-space:nowrap}
[data-vibeui-block="restaurant-003"] [data-part="text"]{margin:0;font-size:.875rem;color:var(--vibeui-restaurant-003-muted);max-width:40rem}
[data-vibeui-block="restaurant-003"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:.1rem 0 0;padding:0;list-style:none}
[data-vibeui-block="restaurant-003"] [data-part="tag"]{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;padding:.2rem .5rem;border-radius:.3rem;border:1px solid var(--vibeui-restaurant-003-line);color:var(--vibeui-restaurant-003-muted)}
[data-vibeui-block="restaurant-003"] [data-part="tag"][data-kind="veg"]{border-color:var(--vibeui-restaurant-003-olive);color:var(--vibeui-restaurant-003-olive)}
[data-vibeui-block="restaurant-003"] [data-part="tag"][data-kind="hot"]{border-color:#e08a3c;color:#e08a3c}
[data-vibeui-block="restaurant-003"] [data-part="tag"][data-kind="chef"]{border-color:var(--vibeui-restaurant-003-accent-ink);color:var(--vibeui-restaurant-003-accent-ink)}
[data-vibeui-block="restaurant-003"] [data-part="full"]{display:flex;justify-content:center;margin-top:2.5rem}
[data-vibeui-block="restaurant-003"] [data-part="full"] a{color:inherit;text-decoration:none;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;border-bottom:1px solid var(--vibeui-restaurant-003-accent);padding-bottom:.2rem}
[data-vibeui-block="restaurant-003"] [data-part="full"] a:focus-visible{outline:2px solid var(--vibeui-restaurant-003-accent);outline-offset:3px}
[data-vibeui-block="restaurant-003"] [data-part="float"]{position:fixed;left:0;top:0;z-index:30;width:13rem;aspect-ratio:1;border-radius:1rem;object-fit:cover;pointer-events:none;opacity:0;transform:translate(calc(var(--vibeui-restaurant-003-x) + 1.5rem),calc(var(--vibeui-restaurant-003-y) - 50%)) scale(.9) rotate(-3deg);transition:opacity .25s,transform .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 30px 50px -20px rgb(0 0 0 / .6)}
[data-vibeui-block="restaurant-003"] [data-part="float"][data-visible="true"]{opacity:1;transform:translate(calc(var(--vibeui-restaurant-003-x) + 1.5rem),calc(var(--vibeui-restaurant-003-y) - 50%)) scale(1) rotate(0)}
@container (min-width: 48rem){
[data-vibeui-block="restaurant-003"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="restaurant-003"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 3rem}
}
@media (hover:none){[data-vibeui-block="restaurant-003"] [data-part="float"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="restaurant-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SECTIONS: Restaurant003Section[] = [
  {
    title: "Закуски",
    note: "Хлеб печём сами дважды в день",
    dishes: [
      { name: "Тартар из оленины", text: "можжевельник, желток, ржаные чипсы", price: "890 ₽", tags: ["шеф"] },
      { name: "Устрицы Хасанские", text: "3 шт., уксус с шалотом, лимон", price: "1 250 ₽" },
      { name: "Печёная свёкла", text: "козий сыр, фундук, мёд с чабрецом", price: "620 ₽", tags: ["вег"] },
      { name: "Сельдь и картофель", text: "укропное масло, лук в соке смородины", price: "540 ₽" },
    ],
  },
  {
    title: "Горячее",
    dishes: [
      { name: "Ладожский сиг", text: "копчёный картофель, соус из щавеля", price: "1 480 ₽", tags: ["шеф"] },
      { name: "Оленина на углях", text: "пюре из пастернака, брусника, ягель", price: "2 100 ₽" },
      { name: "Суп из лесных грибов", text: "сливки, масло из хвои, гренка", price: "690 ₽", tags: ["вег"] },
      { name: "Пельмени с щукой", text: "бульон даси, острое масло", price: "820 ₽", tags: ["острое"] },
    ],
  },
  {
    title: "Десерты",
    dishes: [
      { name: "Облепиха и меренга", text: "мёд, крем из козьего молока", price: "560 ₽", tags: ["шеф"] },
      { name: "Ржаной хлеб с мороженым", text: "карамель из чёрного хлеба", price: "490 ₽" },
      { name: "Морошка", text: "сорбет, сгущённое молоко, крошка", price: "520 ₽", tags: ["вег"] },
    ],
  },
  {
    title: "Бар",
    note: "Настойки — свои, по 60 мл",
    dishes: [
      { name: "Клюква и розмарин", text: "джин, клюква, розмариновый сироп", price: "650 ₽" },
      { name: "Хвойный сауэр", text: "водка на хвое, лимон, белок", price: "620 ₽" },
      { name: "Riesling Kabinett", text: "Мозель, бокал 150 мл", price: "650 ₽" },
      { name: "Настойка на морошке", text: "60 мл", price: "320 ₽" },
    ],
  },
]

function kindOf(tag: string): "veg" | "hot" | "chef" | undefined {
  const lower = tag.toLowerCase()
  if (lower.startsWith("вег") || lower.startsWith("veg")) return "veg"
  if (lower.startsWith("остр") || lower.startsWith("hot") || lower.startsWith("spicy")) return "hot"
  if (lower.startsWith("шеф") || lower.startsWith("chef")) return "chef"
  return undefined
}

/** Меню ресторана: разделы табами, блюда с лидером до цены, фото всплывает у курсора. */
export function Restaurant003({
  eyebrow = "Меню",
  title = "Что готовим этой осенью",
  lede = "Меню меняется с сезоном. Рыба — с Ладоги, дичь — из Карелии, овощи — с ферм под Гатчиной.",
  sections = DEFAULT_SECTIONS,
  fullLabel = "Полное меню в PDF",
  fullHref = "#",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Restaurant003Props) {
  const [active, setActive] = useState(0)
  const [image, setImage] = useState<string | null>(null)
  const root = useRef<HTMLElement>(null)
  const tabs = useRef<HTMLUListElement>(null)
  const pill = useRef<HTMLLIElement>(null)
  const section = sections[Math.min(active, sections.length - 1)]
  const palette = {
    ...(accent ? { "--vibeui-restaurant-003-accent": accent } : null),
    ...(background ? { "--vibeui-restaurant-003-bg": background } : null),
    ...style,
  } as CSSProperties

  const move = (event: MouseEvent) => {
    root.current?.style.setProperty("--vibeui-restaurant-003-x", `${event.clientX}px`)
    root.current?.style.setProperty("--vibeui-restaurant-003-y", `${event.clientY}px`)
  }

  // Плашка под активным табом: меряем кнопку и пишем размеры прямо в DOM —
  // без состояния и лишних рендеров, transition в CSS довозит.
  useLayoutEffect(() => {
    const list = tabs.current
    if (!list) return
    const measure = () => {
      const button = list.querySelectorAll<HTMLElement>('[data-part="tab"]')[active]
      if (!button) return
      const element = pill.current
      if (!element) return
      element.style.width = `${button.offsetWidth}px`
      element.style.height = `${button.offsetHeight}px`
      element.style.setProperty("--vibeui-restaurant-003-px", `${button.offsetLeft}px`)
      element.style.setProperty("--vibeui-restaurant-003-py", `${button.offsetTop}px`)
      element.dataset.ready = "true"
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [active, sections.length])

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-restaurant-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="restaurant-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onMouseMove={image ? move : undefined}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul ref={tabs} data-part="tabs" role="tablist" aria-label="Разделы меню">
            <li ref={pill} aria-hidden="true" data-part="pill" />
            {sections.map((item, index) => (
              <li key={item.title} role="presentation">
                <button
                  type="button"
                  role="tab"
                  data-part="tab"
                  aria-selected={index === active}
                  onClick={() => {
                    setActive(index)
                    setImage(null)
                  }}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          {section?.note ? <p data-part="note">{section.note}</p> : null}
          {section ? (
            <ul data-part="list" key={section.title} role="tabpanel">
              {section.dishes.map((dish, index) => (
                <li
                  key={dish.name}
                  data-part="dish"
                  style={{ ["--vibeui-restaurant-003-n" as string]: index }}
                  onMouseEnter={(event) => {
                    if (dish.image) {
                      move(event)
                      setImage(dish.image)
                    }
                  }}
                  onMouseLeave={() => setImage(null)}
                >
                  <div data-part="row">
                    <span data-part="name">{dish.name}</span>
                    <span data-part="leader" aria-hidden="true" />
                    <span data-part="price">{dish.price}</span>
                  </div>
                  {dish.text ? <p data-part="text">{dish.text}</p> : null}
                  {dish.tags && dish.tags.length > 0 ? (
                    <ul data-part="tags">
                      {dish.tags.map((tag) => (
                        <li key={tag} data-part="tag" data-kind={kindOf(tag)}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {fullLabel ? (
            <p data-part="full">
              <a href={fullHref}>{fullLabel} ↗</a>
            </p>
          ) : null}
        </div>
        {image ? <img data-part="float" data-visible="true" src={image} alt="" /> : null}
      </section>
    </>
  )
}
