import type { CSSProperties } from "react"

export type Solutions006Slot = {
  time: string
  state: "free" | "held" | "busy"
  who?: string
}

export type Solutions006Props = {
  title?: string
  day?: string
  place?: string
  slots?: Solutions006Slot[]
  legendFree?: string
  legendHeld?: string
  legendBusy?: string
  cta?: string
  /** Счётчик свободных, {free} и {total} — числа слотов. */
  freeText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сетка слотов на день. Занятый слот остаётся видимым и подписан
// именем: исчезающий слот выглядит как ошибка загрузки, а не как занятость.
// Свободные слоты — кнопки, занятые — обычный текст, поэтому в обход мыши
// нельзя нажать то, что нажать нельзя. Состояние передаётся заливкой и
// подписью в легенде, а не одним цветом. Часовой пояс написан рядом с датой:
// без него бронь на 14:00 значит разное для двух сторон.
const STYLES = `
:where([data-vibeui-block="solutions-006"]){
--vibeui-solutions-006-bg:transparent;
--vibeui-solutions-006-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-solutions-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-solutions-006-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-solutions-006-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-solutions-006-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-solutions-006-onaccent:oklch(0.15 0.02 39.8);
--vibeui-solutions-006-held:light-dark(oklch(0.72 0.15 39.8),oklch(0.8 0.13 39.8));
--vibeui-solutions-006-heldsoft:light-dark(oklch(0.72 0.15 39.8 / 18%),oklch(0.8 0.13 39.8 / 22%));
--vibeui-solutions-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-006"]{color-scheme:dark}
[data-vibeui-block="solutions-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-006-bg);
border:1px solid var(--vibeui-solutions-006-border);border-radius:1rem;
font-family:var(--vibeui-solutions-006-sans);color:var(--vibeui-solutions-006-fg);
}
[data-vibeui-block="solutions-006"] *{box-sizing:border-box}
[data-vibeui-block="solutions-006"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin-bottom:0.75rem;
}
[data-vibeui-block="solutions-006"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
/* Часовой пояс рядом с датой: без него 14:00 значит разное для двух сторон. */
[data-vibeui-block="solutions-006"] [data-part="day"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-006-muted)}
[data-vibeui-block="solutions-006"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0 0 0.75rem;
font-size:0.6875rem;color:var(--vibeui-solutions-006-muted);
}
[data-vibeui-block="solutions-006"] [data-part="legend"] span{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="solutions-006"] [data-part="chip"]{
width:0.75rem;height:0.75rem;border-radius:0.25rem;
border:1px solid var(--vibeui-solutions-006-border);
background:var(--vibeui-solutions-006-bg);
}
[data-vibeui-block="solutions-006"] [data-chip="held"]{
border-color:var(--vibeui-solutions-006-held);
background:var(--vibeui-solutions-006-heldsoft);
}
[data-vibeui-block="solutions-006"] [data-chip="busy"]{
border-color:var(--vibeui-solutions-006-border);
background:var(--vibeui-solutions-006-panel);
}
[data-vibeui-block="solutions-006"] ul{
list-style:none;margin:0 0 0.875rem;padding:0;
display:grid;grid-template-columns:repeat(2,1fr);gap:0.375rem;
}
@container (min-width: 26rem){[data-vibeui-block="solutions-006"] ul{grid-template-columns:repeat(4,1fr)}}
@container (min-width: 44rem){[data-vibeui-block="solutions-006"] ul{grid-template-columns:repeat(6,1fr)}}
/* Свободный слот — кнопка, занятый — текст: нельзя нажать то, что занято. */
[data-vibeui-block="solutions-006"] button[data-part="slot"]{
width:100%;appearance:none;cursor:pointer;
min-height:3rem;padding:0.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-solutions-006-border);
background:var(--vibeui-solutions-006-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-006"] button[data-part="slot"]:hover{
border-color:var(--vibeui-solutions-006-accent);color:var(--vibeui-solutions-006-accent);
}
[data-vibeui-block="solutions-006"] button[data-part="slot"]:focus-visible{outline:2px solid var(--vibeui-solutions-006-accent);outline-offset:2px}
[data-vibeui-block="solutions-006"] [data-part="taken"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.125rem;
min-height:3rem;padding:0.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-solutions-006-border);
background:var(--vibeui-solutions-006-panel);
font-size:0.8125rem;font-weight:650;color:var(--vibeui-solutions-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-006"] [data-state="held"]{
border-color:var(--vibeui-solutions-006-held);
background:var(--vibeui-solutions-006-heldsoft);
}
/* Занятый слот подписан именем: исчезнувший читается как ошибка загрузки. */
[data-vibeui-block="solutions-006"] [data-part="who"]{
font-size:0.625rem;font-weight:500;
max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="solutions-006"] [data-part="cta"]{
width:100%;appearance:none;cursor:pointer;height:2.375rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-solutions-006-accent);color:var(--vibeui-solutions-006-onaccent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="solutions-006"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-solutions-006-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLOTS: Solutions006Slot[] = [
  { time: "09:00", state: "busy", who: "Полёт" },
  { time: "10:00", state: "free" },
  { time: "11:00", state: "held", who: "бронь 10 мин" },
  { time: "12:00", state: "free" },
  { time: "13:00", state: "busy", who: "обед" },
  { time: "14:00", state: "free" },
  { time: "15:00", state: "free" },
  { time: "16:00", state: "busy", who: "Мера" },
  { time: "17:00", state: "free" },
  { time: "18:00", state: "free" },
  { time: "19:00", state: "busy", who: "Гаврилов" },
  { time: "20:00", state: "free" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

/**
 * Сетка слотов на день: занятые видны и подписаны, свободные — кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions006({
  title = "Запись на консультацию",
  day = "Пятница, 13 марта · UTC+3",
  place = "Онлайн, 45 минут",
  slots = DEFAULT_SLOTS,
  legendFree = "свободно",
  legendHeld = "удерживается",
  legendBusy = "занято",
  cta = "Подтвердить запись",
  freeText = "Свободно {free} из {total}",
  accent,
  background = "",
  className,
  style,
}: Solutions006Props) {
  const free = slots.filter((slot) => slot.state === "free").length

  const palette = {
    ...(accent ? { "--vibeui-solutions-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-006"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="day">
              {day} · {place}
            </p>
          </div>
          <p data-part="day">
            {freeText
              .replace("{free}", String(free))
              .replace("{total}", String(slots.length))}
          </p>
        </header>

        <p data-part="legend">
          <span>
            <span data-part="chip" aria-hidden="true" />
            {legendFree}
          </span>
          <span>
            <span data-part="chip" data-chip="held" aria-hidden="true" />
            {legendHeld}
          </span>
          <span>
            <span data-part="chip" data-chip="busy" aria-hidden="true" />
            {legendBusy}
          </span>
        </p>

        <ul>
          {slots.map((slot) => (
            <li key={slot.time}>
              {slot.state === "free" ? (
                <button type="button" data-part="slot">
                  {slot.time}
                </button>
              ) : (
                <p data-part="taken" data-state={slot.state}>
                  {slot.time}
                  {slot.who ? <span data-part="who">{slot.who}</span> : null}
                </p>
              )}
            </li>
          ))}
        </ul>

        <button type="button" data-part="cta">
          {cta}
        </button>
      </section>
    </>
  )
}
