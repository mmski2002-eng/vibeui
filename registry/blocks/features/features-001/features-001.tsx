import type { CSSProperties } from "react"

type Features001Action = {
  label: string
  href: string
}

type Features001Feature = {
  title: string
  description: string
}

export type Features001Props = {
  eyebrow?: string
  title?: string
  titleAccent?: string
  description?: string
  action?: Features001Action
  primaryFeature?: Features001Feature
  features?: Features001Feature[]
  accent?: string
  accentForeground?: string
  className?: string
}

// Весь CSS блока живёт здесь, а не в globals.css проекта: палитра, раскладка
// и keyframes. Переменные объявлены в :where() с нулевой специфичностью,
// поэтому пользователь переопределяет их чем угодно.
//
// Тон: плоский графит с низкой цветностью. Ни свечения, ни градиентных пятен,
// ни теней — глубина строится контрастом панели и фона плюс волосяные линии.
//
// container-type делает блок собственным query-контейнером: раскладка и размер
// шрифта считаются от ширины блока, а не от ширины окна. Поэтому асимметричное
// тело видно и в миниатюре каталога, где блок рендерится в 1280px внутри
// узкого окна. Правила раскладки — плоским CSS, а не Tailwind-вариантами, чтобы
// блок не зависел от версии Tailwind в чужом проекте; специфичность (0,2,0)
// выше утилит.
const STYLES = `
:where([data-vibeui-block="features-001"]){
--vibeui-features-001-bg:oklch(0.19 0 260);
--vibeui-features-001-panel:oklch(0.23 0 260);
--vibeui-features-001-fg:oklch(0.97 0 260);
--vibeui-features-001-muted:oklch(0.72 0 260);
--vibeui-features-001-border:oklch(1 0 0 / 12%);
--vibeui-features-001-accent:oklch(0.78 0.14 39.8);
--vibeui-features-001-accent-fg:oklch(0.2 0.03 175);
--vibeui-features-001-accent-soft:color-mix(in oklab, var(--vibeui-features-001-accent) 16%, transparent);
--vibeui-features-001-ring:color-mix(in oklab, var(--vibeui-features-001-accent) 70%, transparent);
--vibeui-features-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="features-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
container-type:inline-size;
}
@container (min-width:40rem){
[data-vibeui-block="features-001"] [data-part="frame"]{min-height:620px;padding-left:2.5rem;padding-right:2.5rem}
[data-vibeui-block="features-001"] [data-part="header"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}
[data-vibeui-block="features-001"] [data-part="action"]{justify-self:end}
}
@container (min-width:64rem){
[data-vibeui-block="features-001"] [data-part="frame"]{min-height:680px;padding-top:4rem;padding-bottom:4rem}
[data-vibeui-block="features-001"] [data-part="body"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:3rem}
}
@container (min-width:80rem){
[data-vibeui-block="features-001"] [data-part="frame"]{min-height:720px;padding-left:4rem;padding-right:4rem}
[data-vibeui-block="features-001"] [data-part="inner"]{max-width:1200px;margin-inline:auto}
[data-vibeui-block="features-001"] [data-part="body"]{gap:4rem}
}
@keyframes vibeui-features-001-fade-up{from{opacity:0;transform:translate3d(0,10px,0)}to{opacity:1;transform:none}}
@keyframes vibeui-features-001-rule{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-001"] *{animation:none!important;transition:none!important}}
`

const ENTER =
  "animate-[vibeui-features-001-fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"

const RULE =
  "origin-left animate-[vibeui-features-001-rule_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"

// Стагер второстепенных возможностей: индекс строки задаёт задержку.
const ROW_DELAYS = [
  "[animation-delay:160ms]",
  "[animation-delay:220ms]",
  "[animation-delay:280ms]",
]

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Абстрактная геометрия: слои и связь между ними. Это иллюстрация, а не
// интерфейс — здесь намеренно нет ни шапки окна, ни кнопок, ни осей графика.
function LayerDiagram() {
  return (
    <svg
      viewBox="0 0 460 160"
      preserveAspectRatio="xMinYMid meet"
      className="mt-8 h-[clamp(6.5rem,12cqi,9rem)] w-full"
      role="presentation"
    >
      <g
        stroke="var(--vibeui-features-001-border)"
        fill="var(--vibeui-features-001-accent-soft)"
      >
        <rect x="180" y="8" width="250" height="40" rx="8" opacity="0.45" />
        <rect x="120" y="60" width="250" height="40" rx="8" opacity="0.7" />
        <rect x="60" y="112" width="250" height="40" rx="8" />
      </g>
      <path
        d="M164 28 H100 V132"
        fill="none"
        stroke="var(--vibeui-features-001-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="164"
        cy="28"
        r="3.5"
        fill="var(--vibeui-features-001-accent)"
      />
      <circle
        cx="100"
        cy="132"
        r="3.5"
        fill="var(--vibeui-features-001-accent)"
      />
    </svg>
  )
}

export function Features001({
  eyebrow = "Возможности",
  title = "Всё, что начинается после первого",
  titleAccent = "деплоя",
  description = "Неприметная половина работы — наблюдаемость, откаты, доступы — сделана до того, как она понадобится.",
  action = { label: "Смотреть весь список", href: "#" },
  primaryFeature = {
    title: "Окружения слоями",
    description:
      "Превью, стейджинг и продакшен живут на одном конфиге и расходятся намеренно, а не случайно.",
  },
  features = [
    {
      title: "Мгновенный откат",
      description: "Любой деплой возвращается к прошлой сборке одним шагом.",
    },
    {
      title: "Раздельный доступ",
      description: "Роли по окружениям, без общих продакшен-ключей.",
    },
    {
      title: "Журнал изменений",
      description: "У каждого изменения есть автор, причина и время.",
    },
  ],
  accent,
  accentForeground,
  className,
}: Features001Props) {
  const style = {
    ...(accent ? { "--vibeui-features-001-accent": accent } : {}),
    ...(accentForeground
      ? { "--vibeui-features-001-accent-fg": accentForeground }
      : {}),
  } as CSSProperties

  return (
    <section
      data-vibeui-block="features-001"
      style={style}
      className={cx(
        "relative isolate overflow-hidden bg-[var(--vibeui-features-001-bg)] font-[family-name:var(--vibeui-features-001-font)] text-[var(--vibeui-features-001-fg)] antialiased",
        className,
      )}
    >
      <style href="vibeui-features-001" precedence="medium">
        {STYLES}
      </style>

      {/* Отступы и высота живут на внутреннем слое: container-запросы читают
          ширину секции, а сама секция своим контейнером быть не может. */}
      <div
        data-part="frame"
        className="flex min-h-[560px] items-center px-6 py-12"
      >
        <div data-part="inner" className="w-full">
          <header data-part="header" className="grid gap-6">
            <div className={ENTER}>
              {eyebrow ? (
                <p className="flex items-center gap-3 text-[0.75rem] font-medium tracking-[0.09em] text-[var(--vibeui-features-001-accent)] uppercase">
                  <span
                    aria-hidden="true"
                    className={cx(
                      RULE,
                      "h-px w-8 bg-[var(--vibeui-features-001-accent)]",
                    )}
                  />
                  {eyebrow}
                </p>
              ) : null}

              <h2 className="mt-5 max-w-[22ch] text-[clamp(1.875rem,3.4cqi,2.75rem)] leading-[1.1] font-semibold tracking-tight text-balance break-words">
                {title}
                {titleAccent ? (
                  <>
                    {" "}
                    <span className="text-[var(--vibeui-features-001-accent)]">
                      {titleAccent}
                    </span>
                  </>
                ) : null}
              </h2>

              {description ? (
                <p className="mt-4 max-w-[38rem] text-[clamp(1rem,1.25cqi,1.0625rem)] leading-relaxed text-pretty break-words text-[var(--vibeui-features-001-muted)]">
                  {description}
                </p>
              ) : null}
            </div>

            {action ? (
              <a
                data-part="action"
                href={action.href}
                className={cx(
                  ENTER,
                  "group inline-flex items-center gap-2 self-start text-[0.875rem] font-medium text-[var(--vibeui-features-001-accent)] transition-opacity duration-150 [animation-delay:60ms] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--vibeui-features-001-ring)]",
                )}
              >
                {action.label}
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
          </header>

          <div
            aria-hidden="true"
            className={cx(
              RULE,
              "mt-8 h-px w-full bg-[var(--vibeui-features-001-border)] [animation-delay:90ms]",
            )}
          />

          <div data-part="body" className="mt-8 grid gap-8">
            {primaryFeature ? (
              <article
                data-part="primary"
                className={cx(
                  ENTER,
                  "rounded-[10px] border border-[var(--vibeui-features-001-border)] bg-[var(--vibeui-features-001-panel)] p-6 [animation-delay:90ms]",
                )}
              >
                <h3 className="text-[1.25rem] font-medium">
                  {primaryFeature.title}
                </h3>
                <p className="mt-3 max-w-[34rem] text-[0.9375rem] leading-relaxed text-pretty text-[var(--vibeui-features-001-muted)]">
                  {primaryFeature.description}
                </p>
                <LayerDiagram />
              </article>
            ) : null}

            {features.length > 0 ? (
              <ul
                data-part="secondary"
                className="flex flex-col justify-center"
              >
                {features.slice(0, 3).map((feature, index) => (
                  <li
                    key={feature.title}
                    className={cx(
                      ENTER,
                      ROW_DELAYS[index],
                      "flex gap-4 py-5",
                      index > 0 &&
                        "border-t border-[var(--vibeui-features-001-border)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pt-1 text-[0.75rem] text-[var(--vibeui-features-001-accent)] tabular-nums"
                    >
                      0{index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[1rem] font-medium">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-pretty break-words text-[var(--vibeui-features-001-muted)]">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
