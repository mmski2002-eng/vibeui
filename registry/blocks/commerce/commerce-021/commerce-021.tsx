import type { CSSProperties } from "react"

export type Commerce021Way = {
  value: string
  label: string
  when: string
  price: string
  note?: string
  mark?: string
}

export type Commerce021Props = {
  title?: string
  lead?: string
  ways?: Commerce021Way[]
  slots?: string[]
  days?: { date: string; day: string }[]
  cta?: string
  note?: string
  /** Скрытая подпись выбора способа доставки. */
  wayLabel?: string
  /** Скрытая подпись выбора дня. */
  dayLabel?: string
  /** Подпись выбора интервала. */
  slotLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: выбор доставки, где у каждого способа названы обе цены — деньги
// и время. Способ без срока сравнить не с чем, а срок без цены заставляет
// открывать другой экран. Пометки «быстрее всех» и «дешевле всех» стоят на
// вариантах, потому что именно между этими двумя крайностями и выбирают.
// День и интервал появляются только под курьером — на :has(), без состояния.
const STYLES = `
:where([data-vibeui-block="commerce-021"]){
--vibeui-commerce-021-bg:transparent;
--vibeui-commerce-021-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-021-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-021-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-021-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-021-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-commerce-021-accent:light-dark(oklch(0.55 0.2 262),oklch(0.7 0.17 262));
--vibeui-commerce-021-on-accent:light-dark(oklch(1 0 0),oklch(0.16 0.02 265));
--vibeui-commerce-021-mark:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-021-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-021"]{color-scheme:dark}
[data-vibeui-block="commerce-021"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-021-bg);
font-family:var(--vibeui-commerce-021-sans);color:var(--vibeui-commerce-021-fg);
}
[data-vibeui-block="commerce-021"] *{box-sizing:border-box}
[data-vibeui-block="commerce-021"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-021"] [data-part="shell"]{padding:1rem;max-width:40rem;margin:0 auto}
[data-vibeui-block="commerce-021"] h2{margin:0 0 0.25rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-021"] [data-part="lead"]{margin:0 0 0.875rem;font-size:0.8125rem;color:var(--vibeui-commerce-021-muted);line-height:1.45}
[data-vibeui-block="commerce-021"] fieldset{margin:0;padding:0;border:0}
[data-vibeui-block="commerce-021"] [data-part="ways"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-021"] [data-part="way"]{
display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:0.625rem;align-items:start;
padding:0.75rem;border-radius:0.875rem;cursor:pointer;
border:1px solid var(--vibeui-commerce-021-border);
}
[data-vibeui-block="commerce-021"] [data-part="way"]:has(input:checked){border-color:var(--vibeui-commerce-021-accent);background:var(--vibeui-commerce-021-soft)}
[data-vibeui-block="commerce-021"] [data-part="way"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-021-accent);outline-offset:2px}
[data-vibeui-block="commerce-021"] input[type="radio"]{accent-color:var(--vibeui-commerce-021-accent);width:1rem;height:1rem;margin:0.125rem 0 0}
[data-vibeui-block="commerce-021"] [data-part="name"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:650;line-height:1.25}
/* Срок и цена всегда рядом: одно без другого не даёт выбрать. */
[data-vibeui-block="commerce-021"] [data-part="when"]{display:block;margin-top:0.1875rem;font-size:0.75rem;color:var(--vibeui-commerce-021-muted)}
[data-vibeui-block="commerce-021"] [data-part="note"]{display:block;margin-top:0.1875rem;font-size:0.6875rem;color:var(--vibeui-commerce-021-muted);line-height:1.4}
[data-vibeui-block="commerce-021"] [data-part="mark"]{
padding:0.0625rem 0.375rem;border-radius:9999px;font-size:0.625rem;font-weight:700;
background:color-mix(in oklab,var(--vibeui-commerce-021-mark) 16%,transparent);color:var(--vibeui-commerce-021-mark);
}
[data-vibeui-block="commerce-021"] [data-part="price"]{font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
/* День и интервал нужны только курьеру: показываем их выбором, а не всегда. */
[data-vibeui-block="commerce-021"] [data-part="when-box"]{display:none;margin-top:0.75rem}
[data-vibeui-block="commerce-021"] [data-part="ways"]:has(#commerce-021-courier:checked) [data-part="when-box"]{display:block}
[data-vibeui-block="commerce-021"] [data-part="days"]{display:flex;gap:0.375rem;overflow-x:auto;padding-bottom:0.25rem}
[data-vibeui-block="commerce-021"] [data-part="day"]{
flex:none;display:flex;flex-direction:column;align-items:center;gap:0.125rem;cursor:pointer;
min-width:3.5rem;padding:0.4375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-021-border);font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-021"] [data-part="day"] input{position:absolute;width:1px;height:1px;opacity:0}
[data-vibeui-block="commerce-021"] [data-part="day"] span{font-size:0.625rem;font-weight:500;color:var(--vibeui-commerce-021-muted)}
[data-vibeui-block="commerce-021"] [data-part="day"]:has(input:checked){border-color:var(--vibeui-commerce-021-accent);background:var(--vibeui-commerce-021-paper)}
[data-vibeui-block="commerce-021"] [data-part="day"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-021-accent);outline-offset:2px}
[data-vibeui-block="commerce-021"] [data-part="slot"]{display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;font-size:0.75rem;color:var(--vibeui-commerce-021-muted)}
[data-vibeui-block="commerce-021"] select{
appearance:none;font:inherit;font-size:0.8125rem;color:inherit;height:2.25rem;flex:1;
padding:0 1.75rem 0 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-021-border);background:var(--vibeui-commerce-021-paper);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 1rem) 55%,calc(100% - 0.75rem) 55%;
background-size:0.25rem 0.25rem,0.25rem 0.25rem;background-repeat:no-repeat;
}
[data-vibeui-block="commerce-021"] select:focus-visible{outline:2px solid var(--vibeui-commerce-021-accent);outline-offset:2px}
[data-vibeui-block="commerce-021"] [data-part="go"]{
width:100%;margin-top:0.875rem;appearance:none;border:0;cursor:pointer;height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-commerce-021-accent);color:var(--vibeui-commerce-021-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-021"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-021-accent);outline-offset:2px}
[data-vibeui-block="commerce-021"] [data-part="foot"]{margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-021-muted)}
@container (min-width: 32rem){
[data-vibeui-block="commerce-021"] [data-part="way"]{gap:0.875rem;padding:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WAYS: Commerce021Way[] = [
  {
    value: "courier",
    label: "Курьер до двери",
    when: "Завтра, 12 марта",
    price: "490 ₽",
    note: "Позвонит за час, поднимет на этаж",
    mark: "быстрее всех",
  },
  {
    value: "pickup",
    label: "Пункт выдачи",
    when: "13 марта, Пушкина 12",
    price: "бесплатно",
    note: "Хранение 5 дней, примерочная на месте",
    mark: "дешевле всех",
  },
  {
    value: "post",
    label: "Почта России",
    when: "17–21 марта",
    price: "290 ₽",
    note: "Трек-номер придёт на почту в день отправки",
  },
]

const DEFAULT_DAYS = [
  { date: "12", day: "ср" },
  { date: "13", day: "чт" },
  { date: "14", day: "пт" },
  { date: "15", day: "сб" },
]

const DEFAULT_SLOTS = ["10:00 – 14:00", "14:00 – 18:00", "18:00 – 22:00"]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Выбор доставки: цена и срок у каждого способа, день и интервал — под курьером.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce021({
  title = "Как доставить",
  lead = "Все сроки посчитаны для вашего адреса: Москва, Пушкина 12.",
  ways = DEFAULT_WAYS,
  slots = DEFAULT_SLOTS,
  days = DEFAULT_DAYS,
  cta = "Подтвердить доставку",
  note = "Если товара не окажется на складе, предупредим до отправки и предложим другой срок.",
  wayLabel = "Способ доставки",
  dayLabel = "День доставки",
  slotLabel = "Интервал",
  accent,
  background = "",
  className,
  style,
}: Commerce021Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-021-bg": background,
          "--vibeui-commerce-021-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-021" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-021"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <fieldset data-part="ways">
            <legend data-part="vh">{wayLabel}</legend>
            {ways.map((way, index) => (
              <label key={way.value} data-part="way">
                <input
                  type="radio"
                  name="commerce-021-way"
                  value={way.value}
                  id={index === 0 ? "commerce-021-courier" : undefined}
                  defaultChecked={index === 0}
                />
                <span>
                  <span data-part="name">
                    {way.label}
                    {way.mark ? <span data-part="mark">{way.mark}</span> : null}
                  </span>
                  <span data-part="when">{way.when}</span>
                  {way.note ? <span data-part="note">{way.note}</span> : null}
                </span>
                <span data-part="price">{way.price}</span>
              </label>
            ))}

            <div data-part="when-box">
              <fieldset>
                <legend data-part="vh">{dayLabel}</legend>
                <div data-part="days">
                  {days.map((day, index) => (
                    <label key={day.date} data-part="day">
                      <input
                        type="radio"
                        name="commerce-021-day"
                        value={day.date}
                        defaultChecked={index === 0}
                      />
                      {day.date}
                      <span>{day.day}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <p data-part="slot">
                <label htmlFor="commerce-021-slot">{slotLabel}</label>
                <select id="commerce-021-slot" defaultValue={slots[1]}>
                  {slots.map((slot) => (
                    <option key={slot}>{slot}</option>
                  ))}
                </select>
              </p>
            </div>
          </fieldset>

          <button type="button" data-part="go">
            {cta}
          </button>
          <p data-part="foot">{note}</p>
        </div>
      </section>
    </>
  )
}
