import type { CSSProperties } from "react"

export type Testimonials034Review = {
  /** Ник разработчика: «@lena_dev». */
  handle: string
  name: string
  role: string
  text: string
  /** Стек чипами: «Next.js», «Go». */
  stack?: readonly string[]
  /** Подпись-метрика внизу: «−70 % к ошибкам адреса». */
  metric?: string
}

export type Testimonials034Props = {
  eyebrow?: string
  title?: string
  lede?: string
  reviews?: readonly Testimonials034Review[]
  stackLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы разработчиков карточками-«комментариями» как в трекере: квадратная
// монограмма из инициалов, ник моноширинным и роль, цитата, чипы стека и
// строка-метрика с промптом «$». Сетка из трёх колонок с чередованием
// вертикального смещения, по наведению карточка получает свечение акцента
// и рамку. Фон — сетка точек. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-034"]){
--vibeui-testimonials-034-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-034-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-034-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-034-on-accent:oklch(from var(--vibeui-testimonials-034-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-034-muted:color-mix(in oklab,var(--vibeui-testimonials-034-fg) 60%,var(--vibeui-testimonials-034-bg));
--vibeui-testimonials-034-line:color-mix(in oklab,var(--vibeui-testimonials-034-fg) 12%,transparent);
--vibeui-testimonials-034-panel:color-mix(in oklab,var(--vibeui-testimonials-034-fg) 4%,var(--vibeui-testimonials-034-bg));
--vibeui-testimonials-034-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-034-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-034"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-034"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-034"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-034"]{box-sizing:border-box;position:relative;padding:5rem 0;background-color:var(--vibeui-testimonials-034-bg);background-image:radial-gradient(color-mix(in oklab,var(--vibeui-testimonials-034-fg) 12%,transparent) 1px,transparent 1.5px);background-size:24px 24px;color:var(--vibeui-testimonials-034-fg);font-family:var(--vibeui-testimonials-034-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-034"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-034"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-034"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="testimonials-034"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-testimonials-034-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-testimonials-034-accent)}
[data-vibeui-block="testimonials-034"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="testimonials-034"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="testimonials-034"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-testimonials-034-muted)}
[data-vibeui-block="testimonials-034"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-034"] [data-part="card"]{display:grid;gap:.9rem;padding:1.2rem;border:1px solid var(--vibeui-testimonials-034-line);border-radius:1rem;background:var(--vibeui-testimonials-034-bg);transition:border-color .3s,box-shadow .3s,transform .3s}
[data-vibeui-block="testimonials-034"] [data-part="card"]:hover{border-color:color-mix(in oklab,var(--vibeui-testimonials-034-accent) 55%,transparent);box-shadow:0 0 50px -20px var(--vibeui-testimonials-034-accent);transform:translateY(-3px)}
[data-vibeui-block="testimonials-034"] [data-part="who"]{display:grid;grid-template-columns:auto 1fr;gap:.7rem;align-items:center}
[data-vibeui-block="testimonials-034"] [data-part="avatar"]{display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:.55rem;background:color-mix(in oklab,var(--vibeui-testimonials-034-accent) 16%,transparent);color:var(--vibeui-testimonials-034-accent);font-family:var(--vibeui-testimonials-034-mono);font-weight:600;font-size:.8rem}
[data-vibeui-block="testimonials-034"] [data-part="handle"]{font-family:var(--vibeui-testimonials-034-mono);font-size:.82rem;font-weight:600}
[data-vibeui-block="testimonials-034"] [data-part="role"]{font-size:.76rem;color:var(--vibeui-testimonials-034-muted)}
[data-vibeui-block="testimonials-034"] [data-part="quote"]{margin:0;font-size:.98rem;line-height:1.55}
[data-vibeui-block="testimonials-034"] [data-part="quote"]::before{content:"“";color:var(--vibeui-testimonials-034-accent);margin-right:.1em}
[data-vibeui-block="testimonials-034"] [data-part="quote"]::after{content:"”";color:var(--vibeui-testimonials-034-accent);margin-left:.1em}
[data-vibeui-block="testimonials-034"] [data-part="stack"]{display:flex;flex-wrap:wrap;gap:.3rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-034"] [data-part="stack"] li{padding:.15rem .5rem;border:1px solid var(--vibeui-testimonials-034-line);border-radius:.35rem;font-family:var(--vibeui-testimonials-034-mono);font-size:.66rem;color:var(--vibeui-testimonials-034-muted)}
[data-vibeui-block="testimonials-034"] [data-part="metric"]{margin:0;padding-top:.8rem;border-top:1px dashed var(--vibeui-testimonials-034-line);font-family:var(--vibeui-testimonials-034-mono);font-size:.76rem;color:var(--vibeui-testimonials-034-accent)}
[data-vibeui-block="testimonials-034"] [data-part="metric"]::before{content:"$ ";color:var(--vibeui-testimonials-034-muted)}
@container (min-width: 44rem){[data-vibeui-block="testimonials-034"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="testimonials-034"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}[data-vibeui-block="testimonials-034"] [data-part="card"]:nth-child(3n+2){transform:translateY(1.5rem)}[data-vibeui-block="testimonials-034"] [data-part="card"]:nth-child(3n+2):hover{transform:translateY(calc(1.5rem - 3px))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-034"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Testimonials034Review[] = [
  { handle: "@lena_builds", name: "Лена Гусева", role: "Tech lead, доставка еды", text: "Переехали с самописного геокодера за один спринт. Точность до дома выросла, а курьеры перестали звонить «где это». SDK на TypeScript типизирован до последнего поля.", stack: ["Next.js", "TypeScript"], metric: "−70 % звонков курьеров" },
  { handle: "@mzhukov", name: "Максим Жуков", role: "Backend, логистика", text: "Матрица на 100 × 100 отвечает быстрее, чем наша база успевает записать результат. Батч на миллион адресов запустил вечером — утром был CSV.", stack: ["Go", "PostgreSQL"], metric: "1 000 000 адресов за 12 мин" },
  { handle: "@a.petrova", name: "Аня Петрова", role: "Frontend, e-commerce", text: "Подсказки адресов в форме заказа — двадцать строк кода. Клиенты стали дописывать адрес втрое реже, потому что он подставляется сам.", stack: ["React", "Vite"], metric: "+11 % завершённых заказов" },
  { handle: "@d_orlov", name: "Дима Орлов", role: "CTO, такси в регионах", text: "Регион Алматы появился, когда мы туда выходили — попросили в поддержке, через месяц был. Ни одного простоя за год, статус-панель честная.", stack: ["Python", "FastAPI"], metric: "99,99 % за 12 месяцев" },
  { handle: "@katya.ops", name: "Катя Мельник", role: "DevOps", text: "Лимиты, алерты и счета в одном кабинете. Когда трафик на распродаже вырос в шесть раз, ничего не упало и никто не позвонил — просто счёт стал больше.", stack: ["Kubernetes", "Grafana"], metric: "×6 трафика без деградации" },
  { handle: "@sergey_v", name: "Сергей Волков", role: "Индивидуальный разработчик", text: "Десяти тысяч бесплатных хватает на пет-проект с запасом. Ключ выдали за полминуты, карту не просили. Документация — с примерами на четырёх языках.", stack: ["Node.js"], metric: "0 ₽ уже восемь месяцев" },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/** Отзывы разработчиков карточками-комментариями с чипами стека. */
export function Testimonials034({
  eyebrow = "Отзывы",
  title = "Что говорят те, кто уже подключил",
  lede = "Без ретуши: разработчики из доставки, логистики, такси и e-commerce. Метрики — их, не наши.",
  reviews = DEFAULT_REVIEWS,
  stackLabel = "Стек",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials034Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-034-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-034-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-034-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-034" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-034" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {reviews.map((review) => (
              <li key={review.handle} data-part="card">
                <div data-part="who">
                  <span data-part="avatar" aria-hidden="true">
                    {initials(review.name)}
                  </span>
                  <div>
                    <div data-part="handle">{review.handle}</div>
                    <div data-part="role">
                      {review.name} · {review.role}
                    </div>
                  </div>
                </div>
                <blockquote data-part="quote">{review.text}</blockquote>
                {review.stack && review.stack.length > 0 ? (
                  <ul data-part="stack" aria-label={stackLabel}>
                    {review.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {review.metric ? <p data-part="metric">{review.metric}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
