import type { CSSProperties } from "react"

export type Commerce009Line = {
  id: string
  title: string
  option?: string
  price: string
  count?: number
  hue?: number
  note?: string
}

export type Commerce009Props = {
  title?: string
  lines?: Commerce009Line[]
  later?: Commerce009Line[]
  totals?: { label: string; value: string; strong?: boolean }[]
  cta?: string
  guarantees?: string[]
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: корзина с полкой «отложено». Товар, который не готовы купить
// сейчас, обычно удаляют — и он теряется навсегда; отдельная полка снизу
// сохраняет его и не мешает считать итог. Количество здесь не кнопки, а
// нативный select: на длинном списке он короче и не требует клиентского
// состояния, поэтому блок остаётся серверным.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-009"]){
--vibeui-commerce-009-bg:transparent;
--vibeui-commerce-009-field:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-commerce-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-commerce-009-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-commerce-009-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-009-soft:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-commerce-009-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-commerce-009-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-009"]{color-scheme:dark}
[data-vibeui-block="commerce-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-009-bg);
font-family:var(--vibeui-commerce-009-sans);color:var(--vibeui-commerce-009-fg);
}
[data-vibeui-block="commerce-009"] *{box-sizing:border-box}
[data-vibeui-block="commerce-009"] [data-part="shell"]{
padding:1rem;max-width:70rem;margin:0 auto;display:grid;gap:1rem;grid-template-columns:1fr;align-items:start;
}
@container (min-width: 46rem){
[data-vibeui-block="commerce-009"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) 18rem}
}
[data-vibeui-block="commerce-009"] h2{margin:0 0 0.75rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="commerce-009"] h3{margin:1rem 0 0.5rem;font-size:0.8125rem;font-weight:650;color:var(--vibeui-commerce-009-muted)}
[data-vibeui-block="commerce-009"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-009"] [data-part="line"]{
display:grid;grid-template-columns:3.5rem minmax(0,1fr);gap:0.75rem;
padding:0.625rem;border-radius:0.875rem;border:1px solid var(--vibeui-commerce-009-border);
}
[data-vibeui-block="commerce-009"] [data-part="shot"]{
width:3.5rem;height:3.5rem;border-radius:0.625rem;
background:linear-gradient(145deg,light-dark(oklch(0.94 0.05 var(--vibeui-commerce-009-hue,262)),oklch(0.43 0.06 var(--vibeui-commerce-009-hue,262))),light-dark(oklch(0.87 0.09 var(--vibeui-commerce-009-hue,262)),oklch(0.33 0.07 var(--vibeui-commerce-009-hue,262))));
}
[data-vibeui-block="commerce-009"] [data-part="head"]{display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;align-items:baseline}
[data-vibeui-block="commerce-009"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-009"] [data-part="price"]{margin-left:auto;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-009"] [data-part="option"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-009-muted)}
[data-vibeui-block="commerce-009"] [data-part="note"]{margin:0.25rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-009-accent);font-weight:600}
[data-vibeui-block="commerce-009"] [data-part="tools"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-top:0.5rem}
[data-vibeui-block="commerce-009"] select{
appearance:none;font:inherit;font-size:0.75rem;color:inherit;height:1.875rem;
padding:0 1.5rem 0 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-commerce-009-border);background:var(--vibeui-commerce-009-field);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.75rem) 55%,calc(100% - 0.5rem) 55%;
background-size:0.25rem 0.25rem,0.25rem 0.25rem;background-repeat:no-repeat;
}
[data-vibeui-block="commerce-009"] select:focus-visible{outline:2px solid var(--vibeui-commerce-009-accent);outline-offset:2px}
[data-vibeui-block="commerce-009"] [data-part="link"]{
appearance:none;border:0;background:none;padding:0;cursor:pointer;
color:var(--vibeui-commerce-009-muted);font:inherit;font-size:0.6875rem;text-decoration:underline;
}
[data-vibeui-block="commerce-009"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-commerce-009-accent);outline-offset:2px}
/* Полка «отложено»: товар, который не готовы купить сейчас, иначе теряется. */
[data-vibeui-block="commerce-009"] [data-part="later"] [data-part="line"]{background:var(--vibeui-commerce-009-soft);border-style:dashed}
[data-vibeui-block="commerce-009"] [data-part="total"]{
padding:0.875rem;border-radius:1rem;border:1px solid var(--vibeui-commerce-009-border);
position:sticky;top:1rem;
}
[data-vibeui-block="commerce-009"] dl{display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;margin:0 0 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-009"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-009"] dt{color:var(--vibeui-commerce-009-muted)}
[data-vibeui-block="commerce-009"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-009"] [data-strong="true"]{font-size:1.0625rem;font-weight:700;color:var(--vibeui-commerce-009-fg)}
[data-vibeui-block="commerce-009"] [data-part="pay"]{
width:100%;appearance:none;border:0;cursor:pointer;height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-commerce-009-accent);color:var(--vibeui-commerce-009-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-009"] [data-part="pay"]:focus-visible{outline:2px solid var(--vibeui-commerce-009-accent);outline-offset:2px}
[data-vibeui-block="commerce-009"] [data-part="guarantees"]{
list-style:none;margin:0.75rem 0 0;padding:0;display:flex;flex-direction:column;gap:0.375rem;
font-size:0.6875rem;color:var(--vibeui-commerce-009-muted);
}
[data-vibeui-block="commerce-009"] [data-part="guarantees"] li{display:flex;gap:0.375rem;align-items:flex-start}
[data-vibeui-block="commerce-009"] [data-part="guarantees"] li::before{content:"✓";color:var(--vibeui-commerce-009-accent);font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Commerce009Line[] = [
  {
    id: "1",
    title: "Кресло «Хмарь»",
    option: "Песочный, дуб",
    price: "38 900 ₽",
    count: 1,
    hue: 75,
    note: "Осталось 2 штуки",
  },
  {
    id: "2",
    title: "Плед «Пасмурно»",
    option: "Шерсть, 140 × 200",
    price: "7 400 ₽",
    count: 2,
    hue: 262,
  },
]

const DEFAULT_LATER: Commerce009Line[] = [
  {
    id: "3",
    title: "Торшер «Сумерки»",
    option: "Латунь",
    price: "16 200 ₽",
    hue: 150,
  },
]

const DEFAULT_TOTALS = [
  { label: "Товары, 3 шт.", value: "53 700 ₽" },
  { label: "Скидка по карте", value: "−2 685 ₽" },
  { label: "Доставка", value: "бесплатно" },
  { label: "Итого", value: "51 015 ₽", strong: true },
]

const DEFAULT_GUARANTEES = [
  "Возврат 14 дней без объяснения причины",
  "Оплата при получении для заказов до 30 000 ₽",
  "Сборка и подъём на этаж по желанию",
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  count: "Кол-во",
  shelve: "Отложить «{title}»",
  restore: "Вернуть «{title}»",
  remove: "Убрать «{title}»",
  later: "Отложено",
  summary: "Итог заказа",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Корзина с полкой «отложено»: итог отдельной колонкой, количество — select.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce009({
  title = "Корзина",
  lines = DEFAULT_LINES,
  later = DEFAULT_LATER,
  totals = DEFAULT_TOTALS,
  cta = "Перейти к оформлению",
  guarantees = DEFAULT_GUARANTEES,
  labels = LABELS,
  accent,
  background = "",
  className,
  style,
}: Commerce009Props) {
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-commerce-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const row = (line: Commerce009Line, shelved: boolean) => (
    <li
      key={line.id}
      data-part="line"
      style={{ "--vibeui-commerce-009-hue": line.hue ?? 262 } as CSSProperties}
    >
      <span data-part="shot" aria-hidden="true" />
      <div>
        <div data-part="head">
          <p data-part="name">{line.title}</p>
          <span data-part="price">{line.price}</span>
        </div>
        {line.option ? <p data-part="option">{line.option}</p> : null}
        {line.note ? <p data-part="note">{line.note}</p> : null}
        <div data-part="tools">
          {shelved ? null : (
            <>
              <label
                htmlFor={`commerce-009-count-${line.id}`}
                data-part="option"
              >
                {text.count}
              </label>
              <select
                id={`commerce-009-count-${line.id}`}
                defaultValue={String(line.count ?? 1)}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </>
          )}
          <button type="button" data-part="link">
            {(shelved ? text.restore : text.shelve).replace(
              "{title}",
              line.title,
            )}
          </button>
          <button type="button" data-part="link">
            {text.remove.replace("{title}", line.title)}
          </button>
        </div>
      </div>
    </li>
  )

  return (
    <>
      <style href="vibeui-commerce-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-009"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>
              {title} · {lines.length}
            </h2>
            <ul>{lines.map((line) => row(line, false))}</ul>

            {later.length > 0 ? (
              <div data-part="later">
                <h3>
                  {text.later} · {later.length}
                </h3>
                <ul>{later.map((line) => row(line, true))}</ul>
              </div>
            ) : null}
          </div>

          <aside data-part="total" aria-label={text.summary}>
            <dl>
              {totals.map((entry) => (
                <div key={entry.label} data-part="pair">
                  <dt data-strong={entry.strong ? "true" : undefined}>
                    {entry.label}
                  </dt>
                  <dd data-strong={entry.strong ? "true" : undefined}>
                    {entry.value}
                  </dd>
                </div>
              ))}
            </dl>
            <button type="button" data-part="pay">
              {cta}
            </button>
            <ul data-part="guarantees">
              {guarantees.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
