"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero038Props = {
  eyebrow?: string
  /** Заголовок; таймер встаёт после него отдельной строкой. */
  title?: string
  /** Сколько минут обещаем — стартовое значение обратного отсчёта. */
  minutes?: number
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  trust?: string
  /** Фото блюда в «капле» рядом с бургером. Пусто — без фото. */
  image?: string
  imageAlt?: string
  /** Второе блюдо в «капле» со стикером. */
  sideImage?: string
  sideImageAlt?: string
  /** Подпись стикера на фото: «хит недели · том-ям 490 ₽». */
  sticker?: string
  /** Бегущая строка блюд. */
  ticker?: readonly string[]
  /** aria таймера. */
  timerLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро дарк-китчена: заголовок с живым обратным отсчётом «привезём за
// 28:00» (тикает по секунде, на нуле начинает заново), справа вырезка блюда
// (PNG без фона) на томатном круге — блюдо выезжает при загрузке и
// медленно покачивается, над ним поднимается пар.
// Рядом второе фото в форме капли со стикером «хит недели». Понизу бегущая
// строка блюд с наклоном, дублируется для бесшовного цикла.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Russo+One&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-038"]){
--vibeui-hero-038-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-038-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-038-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-038-on-accent:oklch(from var(--vibeui-hero-038-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-038-muted:color-mix(in oklab,var(--vibeui-hero-038-fg) 62%,var(--vibeui-hero-038-bg));
--vibeui-hero-038-line:color-mix(in oklab,var(--vibeui-hero-038-fg) 14%,transparent);
--vibeui-hero-038-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-038-accent-font:"Russo One",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-038-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-038"]{color-scheme:dark}
:where([data-vibeui-block="hero-038"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-038"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-038"]{box-sizing:border-box;position:relative;overflow:hidden;padding:3rem 0 0;background:var(--vibeui-hero-038-bg);color:var(--vibeui-hero-038-fg);font-family:var(--vibeui-hero-038-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-038"] *{box-sizing:border-box}
[data-vibeui-block="hero-038"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem 3.5rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-038"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;margin:0 0 1.2rem;padding:.4rem .9rem;border-radius:999px;border:1px solid var(--vibeui-hero-038-line);font-size:.78rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-hero-038-muted)}
[data-vibeui-block="hero-038"] [data-part="eyebrow"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-038-accent);box-shadow:0 0 0 0 var(--vibeui-hero-038-accent);animation:vibeui-hero-038-pulse 1.8s ease-out infinite}
[data-vibeui-block="hero-038"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-038-display);font-weight:900;font-size:clamp(2.2rem,7.2cqi,5.4rem);line-height:.98;letter-spacing:-.035em;text-transform:uppercase}
[data-vibeui-block="hero-038"] [data-part="title"] span{display:block;overflow:hidden}
[data-vibeui-block="hero-038"] [data-part="title"] span i{display:block;font-style:normal;animation:vibeui-hero-038-rise .9s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-038"] [data-part="title"] span:nth-child(2) i{animation-delay:.12s}
[data-vibeui-block="hero-038"] [data-part="timer"]{display:inline-block;font-family:var(--vibeui-hero-038-accent-font);font-weight:400;color:var(--vibeui-hero-038-accent);font-variant-numeric:tabular-nums;letter-spacing:.02em;font-size:1.12em;line-height:1}
[data-vibeui-block="hero-038"] [data-part="timer"] b{font-weight:400;animation:vibeui-hero-038-blink 1s steps(1) infinite}
[data-vibeui-block="hero-038"] [data-part="lede"]{margin:1.4rem 0 0;max-width:30rem;font-size:1.08rem;color:var(--vibeui-hero-038-muted)}
[data-vibeui-block="hero-038"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-038"] [data-part="trust"]{margin:1.4rem 0 0;font-size:.88rem;color:var(--vibeui-hero-038-muted)}
[data-vibeui-block="hero-038"] [data-part="trust"] b{color:var(--vibeui-hero-038-accent);font-weight:700}
[data-vibeui-block="hero-038"] [data-part="scene"]{position:relative;width:min(100%,26rem);aspect-ratio:1;margin:0 auto;container-type:inline-size}
[data-vibeui-block="hero-038"] [data-part="disc"]{position:absolute;inset:6% 6% 6% 6%;border-radius:50%;background:var(--vibeui-hero-038-accent);animation:vibeui-hero-038-disc 1s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-038"] [data-part="disc"]::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px dashed color-mix(in oklab,var(--vibeui-hero-038-on-accent) 45%,transparent);transform:scale(1.08);animation:vibeui-hero-038-spin 40s linear infinite}
[data-vibeui-block="hero-038"] [data-part="steam"]{position:absolute;left:50%;top:9%;width:26cqi;height:14cqi;transform:translateX(-50%);pointer-events:none}
[data-vibeui-block="hero-038"] [data-part="steam"] i{position:absolute;bottom:0;width:2.2cqi;height:100%;border-radius:999px;background:linear-gradient(to top,color-mix(in oklab,var(--vibeui-hero-038-on-accent) 55%,transparent),transparent);opacity:0;animation:vibeui-hero-038-steam 2.6s ease-out infinite}
[data-vibeui-block="hero-038"] [data-part="steam"] i:nth-child(1){left:20%}
[data-vibeui-block="hero-038"] [data-part="steam"] i:nth-child(2){left:48%;animation-delay:.8s}
[data-vibeui-block="hero-038"] [data-part="steam"] i:nth-child(3){left:74%;animation-delay:1.6s}
[data-vibeui-block="hero-038"] [data-part="photo"]{position:absolute;left:-6%;bottom:0;width:38%;aspect-ratio:1;z-index:8;animation:vibeui-hero-038-pop 1s cubic-bezier(.2,.8,.2,1) 1.2s both}
[data-vibeui-block="hero-038"] [data-part="photo"] img{display:block;width:100%;height:100%;object-fit:cover;border-radius:62% 38% 55% 45% / 48% 60% 40% 52%;border:4px solid var(--vibeui-hero-038-bg);box-shadow:0 24px 50px -20px rgb(0 0 0 / .6);animation:vibeui-hero-038-morph 9s ease-in-out infinite alternate}
[data-vibeui-block="hero-038"] [data-part="sticker"]{position:absolute;right:-8%;bottom:-4%;padding:.45rem .8rem;border-radius:.6rem;background:var(--vibeui-hero-038-fg);color:var(--vibeui-hero-038-bg);font-family:var(--vibeui-hero-038-accent-font);font-size:.72rem;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;transform:rotate(-6deg);box-shadow:0 10px 24px -12px rgb(0 0 0 / .5)}
[data-vibeui-block="hero-038"] [data-part="ticker"]{position:relative;left:-3%;width:106%;margin-top:-1rem;padding:.7rem 0;background:var(--vibeui-hero-038-accent);color:var(--vibeui-hero-038-on-accent);transform:rotate(-2deg);overflow:hidden;white-space:nowrap;font-family:var(--vibeui-hero-038-accent-font);font-size:clamp(1rem,2.4cqi,1.5rem);text-transform:uppercase;letter-spacing:.04em}
[data-vibeui-block="hero-038"] [data-part="track"]{display:inline-flex;gap:0;animation:vibeui-hero-038-marquee 28s linear infinite}
[data-vibeui-block="hero-038"] [data-part="ticker"]:hover [data-part="track"]{animation-play-state:paused}
[data-vibeui-block="hero-038"] [data-part="track"] span{display:inline-flex;align-items:center;gap:1.4rem;padding-right:1.4rem}
[data-vibeui-block="hero-038"] [data-part="track"] span::after{content:"";width:.55em;height:.55em;border-radius:50%;background:var(--vibeui-hero-038-on-accent);opacity:.7}
[data-vibeui-block="hero-038"] [data-part="dish"]{position:absolute;left:50%;top:50%;width:92%;aspect-ratio:1;transform:translate(-50%,-50%);z-index:3;filter:drop-shadow(0 40px 40px rgb(0 0 0 / .55));animation:vibeui-hero-038-serve 1.1s cubic-bezier(.2,.8,.2,1) .25s both}
[data-vibeui-block="hero-038"] [data-part="dish"] img{display:block;width:100%;height:100%;object-fit:contain;animation:vibeui-hero-038-simmer 7s ease-in-out infinite}
[data-vibeui-block="hero-038"] [data-vibeui-block="hero-038"] [data-part="steam"]{z-index:4}
@keyframes vibeui-hero-038-serve{from{transform:translate(-50%,-30%) scale(.7) rotate(-14deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(0);opacity:1}}
@keyframes vibeui-hero-038-simmer{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3%) rotate(1.5deg)}}
@keyframes vibeui-hero-038-rise{from{transform:translateY(110%)}to{transform:translateY(0)}}
@keyframes vibeui-hero-038-blink{50%{opacity:.2}}
@keyframes vibeui-hero-038-pulse{to{box-shadow:0 0 0 .55rem transparent}}
@keyframes vibeui-hero-038-disc{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes vibeui-hero-038-spin{to{transform:scale(1.08) rotate(360deg)}}
@keyframes vibeui-hero-038-steam{0%{transform:translateY(40%) scaleX(1);opacity:0}30%{opacity:.7}100%{transform:translateY(-70%) scaleX(1.6);opacity:0}}
@keyframes vibeui-hero-038-pop{from{transform:scale(.4) rotate(-20deg);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-hero-038-morph{to{border-radius:45% 55% 40% 60% / 55% 45% 55% 45%}}
@keyframes vibeui-hero-038-marquee{to{transform:translateX(-50%)}}
@container (min-width: 60rem){[data-vibeui-block="hero-038"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:3rem;padding-bottom:4.5rem}[data-vibeui-block="hero-038"] [data-part="scene"]{width:min(100%,34rem);margin:0 0 0 auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-038"] *{animation:none!important;transition:none!important}}`

const pad = (value: number) => String(value).padStart(2, "0")

/** Хиро доставки с живым таймером, CSS-бургером и бегущей строкой. */
export function Hero038({
  eyebrow = "Дарк-китчен · в пределах ТТК",
  title = "Горячее привезём за",
  minutes = 28,
  lede = "Своя кухня, свои курьеры, ноль посредников. Готовим после оплаты, везём в термосумке — бургер приезжает хрустящим, том-ям — обжигающим.",
  primaryLabel = "Открыть меню",
  primaryHref = "#menu",
  secondaryLabel = "Собрать боул",
  secondaryHref = "#builder",
  trust = "4,8 из 5 · 12 400 заказов в месяц · бесплатно от 1 500 ₽",
  image = "/demo/delivery/burger-cut.png",
  imageAlt = "Двойной смэш-бургер в разрезе на сланцевой подставке",
  sideImage = "/demo/delivery/dish-03.webp",
  sideImageAlt = "Том-ям с креветками",
  sticker = "хит недели · том-ям 490 ₽",
  ticker = ["Смэш-бургер", "Том-ям", "Поке с лососем", "Пад-тай", "Картошка с трюфелем", "Чизкейк «Сан-Себастьян»", "Рамен тонкоцу", "Шаурма на углях"],
  timerLabel = "{m} минут {s} секунд",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero038Props) {
  const [seconds, setSeconds] = useState(minutes * 60)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => (value <= 1 ? minutes * 60 : value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [minutes])

  const palette = {
    ...(accent ? { "--vibeui-hero-038-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-038-fg": ink } : null),
    ...(background ? { "--vibeui-hero-038-bg": background } : null),
    ...style,
  } as CSSProperties

  const trustParts = trust.split(" · ")
  const tickerRow = ticker.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-038" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-038" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">
              <span>
                <i>{title}</i>
              </span>
              <span>
                <i>
                  <time data-part="timer" aria-live="off" aria-label={timerLabel.replace("{m}", String(Math.floor(seconds / 60))).replace("{s}", String(seconds % 60))}>
                    {pad(Math.floor(seconds / 60))}
                    <b>:</b>
                    {pad(seconds % 60)}
                  </time>
                </i>
              </span>
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <Button016
                  data-part="primary"
                  size="lg"
                  label={primaryLabel}
                  href={primaryHref}
                  external={false}
                  tone="accent"
                  accent={accent}
                />
              ) : null}
              {secondaryLabel ? (
                <Button016
                  data-part="secondary"
                  size="lg"
                  label={secondaryLabel}
                  href={secondaryHref}
                  external={false}
                  tone="neutral"
                  accent={accent}
                />
              ) : null}
            </div>
            {trust ? (
              <p data-part="trust">
                {trustParts.map((part, index) => (
                  <span key={part}>
                    {index > 0 ? " · " : null}
                    {index === 0 ? <b>{part}</b> : part}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <div data-part="scene" aria-hidden="true">
            <div data-part="disc" />
            <div data-part="steam">
              <i />
              <i />
              <i />
            </div>
            <div data-part="dish">
              <img src={image} alt={imageAlt} loading="eager" />
            </div>
            {sideImage ? (
              <figure data-part="photo">
                <img src={sideImage} alt={sideImageAlt} loading="lazy" />
                {sticker ? <figcaption data-part="sticker">{sticker}</figcaption> : null}
              </figure>
            ) : null}
          </div>
        </div>
        {ticker.length > 0 ? (
          <div data-part="ticker" aria-hidden="true">
            <div data-part="track">
              {tickerRow}
              {tickerRow}
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
