import type { CSSProperties, ComponentProps } from "react"

export type About007Fact = {
  value: string
  label: string
}

export type About007Props = {
  eyebrow?: string
  /** Цитата шефа — крупно серифом. */
  quote?: string
  name?: string
  role?: string
  text?: string
  facts?: readonly About007Fact[]
  image?: string
  imageAlt?: string
  /** Второе фото: руки на подаче, кухня. Пусто — только портрет. */
  imageSecondary?: string
  /** Подпись-росчерк под цитатой. Пусто — имя. */
  signature?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шеф: портрет во всю высоту колонки со вторым фото внахлёст, справа
// цитата серифом крупно, подпись рукописным росчерком, абзац и три факта.
// Серверный, без состояния; появление — CSS.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&family=Caveat:wght@500&display=swap"

const STYLES = `
:where([data-vibeui-block="about-007"]){
--vibeui-about-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-007-muted:light-dark(color-mix(in oklab,var(--vibeui-about-007-fg) 60%,var(--vibeui-about-007-bg)),color-mix(in oklab,var(--vibeui-about-007-fg) 58%,var(--vibeui-about-007-bg)));
--vibeui-about-007-line:color-mix(in oklab,var(--vibeui-about-007-fg) 14%,var(--vibeui-about-007-bg));
--vibeui-about-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-007-glow:0 0 24px color-mix(in oklab,var(--vibeui-about-007-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-about-007-accent) 35%,transparent);
--vibeui-about-007-accent-ink:light-dark(var(--vibeui-about-007-accent),color-mix(in oklab,var(--vibeui-about-007-accent) 55%,var(--vibeui-about-007-fg)));
--vibeui-about-007-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-about-007-hand:"Caveat","Segoe Print",cursive;
--vibeui-about-007-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-007"]{color-scheme:dark}
:where([data-vibeui-block="about-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-007"]{box-sizing:border-box;display:block;background:var(--vibeui-about-007-bg);color:var(--vibeui-about-007-fg);font-family:var(--vibeui-about-007-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="about-007"] *{box-sizing:border-box}
[data-vibeui-block="about-007"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="about-007"] [data-part="media"]{position:relative;padding-bottom:3.5rem;padding-right:2.5rem}
[data-vibeui-block="about-007"] [data-part="portrait"]{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center top;border-radius:1rem;background:light-dark(#e7dfd2,#231d1a)}
[data-vibeui-block="about-007"] [data-part="secondary"]{position:absolute;right:0;bottom:0;width:48%;aspect-ratio:3/2;object-fit:cover;border-radius:.75rem;border:6px solid var(--vibeui-about-007-bg);box-shadow:0 30px 50px -30px rgb(0 0 0 / .6)}
[data-vibeui-block="about-007"] [data-part="eyebrow"]{margin:0 0 1rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-about-007-accent-ink);font-weight:600}
[data-vibeui-block="about-007"] [data-part="quote"]{margin:0;font-family:var(--vibeui-about-007-display);font-weight:400;font-style:italic;font-size:clamp(1.6rem,3.4cqi,2.5rem);line-height:1.2;letter-spacing:-.01em;text-wrap:balance}
[data-vibeui-block="about-007"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="about-007"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="about-007"] [data-part="signature"]{display:block;margin:1.25rem 0 0;font-family:var(--vibeui-about-007-hand);font-size:2rem;line-height:1;color:var(--vibeui-about-007-accent-ink);text-shadow:0 0 18px rgb(125 42 58 / .5);transform:rotate(-3deg);transform-origin:left}
[data-vibeui-block="about-007"] [data-part="who"]{margin:.5rem 0 0;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-about-007-muted)}
[data-vibeui-block="about-007"] [data-part="text"]{margin:1.5rem 0 0;max-width:34rem;color:var(--vibeui-about-007-muted)}
[data-vibeui-block="about-007"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.5rem 2.5rem;margin:2rem 0 0;padding:1.5rem 0 0;list-style:none;border-top:1px solid var(--vibeui-about-007-line)}
@container (min-width: 56rem){
[data-vibeui-block="about-007"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:5rem;padding:6rem 2rem;align-items:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-007"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="about-007"] [data-part="fact"] b{display:block;font-family:var(--vibeui-about-007-display);font-size:2rem;font-weight:400;line-height:1;color:var(--vibeui-about-007-accent-ink)}
[data-vibeui-block="about-007"] [data-part="fact"] span{display:block;margin-top:.3rem;font-size:.78rem;color:var(--vibeui-about-007-muted)}
`

type FactProps = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  value?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Fact({
  label = "лет на кухне",
  value = "18",
  accent,
  className,
  style,
  ...props
}: FactProps) {
  const palette = {
    ...(accent ? { "--vibeui-about-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <li
        {...props}
        className={className}
        style={palette}
      >
        <b>{value}</b>
        <span>{label}</span>
      </li>
  )
}

/** Шеф: портрет со вторым фото внахлёст, цитата серифом, росчерк и факты. */
export function About007({
  eyebrow = "Шеф",
  quote = "Я выросла на Ладоге. Всё, что мы готовим, — это попытка вернуть тот вкус: дым, лес и холодная вода.",
  name = "Анна Рябова",
  role = "Шеф-повар и совладелица",
  text = "Десять лет в Копенгагене и Хельсинки, потом — домой. Меню меняется четыре раза в год, рыба приходит с озера по вторникам и пятницам, хлеб печём на закваске, которой семь лет.",
  facts = [
    { value: "18", label: "лет на кухне" },
    { value: "4", label: "сезонных меню в год" },
    { value: "2", label: "звезды гида «Где»" },
  ],
  image = "",
  imageAlt = "",
  imageSecondary = "",
  signature,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About007Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-007-accent": accent } : null),
    ...(ink ? { "--vibeui-about-007-fg": ink } : null),
    ...(background ? { "--vibeui-about-007-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="media">
            {image ? <img data-part="portrait" src={image} alt={imageAlt || name} loading="lazy" /> : <span data-part="portrait" />}
            {imageSecondary ? <img data-part="secondary" src={imageSecondary} alt="" loading="lazy" /> : null}
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <blockquote data-part="quote">{quote}</blockquote>
            <span data-part="signature" aria-hidden="true">
              {signature ?? name}
            </span>
            <p data-part="who">
              {name} · {role}
            </p>
            {text ? <p data-part="text">{text}</p> : null}
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <Fact key={fact.label} data-part="fact" label={fact.label} value={fact.value} accent={accent} />
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
