import type { CSSProperties } from "react"

export type Commerce067Pocket = {
  id: string
  label: string
  value: string
  hint: string
  expires?: string
}

export type Commerce067Move = {
  id: string
  title: string
  at: string
  delta: string
  positive?: boolean
}

export type Commerce067Props = {
  greeting?: string
  balanceLabel?: string
  balance?: string
  pending?: string
  topUp?: string
  withdraw?: string
  pocketsTitle?: string
  pockets?: Commerce067Pocket[]
  movesTitle?: string
  moves?: Commerce067Move[]
  allMoves?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: кабинет с балансом, где одна большая цифра не врёт. Рядом
// с доступной суммой стоит строка «в пути»: деньги, которые ещё не зашли,
// нельзя складывать с доступными. Бонусы и кэшбэк вынесены в отдельные
// карманы с датой сгорания — бонус без срока люди считают деньгами.
const STYLES = `
:where([data-vibeui-block="commerce-067"]){
--vibeui-commerce-067-bg:transparent;
--vibeui-commerce-067-surface:light-dark(oklch(1 0 0),oklch(0.22 0.014 250));
--vibeui-commerce-067-fg:light-dark(oklch(0.2 0.014 250),oklch(0.94 0.007 250));
--vibeui-commerce-067-muted:light-dark(oklch(0.53 0.016 250),oklch(0.73 0.013 250));
--vibeui-commerce-067-border:light-dark(oklch(0.9 0.008 250),oklch(0.38 0.016 250));
--vibeui-commerce-067-soft:light-dark(oklch(0.972 0.006 250),oklch(0.28 0.018 250));
--vibeui-commerce-067-accent:light-dark(oklch(0.48 0.14 245),oklch(0.75 0.13 245));
--vibeui-commerce-067-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 245));
--vibeui-commerce-067-plus:light-dark(oklch(0.47 0.12 150),oklch(0.78 0.14 150));
--vibeui-commerce-067-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-067"]{color-scheme:dark}
[data-vibeui-block="commerce-067"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-067-bg);
color:var(--vibeui-commerce-067-fg);font-family:var(--vibeui-commerce-067-sans);
}
[data-vibeui-block="commerce-067"] *{box-sizing:border-box}
[data-vibeui-block="commerce-067"] [data-part="shell"]{max-width:58rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-067"] [data-part="greeting"]{margin:0 0 0.875rem;font-size:0.8125rem;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="hero"]{
border:1px solid var(--vibeui-commerce-067-border);border-radius:1.25rem;padding:1.25rem;
background:linear-gradient(140deg,var(--vibeui-commerce-067-soft),var(--vibeui-commerce-067-surface) 70%);
margin-bottom:1.25rem;
}
[data-vibeui-block="commerce-067"] [data-part="blabel"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="balance"]{margin:0.375rem 0 0;font-size:clamp(2rem,8cqi,3.25rem);font-weight:750;line-height:1;letter-spacing:-0.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-067"] [data-part="pending"]{margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem}
[data-vibeui-block="commerce-067"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.625rem;padding:0 1.375rem;border-radius:0.875rem;
background:var(--vibeui-commerce-067-accent);color:var(--vibeui-commerce-067-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-067"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.625rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-067-border);background:var(--vibeui-commerce-067-surface);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-067"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-067"] [data-part="alt"]:focus-visible,
[data-vibeui-block="commerce-067"] [data-part="all"]:focus-visible{outline:2px solid var(--vibeui-commerce-067-accent);outline-offset:2px}
[data-vibeui-block="commerce-067"] h3{margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="pockets"]{list-style:none;margin:0 0 1.5rem;padding:0;display:grid;gap:0.625rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-067"] [data-part="pocket"]{border:1px solid var(--vibeui-commerce-067-border);border-radius:0.875rem;padding:0.75rem 0.875rem}
[data-vibeui-block="commerce-067"] [data-part="plabel"]{display:block;font-size:0.75rem;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="pvalue"]{display:block;margin-top:0.125rem;font-size:1.25rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-067"] [data-part="phint"]{display:block;margin-top:0.25rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="expires"]{
display:inline-block;margin-top:0.4375rem;padding:0.125rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-commerce-067-soft);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="commerce-067"] [data-part="moves"]{list-style:none;margin:0;padding:0;border:1px solid var(--vibeui-commerce-067-border);border-radius:0.875rem;overflow:hidden}
[data-vibeui-block="commerce-067"] [data-part="move"]{display:flex;gap:0.75rem;align-items:baseline;padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-commerce-067-border)}
[data-vibeui-block="commerce-067"] [data-part="move"]:last-child{border-bottom:0}
[data-vibeui-block="commerce-067"] [data-part="mtitle"]{flex:1;min-width:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-067"] [data-part="mat"]{display:block;margin-top:0.0625rem;font-size:0.75rem;font-weight:400;color:var(--vibeui-commerce-067-muted)}
[data-vibeui-block="commerce-067"] [data-part="delta"]{flex:none;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-067"] [data-part="delta"][data-positive]{color:var(--vibeui-commerce-067-plus)}
[data-vibeui-block="commerce-067"] [data-part="all"]{
display:inline-block;margin-top:0.75rem;font-size:0.8125rem;font-weight:650;
color:var(--vibeui-commerce-067-accent);text-decoration:underline;text-underline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="commerce-067"] [data-part="note"]{margin:0.875rem 0 0;max-width:56ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-067-muted)}
@container (min-width: 34rem){
[data-vibeui-block="commerce-067"] [data-part="pockets"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 48rem){
[data-vibeui-block="commerce-067"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-067"] [data-part="hero"]{padding:1.75rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-067"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_POCKETS: Commerce067Pocket[] = [
  {
    id: "1",
    label: "Бонусы",
    value: "2 480",
    hint: "Списываются как рубли, но не больше 30% суммы заказа.",
    expires: "Сгорают 30 июня",
  },
  {
    id: "2",
    label: "Кэшбэк за март",
    value: "1 140 ₽",
    hint: "Зачислится на баланс 5 апреля, после закрытия периода возвратов.",
  },
  {
    id: "3",
    label: "Подарочный сертификат",
    value: "5 000 ₽",
    hint: "Тратится целиком в одном заказе, остаток не сохраняется.",
    expires: "Действует до 12 сентября",
  },
]

const DEFAULT_MOVES: Commerce067Move[] = [
  {
    id: "1",
    title: "Возврат за заказ № 2024-1102",
    at: "9 марта, 11:20",
    delta: "+ 7 400 ₽",
    positive: true,
  },
  {
    id: "2",
    title: "Оплата заказа № 2024-1187",
    at: "8 марта, 19:04",
    delta: "− 12 300 ₽",
  },
  {
    id: "3",
    title: "Пополнение с карты •• 4821",
    at: "6 марта, 10:12",
    delta: "+ 20 000 ₽",
    positive: true,
  },
]

/**
 * Личный кабинет с балансом: доступная сумма отделена от денег в пути,
 * бонусы разложены по карманам со сроками. Один файл, ноль зависимостей.
 */
export function Commerce067({
  greeting = "Анна Ремизова · счёт покупателя",
  balanceLabel = "Доступно",
  balance = "18 340 ₽",
  pending = "Ещё 7 400 ₽ в пути: возврат по заказу № 2024-1102 придёт до 14 марта.",
  topUp = "Пополнить счёт",
  withdraw = "Вывести на карту",
  pocketsTitle = "Карманы",
  pockets = DEFAULT_POCKETS,
  movesTitle = "Последние движения",
  moves = DEFAULT_MOVES,
  allMoves = "Вся история операций",
  note = "Вывести можно только деньги, которые пришли возвратом или пополнением. Бонусы и кэшбэк на карту не выводятся — их тратят в заказах.",
  accent,
  background = "",
  className,
  style,
}: Commerce067Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-067-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-067-bg": background,
          // Карточка баланса и вторая кнопка не должны просвечивать: им нужна
          // непрозрачная подложка, а она задана тем же цветом.
          "--vibeui-commerce-067-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-067" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-067"
        className={className}
        style={palette}
        aria-label={balanceLabel}
      >
        <div data-part="shell">
          <p data-part="greeting">{greeting}</p>

          <div data-part="hero">
            <p data-part="blabel">{balanceLabel}</p>
            <p data-part="balance">{balance}</p>
            <p data-part="pending">{pending}</p>
            <div data-part="actions">
              <button type="button" data-part="go">
                {topUp}
              </button>
              <button type="button" data-part="alt">
                {withdraw}
              </button>
            </div>
          </div>

          <h3>{pocketsTitle}</h3>
          <ul data-part="pockets">
            {pockets.map((pocket) => (
              <li key={pocket.id} data-part="pocket">
                <span data-part="plabel">{pocket.label}</span>
                <span data-part="pvalue">{pocket.value}</span>
                <span data-part="phint">{pocket.hint}</span>
                {pocket.expires ? (
                  <span data-part="expires">{pocket.expires}</span>
                ) : null}
              </li>
            ))}
          </ul>

          <h3>{movesTitle}</h3>
          <ul data-part="moves">
            {moves.map((move) => (
              <li key={move.id} data-part="move">
                <span data-part="mtitle">
                  {move.title}
                  <span data-part="mat">{move.at}</span>
                </span>
                <span
                  data-part="delta"
                  data-positive={move.positive ? "true" : undefined}
                >
                  {move.delta}
                </span>
              </li>
            ))}
          </ul>
          <a data-part="all" href="#history">
            {allMoves}
          </a>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
