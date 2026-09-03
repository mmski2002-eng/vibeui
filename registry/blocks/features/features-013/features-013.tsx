import type { CSSProperties } from "react"

export type Features013Badge = {
  name: string
  status: string
  /** Сертификат ещё в работе: щит перекрашивается в предупреждающий оттенок. */
  pending?: boolean
}

export type Features013Control = {
  title: string
  description: string
}

export type Features013Props = {
  eyebrow?: string
  title?: string
  lede?: string
  badges?: Features013Badge[]
  controls?: Features013Control[]
  documents?: { label: string; href: string }[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: секция о безопасности и соответствии. Сертификаты вынесены в
// ряд щитов с явным статусом словами — «пройден», «в процессе»: значок без
// подписи ничего не доказывает, а цветной кружок недоступен дальтонику и
// скринридеру. Ниже — контроли обычным списком и ссылки на документы:
// секция должна вести к бумагам, иначе это просто набор бейджей.
const STYLES = `
:where([data-vibeui-block="features-013"]){
--vibeui-features-013-bg:oklch(0.19 0.02 220);
--vibeui-features-013-fg:oklch(0.97 0.004 220);
--vibeui-features-013-muted:oklch(0.72 0.014 220);
--vibeui-features-013-panel:oklch(0.23 0.022 220);
--vibeui-features-013-line:oklch(1 0 0 / 12%);
--vibeui-features-013-accent:oklch(0.76 0.13 195);
--vibeui-features-013-warn:oklch(0.8 0.13 85);
--vibeui-features-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="features-013"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-013-bg);color:var(--vibeui-features-013-fg);
font-family:var(--vibeui-features-013-sans);
}
[data-vibeui-block="features-013"] *{box-sizing:border-box}
[data-vibeui-block="features-013"] [data-part="shell"]{max-width:68rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-013"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-013-accent);
}
[data-vibeui-block="features-013"] h2{
margin:0;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-013"] [data-part="lede"]{
margin:0.875rem 0 0;max-width:36rem;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-013-muted);text-wrap:pretty;
}
[data-vibeui-block="features-013"] [data-part="badges"]{
list-style:none;margin:2rem 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;
}
[data-vibeui-block="features-013"] [data-part="badge"]{
display:flex;align-items:center;gap:0.75rem;padding:0.875rem;border-radius:0.875rem;
border:1px solid var(--vibeui-features-013-line);background:var(--vibeui-features-013-panel);
}
[data-vibeui-block="features-013"] [data-part="shield"]{
flex:0 0 auto;width:2.25rem;height:2.25rem;display:flex;align-items:center;justify-content:center;
border-radius:0.625rem;background:color-mix(in oklab,var(--vibeui-features-013-accent) 16%,transparent);
color:var(--vibeui-features-013-accent);
}
[data-vibeui-block="features-013"] [data-part="badgename"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="features-013"] [data-part="badgestatus"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-features-013-muted)}
[data-vibeui-block="features-013"] [data-pending="true"] [data-part="shield"]{
background:color-mix(in oklab,var(--vibeui-features-013-warn) 16%,transparent);color:var(--vibeui-features-013-warn);
}
[data-vibeui-block="features-013"] [data-part="controls"]{
list-style:none;margin:2rem 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:1.25rem;
}
[data-vibeui-block="features-013"] [data-part="controls"] li{padding-top:1rem;border-top:1px solid var(--vibeui-features-013-line)}
[data-vibeui-block="features-013"] h3{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="features-013"] [data-part="controls"] p{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-features-013-muted)}
[data-vibeui-block="features-013"] [data-part="docs"]{
list-style:none;display:flex;flex-wrap:wrap;gap:0.5rem;margin:2rem 0 0;padding:0;
}
[data-vibeui-block="features-013"] a{
display:inline-flex;align-items:center;gap:0.375rem;height:2.25rem;padding:0 0.875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-features-013-line);color:var(--vibeui-features-013-fg);
font-size:0.8125rem;font-weight:600;text-decoration:none;transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="features-013"] a:hover{border-color:var(--vibeui-features-013-accent);color:var(--vibeui-features-013-accent)}
[data-vibeui-block="features-013"] a:focus-visible{outline:2px solid var(--vibeui-features-013-accent);outline-offset:3px}
@container (min-width: 34rem){
[data-vibeui-block="features-013"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-013"] [data-part="badges"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="features-013"] [data-part="controls"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 2rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-013"] [data-part="controls"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="features-013"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BADGES: Features013Badge[] = [
  { name: "ISO 27001", status: "Сертификат действует" },
  { name: "SOC 2 Type II", status: "Аудит пройден" },
  { name: "152-ФЗ", status: "Данные в РФ" },
  { name: "GDPR", status: "Оценка в процессе", pending: true },
]

const DEFAULT_CONTROLS: Features013Control[] = [
  {
    title: "Шифрование",
    description:
      "TLS 1.3 в канале и AES-256 на дисках. Ключи ротируются раз в квартал.",
  },
  {
    title: "Доступы",
    description:
      "SSO, роли на проект и обязательная двухфакторная аутентификация для админов.",
  },
  {
    title: "Журнал действий",
    description:
      "Каждое изменение хранит автора, время и причину. Выгрузка за любой период.",
  },
  {
    title: "Резервные копии",
    description:
      "Ежедневные копии в двух регионах, проверка восстановления раз в месяц.",
  },
]

const DEFAULT_DOCUMENTS = [
  { label: "Политика безопасности", href: "#" },
  { label: "Отчёт SOC 2", href: "#" },
  { label: "Обработка персональных данных", href: "#" },
]

/** Блок безопасности и соответствия: щиты со статусом словами, контроли и ссылки на документы. */
export function Features013({
  eyebrow = "Безопасность",
  title = "Соответствие, которое можно проверить по документам",
  lede = "Ни одного бейджа без статуса словами: рядом с каждым сертификатом написано, действует он или ещё в работе.",
  badges = DEFAULT_BADGES,
  controls = DEFAULT_CONTROLS,
  documents = DEFAULT_DOCUMENTS,
  accent,
  className,
  style,
}: Features013Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <ul data-part="badges">
            {badges.slice(0, 4).map((badge) => (
              <li
                key={badge.name}
                data-part="badge"
                data-pending={badge.pending ? "true" : undefined}
              >
                <span data-part="shield" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path
                      d="M12 3 5 6v5c0 4.2 3 7.4 7 8.4 4-1 7-4.2 7-8.4V6z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m9 11.8 2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span data-part="badgename">{badge.name}</span>
                  <span data-part="badgestatus">{badge.status}</span>
                </span>
              </li>
            ))}
          </ul>

          <ul data-part="controls">
            {controls.slice(0, 4).map((control) => (
              <li key={control.title}>
                <h3>{control.title}</h3>
                <p>{control.description}</p>
              </li>
            ))}
          </ul>

          <ul data-part="docs">
            {documents.slice(0, 4).map((entry) => (
              <li key={entry.label}>
                <a href={entry.href}>{entry.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
