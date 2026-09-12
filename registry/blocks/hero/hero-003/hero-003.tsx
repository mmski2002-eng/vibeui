import type { CSSProperties } from "react"

type Hero003Action = {
  label: string
  href: string
}

type Hero003Stat = {
  value: string
  label: string
}

export type Hero003Props = {
  eyebrow?: string
  title?: string
  titleAccent?: string
  description?: string
  primaryAction?: Hero003Action
  secondaryAction?: Hero003Action
  stat?: Hero003Stat
  highlights?: string[]
  accentNote?: string
  accent?: string
  accentForeground?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
}

// Весь CSS блока живёт здесь, а не в globals.css проекта: палитра, раскладка
// мозаики, декоративный слой и keyframes. Переменные объявлены в :where()
// с нулевой специфичностью, поэтому пользователь переопределяет их чем угодно.
//
// Палитра: тёплая нейтральная база (низкая цветность, не песочная заливка),
// глубокие espresso-нейтральные чернила, холодный серо-голубой слой в границах
// и во второстепенных плитках — он не даёт композиции слипнуться в одну тёплую
// массу. Терракота работает точечно: одна залитая плитка и акценты, не фон.
//
// container-type делает блок собственным query-контейнером: раскладка и размер
// шрифта считаются от ширины блока, а не от ширины окна. Поэтому мозаика видна
// и в миниатюре каталога, где блок рендерится в 1280px внутри узкого окна.
// Правила раскладки — плоским CSS, а не Tailwind-вариантами, чтобы блок не
// зависел от версии Tailwind в чужом проекте; специфичность (0,2,0) выше утилит.
const STYLES = `
:where([data-vibeui-block="hero-003"]){
--vibeui-hero-003-bg:transparent;
--vibeui-hero-003-card:light-dark(oklch(0.995 0.002 70),oklch(0.235 0.008 55));
--vibeui-hero-003-card-alt:light-dark(oklch(0.953 0 250),oklch(0.285 0 250));
--vibeui-hero-003-ink:light-dark(oklch(0.21 0.012 55),oklch(0.95 0.006 70));
--vibeui-hero-003-muted:light-dark(oklch(0.5 0.012 55),oklch(0.73 0.01 70));
--vibeui-hero-003-border:light-dark(oklch(0.881 0 250),oklch(0.38 0 250));
--vibeui-hero-003-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-003-accent-fg:oklch(from var(--vibeui-hero-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-003-ring:color-mix(in oklab, var(--vibeui-hero-003-accent) 70%, transparent);
--vibeui-hero-003-serif:ui-serif,Georgia,"Times New Roman",Times,serif;
--vibeui-hero-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-003"]{color-scheme:dark}
:where([data-vibeui-block="hero-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
container-type:inline-size;
}
[data-vibeui-block="hero-003"] [data-part="hatch"]{position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(135deg,var(--vibeui-hero-003-border) 0 1px,transparent 1px 11px);opacity:.32;-webkit-mask-image:radial-gradient(70% 60% at 50% 45%,transparent,black);mask-image:radial-gradient(70% 60% at 50% 45%,transparent,black)}
[data-vibeui-block="hero-003"] [data-part="pattern"]{background-image:repeating-linear-gradient(135deg,var(--vibeui-hero-003-border) 0 1px,transparent 1px 10px)}
[data-vibeui-block="hero-003"] [data-part="cells"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;width:min(100%,7rem);aspect-ratio:1;
}
[data-vibeui-block="hero-003"] [data-part="cells"] span{
border-radius:0.25rem;background:color-mix(in oklab,var(--vibeui-hero-003-ink) 12%,transparent);
}
[data-vibeui-block="hero-003"] [data-part="cells"] span:nth-child(3n+2){
background:color-mix(in oklab,var(--vibeui-hero-003-accent) 55%,transparent);
}
[data-vibeui-block="hero-003"] [data-part="cells"] span:nth-child(5){
background:var(--vibeui-hero-003-accent);color:oklch(from var(--vibeui-hero-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="hero-003"] [data-part="stat"],
[data-vibeui-block="hero-003"] [data-part="accent"],
[data-vibeui-block="hero-003"] [data-part="panel"],
[data-vibeui-block="hero-003"] [data-part="pattern"]{
transition:transform .35s cubic-bezier(.32,.72,0,1),box-shadow .3s ease;
}
[data-vibeui-block="hero-003"] [data-part="stat"]:hover,
[data-vibeui-block="hero-003"] [data-part="accent"]:hover,
[data-vibeui-block="hero-003"] [data-part="panel"]:hover,
[data-vibeui-block="hero-003"] [data-part="pattern"]:hover{
transform:translateY(-0.25rem);
box-shadow:0 1rem 2.25rem color-mix(in oklab,#000000 22%,transparent);
}
[data-vibeui-block="hero-003"] [data-part="lead"]{grid-area:lead}
[data-vibeui-block="hero-003"] [data-part="stat"]{grid-area:stat}
[data-vibeui-block="hero-003"] [data-part="accent"]{grid-area:accent}
[data-vibeui-block="hero-003"] [data-part="panel"]{grid-area:panel}
[data-vibeui-block="hero-003"] [data-part="pattern"]{grid-area:pattern;display:none}
[data-vibeui-block="hero-003"] [data-part="grid"]{grid-template-columns:minmax(0,1fr);grid-template-areas:"lead" "stat" "panel" "accent"}
@container (min-width:40rem){
[data-vibeui-block="hero-003"] [data-part="frame"]{min-height:600px;padding-left:2rem;padding-right:2rem}
[data-vibeui-block="hero-003"] [data-part="actions"]{width:auto;flex-direction:row}
[data-vibeui-block="hero-003"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-areas:"lead lead" "stat accent" "panel panel"}
}
@container (min-width:64rem){
[data-vibeui-block="hero-003"] [data-part="frame"]{min-height:680px;padding-top:4rem;padding-bottom:4rem}
[data-vibeui-block="hero-003"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-areas:"lead lead lead stat" "accent panel panel pattern"}
[data-vibeui-block="hero-003"] [data-part="pattern"]{display:block}
}
@container (min-width:80rem){
[data-vibeui-block="hero-003"] [data-part="frame"]{min-height:720px;padding-left:4rem;padding-right:4rem}
[data-vibeui-block="hero-003"] [data-part="grid"]{max-width:1200px;margin-inline:auto;gap:1.25rem}
}
@keyframes vibeui-hero-003-tile-in{from{opacity:0;transform:translate3d(0,10px,0) scale(0.99)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-003"] *{animation:none!important;transition:none!important}}
`

const TILE_IN =
  "animate-[vibeui-hero-003-tile-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"

const TILE =
  "rounded-md border border-[var(--vibeui-hero-003-border)] bg-[var(--vibeui-hero-003-card)]"

const ACTION_BASE =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 text-[0.9375rem] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vibeui-hero-003-ring)]"

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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-0.5 size-4 shrink-0 text-[var(--vibeui-hero-003-accent)]"
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

export function Hero003({
  eyebrow = "Дизайн-система · v3",
  title = "Всё, что вы выпускаете,",
  titleAccent = "заслуживает формы",
  description = "Спокойная и убеждённая основа для команд, которым проще спроектировать один раз и переиспользовать всегда.",
  primaryAction = { label: "Начать", href: "#" },
  secondaryAction = { label: "Читать документацию", href: "#" },
  stat = { value: "12k+", label: "выпущенных компонентов" },
  highlights = [
    "Доступность по умолчанию",
    "Ноль зависимостей в рантайме",
    "Работает в любой теме",
  ],
  accentNote = "Сделано, чтобы копировать, а не настраивать",
  accent,
  accentForeground,
  background = "",
  tone = "auto",
  className,
}: Hero003Props) {
  const style = {
    ...(accent ? { "--vibeui-hero-003-accent": accent } : {}),
    ...(accentForeground
      ? { "--vibeui-hero-003-accent-fg": accentForeground }
      : {}),
    ...(background
      ? {
          "--vibeui-hero-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : {}),
  } as CSSProperties

  return (
    <section
      data-vibeui-block="hero-003"
      data-tone={tone === "auto" ? undefined : tone}
      style={style}
      className={cx(
        "relative isolate overflow-hidden bg-[var(--vibeui-hero-003-bg)] font-[family-name:var(--vibeui-hero-003-sans)] text-[var(--vibeui-hero-003-ink)] antialiased",
        className,
      )}
    >
      <style href="vibeui-hero-003" precedence="medium">
        {STYLES}
      </style>

      <div aria-hidden="true" data-part="hatch" />

      {/* Отступы и высота живут на внутреннем слое: container-запросы читают
          ширину секции, а сама секция своим контейнером быть не может. */}
      <div
        data-part="frame"
        className="relative flex min-h-[560px] items-center px-5 py-14"
      >
        <div data-part="grid" className="grid w-full gap-4">
          {/* Главная offer-плитка: центр композиции, остальные её поддерживают */}
          <div
            data-part="lead"
            className={cx(TILE, TILE_IN, "flex flex-col justify-center p-7")}
          >
            {eyebrow ? (
              <p className="text-[0.75rem] font-medium tracking-[0.08em] text-[var(--vibeui-hero-003-muted)] uppercase">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-5 font-[family-name:var(--vibeui-hero-003-serif)] text-[clamp(2.125rem,4.4cqi,3.5rem)] leading-[1.06] font-semibold tracking-[-0.01em] text-balance break-words">
              {title}
              {titleAccent ? (
                <>
                  {" "}
                  <span className="text-[var(--vibeui-hero-003-accent)]">
                    {titleAccent}
                  </span>
                </>
              ) : null}
            </h1>

            {description ? (
              <p className="mt-4 max-w-[30rem] text-[clamp(1rem,1.3cqi,1.0625rem)] leading-relaxed text-pretty break-words text-[var(--vibeui-hero-003-muted)]">
                {description}
              </p>
            ) : null}

            <div
              data-part="actions"
              className="mt-7 flex w-full max-w-full flex-col gap-3"
            >
              {primaryAction ? (
                <a
                  href={primaryAction.href}
                  className={cx(
                    ACTION_BASE,
                    "bg-[var(--vibeui-hero-003-accent)] text-[var(--vibeui-hero-003-accent-fg)] shadow-[0_0.375rem_1.25rem_color-mix(in_oklab,var(--vibeui-hero-003-accent)_42%,transparent),inset_0_1px_0_color-mix(in_oklab,#ffffff_42%,transparent)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_0.625rem_1.75rem_color-mix(in_oklab,var(--vibeui-hero-003-accent)_52%,transparent),inset_0_1px_0_color-mix(in_oklab,#ffffff_52%,transparent)]",
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
                    "border border-[var(--vibeui-hero-003-ink)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--vibeui-hero-003-ink)_8%,transparent)]",
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
          </div>

          {stat ? (
            <div
              data-part="stat"
              className={cx(
                TILE_IN,
                "flex flex-col justify-end rounded-md border border-[var(--vibeui-hero-003-border)] bg-[var(--vibeui-hero-003-card-alt)] p-6 [animation-delay:70ms]",
              )}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 124 36"
                fill="none"
                preserveAspectRatio="none"
                className="mb-auto h-9 w-full text-[var(--vibeui-hero-003-accent)]"
              >
                <path
                  d="M2 30 L19 23 L35 26 L53 15 L71 19 L89 9 L105 12 L122 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-5 font-[family-name:var(--vibeui-hero-003-serif)] text-[clamp(2rem,3.4cqi,2.75rem)] leading-none font-semibold tabular-nums">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.8125rem] text-[var(--vibeui-hero-003-muted)]">
                {stat.label}
              </p>
            </div>
          ) : null}

          {accentNote ? (
            <div
              data-part="accent"
              className={cx(
                TILE_IN,
                "flex flex-col justify-between gap-6 rounded-md bg-[var(--vibeui-hero-003-accent)] p-6 text-[var(--vibeui-hero-003-accent-fg)] [animation-delay:140ms]",
              )}
            >
              <p className="text-[1rem] leading-snug font-medium text-balance">
                {accentNote}
              </p>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="size-5"
              >
                <path
                  d="M3 13 13 3m0 0H5.5M13 3v7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : null}

          {highlights.length > 0 ? (
            <ul
              data-part="panel"
              className={cx(
                TILE,
                TILE_IN,
                "flex flex-col justify-center gap-3 p-6 [animation-delay:210ms]",
              )}
            >
              {highlights.slice(0, 3).map((highlight) => (
                <li key={highlight} className="flex gap-3 text-[0.875rem]">
                  <CheckIcon />
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}

          <div
            aria-hidden="true"
            data-part="pattern"
            className={cx(
              TILE_IN,
              "flex items-center justify-center rounded-md border border-[var(--vibeui-hero-003-border)] bg-[var(--vibeui-hero-003-card-alt)] p-6 [animation-delay:280ms]",
            )}
          >
            {/* Сетка квадратов — знак самой библиотеки: плитка перестаёт быть
                дырой в мозаике и продолжает её же мысль. */}
            <div data-part="cells">
              {Array.from({ length: 9 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
