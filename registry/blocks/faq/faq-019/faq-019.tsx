import { useId, type CSSProperties } from "react"

export type Faq019Item = {
  question: string
  answer: string
}

export type Faq019Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq019Item[]
  tone?: "auto" | "light" | "dark"
  accent?: string
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
[data-vibeui-block="faq-019"] [data-part="shell"]{display:grid;gap:2rem;max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="faq-019"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-faq-019-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-faq-019-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-faq-019-cyan) 70%,transparent)}
[data-vibeui-block="faq-019"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-faq-019-cyan);box-shadow:0 0 8px var(--vibeui-faq-019-cyan)}
[data-vibeui-block="faq-019"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-019-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="faq-019"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-faq-019-muted)}
[data-vibeui-block="faq-019"] [data-part="list"]{display:grid;gap:.5rem}
[data-vibeui-block="faq-019"] details{position:relative;border:1px solid var(--vibeui-faq-019-line);border-radius:.8rem;background:linear-gradient(180deg,rgb(255 255 255 / .03),transparent);transition:border-color .3s,box-shadow .3s}
[data-vibeui-block="faq-019"] details::before{content:"";position:absolute;left:-1px;top:1rem;bottom:1rem;width:3px;border-radius:3px;background:var(--vibeui-faq-019-accent);box-shadow:0 0 10px var(--vibeui-faq-019-accent),0 0 24px color-mix(in oklab,var(--vibeui-faq-019-accent) 50%,transparent);transform:scaleY(0);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="faq-019"] details[open]{border-color:color-mix(in oklab,var(--vibeui-faq-019-accent) 45%,transparent);box-shadow:0 0 22px color-mix(in oklab,var(--vibeui-faq-019-accent) 15%,transparent)}
[data-vibeui-block="faq-019"] details[open]::before{transform:scaleY(1)}
[data-vibeui-block="faq-019"] summary{display:grid;grid-template-columns:2.2rem minmax(0,1fr) 1.5rem;align-items:center;gap:.75rem;padding:1rem 1.1rem;cursor:pointer;list-style:none;font-family:var(--vibeui-faq-019-display);font-size:1.05rem;font-weight:600;line-height:1.25}
[data-vibeui-block="faq-019"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-019"] summary:focus-visible{outline:2px solid var(--vibeui-faq-019-cyan);outline-offset:-2px;border-radius:.8rem}
[data-vibeui-block="faq-019"] [data-part="num"]{font-family:var(--vibeui-faq-019-mono);font-size:.75rem;color:var(--vibeui-faq-019-muted);transition:color .3s,text-shadow .3s}
[data-vibeui-block="faq-019"] details[open] [data-part="num"]{color:var(--vibeui-faq-019-accent);text-shadow:0 0 8px var(--vibeui-faq-019-accent)}
[data-vibeui-block="faq-019"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;border-radius:50%;border:1px solid var(--vibeui-faq-019-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .3s}
[data-vibeui-block="faq-019"] details[open] [data-part="plus"]{transform:rotate(45deg);border-color:var(--vibeui-faq-019-accent)}
[data-vibeui-block="faq-019"] [data-part="plus"]::before,[data-vibeui-block="faq-019"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1.5px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="faq-019"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="faq-019"] [data-part="answer"]{margin:0;padding:0 1.1rem 1.1rem 4.05rem;color:var(--vibeui-faq-019-muted);animation:vibeui-faq-019-in .35s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-faq-019-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
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
          <div data-part="list">
            {items.map((item, index) => (
              <details key={item.question} name={group}>
                <summary>
                  <span data-part="num">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.question}</span>
                  <span data-part="plus" aria-hidden="true" />
                </summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
