import type { CSSProperties } from "react"

export type Features012Role = {
  role: string
  pain: string
  gain: string
  jobs: string[]
  href: string
}

export type Features012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  roles?: Features012Role[]
  /** Подпись ссылки в карточке: компонент несёт русскую. */
  linkLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: «для кого» через боль и результат. Каждая карточка роли устроена
// одинаково: строка «сейчас» зачёркнутым серым и строка «станет» акцентом —
// контраст двух состояний объясняет ценность быстрее любого списка. Ниже
// три конкретные задачи роли. Карточка кликабельна целиком за счёт растянутой
// псевдоссылки, но в дереве доступности остаётся одна ссылка, а не четыре.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: карточка там светлее фона, рамка светлее карточки, а
// акцент поднимается по светлоте, чтобы строка «станет» осталась заметной.
const STYLES = `
:where([data-vibeui-block="features-012"]){
--vibeui-features-012-bg:transparent;
--vibeui-features-012-fg:light-dark(oklch(0.2 0 300),oklch(0.95 0 300));
--vibeui-features-012-muted:light-dark(oklch(0.52 0 300),oklch(0.72 0 300));
--vibeui-features-012-card:light-dark(oklch(1 0 0),oklch(0.24 0 300));
--vibeui-features-012-line:light-dark(oklch(0.89 0 300),oklch(0.35 0 300));
--vibeui-features-012-accent:light-dark(oklch(0.5 0.17 300),oklch(0.76 0.14 300));
--vibeui-features-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-012"]{color-scheme:dark}
[data-vibeui-block="features-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-012-bg);color:var(--vibeui-features-012-fg);
font-family:var(--vibeui-features-012-sans);
}
[data-vibeui-block="features-012"] *{box-sizing:border-box}
[data-vibeui-block="features-012"] [data-part="shell"]{max-width:70rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-012"] [data-part="head"]{max-width:38rem;margin:0 auto 2.25rem;text-align:center}
[data-vibeui-block="features-012"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-012-accent);
}
[data-vibeui-block="features-012"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-012"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-012-muted);text-wrap:pretty;
}
[data-vibeui-block="features-012"] [data-part="roles"]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:1rem}
[data-vibeui-block="features-012"] [data-part="role"]{
position:relative;display:flex;flex-direction:column;padding:1.5rem;
border:1px solid var(--vibeui-features-012-line);border-radius:1rem;background:var(--vibeui-features-012-card);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="features-012"] [data-part="role"]:hover{
border-color:var(--vibeui-features-012-accent);
box-shadow:0 8px 28px color-mix(in oklab,var(--vibeui-features-012-accent) 12%,transparent);
}
[data-vibeui-block="features-012"] [data-part="role"]:focus-within{
border-color:var(--vibeui-features-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-features-012-accent) 22%,transparent);
}
[data-vibeui-block="features-012"] h3{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="features-012"] [data-part="shift"]{
margin:1rem 0 0;padding:0.75rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-features-012-accent) 7%,transparent);
}
[data-vibeui-block="features-012"] [data-part="pain"]{
display:block;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-features-012-muted);text-decoration:line-through;
}
[data-vibeui-block="features-012"] [data-part="gain"]{
display:block;margin-top:0.375rem;font-size:0.875rem;line-height:1.45;font-weight:650;color:var(--vibeui-features-012-accent);
}
[data-vibeui-block="features-012"] [data-part="jobs"]{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="features-012"] [data-part="jobs"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-features-012-muted)}
[data-vibeui-block="features-012"] [data-part="dot"]{flex:0 0 auto;margin-top:0.5rem;width:0.3125rem;height:0.3125rem;border-radius:9999px;background:var(--vibeui-features-012-accent)}
[data-vibeui-block="features-012"] a{
margin-top:1.25rem;align-self:flex-start;font-size:0.875rem;font-weight:650;
color:var(--vibeui-features-012-accent);text-decoration:none;
}
[data-vibeui-block="features-012"] a::after{content:"";position:absolute;inset:0;border-radius:1rem}
[data-vibeui-block="features-012"] a:focus-visible{outline:none}
@container (min-width: 34rem){
[data-vibeui-block="features-012"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-012"] [data-part="roles"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="features-012"] [data-part="roles"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="features-012"] [data-part="role"]{padding:1.75rem}
[data-vibeui-block="features-012"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROLES: Features012Role[] = [
  {
    role: "Основателю",
    pain: "Лендинг ждёт свободного разработчика",
    gain: "Страница собирается за вечер силами одного человека",
    jobs: [
      "Проверить гипотезу до найма",
      "Обновить оффер без релиза",
      "Запустить вторую посадочную под кампанию",
    ],
    href: "#",
  },
  {
    role: "Разработчику",
    pain: "Вёрстка секций вместо продуктовых задач",
    gain: "Секция ставится командой и не тянет зависимостей",
    jobs: [
      "Не заводить в проект чужие токены",
      "Не чинить чужие медиазапросы",
      "Держать код-ревью маленьким",
    ],
    href: "#",
  },
  {
    role: "Маркетологу",
    pain: "Каждая правка текста — задача в трекере",
    gain: "Тексты живут в пропсах и меняются без вёрстки",
    jobs: [
      "Поменять заголовок и CTA самому",
      "Собрать вариант под A/B-тест",
      "Не сломать дизайн при правке",
    ],
    href: "#",
  },
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

/** Блок «для кого» с ролями: у каждой карточки зачёркнутая боль и акцентный результат. */
export function Features012({
  eyebrow = "Для кого",
  title = "Три роли, у которых боль разная, а решение общее",
  lede = "Секция объясняет ценность не списком возможностей, а сменой состояния: было — стало.",
  roles = DEFAULT_ROLES,
  linkLabel = "Сценарий для роли",
  background = "",
  accent,
  className,
  style,
}: Features012Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <ul data-part="roles">
            {roles.slice(0, 3).map((role) => (
              <li key={role.role} data-part="role">
                <h3>{role.role}</h3>
                <p data-part="shift">
                  <span data-part="pain">{role.pain}</span>
                  <span data-part="gain">{role.gain}</span>
                </p>
                <ul data-part="jobs">
                  {role.jobs.slice(0, 4).map((job) => (
                    <li key={job}>
                      <span data-part="dot" aria-hidden="true" />
                      {job}
                    </li>
                  ))}
                </ul>
                <a href={role.href}>{linkLabel} →</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
