import type { CSSProperties } from "react"
import { Card047 } from "@/registry/components/card/card-047/card-047"

export type Testimonials032Review = {
  quote: string
  name: string
  /** Бизнес и город: «Кофейня «Корка», Москва». */
  role: string
  /** Метрика моноширинным: «−38 % комиссий». */
  metric?: string
  metricLabel?: string
  /** Инициалы в кружке. Пусто — первая буква имени. */
  initials?: string
  /** Крупная карточка на две колонки. */
  featured?: boolean
}

export type Testimonials032Props = {
  eyebrow?: string
  title?: string
  lede?: string
  rating?: string
  ratingNote?: string
  reviews?: readonly Testimonials032Review[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы предпринимателей: стеклянные карточки с метрикой моноширинным
// сверху («−38 % комиссий»), цитатой и автором с инициалами; одна карточка
// крупнее и на две колонки. Карточки въезжают снизу по прокрутке через
// animation-timeline: view() под @supports — без поддержки просто видны.
// Справа от заголовка общий рейтинг. Серверный компонент, без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-032"]){
--vibeui-testimonials-032-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-032-on-accent:oklch(from var(--vibeui-testimonials-032-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-032-mint:color-mix(in oklab,var(--vibeui-testimonials-032-accent) 45%,#99f6e4);
--vibeui-testimonials-032-muted:color-mix(in oklab,var(--vibeui-testimonials-032-fg) 62%,var(--vibeui-testimonials-032-bg));
--vibeui-testimonials-032-line:color-mix(in oklab,var(--vibeui-testimonials-032-fg) 11%,transparent);
--vibeui-testimonials-032-glass:color-mix(in oklab,var(--vibeui-testimonials-032-fg) 5%,transparent);
--vibeui-testimonials-032-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-032-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-032-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-032"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-032"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-testimonials-032-bg);color:var(--vibeui-testimonials-032-fg);font-family:var(--vibeui-testimonials-032-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-032"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-032"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-032"] [data-part="head"]{display:grid;gap:1.4rem;margin:0 0 2.5rem}
[data-vibeui-block="testimonials-032"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-testimonials-032-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-testimonials-032-accent)}
[data-vibeui-block="testimonials-032"] [data-part="title"]{margin:0;max-width:34rem;font-family:var(--vibeui-testimonials-032-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="testimonials-032"] [data-part="lede"]{margin:1rem 0 0;max-width:32rem;color:var(--vibeui-testimonials-032-muted)}
[data-vibeui-block="testimonials-032"] [data-part="rating"]{display:flex;align-items:center;gap:1rem;padding:1rem 1.2rem;border-radius:1.1rem;background:var(--vibeui-testimonials-032-glass);border:1px solid var(--vibeui-testimonials-032-line);justify-self:start}
[data-vibeui-block="testimonials-032"] [data-part="rating"] strong{font-family:var(--vibeui-testimonials-032-mono);font-weight:600;font-size:2.2rem;line-height:1;letter-spacing:-.03em;color:var(--vibeui-testimonials-032-accent)}
[data-vibeui-block="testimonials-032"] [data-part="rating"] span{font-size:.82rem;color:var(--vibeui-testimonials-032-muted);max-width:12rem}
[data-vibeui-block="testimonials-032"] [data-part="stars"]{display:flex;gap:.15rem;margin:0 0 .3rem;color:var(--vibeui-testimonials-032-accent)}
[data-vibeui-block="testimonials-032"] [data-part="stars"] svg{width:.85rem;height:.85rem}
[data-vibeui-block="testimonials-032"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
@supports (animation-timeline: view()){}
@keyframes vibeui-testimonials-032-rise{from{opacity:0;transform:translateY(2.5rem)}to{opacity:1;transform:translateY(0)}}
@container (min-width: 44rem){[data-vibeui-block="testimonials-032"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="testimonials-032"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}[data-vibeui-block="testimonials-032"] [data-part="rating"]{justify-self:end}[data-vibeui-block="testimonials-032"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-032"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Testimonials032Review[] = [
  { quote: "Раньше по пятницам я два часа гоняла платёжки между банком и 1С. Теперь выписка подтягивается сама, а налог на УСН уже посчитан, когда я о нём вспоминаю.", name: "Ольга Мещерякова", role: "Кофейня «Корка», Москва", metric: "−2 ч", metricLabel: "каждую пятницу", initials: "ОМ", featured: true },
  { quote: "Переводы поставщикам по СБП без комиссии — на нашем обороте это реальные деньги. Посчитали за год: 140 тысяч остались в бизнесе.", name: "Тимур Гареев", role: "Оптовая база «Прим», Казань", metric: "140 000 ₽", metricLabel: "сэкономлено за год", initials: "ТГ" },
  { quote: "Выплаты с Ozon и Wildberries падают на счёт день в день, а не «в течение трёх рабочих». Для нас это оборот, а не удобство.", name: "Марина Лихачёва", role: "Бренд одежды «Север», Екатеринбург", metric: "день в день", metricLabel: "выплаты маркетплейсов", initials: "МЛ" },
  { quote: "Открыл счёт в такси по дороге на встречу. Курьер привёз карту на следующий день. Всё.", name: "Илья Сорокин", role: "ИП, ремонт техники, Тула", metric: "10 мин", metricLabel: "на открытие счёта", initials: "ИС" },
  { quote: "Карты сотрудникам с лимитами по категориям закрыли вечную проблему «а на что ушли восемь тысяч». Теперь видно в приложении, без чеков в чате.", name: "Дарья Немцова", role: "Студия дизайна «Лист», Санкт-Петербург", metric: "12", metricLabel: "карт сотрудников", initials: "ДН" },
]

/** Отзывы предпринимателей с метриками и появлением по прокрутке. */
export function Testimonials032({
  eyebrow = "Отзывы",
  title = "Предприниматели считают лучше маркетологов",
  lede = "Мы не просим оставить отзыв — пишут сами, когда экономия становится заметной в цифрах. Вот несколько с разрешения авторов.",
  rating = "4,9",
  ratingNote = "по 2 340 оценкам в RuStore и App Store",
  reviews = DEFAULT_REVIEWS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials032Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-032-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-032-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-032-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-032" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-032" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {rating ? (
              <div data-part="rating">
                <strong>{rating}</strong>
                <span>
                  <span data-part="stars" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <svg key={index} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.5l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.5 6 20.8l1.3-6.7-5-4.6 6.8-.8z" />
                      </svg>
                    ))}
                  </span>
                  {ratingNote}
                </span>
              </div>
            ) : null}
          </div>
          <ul data-part="grid">
            {reviews.map((review) => (
              <Card047 key={review.name} data-part="item" name={review.name} featured={review.featured} metric={review.metric} metricLabel={review.metricLabel} quote={review.quote} initials={review.initials} role={review.role} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
