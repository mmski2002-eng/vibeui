import type { CSSProperties } from "react"
import { Card057 } from "@/registry/components/card/card-057/card-057"

export type People012Person = {
  name: string
  role?: string
  quote?: string
  /** Рукописная записка на обороте: открывается по наведению. */
  note?: string
  image?: string
  imageAlt?: string
}

export type People012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  peekLabel?: string
  noteLabel?: string
  people?: readonly People012Person[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Люди как активные bento-плитки: крупное фото, имя, роль и цитата
// рукописным шрифтом снизу. По наведению (или фокусу) фото сдвигается, а
// справа выезжает «записка» — короткая история на пергаменте с полоской
// скотча. На устройствах без hover записка всегда раскрыта под фото.
// Появление — scroll-driven: заголовок поднимается словами из-под маски,
// плитки въезжают и распрямляются по мере входа в кадр
// (`animation-timeline: view()`; без поддержки — просто видно). Фото
// медленно едет внутри плитки при прокрутке — параллакс. Без состояния:
// всё на CSS.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="people-012"]){
--vibeui-people-012-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-012-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-012-muted:color-mix(in oklab,var(--vibeui-people-012-fg) 60%,var(--vibeui-people-012-bg));
--vibeui-people-012-panel:color-mix(in oklab,var(--vibeui-people-012-fg) 6%,var(--vibeui-people-012-bg));
--vibeui-people-012-line:color-mix(in oklab,var(--vibeui-people-012-fg) 12%,transparent);
--vibeui-people-012-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-people-012-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-012-hand:"Caveat",cursive;
--vibeui-people-012-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-012"]{color-scheme:dark}
:where([data-vibeui-block="people-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-012"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-people-012-bg);color:var(--vibeui-people-012-fg);font-family:var(--vibeui-people-012-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="people-012"] *{box-sizing:border-box}
[data-vibeui-block="people-012"] [data-part="glow"]{position:absolute;left:30%;top:-4rem;width:46rem;height:26rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-people-012-accent) 12%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="people-012"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-012"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-people-012-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="people-012"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-people-012-accent);border-radius:2px}
[data-vibeui-block="people-012"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-012-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="people-012"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="people-012"] [data-part="word"] i{display:inline-block;font-style:normal}
[data-vibeui-block="people-012"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-people-012-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="people-012"] [data-part="tiles"]{display:grid;gap:1.25rem;margin-top:2.5rem}
@keyframes vibeui-people-012-nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(-.25rem)}}
@keyframes vibeui-people-012-rise{from{transform:translateY(112%)}to{transform:none}}
@keyframes vibeui-people-012-in{from{opacity:0;translate:0 3rem;rotate:var(--vibeui-people-012-r,0deg)}to{opacity:1;translate:0 0;rotate:0deg}}
@keyframes vibeui-people-012-drift{from{translate:0 -4%}to{translate:0 4%}}
@supports (animation-timeline: view()){
[data-vibeui-block="people-012"] [data-part="word"] i{animation:vibeui-people-012-rise linear both;animation-timeline:view();animation-range:entry 0% entry 60%}
[data-vibeui-block="people-012"] [data-part="lede"]{animation:vibeui-people-012-in linear both;animation-timeline:view();animation-range:entry 0% entry 70%}
}
@container (min-width: 52rem){[data-vibeui-block="people-012"] [data-part="tiles"]{grid-template-columns:1fr 1fr}}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-012"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PEOPLE: People012Person[] = [
  { name: "Ольга", role: "Пекарь, закваске шесть лет", quote: "Хлеб не терпит спешки. Всё, что я делаю, — не мешаю ему.", note: "В 5 утра я одна в пекарне. Включаю печь, ставлю чайник и слушаю, как потрескивает первая партия.", image: "/demo/bakery/olga.webp" },
  { name: "Тимур", role: "Бариста, обжарка по четвергам", quote: "Эспрессо — это 25 секунд. Всё остальное — про молоко и настроение.", note: "Мой стандарт: 18 грамм в 36, 93 градуса, и если гость улыбнулся до первого глотка — смена удалась.", image: "/demo/bakery/timur.webp" },
]

/** Команда плитками: фото, цитата и записка на обороте по наведению. */
export function People012({
  eyebrow = "Люди",
  title = "Нас двое, и мы не спим",
  lede = "Наведите на карточку — расскажем, что происходит в пять утра.",
  peekLabel = "что в 5 утра?",
  noteLabel = "Записка",
  people = DEFAULT_PEOPLE,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People012Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-012-accent": accent } : null),
    ...(ink ? { "--vibeui-people-012-fg": ink } : null),
    ...(background ? { "--vibeui-people-012-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-012" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-012" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, index, all) => (
              <span key={`${word}-${index}`}>
                <span data-part="word">
                  <i>{word}</i>
                </span>
                {index < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="tiles">
            {people.map((person, index) => (
              <Card057 key={person.name} data-part="tile" name={person.name} note={person.note} image={person.image} imageAlt={person.imageAlt} role={person.role} quote={person.quote} peekLabel={peekLabel} noteLabel={noteLabel} index={index} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
