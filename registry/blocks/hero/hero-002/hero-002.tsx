import type { CSSProperties } from "react"

type Hero002Action = {
  label: string
  href: string
}

type Hero002Metric = {
  label: string
  value: string
  delta?: string
}

export type Hero002Props = {
  eyebrow?: string
  title?: string
  titleAccent?: string
  description?: string
  primaryAction?: Hero002Action
  secondaryAction?: Hero002Action
  proof?: string
  panelTitle?: string
  metrics?: Hero002Metric[]
  /** Подпись плавающего чипа под окном: компонент несёт русскую. */
  chipLabel?: string
  accent?: string
  accentForeground?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
}

// Весь CSS блока живёт здесь, а не в globals.css проекта: палитра, раскладка,
// декоративные слои, тени и keyframes. Переменные объявлены в :where() с нулевой
// специфичностью, поэтому пользователь переопределяет их чем угодно.
//
// container-type делает блок собственным query-контейнером: раскладка и размер
// шрифта считаются от ширины блока, а не от ширины окна. Поэтому split виден и
// в миниатюре каталога, где блок рендерится в 1280px внутри узкого окна.
// Правила раскладки — плоским CSS, а не Tailwind-вариантами, чтобы блок не
// зависел от версии Tailwind в чужом проекте; специфичность (0,2,0) выше утилит.
const STYLES = `
:where([data-vibeui-block="hero-002"]){
--vibeui-hero-002-bg:transparent;
--vibeui-hero-002-panel:light-dark(oklch(1 0 0),oklch(0.235 0.012 260));
--vibeui-hero-002-panel-alt:light-dark(oklch(0.974 0.004 255),oklch(0.28 0.013 260));
--vibeui-hero-002-fg:light-dark(oklch(0.21 0.02 260),oklch(0.96 0.004 260));
--vibeui-hero-002-muted:light-dark(oklch(0.52 0.015 260),oklch(0.72 0.014 260));
--vibeui-hero-002-border:light-dark(oklch(0.9 0.008 260),oklch(0.37 0.012 260));
--vibeui-hero-002-accent:light-dark(oklch(0.48 0.17 262),oklch(0.73 0.155 262));
--vibeui-hero-002-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.022 262));
--vibeui-hero-002-positive:light-dark(oklch(0.45 0.12 155),oklch(0.78 0.14 155));
--vibeui-hero-002-ring:color-mix(in oklab, var(--vibeui-hero-002-accent) 70%, transparent);
--vibeui-hero-002-shadow:light-dark(oklch(0.21 0.02 260 / 16%),oklch(0 0 0 / 46%));
--vibeui-hero-002-dot:light-dark(oklch(0.21 0.02 260 / 7%),oklch(1 0 0 / 8%));
--vibeui-hero-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-002"]{color-scheme:dark}
[data-vibeui-block="hero-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
container-type:inline-size;
}
[data-vibeui-block="hero-002"] [data-part="glow"]{position:absolute;top:-33%;right:0;width:66%;height:66%;pointer-events:none;background:radial-gradient(50% 50% at 70% 60%,color-mix(in oklab,var(--vibeui-hero-002-accent) 14%,transparent),transparent 72%)}
[data-vibeui-block="hero-002"] [data-part="dots"]{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(var(--vibeui-hero-002-dot) 1px,transparent 1px);background-size:20px 20px;-webkit-mask-image:radial-gradient(80% 60% at 30% 40%,black,transparent 100%);mask-image:radial-gradient(80% 60% at 30% 40%,black,transparent 100%)}
[data-vibeui-block="hero-002"] [data-part="window"]{box-shadow:0 30px 60px -30px var(--vibeui-hero-002-shadow)}
[data-vibeui-block="hero-002"] [data-part="chip"]{box-shadow:0 12px 28px -16px var(--vibeui-hero-002-shadow)}
[data-vibeui-block="hero-002"] [data-part="cta-primary"]{box-shadow:0 8px 20px -10px color-mix(in oklab,var(--vibeui-hero-002-accent) 70%,transparent)}
@container (min-width:40rem){
[data-vibeui-block="hero-002"] [data-part="frame"]{min-height:600px;padding-left:2.5rem;padding-right:2.5rem}
[data-vibeui-block="hero-002"] [data-part="actions"]{width:auto;flex-direction:row}
[data-vibeui-block="hero-002"] [data-part="metrics"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="hero-002"] [data-part="activity"]{display:grid}
[data-vibeui-block="hero-002"] [data-part="rail"]{display:flex}
}
@container (min-width:64rem){
[data-vibeui-block="hero-002"] [data-part="frame"]{min-height:680px;padding-top:5rem;padding-bottom:5rem}
[data-vibeui-block="hero-002"] [data-part="grid"]{grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);align-items:center;gap:3.5rem}
}
@container (min-width:80rem){
[data-vibeui-block="hero-002"] [data-part="frame"]{min-height:720px;padding-left:4rem;padding-right:4rem}
[data-vibeui-block="hero-002"] [data-part="grid"]{max-width:1200px;margin-inline:auto;gap:4.5rem}
}
@keyframes vibeui-hero-002-fade-up{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-002-fade-in{from{opacity:0;transform:translate3d(16px,0,0) scale(0.985)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-002-draw{from{stroke-dashoffset:420}to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-002"] *{animation:none!important;transition:none!important}}
`

const ENTER =
  "animate-[vibeui-hero-002-fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"

const ACTION_BASE =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[0.9375rem] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vibeui-hero-002-ring)]"

const SURFACE =
  "border border-[var(--vibeui-hero-002-border)] bg-[var(--vibeui-hero-002-panel)]"

// Заливка плейсхолдеров внутри mockup. Радиус задаётся на месте: у rail это
// скруглённые квадраты, у полос и точек — капсулы.
const FILL = "bg-[var(--vibeui-hero-002-border)]"

// Декоративные аватары: без имён и лиц, только градиентные заливки.
const AVATARS = [
  "linear-gradient(140deg,color-mix(in oklab,var(--vibeui-hero-002-accent) 55%,white),var(--vibeui-hero-002-accent))",
  "linear-gradient(140deg,oklch(0.76 0.1 205),oklch(0.56 0.12 215))",
  "linear-gradient(140deg,oklch(0.8 0.09 80),oklch(0.63 0.12 55))",
  "linear-gradient(140deg,oklch(0.77 0.09 330),oklch(0.57 0.14 315))",
]

const ACTIVITY_ROWS = [
  { width: "72%", tail: "18%" },
  { width: "58%", tail: "24%" },
  { width: "66%", tail: "14%" },
]

const CHART_LINE =
  "M0 92 L32 84 L64 96 L96 70 L128 78 L160 54 L192 62 L224 38 L256 46 L288 24 L320 16"

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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

function MetricTile({ label, value, delta }: Hero002Metric) {
  return (
    <div className="rounded-xl border border-[var(--vibeui-hero-002-border)] bg-[var(--vibeui-hero-002-panel-alt)] p-4">
      <p className="text-[0.75rem] font-medium tracking-wide text-[var(--vibeui-hero-002-muted)] uppercase">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[1.75rem] leading-none font-semibold tabular-nums">
          {value}
        </span>
        {delta ? (
          <span className="rounded-md bg-[color-mix(in_oklab,var(--vibeui-hero-002-positive)_14%,transparent)] px-1.5 py-0.5 text-[0.75rem] font-medium text-[var(--vibeui-hero-002-positive)]">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  )
}

// preserveAspectRatio="none" растягивает путь на всю ширину панели, а
// vector-effect держит толщину линии постоянной, поэтому растяжение не искажает
// штрих. Путь фиксированный: это иллюстрация, а не данные.
function Sparkline() {
  return (
    <svg
      viewBox="0 0 320 120"
      preserveAspectRatio="none"
      className="h-40 w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="vibeui-hero-002-fill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--vibeui-hero-002-accent)"
            stopOpacity="0.22"
          />
          <stop
            offset="100%"
            stopColor="var(--vibeui-hero-002-accent)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <line
        x1="0"
        y1="108"
        x2="320"
        y2="108"
        stroke="var(--vibeui-hero-002-border)"
        strokeDasharray="3 5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`${CHART_LINE} L320 120 L0 120 Z`}
        fill="url(#vibeui-hero-002-fill)"
      />
      <path
        d={CHART_LINE}
        fill="none"
        stroke="var(--vibeui-hero-002-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ strokeDasharray: 420, strokeDashoffset: 0 }}
        className="animate-[vibeui-hero-002-draw_0.9s_ease-out_0.52s_both]"
      />
    </svg>
  )
}

// Визуализация продукта — иллюстрация, а не интерфейс: вызывается внутри
// aria-hidden обёртки и не содержит ни ссылок, ни фокусируемых элементов.
function ProductWindow({
  panelTitle,
  metrics,
}: {
  panelTitle?: string
  metrics: Hero002Metric[]
}) {
  return (
    <div
      data-part="window"
      className={cx("overflow-hidden rounded-2xl", SURFACE)}
    >
      <div className="flex items-center gap-3 border-b border-[var(--vibeui-hero-002-border)] px-4 py-3">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className={cx("size-2 rounded-full", FILL)} />
          ))}
        </span>
        <span className="text-[0.8125rem] font-medium">{panelTitle}</span>
        <span className={cx("ml-auto h-2.5 w-10 rounded-full", FILL)} />
      </div>

      <div className="flex">
        <div
          data-part="rail"
          className="hidden shrink-0 flex-col gap-3 border-r border-[var(--vibeui-hero-002-border)] bg-[var(--vibeui-hero-002-panel-alt)] p-4"
        >
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className={cx(
                "size-5 rounded-md",
                item === 0
                  ? "bg-[color-mix(in_oklab,var(--vibeui-hero-002-accent)_35%,transparent)]"
                  : FILL,
              )}
            />
          ))}
        </div>

        <div className="min-w-0 flex-1 p-4">
          <div data-part="metrics" className="grid grid-cols-1 gap-3">
            {metrics.slice(0, 2).map((metric) => (
              <MetricTile key={metric.label} {...metric} />
            ))}
          </div>

          <div className="mt-4">
            <Sparkline />
          </div>

          <div data-part="activity" className="mt-4 hidden gap-3">
            {ACTIVITY_ROWS.map((row) => (
              <div key={row.width} className="flex items-center gap-3">
                <span className={cx("size-6 shrink-0 rounded-full", FILL)} />
                <span
                  className={cx("h-2 rounded-full", FILL)}
                  style={{ width: row.width }}
                />
                <span
                  className={cx("h-2 rounded-full", FILL)}
                  style={{ width: row.tail }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero002({
  eyebrow = "Новое · Аналитика 2.0",
  title = "Каждая метрика, по которой",
  titleAccent = "команда правда действует",
  description = "Одно пространство для продуктовой аналитики, оповещений и отчётов — без участия дата-команды.",
  primaryAction = { label: "Начать бесплатно", href: "#" },
  secondaryAction = { label: "Записаться на демо", href: "#" },
  proof = "Нам доверяют 2000+ продуктовых команд",
  panelTitle = "Обзор",
  metrics = [
    { label: "Активные пользователи", value: "24 918", delta: "+12,4%" },
    { label: "Удержание", value: "68,2%", delta: "+3,1%" },
  ],
  chipLabel = "+18,2% MRR",
  accent,
  accentForeground,
  background = "",
  className,
}: Hero002Props) {
  const style = {
    ...(accent ? { "--vibeui-hero-002-accent": accent } : {}),
    ...(accentForeground
      ? { "--vibeui-hero-002-accent-fg": accentForeground }
      : {}),
    ...(background
      ? {
          "--vibeui-hero-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : {}),
  } as CSSProperties

  return (
    <section
      data-vibeui-block="hero-002"
      style={style}
      className={cx(
        "relative isolate overflow-hidden bg-[var(--vibeui-hero-002-bg)] font-[family-name:var(--vibeui-hero-002-font)] text-[var(--vibeui-hero-002-fg)] antialiased",
        className,
      )}
    >
      <style href="vibeui-hero-002" precedence="medium">
        {STYLES}
      </style>

      <div aria-hidden="true" data-part="glow" />
      <div aria-hidden="true" data-part="dots" />

      {/* Отступы и высота живут на внутреннем слое: container-запросы читают
          ширину секции, а сама секция своим контейнером быть не может. */}
      <div
        data-part="frame"
        className="relative flex min-h-[560px] items-center px-6 py-16"
      >
        <div data-part="grid" className="grid w-full grid-cols-1 gap-10">
          <div>
            {eyebrow ? (
              <p
                className={cx(
                  ENTER,
                  SURFACE,
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.8125rem] font-medium text-[var(--vibeui-hero-002-muted)]",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-[var(--vibeui-hero-002-accent)]"
                />
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cx(
                ENTER,
                "mt-6 text-[clamp(2rem,4.1cqi,3.25rem)] leading-[1.06] font-semibold tracking-tight text-balance break-words [animation-delay:60ms]",
              )}
            >
              {title}
              {titleAccent ? (
                <>
                  {" "}
                  <span className="text-[var(--vibeui-hero-002-accent)]">
                    {titleAccent}
                  </span>
                </>
              ) : null}
            </h1>

            {description ? (
              <p
                className={cx(
                  ENTER,
                  "mt-5 max-w-[34rem] text-[clamp(1rem,1.35cqi,1.0625rem)] leading-relaxed text-pretty break-words text-[var(--vibeui-hero-002-muted)] [animation-delay:120ms]",
                )}
              >
                {description}
              </p>
            ) : null}

            <div
              data-part="actions"
              className={cx(
                ENTER,
                "mt-8 flex w-full max-w-full flex-col gap-3 [animation-delay:180ms]",
              )}
            >
              {primaryAction ? (
                <a
                  href={primaryAction.href}
                  data-part="cta-primary"
                  className={cx(
                    ACTION_BASE,
                    "bg-[var(--vibeui-hero-002-accent)] text-[var(--vibeui-hero-002-accent-fg)] transition-[filter,transform] duration-150 hover:-translate-y-px hover:brightness-110",
                  )}
                >
                  {primaryAction.label}
                </a>
              ) : null}

              {secondaryAction ? (
                <a
                  href={secondaryAction.href}
                  className={cx(
                    ACTION_BASE,
                    SURFACE,
                    "transition-colors duration-150 hover:bg-[var(--vibeui-hero-002-panel-alt)]",
                  )}
                >
                  {secondaryAction.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ) : null}
            </div>

            {proof ? (
              <div
                className={cx(
                  ENTER,
                  "mt-8 flex items-center gap-3 [animation-delay:240ms]",
                )}
              >
                <span aria-hidden="true" className="flex">
                  {AVATARS.map((background, index) => (
                    <span
                      key={background}
                      className={cx(
                        "size-7 rounded-full border-2 border-[var(--vibeui-hero-002-panel)]",
                        index > 0 && "-ml-2",
                      )}
                      style={{ background }}
                    />
                  ))}
                </span>
                <span className="text-[0.8125rem] text-[var(--vibeui-hero-002-muted)]">
                  {proof}
                </span>
              </div>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="relative animate-[vibeui-hero-002-fade-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:260ms]"
          >
            <ProductWindow panelTitle={panelTitle} metrics={metrics} />

            <div
              data-part="chip"
              className={cx(
                "absolute -bottom-6 left-5 flex items-center gap-2 rounded-xl px-3 py-2",
                SURFACE,
              )}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="size-4 text-[var(--vibeui-hero-002-positive)]"
              >
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[0.8125rem] font-semibold">
                {chipLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
