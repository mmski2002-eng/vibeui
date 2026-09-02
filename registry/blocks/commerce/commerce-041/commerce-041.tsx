import type { CSSProperties } from "react"

export type Commerce041Part = {
  id: string
  title: string
  role: string
  price: string
  hue?: number
}

export type Commerce041Props = {
  title?: string
  lead?: string
  parts?: Commerce041Part[]
  apart?: string
  /** Подписи двух сумм: ключи apart и together. */
  sumText?: Record<string, string>
  together?: string
  save?: string
  reason?: string
  cta?: string
  secondary?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: набор продаётся целиком, поэтому вместо галочек — цепочка
// товаров со знаком «плюс» между ними. Выгода показана сравнением двух сумм:
// «−15%» без суммы по отдельности ничего не доказывает. Цепочка перестраивается
// из строки в столбец контейнерным запросом, а разделители нарисованы
// псевдоэлементом и скрыты от скринридера, чтобы список читался как список.
const STYLES = `
:where([data-vibeui-block="commerce-041"]){
--vibeui-commerce-041-bg:transparent;
--vibeui-commerce-041-fg:light-dark(oklch(0.21 0.014 265),oklch(0.93 0.006 265));
--vibeui-commerce-041-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-commerce-041-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-041-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.009 265));
--vibeui-commerce-041-accent:light-dark(oklch(0.5 0.15 145),oklch(0.74 0.14 150));
--vibeui-commerce-041-onaccent:light-dark(oklch(1 0 0),oklch(0.18 0.03 150));
--vibeui-commerce-041-onfg:light-dark(oklch(1 0 0),oklch(0.18 0.01 265));
--vibeui-commerce-041-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-041"]{
box-sizing:border-box;background:var(--vibeui-commerce-041-bg);
color:var(--vibeui-commerce-041-fg);font-family:var(--vibeui-commerce-041-sans);
}
[data-vibeui-block="commerce-041"] *{box-sizing:border-box}
[data-vibeui-block="commerce-041"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-041"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-041"] [data-part="lead"]{margin:0 0 1rem;max-width:42rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-041-muted)}
[data-vibeui-block="commerce-041"] ol{
list-style:none;margin:0;padding:0;display:grid;gap:1.75rem;
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-041"] ol{grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:2.25rem}
}
[data-vibeui-block="commerce-041"] [data-part="part"]{
position:relative;border:1px solid var(--vibeui-commerce-041-border);border-radius:1.125rem;
padding:0.75rem;display:flex;gap:0.75rem;align-items:center;
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-041"] [data-part="part"]{flex-direction:column;text-align:center;padding:0.875rem}
}
/* Плюс между карточками нарисован псевдоэлементом и скрыт от скринридера. */
[data-vibeui-block="commerce-041"] [data-part="part"] + [data-part="part"]::before{
content:"+";position:absolute;left:50%;top:-1.375rem;transform:translateX(-50%);
width:1.5rem;height:1.5rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-commerce-041-fg);color:var(--vibeui-commerce-041-onfg);font-size:0.875rem;font-weight:800;line-height:1;
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-041"] [data-part="part"] + [data-part="part"]::before{left:-1.5rem;top:50%;transform:translate(-50%,-50%)}
}
[data-vibeui-block="commerce-041"] [data-part="shot"]{
flex:0 0 auto;width:4rem;aspect-ratio:1;border-radius:0.875rem;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-041-hue,145)),oklch(0.85 0.09 var(--vibeui-commerce-041-hue,145)));
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-041"] [data-part="shot"]{width:100%;aspect-ratio:4 / 3}
}
[data-vibeui-block="commerce-041"] [data-part="role"]{
display:block;font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-041-accent);
}
[data-vibeui-block="commerce-041"] [data-part="name"]{margin:0.1875rem 0 0;font-size:0.875rem;font-weight:650;line-height:1.32}
[data-vibeui-block="commerce-041"] [data-part="name"] a{color:inherit;text-decoration:none}
[data-vibeui-block="commerce-041"] [data-part="name"] a:focus-visible{outline:2px solid var(--vibeui-commerce-041-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="commerce-041"] [data-part="cost"]{margin:0.25rem 0 0;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-041"] [data-part="deal"]{
margin-top:1.25rem;padding:1rem;border-radius:1.25rem;background:var(--vibeui-commerce-041-soft);
border:1px solid var(--vibeui-commerce-041-border);display:grid;gap:0.875rem;
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-041"] [data-part="deal"]{grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:1.125rem 1.25rem}
}
[data-vibeui-block="commerce-041"] dl{margin:0;display:grid;gap:0.375rem 1rem;grid-template-columns:auto 1fr}
[data-vibeui-block="commerce-041"] dt{font-size:0.8125rem;color:var(--vibeui-commerce-041-muted)}
[data-vibeui-block="commerce-041"] dd{margin:0;font-size:0.8125rem;font-variant-numeric:tabular-nums}
/* Выгода доказана двумя суммами: процент без базы ничего не значит. */
[data-vibeui-block="commerce-041"] [data-part="apart"]{text-decoration:line-through;color:var(--vibeui-commerce-041-muted)}
[data-vibeui-block="commerce-041"] [data-part="together"]{font-size:1.5rem;font-weight:800;letter-spacing:-0.025em;grid-column:2;grid-row:2}
[data-vibeui-block="commerce-041"] [data-part="togetherLabel"]{grid-column:1;grid-row:2;align-self:center}
[data-vibeui-block="commerce-041"] [data-part="save"]{
display:inline-block;margin-top:0.375rem;padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-commerce-041-accent);color:var(--vibeui-commerce-041-onaccent);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="commerce-041"] [data-part="buttons"]{display:grid;gap:0.5rem;min-width:14rem}
[data-vibeui-block="commerce-041"] [data-part="cta"]{
appearance:none;border:0;cursor:pointer;height:2.875rem;padding:0 1.25rem;border-radius:0.875rem;
background:var(--vibeui-commerce-041-accent);color:var(--vibeui-commerce-041-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-041"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.5rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-041-border);background:var(--vibeui-commerce-041-bg);
color:inherit;font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="commerce-041"] [data-part="cta"]:focus-visible,
[data-vibeui-block="commerce-041"] [data-part="alt"]:focus-visible{outline:2px solid var(--vibeui-commerce-041-accent);outline-offset:2px}
[data-vibeui-block="commerce-041"] [data-part="reason"]{
margin:0.875rem 0 0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-commerce-041-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-041"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARTS: Commerce041Part[] = [
  {
    id: "1",
    title: "Торшер «Сумерки»",
    role: "Основа набора",
    price: "16 200 ₽",
    hue: 75,
  },
  {
    id: "2",
    title: "Лампа накаливания 4 Вт, тёплая",
    role: "Подходит по цоколю",
    price: "890 ₽",
    hue: 60,
  },
  {
    id: "3",
    title: "Диммер напольный, 2 м",
    role: "Регулирует яркость",
    price: "2 400 ₽",
    hue: 200,
  },
]

const DEFAULT_SUMS: Record<string, string> = {
  apart: "По отдельности",
  together: "Набором",
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

/**
 * Набор товаров комплектом: цепочка «плюс» и выгода, доказанная двумя суммами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce041({
  title = "Готовый набор: свет для чтения",
  lead = "Три вещи, которые собраны друг под друга: цоколь совпадает, шнур диммера дотягивается до розетки, а яркость не мигает на минимуме.",
  parts = DEFAULT_PARTS,
  apart = "19 490 ₽",
  sumText = DEFAULT_SUMS,
  together = "16 900 ₽",
  save = "Экономия 2 590 ₽",
  reason = "Набор можно разобрать: любой товар из него продаётся отдельно по своей цене. Скидка действует, только когда все три позиции в корзине.",
  cta = "Взять набором",
  secondary = "Добавить только торшер",
  accent,
  background = "",
  className,
  style,
}: Commerce041Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-041-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-041-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-041" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-041"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ol>
            {parts.map((part) => (
              <li
                key={part.id}
                data-part="part"
                style={
                  {
                    "--vibeui-commerce-041-hue": part.hue ?? 145,
                  } as CSSProperties
                }
              >
                <span data-part="shot" aria-hidden="true" />
                <div>
                  <span data-part="role">{part.role}</span>
                  <p data-part="name">
                    <a href="#product">{part.title}</a>
                  </p>
                  <p data-part="cost">{part.price}</p>
                </div>
              </li>
            ))}
          </ol>

          <div data-part="deal">
            <div>
              <dl>
                <dt>{sumText.apart ?? DEFAULT_SUMS.apart}</dt>
                <dd data-part="apart">{apart}</dd>
                <dt data-part="togetherLabel">
                  {sumText.together ?? DEFAULT_SUMS.together}
                </dt>
                <dd data-part="together">{together}</dd>
              </dl>
              <p>
                <span data-part="save">{save}</span>
              </p>
            </div>
            <div data-part="buttons">
              <button type="button" data-part="cta">
                {cta}
              </button>
              <button type="button" data-part="alt">
                {secondary}
              </button>
            </div>
          </div>

          <p data-part="reason">{reason}</p>
        </div>
      </section>
    </>
  )
}
