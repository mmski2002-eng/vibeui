import type { CSSProperties } from "react"

export type Hero010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  bullets?: string[]
  imageCaption?: string
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: половина на половину, без полей. Правая часть — не карточка и не
// окно, а изображение во всю высоту секции, прижатое к её краю: композиция
// собрана градиентами и clip-path, поэтому картинки в поставке нет, но место
// под неё размечено — достаточно положить <img> в тот же слот. Текст слева
// прижат к внутреннему краю, а не отцентрован: взгляд идёт по вертикали.
const STYLES = `
:where([data-vibeui-block="hero-010"]){
--vibeui-hero-010-bg:transparent;
--vibeui-hero-010-fg:light-dark(oklch(0.2 0 240),oklch(0.95 0 240));
--vibeui-hero-010-muted:light-dark(oklch(0.5 0 240),oklch(0.73 0 240));
--vibeui-hero-010-line:light-dark(oklch(0.89 0 240),oklch(0.37 0 240));
--vibeui-hero-010-accent:light-dark(oklch(0.55 0.16 232),oklch(0.74 0.14 232));
--vibeui-hero-010-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0 232));
--vibeui-hero-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-010"]{color-scheme:dark}
[data-vibeui-block="hero-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;background:var(--vibeui-hero-010-bg);color:var(--vibeui-hero-010-fg);
font-family:var(--vibeui-hero-010-sans);
}
[data-vibeui-block="hero-010"] *{box-sizing:border-box}
[data-vibeui-block="hero-010"] [data-part="shell"]{display:grid;grid-template-columns:1fr;align-items:stretch}
[data-vibeui-block="hero-010"] [data-part="copy"]{padding:3rem 1.25rem;display:flex;flex-direction:column;justify-content:center}
[data-vibeui-block="hero-010"] [data-part="inner"]{max-width:34rem;width:100%}
[data-vibeui-block="hero-010"] [data-part="eyebrow"]{
margin:0 0 1rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-010-accent);
}
[data-vibeui-block="hero-010"] h1{
margin:0;font-size:clamp(1.875rem,5.4cqi,3.125rem);line-height:1.08;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-010"] [data-part="lede"]{
margin:1rem 0 0;font-size:clamp(0.9375rem,1.4cqi,1.0625rem);line-height:1.6;color:var(--vibeui-hero-010-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-010"] ul{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:0.625rem}
[data-vibeui-block="hero-010"] li{display:flex;align-items:flex-start;gap:0.625rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="hero-010"] [data-part="tick"]{
flex:0 0 auto;margin-top:0.125rem;width:1.125rem;height:1.125rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-hero-010-accent) 18%,transparent);color:var(--vibeui-hero-010-accent);
}
[data-vibeui-block="hero-010"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.625rem;margin-top:1.875rem}
[data-vibeui-block="hero-010"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.75rem;padding:0 1.375rem;border-radius:0.5rem;
font-size:0.9375rem;font-weight:600;text-decoration:none;transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="hero-010"] [data-part="primary"]{background:var(--vibeui-hero-010-accent);color:var(--vibeui-hero-010-accent-fg);border:1px solid transparent}
[data-vibeui-block="hero-010"] [data-part="primary"]:hover{background:color-mix(in oklab,var(--vibeui-hero-010-accent) 86%,black)}
[data-vibeui-block="hero-010"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-010-line);color:var(--vibeui-hero-010-fg)}
[data-vibeui-block="hero-010"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-010-fg)}
[data-vibeui-block="hero-010"] a:focus-visible{outline:2px solid var(--vibeui-hero-010-accent);outline-offset:3px}
[data-vibeui-block="hero-010"] figure{
position:relative;margin:0;min-height:16rem;overflow:hidden;
background:
radial-gradient(70% 60% at 20% 20%,color-mix(in oklab,var(--vibeui-hero-010-accent) 70%,white),transparent 70%),
radial-gradient(80% 70% at 85% 90%,oklch(0.82 0.11 195),transparent 72%),
linear-gradient(160deg,oklch(0.72 0.13 250),oklch(0.5 0.16 262));
}
[data-vibeui-block="hero-010"] [data-part="cut"]{
position:absolute;inset:0;background:oklch(1 0 0 / 16%);
clip-path:polygon(0 62%,100% 30%,100% 100%,0 100%);
}
[data-vibeui-block="hero-010"] [data-part="ring"]{
position:absolute;left:50%;top:50%;width:min(60%,18rem);aspect-ratio:1;transform:translate(-50%,-50%);
border-radius:9999px;border:1px solid oklch(1 0 0 / 45%);
}
[data-vibeui-block="hero-010"] [data-part="ring"]::after{
content:"";position:absolute;inset:18%;border-radius:9999px;border:1px solid oklch(1 0 0 / 30%);
}
[data-vibeui-block="hero-010"] figcaption{
position:absolute;left:1rem;bottom:1rem;padding:0.375rem 0.625rem;border-radius:0.375rem;
background:oklch(0 0 0 / 40%);color:oklch(1 0 0);font-size:0.75rem;font-weight:600;
}
@container (min-width: 34rem){
[data-vibeui-block="hero-010"] [data-part="copy"]{padding:4rem 2rem}
[data-vibeui-block="hero-010"] figure{min-height:20rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-010"] [data-part="shell"]{grid-template-columns:1fr 1fr;min-height:34rem}
[data-vibeui-block="hero-010"] [data-part="copy"]{padding:4.5rem clamp(2rem,5cqi,4.5rem);justify-self:end;max-width:44rem}
[data-vibeui-block="hero-010"] figure{min-height:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BULLETS = [
  "Секция ставится одной командой агента",
  "Тексты и цвета — пропсы, вёрстка не трогается",
  "Работает без вашей темы и без Tailwind",
]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Hero пополам: текст в левой половине, изображение во всю высоту в правой. */
export function Hero010({
  eyebrow = "Дизайн-система без дизайнера",
  title = "Половина страницы — картинка, половина — суть",
  lede = "Классическая раскладка, в которой изображение прижато к краю экрана и работает на всю высоту секции.",
  primary = { label: "Взять секцию", href: "#" },
  secondary = { label: "Все раскладки", href: "#" },
  bullets = DEFAULT_BULLETS,
  imageCaption = "Место под ваш кадр",
  accent,
  background = "",
  className,
  style,
}: Hero010Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <div data-part="inner">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h1>{title}</h1>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {bullets.length > 0 ? (
                <ul>
                  {bullets.slice(0, 4).map((bullet) => (
                    <li key={bullet}>
                      <span data-part="tick" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="11" height="11">
                          <path
                            d="M3.5 8.5 6.5 11.5 12.5 4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div data-part="actions">
                <a data-part="primary" href={primary.href}>
                  {primary.label}
                </a>
                <a data-part="secondary" href={secondary.href}>
                  {secondary.label}
                </a>
              </div>
            </div>
          </div>

          <figure>
            <span data-part="cut" aria-hidden="true" />
            <span data-part="ring" aria-hidden="true" />
            <figcaption>{imageCaption}</figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
