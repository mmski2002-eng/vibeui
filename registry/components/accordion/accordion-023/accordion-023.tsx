"use client"

import { useId, useState, type ComponentProps, type CSSProperties } from "react"

export type Accordion023Item = {
  question: string
  answer: string
}

export type Accordion023Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion023Item[]
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  accent?: string
  /** Цвет текста. Пусто — чернильный по color-scheme окружения. */
  ink?: string
  /** Цвет подложки страницы, от которого считаются плашка и приглушённые тона. */
  background?: string
}

// Идея компонента: плитки на мягких плашках, открыт один раздел; плюс справа
// поворачивается в крестик и заливается акцентом, ответ раскрывается через
// grid-template-rows 0fr → 1fr с плавной высотой. Состояние — индекс
// открытого раздела в React: кнопка с aria-expanded и aria-controls, потому
// что анимация высоты нативным details не даётся.
const STYLES = `
:where([data-vibeui-block="accordion-023"]){
--vibeui-accordion-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-accordion-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-023-muted:color-mix(in oklab,var(--vibeui-accordion-023-fg) 60%,var(--vibeui-accordion-023-bg));
--vibeui-accordion-023-line:color-mix(in oklab,var(--vibeui-accordion-023-fg) 12%,transparent);
--vibeui-accordion-023-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-accordion-023-bg) 85%,var(--vibeui-accordion-023-fg)));
--vibeui-accordion-023-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-023"]{color-scheme:dark}
[data-vibeui-block="accordion-023"] [data-part="deck"]{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="accordion-023"] [data-part="item"]{border-radius:1.1rem;background:var(--vibeui-accordion-023-card);box-shadow:0 0 0 1px var(--vibeui-accordion-023-line);transition:box-shadow .25s}
[data-vibeui-block="accordion-023"] [data-part="item"][data-open="true"]{box-shadow:0 0 0 1.5px var(--vibeui-accordion-023-accent)}
[data-vibeui-block="accordion-023"] [data-part="q"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;width:100%;padding:1.1rem 1.3rem;border:0;background:none;color:inherit;font:inherit;font-weight:700;font-size:1.02rem;text-align:left;cursor:pointer;border-radius:1.1rem}
[data-vibeui-block="accordion-023"] [data-part="q"] i{flex:none;position:relative;width:1.6rem;height:1.6rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-accordion-023-accent) 12%,transparent);transition:transform .35s cubic-bezier(.2,.8,.2,1),background .2s}
[data-vibeui-block="accordion-023"] [data-part="q"] i::before,[data-vibeui-block="accordion-023"] [data-part="q"] i::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:2px;background:var(--vibeui-accordion-023-accent);transform:translate(-50%,-50%)}
[data-vibeui-block="accordion-023"] [data-part="q"] i::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="accordion-023"] [data-part="q"][aria-expanded="true"] i{transform:rotate(45deg);background:var(--vibeui-accordion-023-accent)}
[data-vibeui-block="accordion-023"] [data-part="q"][aria-expanded="true"] i::before,[data-vibeui-block="accordion-023"] [data-part="q"][aria-expanded="true"] i::after{background:var(--vibeui-accordion-023-bg)}
[data-vibeui-block="accordion-023"] [data-part="q"]:focus-visible{outline:2px solid var(--vibeui-accordion-023-accent);outline-offset:-4px}
[data-vibeui-block="accordion-023"] [data-part="a"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="accordion-023"] [data-part="a"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="accordion-023"] [data-part="a"] > div{overflow:hidden}
[data-vibeui-block="accordion-023"] [data-part="a"] p{margin:0;padding:0 1.3rem 1.2rem;color:var(--vibeui-accordion-023-muted)}
[data-vibeui-block="accordion-023"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-023-fg);font-family:var(--vibeui-accordion-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="accordion-023"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion023Item[] = [
  { question: "Приложение слушает меня всю ночь?", answer: "Только микрофоном и только на телефоне: звук не записывается и никуда не отправляется, анализируется ритм дыхания. Можно выключить — тогда фазы считаются по движению." },
  { question: "Что будет после 7 дней премиума?", answer: "Ничего страшного: премиум-функции закроются, бесплатные останутся навсегда. Мы напомним за день до конца пробного периода." },
  { question: "Работает без интернета?", answer: "Да, полностью. Синхронизация между устройствами — когда сеть появится." },
  { question: "Есть версия для часов?", answer: "Для Apple Watch и Wear OS — будильник и дыхание на запястье. Виджет с серией — в следующем обновлении." },
  { question: "Можно ли отменить подписку?", answer: "В любой момент в настройках магазина. Деньги за неиспользованный период вернут по правилам App Store и Google Play." },
]

/**
 * Аккордеон-плитки с плюсом-крестиком: один открыт, высота анимируется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion023({
  items = DEFAULT_ITEMS,
  defaultOpen = 0,
  accent,
  ink = "",
  background = "",
  className,
  style,
  ...props
}: Accordion023Props) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-accordion-023-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-023-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-023"
        className={className}
        style={palette}
      >
        <ul data-part="deck">
          {items.map((item, index) => (
            <li key={item.question} data-part="item" data-open={open === index}>
              <button
                type="button"
                data-part="q"
                aria-expanded={open === index}
                aria-controls={`${id}-${index}`}
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                {item.question}
                <i aria-hidden="true" />
              </button>
              <div data-part="a" data-open={open === index} id={`${id}-${index}`}>
                <div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
