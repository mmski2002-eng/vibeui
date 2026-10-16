import type { ComponentProps, CSSProperties } from "react"

export type NotFound009Props = Omit<ComponentProps<"section">, "children"> & {
  masthead?: string
  issue?: string
  kicker?: string
  title?: string
  lead?: string
  /** Особые приметы пропавшей страницы — пункты объявления. */
  signs?: string[]
  signsLabel?: string
  reward?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет штампа «Разыскивается». */
  accent?: string
  /** Пусто — газетная бумага. */
  background?: string
}

// Газетная полоса: «Вестник 404» сообщает о пропаже страницы. Антиква,
// колонки, двойные линейки, особые приметы списком и красный штамп
// «Разыскивается», слегка повёрнутый. Сеть редакционных правил делает
// из ошибки маленький сюжет, который хочется дочитать.
const STYLES = `
:where([data-vibeui-block="not-found-009"]){
--vibeui-not-found-009-bg:light-dark(oklch(0.955 0.015 85),oklch(0.19 0.01 85));
--vibeui-not-found-009-fg:light-dark(oklch(0.16 0.01 85),oklch(0.93 0.01 85));
--vibeui-not-found-009-muted:light-dark(oklch(0.42 0.015 85),oklch(0.72 0.015 85));
--vibeui-not-found-009-rule:light-dark(oklch(0.16 0.01 85),oklch(0.93 0.01 85));
--vibeui-not-found-009-accent:light-dark(oklch(0.52 0.2 28),oklch(0.66 0.19 28));
--vibeui-not-found-009-serif:"Playfair Display",ui-serif,Georgia,Cambria,"Times New Roman",serif;
--vibeui-not-found-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-009"]{color-scheme:dark}
[data-vibeui-block="not-found-009"]{display:block;background:var(--vibeui-not-found-009-bg);color:var(--vibeui-not-found-009-fg);font-family:var(--vibeui-not-found-009-serif)}
[data-vibeui-block="not-found-009"] [data-part="layout"]{position:relative;box-sizing:border-box;max-width:60rem;margin:0 auto;padding:2.5rem 1.5rem 3rem}
[data-vibeui-block="not-found-009"] [data-part="masthead"]{
margin:0;padding-bottom:0.5rem;border-bottom:3px double var(--vibeui-not-found-009-rule);text-align:center;
font-size:clamp(2rem,8cqi,4rem);font-weight:900;letter-spacing:-0.02em;line-height:1;
}
[data-vibeui-block="not-found-009"] [data-part="issue"]{
display:flex;justify-content:space-between;gap:1rem;margin:0;padding:0.375rem 0;border-bottom:1px solid var(--vibeui-not-found-009-rule);
font-family:var(--vibeui-not-found-009-sans);font-size:0.6875rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="not-found-009"] [data-part="kicker"]{margin:1.75rem 0 0;color:var(--vibeui-not-found-009-accent);font-family:var(--vibeui-not-found-009-sans);font-size:0.75rem;font-weight:800;letter-spacing:0.16em;text-transform:uppercase}
[data-vibeui-block="not-found-009"] [data-part="title"]{margin:0.5rem 0 0;font-size:clamp(2.25rem,8cqi,4.25rem);font-weight:800;line-height:0.98;letter-spacing:-0.02em;text-wrap:balance}
[data-vibeui-block="not-found-009"] [data-part="columns"]{display:grid;gap:1.5rem;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-not-found-009-rule)}
[data-vibeui-block="not-found-009"] [data-part="lead"]{margin:0;font-size:1.0625rem;line-height:1.55}
[data-vibeui-block="not-found-009"] [data-part="lead"]::first-letter{float:left;margin:0.06em 0.08em 0 0;font-size:3.4em;font-weight:900;line-height:0.8}
[data-vibeui-block="not-found-009"] [data-part="signs-label"]{margin:0;font-family:var(--vibeui-not-found-009-sans);font-size:0.6875rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="not-found-009"] [data-part="signs"]{margin:0.625rem 0 0;padding:0;list-style:none;font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="not-found-009"] [data-part="sign"]{padding:0.375rem 0;border-bottom:1px dotted color-mix(in oklab,var(--vibeui-not-found-009-rule) 40%,transparent)}
[data-vibeui-block="not-found-009"] [data-part="sign"]::before{content:"— "}
[data-vibeui-block="not-found-009"] [data-part="reward"]{margin:1rem 0 0;font-style:italic;color:var(--vibeui-not-found-009-muted)}
[data-vibeui-block="not-found-009"] [data-part="action"]{
display:inline-flex;margin-top:1rem;padding:0.625rem 1rem;border:2px solid var(--vibeui-not-found-009-rule);color:inherit;
font-family:var(--vibeui-not-found-009-sans);font-size:0.75rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;
transition:background .2s ease,color .2s ease;
}
[data-vibeui-block="not-found-009"] [data-part="action"]:hover{background:var(--vibeui-not-found-009-rule);color:var(--vibeui-not-found-009-bg)}
[data-vibeui-block="not-found-009"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-not-found-009-accent);outline-offset:3px}
[data-vibeui-block="not-found-009"] [data-part="stamp"]{
position:absolute;top:7.5rem;right:1.5rem;padding:0.375rem 0.75rem;border:3px solid var(--vibeui-not-found-009-accent);border-radius:0.375rem;
color:var(--vibeui-not-found-009-accent);font-family:var(--vibeui-not-found-009-sans);font-size:0.875rem;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;
rotate:-12deg;opacity:.85;
}
@container (min-width:44rem){
[data-vibeui-block="not-found-009"] [data-part="layout"]{padding:3rem 2.5rem 3.5rem}
[data-vibeui-block="not-found-009"] [data-part="columns"]{grid-template-columns:1.4fr 1fr;gap:2.5rem}
[data-vibeui-block="not-found-009"] [data-part="aside"]{padding-left:2.5rem;border-left:1px solid var(--vibeui-not-found-009-rule)}
[data-vibeui-block="not-found-009"] [data-part="stamp"]{top:9.5rem;right:2.5rem;font-size:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-009"] *{transition:none!important}}
`

const SIGNS = [
  "Отзывалась на адрес /old-page",
  "Последний раз видели в старой рассылке",
  "Была полезной и хорошо свёрстанной",
]

export function NotFound009({
  masthead = "Вестник 404",
  issue = "Выпуск № 404 · Срочно",
  kicker = "Происшествия",
  title = "Пропала страница. Поиски продолжаются",
  lead = "Вчера вечером страница, которую вы ищете, не вышла на связь. Редакция опросила сервер, проверила ссылки и архив — следов не нашла. Читателей просят не волноваться и продолжить путь с главной.",
  signs = SIGNS,
  signsLabel = "Особые приметы",
  reward = "Нашедшему — вечная благодарность редакции.",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: NotFound009Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-009-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-009-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-009" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-009" className={className} style={palette}>
        <div data-part="layout">
          <p data-part="masthead">{masthead}</p>
          <p data-part="issue">
            <span>{issue}</span>
            <span>404</span>
          </p>
          <p data-part="kicker">{kicker}</p>
          <h1 data-part="title">{title}</h1>
          <span data-part="stamp" aria-hidden="true">
            404
          </span>
          <div data-part="columns">
            <p data-part="lead">{lead}</p>
            <div data-part="aside">
              <p data-part="signs-label">{signsLabel}</p>
              <ul data-part="signs">
                {signs.map((sign) => (
                  <li key={sign} data-part="sign">
                    {sign}
                  </li>
                ))}
              </ul>
              <p data-part="reward">{reward}</p>
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
