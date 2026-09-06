import type { CSSProperties } from "react"

export type Commerce069State = "active" | "paused" | "ending"

export type Commerce069Sub = {
  id: string
  title: string
  detail: string
  price: string
  every: string
  next: string
  card: string
  state: Commerce069State
  hue?: number
}

export type Commerce069Props = {
  title?: string
  lead?: string
  monthlyLabel?: string
  monthly?: string
  yearlyLabel?: string
  yearly?: string
  subs?: Commerce069Sub[]
  /** Подписи статусов: active, paused, ending. */
  stateText?: Record<string, string>
  nextLabel?: string
  pause?: string
  resume?: string
  changeCard?: string
  cancel?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: управление подписками, где отмена не спрятана. Сумма в месяц
// и в год посчитана сверху: человек приходит сюда именно с вопросом «сколько
// у меня уходит». У каждой подписки видна дата следующего списания и карта,
// с которой спишут, — без них строка не отвечает ни на один вопрос. Пауза
// стоит рядом с отменой, потому что чаще нужна именно она.
const STYLES = `
:where([data-vibeui-block="commerce-069"]){
--vibeui-commerce-069-bg:transparent;
--vibeui-commerce-069-surface:light-dark(oklch(1 0 0),oklch(0.22 0 300));
--vibeui-commerce-069-fg:light-dark(oklch(0.21 0 300),oklch(0.94 0 300));
--vibeui-commerce-069-muted:light-dark(oklch(0.53 0 300),oklch(0.73 0 300));
--vibeui-commerce-069-border:light-dark(oklch(0.9 0 300),oklch(0.38 0 300));
--vibeui-commerce-069-soft:light-dark(oklch(0.972 0 300),oklch(0.27 0 300));
--vibeui-commerce-069-accent:light-dark(oklch(0.5 0.16 300),oklch(0.76 0.14 300));
--vibeui-commerce-069-live:light-dark(oklch(0.47 0.12 150),oklch(0.78 0.14 150));
--vibeui-commerce-069-pause:light-dark(oklch(0.58 0.13 75),oklch(0.82 0.14 75));
--vibeui-commerce-069-end:light-dark(oklch(0.54 0.16 25),oklch(0.73 0.15 25));
--vibeui-commerce-069-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-069"]{color-scheme:dark}
[data-vibeui-block="commerce-069"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-069-bg);
color:var(--vibeui-commerce-069-fg);font-family:var(--vibeui-commerce-069-sans);
}
[data-vibeui-block="commerce-069"] *{box-sizing:border-box}
[data-vibeui-block="commerce-069"] [data-part="shell"]{max-width:56rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-069"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-069"] [data-part="lead"]{margin:0 0 1.125rem;max-width:54ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-069-muted)}
[data-vibeui-block="commerce-069"] [data-part="sums"]{display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:1.25rem}
[data-vibeui-block="commerce-069"] [data-part="sum"]{border:1px solid var(--vibeui-commerce-069-border);border-radius:0.875rem;padding:0.75rem 0.875rem;background:var(--vibeui-commerce-069-soft)}
[data-vibeui-block="commerce-069"] [data-part="slabel"]{display:block;font-size:0.75rem;color:var(--vibeui-commerce-069-muted)}
[data-vibeui-block="commerce-069"] [data-part="svalue"]{display:block;margin-top:0.125rem;font-size:1.375rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-069"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="commerce-069"] [data-part="sub"]{border:1px solid var(--vibeui-commerce-069-border);border-radius:1rem;padding:0.875rem 1rem}
[data-vibeui-block="commerce-069"] [data-part="head"]{display:flex;gap:0.75rem;align-items:flex-start}
[data-vibeui-block="commerce-069"] [data-part="thumb"]{
flex:none;width:2.75rem;height:2.75rem;border-radius:0.75rem;
background:linear-gradient(150deg,oklch(0.93 0.06 var(--vibeui-commerce-069-hue,300)),oklch(0.82 0.11 var(--vibeui-commerce-069-hue,300)));
}
[data-vibeui-block="commerce-069"] [data-part="texts"]{flex:1;min-width:0}
[data-vibeui-block="commerce-069"] [data-part="row"]{display:flex;flex-wrap:wrap;gap:0.375rem;align-items:center}
[data-vibeui-block="commerce-069"] [data-part="name"]{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-069"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.3125rem;height:1.375rem;padding:0 0.5rem;border-radius:0.4375rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
border:1px solid var(--vibeui-commerce-069-border);
}
[data-vibeui-block="commerce-069"] [data-part="state"][data-state="active"]{color:var(--vibeui-commerce-069-live)}
[data-vibeui-block="commerce-069"] [data-part="state"][data-state="paused"]{color:var(--vibeui-commerce-069-pause)}
[data-vibeui-block="commerce-069"] [data-part="state"][data-state="ending"]{color:var(--vibeui-commerce-069-end)}
[data-vibeui-block="commerce-069"] [data-part="mark"]{width:0.5rem;height:0.5rem;border-radius:9999px;background:currentColor}
[data-vibeui-block="commerce-069"] [data-part="state"][data-state="paused"] [data-part="mark"]{border-radius:0.125rem}
[data-vibeui-block="commerce-069"] [data-part="state"][data-state="ending"] [data-part="mark"]{clip-path:polygon(50% 0,100% 100%,0 100%);border-radius:0}
[data-vibeui-block="commerce-069"] [data-part="detail"]{margin:0.1875rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-069-muted)}
[data-vibeui-block="commerce-069"] [data-part="price"]{margin:0;flex:none;text-align:right;font-size:1.0625rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-069"] [data-part="every"]{display:block;font-size:0.6875rem;font-weight:400;color:var(--vibeui-commerce-069-muted)}
[data-vibeui-block="commerce-069"] [data-part="next"]{
margin:0.75rem 0 0;padding:0.5rem 0.625rem;border-radius:0.625rem;background:var(--vibeui-commerce-069-soft);
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="commerce-069"] [data-part="next"] strong{font-weight:750}
[data-vibeui-block="commerce-069"] [data-part="tools"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem}
[data-vibeui-block="commerce-069"] [data-part="tool"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-069-border);background:var(--vibeui-commerce-069-surface);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-069"] [data-part="danger"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-069-border);background:transparent;
color:var(--vibeui-commerce-069-end);font:inherit;font-size:0.8125rem;font-weight:650;margin-left:auto;
}
[data-vibeui-block="commerce-069"] [data-part="tool"]:focus-visible,
[data-vibeui-block="commerce-069"] [data-part="danger"]:focus-visible{outline:2px solid var(--vibeui-commerce-069-accent);outline-offset:2px}
[data-vibeui-block="commerce-069"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-069"] [data-part="note"]{margin:1rem 0 0;max-width:56ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-069-muted)}
@container (min-width: 40rem){
[data-vibeui-block="commerce-069"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-069"] [data-part="sums"]{grid-template-columns:repeat(2,minmax(0,16rem))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-069"] *{animation:none!important;transition:none!important}}
`

const STATE_WORD: Record<Commerce069State, string> = {
  active: "Активна",
  paused: "На паузе",
  ending: "Заканчивается",
}

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

const DEFAULT_SUBS: Commerce069Sub[] = [
  {
    id: "1",
    title: "Кофе каждый месяц",
    detail: "250 г зерна свежей обжарки, помол под ваш способ заваривания.",
    price: "1 690 ₽",
    every: "раз в месяц",
    next: "Спишем 2 апреля",
    card: "Мир •• 4821",
    state: "active",
    hue: 45,
  },
  {
    id: "2",
    title: "Фильтры для воды",
    detail: "Комплект из двух картриджей на квартал.",
    price: "2 300 ₽",
    every: "раз в 3 месяца",
    next: "На паузе до 1 июня",
    card: "Мир •• 4821",
    state: "paused",
    hue: 200,
  },
  {
    id: "3",
    title: "Клуб мастерской",
    detail: "Доступ к мастер-классам и скидка 10% на весь каталог.",
    price: "6 900 ₽",
    every: "раз в год",
    next: "Продлится 18 мая, если не отменить до 17 мая",
    card: "Мир •• 0175",
    state: "ending",
    hue: 300,
  },
]

/**
 * Управление подписками: суммы в месяц и в год сверху, дата списания и
 * карта у каждой строки, пауза рядом с отменой. Один файл, ноль зависимостей.
 */
export function Commerce069({
  title = "Мои подписки",
  lead = "Здесь видно всё, что списывается автоматически. Отменённая подписка работает до конца оплаченного периода — деньги за него не сгорают.",
  monthlyLabel = "Списывается в месяц",
  monthly = "2 456 ₽",
  yearlyLabel = "За год",
  yearly = "29 470 ₽",
  subs = DEFAULT_SUBS,
  stateText = STATE_WORD,
  nextLabel = "Следующее списание",
  pause = "Поставить на паузу",
  resume = "Возобновить",
  changeCard = "Сменить карту",
  cancel = "Отменить",
  note = "Пауза сохраняет цену: после возобновления подписка продолжится по старому тарифу, даже если он подорожал. Отмена этого не сохраняет.",
  accent,
  background = "",
  className,
  style,
}: Commerce069Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-069-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-069-bg": background,
          // Кнопки действий не должны просвечивать: им нужна непрозрачная
          // подложка, а она задана тем же цветом.
          "--vibeui-commerce-069-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-069" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-069"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <div data-part="sums">
            <div data-part="sum">
              <span data-part="slabel">{monthlyLabel}</span>
              <span data-part="svalue">{monthly}</span>
            </div>
            <div data-part="sum">
              <span data-part="slabel">{yearlyLabel}</span>
              <span data-part="svalue">{yearly}</span>
            </div>
          </div>

          <ul>
            {subs.map((sub) => (
              <li
                key={sub.id}
                data-part="sub"
                style={
                  {
                    "--vibeui-commerce-069-hue": sub.hue ?? 300,
                  } as CSSProperties
                }
              >
                <div data-part="head">
                  <span data-part="thumb" aria-hidden="true" />
                  <div data-part="texts">
                    <div data-part="row">
                      <p data-part="name">{sub.title}</p>
                      <span data-part="state" data-state={sub.state}>
                        <span data-part="mark" aria-hidden="true" />
                        {stateText[sub.state] ?? STATE_WORD[sub.state]}
                      </span>
                    </div>
                    <p data-part="detail">{sub.detail}</p>
                  </div>
                  <p data-part="price">
                    {sub.price}
                    <span data-part="every">{sub.every}</span>
                  </p>
                </div>

                <p data-part="next">
                  {nextLabel}: <strong>{sub.next}</strong> · {sub.card}
                </p>

                <div data-part="tools">
                  <button type="button" data-part="tool">
                    {sub.state === "paused" ? resume : pause}
                    <span data-part="sr"> — {sub.title}</span>
                  </button>
                  <button type="button" data-part="tool">
                    {changeCard}
                    <span data-part="sr"> — {sub.title}</span>
                  </button>
                  <button type="button" data-part="danger">
                    {cancel}
                    <span data-part="sr"> — {sub.title}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
