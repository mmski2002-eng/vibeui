import type { CSSProperties } from "react"

export type Restaurant011Props = {
  /** Капитель слева: «Вино недели». */
  label?: string
  /** Что предлагаем: «Riesling Kabinett, Мозель». */
  title?: string
  text?: string
  price?: string
  actionLabel?: string
  actionHref?: string
  /** Маленькое фото бутылки или блюда слева. */
  image?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Плашка спецпредложения между секциями: брусничная полоса с бликом, который
// медленно проходит по ней, слева капитель и фото, по центру название и
// описание, справа цена серифом и ссылка. Серверный, без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="restaurant-011"]){
--vibeui-restaurant-011-bg:light-dark(#f6f1ea,#141110);
--vibeui-restaurant-011-accent:#7d2a3a;
--vibeui-restaurant-011-glow:0 0 24px rgb(125 42 58 / .7),0 0 70px rgb(125 42 58 / .35);
--vibeui-restaurant-011-accent-ink:light-dark(var(--vibeui-restaurant-011-accent),color-mix(in oklab,var(--vibeui-restaurant-011-accent) 55%,#f2ebe0));
--vibeui-restaurant-011-on-accent:#fff4ee;
--vibeui-restaurant-011-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-restaurant-011-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="restaurant-011"]{color-scheme:dark}
:where([data-vibeui-block="restaurant-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="restaurant-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="restaurant-011"]{box-sizing:border-box;display:block;background:var(--vibeui-restaurant-011-bg);font-family:var(--vibeui-restaurant-011-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="restaurant-011"] *{box-sizing:border-box}
[data-vibeui-block="restaurant-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="restaurant-011"] [data-part="band"]{position:relative;overflow:hidden;display:grid;gap:1rem;align-items:center;padding:1.25rem 1.5rem;border-radius:1rem;background:linear-gradient(100deg,color-mix(in oklab,var(--vibeui-restaurant-011-accent) 88%,#141110),var(--vibeui-restaurant-011-accent));color:var(--vibeui-restaurant-011-on-accent);box-shadow:var(--vibeui-restaurant-011-glow)}
[data-vibeui-block="restaurant-011"] [data-part="band"]::after{content:"";position:absolute;top:-50%;bottom:-50%;left:-20%;width:18%;background:linear-gradient(100deg,transparent,rgb(255 255 255 / .35),transparent);transform:skewX(-20deg);animation:vibeui-restaurant-011-shine 7s ease-in-out infinite}
@keyframes vibeui-restaurant-011-shine{0%,60%{left:-20%}100%{left:120%}}
[data-vibeui-block="restaurant-011"] [data-part="lead"]{display:flex;align-items:center;gap:1rem}
[data-vibeui-block="restaurant-011"] [data-part="photo"]{width:3.5rem;height:3.5rem;border-radius:.6rem;object-fit:cover;flex:none;box-shadow:0 8px 16px -8px rgb(0 0 0 / .5)}
[data-vibeui-block="restaurant-011"] [data-part="label"]{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;font-weight:700;opacity:.8;white-space:nowrap}
[data-vibeui-block="restaurant-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-restaurant-011-display);font-size:1.4rem;font-weight:500;line-height:1.15}
[data-vibeui-block="restaurant-011"] [data-part="text"]{margin:.2rem 0 0;font-size:.85rem;opacity:.85}
[data-vibeui-block="restaurant-011"] [data-part="tail"]{display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap}
[data-vibeui-block="restaurant-011"] [data-part="price"]{font-family:var(--vibeui-restaurant-011-display);font-size:1.75rem;line-height:1;white-space:nowrap}
[data-vibeui-block="restaurant-011"] [data-part="action"]{display:inline-flex;align-items:center;height:2.6rem;padding:0 1.1rem;border-radius:999px;background:#141110;color:#f2ebe0;text-decoration:none;font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transition:transform .2s}
[data-vibeui-block="restaurant-011"] [data-part="action"]:hover{transform:translateY(-1px)}
[data-vibeui-block="restaurant-011"] [data-part="action"]:focus-visible{outline:2px solid #f2ebe0;outline-offset:2px}
@container (min-width: 52rem){
[data-vibeui-block="restaurant-011"] [data-part="shell"]{padding:0 2rem}
[data-vibeui-block="restaurant-011"] [data-part="band"]{grid-template-columns:auto minmax(0,1fr) auto;gap:2rem;padding:1.25rem 2rem}
[data-vibeui-block="restaurant-011"] [data-part="tail"]{justify-content:flex-end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="restaurant-011"] *{animation:none!important;transition:none!important}}`

/** Плашка спецпредложения: брусничная полоса с бликом, цена и ссылка. */
export function Restaurant011({
  label = "Вино недели",
  title = "Riesling Kabinett, Мозель, 2022",
  text = "Сухой, минеральный, с яблоком и лаймом. К сигу и устрицам — идеально.",
  price = "650 ₽ / бокал",
  actionLabel = "Смотреть бар",
  actionHref = "#menu",
  image = "",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Restaurant011Props) {
  const palette = {
    ...(accent ? { "--vibeui-restaurant-011-accent": accent } : null),
    ...(background ? { "--vibeui-restaurant-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-restaurant-011" precedence="medium">
        {STYLES}
      </style>
      <aside data-vibeui-block="restaurant-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} aria-label={label}>
        <div data-part="shell">
          <div data-part="band">
            <div data-part="lead">
              {image ? <img data-part="photo" src={image} alt="" loading="lazy" /> : null}
              <span data-part="label">{label}</span>
            </div>
            <div>
              <p data-part="title">{title}</p>
              {text ? <p data-part="text">{text}</p> : null}
            </div>
            <div data-part="tail">
              {price ? <span data-part="price">{price}</span> : null}
              {actionLabel ? (
                <a data-part="action" href={actionHref}>
                  {actionLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
