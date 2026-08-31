import type { CSSProperties } from "react"

export type Commerce056License = {
  value: string
  label: string
  price: string
  audience: string
  allowed: string[]
  denied: string[]
}

export type Commerce056Fact = {
  id: string
  term: string
  value: string
}

export type Commerce056Props = {
  kind?: string
  title?: string
  lead?: string
  legend?: string
  licenses?: Commerce056License[]
  allowedTitle?: string
  deniedTitle?: string
  facts?: Commerce056Fact[]
  cta?: string
  delivery?: string
  refund?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница цифрового товара, где покупают не файл, а право.
// Три лицензии — это три радиокнопки, и панель прав под ними меняется
// на :has() без единой строки JS. Разрешённое и запрещённое разведены в
// два списка: смешанный перечень «можно/нельзя» читают наискосок и
// ошибаются. Возврат объявлен отдельно, потому что у файла его почти нет.
const STYLES = `
:where([data-vibeui-block="commerce-056"]){
--vibeui-commerce-056-bg:oklch(1 0 0);
--vibeui-commerce-056-fg:oklch(0.2 0.014 300);
--vibeui-commerce-056-muted:oklch(0.53 0.016 300);
--vibeui-commerce-056-border:oklch(0.9 0.008 300);
--vibeui-commerce-056-soft:oklch(0.973 0.006 300);
--vibeui-commerce-056-accent:oklch(0.5 0.19 300);
--vibeui-commerce-056-yes:oklch(0.48 0.12 150);
--vibeui-commerce-056-no:oklch(0.53 0.16 25);
--vibeui-commerce-056-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-056"]{
box-sizing:border-box;background:var(--vibeui-commerce-056-bg);
color:var(--vibeui-commerce-056-fg);font-family:var(--vibeui-commerce-056-sans);
}
[data-vibeui-block="commerce-056"] *{box-sizing:border-box}
[data-vibeui-block="commerce-056"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-056"] [data-part="kind"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-056-accent)}
[data-vibeui-block="commerce-056"] h2{margin:0.375rem 0 0.5rem;font-size:clamp(1.375rem,4.5cqi,2rem);line-height:1.1;letter-spacing:-0.025em}
[data-vibeui-block="commerce-056"] [data-part="lead"]{margin:0 0 1.25rem;max-width:56ch;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-commerce-056-muted)}
[data-vibeui-block="commerce-056"] fieldset{border:0;margin:0 0 1rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-056"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-056-muted);
}
[data-vibeui-block="commerce-056"] [data-part="picks"]{display:grid;gap:0.5rem;grid-template-columns:1fr;clear:both}
[data-vibeui-block="commerce-056"] [data-part="pick"]{position:relative;display:block}
[data-vibeui-block="commerce-056"] [data-part="pick"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-056"] [data-part="face"]{
display:block;cursor:pointer;border:1px solid var(--vibeui-commerce-056-border);border-radius:0.875rem;padding:0.75rem 0.875rem;
transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-056"] [data-part="pick"] input:checked+[data-part="face"]{
border-color:var(--vibeui-commerce-056-accent);background:var(--vibeui-commerce-056-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-056-accent);
}
[data-vibeui-block="commerce-056"] [data-part="pick"] input:focus-visible+[data-part="face"]{outline:2px solid var(--vibeui-commerce-056-accent);outline-offset:2px}
[data-vibeui-block="commerce-056"] [data-part="name"]{display:block;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-056"] [data-part="price"]{display:block;margin-top:0.125rem;font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums;color:var(--vibeui-commerce-056-accent)}
[data-vibeui-block="commerce-056"] [data-part="audience"]{display:block;margin-top:0.25rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-056-muted)}
[data-vibeui-block="commerce-056"] [data-part="rights"]{display:none;border:1px solid var(--vibeui-commerce-056-border);border-radius:1rem;padding:1rem 1.125rem;margin-bottom:1rem}
[data-vibeui-block="commerce-056"] [data-part="cols"]{display:grid;gap:1rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-056"] h3{margin:0 0 0.5rem;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="commerce-056"] [data-part="rights"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="commerce-056"] [data-part="rights"] li{display:flex;gap:0.5rem;align-items:flex-start}
[data-vibeui-block="commerce-056"] [data-part="rights"] li::before{
flex:none;width:1.125rem;height:1.125rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;
font-size:0.6875rem;font-weight:800;color:oklch(0.99 0 0);margin-top:0.0625rem;
}
[data-vibeui-block="commerce-056"] [data-part="allowed"] li::before{content:"✓";background:var(--vibeui-commerce-056-yes)}
[data-vibeui-block="commerce-056"] [data-part="denied"] li::before{content:"×";background:var(--vibeui-commerce-056-no);border-radius:0.1875rem}
[data-vibeui-block="commerce-056"] [data-part="facts"]{
margin:0 0 1rem;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.375rem 0.75rem;
padding:0.875rem 1rem;border-radius:0.875rem;background:var(--vibeui-commerce-056-soft);font-size:0.8125rem;
}
[data-vibeui-block="commerce-056"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-056"] dt{color:var(--vibeui-commerce-056-muted);min-width:0}
[data-vibeui-block="commerce-056"] dd{margin:0;text-align:right;font-weight:650}
[data-vibeui-block="commerce-056"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.875rem;padding:0 1.75rem;border-radius:0.875rem;
background:var(--vibeui-commerce-056-accent);color:oklch(0.99 0 0);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-056"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-056-accent);outline-offset:2px}
[data-vibeui-block="commerce-056"] [data-part="delivery"]{margin:0.75rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-056-muted)}
[data-vibeui-block="commerce-056"] [data-part="refund"]{margin:0.5rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-056-muted)}
[data-vibeui-block="commerce-056"] [data-part="shell"]:has(#commerce-056-personal:checked) [data-part="rights"][data-for="personal"]{display:block}
[data-vibeui-block="commerce-056"] [data-part="shell"]:has(#commerce-056-business:checked) [data-part="rights"][data-for="business"]{display:block}
[data-vibeui-block="commerce-056"] [data-part="shell"]:has(#commerce-056-extended:checked) [data-part="rights"][data-for="extended"]{display:block}
@container (min-width: 34rem){
[data-vibeui-block="commerce-056"] [data-part="picks"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="commerce-056"] [data-part="cols"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 48rem){
[data-vibeui-block="commerce-056"] [data-part="shell"]{padding:2rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-056"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LICENSES: Commerce056License[] = [
  {
    value: "personal",
    label: "Личная",
    price: "1 900 ₽",
    audience: "Учебные работы, личный сайт, портфолио без оплаты",
    allowed: [
      "использовать в личных проектах без ограничения по сроку",
      "устанавливать на два своих устройства",
      "показывать работы в портфолио и соцсетях",
    ],
    denied: [
      "продавать что-либо, сделанное с использованием файла",
      "передавать файл заказчику или коллеге",
      "использовать в рекламе и на упаковке",
    ],
  },
  {
    value: "business",
    label: "Коммерческая",
    price: "6 400 ₽",
    audience: "Сайты, приложения и материалы одной компании",
    allowed: [
      "использовать в проектах компании и её клиентов",
      "устанавливать на пять рабочих устройств",
      "встраивать в сайт и мобильное приложение",
      "печатать тираж до 50 000 экземпляров",
    ],
    denied: [
      "перепродавать файл как самостоятельный товар",
      "включать в шаблоны и конструкторы для перепродажи",
    ],
  },
  {
    value: "extended",
    label: "Расширенная",
    price: "24 000 ₽",
    audience: "Продукты, которые сами продаются: шаблоны, игры, SaaS",
    allowed: [
      "встраивать в продукт, который вы продаёте",
      "устанавливать без ограничения по числу устройств",
      "печатать неограниченный тираж",
      "передавать файл подрядчикам под договором",
    ],
    denied: ["перепродавать файл в исходном виде как отдельный товар"],
  },
]

const DEFAULT_FACTS: Commerce056Fact[] = [
  { id: "1", term: "Формат", value: "OTF, WOFF2, переменный VF" },
  { id: "2", term: "Начертаний", value: "9 + курсивы" },
  { id: "3", term: "Языки", value: "Кириллица, латиница, греческий" },
  { id: "4", term: "Размер архива", value: "18,4 МБ" },
  { id: "5", term: "Обновления", value: "Бесплатно, версия 2.x" },
]

/**
 * Страница цифрового товара с лицензиями: панель прав переключается на
 * :has() без JS. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce056({
  kind = "Шрифт",
  title = "Гарнитура «Плёс» — 9 начертаний и переменная версия",
  lead = "Один архив, три лицензии. Выберите ту, что описывает ваш случай: права различаются сильнее, чем цена.",
  legend = "Лицензия",
  licenses = DEFAULT_LICENSES,
  allowedTitle = "Что разрешено",
  deniedTitle = "Что запрещено",
  facts = DEFAULT_FACTS,
  cta = "Купить и скачать",
  delivery = "Ссылка на архив приходит на почту сразу после оплаты и живёт 30 дней.",
  refund = "Возврат возможен, пока ссылка не открыта: после скачивания файл считается переданным. Если архив не открывается — заменим или вернём деньги без срока.",
  accent,
  className,
  style,
}: Commerce056Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-056-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-056" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-056"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="kind">{kind}</p>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <fieldset>
            <legend>{legend}</legend>
            <div data-part="picks">
              {licenses.map((license, index) => (
                <label
                  key={license.value}
                  data-part="pick"
                  htmlFor={`commerce-056-${license.value}`}
                >
                  <input
                    type="radio"
                    id={`commerce-056-${license.value}`}
                    name="commerce-056-license"
                    defaultChecked={index === 0}
                  />
                  <span data-part="face">
                    <span data-part="name">{license.label}</span>
                    <span data-part="price">{license.price}</span>
                    <span data-part="audience">{license.audience}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {licenses.map((license) => (
            <div
              key={license.value}
              data-part="rights"
              data-for={license.value}
              aria-label={`Права по лицензии «${license.label}»`}
            >
              <div data-part="cols">
                <div>
                  <h3>{allowedTitle}</h3>
                  <ul data-part="allowed">
                    {license.allowed.map((right) => (
                      <li key={right}>{right}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>{deniedTitle}</h3>
                  <ul data-part="denied">
                    {license.denied.map((right) => (
                      <li key={right}>{right}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <dl data-part="facts">
            {facts.map((fact) => (
              <div key={fact.id} data-part="pair">
                <dt>{fact.term}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <button type="button" data-part="go">
            {cta}
          </button>
          <p data-part="delivery">{delivery}</p>
          <p data-part="refund">{refund}</p>
        </div>
      </section>
    </>
  )
}
