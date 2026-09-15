import type { CSSProperties } from "react"

export type Hero020Stat = {
  value: string
  label: string
}

export type Hero020Props = {
  /** Фото на весь экран. */
  image?: string
  imageAlt?: string
  eyebrow?: string
  title?: string
  lede?: string
  /** Режимы поиска: первый выбран. */
  modes?: readonly string[]
  types?: readonly string[]
  districts?: readonly string[]
  budgets?: readonly string[]
  submitLabel?: string
  /** Куда уходит форма поиска (GET). */
  action?: string
  stats?: readonly Hero020Stat[]
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран агентства: фото медленно наезжает (Ken Burns на CSS),
// поверх — серифный заголовок и форма поиска в карточке: режим, тип,
// район, бюджет. Настоящая <form method="get">: параметры уходят на
// страницу выдачи. Внизу три цифры доверия.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-020"]){
--vibeui-hero-020-bg:light-dark(#f3ede3,#14211b);
--vibeui-hero-020-fg:light-dark(#173b2e,#eef0ea);
--vibeui-hero-020-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-hero-020-card:light-dark(#fffdf9,#1b2c24);
--vibeui-hero-020-line:light-dark(color-mix(in oklab,#173b2e 14%,#f3ede3),color-mix(in oklab,#eef0ea 14%,#14211b));
--vibeui-hero-020-accent:#b8925a;
--vibeui-hero-020-on-accent:#14211b;
--vibeui-hero-020-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-hero-020-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-020"]{color-scheme:dark}
:where([data-vibeui-block="hero-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-020"]{position:relative;isolation:isolate;box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-hero-020-bg);color:#fff;font-family:var(--vibeui-hero-020-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-020"] *{box-sizing:border-box}
[data-vibeui-block="hero-020"] [data-part="picture"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;animation:vibeui-hero-020-drift 24s ease-in-out infinite alternate;transform-origin:60% 40%}
[data-vibeui-block="hero-020"] [data-part="picture"][data-empty]{background:linear-gradient(135deg,#2b4a3c,#14211b)}
@keyframes vibeui-hero-020-drift{from{transform:scale(1.04) translate(0,0)}to{transform:scale(1.12) translate(-1.5%,-1%)}}
/* Затемнение снизу вверх: заголовок читается на любом фото. */
[data-vibeui-block="hero-020"] [data-part="shade"]{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgb(20 33 27 / .25) 0%,rgb(20 33 27 / .35) 45%,rgb(20 33 27 / .78) 100%)}
[data-vibeui-block="hero-020"] [data-part="shell"]{position:relative;max-width:76rem;margin:0 auto;min-height:36rem;padding:6.5rem 1.25rem 2.5rem;display:grid;align-content:end;gap:2rem}
[data-vibeui-block="hero-020"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;color:#e9dcc4;font-weight:600;text-shadow:0 1px 12px rgb(0 0 0 / .35)}
[data-vibeui-block="hero-020"] [data-part="title"]{margin:0;max-width:18ch;font-family:var(--vibeui-hero-020-display);font-weight:500;font-size:clamp(2.5rem,7cqi,5rem);line-height:1;letter-spacing:-.01em;text-wrap:balance;text-shadow:0 2px 24px rgb(0 0 0 / .25)}
[data-vibeui-block="hero-020"] [data-part="lede"]{margin:1rem 0 0;max-width:40rem;font-size:1.1rem;color:rgb(255 255 255 / .82)}
[data-vibeui-block="hero-020"] [data-part="search"]{display:grid;gap:.75rem;padding:1rem;border-radius:1rem;background:var(--vibeui-hero-020-card);color:var(--vibeui-hero-020-fg);box-shadow:0 30px 60px -30px rgb(0 0 0 / .5)}
[data-vibeui-block="hero-020"] [data-part="modes"]{display:flex;gap:.25rem;padding:.25rem;width:fit-content;border-radius:999px;background:var(--vibeui-hero-020-line)}
[data-vibeui-block="hero-020"] [data-part="mode"]{position:relative;cursor:pointer}
[data-vibeui-block="hero-020"] [data-part="mode"] input{position:absolute;inset:0;opacity:0;margin:0;cursor:inherit}
[data-vibeui-block="hero-020"] [data-part="mode"] span{display:inline-block;padding:.45rem 1rem;border-radius:999px;font-size:.875rem;font-weight:600;color:var(--vibeui-hero-020-muted);transition:background .2s,color .2s}
[data-vibeui-block="hero-020"] [data-part="mode"] input:checked + span{background:var(--vibeui-hero-020-card);color:var(--vibeui-hero-020-fg);box-shadow:0 1px 3px rgb(0 0 0 / .12)}
[data-vibeui-block="hero-020"] [data-part="mode"] input:focus-visible + span{outline:2px solid var(--vibeui-hero-020-accent);outline-offset:2px}
[data-vibeui-block="hero-020"] [data-part="fields"]{display:grid;gap:.75rem}
[data-vibeui-block="hero-020"] [data-part="field"]{display:grid;gap:.3rem}
[data-vibeui-block="hero-020"] [data-part="field"] span{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-hero-020-muted);font-weight:600}
[data-vibeui-block="hero-020"] select{appearance:none;width:100%;height:3rem;padding:0 2.25rem 0 .9rem;border:1px solid var(--vibeui-hero-020-line);border-radius:.6rem;background:transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23888' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right .9rem center;font:inherit;font-size:.95rem;color:inherit;cursor:pointer}
[data-vibeui-block="hero-020"] select:focus-visible{outline:2px solid var(--vibeui-hero-020-accent);outline-offset:2px}
[data-vibeui-block="hero-020"] [data-part="submit"]{height:3rem;padding:0 1.5rem;border:0;border-radius:.6rem;background:var(--vibeui-hero-020-accent);color:var(--vibeui-hero-020-on-accent);font:inherit;font-weight:700;cursor:pointer;transition:transform .2s,filter .2s;align-self:end}
[data-vibeui-block="hero-020"] [data-part="submit"]:hover{transform:translateY(-1px);filter:brightness(1.05)}
[data-vibeui-block="hero-020"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-hero-020-fg);outline-offset:2px}
[data-vibeui-block="hero-020"] [data-part="stats"]{display:flex;flex-wrap:wrap;gap:1.25rem 2.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-020"] [data-part="stat"] b{display:block;font-family:var(--vibeui-hero-020-display);font-size:2rem;font-weight:600;line-height:1}
[data-vibeui-block="hero-020"] [data-part="stat"] span{font-size:.8rem;color:rgb(255 255 255 / .72)}
@container (min-width: 52rem){
[data-vibeui-block="hero-020"] [data-part="shell"]{min-height:44rem;padding:8rem 2rem 3rem}
[data-vibeui-block="hero-020"] [data-part="search"]{padding:1.25rem}
[data-vibeui-block="hero-020"] [data-part="fields"]{grid-template-columns:repeat(3,minmax(0,1fr)) auto;align-items:end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-020"] [data-part="picture"]{animation:none}[data-vibeui-block="hero-020"] *{transition:none!important}}`

/** Первый экран агентства: фото с медленным наездом и форма поиска объектов. */
export function Hero020({
  image = "",
  imageAlt = "",
  eyebrow = "Агентство недвижимости · с 2007 года",
  title = "Квартира, в которую хочется вернуться",
  lede = "Подбираем жильё в Петербурге под ваш бюджет и ритм жизни: от студии у метро до дома с садом. Сопровождаем сделку от первого показа до ключей.",
  modes = ["Купить", "Снять"],
  types = ["Квартира", "Дом", "Новостройка", "Коммерческая"],
  districts = ["Любой район", "Центральный", "Петроградская", "Васильевский", "Приморский", "Московский"],
  budgets = ["Любой бюджет", "до 8 млн", "8–15 млн", "15–30 млн", "от 30 млн"],
  submitLabel = "Найти",
  action = "#objects",
  stats = [
    { value: "1 240", label: "объектов в базе" },
    { value: "18 лет", label: "на рынке" },
    { value: "3 офиса", label: "в городе" },
  ],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero020Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-020-accent": accent } : null),
    ...(background ? { "--vibeui-hero-020-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-020" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {image ? <img data-part="picture" src={image} alt={imageAlt} /> : <span data-part="picture" data-empty="" aria-hidden="true" />}
        <span data-part="shade" aria-hidden="true" />
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">{title}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <form data-part="search" method="get" action={action}>
            <div data-part="modes" role="radiogroup" aria-label="Что нужно">
              {modes.map((mode, index) => (
                <label key={mode} data-part="mode">
                  <input type="radio" name="mode" value={mode} defaultChecked={index === 0} />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
            <div data-part="fields">
              <label data-part="field">
                <span>Тип</span>
                <select name="type">
                  {types.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label data-part="field">
                <span>Район</span>
                <select name="district">
                  {districts.map((district) => (
                    <option key={district}>{district}</option>
                  ))}
                </select>
              </label>
              <label data-part="field">
                <span>Бюджет</span>
                <select name="budget">
                  {budgets.map((budget) => (
                    <option key={budget}>{budget}</option>
                  ))}
                </select>
              </label>
              <button type="submit" data-part="submit">
                {submitLabel}
              </button>
            </div>
          </form>
          {stats.length > 0 ? (
            <ul data-part="stats">
              {stats.map((stat) => (
                <li key={stat.label} data-part="stat">
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
