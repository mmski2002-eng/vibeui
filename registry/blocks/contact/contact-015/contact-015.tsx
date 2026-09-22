"use client"

import { useId, useState, type CSSProperties, type FormEvent } from "react"
import { Card025 } from "@/registry/components/card/card-025/card-025"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Checkbox001 } from "@/registry/components/checkbox/checkbox-001/checkbox-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Select001 } from "@/registry/components/select/select-001/select-001"

export type Contact015Props = {
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
  /** Подписи полей формы. */
  addressLabel?: string
  addressPlaceholder?: string
  areaLabel?: string
  roomsLabel?: string
  phoneLabel?: string
  phonePlaceholder?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
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
:where([data-vibeui-block="contact-015"]){
--vibeui-contact-015-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-015-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-015-muted:color-mix(in oklab,var(--vibeui-contact-015-fg) 62%,var(--vibeui-contact-015-bg));
--vibeui-contact-015-card:light-dark(#fffdf9,#242424);
--vibeui-contact-015-line:color-mix(in oklab,var(--vibeui-contact-015-fg) 16%,var(--vibeui-contact-015-bg));
--vibeui-contact-015-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-015-on-accent:oklch(from var(--vibeui-contact-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-015-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-contact-015-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-015"]{color-scheme:dark}
:where([data-vibeui-block="contact-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-015"]{box-sizing:border-box;display:block;background:var(--vibeui-contact-015-bg);color:var(--vibeui-contact-015-fg);font-family:var(--vibeui-contact-015-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="contact-015"] *{box-sizing:border-box}
[data-vibeui-block="contact-015"] [data-part="picture"]{width:100%;margin-top:1.75rem}
[data-vibeui-block="contact-015"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="contact-015"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-contact-015-accent);font-weight:600}
[data-vibeui-block="contact-015"] [data-part="heading"]{margin:0;font-family:var(--vibeui-contact-015-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05}
[data-vibeui-block="contact-015"] [data-part="lede"]{margin:.75rem 0 0;max-width:30rem;color:var(--vibeui-contact-015-muted)}
[data-vibeui-block="contact-015"] [data-part="promises"]{margin:1.5rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="contact-015"] [data-part="promises"] li{display:flex;gap:.7rem;align-items:flex-start}
[data-vibeui-block="contact-015"] [data-part="promises"] li::before{content:"";flex:none;width:.5rem;height:.5rem;margin-top:.5rem;border-radius:50%;background:var(--vibeui-contact-015-accent)}
[data-vibeui-block="contact-015"] [data-part="intro"]{display:flex;flex-direction:column}
[data-vibeui-block="contact-015"] [data-part="picture"]{margin-top:1.75rem}
[data-vibeui-block="contact-015"] [data-part="form"]{display:grid;gap:1rem;align-content:start;padding:1.5rem;border-radius:1rem;background:var(--vibeui-contact-015-card);border:1px solid var(--vibeui-contact-015-line)}
[data-vibeui-block="contact-015"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
[data-vibeui-block="contact-015"] [data-part="done"]{display:grid;gap:.5rem;padding:2rem 1.5rem;border-radius:1rem;background:var(--vibeui-contact-015-card);border:1px solid var(--vibeui-contact-015-line);text-align:center}
[data-vibeui-block="contact-015"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-contact-015-display);font-size:2rem;font-weight:600;line-height:1.05}
[data-vibeui-block="contact-015"] [data-part="done"] p{margin:0;color:var(--vibeui-contact-015-muted)}
@container (min-width: 56rem){
[data-vibeui-block="contact-015"] [data-part="picture"]{flex:1 1 0}
[data-vibeui-block="contact-015"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;padding:5.5rem 2rem;align-items:stretch}
[data-vibeui-block="contact-015"] [data-part="form"]{align-self:stretch;align-content:space-between;gap:1.15rem}
[data-vibeui-block="contact-015"] [data-part="form"],[data-vibeui-block="contact-015"] [data-part="done"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-015"] *{transition:none!important}}`

/** Оценка квартиры: форма с адресом, метражом и телефоном рядом с фото офиса. */
export function Contact015({
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
  addressLabel = "Адрес",
  addressPlaceholder = "Улица, дом, квартира",
  areaLabel = "Площадь, м²",
  roomsLabel = "Комнат",
  phoneLabel = "Телефон",
  phonePlaceholder = "+7 999 123-45-67",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact015Props) {
  const id = useId()
  const [done, setDone] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-contact-015-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-015-fg": ink } : null),
    ...(background ? { "--vibeui-contact-015-bg": background } : null),
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
      <style href="vibeui-contact-015" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-015" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="intro">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="heading">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {promises.length > 0 ? (
              <ul data-part="promises">
                {promises.map((promise) => (
                  <li key={promise}>{promise}</li>
                ))}
              </ul>
            ) : null}
            {image ? <Card025 data-part="picture" src={image} alt={imageAlt} ratio="3/2" /> : null}
          </div>
          {done ? (
            <div data-part="done" role="status">
              <h3>{doneTitle}</h3>
              <p>{doneText}</p>
            </div>
          ) : (
            <form data-part="form" action={action || undefined} method={action ? "post" : undefined} onSubmit={submit}>
              <Input001
                name="address"
                autoComplete="street-address"
                required
                label={addressLabel}
                accent={accent}
              />
              <div data-part="pair">
                <Input001
                  name="area"
                  type="number"
                  min={10}
                  max={500}
                  inputMode="numeric"
                  required
                  label={areaLabel}
                  accent={accent}
                />
                <Select001
                  label={roomsLabel}
                  placeholder=""
                  options={rooms.map((room) => ({ value: room, label: room }))}
                  name="rooms"
                  defaultValue={rooms[1] ?? rooms[0]}
                  accent={accent}
                />
              </div>
              <Input001
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                label={phoneLabel}
                accent={accent}
              />
              <Checkbox001 name="consent" required label={consentLabel} description="" accent={accent} />
              <Button001 type="submit" size="lg" accent={accent}>
                {submitLabel}
              </Button001>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
