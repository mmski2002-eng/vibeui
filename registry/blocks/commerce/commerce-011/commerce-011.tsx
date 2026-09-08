import type { CSSProperties } from "react"

export type Commerce011Line = {
  title: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  option?: string
  price: string
  hue?: number
}

export type Commerce011Props = {
  title?: string
  order?: string
  eta?: string
  lines?: Commerce011Line[]
  facts?: { label: string; value: string }[]
  next?: string[]
  mail?: string
  cta?: string
  secondary?: string
  /** Абзац под заголовком. */
  lead?: string
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
// Идея блока: экран после оплаты, где главные два факта — номер заказа и
// срок — набраны крупно и стоят выше всего остального. Именно их ищут, когда
// возвращаются к письму через неделю. Номер вынесен в элемент, который можно
// выделить целиком, а не внутри длинной фразы. Ниже — что произойдёт дальше,
// потому что «спасибо за заказ» само по себе не отвечает ни на один вопрос.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-011"]){
--vibeui-commerce-011-bg:transparent;
--vibeui-commerce-011-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-011-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-commerce-011-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-011-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-011-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-011-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-commerce-011-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-011"]{color-scheme:dark}
[data-vibeui-block="commerce-011"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-011-bg);
font-family:var(--vibeui-commerce-011-sans);color:var(--vibeui-commerce-011-fg);
}
[data-vibeui-block="commerce-011"] *{box-sizing:border-box}
[data-vibeui-block="commerce-011"] [data-part="shell"]{padding:1.5rem 1rem;max-width:44rem;margin:0 auto}
[data-vibeui-block="commerce-011"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:2.75rem;height:2.75rem;border-radius:9999px;margin-bottom:0.875rem;
background:color-mix(in oklab,var(--vibeui-commerce-011-ok) 18%,transparent);
color:var(--vibeui-commerce-011-ok);font-size:1.25rem;
}
[data-vibeui-block="commerce-011"] h2{margin:0 0 0.375rem;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;line-height:1.15}
[data-vibeui-block="commerce-011"] [data-part="lead"]{margin:0 0 1rem;font-size:0.875rem;line-height:1.5;color:var(--vibeui-commerce-011-muted)}
[data-vibeui-block="commerce-011"] [data-part="key"]{
display:grid;gap:0.75rem;grid-template-columns:1fr;margin-bottom:1rem;
}
@container (min-width: 30rem){
[data-vibeui-block="commerce-011"] [data-part="key"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="commerce-011"] [data-part="card"]{
padding:0.875rem;border-radius:1rem;border:1px solid var(--vibeui-commerce-011-border);
background:var(--vibeui-commerce-011-soft);
}
[data-vibeui-block="commerce-011"] [data-part="cap"]{margin:0 0 0.25rem;font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-commerce-011-muted)}
/* Номер заказа — отдельная строка: его копируют, а не читают внутри фразы. */
[data-vibeui-block="commerce-011"] [data-part="big"]{
margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;
user-select:all;
}
[data-vibeui-block="commerce-011"] h3{margin:1.25rem 0 0.5rem;font-size:0.8125rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;color:var(--vibeui-commerce-011-muted)}
[data-vibeui-block="commerce-011"] ol[data-part="next"]{margin:0;padding:0 0 0 1.125rem;display:flex;flex-direction:column;gap:0.375rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="commerce-011"] ol[data-part="next"] li::marker{color:var(--vibeui-commerce-011-accent);font-weight:700}
[data-vibeui-block="commerce-011"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-011"] [data-part="line"]{
display:grid;grid-template-columns:2.5rem minmax(0,1fr) auto;gap:0.625rem;align-items:center;
padding-bottom:0.5rem;border-bottom:1px solid var(--vibeui-commerce-011-border);
}
[data-vibeui-block="commerce-011"] [data-part="shot"]{
position:relative;width:2.5rem;height:2.5rem;border-radius:0.5rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="commerce-011"] [data-part="shot"][data-empty="true"]{background:linear-gradient(145deg,light-dark(oklch(0.94 0.05 var(--vibeui-commerce-011-hue,262)),oklch(0.43 0.06 var(--vibeui-commerce-011-hue,262))),light-dark(oklch(0.87 0.09 var(--vibeui-commerce-011-hue,262)),oklch(0.33 0.07 var(--vibeui-commerce-011-hue,262))));}
[data-vibeui-block="commerce-011"] [data-part="shot"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="commerce-011"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="commerce-011"] [data-part="option"]{margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-011-muted)}
[data-vibeui-block="commerce-011"] [data-part="cost"]{font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-011"] dl{display:grid;grid-template-columns:auto 1fr;gap:0.375rem 0.75rem;margin:0.75rem 0 0;font-size:0.75rem}
[data-vibeui-block="commerce-011"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-011"] dt{color:var(--vibeui-commerce-011-muted)}
[data-vibeui-block="commerce-011"] dd{margin:0}
[data-vibeui-block="commerce-011"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-block="commerce-011"] [data-part="track"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-commerce-011-accent);color:var(--vibeui-commerce-011-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-011"] [data-part="back"]{
appearance:none;cursor:pointer;height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-011-border);background:var(--vibeui-commerce-011-bg);
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-011"] [data-part="track"]:focus-visible,
[data-vibeui-block="commerce-011"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-commerce-011-accent);outline-offset:2px}
[data-vibeui-block="commerce-011"] [data-part="mail"]{margin:0.875rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-011-muted);line-height:1.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Commerce011Line[] = [
  {
    title: "Кресло «Хмарь»",
    option: "Песочный, дуб",
    price: "38 900 ₽",
    hue: 75,
  },
  {
    title: "Плед «Пасмурно» × 2",
    option: "Шерсть, 140 × 200",
    price: "14 800 ₽",
    hue: 262,
  },
]

const DEFAULT_FACTS = [
  { label: "Адрес", value: "Москва, Пушкина 12, кв. 40" },
  { label: "Оплата", value: "Картой •• 4417, списано 51 505 ₽" },
  { label: "Получатель", value: "Мария Ковалёва, +7 916 000-11-22" },
]

const DEFAULT_NEXT = [
  "Соберём заказ на складе сегодня до 20:00.",
  "Пришлём СМС с интервалом доставки утром 12 марта.",
  "Курьер позвонит за час и поднимет заказ в квартиру.",
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  order: "Номер заказа",
  eta: "Доставим",
  next: "Что дальше",
  lines: "В заказе",
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
 * Подтверждение заказа: номер и срок доставки крупно, дальше — что произойдёт.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce011({
  title = "Заказ принят",
  order = "№ 2024-1187",
  eta = "12 марта, до 18:00",
  lines = DEFAULT_LINES,
  facts = DEFAULT_FACTS,
  next = DEFAULT_NEXT,
  mail = "Чек и детали ушли на m.kovaleva@example.com. Письмо не пришло за 10 минут — проверьте «Промоакции» или напишите нам.",
  cta = "Отследить заказ",
  secondary = "Вернуться в каталог",
  lead = "Мы всё получили и уже собираем. Номер заказа понадобится при обращении в поддержку — сохраните его.",
  labels = LABELS,
  accent,
  background = "",
  className,
  style,
}: Commerce011Props) {
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-commerce-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-011"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="mark" aria-hidden="true">
            ✓
          </p>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <div data-part="key">
            <div data-part="card">
              <p data-part="cap">{text.order}</p>
              <p data-part="big">{order}</p>
            </div>
            <div data-part="card">
              <p data-part="cap">{text.eta}</p>
              <p data-part="big">{eta}</p>
            </div>
          </div>

          <h3>{text.next}</h3>
          <ol data-part="next">
            {next.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3>{text.lines}</h3>
          <ul>
            {lines.map((line) => (
              <li
                key={line.title}
                data-part="line"
                style={
                  {
                    "--vibeui-commerce-011-hue": line.hue ?? 262,
                  } as CSSProperties
                }
              >
                <span
                  data-part="shot"
                  data-empty={line.image ? undefined : "true"}
                  aria-hidden="true"
                >
                  {line.image ? (
                    <img
                      src={line.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <div>
                  <p data-part="name">{line.title}</p>
                  {line.option ? <p data-part="option">{line.option}</p> : null}
                </div>
                <span data-part="cost">{line.price}</span>
              </li>
            ))}
          </ul>

          <dl>
            {facts.map((fact) => (
              <div key={fact.label} data-part="pair">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div data-part="actions">
            <button type="button" data-part="track">
              {cta}
            </button>
            <button type="button" data-part="back">
              {secondary}
            </button>
          </div>

          <p data-part="mail">{mail}</p>
        </div>
      </section>
    </>
  )
}
