import type { CSSProperties } from "react"

type Faq010Item = {
  question: string
  answer: string
  /** Частый вопрос: попадает наверх, открыт и помечен бейджем. */
  popular?: boolean
}

export type Faq010Props = {
  title?: string
  badgeLabel?: string
  /** Заголовок над свёрнутой частью списка. */
  restLabel?: string
  items?: Faq010Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Частые вопросы подняты наверх, раскрыты и помечены бейджем: большинству
// хватит первых трёх ответов без единого клика. Остальное свёрнуто ниже и не
// мешает. Раскладка считается от собственной ширины блока, а не окна.
const STYLES = `
:where([data-vibeui-block="faq-010"]){
--vibeui-faq-010-bg:transparent;
--vibeui-faq-010-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-010-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-010-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-010-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-010-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-010-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-010"]{color-scheme:dark}
[data-vibeui-block="faq-010"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-010-bg);color:var(--vibeui-faq-010-ink);
font-family:var(--vibeui-faq-010-font);
}
[data-vibeui-block="faq-010"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-010"] [data-part="title"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-010"] [data-part="popular"]{display:grid;gap:0.75rem;margin:0 0 2rem}
[data-vibeui-block="faq-010"] [data-part="item"]{
border:1px solid var(--vibeui-faq-010-border);border-radius:0.875rem;
background:var(--vibeui-faq-010-card);
transition:border-color var(--vibeui-faq-010-dur-2) ease;
}
[data-vibeui-block="faq-010"] [data-part="item"]:hover,
[data-vibeui-block="faq-010"] [data-part="item"][open]{
border-color:color-mix(in oklab,var(--vibeui-faq-010-accent) 40%,var(--vibeui-faq-010-border));
}
[data-vibeui-block="faq-010"] [data-part="popular"] [data-part="item"]{
border-color:color-mix(in oklab,var(--vibeui-faq-010-accent) 30%,var(--vibeui-faq-010-border));
background:color-mix(in oklab,var(--vibeui-faq-010-accent) 6%,var(--vibeui-faq-010-card));
}
[data-vibeui-block="faq-010"] [data-part="question"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
padding:1rem 1.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-010"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-010"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-010-accent);outline-offset:2px;border-radius:0.875rem;
}
[data-vibeui-block="faq-010"] [data-part="badge"]{
flex:none;padding:0.1875rem 0.5625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-faq-010-accent) 14%,transparent);
color:var(--vibeui-faq-010-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="faq-010"] [data-part="sign"]{
margin-left:auto;flex:none;width:0.875rem;height:0.875rem;position:relative;
color:var(--vibeui-faq-010-accent);
transition:transform var(--vibeui-faq-010-dur-2) ease;
}
[data-vibeui-block="faq-010"] [data-part="sign"]::before,
[data-vibeui-block="faq-010"] [data-part="sign"]::after{
content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;
}
[data-vibeui-block="faq-010"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="faq-010"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="faq-010"] [data-part="item"][open] [data-part="sign"]{transform:rotate(45deg)}
[data-vibeui-block="faq-010"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;max-width:62ch;
color:var(--vibeui-faq-010-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-010"] [data-part="rest-label"]{
margin:0 0 0.875rem;
color:var(--vibeui-faq-010-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-010"] [data-part="rest"]{display:grid;gap:0.625rem}
@container (min-width: 40rem){
[data-vibeui-block="faq-010"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-010"] [data-part="question"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq010Item[] = [
  {
    question: "Сколько стоит каталог?",
    answer:
      "Открытая часть бесплатна и для личных, и для коммерческих проектов. Платные наборы, если появятся, будут помечены отдельно ещё до установки.",
    popular: true,
  },
  {
    question: "Что именно я получаю после установки блока?",
    answer:
      "Один файл в вашем проекте — тот же, что вы видели в превью. Без сборки, обёрток и привязки к нашей теме: у блока своя палитра и ноль зависимостей.",
    popular: true,
  },
  {
    question: "Агент действительно ставит этот компонент, а не похожий?",
    answer:
      "Да. Copy for AI передаёт агенту идентификатор блока и команду установки, поэтому он скачивает настоящий файл из registry, а не пересоздаёт что-то по описанию.",
    popular: true,
  },
  {
    question: "Как перекрасить блок под свой бренд?",
    answer:
      "Переопределите локальные CSS-переменные в начале файла: цвета, акцент и радиусы лежат там. Остальную вёрстку трогать не нужно.",
  },
  {
    question: "Работают ли блоки с тёмной темой?",
    answer:
      "Да, палитра собрана на light-dark(): блок следует за темой страницы автоматически, без отдельной тёмной версии.",
  },
  {
    question: "Можно ли редактировать установленный файл?",
    answer:
      "Нужно: файл принадлежит вашему проекту. Меняйте контент и цвета свободно; раскладку и поведение на узких экранах лучше сохранить.",
  },
  {
    question: "Что делать, если блок отобразился неправильно?",
    answer:
      "Чаще всего у проекта не объявлен color-scheme: light dark на html — без него палитра остаётся светлой. Если дело не в этом, напишите нам и приложите скриншот.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Частые вопросы подняты наверх, раскрыты и помечены бейджем. */
export function Faq010({
  title = "Ответы, которые ищут чаще всего",
  badgeLabel = "Частый вопрос",
  restLabel = "Остальные вопросы",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Faq010Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const popular = items.filter((item) => item.popular)
  const rest = items.filter((item) => !item.popular)

  return (
    <>
      <style href="vibeui-faq-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          {popular.length > 0 ? (
            <div data-part="popular">
              {popular.map((item) => (
                <details key={item.question} data-part="item" open>
                  <summary data-part="question">
                    <span data-part="badge">{badgeLabel}</span>
                    <span>{item.question}</span>
                    <span data-part="sign" aria-hidden="true" />
                  </summary>
                  <p data-part="answer">{item.answer}</p>
                </details>
              ))}
            </div>
          ) : null}
          {rest.length > 0 ? (
            <>
              <h3 data-part="rest-label">{restLabel}</h3>
              <div data-part="rest">
                {rest.map((item) => (
                  <details key={item.question} data-part="item">
                    <summary data-part="question">
                      <span>{item.question}</span>
                      <span data-part="sign" aria-hidden="true" />
                    </summary>
                    <p data-part="answer">{item.answer}</p>
                  </details>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}
