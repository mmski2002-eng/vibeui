import type { CSSProperties } from "react"

export type Commerce035Wrap = {
  id: string
  label: string
  price: string
  hue: number
  ribbon: number
}

export type Commerce035Props = {
  title?: string
  lead?: string
  wraps?: Commerce035Wrap[]
  cardTitle?: string
  cardPlaceholder?: string
  cardValue?: string
  limit?: number
  hideLabel?: string
  hideHint?: string
  price?: string
  cta?: string
  /** Подпись группы вариантов упаковки. */
  wrapsLegend?: string
  /** Подпись под полем: {limit} подставляет число символов. */
  limitText?: string
  /** Заголовок превью и надпись на самой открытке. */
  previewTitle?: string
  cardHead?: string
  /** Пояснение под ценой упаковки. */
  priceNote?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подарочная упаковка выбирается образцом, который нарисован
// CSS — коробка с лентой и бантом, а не картинка: блок обязан оставаться
// одним переносимым файлом. Открытка — настоящая textarea с maxLength и
// подписанным лимитом: счётчик символов потребовал бы состояния, а лимит,
// названный словами, работает и без него. Чекбокс «скрыть цены» стоит
// отдельно от упаковки: это разные решения, и их часто путают.
const STYLES = `
:where([data-vibeui-block="commerce-035"]){
--vibeui-commerce-035-bg:transparent;
--vibeui-commerce-035-radius:0;
--vibeui-commerce-035-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-035-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-035-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-commerce-035-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.011 265));
--vibeui-commerce-035-accent:light-dark(oklch(0.53 0.17 15),oklch(0.75 0.15 15));
--vibeui-commerce-035-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 15));
--vibeui-commerce-035-paper-top:light-dark(oklch(0.98 0.012 85),oklch(0.3 0.021 85));
--vibeui-commerce-035-paper-bottom:light-dark(oklch(0.99 0.008 85),oklch(0.33 0.017 85));
--vibeui-commerce-035-shadow:light-dark(oklch(0.2 0.02 265 / 8%),oklch(0 0 0 / 45%));
--vibeui-commerce-035-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-commerce-035-hand:ui-rounded,"Segoe UI",system-ui,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-035"]{color-scheme:dark}
[data-vibeui-block="commerce-035"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-035-bg);
border-radius:var(--vibeui-commerce-035-radius);
color:var(--vibeui-commerce-035-fg);font-family:var(--vibeui-commerce-035-sans);
}
[data-vibeui-block="commerce-035"] *{box-sizing:border-box}
[data-vibeui-block="commerce-035"] [data-part="shell"]{max-width:50rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-035"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-035"] [data-part="lead"]{margin:0 0 1rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-035-muted)}
[data-vibeui-block="commerce-035"] fieldset{border:0;margin:0;padding:0}
[data-vibeui-block="commerce-035"] legend{
padding:0;float:left;width:100%;clear:both;margin-bottom:0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-035-muted);
}
[data-vibeui-block="commerce-035"] [data-part="wraps"]{clear:both;display:grid;gap:0.5rem;grid-template-columns:repeat(2,minmax(0,1fr))}
@container (min-width: 34rem){
[data-vibeui-block="commerce-035"] [data-part="wraps"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-035"] [data-part="wrap"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="commerce-035"] [data-part="wrap"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="commerce-035"] [data-part="face"]{
display:block;padding:0.625rem;border-radius:1rem;text-align:center;
border:1px solid var(--vibeui-commerce-035-border);background:var(--vibeui-commerce-035-bg);
transition:border-color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="commerce-035"] [data-part="wrap"] input:checked + [data-part="face"]{
border-color:var(--vibeui-commerce-035-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-035-accent);
}
[data-vibeui-block="commerce-035"] [data-part="wrap"] input:focus-visible + [data-part="face"]{outline:2px solid var(--vibeui-commerce-035-accent);outline-offset:2px}
/* Образец нарисован CSS: блок остаётся одним файлом и не тянет картинки. */
[data-vibeui-block="commerce-035"] [data-part="box"]{
position:relative;display:block;width:100%;aspect-ratio:4 / 3;border-radius:0.625rem;overflow:hidden;
background:linear-gradient(160deg,oklch(0.9 0.08 var(--vibeui-commerce-035-hue,15)),oklch(0.78 0.12 var(--vibeui-commerce-035-hue,15)));
}
[data-vibeui-block="commerce-035"] [data-part="box"]::before{
content:"";position:absolute;top:0;bottom:0;left:50%;width:0.5rem;transform:translateX(-50%);
background:oklch(0.96 0.06 var(--vibeui-commerce-035-ribbon,60));
}
[data-vibeui-block="commerce-035"] [data-part="box"]::after{
content:"";position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);
width:1.5rem;height:1.5rem;border-radius:9999px;
border:0.3125rem solid oklch(0.96 0.06 var(--vibeui-commerce-035-ribbon,60));
}
[data-vibeui-block="commerce-035"] [data-part="name"]{display:block;margin-top:0.4375rem;font-size:0.8125rem;font-weight:650;line-height:1.25}
[data-vibeui-block="commerce-035"] [data-part="cost"]{display:block;font-size:0.75rem;color:var(--vibeui-commerce-035-muted)}
[data-vibeui-block="commerce-035"] [data-part="pane"]{
margin-top:1rem;display:grid;gap:0.875rem;
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-035"] [data-part="pane"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start}
}
[data-vibeui-block="commerce-035"] h3{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;
text-transform:uppercase;color:var(--vibeui-commerce-035-muted);
}
[data-vibeui-block="commerce-035"] textarea{
width:100%;min-height:7rem;resize:vertical;padding:0.75rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-035-border);background:var(--vibeui-commerce-035-bg);
color:inherit;font-family:var(--vibeui-commerce-035-hand);font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="commerce-035"] textarea:focus-visible{outline:2px solid var(--vibeui-commerce-035-accent);outline-offset:1px}
[data-vibeui-block="commerce-035"] [data-part="limit"]{margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-035-muted)}
/* Открытка показана как открытка: превью объясняет, что увидит получатель. */
[data-vibeui-block="commerce-035"] [data-part="card"]{
position:relative;padding:1rem 1.125rem;border-radius:0.875rem;min-height:7rem;
background:
linear-gradient(var(--vibeui-commerce-035-paper-top),var(--vibeui-commerce-035-paper-bottom));
border:1px solid var(--vibeui-commerce-035-border);
box-shadow:0 6px 18px var(--vibeui-commerce-035-shadow);
font-family:var(--vibeui-commerce-035-hand);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="commerce-035"] [data-part="card"]::before{
content:"";position:absolute;left:0;top:0.75rem;bottom:0.75rem;width:0.1875rem;border-radius:9999px;
background:var(--vibeui-commerce-035-accent);
}
[data-vibeui-block="commerce-035"] [data-part="cardhead"]{
margin:0 0 0.375rem;font-family:var(--vibeui-commerce-035-sans);
font-size:0.625rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-035-muted);
}
[data-vibeui-block="commerce-035"] [data-part="hide"]{
margin-top:0.875rem;padding:0.75rem 0.875rem;border-radius:0.875rem;background:var(--vibeui-commerce-035-soft);
display:flex;gap:0.5rem;align-items:flex-start;cursor:pointer;
}
[data-vibeui-block="commerce-035"] [data-part="hide"] input{margin:0.1875rem 0 0;width:1rem;height:1rem;flex:0 0 auto;accent-color:var(--vibeui-commerce-035-accent)}
[data-vibeui-block="commerce-035"] [data-part="hide"] b{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-035"] [data-part="hide"] span{display:block;margin-top:0.125rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-035-muted)}
[data-vibeui-block="commerce-035"] [data-part="foot"]{
margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;justify-content:space-between;
padding-top:0.875rem;border-top:1px solid var(--vibeui-commerce-035-border);
}
[data-vibeui-block="commerce-035"] [data-part="total"]{margin:0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-035"] [data-part="total"] span{display:block;font-size:0.6875rem;font-weight:500;color:var(--vibeui-commerce-035-muted)}
[data-vibeui-block="commerce-035"] [data-part="cta"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.5rem;border-radius:0.875rem;
background:var(--vibeui-commerce-035-accent);color:var(--vibeui-commerce-035-on-accent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-035"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-035-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-035"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WRAPS: Commerce035Wrap[] = [
  { id: "none", label: "Без упаковки", price: "0 ₽", hue: 265, ribbon: 265 },
  { id: "kraft", label: "Крафт и шпагат", price: "190 ₽", hue: 70, ribbon: 40 },
  { id: "linen", label: "Лён и лента", price: "290 ₽", hue: 200, ribbon: 85 },
  { id: "red", label: "Праздничная", price: "390 ₽", hue: 15, ribbon: 95 },
]

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
 * Подарочная упаковка и открытка: образцы нарисованы CSS, текст виден как открытка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce035({
  title = "Упаковать как подарок",
  lead = "Соберём заказ в подарочную коробку, вложим открытку от руки и уберём из вложения все цены.",
  wraps = DEFAULT_WRAPS,
  cardTitle = "Открытка получателю",
  cardPlaceholder = "Напишите пару строк — их перепишут от руки",
  cardValue = "Дорогая мама, пусть этот свет греет тебя весь март. Обнимаю, Аня.",
  limit = 200,
  hideLabel = "Скрыть цены в посылке",
  hideHint = "В коробку положим накладную без сумм, чек придёт вам на почту.",
  price = "290 ₽",
  cta = "Добавить упаковку",
  wrapsLegend = "Упаковка",
  limitText = "До {limit} символов — столько помещается на открытке. Текст перепишут от руки чёрными чернилами.",
  previewTitle = "Так это будет выглядеть",
  cardHead = "Открытка в коробке",
  priceNote = "упаковка и открытка, добавится к заказу",
  accent,
  background = "",
  className,
  style,
}: Commerce035Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-035-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-035-bg": background,
          "--vibeui-commerce-035-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-035" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-035"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <fieldset>
            <legend>{wrapsLegend}</legend>
            <div data-part="wraps">
              {wraps.map((wrap, index) => (
                <label data-part="wrap" key={wrap.id}>
                  <input
                    type="radio"
                    name="commerce-035-wrap"
                    value={wrap.id}
                    defaultChecked={index === 2}
                  />
                  <span data-part="face">
                    <span
                      data-part="box"
                      aria-hidden="true"
                      style={
                        {
                          "--vibeui-commerce-035-hue": wrap.hue,
                          "--vibeui-commerce-035-ribbon": wrap.ribbon,
                        } as CSSProperties
                      }
                    />
                    <span data-part="name">{wrap.label}</span>
                    <span data-part="cost">{wrap.price}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div data-part="pane">
            <div>
              <h3>{cardTitle}</h3>
              <label htmlFor="commerce-035-text" hidden>
                {cardTitle}
              </label>
              <textarea
                id="commerce-035-text"
                maxLength={limit}
                placeholder={cardPlaceholder}
                defaultValue={cardValue}
              />
              <p data-part="limit">
                {limitText.replace("{limit}", String(limit))}
              </p>
            </div>
            <div>
              <h3>{previewTitle}</h3>
              <div data-part="card">
                <p data-part="cardhead">{cardHead}</p>
                {cardValue}
              </div>
            </div>
          </div>

          <label data-part="hide">
            <input type="checkbox" defaultChecked />
            <span>
              <b>{hideLabel}</b>
              <span>{hideHint}</span>
            </span>
          </label>

          <div data-part="foot">
            <p data-part="total">
              {price}
              <span>{priceNote}</span>
            </p>
            <button type="button" data-part="cta">
              {cta}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
