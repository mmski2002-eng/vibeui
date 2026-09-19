"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Cta026Props = {
  eyebrow?: string
  title?: string
  lede?: string
  placeholder?: string
  actionLabel?: string
  /** Подпись под полем: «без карты», «14 дней». */
  fine?: readonly string[]
  /** Что показать после отправки. */
  doneTitle?: string
  doneText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Финальный призыв: стеклянная карточка на аврора-пятнах, которые медленно
// плавают. Одно поле почты и кнопка, три подписи-«без карты». После
// отправки карточка меняет содержимое на «письмо ушло» с галочкой в
// кружке, который прорисовывается. Форма ничего не отправляет наружу —
// заглушка, в проекте подключается свой обработчик.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-026"]){
--vibeui-cta-026-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-026-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-026-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-026-on-accent:oklch(from var(--vibeui-cta-026-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-026-muted:color-mix(in oklab,var(--vibeui-cta-026-fg) 60%,var(--vibeui-cta-026-bg));
--vibeui-cta-026-line:color-mix(in oklab,var(--vibeui-cta-026-fg) 14%,transparent);
--vibeui-cta-026-glass:color-mix(in oklab,var(--vibeui-cta-026-bg) 55%,transparent);
--vibeui-cta-026-violet:color-mix(in oklab,var(--vibeui-cta-026-accent) 40%,#a855f7);
--vibeui-cta-026-rose:color-mix(in oklab,var(--vibeui-cta-026-accent) 30%,#f472b6);
--vibeui-cta-026-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-026-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-026-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-026"]{color-scheme:dark}
:where([data-vibeui-block="cta-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-026"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-026"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-cta-026-bg);color:var(--vibeui-cta-026-fg);font-family:var(--vibeui-cta-026-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-026"] *{box-sizing:border-box}
[data-vibeui-block="cta-026"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-026"] [data-part="frame"]{position:relative;overflow:hidden;border-radius:2rem;padding:1.25rem;isolation:isolate}
[data-vibeui-block="cta-026"] [data-part="blob"]{position:absolute;z-index:-1;border-radius:50%;filter:blur(70px);opacity:.5;animation:vibeui-cta-026-float 14s ease-in-out infinite alternate}
[data-vibeui-block="cta-026"] [data-part="blob"]:nth-child(1){width:60%;aspect-ratio:1;left:-15%;top:-30%;background:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="blob"]:nth-child(2){width:55%;aspect-ratio:1;right:-15%;top:-10%;background:var(--vibeui-cta-026-violet);animation-delay:-5s}
[data-vibeui-block="cta-026"] [data-part="blob"]:nth-child(3){width:50%;aspect-ratio:1;left:30%;bottom:-40%;background:var(--vibeui-cta-026-rose);animation-delay:-9s}
[data-vibeui-block="cta-026"] [data-part="card"]{position:relative;max-width:40rem;margin:0 auto;padding:clamp(2rem,5cqi,3.5rem) clamp(1.25rem,4cqi,3rem);border-radius:1.5rem;background:var(--vibeui-cta-026-glass);border:1px solid color-mix(in oklab,var(--vibeui-cta-026-fg) 18%,transparent);backdrop-filter:blur(24px);box-shadow:0 1px 0 rgb(255 255 255 / .18) inset,0 40px 80px -40px rgb(0 0 0 / .6);text-align:center}
[data-vibeui-block="cta-026"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-cta-026-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-026-display);font-weight:800;font-size:clamp(1.9rem,4.6cqi,3rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="cta-026"] [data-part="lede"]{margin:1rem auto 0;max-width:28rem;color:var(--vibeui-cta-026-muted)}
[data-vibeui-block="cta-026"] [data-part="form"]{display:grid;gap:.6rem;margin:1.8rem 0 0}
[data-vibeui-block="cta-026"] [data-part="form"] input{width:100%;height:3.1rem;padding:0 1.1rem;border-radius:999px;border:1px solid var(--vibeui-cta-026-line);background:color-mix(in oklab,var(--vibeui-cta-026-bg) 80%,transparent);color:var(--vibeui-cta-026-fg);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="cta-026"] [data-part="form"] input::placeholder{color:var(--vibeui-cta-026-muted)}
[data-vibeui-block="cta-026"] [data-part="form"] input:focus-visible{border-color:var(--vibeui-cta-026-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-cta-026-accent) 25%,transparent)}
[data-vibeui-block="cta-026"] [data-part="form"] button{height:3.1rem;padding:0 1.4rem;border-radius:999px;border:0;background:var(--vibeui-cta-026-accent);color:var(--vibeui-cta-026-on-accent);font:inherit;font-weight:600;cursor:pointer;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="cta-026"] [data-part="form"] button:hover{transform:translateY(-1px);box-shadow:0 12px 30px -10px var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="form"] button:focus-visible{outline:2px solid var(--vibeui-cta-026-fg);outline-offset:2px}
[data-vibeui-block="cta-026"] [data-part="fine"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem 1.2rem;margin:1rem 0 0;padding:0;list-style:none;font-size:.8rem;color:var(--vibeui-cta-026-muted)}
[data-vibeui-block="cta-026"] [data-part="fine"] li::before{content:"✓ ";color:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;padding:1rem 0}
[data-vibeui-block="cta-026"] [data-part="done"] svg{width:4rem;height:4rem;color:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-cta-026-draw .8s ease-out forwards}
[data-vibeui-block="cta-026"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-cta-026-draw .5s ease-out .5s forwards}
[data-vibeui-block="cta-026"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-cta-026-display);font-size:1.4rem;font-weight:700}
[data-vibeui-block="cta-026"] [data-part="done"] p{margin:0;color:var(--vibeui-cta-026-muted)}
@keyframes vibeui-cta-026-float{from{transform:translate(0,0) scale(1)}to{transform:translate(8%,12%) scale(1.15)}}
@keyframes vibeui-cta-026-draw{to{stroke-dashoffset:0}}
@container (min-width: 36rem){[data-vibeui-block="cta-026"] [data-part="form"]{grid-template-columns:1fr auto}}
@container (min-width: 56rem){[data-vibeui-block="cta-026"] [data-part="frame"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-026"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-026"] [data-part="done"] circle,[data-vibeui-block="cta-026"] [data-part="done"] path{stroke-dashoffset:0}}`

/** Стеклянный призыв с полем почты на плавающей авроре. */
export function Cta026({
  eyebrow = "Начать",
  title = "Следующий созвон уже можно не конспектировать",
  lede = "Оставьте почту — пришлём ссылку на рабочее пространство. Первые пять встреч бесплатно, карта не нужна.",
  placeholder = "Рабочая почта",
  actionLabel = "Начать бесплатно",
  fine = ["Без карты", "5 встреч бесплатно", "Отключить в один клик"],
  doneTitle = "Письмо ушло",
  doneText = "Ссылка на пространство придёт через минуту. Проверьте «Спам», если что.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta026Props) {
  const [done, setDone] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-cta-026-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-026-fg": ink } : null),
    ...(background ? { "--vibeui-cta-026-bg": background } : null),
    ...style,
  } as CSSProperties

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-026" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-026" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="frame">
            <i data-part="blob" aria-hidden="true" />
            <i data-part="blob" aria-hidden="true" />
            <i data-part="blob" aria-hidden="true" />
            <div data-part="card" aria-live="polite">
              {done ? (
                <div data-part="done">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="32" cy="32" r="25" />
                    <path d="M21 33l8 8 14-16" />
                  </svg>
                  <h3>{doneTitle}</h3>
                  <p>{doneText}</p>
                </div>
              ) : (
                <>
                  {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                  <h2 data-part="title">{title}</h2>
                  {lede ? <p data-part="lede">{lede}</p> : null}
                  <form data-part="form" onSubmit={submit}>
                    <input type="email" name="email" required placeholder={placeholder} aria-label={placeholder} autoComplete="email" />
                    <button type="submit">{actionLabel}</button>
                  </form>
                  {fine.length > 0 ? (
                    <ul data-part="fine">
                      {fine.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
