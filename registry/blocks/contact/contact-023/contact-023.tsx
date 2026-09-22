"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Input034 } from "@/registry/components/input/input-034/input-034"
import { Select001 } from "@/registry/components/select/select-001/select-001"

export type Contact023Hours = {
  label: string
  value: string
}

export type Contact023Props = {
  eyebrow?: string
  title?: string
  lede?: string
  address?: string
  metro?: string
  phone?: string
  phoneHref?: string
  hours?: readonly Contact023Hours[]
  mapLabel?: string
  mapHref?: string
  /** Варианты в поле «кто у вас». */
  petOptions?: readonly string[]
  actionLabel?: string
  doneTitle?: string
  doneText?: string
  /** Подписи полей формы, плейсхолдер записки и мелкий текст. */
  nameLabel?: string
  phoneLabel?: string
  petLabel?: string
  whenLabel?: string
  noteLabel?: string
  notePlaceholder?: string
  fine?: string
  mapAria?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Запись и контакты ветклиники: слева форма с плавающими ярлыками (ярлык
// уезжает вверх через :placeholder-shown), после отправки — карточка
// «записали» с галочкой, которая прорисовывается по stroke-dashoffset.
// Справа стилизованная SVG-карта из улиц и парка с пином, который
// подпрыгивает, адрес, метро, часы. Форма ничего не отправляет наружу —
// заглушка, обработчик подключается в проекте.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-023"]){
--vibeui-contact-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-023-on-accent:oklch(from var(--vibeui-contact-023-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-023-muted:color-mix(in oklab,var(--vibeui-contact-023-fg) 62%,var(--vibeui-contact-023-bg));
--vibeui-contact-023-line:color-mix(in oklab,var(--vibeui-contact-023-fg) 12%,transparent);
--vibeui-contact-023-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-contact-023-bg) 88%,#fff));
--vibeui-contact-023-park:#4f8f45;
--vibeui-contact-023-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-023-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-023"]{color-scheme:dark}
:where([data-vibeui-block="contact-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-023"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-contact-023-bg);color:var(--vibeui-contact-023-fg);font-family:var(--vibeui-contact-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-023"] *{box-sizing:border-box}
[data-vibeui-block="contact-023"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="contact-023"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-contact-023-accent)}
[data-vibeui-block="contact-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-023-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="contact-023"] [data-part="lede"]{margin:.9rem 0 0;max-width:30rem;color:var(--vibeui-contact-023-muted)}
[data-vibeui-block="contact-023"] [data-part="form"]{display:grid;gap:.8rem;margin:1.8rem 0 0;padding:1.5rem;border-radius:1.6rem;background:var(--vibeui-contact-023-card);border:1px solid var(--vibeui-contact-023-line)}
[data-vibeui-block="contact-023"] [data-part="two"]{display:grid;gap:.8rem}
[data-vibeui-block="contact-023"] [data-part="fine"]{margin:0;font-size:.78rem;color:var(--vibeui-contact-023-muted);text-align:center}
[data-vibeui-block="contact-023"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;margin:1.8rem 0 0;padding:2.5rem 1.5rem;border-radius:1.6rem;background:var(--vibeui-contact-023-card);border:1px solid var(--vibeui-contact-023-line);text-align:center;animation:vibeui-contact-023-pop .4s cubic-bezier(.34,1.4,.64,1) both}
[data-vibeui-block="contact-023"] [data-part="done"] svg{width:4.5rem;height:4.5rem;color:var(--vibeui-contact-023-park)}
[data-vibeui-block="contact-023"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-contact-023-draw .8s ease-out forwards}
[data-vibeui-block="contact-023"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-contact-023-draw .5s ease-out .5s forwards}
[data-vibeui-block="contact-023"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-contact-023-display);font-weight:900;font-size:1.5rem}
[data-vibeui-block="contact-023"] [data-part="done"] p{margin:0;max-width:24rem;color:var(--vibeui-contact-023-muted)}
[data-vibeui-block="contact-023"] [data-part="place"]{display:grid;grid-template-rows:auto 1fr;border-radius:1.6rem;overflow:hidden;background:var(--vibeui-contact-023-card);border:1px solid var(--vibeui-contact-023-line)}
[data-vibeui-block="contact-023"] [data-part="map"]{position:relative;aspect-ratio:4/3;background:color-mix(in oklab,var(--vibeui-contact-023-fg) 4%,var(--vibeui-contact-023-bg));overflow:hidden}
[data-vibeui-block="contact-023"] [data-part="map"] > svg:not([data-part="pin"]){position:absolute;inset:0;width:100%;height:100%}
[data-vibeui-block="contact-023"] [data-part="pin"]{position:absolute;left:56%;top:46%;width:3rem;height:3rem;margin:-3rem 0 0 -1.5rem;color:var(--vibeui-contact-023-accent);filter:drop-shadow(0 10px 10px rgb(0 0 0 / .25));animation:vibeui-contact-023-bounce 2.4s cubic-bezier(.34,1.56,.64,1) infinite;transform-origin:50% 100%}
[data-vibeui-block="contact-023"] [data-part="ring"]{position:absolute;left:56%;top:46%;width:1.4rem;height:.6rem;margin:-.3rem 0 0 -.7rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-contact-023-accent) 40%,transparent);animation:vibeui-contact-023-ring 2.4s ease-out infinite}
[data-vibeui-block="contact-023"] [data-part="maplink"]{position:absolute;right:.8rem;bottom:.8rem;padding:.45rem .8rem;border-radius:999px;background:var(--vibeui-contact-023-fg);color:var(--vibeui-contact-023-bg);text-decoration:none;font-size:.78rem;font-weight:600}
[data-vibeui-block="contact-023"] [data-part="maplink"]:focus-visible{outline:2px solid var(--vibeui-contact-023-accent);outline-offset:2px}
[data-vibeui-block="contact-023"] [data-part="info"]{display:grid;gap:1rem;padding:1.4rem 1.5rem 1.6rem}
[data-vibeui-block="contact-023"] [data-part="address"]{margin:0;font-family:var(--vibeui-contact-023-display);font-weight:900;font-size:1.3rem;line-height:1.15;letter-spacing:-.01em}
[data-vibeui-block="contact-023"] [data-part="address"] small{display:block;margin-top:.3rem;font-family:var(--vibeui-contact-023-font);font-weight:500;font-size:.85rem;color:var(--vibeui-contact-023-muted)}
[data-vibeui-block="contact-023"] [data-part="address"] small::before{content:"";display:inline-block;width:.7rem;height:.7rem;margin-right:.4rem;border-radius:50%;background:var(--vibeui-contact-023-accent);vertical-align:-1px}
[data-vibeui-block="contact-023"] [data-part="phone"]{display:inline-flex;align-items:center;gap:.5rem;color:var(--vibeui-contact-023-fg);text-decoration:none;font-family:var(--vibeui-contact-023-display);font-weight:800;font-size:1.15rem;width:max-content}
[data-vibeui-block="contact-023"] [data-part="phone"] svg{width:1.1rem;height:1.1rem;color:var(--vibeui-contact-023-accent)}
[data-vibeui-block="contact-023"] [data-part="phone"]:hover{color:var(--vibeui-contact-023-accent)}
[data-vibeui-block="contact-023"] [data-part="phone"]:focus-visible{outline:2px solid var(--vibeui-contact-023-accent);outline-offset:2px}
[data-vibeui-block="contact-023"] [data-part="hours"]{margin:0;display:grid;gap:.35rem;font-size:.9rem}
[data-vibeui-block="contact-023"] [data-part="hours"] div{display:flex;justify-content:space-between;gap:1rem;padding:.35rem 0;border-bottom:1px dashed var(--vibeui-contact-023-line)}
[data-vibeui-block="contact-023"] [data-part="hours"] dt{color:var(--vibeui-contact-023-muted)}
[data-vibeui-block="contact-023"] [data-part="hours"] dd{margin:0;font-weight:600}
@keyframes vibeui-contact-023-pop{from{opacity:0;transform:scale(.94)}}
@keyframes vibeui-contact-023-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-contact-023-bounce{0%,100%{transform:translateY(0)}20%{transform:translateY(-14px) scaleY(1.05)}40%{transform:translateY(0) scaleY(.95)}55%{transform:translateY(-5px)}70%{transform:translateY(0)}}
@keyframes vibeui-contact-023-ring{0%{transform:scale(.6);opacity:.8}60%{transform:scale(2.2);opacity:0}100%{opacity:0}}
@container (min-width: 36rem){[data-vibeui-block="contact-023"] [data-part="two"]{grid-template-columns:1fr 1fr}}
@container (min-width: 60rem){[data-vibeui-block="contact-023"] [data-part="shell"]{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:3rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-023"] *{animation:none!important;transition:none!important}[data-vibeui-block="contact-023"] [data-part="done"] circle,[data-vibeui-block="contact-023"] [data-part="done"] path{stroke-dashoffset:0}}`

const DEFAULT_HOURS: Contact023Hours[] = [
  { label: "Приём по записи", value: "9:00–21:00, без выходных" },
  { label: "Экстренная помощь", value: "круглосуточно" },
  { label: "Груминг", value: "10:00–20:00, кроме понедельника" },
  { label: "Аптека и корм", value: "9:00–21:00" },
]

/** Форма записи с плавающими ярлыками и стилизованной картой. */
export function Contact023({
  eyebrow = "Запись",
  title = "Приходите, мы уже гладим стол",
  lede = "Оставьте телефон — администратор перезвонит в течение 15 минут, подберёт время и скажет, что взять с собой.",
  address = "Ленинградский проспект, 62",
  metro = "Сокол · 6 минут пешком, вход со стороны парка",
  phone = "+7 495 120-24-24",
  phoneHref = "tel:+74951202424",
  hours = DEFAULT_HOURS,
  mapLabel = "Открыть в картах",
  mapHref = "#",
  petOptions = ["Кошка", "Собака", "Кролик или грызун", "Птица", "Кто-то ещё"],
  actionLabel = "Записаться",
  doneTitle = "Записали",
  doneText = "Перезвоним в ближайшие 15 минут. Если срочно — звоните сами, дежурный врач на месте.",
  nameLabel = "Как вас зовут",
  phoneLabel = "Телефон",
  petLabel = "Кто у вас",
  whenLabel = "Когда удобно",
  noteLabel = "Что случилось — коротко",
  notePlaceholder = "Что случилось",
  fine = "Нажимая кнопку, вы соглашаетесь, что мы перезвоним. Больше ни на что.",
  mapAria = "Карта: {address}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact023Props) {
  const [done, setDone] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-contact-023-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-023-fg": ink } : null),
    ...(background ? { "--vibeui-contact-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {done ? (
              <div data-part="done" aria-live="polite">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="32" cy="32" r="25" />
                  <path d="M21 33l8 8 14-16" />
                </svg>
                <h3>{doneTitle}</h3>
                <p>{doneText}</p>
              </div>
            ) : (
              <form data-part="form" onSubmit={submit}>
                <div data-part="two">
                  <Input001
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    label={nameLabel}
                    accent={accent}
                  />
                  <Input001
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    label={phoneLabel}
                    accent={accent}
                  />
                </div>
                <div data-part="two">
                  <Select001
                    label={petLabel}
                    placeholder=""
                    options={petOptions.map((option) => ({ value: option, label: option }))}
                    name="pet"
                    defaultValue={petOptions[0]}
                    accent={accent}
                  />
                  <Input001
                    type="text"
                    name="when"
                    label={whenLabel}
                    accent={accent}
                  />
                </div>
                <Input034
                  name="note"
                  label={noteLabel}
                  accent={accent}
                />
                <Button001 type="submit" size="lg" accent={accent}>
                  {actionLabel}
                </Button001>
                <p data-part="fine">{fine}</p>
              </form>
            )}
          </div>
          <div data-part="place">
            <div data-part="map" role="img" aria-label={mapAria.replace("{address}", address)}>
              <svg viewBox="0 0 400 300" aria-hidden="true">
                <rect x="250" y="150" width="150" height="150" rx="24" fill="var(--vibeui-contact-023-park)" opacity=".22" />
                <circle cx="330" cy="225" r="18" fill="var(--vibeui-contact-023-park)" opacity=".3" />
                <circle cx="290" cy="260" r="12" fill="var(--vibeui-contact-023-park)" opacity=".3" />
                <path d="M-10 90 C 80 70, 160 110, 260 80 S 380 40, 420 60" fill="none" stroke="var(--vibeui-contact-023-card)" strokeWidth="22" strokeLinecap="round" />
                <path d="M-10 90 C 80 70, 160 110, 260 80 S 380 40, 420 60" fill="none" stroke="var(--vibeui-contact-023-line)" strokeWidth="1.5" strokeDasharray="6 8" />
                <path d="M60 -10 C 70 80, 40 180, 90 310" fill="none" stroke="var(--vibeui-contact-023-card)" strokeWidth="16" strokeLinecap="round" />
                <path d="M-10 200 C 90 190, 170 230, 250 200 S 360 170, 420 190" fill="none" stroke="var(--vibeui-contact-023-card)" strokeWidth="14" strokeLinecap="round" />
                <path d="M190 -10 C 200 90, 220 160, 224 310" fill="none" stroke="var(--vibeui-contact-023-card)" strokeWidth="26" strokeLinecap="round" />
                <path d="M190 -10 C 200 90, 220 160, 224 310" fill="none" stroke="var(--vibeui-contact-023-line)" strokeWidth="1.5" strokeDasharray="6 8" />
                <rect x="100" y="110" width="60" height="40" rx="8" fill="var(--vibeui-contact-023-line)" />
                <rect x="105" y="215" width="50" height="60" rx="8" fill="var(--vibeui-contact-023-line)" />
                <rect x="270" y="95" width="70" height="36" rx="8" fill="var(--vibeui-contact-023-line)" />
                <rect x="20" y="30" width="30" height="30" rx="6" fill="var(--vibeui-contact-023-line)" />
                <circle cx="60" cy="90" r="9" fill="var(--vibeui-contact-023-fg)" opacity=".6" />
                <text x="60" y="94" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--vibeui-contact-023-bg)">M</text>
              </svg>
              <i data-part="ring" aria-hidden="true" />
              <svg data-part="pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z" />
                <circle cx="12" cy="9" r="2.8" fill="var(--vibeui-contact-023-on-accent)" />
              </svg>
              {mapLabel ? (
                <a data-part="maplink" href={mapHref} target={mapHref.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {mapLabel}
                </a>
              ) : null}
            </div>
            <div data-part="info">
              <p data-part="address">
                {address}
                {metro ? <small>{metro}</small> : null}
              </p>
              {phone ? (
                <a data-part="phone" href={phoneHref}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </svg>
                  {phone}
                </a>
              ) : null}
              {hours.length > 0 ? (
                <dl data-part="hours">
                  {hours.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
