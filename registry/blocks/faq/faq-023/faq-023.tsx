"use client"

import { useState, type CSSProperties } from "react"

export type Faq023Item = {
  question: string
  answer: string
}

export type Faq023Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq023Item[]
  contactLabel?: string
  contactHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы аккордеоном на мягких плитках: открыт один, плюс справа
// поворачивается в крестик, ответ раскрывается через grid-template-rows
// 0fr → 1fr. Открытая плитка подсвечивается акцентной рамкой; кнопка
// с aria-expanded, ответ с id для aria-controls. Внизу «не нашли — напишите».
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-023"]){
--vibeui-faq-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-023-muted:color-mix(in oklab,var(--vibeui-faq-023-fg) 60%,var(--vibeui-faq-023-bg));
--vibeui-faq-023-line:color-mix(in oklab,var(--vibeui-faq-023-fg) 12%,transparent);
--vibeui-faq-023-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-faq-023-bg) 85%,var(--vibeui-faq-023-fg)));
--vibeui-faq-023-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-023"]{color-scheme:dark}
:where([data-vibeui-block="faq-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-023"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-faq-023-bg);color:var(--vibeui-faq-023-fg);font-family:var(--vibeui-faq-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="faq-023"] *{box-sizing:border-box}
[data-vibeui-block="faq-023"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="faq-023"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-faq-023-accent)}
[data-vibeui-block="faq-023"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,5cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="faq-023"] [data-part="lede"]{margin:1rem 0 0;max-width:26rem;color:var(--vibeui-faq-023-muted)}
[data-vibeui-block="faq-023"] [data-part="contact"]{display:inline-flex;margin-top:1.4rem;padding:.7rem 1.1rem;border-radius:999px;box-shadow:0 0 0 1px var(--vibeui-faq-023-line) inset;color:inherit;text-decoration:none;font-weight:600;font-size:.9rem;transition:background .2s}
[data-vibeui-block="faq-023"] [data-part="contact"]:hover{background:var(--vibeui-faq-023-line)}
[data-vibeui-block="faq-023"] [data-part="list"]{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="faq-023"] [data-part="item"]{border-radius:1.1rem;background:var(--vibeui-faq-023-card);box-shadow:0 0 0 1px var(--vibeui-faq-023-line);transition:box-shadow .25s}
[data-vibeui-block="faq-023"] [data-part="item"][data-open="true"]{box-shadow:0 0 0 1.5px var(--vibeui-faq-023-accent)}
[data-vibeui-block="faq-023"] [data-part="q"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;width:100%;padding:1.1rem 1.3rem;border:0;background:none;color:inherit;font:inherit;font-weight:700;font-size:1.02rem;text-align:left;cursor:pointer;border-radius:1.1rem}
[data-vibeui-block="faq-023"] [data-part="q"] i{flex:none;position:relative;width:1.6rem;height:1.6rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-faq-023-accent) 12%,transparent);transition:transform .35s cubic-bezier(.2,.8,.2,1),background .2s}
[data-vibeui-block="faq-023"] [data-part="q"] i::before,[data-vibeui-block="faq-023"] [data-part="q"] i::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:2px;background:var(--vibeui-faq-023-accent);transform:translate(-50%,-50%)}
[data-vibeui-block="faq-023"] [data-part="q"] i::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="faq-023"] [data-part="q"][aria-expanded="true"] i{transform:rotate(45deg);background:var(--vibeui-faq-023-accent)}
[data-vibeui-block="faq-023"] [data-part="q"][aria-expanded="true"] i::before,[data-vibeui-block="faq-023"] [data-part="q"][aria-expanded="true"] i::after{background:var(--vibeui-faq-023-bg)}
[data-vibeui-block="faq-023"] [data-part="q"]:focus-visible{outline:2px solid var(--vibeui-faq-023-accent);outline-offset:-4px}
[data-vibeui-block="faq-023"] [data-part="a"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="faq-023"] [data-part="a"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="faq-023"] [data-part="a"] > div{overflow:hidden}
[data-vibeui-block="faq-023"] [data-part="a"] p{margin:0;padding:0 1.3rem 1.2rem;color:var(--vibeui-faq-023-muted)}
@container (min-width: 56rem){[data-vibeui-block="faq-023"] [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-023"] *{transition:none!important}}`

const DEFAULT_ITEMS: Faq023Item[] = [
  { question: "Приложение слушает меня всю ночь?", answer: "Только микрофоном и только на телефоне: звук не записывается и никуда не отправляется, анализируется ритм дыхания. Можно выключить — тогда фазы считаются по движению." },
  { question: "Что будет после 7 дней премиума?", answer: "Ничего страшного: премиум-функции закроются, бесплатные останутся навсегда. Мы напомним за день до конца пробного периода." },
  { question: "Работает без интернета?", answer: "Да, полностью. Синхронизация между устройствами — когда сеть появится." },
  { question: "Есть версия для часов?", answer: "Для Apple Watch и Wear OS — будильник и дыхание на запястье. Виджет с серией — в следующем обновлении." },
  { question: "Можно ли отменить подписку?", answer: "В любой момент в настройках магазина. Деньги за неиспользованный период вернут по правилам App Store и Google Play." },
]

/** Вопросы аккордеоном с плюсом-крестиком. */
export function Faq023({
  eyebrow = "Вопросы",
  title = "Спрашивают перед установкой",
  lede = "Коротко о приватности, деньгах и часах. Не нашли ответ — напишите, отвечаем за день.",
  items = DEFAULT_ITEMS,
  contactLabel = "Задать вопрос",
  contactHref = "#",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Faq023Props) {
  const [open, setOpen] = useState(0)
  const palette = {
    ...(accent ? { "--vibeui-faq-023-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-023-fg": ink } : null),
    ...(background ? { "--vibeui-faq-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {contactLabel ? (
              <a data-part="contact" href={contactHref}>
                {contactLabel}
              </a>
            ) : null}
          </div>
          <ul data-part="list">
            {items.map((item, index) => (
              <li key={item.question} data-part="item" data-open={open === index}>
                <button type="button" data-part="q" aria-expanded={open === index} aria-controls={`vibeui-faq-023-${index}`} onClick={() => setOpen(open === index ? -1 : index)}>
                  {item.question}
                  <i aria-hidden="true" />
                </button>
                <div data-part="a" data-open={open === index} id={`vibeui-faq-023-${index}`}>
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
