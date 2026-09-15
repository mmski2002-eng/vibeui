import type { CSSProperties } from "react"

export type Hero022Fact = {
  value: string
  label: string
}

export type Hero022Props = {
  /** Строка над заголовком: «онлайн-курс · старт 6 октября». */
  eyebrow?: string
  /** Заголовок; слово в *звёздочках* подчёркивается маркером. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  /** Кнопка «смотреть урок» рядом с превью видео. */
  secondaryLabel?: string
  secondaryHref?: string
  /** Кадр урока справа. */
  poster?: string
  posterAlt?: string
  /** Длительность на превью: «4:32». */
  duration?: string
  /** Стикер: «12 мест», «старт 6 октября». */
  sticker?: string
  facts?: readonly Hero022Fact[]
  /** Подпись к логотипам: «выпускники работают в». */
  logosLabel?: string
  logos?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран лендинга курса: заголовок с маркерным подчёркиванием,
// которое дорисовывается при появлении, стикер с местами, кнопка и превью
// урока с кнопкой play. Внизу строка фактов и логотипы компаний текстом.
// Серверный: анимации — CSS с задержками.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-022"]){
--vibeui-hero-022-bg:light-dark(#ffffff,#0f1117);
--vibeui-hero-022-fg:light-dark(#111827,#f3f4f6);
--vibeui-hero-022-muted:light-dark(#6b7280,#9ca3af);
--vibeui-hero-022-card:light-dark(#f8fafc,#161a23);
--vibeui-hero-022-line:light-dark(#e5e7eb,#262b36);
--vibeui-hero-022-accent:#4f46e5;
--vibeui-hero-022-on-accent:#ffffff;
--vibeui-hero-022-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-hero-022-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-022-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-022"]{color-scheme:dark}
:where([data-vibeui-block="hero-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-022"]{box-sizing:border-box;display:block;position:relative;overflow:hidden;background:var(--vibeui-hero-022-bg);color:var(--vibeui-hero-022-fg);font-family:var(--vibeui-hero-022-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="hero-022"] *{box-sizing:border-box}
[data-vibeui-block="hero-022"]::before{content:"";position:absolute;inset:-20% -10% auto auto;width:50cqi;aspect-ratio:1;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-hero-022-accent) 22%,transparent),transparent);pointer-events:none}
[data-vibeui-block="hero-022"] [data-part="shell"]{position:relative;max-width:76rem;margin:0 auto;padding:3.5rem 1.25rem 3rem;display:grid;gap:2.5rem}
[data-vibeui-block="hero-022"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;margin:0 0 1.25rem;padding:.35rem .8rem .35rem .5rem;border-radius:999px;border:1px solid var(--vibeui-hero-022-line);background:var(--vibeui-hero-022-card);font-size:.78rem;font-weight:600;animation:vibeui-hero-022-fade .7s .1s both}
[data-vibeui-block="hero-022"] [data-part="eyebrow"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgb(34 197 94 / .2)}
[data-vibeui-block="hero-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-022-display);font-weight:700;font-size:clamp(1.9rem,4.4cqi,3.4rem);line-height:1.08;letter-spacing:-.02em;text-wrap:balance;animation:vibeui-hero-022-fade .8s .2s both}
[data-vibeui-block="hero-022"] [data-part="mark"]{position:relative;display:inline;z-index:0;box-decoration-break:clone;-webkit-box-decoration-break:clone}
[data-vibeui-block="hero-022"] [data-part="mark"]{background:linear-gradient(var(--vibeui-hero-022-marker),var(--vibeui-hero-022-marker)) no-repeat left 88% / 0% .42em;padding:0 .08em;animation:vibeui-hero-022-draw .7s .9s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes vibeui-hero-022-draw{to{background-size:100% .42em}}
@keyframes vibeui-hero-022-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
[data-vibeui-block="hero-022"] [data-part="lede"]{margin:1.25rem 0 0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-hero-022-muted);animation:vibeui-hero-022-fade .8s .35s both}
[data-vibeui-block="hero-022"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.25rem;margin-top:1.75rem;animation:vibeui-hero-022-fade .8s .5s both}
[data-vibeui-block="hero-022"] [data-part="primary"]{display:inline-flex;align-items:center;height:3.25rem;padding:0 1.6rem;border-radius:999px;background:var(--vibeui-hero-022-accent);color:var(--vibeui-hero-022-on-accent);font-weight:600;text-decoration:none;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="hero-022"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 16px 32px -14px var(--vibeui-hero-022-accent)}
[data-vibeui-block="hero-022"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;color:inherit;font-weight:600;text-decoration:none}
[data-vibeui-block="hero-022"] [data-part="secondary"]::before{content:"";width:2.25rem;height:2.25rem;border-radius:50%;border:1px solid var(--vibeui-hero-022-line);background:var(--vibeui-hero-022-card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 6.5v11l9-5.5z' fill='%234f46e5'/%3E%3C/svg%3E") center/1.1rem no-repeat}
[data-vibeui-block="hero-022"] a:focus-visible{outline:2px solid var(--vibeui-hero-022-accent);outline-offset:3px}
[data-vibeui-block="hero-022"] [data-part="media"]{position:relative;animation:vibeui-hero-022-fade .9s .4s both}
[data-vibeui-block="hero-022"] [data-part="frame"]{position:relative;display:block;aspect-ratio:16/10;overflow:hidden;border-radius:1.25rem;border:1px solid var(--vibeui-hero-022-line);background:var(--vibeui-hero-022-card);box-shadow:0 40px 60px -40px rgb(17 24 39 / .45)}
[data-vibeui-block="hero-022"] [data-part="frame"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-022"] [data-part="frame"]:hover img{transform:scale(1.03)}
[data-vibeui-block="hero-022"] [data-part="play"]{position:absolute;left:50%;top:50%;width:4rem;height:4rem;margin:-2rem 0 0 -2rem;border-radius:50%;background:var(--vibeui-hero-022-on-accent);box-shadow:0 12px 30px -10px rgb(0 0 0 / .5);display:grid;place-items:center;transition:transform .3s}
[data-vibeui-block="hero-022"] [data-part="play"]::after{content:"";margin-left:.25rem;border-style:solid;border-width:.6rem 0 .6rem 1rem;border-color:transparent transparent transparent var(--vibeui-hero-022-accent)}
[data-vibeui-block="hero-022"] [data-part="frame"]:hover [data-part="play"]{transform:scale(1.08)}
[data-vibeui-block="hero-022"] [data-part="duration"]{position:absolute;right:.9rem;bottom:.9rem;padding:.25rem .55rem;border-radius:.4rem;background:rgb(17 24 39 / .75);color:#fff;font-size:.72rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-022"] [data-part="sticker"]{position:absolute;z-index:2;top:-.9rem;left:-.75rem;padding:.55rem .9rem;border-radius:.75rem;background:var(--vibeui-hero-022-marker);color:#1a2e05;font-family:var(--vibeui-hero-022-display);font-size:.8rem;font-weight:600;transform:rotate(-4deg);box-shadow:0 10px 20px -12px rgb(0 0 0 / .4);animation:vibeui-hero-022-pop .6s 1s cubic-bezier(.2,1.4,.4,1) both}
@keyframes vibeui-hero-022-pop{from{opacity:0;transform:rotate(-4deg) scale(.6)}to{opacity:1;transform:rotate(-4deg) scale(1)}}
[data-vibeui-block="hero-022"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.25rem 2.5rem;margin:0;padding:1.75rem 0 0;list-style:none;border-top:1px solid var(--vibeui-hero-022-line);animation:vibeui-hero-022-fade .8s .7s both}
[data-vibeui-block="hero-022"] [data-part="fact"] b{display:block;font-family:var(--vibeui-hero-022-display);font-size:1.6rem;font-weight:700;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="hero-022"] [data-part="fact"] span{display:block;margin-top:.3rem;font-size:.8rem;color:var(--vibeui-hero-022-muted)}
[data-vibeui-block="hero-022"] [data-part="logos"]{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.75rem;margin-left:auto}
[data-vibeui-block="hero-022"] [data-part="logos-label"]{font-size:.75rem;color:var(--vibeui-hero-022-muted)}
[data-vibeui-block="hero-022"] [data-part="logo"]{font-family:var(--vibeui-hero-022-display);font-size:.95rem;font-weight:600;letter-spacing:-.01em;opacity:.55}
@container (min-width: 60rem){
[data-vibeui-block="hero-022"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);grid-template-areas:"copy media" "facts facts";gap:3rem 4rem;padding:5rem 2rem 3.5rem;align-items:center}
[data-vibeui-block="hero-022"] [data-part="copy"]{grid-area:copy}
[data-vibeui-block="hero-022"] [data-part="media"]{grid-area:media}
[data-vibeui-block="hero-022"] [data-part="facts"]{grid-area:facts}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-022"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-022"] [data-part="mark"]{background-size:100% .42em}}`

function markup(text: string) {
  return text.split(/(\*[^*]+\*)/).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={index} data-part="mark">
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}

/** Первый экран лендинга курса: маркерный заголовок, стикер, превью урока, факты и логотипы. */
export function Hero022({
  eyebrow = "Онлайн-курс · старт 6 октября",
  title = "Figma для продуктовых дизайнеров: от макета до *живого прототипа*",
  lede = "Шесть недель практики на реальных задачах: соберёте три интерфейса, защитите проект перед арт-директором и выйдете с портфолио, которое смотрят.",
  primaryLabel = "Записаться на поток",
  primaryHref = "#pricing",
  secondaryLabel = "Смотреть первый урок",
  secondaryHref = "#",
  poster = "",
  posterAlt = "",
  duration = "4:32",
  sticker = "Осталось 12 мест",
  facts = [
    { value: "6", label: "недель" },
    { value: "18", label: "уроков по 40 минут" },
    { value: "3", label: "проекта в портфолио" },
    { value: "94 %", label: "доходят до защиты" },
  ],
  logosLabel = "Выпускники работают в",
  logos = ["Ozon", "Тинькофф", "Яндекс", "Авито", "Самокат"],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero022Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-022-accent": accent } : null),
    ...(background ? { "--vibeui-hero-022-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-022" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">{markup(title)}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
          <div data-part="media">
            {sticker ? <span data-part="sticker">{sticker}</span> : null}
            <a data-part="frame" href={secondaryHref} aria-label={secondaryLabel || "Смотреть урок"}>
              {poster ? <img src={poster} alt={posterAlt} /> : null}
              <span data-part="play" aria-hidden="true" />
              {duration ? <span data-part="duration">{duration}</span> : null}
            </a>
          </div>
          {facts.length > 0 || logos.length > 0 ? (
            <ul data-part="facts">
              {facts.map((fact) => (
                <li key={fact.label} data-part="fact">
                  <b>{fact.value}</b>
                  <span>{fact.label}</span>
                </li>
              ))}
              {logos.length > 0 ? (
                <li data-part="logos">
                  {logosLabel ? <span data-part="logos-label">{logosLabel}</span> : null}
                  {logos.map((logo) => (
                    <span key={logo} data-part="logo">
                      {logo}
                    </span>
                  ))}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
