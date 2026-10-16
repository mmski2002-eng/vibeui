import type { ComponentProps, CSSProperties } from "react"

type NotFound011Card = { label: string; hint: string; href: string; icon: string }

export type NotFound011Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  cardsLabel?: string
  cards?: NotFound011Card[]
  /** Цвет буквы под курсором и иконок карточек. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Заголовок, который отзывается на руку: буква под курсором подпрыгивает и
// перекрашивается, соседние приподнимаются следом. Под ним — сетка карточек
// «возможно, вы искали» с эмодзи-иконками. Размер шрифта подогнан под
// ширину блока, слова не переносятся посередине.
const STYLES = `
:where([data-vibeui-block="not-found-011"]){
--vibeui-not-found-011-bg:transparent;
--vibeui-not-found-011-fg:light-dark(oklch(0.15 0 0),oklch(0.96 0 0));
--vibeui-not-found-011-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-not-found-011-line:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 12%));
--vibeui-not-found-011-card:light-dark(oklch(0.98 0 0),oklch(0.21 0 0));
--vibeui-not-found-011-accent:light-dark(oklch(0.58 0.22 28),oklch(0.72 0.18 30));
--vibeui-not-found-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-011"]{color-scheme:dark}
[data-vibeui-block="not-found-011"]{display:block;background:var(--vibeui-not-found-011-bg);color:var(--vibeui-not-found-011-fg);font-family:var(--vibeui-not-found-011-font)}
[data-vibeui-block="not-found-011"] [data-part="layout"]{box-sizing:border-box;max-width:64rem;margin:0 auto;padding:3.5rem 1.5rem}
[data-vibeui-block="not-found-011"] [data-part="code"]{
display:inline-block;margin:0;padding:0.25rem 0.625rem;border-radius:999px;border:1px solid var(--vibeui-not-found-011-line);
color:var(--vibeui-not-found-011-muted);font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="not-found-011"] [data-part="title"]{margin:1rem 0 0;font-size:clamp(2.25rem,8.5cqi,5.5rem);font-weight:850;line-height:0.98;letter-spacing:-0.045em}
[data-vibeui-block="not-found-011"] [data-part="word"]{white-space:nowrap}
[data-vibeui-block="not-found-011"] [data-part="char"]{display:inline-block;transition:transform .25s cubic-bezier(.3,1.6,.5,1),color .2s ease}
[data-vibeui-block="not-found-011"] [data-part="char"]:hover{transform:translateY(-0.16em) rotate(-6deg);color:var(--vibeui-not-found-011-accent)}
[data-vibeui-block="not-found-011"] [data-part="char"]:has(+ [data-part="char"]:hover),
[data-vibeui-block="not-found-011"] [data-part="char"]:hover + [data-part="char"]{transform:translateY(-0.06em)}
[data-vibeui-block="not-found-011"] [data-part="text"]{margin:1.25rem 0 0;max-width:34rem;color:var(--vibeui-not-found-011-muted);font-size:1.0625rem;line-height:1.55}
[data-vibeui-block="not-found-011"] [data-part="cards-label"]{margin:2.5rem 0 0;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="not-found-011"] [data-part="cards"]{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:0.75rem;margin:0.875rem 0 0;padding:0;list-style:none}
[data-vibeui-block="not-found-011"] [data-part="card"]{
display:flex;gap:0.875rem;align-items:flex-start;height:100%;box-sizing:border-box;padding:1rem;border-radius:0.875rem;
background:var(--vibeui-not-found-011-card);box-shadow:inset 0 0 0 1px var(--vibeui-not-found-011-line);color:inherit;text-decoration:none;
transition:transform .2s ease,box-shadow .2s ease;
}
[data-vibeui-block="not-found-011"] [data-part="card"]:hover{transform:translateY(-3px);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-not-found-011-accent) 45%,transparent),0 1rem 2rem -1.25rem oklch(0 0 0 / 35%)}
[data-vibeui-block="not-found-011"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-not-found-011-accent);outline-offset:2px}
[data-vibeui-block="not-found-011"] [data-part="icon"]{
display:grid;place-items:center;flex:none;width:2.5rem;height:2.5rem;border-radius:0.625rem;font-size:1.25rem;
background:color-mix(in oklab,var(--vibeui-not-found-011-accent) 12%,transparent);
}
[data-vibeui-block="not-found-011"] [data-part="card-label"]{display:block;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="not-found-011"] [data-part="card-hint"]{display:block;margin-top:0.25rem;color:var(--vibeui-not-found-011-muted);font-size:0.8125rem;line-height:1.4}
@container (min-width:48rem){[data-vibeui-block="not-found-011"] [data-part="layout"]{padding:5rem 3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-011"] *{transition:none!important}}
`

const CARDS: NotFound011Card[] = [
  { icon: "🏠", label: "Главная", hint: "Начать сначала", href: "/" },
  { icon: "🧩", label: "Каталог", hint: "Все компоненты и блоки", href: "/components" },
  { icon: "💬", label: "Поддержка", hint: "Ответим в течение дня", href: "/contact" },
]

export function NotFound011({
  code = "Ошибка 404",
  title = "Вы забрели не туда",
  description = "Наведите курсор на буквы — они не кусаются. А чтобы найти нужное, загляните в один из разделов ниже.",
  cardsLabel = "Возможно, вы искали",
  cards = CARDS,
  accent,
  background,
  className,
  style,
  ...props
}: NotFound011Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-011-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-011" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-011" className={className} style={palette}>
        <div data-part="layout">
          <p data-part="code">{code}</p>
          <h1 data-part="title" aria-label={title}>
            {title.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} data-part="word" aria-hidden="true">
                {wordIndex > 0 ? " " : null}
                {word.split("").map((character, index) => (
                  <span key={index} data-part="char">
                    {character}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p data-part="text">{description}</p>
          <p data-part="cards-label">{cardsLabel}</p>
          <ul data-part="cards">
            {cards.map((card) => (
              <li key={card.href}>
                <a data-part="card" href={card.href}>
                  <span data-part="icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <span>
                    <span data-part="card-label">{card.label}</span>
                    <span data-part="card-hint">{card.hint}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
