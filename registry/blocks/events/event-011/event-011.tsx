"use client"

import { useCallback, useMemo, useSyncExternalStore, type CSSProperties } from "react"

export type Event011Card = {
  /** Иконка: plane | passport | cash | sim | shield | phone. */
  icon?: string
  title: string
  /** Крупная строка: «13 ч 20 мин», «$1 = 120 CUP». */
  value?: string
  text: string
}

export type Event011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  cards?: readonly Event011Card[]
  /** Организатор на месте: имя, подпись, ссылка. */
  contactName?: string
  contactRole?: string
  contactLabel?: string
  contactHref?: string
  /** Фото организатора — круглое слева. */
  contactImage?: string
  checklistTitle?: string
  checklistNote?: string
  checklist?: readonly string[]
  /** Ключ localStorage для отметок. */
  storageKey?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Дорожная информация»: карточки-билеты с перфорацией слева — перелёт,
// виза, деньги, связь, страховка — крупная цифра и пара строк; карточка
// организатора на месте с кнопкой «написать». Справа чек-лист «что взять»
// с галочками: отметки живут в localStorage, чтобы собирать чемодан
// в несколько подходов.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-011"]){
--vibeui-event-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-011-sand:light-dark(#f4f4f4,#242424);
--vibeui-event-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-011-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-event-011-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-event-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-011-sea:#2aa7a0;
--vibeui-event-011-sun:#f2c14e;
--vibeui-event-011-on-accent:oklch(from var(--vibeui-event-011-accent) clamp(0,(0.72 - l) * 100,1) 0 0);
--vibeui-event-011-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-event-011-script:"Lobster","Brush Script MT",cursive;
--vibeui-event-011-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-011"]{color-scheme:dark}
:where([data-vibeui-block="event-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-011"]{box-sizing:border-box;display:block;background:var(--vibeui-event-011-bg);color:var(--vibeui-event-011-fg);font-family:var(--vibeui-event-011-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-011"] *{box-sizing:border-box}
[data-vibeui-block="event-011"] a{color:inherit}
[data-vibeui-block="event-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="event-011"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-event-011-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-event-011-accent)}
[data-vibeui-block="event-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-011-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="event-011"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-event-011-muted)}
[data-vibeui-block="event-011"] [data-part="grid"]{display:grid;gap:2rem;margin-top:2.5rem}
[data-vibeui-block="event-011"] [data-part="cards"]{display:grid;gap:.9rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-011"] [data-part="card"]{position:relative;display:grid;grid-template-columns:2.8rem minmax(0,1fr);gap:.2rem 1rem;padding:1.1rem 1.2rem 1.1rem 1.4rem;border:1px solid var(--vibeui-event-011-line);border-radius:.8rem;background:var(--vibeui-event-011-sand);overflow:hidden;transition:transform .25s,border-color .25s}
[data-vibeui-block="event-011"] [data-part="card"]::before{content:"";position:absolute;left:.55rem;top:0;bottom:0;width:2px;background:radial-gradient(circle,var(--vibeui-event-011-bg) 0 2px,transparent 2.5px) 0 0/2px 9px repeat-y}
[data-vibeui-block="event-011"] [data-part="card"]:hover{transform:translateY(-2px);border-color:var(--vibeui-event-011-sea)}
[data-vibeui-block="event-011"] [data-part="card"] svg{grid-row:1 / span 3;width:2.8rem;height:2.8rem;padding:.65rem;border-radius:50%;background:var(--vibeui-event-011-bg);color:var(--vibeui-event-011-sea);fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="event-011"] [data-part="card"] h3{margin:0;font-family:var(--vibeui-event-011-display);font-size:.78rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-event-011-muted)}
[data-vibeui-block="event-011"] [data-part="card"] b{font-family:var(--vibeui-event-011-display);font-size:1.5rem;font-weight:600;line-height:1.1;letter-spacing:.02em}
[data-vibeui-block="event-011"] [data-part="card"] p{margin:0;font-size:.92rem;color:var(--vibeui-event-011-muted)}
[data-vibeui-block="event-011"] [data-part="contact"]{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1.2rem;margin-top:1rem;padding:1.1rem 1.3rem;border-radius:.8rem;background:var(--vibeui-event-011-fg);color:var(--vibeui-event-011-bg)}
[data-vibeui-block="event-011"] [data-part="contact"] img{width:3.2rem;height:3.2rem;border-radius:50%;object-fit:cover;border:2px solid var(--vibeui-event-011-sun)}
[data-vibeui-block="event-011"] [data-part="contact"] b{font-family:var(--vibeui-event-011-script);font-size:1.5rem;font-weight:400;color:var(--vibeui-event-011-sun)}
[data-vibeui-block="event-011"] [data-part="contact"] span{font-size:.88rem;opacity:.8}
[data-vibeui-block="event-011"] [data-part="contact"] a{margin-left:auto;display:inline-flex;align-items:center;gap:.4rem;height:2.4rem;padding:0 1rem;border-radius:.5rem;background:var(--vibeui-event-011-accent);color:var(--vibeui-event-011-on-accent);font-family:var(--vibeui-event-011-display);font-size:.82rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;transition:transform .2s}
[data-vibeui-block="event-011"] [data-part="contact"] a:hover{transform:translateY(-1px)}
[data-vibeui-block="event-011"] [data-part="contact"] a:focus-visible,[data-vibeui-block="event-011"] [data-part="check"]:focus-visible{outline:2px solid var(--vibeui-event-011-sun);outline-offset:3px}
[data-vibeui-block="event-011"] [data-part="list"]{align-self:start;padding:1.4rem 1.5rem;border:2px dashed var(--vibeui-event-011-line);border-radius:1rem;background:var(--vibeui-event-011-bg)}
[data-vibeui-block="event-011"] [data-part="list"] h3{margin:0;font-family:var(--vibeui-event-011-display);font-size:1.4rem;font-weight:600;text-transform:uppercase;letter-spacing:.02em}
[data-vibeui-block="event-011"] [data-part="list"] > p{margin:.2rem 0 1rem;font-family:var(--vibeui-event-011-script);font-size:1.1rem;color:var(--vibeui-event-011-sea)}
[data-vibeui-block="event-011"] [data-part="list"] ul{display:grid;gap:.35rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-011"] [data-part="check"]{display:flex;align-items:center;gap:.7rem;width:100%;padding:.5rem .4rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .2s}
[data-vibeui-block="event-011"] [data-part="check"]:hover{background:color-mix(in oklab,var(--vibeui-event-011-sand) 70%,transparent)}
[data-vibeui-block="event-011"] [data-part="box"]{display:grid;place-items:center;flex:none;width:1.35rem;height:1.35rem;border:2px solid var(--vibeui-event-011-fg);border-radius:.3rem;transition:background .2s,border-color .2s,transform .2s}
[data-vibeui-block="event-011"] [data-part="box"] svg{width:.85rem;height:.85rem;fill:none;stroke:var(--vibeui-event-011-on-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:0;transform:scale(.5);transition:opacity .2s,transform .25s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="event-011"] [data-part="check"][aria-checked="true"] [data-part="box"]{background:var(--vibeui-event-011-sea);border-color:var(--vibeui-event-011-sea);transform:rotate(-6deg)}
[data-vibeui-block="event-011"] [data-part="check"][aria-checked="true"] [data-part="box"] svg{opacity:1;transform:none}
[data-vibeui-block="event-011"] [data-part="check"][aria-checked="true"] span{color:var(--vibeui-event-011-muted);text-decoration:line-through;text-decoration-color:var(--vibeui-event-011-accent)}
[data-vibeui-block="event-011"] [data-part="progress"]{display:flex;align-items:center;gap:.6rem;margin-top:1rem;font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-event-011-muted)}
[data-vibeui-block="event-011"] [data-part="progress"] i{flex:1;height:4px;border-radius:2px;background:var(--vibeui-event-011-line);overflow:hidden}
[data-vibeui-block="event-011"] [data-part="progress"] i::after{content:"";display:block;height:100%;width:var(--vibeui-event-011-done,0%);background:var(--vibeui-event-011-sea);transition:width .4s cubic-bezier(.2,.9,.3,1)}
@container (min-width:56rem){
[data-vibeui-block="event-011"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="event-011"] [data-part="grid"]{grid-template-columns:minmax(0,1.5fr) minmax(18rem,.8fr);gap:3rem}
[data-vibeui-block="event-011"] [data-part="cards"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="event-011"] [data-part="list"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-011"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  plane: "M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z",
  passport: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM8 17h8",
  cash: "M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 10h.01M18 14h.01",
  sim: "M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 12h8v6H8zM11 12v6M8 15h8",
  shield: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6zM9 12l2 2 4-4",
  phone: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 3.6.8v3.2A1.5 1.5 0 0 1 17.5 21 16 16 0 0 1 3 6.5 1.5 1.5 0 0 1 4.8 5H8l.8 3.6z",
}

const CHANGE_EVENT = "vibeui-event-011-change"

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

/** Дорожная информация для свадьбы за границей: карточки-билеты (перелёт, виза, деньги, связь), организатор на месте и чек-лист «что взять» с галочками в localStorage. */
export function Event011({
  eyebrow = "Дорога",
  title = "Что знать до вылета",
  lede = "Всё, о чём спрашивают за неделю до рейса, — в одном месте. Остальное — у Мариэлы, она на Кубе и отвечает быстрее нас.",
  cards = [
    { icon: "plane", title: "Перелёт", value: "13 ч 20 мин", text: "Прямой рейс Москва — Гавана, вылет 12 февраля в 09:40, багаж 23 кг включён." },
    { icon: "passport", title: "Виза", value: "Не нужна", text: "Россиянам — до 90 дней без визы. Загранпаспорт должен действовать ещё полгода." },
    { icon: "cash", title: "Деньги", value: "Наличные", text: "Карты российских банков не работают. Берите доллары или евро, менять — в отеле." },
    { icon: "sim", title: "Связь", value: "eSIM Cubacel", text: "Интернет медленный и дорогой. Оформите eSIM заранее или отдохните от него." },
    { icon: "shield", title: "Страховка", value: "Обязательна", text: "На границе просят полис. Оформите на четыре дня — стоит как кофе." },
    { icon: "phone", title: "Розетки", value: "110 В · тип A", text: "Возьмите переходник; фен в отеле есть, утюг — под вопросом." },
  ],
  contactName = "Мариэла",
  contactRole = "организатор в Гаване, говорит по-русски",
  contactLabel = "Написать в WhatsApp",
  contactHref = "#",
  contactImage,
  checklistTitle = "Что взять",
  checklistNote = "отмечайте — список запомнит",
  checklist = ["Загранпаспорт (действует 6+ месяцев)", "Наличные доллары или евро", "Страховка на 4 дня", "Лён на пляж и что-то на вечер", "Шляпа, очки, крем SPF 50", "Переходник на розетку типа A", "Средство от комаров", "Купальник — в ручную кладь", "Хорошее настроение и ту самую песню"],
  storageKey = "vibeui-wedding-cuba-packing",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event011Props) {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(storageKey) ?? "[]"
      } catch {
        return "[]"
      }
    },
    () => "[]",
  )
  const done = useMemo(() => {
    try {
      const saved: unknown = JSON.parse(raw)
      return new Set(Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string") : [])
    } catch {
      return new Set<string>()
    }
  }, [raw])
  const toggle = useCallback(
    (item: string) => {
      const next = new Set(done)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]))
      } catch {
        // Приватный режим: отметка доживёт до перезагрузки.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT))
    },
    [done, storageKey],
  )
  const checked = checklist.filter((item) => done.has(item)).length
  const palette = {
    ...(accent ? { "--vibeui-event-011-accent": accent } : null),
    ...(ink ? { "--vibeui-event-011-fg": ink } : null),
    ...(background ? { "--vibeui-event-011-bg": background } : null),
    "--vibeui-event-011-done": `${checklist.length ? (checked / checklist.length) * 100 : 0}%`,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div>
              <ul data-part="cards">
                {cards.map((card) => (
                  <li key={card.title} data-part="card">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={ICONS[card.icon ?? ""] ?? ICONS.plane} />
                    </svg>
                    <h3>{card.title}</h3>
                    {card.value ? <b>{card.value}</b> : null}
                    <p>{card.text}</p>
                  </li>
                ))}
              </ul>
              {contactName ? (
                <div data-part="contact">
                  {contactImage ? <img src={contactImage} alt="" loading="lazy" /> : null}
                  <b>{contactName}</b>
                  <span>{contactRole}</span>
                  {contactLabel && contactHref ? <a href={contactHref}>{contactLabel}</a> : null}
                </div>
              ) : null}
            </div>
            {checklist.length > 0 ? (
              <aside data-part="list">
                <h3>{checklistTitle}</h3>
                {checklistNote ? <p>{checklistNote}</p> : null}
                <ul>
                  {checklist.map((item) => (
                    <li key={item}>
                      <button type="button" role="checkbox" data-part="check" aria-checked={done.has(item)} onClick={() => toggle(item)}>
                        <span data-part="box" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p data-part="progress" aria-live="polite">
                  <i aria-hidden="true" />
                  {checked} / {checklist.length}
                </p>
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
