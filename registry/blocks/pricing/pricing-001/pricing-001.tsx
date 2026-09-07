import type { CSSProperties } from "react"

type Pricing001Action = {
  label: string
  href: string
}

type Pricing001Plan = {
  name: string
  description: string
  price: string
  period?: string
  features: string[]
  action: Pricing001Action
  featured?: boolean
}

export type Pricing001Props = {
  eyebrow?: string
  title?: string
  titleAccent?: string
  description?: string
  plans?: Pricing001Plan[]
  footnote?: string
  /** Подпись бейджа рекомендованного плана. */
  badgeLabel?: string
  accent?: string
  accentForeground?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  className?: string
}

// Весь CSS блока живёт здесь, а не в globals.css проекта: палитра, раскладка
// и keyframes. Переменные объявлены в :where() с нулевой специфичностью,
// поэтому пользователь переопределяет их чем угодно.
//
// Рекомендованный план — инвертированная панель: в светлой теме тёмная, в
// тёмной светлая. Это единственная «тяжёлая» поверхность в блоке: она и
// создаёт иерархию, поэтому у остальных планов нет ни теней, ни заливок.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у секции по умолчанию нет, она лежит на фоне страницы.
//
// container-type делает блок собственным query-контейнером: раскладка и размер
// шрифта считаются от ширины блока, а не от ширины окна. Поэтому три колонки
// видны и в миниатюре каталога, где блок рендерится в 1280px внутри узкого
// окна. Правила раскладки — плоским CSS, а не Tailwind-вариантами, чтобы блок
// не зависел от версии Tailwind в чужом проекте; специфичность (0,2,0) выше
// утилит.
const STYLES = `
:where([data-vibeui-block="pricing-001"]){
--vibeui-pricing-001-bg:transparent;
--vibeui-pricing-001-card:light-dark(oklch(1 0 0),oklch(0.215 0 285));
--vibeui-pricing-001-tint:light-dark(oklch(0.96 0 285),oklch(0.27 0 285));
--vibeui-pricing-001-ink:light-dark(oklch(0.2 0 285),oklch(0.95 0 285));
--vibeui-pricing-001-muted:light-dark(oklch(0.5 0 285),oklch(0.72 0 285));
--vibeui-pricing-001-border:light-dark(oklch(0.9 0 285),oklch(0.34 0 285));
--vibeui-pricing-001-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.74 0.16 39.8));
--vibeui-pricing-001-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-pricing-001-featured-bg:light-dark(oklch(0.2 0 285),oklch(0.95 0 285));
--vibeui-pricing-001-featured-fg:light-dark(oklch(0.98 0 285),oklch(0.2 0 285));
--vibeui-pricing-001-featured-muted:light-dark(oklch(0.74 0 285),oklch(0.45 0 285));
--vibeui-pricing-001-featured-border:light-dark(oklch(1 0 0 / 14%),oklch(0 0 0 / 12%));
--vibeui-pricing-001-ring:color-mix(in oklab, var(--vibeui-pricing-001-accent) 70%, transparent);
--vibeui-pricing-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-001"]{color-scheme:dark}
[data-vibeui-block="pricing-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
container-type:inline-size;
}
@container (min-width:48rem){
[data-vibeui-block="pricing-001"] [data-part="frame"]{min-height:660px;padding-left:2.5rem;padding-right:2.5rem}
[data-vibeui-block="pricing-001"] [data-part="plans"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="pricing-001"] [data-part="plan"][data-featured="true"]{margin-block:-1rem}
}
@container (min-width:80rem){
[data-vibeui-block="pricing-001"] [data-part="frame"]{min-height:720px;padding-left:4rem;padding-right:4rem;padding-top:4rem;padding-bottom:4rem}
[data-vibeui-block="pricing-001"] [data-part="inner"]{max-width:1120px;margin-inline:auto}
}
@keyframes vibeui-pricing-001-fade-up{from{opacity:0;transform:translate3d(0,12px,0)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-001"] *{animation:none!important;transition:none!important}}
`

const ENTER =
  "animate-[vibeui-pricing-001-fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"

const ACTION_BASE =
  "inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-[0.875rem] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vibeui-pricing-001-ring)]"

const PLAN_DELAYS = [
  "[animation-delay:90ms]",
  "[animation-delay:150ms]",
  "[animation-delay:210ms]",
]

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cx(
        "mt-0.5 size-4 shrink-0",
        featured
          ? "text-[var(--vibeui-pricing-001-featured-fg)]"
          : "text-[var(--vibeui-pricing-001-accent)]",
      )}
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
 * Единственная логика блока: какой план подсвечен. Первый с featured, иначе
 * средний. Никакого биллинга, тарифных расчётов и состояния — цены статичны.
 */
function resolveFeaturedIndex(plans: Pricing001Plan[]): number {
  const explicit = plans.findIndex((plan) => plan.featured)

  return explicit === -1 ? Math.floor((plans.length - 1) / 2) : explicit
}

export function Pricing001({
  eyebrow = "Тарифы",
  title = "Цена для команд, которые",
  titleAccent = "выпускают каждую неделю",
  description = "В каждый тариф входит вся библиотека компонентов. Платите за места и поддержку, а не за фичи.",
  plans = [
    {
      name: "Соло",
      description: "Для одного человека и пет-проектов.",
      price: "0 ₽",
      period: "навсегда",
      features: ["1 проект", "Поддержка сообщества", "Лицензия MIT"],
      action: { label: "Начать бесплатно", href: "#" },
    },
    {
      name: "Команда",
      description: "Для продуктовых команд с общим дизайн-языком.",
      price: "1 490 ₽",
      period: "за место / месяц",
      features: [
        "Неограниченно проектов",
        "Приоритетная поддержка",
        "Синхронизация дизайн-токенов",
        "Приватный реестр компонентов",
      ],
      action: { label: "14 дней бесплатно", href: "#" },
      featured: true,
    },
    {
      name: "Студия",
      description: "Для агентств с потоком клиентских проектов.",
      price: "4 900 ₽",
      period: "за место / месяц",
      features: ["Всё из «Команды»", "Передача клиенту", "SSO и журнал аудита"],
      action: { label: "Связаться с отделом продаж", href: "#" },
    },
  ],
  footnote = "Годовая оплата, смена тарифа в любой момент. Возврат 30 дней без вопросов.",
  badgeLabel = "Рекомендуем",
  accent,
  accentForeground,
  background = "",
  className,
}: Pricing001Props) {
  const style = {
    ...(accent ? { "--vibeui-pricing-001-accent": accent } : {}),
    ...(accentForeground
      ? { "--vibeui-pricing-001-accent-fg": accentForeground }
      : {}),
    ...(background
      ? {
          "--vibeui-pricing-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : {}),
  } as CSSProperties

  const visiblePlans = plans.slice(0, 3)
  const featuredIndex = resolveFeaturedIndex(visiblePlans)

  return (
    <section
      data-vibeui-block="pricing-001"
      style={style}
      className={cx(
        "relative isolate overflow-hidden bg-[var(--vibeui-pricing-001-bg)] font-[family-name:var(--vibeui-pricing-001-font)] text-[var(--vibeui-pricing-001-ink)] antialiased",
        className,
      )}
    >
      <style href="vibeui-pricing-001" precedence="medium">
        {STYLES}
      </style>

      {/* Отступы и высота живут на внутреннем слое: container-запросы читают
          ширину секции, а сама секция своим контейнером быть не может. */}
      <div
        data-part="frame"
        className="flex min-h-[560px] items-center px-5 py-12"
      >
        <div data-part="inner" className="w-full">
          <header className={cx(ENTER, "mx-auto max-w-[40rem] text-center")}>
            {eyebrow ? (
              <p className="text-[0.75rem] font-medium tracking-[0.09em] text-[var(--vibeui-pricing-001-accent)] uppercase">
                {eyebrow}
              </p>
            ) : null}

            <h2 className="mt-4 text-[clamp(1.75rem,3cqi,2.25rem)] leading-[1.12] font-semibold tracking-tight text-balance break-words">
              {title}
              {titleAccent ? (
                <>
                  {" "}
                  <span className="text-[var(--vibeui-pricing-001-accent)]">
                    {titleAccent}
                  </span>
                </>
              ) : null}
            </h2>

            {description ? (
              <p className="mt-3 text-[clamp(0.9375rem,1.15cqi,1rem)] leading-relaxed text-pretty break-words text-[var(--vibeui-pricing-001-muted)]">
                {description}
              </p>
            ) : null}
          </header>

          <ul data-part="plans" className="mt-8 grid items-stretch gap-4">
            {visiblePlans.map((plan, index) => {
              const featured = index === featuredIndex

              return (
                <li
                  key={plan.name}
                  data-part="plan"
                  data-featured={featured ? "true" : undefined}
                  className={cx(
                    ENTER,
                    PLAN_DELAYS[index],
                    "flex flex-col rounded-xl border p-6",
                    featured
                      ? "border-[var(--vibeui-pricing-001-featured-border)] bg-[var(--vibeui-pricing-001-featured-bg)] text-[var(--vibeui-pricing-001-featured-fg)]"
                      : "border-[var(--vibeui-pricing-001-border)] bg-[var(--vibeui-pricing-001-card)]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-[1rem] font-medium">{plan.name}</h3>
                    {featured && badgeLabel ? (
                      <span className="rounded-full bg-[var(--vibeui-pricing-001-accent)] px-2 py-0.5 text-[0.6875rem] font-medium text-[var(--vibeui-pricing-001-accent-fg)]">
                        {badgeLabel}
                      </span>
                    ) : null}
                  </div>

                  <p
                    className={cx(
                      "mt-2 text-[0.8125rem] leading-relaxed text-pretty",
                      featured
                        ? "text-[var(--vibeui-pricing-001-featured-muted)]"
                        : "text-[var(--vibeui-pricing-001-muted)]",
                    )}
                  >
                    {plan.description}
                  </p>

                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="text-[2.25rem] leading-none font-semibold tabular-nums">
                      {plan.price}
                    </span>
                    {plan.period ? (
                      <span
                        className={cx(
                          "text-[0.8125rem]",
                          featured
                            ? "text-[var(--vibeui-pricing-001-featured-muted)]"
                            : "text-[var(--vibeui-pricing-001-muted)]",
                        )}
                      >
                        {plan.period}
                      </span>
                    ) : null}
                  </p>

                  <a
                    href={plan.action.href}
                    className={cx(
                      ACTION_BASE,
                      "mt-5",
                      featured
                        ? "bg-[var(--vibeui-pricing-001-accent)] text-[var(--vibeui-pricing-001-accent-fg)] transition-[filter] duration-150 hover:brightness-110"
                        : "border border-[var(--vibeui-pricing-001-border)] transition-colors duration-150 hover:bg-[var(--vibeui-pricing-001-tint)]",
                    )}
                  >
                    {plan.action.label}
                  </a>

                  <ul className="mt-6 flex flex-col gap-2.5">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li
                        key={feature}
                        className={cx(
                          "flex gap-2.5 text-[0.8125rem]",
                          featured
                            ? "text-[var(--vibeui-pricing-001-featured-muted)]"
                            : "text-[var(--vibeui-pricing-001-muted)]",
                        )}
                      >
                        <CheckIcon featured={featured} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>

          {footnote ? (
            <p
              className={cx(
                ENTER,
                "mt-8 text-center text-[0.8125rem] text-[var(--vibeui-pricing-001-muted)] [animation-delay:270ms]",
              )}
            >
              {footnote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
