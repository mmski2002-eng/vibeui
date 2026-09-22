import { useId, type CSSProperties } from "react"

import {
  Accordion019,
  type Accordion019Item,
} from "@/registry/components/accordion/accordion-019/accordion-019"

export type Faq019Item = Accordion019Item

export type Faq019Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq019Item[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  openFirst?: boolean
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы: аккордеон на details, у открытого вопроса слева загорается
// неоновая линия и номер светится, плюс поворачивается в крестик. Открыт
// один (name у details). Ответ проявляется снизу. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-019"]){
--vibeui-faq-019-bg:#07060b;
--vibeui-faq-019-fg:#f3eefc;
--vibeui-faq-019-muted:#a39bb5;
--vibeui-faq-019-line:rgb(255 255 255 / .12);
--vibeui-faq-019-accent:#ff2bd6;
--vibeui-faq-019-cyan:#22f3ff;
--vibeui-faq-019-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-faq-019-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-faq-019-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-019"]{color-scheme:dark}
:where([data-vibeui-block="faq-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-019"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-019-bg);color:var(--vibeui-faq-019-fg);font-family:var(--vibeui-faq-019-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="faq-019"] *{box-sizing:border-box}
/* Поверхность тёмная в обеих темах: части внутри переключаются в тёмную схему. */
[data-vibeui-block="faq-019"] [data-part="shell"]{color-scheme:dark}
[data-vibeui-block="faq-019"] [data-part="shell"]{display:grid;gap:2rem;max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
/* Список вопросов — accordion-019, ему отдаётся вся колонка. */
[data-vibeui-block="faq-019"] [data-part="list"]{width:100%;max-width:none}
[data-vibeui-block="faq-019"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-faq-019-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-faq-019-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-faq-019-cyan) 70%,transparent)}
[data-vibeui-block="faq-019"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-faq-019-cyan);box-shadow:0 0 8px var(--vibeui-faq-019-cyan)}
[data-vibeui-block="faq-019"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-019-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="faq-019"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-faq-019-muted)}
to{opacity:1;transform:none}}
@container (min-width: 60rem){
[data-vibeui-block="faq-019"] [data-part="shell"]{grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="faq-019"] [data-part="head"]{position:sticky;top:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-019"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Faq019Item[] = [
  { question: "Это больно?", answer: "Терпимо. Ощущения зависят от зоны: плечо и предплечье почти не чувствуются, рёбра и ступни — острее. Перерывы каждые 40 минут, для чувствительных зон есть анестезия." },
  { question: "Сколько заживает?", answer: "Верхний слой — 10–14 дней, полностью — месяц. Первые три дня под плёнкой, потом крем два раза в день. Инструкцию выдаём с собой." },
  { question: "Можно ли прийти с 16 лет?", answer: "С 18. Исключений нет, паспорт спросим на первом сеансе." },
  { question: "Как выбрать мастера?", answer: "По стилю. Реализм — к Марку, олд-скул — к Асе, графика — к Тимуру, минимализм — к Лине. Если не уверены, напишите, подскажем." },
  { question: "Можно ли перекрыть старую татуировку?", answer: "Чаще всего да. Пришлите фото — скажем, что получится сделать и нужно ли сначала осветлить лазером." },
  { question: "Что нельзя перед сеансом?", answer: "Алкоголь за сутки, солнце и солярий за три дня, кроворазжижающие. Выспаться и поесть — можно и нужно." },
]

/** Вопросы тату-студии: аккордеон с неоновой линией у открытого вопроса и липким заголовком. */
export function Faq019({
  eyebrow = "Вопросы",
  title = "Что спрашивают до первой иглы",
  lede = "Про боль, заживление, возраст и перекрытия. Не нашли своё — напишите, отвечаем в течение часа.",
  items = DEFAULT_ITEMS,
  tone = "auto",
  accent,
  openFirst = false,
  background,
  className,
  style,
}: Faq019Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-019-accent": accent } : null),
    ...(background ? { "--vibeui-faq-019-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-019" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-019" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <Accordion019
            defaultOpen={openFirst ? 0 : -1}
            data-part="list"
            items={items}
            group={group}
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
