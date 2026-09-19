"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Vet001Props = {
  /** Подпись на пилюле. */
  label?: string
  phone?: string
  phoneHref?: string
  title?: string
  lede?: string
  /** Чек-лист «что делать сейчас»: пункты можно отмечать. */
  steps?: readonly string[]
  note?: string
  address?: string
  /** true — пилюля закреплена в углу экрана; false — лежит в потоке (для превью). */
  fixed?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Экстренная кнопка ветклиники: закреплённая пилюля «Срочно» с пульсом
// и телефоном. По клику разворачивается в панель «что делать прямо
// сейчас»: большой телефон, чек-лист, пункты которого можно отмечать
// галочками, адрес. Esc закрывает. При fixed=false пилюля и панель лежат
// в потоке — так блок показывается в каталоге.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="vet-001"]){
--vibeui-vet-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-vet-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-001-on-accent:oklch(from var(--vibeui-vet-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-vet-001-muted:color-mix(in oklab,var(--vibeui-vet-001-fg) 62%,var(--vibeui-vet-001-bg));
--vibeui-vet-001-line:color-mix(in oklab,var(--vibeui-vet-001-fg) 12%,transparent);
--vibeui-vet-001-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-vet-001-bg) 88%,#fff));
--vibeui-vet-001-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-vet-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="vet-001"]{color-scheme:dark}
:where([data-vibeui-block="vet-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="vet-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="vet-001"]{box-sizing:border-box;position:relative;color:var(--vibeui-vet-001-fg);font-family:var(--vibeui-vet-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="vet-001"][data-fixed="false"]{padding:3rem 0;background:var(--vibeui-vet-001-bg)}
[data-vibeui-block="vet-001"][data-fixed="true"]{height:0;overflow:visible}
[data-vibeui-block="vet-001"] *{box-sizing:border-box}
[data-vibeui-block="vet-001"] [data-part="dock"]{display:grid;justify-items:end;gap:.7rem}
[data-vibeui-block="vet-001"] [data-part="dock"][data-fixed="true"]{position:fixed;right:1rem;bottom:1rem;z-index:60;width:22rem;max-width:calc(100vw - 2rem)}
[data-vibeui-block="vet-001"] [data-part="dock"][data-fixed="false"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;justify-items:center}
[data-vibeui-block="vet-001"] [data-part="pill"]{position:relative;display:inline-flex;align-items:center;gap:.6rem;padding:.8rem 1.2rem .8rem .9rem;border:0;border-radius:999px;background:var(--vibeui-vet-001-accent);color:var(--vibeui-vet-001-on-accent);font-family:var(--vibeui-vet-001-display);font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 18px 40px -16px var(--vibeui-vet-001-accent);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="vet-001"] [data-part="pill"]::before{content:"";position:absolute;inset:0;border-radius:inherit;border:3px solid var(--vibeui-vet-001-accent);opacity:0;animation:vibeui-vet-001-pulse 2s ease-out infinite}
[data-vibeui-block="vet-001"] [data-part="pill"]:hover{transform:translateY(-2px) scale(1.03)}
[data-vibeui-block="vet-001"] [data-part="pill"]:focus-visible{outline:2px solid var(--vibeui-vet-001-fg);outline-offset:3px}
[data-vibeui-block="vet-001"] [data-part="pill"] i{display:grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-vet-001-on-accent) 22%,transparent)}
[data-vibeui-block="vet-001"] [data-part="pill"] svg{width:1.05rem;height:1.05rem;animation:vibeui-vet-001-ring 2s ease-in-out infinite}
[data-vibeui-block="vet-001"] [data-part="pill"] small{font-family:var(--vibeui-vet-001-font);font-weight:500;font-size:.8rem;opacity:.85}
[data-vibeui-block="vet-001"] [data-part="panel"]{width:100%;padding:1.3rem 1.3rem 1.2rem;border-radius:1.5rem;background:var(--vibeui-vet-001-card);border:1px solid var(--vibeui-vet-001-line);box-shadow:0 30px 60px -30px rgb(0 0 0 / .45);transform-origin:100% 100%;animation:vibeui-vet-001-open .35s cubic-bezier(.34,1.4,.64,1) both}
[data-vibeui-block="vet-001"] [data-part="dock"][data-fixed="false"] [data-part="panel"]{max-width:24rem;transform-origin:50% 0}
[data-vibeui-block="vet-001"] [data-part="panel"][hidden]{display:none}
[data-vibeui-block="vet-001"] [data-part="head"]{display:flex;align-items:flex-start;gap:.8rem}
[data-vibeui-block="vet-001"] [data-part="head"] h3{margin:0;font-family:var(--vibeui-vet-001-display);font-weight:900;font-size:1.25rem;line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="vet-001"] [data-part="head"] p{margin:.3rem 0 0;font-size:.88rem;color:var(--vibeui-vet-001-muted)}
[data-vibeui-block="vet-001"] [data-part="close"]{margin-left:auto;flex-shrink:0;width:2rem;height:2rem;border:1px solid var(--vibeui-vet-001-line);border-radius:50%;background:transparent;color:inherit;font-size:1.1rem;line-height:1;cursor:pointer}
[data-vibeui-block="vet-001"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-vet-001-accent);outline-offset:2px}
[data-vibeui-block="vet-001"] [data-part="call"]{display:flex;align-items:center;justify-content:center;gap:.5rem;margin:1rem 0 0;padding:.85rem 1rem;border-radius:1rem;background:var(--vibeui-vet-001-accent);color:var(--vibeui-vet-001-on-accent);text-decoration:none;font-family:var(--vibeui-vet-001-display);font-weight:900;font-size:1.25rem;letter-spacing:-.01em;transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="vet-001"] [data-part="call"]:hover{transform:translateY(-2px)}
[data-vibeui-block="vet-001"] [data-part="call"]:focus-visible{outline:2px solid var(--vibeui-vet-001-fg);outline-offset:2px}
[data-vibeui-block="vet-001"] [data-part="call"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="vet-001"] [data-part="steps"]{margin:1rem 0 0;padding:0;list-style:none;display:grid;gap:.35rem}
[data-vibeui-block="vet-001"] [data-part="steps"] label{display:flex;gap:.65rem;align-items:flex-start;padding:.5rem .6rem;border-radius:.8rem;font-size:.92rem;cursor:pointer;transition:background .2s}
[data-vibeui-block="vet-001"] [data-part="steps"] label:hover{background:color-mix(in oklab,var(--vibeui-vet-001-fg) 5%,transparent)}
[data-vibeui-block="vet-001"] [data-part="steps"] input{position:absolute;opacity:0;width:1px;height:1px}
[data-vibeui-block="vet-001"] [data-part="steps"] i{flex-shrink:0;display:grid;place-items:center;width:1.3rem;height:1.3rem;margin-top:.1rem;border-radius:.4rem;border:2px solid var(--vibeui-vet-001-line);transition:background .2s,border-color .2s}
[data-vibeui-block="vet-001"] [data-part="steps"] i svg{width:.8rem;height:.8rem;color:var(--vibeui-vet-001-on-accent);stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .3s ease-out}
[data-vibeui-block="vet-001"] [data-part="steps"] input:checked + i{background:var(--vibeui-vet-001-accent);border-color:var(--vibeui-vet-001-accent)}
[data-vibeui-block="vet-001"] [data-part="steps"] input:checked + i svg{stroke-dashoffset:0}
[data-vibeui-block="vet-001"] [data-part="steps"] input:focus-visible + i{outline:2px solid var(--vibeui-vet-001-accent);outline-offset:2px}
[data-vibeui-block="vet-001"] [data-part="steps"] span{transition:color .2s,text-decoration-color .2s;text-decoration:line-through transparent}
[data-vibeui-block="vet-001"] [data-part="steps"] input:checked ~ span{color:var(--vibeui-vet-001-muted);text-decoration-color:currentColor}
[data-vibeui-block="vet-001"] [data-part="note"]{margin:.9rem 0 0;padding-top:.9rem;border-top:1px dashed var(--vibeui-vet-001-line);font-size:.82rem;color:var(--vibeui-vet-001-muted)}
[data-vibeui-block="vet-001"] [data-part="note"] b{display:block;color:var(--vibeui-vet-001-fg);font-weight:600}
@keyframes vibeui-vet-001-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.35);opacity:0}}
@keyframes vibeui-vet-001-ring{0%,100%{transform:rotate(0)}10%{transform:rotate(-18deg)}20%{transform:rotate(16deg)}30%{transform:rotate(-12deg)}40%{transform:rotate(8deg)}50%{transform:rotate(0)}}
@keyframes vibeui-vet-001-open{from{opacity:0;transform:scale(.85) translateY(10px)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="vet-001"] *{animation:none!important;transition:none!important}}`

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

/** Закреплённая кнопка «Срочно» с панелью «что делать сейчас». */
export function Vet001({
  label = "Срочно",
  phone = "+7 495 120-24-24",
  phoneHref = "tel:+74951202424",
  title = "Что делать прямо сейчас",
  lede = "Позвоните — мы уже готовим кабинет. Пока едете:",
  steps = ["Не кормите и не поите, если рвота или травма", "Заверните в полотенце, не давите на живот", "Отравление — не вызывайте рвоту сами, возьмите упаковку", "Кровотечение — плотная повязка, не жгут", "Скажите нам, сколько весит питомец"],
  note = "Дежурный врач круглосуточно, без записи. Ночью — вход со двора, кнопка у двери.",
  address = "Ленинградский пр., 62, вход со стороны парка",
  fixed = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Vet001Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const palette = {
    ...(accent ? { "--vibeui-vet-001-accent": accent } : null),
    ...(ink ? { "--vibeui-vet-001-fg": ink } : null),
    ...(background ? { "--vibeui-vet-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-vet-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="vet-001" data-tone={tone === "auto" ? undefined : tone} data-fixed={fixed} className={className} style={palette} aria-label="Экстренная помощь">
        <div data-part="dock" data-fixed={fixed}>
          <div data-part="panel" id="vibeui-vet-001-panel" hidden={!open}>
            <div data-part="head">
              <div>
                <h3>{title}</h3>
                {lede ? <p>{lede}</p> : null}
              </div>
              <button data-part="close" type="button" aria-label="Закрыть" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <a data-part="call" href={phoneHref}>
              <PhoneIcon />
              {phone}
            </a>
            {steps.length > 0 ? (
              <ul data-part="steps">
                {steps.map((step) => (
                  <li key={step}>
                    <label>
                      <input type="checkbox" />
                      <i aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </i>
                      <span>{step}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
            {note || address ? (
              <p data-part="note">
                {address ? <b>{address}</b> : null}
                {note}
              </p>
            ) : null}
          </div>
          <button data-part="pill" type="button" aria-expanded={open} aria-controls="vibeui-vet-001-panel" onClick={() => setOpen((value) => !value)}>
            <i aria-hidden="true">
              <PhoneIcon />
            </i>
            {label}
            <small>{phone}</small>
          </button>
        </div>
      </section>
    </>
  )
}
