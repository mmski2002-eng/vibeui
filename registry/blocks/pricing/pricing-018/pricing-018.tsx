import type { CSSProperties } from "react"

export type Pricing018Section = {
  title: string
  caption: string
  items: { title: string; detail?: string }[]
}

export type Pricing018Props = {
  eyebrow?: string
  title?: string
  lede?: string
  sections?: Pricing018Section[]
  action?: { label: string; href: string }
  price?: string
  period?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: развёрнутый ответ на вопрос «а что вообще входит». Пункты не
// свалены в один список, а разложены по разделам с подписью, зачем раздел
// нужен: тридцать строк подряд не читают. У пункта есть уточнение серым —
// оно снимает вопрос «а это в каком объёме», из-за которого обычно пишут в
// поддержку. Цена и кнопка стоят в липкой колонке слева на широком экране,
// чтобы длинный перечень не уводил от действия.
const STYLES = `
:where([data-vibeui-block="pricing-018"]){
--vibeui-pricing-018-bg:transparent;
--vibeui-pricing-018-fg:light-dark(oklch(0.19 0.014 210),oklch(0.94 0.006 210));
--vibeui-pricing-018-muted:light-dark(oklch(0.51 0.014 210),oklch(0.7 0.012 210));
--vibeui-pricing-018-card:light-dark(oklch(1 0 0),oklch(0.25 0.012 210));
--vibeui-pricing-018-line:light-dark(oklch(0.89 0.008 210),oklch(0.37 0.012 210));
--vibeui-pricing-018-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-pricing-018-accent-fg:oklch(from var(--vibeui-pricing-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-018-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-018"]{color-scheme:dark}
[data-vibeui-block="pricing-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-018-bg);color:var(--vibeui-pricing-018-fg);
font-family:var(--vibeui-pricing-018-sans);
}
[data-vibeui-block="pricing-018"] *{box-sizing:border-box}
[data-vibeui-block="pricing-018"] [data-part="shell"]{
max-width:66rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2rem;align-items:start;
}
[data-vibeui-block="pricing-018"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-018-accent);
}
[data-vibeui-block="pricing-018"] h2{
margin:0;max-width:18ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-018"] [data-part="lede"]{margin:0.875rem 0 0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-018-muted);text-wrap:pretty}
[data-vibeui-block="pricing-018"] [data-part="buy"]{
margin-top:1.5rem;padding:1.25rem;border-radius:1rem;
border:1px solid var(--vibeui-pricing-018-line);background:var(--vibeui-pricing-018-card);
}
[data-vibeui-block="pricing-018"] [data-part="price"]{
display:flex;align-items:baseline;gap:0.375rem;margin:0;
font-size:1.75rem;font-weight:700;letter-spacing:-0.035em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-018"] [data-part="period"]{font-size:0.8125rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-018-muted)}
[data-vibeui-block="pricing-018"] a{
display:flex;align-items:center;justify-content:center;margin-top:1rem;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-pricing-018-accent);color:oklch(from var(--vibeui-pricing-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color var(--vibeui-pricing-018-dur-2) ease;
}
[data-vibeui-block="pricing-018"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-018-accent) 86%,black)}
[data-vibeui-block="pricing-018"] a:focus-visible{outline:2px solid var(--vibeui-pricing-018-accent);outline-offset:3px}
[data-vibeui-block="pricing-018"] [data-part="sections"]{display:grid;gap:1.75rem}
[data-vibeui-block="pricing-018"] h3{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="pricing-018"] [data-part="caption"]{
margin:0.25rem 0 0.875rem;padding-bottom:0.75rem;border-bottom:1px solid var(--vibeui-pricing-018-line);
font-size:0.8125rem;color:var(--vibeui-pricing-018-muted);
}
[data-vibeui-block="pricing-018"] ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.75rem}
[data-vibeui-block="pricing-018"] li{display:flex;align-items:flex-start;gap:0.625rem}
[data-vibeui-block="pricing-018"] [data-part="tick"]{
flex:0 0 auto;margin-top:0.125rem;width:1.125rem;height:1.125rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-pricing-018-accent) 14%,transparent);color:var(--vibeui-pricing-018-accent);
}
[data-vibeui-block="pricing-018"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="pricing-018"] [data-part="detail"]{display:block;margin-top:0.125rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-pricing-018-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-018"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-018"] ul{grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem 1.5rem}
}
@container (min-width: 58rem){
[data-vibeui-block="pricing-018"] [data-part="shell"]{grid-template-columns:minmax(0,20rem) minmax(0,1fr);gap:3.5rem;padding:6rem 2.5rem}
[data-vibeui-block="pricing-018"] [data-part="aside"]{position:sticky;top:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Pricing018Section[] = [
  {
    title: "Каталог и секции",
    caption: "То, ради чего оформляют доступ.",
    items: [
      { title: "1 080 секций", detail: "Все категории, включая новые" },
      { title: "Живое превью", detail: "Тот же файл, что приедет в проект" },
      { title: "Пополнение каждую неделю", detail: "Без доплат за обновления" },
      { title: "Инструкция для агента", detail: "К каждой секции отдельно" },
    ],
  },
  {
    title: "Работа в команде",
    caption: "Всё, что нужно, когда над страницей не один человек.",
    items: [
      { title: "До пяти участников", detail: "Больше — по цене за место" },
      { title: "Общие пресеты палитры", detail: "Бренд-цвета одним выбором" },
      { title: "История установок", detail: "Кто и когда поставил секцию" },
      { title: "Единый счёт", detail: "Один документ на всю команду" },
    ],
  },
  {
    title: "Поддержка и документы",
    caption: "Что происходит, когда что-то пошло не так.",
    items: [
      { title: "Ответ за рабочий день", detail: "По будням с 10 до 19" },
      { title: "Счета и акты", detail: "Для оплаты с юридического лица" },
      { title: "Возврат 30 дней", detail: "Без объяснения причин" },
      {
        title: "Коммерческое использование",
        detail: "Без ограничений по числу клиентов",
      },
    ],
  },
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

/** Блок «что входит» списком: перечень разложен по разделам, цена в липкой колонке. */
export function Pricing018({
  eyebrow = "Состав тарифа",
  title = "Двенадцать пунктов, а не «и многое другое»",
  lede = "Ниже полный перечень того, что открывает подписка. Если чего-то нет в списке — этого нет и в тарифе.",
  sections = DEFAULT_SECTIONS,
  action = { label: "Оформить подписку", href: "#" },
  price = "1 490 ₽",
  period = "в месяц",
  accent,
  background = "",
  className,
  style,
}: Pricing018Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-018"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="aside">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}

            <div data-part="buy">
              <p data-part="price">
                {price}
                <span data-part="period">{period}</span>
              </p>
              <a href={action.href}>{action.label}</a>
            </div>
          </div>

          <div data-part="sections">
            {sections.slice(0, 4).map((section) => (
              <section key={section.title}>
                <h3>{section.title}</h3>
                <p data-part="caption">{section.caption}</p>
                <ul>
                  {section.items.slice(0, 8).map((item) => (
                    <li key={item.title}>
                      <span data-part="tick" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="11" height="11">
                          <path
                            d="M3.5 8.5 6.5 11.5 12.5 4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>
                        <span data-part="name">{item.title}</span>
                        {item.detail ? (
                          <span data-part="detail">{item.detail}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
