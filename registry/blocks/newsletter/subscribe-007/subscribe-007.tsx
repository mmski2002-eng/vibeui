"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Subscribe007Option = {
  id: string
  label: string
  /** Во сколько напишем: «08:25». */
  time: string
  note?: string
}

export type Subscribe007Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stamp?: string
  formTitle?: string
  formText?: string
  optionLabel?: string
  contactLabel?: string
  contactPlaceholder?: string
  /** Строка под полем; {time} и {note} подставляются из выбранного варианта. */
  whenLine?: string
  submitLabel?: string
  doneLine?: string
  againLabel?: string
  options?: readonly Subscribe007Option[]
  /** Фактура пакета: картинка крафт-бумаги. Пусто — цвет. */
  texture?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Хлебный будильник»: не рассылка, а одно сообщение за пять минут до того,
// как выбранная выпечка ляжет на полку. Форма лежит на крафт-пакете с
// пунктирной линией отрыва и штампом в углу; выбор позиции сразу меняет
// строку «напишем в 08:25 — 36 часов, как положено». После отправки —
// подтверждение и «добавить ещё».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="subscribe-007"]){
--vibeui-subscribe-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-subscribe-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-007-on-accent:oklch(from var(--vibeui-subscribe-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-007-muted:color-mix(in oklab,var(--vibeui-subscribe-007-fg) 60%,var(--vibeui-subscribe-007-bg));
--vibeui-subscribe-007-panel:color-mix(in oklab,var(--vibeui-subscribe-007-fg) 5%,var(--vibeui-subscribe-007-bg));
--vibeui-subscribe-007-kraft:#c9a97e;
--vibeui-subscribe-007-kraft-ink:#3b2a1c;
--vibeui-subscribe-007-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-subscribe-007-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-subscribe-007-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-007"]{color-scheme:dark}
:where([data-vibeui-block="subscribe-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="subscribe-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="subscribe-007"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-subscribe-007-panel);color:var(--vibeui-subscribe-007-fg);font-family:var(--vibeui-subscribe-007-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="subscribe-007"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-007"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="subscribe-007"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-subscribe-007-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="subscribe-007"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-subscribe-007-accent);border-radius:2px}
[data-vibeui-block="subscribe-007"] [data-part="title"]{margin:0;font-family:var(--vibeui-subscribe-007-display);font-weight:600;letter-spacing:-.02em;line-height:1.02;font-size:clamp(2rem,4.6cqi,3.6rem)}
[data-vibeui-block="subscribe-007"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-subscribe-007-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="subscribe-007"] [data-part="bag"]{position:relative;margin-top:2.5rem;padding:2rem 1.5rem 2.4rem;border-radius:1.2rem 1.2rem 1.6rem 1.6rem;background:var(--vibeui-subscribe-007-kraft) var(--vibeui-subscribe-007-texture) center/cover;box-shadow:0 30px 60px -36px rgb(0 0 0 / .7),0 1px 0 rgb(255 255 255 / .25) inset;color:var(--vibeui-subscribe-007-kraft-ink);overflow:hidden}
[data-vibeui-block="subscribe-007"] [data-part="bag"]::before{content:"";position:absolute;left:0;right:0;top:0;height:2.2rem;background:linear-gradient(180deg,rgb(0 0 0 / .12),transparent);border-bottom:1px dashed color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 35%,transparent)}
[data-vibeui-block="subscribe-007"] [data-part="bag"]::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 6rem,rgb(255 255 255 / .06) 6rem 6.2rem);pointer-events:none}
[data-vibeui-block="subscribe-007"] [data-part="inner"]{position:relative;display:grid;gap:1.5rem;padding-top:1rem;z-index:1}
[data-vibeui-block="subscribe-007"] [data-part="inner"] h3{margin:0;font-family:var(--vibeui-subscribe-007-display);font-size:1.6rem;font-weight:600;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="subscribe-007"] [data-part="inner"] p{margin:.4rem 0 0;color:color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 80%,var(--vibeui-subscribe-007-kraft));max-width:30rem}
[data-vibeui-block="subscribe-007"] form{display:grid;gap:.8rem}
[data-vibeui-block="subscribe-007"] label{display:grid;gap:.35rem;font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 80%,var(--vibeui-subscribe-007-kraft))}
[data-vibeui-block="subscribe-007"] select,[data-vibeui-block="subscribe-007"] input{font:inherit;font-size:.95rem;padding:.8rem .9rem;border-radius:.8rem;border:1px solid color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 25%,transparent);background:rgb(255 255 255 / .85);color:#1a1a1a;width:100%}
[data-vibeui-block="subscribe-007"] select:focus-visible,[data-vibeui-block="subscribe-007"] input:focus-visible,[data-vibeui-block="subscribe-007"] button:focus-visible{outline:2px solid var(--vibeui-subscribe-007-accent);outline-offset:2px}
[data-vibeui-block="subscribe-007"] [data-part="when"]{font-family:var(--vibeui-subscribe-007-hand);font-size:1.4rem;color:var(--vibeui-subscribe-007-kraft-ink);margin:0}
[data-vibeui-block="subscribe-007"] [data-part="stamp"]{position:absolute;right:1.2rem;top:1rem;z-index:1;padding:.5rem .8rem;border:2px solid color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 50%,transparent);border-radius:.6rem;font-family:var(--vibeui-subscribe-007-display);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 70%,transparent);transform:rotate(6deg)}
[data-vibeui-block="subscribe-007"] [data-part="submit"],[data-vibeui-block="subscribe-007"] [data-part="again"]{display:inline-flex;align-items:center;justify-self:start;border:0;border-radius:999px;padding:.95rem 1.5rem;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;color:var(--vibeui-subscribe-007-on-accent);background:var(--vibeui-subscribe-007-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-subscribe-007-accent) 70%,transparent);transition:transform .18s,filter .18s}
[data-vibeui-block="subscribe-007"] [data-part="again"]{color:var(--vibeui-subscribe-007-kraft-ink);background:rgb(255 255 255 / .8);box-shadow:0 2px 4px rgb(0 0 0 / .08)}
[data-vibeui-block="subscribe-007"] [data-part="submit"]:hover,[data-vibeui-block="subscribe-007"] [data-part="again"]:hover{transform:translateY(-1px);filter:brightness(1.04)}
[data-vibeui-block="subscribe-007"] [data-part="ok"]{display:grid;gap:.6rem;justify-items:start}
[data-vibeui-block="subscribe-007"] [data-part="ok"] p{font-family:var(--vibeui-subscribe-007-hand);font-size:1.6rem;color:var(--vibeui-subscribe-007-kraft-ink);margin:0}
@container (min-width: 56rem){[data-vibeui-block="subscribe-007"] [data-part="inner"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3rem;align-items:center}[data-vibeui-block="subscribe-007"] [data-part="bag"]{padding:2.6rem 3rem 3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-007"] *{transition:none!important}}`

const DEFAULT_OPTIONS: Subscribe007Option[] = [
  { id: "tartine", label: "Тартин", time: "08:25", note: "36 часов, как положено" },
  { id: "croissant", label: "Круассан", time: "06:55", note: "первая партия, 40 шт." },
  { id: "cinnamon", label: "Булочка с корицей", time: "10:55", note: "с глазурью, пока тёплые" },
  { id: "focaccia", label: "Фокачча", time: "12:55", note: "к обеду, режем на месте" },
  { id: "rye", label: "Ржаной", time: "14:55", note: "тёмная корка, тмин" },
  { id: "baguette", label: "Багет", time: "16:55", note: "к ужину, последний хлеб дня" },
]

/** Хлебный будильник: напоминание к выходу выбранной выпечки. */
export function Subscribe007({
  eyebrow = "Напоминание",
  title = "Напишем, когда выйдет ваш хлеб",
  lede = "Не рассылка — одно сообщение за пять минут до того, как ваша любимая выпечка ляжет на полку.",
  stamp = "Корка · с 2019",
  formTitle = "Хлебный будильник",
  formText = "Выберите, что любите, — мы посчитаем, во сколько это будет в печи, и напишем в мессенджер. Отписаться — одним словом «хватит».",
  optionLabel = "Что любите",
  contactLabel = "Телефон или почта",
  contactPlaceholder = "+7 … или name@mail",
  whenLine = "напишем в {time} — {note}",
  submitLabel = "Поставить будильник",
  doneLine = "записали: {label}, {time}",
  againLabel = "Добавить ещё",
  options = DEFAULT_OPTIONS,
  texture = "",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Subscribe007Props) {
  const [id, setId] = useState(options[0]?.id ?? "")
  const [sent, setSent] = useState(false)
  const chosen = options.find((option) => option.id === id) ?? options[0]
  const fill = (line: string) => line.replace("{time}", chosen?.time ?? "").replace("{note}", chosen?.note ?? "").replace("{label}", chosen?.label.toLowerCase() ?? "")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSent(true)
  }

  const palette = {
    ...(texture ? { "--vibeui-subscribe-007-texture": `url("${texture}")` } : { "--vibeui-subscribe-007-texture": "none" }),
    ...(accent ? { "--vibeui-subscribe-007-accent": accent } : null),
    ...(ink ? { "--vibeui-subscribe-007-fg": ink } : null),
    ...(background ? { "--vibeui-subscribe-007-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-subscribe-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="subscribe-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="bag">
            {stamp ? (
              <span data-part="stamp" aria-hidden="true">
                {stamp}
              </span>
            ) : null}
            <div data-part="inner">
              <div>
                <h3>{formTitle}</h3>
                {formText ? <p>{formText}</p> : null}
              </div>
              {sent ? (
                <div data-part="ok">
                  <p>{fill(doneLine)}</p>
                  <button type="button" data-part="again" onClick={() => setSent(false)}>
                    {againLabel}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <label>
                    {optionLabel}
                    <select value={id} onChange={(event) => setId(event.target.value)}>
                      {options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {contactLabel}
                    <input type="text" name="contact" required placeholder={contactPlaceholder} />
                  </label>
                  <p data-part="when" aria-live="polite">
                    {fill(whenLine)}
                  </p>
                  <button type="submit" data-part="submit">
                    {submitLabel}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
