"use client"

import { useId, useState, type CSSProperties, type FormEvent } from "react"

export type Realty007Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Фото рядом с формой: офис или агент. */
  image?: string
  imageAlt?: string
  /** Что человек получит. */
  promises?: readonly string[]
  rooms?: readonly string[]
  submitLabel?: string
  doneTitle?: string
  doneText?: string
  consentLabel?: string
  /** Куда отправить форму. Пусто — показывается «готово» на месте. */
  action?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Оценка квартиры: фото офиса слева, форма справа — адрес, метраж,
// комнаты, телефон, согласие. Настоящая <form>: с action уходит POST,
// без него показывает «готово» на месте. Обещания списком: что и когда.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="realty-007"]){
--vibeui-realty-007-bg:light-dark(#f3ede3,#14211b);
--vibeui-realty-007-fg:light-dark(#173b2e,#eef0ea);
--vibeui-realty-007-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-realty-007-card:light-dark(#fffdf9,#1b2c24);
--vibeui-realty-007-line:light-dark(color-mix(in oklab,#173b2e 16%,#f3ede3),color-mix(in oklab,#eef0ea 16%,#14211b));
--vibeui-realty-007-accent:#b8925a;
--vibeui-realty-007-on-accent:#14211b;
--vibeui-realty-007-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-realty-007-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="realty-007"]{color-scheme:dark}
:where([data-vibeui-block="realty-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="realty-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="realty-007"]{box-sizing:border-box;display:block;background:var(--vibeui-realty-007-bg);color:var(--vibeui-realty-007-fg);font-family:var(--vibeui-realty-007-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="realty-007"] *{box-sizing:border-box}
[data-vibeui-block="realty-007"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="realty-007"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-realty-007-accent);font-weight:600}
[data-vibeui-block="realty-007"] [data-part="title"]{margin:0;font-family:var(--vibeui-realty-007-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05}
[data-vibeui-block="realty-007"] [data-part="lede"]{margin:.75rem 0 0;max-width:30rem;color:var(--vibeui-realty-007-muted)}
[data-vibeui-block="realty-007"] [data-part="promises"]{margin:1.5rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="realty-007"] [data-part="promises"] li{display:flex;gap:.7rem;align-items:flex-start}
[data-vibeui-block="realty-007"] [data-part="promises"] li::before{content:"";flex:none;width:.5rem;height:.5rem;margin-top:.5rem;border-radius:50%;background:var(--vibeui-realty-007-accent)}
[data-vibeui-block="realty-007"] [data-part="picture"]{display:block;width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:1rem;margin-top:1.75rem;background:light-dark(#e7dfd2,#243830)}
[data-vibeui-block="realty-007"] [data-part="intro"]{display:flex;flex-direction:column}
[data-vibeui-block="realty-007"] [data-part="form"]{display:grid;gap:1rem;align-content:start;padding:1.5rem;border-radius:1rem;background:var(--vibeui-realty-007-card);border:1px solid var(--vibeui-realty-007-line)}
[data-vibeui-block="realty-007"] [data-part="field"]{display:grid;gap:.35rem}
[data-vibeui-block="realty-007"] [data-part="field"] span{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-realty-007-muted);font-weight:600}
[data-vibeui-block="realty-007"] input:not([type="checkbox"]),[data-vibeui-block="realty-007"] select{width:100%;height:3rem;padding:0 .9rem;border:1px solid var(--vibeui-realty-007-line);border-radius:.6rem;background:transparent;font:inherit;color:inherit}
[data-vibeui-block="realty-007"] select{appearance:none;padding-right:2.25rem;background:transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23888' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right .9rem center;cursor:pointer}
[data-vibeui-block="realty-007"] input:focus-visible,[data-vibeui-block="realty-007"] select:focus-visible{outline:2px solid var(--vibeui-realty-007-accent);outline-offset:1px}
[data-vibeui-block="realty-007"] input::placeholder{color:var(--vibeui-realty-007-muted);opacity:.7}
[data-vibeui-block="realty-007"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
[data-vibeui-block="realty-007"] [data-part="consent"]{display:flex;gap:.6rem;align-items:flex-start;font-size:.8rem;color:var(--vibeui-realty-007-muted);cursor:pointer}
[data-vibeui-block="realty-007"] [data-part="consent"] input{margin:.2rem 0 0;accent-color:var(--vibeui-realty-007-accent)}
[data-vibeui-block="realty-007"] [data-part="submit"]{height:3.25rem;border:0;border-radius:.6rem;background:var(--vibeui-realty-007-accent);color:var(--vibeui-realty-007-on-accent);font:inherit;font-weight:700;cursor:pointer;transition:transform .2s,filter .2s}
[data-vibeui-block="realty-007"] [data-part="submit"]:hover{transform:translateY(-1px);filter:brightness(1.05)}
[data-vibeui-block="realty-007"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-realty-007-fg);outline-offset:2px}
[data-vibeui-block="realty-007"] [data-part="done"]{display:grid;gap:.5rem;padding:2rem 1.5rem;border-radius:1rem;background:var(--vibeui-realty-007-card);border:1px solid var(--vibeui-realty-007-line);text-align:center}
[data-vibeui-block="realty-007"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-realty-007-display);font-size:2rem;font-weight:600;line-height:1.05}
[data-vibeui-block="realty-007"] [data-part="done"] p{margin:0;color:var(--vibeui-realty-007-muted)}
@container (min-width: 56rem){
[data-vibeui-block="realty-007"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;padding:5.5rem 2rem;align-items:stretch}
[data-vibeui-block="realty-007"] [data-part="picture"]{flex:1 1 0;height:0;min-height:12rem;aspect-ratio:auto}
[data-vibeui-block="realty-007"] [data-part="form"]{align-self:stretch;align-content:space-between;gap:1.15rem}
[data-vibeui-block="realty-007"] [data-part="form"],[data-vibeui-block="realty-007"] [data-part="done"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="realty-007"] *{transition:none!important}}`

/** Оценка квартиры: форма с адресом, метражом и телефоном рядом с фото офиса. */
export function Realty007({
  eyebrow = "Бесплатная оценка",
  title = "Узнайте, сколько стоит ваша квартира",
  lede = "Оценим по сделкам вашего дома и соседних за последний год, а не по объявлениям. Перезвоним в течение часа в рабочее время.",
  image = "",
  imageAlt = "",
  promises = ["Цена, по которой квартира уйдёт за 30 дней", "Что стоит починить перед продажей, а что нет", "План продажи и сроки — без обязательств"],
  rooms = ["Студия", "1 комната", "2 комнаты", "3 комнаты", "4 и больше"],
  submitLabel = "Получить оценку",
  doneTitle = "Спасибо, приняли",
  doneText = "Перезвоним в течение часа и назовём цену с вилкой.",
  consentLabel = "Согласен на обработку данных и звонок по этому номеру.",
  action = "",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Realty007Props) {
  const id = useId()
  const [done, setDone] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-realty-007-accent": accent } : null),
    ...(background ? { "--vibeui-realty-007-bg": background } : null),
    ...style,
  } as CSSProperties

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (action) return

    event.preventDefault()
    setDone(true)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-realty-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="realty-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="intro">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {promises.length > 0 ? (
              <ul data-part="promises">
                {promises.map((promise) => (
                  <li key={promise}>{promise}</li>
                ))}
              </ul>
            ) : null}
            {image ? <img data-part="picture" src={image} alt={imageAlt} loading="lazy" /> : null}
          </div>
          {done ? (
            <div data-part="done" role="status">
              <h3>{doneTitle}</h3>
              <p>{doneText}</p>
            </div>
          ) : (
            <form data-part="form" action={action || undefined} method={action ? "post" : undefined} onSubmit={submit}>
              <label data-part="field">
                <span>Адрес</span>
                <input name="address" required placeholder="Улица, дом, квартира" autoComplete="street-address" />
              </label>
              <div data-part="pair">
                <label data-part="field">
                  <span>Площадь, м²</span>
                  <input name="area" type="number" min={10} max={500} required placeholder="64" inputMode="numeric" />
                </label>
                <label data-part="field">
                  <span>Комнат</span>
                  <select name="rooms" defaultValue={rooms[1] ?? rooms[0]}>
                    {rooms.map((room) => (
                      <option key={room}>{room}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label data-part="field">
                <span>Телефон</span>
                <input id={`${id}-phone`} name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="+7 999 123-45-67" />
              </label>
              <label data-part="consent">
                <input type="checkbox" name="consent" required />
                <span>{consentLabel}</span>
              </label>
              <button type="submit" data-part="submit">
                {submitLabel}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
