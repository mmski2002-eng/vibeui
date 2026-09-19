import type { CSSProperties } from "react"

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
// Без состояния: всё на CSS.
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
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-012"]{color-scheme:dark}
:where([data-vibeui-block="people-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-012"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-people-012-bg);color:var(--vibeui-people-012-fg);font-family:var(--vibeui-people-012-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="people-012"] *{box-sizing:border-box}
[data-vibeui-block="people-012"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-012"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-people-012-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="people-012"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-people-012-accent);border-radius:2px}
[data-vibeui-block="people-012"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-012-display);font-weight:600;letter-spacing:-.02em;line-height:1.02;font-size:clamp(2rem,4.6cqi,3.6rem)}
[data-vibeui-block="people-012"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-people-012-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="people-012"] [data-part="tiles"]{display:grid;gap:1.25rem;margin-top:2.5rem}
[data-vibeui-block="people-012"] [data-part="tile"]{position:relative;display:grid;border-radius:1.4rem;overflow:hidden;min-height:28rem;background:var(--vibeui-people-012-panel);box-shadow:0 30px 60px -40px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-people-012-line)}
[data-vibeui-block="people-012"] [data-part="tile"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 12%;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="people-012"] [data-part="tile"]:hover img,[data-vibeui-block="people-012"] [data-part="tile"]:focus-within img{transform:translateX(-18%) scale(1.04)}
[data-vibeui-block="people-012"] [data-part="front"]{position:relative;z-index:1;align-self:end;padding:1.5rem;background:linear-gradient(180deg,transparent,rgb(0 0 0 / .72));color:#fff}
[data-vibeui-block="people-012"] [data-part="front"] h3{margin:0;font-family:var(--vibeui-people-012-display);font-size:1.7rem;font-weight:600;letter-spacing:-.02em;line-height:1.05}
[data-vibeui-block="people-012"] [data-part="front"] p{margin:.3rem 0 0;opacity:.85;font-size:.92rem}
[data-vibeui-block="people-012"] [data-part="front"] q{display:block;margin-top:.9rem;font-family:var(--vibeui-people-012-hand);font-size:1.4rem;line-height:1.15;quotes:"«" "»"}
[data-vibeui-block="people-012"] [data-part="back"]{position:absolute;right:0;top:0;bottom:0;width:min(62%,20rem);z-index:2;padding:1.5rem;display:grid;align-content:center;gap:.75rem;background:var(--vibeui-people-012-panel);color:var(--vibeui-people-012-fg);transform:translateX(100%);transition:transform .6s cubic-bezier(.2,.8,.2,1);box-shadow:-20px 0 40px -30px rgb(0 0 0 / .5)}
[data-vibeui-block="people-012"] [data-part="tile"]:hover [data-part="back"],[data-vibeui-block="people-012"] [data-part="tile"]:focus-within [data-part="back"]{transform:none}
[data-vibeui-block="people-012"] [data-part="back"] small{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--vibeui-people-012-accent)}
[data-vibeui-block="people-012"] [data-part="back"] p{margin:0;font-family:var(--vibeui-people-012-hand);font-size:1.45rem;line-height:1.15}
[data-vibeui-block="people-012"] [data-part="back"]::before{content:"";position:absolute;left:.9rem;top:.9rem;width:2.4rem;height:.9rem;background:color-mix(in oklab,var(--vibeui-people-012-accent) 50%,transparent);transform:rotate(-8deg);border-radius:2px}
[data-vibeui-block="people-012"] [data-part="peek"]{position:absolute;right:1rem;top:1rem;z-index:3;padding:.4rem .7rem;border-radius:999px;background:rgb(255 255 255 / .85);backdrop-filter:blur(6px);font-size:.72rem;font-weight:600;color:#1a1a1a}
[data-vibeui-block="people-012"] [data-part="tile"]:focus-visible{outline:2px solid var(--vibeui-people-012-accent);outline-offset:3px}
@container (min-width: 52rem){[data-vibeui-block="people-012"] [data-part="tiles"]{grid-template-columns:1fr 1fr}}
@media (hover:none){[data-vibeui-block="people-012"] [data-part="back"]{position:relative;width:auto;transform:none;box-shadow:none}[data-vibeui-block="people-012"] [data-part="tile"]{grid-template-rows:20rem auto}[data-vibeui-block="people-012"] [data-part="tile"] img{position:relative;height:20rem}[data-vibeui-block="people-012"] [data-part="front"]{position:absolute;left:0;right:0;top:0;height:20rem;align-content:end;display:grid}[data-vibeui-block="people-012"] [data-part="peek"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-012"] *{transition:none!important}}`

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
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="tiles">
            {people.map((person) => (
              <article key={person.name} data-part="tile" tabIndex={person.note ? 0 : undefined}>
                {person.image ? <img src={person.image} alt={person.imageAlt ?? `${person.name}${person.role ? `, ${person.role.toLowerCase()}` : ""}`} /> : null}
                {person.note && peekLabel ? (
                  <span data-part="peek" aria-hidden="true">
                    {peekLabel}
                  </span>
                ) : null}
                <div data-part="front">
                  <h3>{person.name}</h3>
                  {person.role ? <p>{person.role}</p> : null}
                  {person.quote ? <q>{person.quote}</q> : null}
                </div>
                {person.note ? (
                  <div data-part="back">
                    <small>{noteLabel}</small>
                    <p>{person.note}</p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
