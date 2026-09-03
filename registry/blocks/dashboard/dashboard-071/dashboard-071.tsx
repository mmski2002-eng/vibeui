import type { CSSProperties } from "react"

export type Dashboard071Flag = {
  key: string
  title: string
  env: string
  rollout: number
  audience: string
  changed: string
  enabled: boolean
  stale?: boolean
}

export type Dashboard071Props = {
  title?: string
  subtitle?: string
  flags?: Dashboard071Flag[]
  envs?: string[]
  activeEnv?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись включённого флага. */
  onLabel?: string
  /** Подпись выключенного флага. */
  offLabel?: string
  /** Доля выката: {rollout}. */
  pctText?: string
  /** Расшифровка полосы: {title} и {rollout}. */
  rolloutAriaText?: string
  /** Пометка забытого флага. */
  staleText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: флаг — это не переключатель «вкл/выкл», а «включён для кого и
// насколько». Поэтому в строке три вещи сразу: тумблер, доля выката числом и
// полосой и словесное описание аудитории. Флаг, который не трогали больше
// полугода, помечается отдельно: невыпиленный флаг дороже не включённой фичи,
// и напоминание о нём должно жить на этом экране, а не в чьей-то голове.
// Ключ флага набран моноширинным — его копируют в код, и его нужно узнавать
// глазами. Среда выбирается вкладками: один и тот же флаг в проде и стейдже
// живёт по-разному, и смешивать их в одном списке нельзя.
const STYLES = `
:where([data-vibeui-block="dashboard-071"]){
--vibeui-dashboard-071-bg:transparent;
/* Карточки флагов, чип ключа и жёлоб полосы: подложка блока прозрачна. */
--vibeui-dashboard-071-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 95));
--vibeui-dashboard-071-inset:light-dark(oklch(0.985 0.003 95),oklch(0.22 0.012 95));
--vibeui-dashboard-071-fg:light-dark(oklch(0.21 0.014 95),oklch(0.94 0.005 95));
--vibeui-dashboard-071-muted:light-dark(oklch(0.54 0.014 95),oklch(0.72 0.012 95));
--vibeui-dashboard-071-border:light-dark(oklch(0.91 0.006 95),oklch(0.36 0.012 95));
--vibeui-dashboard-071-accent:light-dark(oklch(0.52 0.14 145),oklch(0.72 0.13 145));
--vibeui-dashboard-071-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 145));
--vibeui-dashboard-071-knob:light-dark(oklch(1 0 0),oklch(0.97 0.004 95));
--vibeui-dashboard-071-soft:light-dark(oklch(0.965 0.02 145),oklch(0.3 0.035 145));
--vibeui-dashboard-071-stale:light-dark(oklch(0.68 0.15 72),oklch(0.8 0.14 72));
--vibeui-dashboard-071-stale-line:light-dark(oklch(0.83 0.09 72),oklch(0.53 0.11 72));
--vibeui-dashboard-071-stale-ink:light-dark(oklch(0.5 0.11 72),oklch(0.85 0.12 72));
--vibeui-dashboard-071-off:light-dark(oklch(0.6 0.01 95),oklch(0.52 0.01 95));
--vibeui-dashboard-071-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-071-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-071"]{color-scheme:dark}
[data-vibeui-block="dashboard-071"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-071-bg);
color:var(--vibeui-dashboard-071-fg);
font-family:var(--vibeui-dashboard-071-sans);
border:1px solid var(--vibeui-dashboard-071-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-071"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-071"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-071"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-071"] [data-part="sub"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-071-muted);max-width:66ch}
[data-vibeui-block="dashboard-071"] [data-part="envs"]{display:flex;flex-wrap:wrap;gap:0.3125rem}
[data-vibeui-block="dashboard-071"] [data-part="env"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
font-family:var(--vibeui-dashboard-071-mono);
padding:0.3125rem 0.6875rem;border-radius:0.5rem;background:var(--vibeui-dashboard-071-card);
color:inherit;border:1px solid var(--vibeui-dashboard-071-border);
}
[data-vibeui-block="dashboard-071"] [data-part="env"][aria-pressed="true"]{
background:var(--vibeui-dashboard-071-accent);color:var(--vibeui-dashboard-071-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-071"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="dashboard-071"] [data-part="flag"]{
display:grid;grid-template-columns:1fr auto;gap:0.3125rem 0.75rem;align-items:start;
padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-071-card);border:1px solid var(--vibeui-dashboard-071-border);
}
[data-vibeui-block="dashboard-071"] [data-part="flag"][data-stale="true"]{
border-color:var(--vibeui-dashboard-071-stale-line);
}
[data-vibeui-block="dashboard-071"] [data-part="name"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;min-width:0}
[data-vibeui-block="dashboard-071"] [data-part="name"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-071"] [data-part="key"]{
font-family:var(--vibeui-dashboard-071-mono);font-size:0.6875rem;
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-071-inset);color:var(--vibeui-dashboard-071-muted);
border:1px solid var(--vibeui-dashboard-071-border);overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-071"] [data-part="switch"]{
display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;white-space:nowrap;
font-size:0.6875rem;font-weight:700;color:var(--vibeui-dashboard-071-muted);
}
[data-vibeui-block="dashboard-071"] [data-part="switch"] input{
appearance:none;margin:0;width:2.125rem;height:1.1875rem;border-radius:9999px;cursor:pointer;position:relative;
background:var(--vibeui-dashboard-071-border);transition:background 0.15s ease;
}
[data-vibeui-block="dashboard-071"] [data-part="switch"] input::after{
content:"";position:absolute;top:0.1875rem;left:0.1875rem;width:0.8125rem;height:0.8125rem;
border-radius:50%;background:var(--vibeui-dashboard-071-knob);transition:transform 0.15s ease;
}
[data-vibeui-block="dashboard-071"] [data-part="switch"] input:checked{background:var(--vibeui-dashboard-071-accent)}
[data-vibeui-block="dashboard-071"] [data-part="switch"] input:checked::after{transform:translateX(0.9375rem)}
[data-vibeui-block="dashboard-071"] [data-part="roll"]{
grid-column:1;display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-dashboard-071-muted);
}
[data-vibeui-block="dashboard-071"] [data-part="bar"]{
flex:0 1 8rem;min-width:5rem;height:0.3125rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-071-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-071-border);
}
[data-vibeui-block="dashboard-071"] [data-part="bar"] span{
position:absolute;inset:0 auto 0 0;background:var(--vibeui-dashboard-071-accent);border-radius:9999px;
}
[data-vibeui-block="dashboard-071"] [data-part="flag"][data-on="false"] [data-part="bar"] span{background:var(--vibeui-dashboard-071-off)}
[data-vibeui-block="dashboard-071"] [data-part="pct"]{font-weight:750;color:var(--vibeui-dashboard-071-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-071"] [data-part="meta"]{
grid-column:1 / -1;margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-071-muted);
}
[data-vibeui-block="dashboard-071"] [data-part="warn"]{color:var(--vibeui-dashboard-071-stale-ink);font-weight:700}
[data-vibeui-block="dashboard-071"] :is(a,button,input,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-071-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-071"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FLAGS: Dashboard071Flag[] = [
  {
    key: "grid.saved_views",
    title: "Сохранённые представления в сетке",
    env: "prod",
    rollout: 100,
    audience: "все пользователи",
    changed: "изменён 3 дня назад, Егор Савельев",
    enabled: true,
  },
  {
    key: "import.column_guess",
    title: "Автоугадывание колонок при импорте",
    env: "prod",
    rollout: 25,
    audience: "рабочие пространства с тарифом «Команда»",
    changed: "изменён вчера, Марина Тюрина",
    enabled: true,
  },
  {
    key: "mail.new_gateway",
    title: "Новый почтовый шлюз",
    env: "prod",
    rollout: 0,
    audience: "выключен после отката 4.11.1",
    changed: "изменён 6 июня, дежурный",
    enabled: false,
  },
  {
    key: "billing.annual_discount",
    title: "Годовая скидка в тарифах",
    env: "prod",
    rollout: 60,
    audience: "новые регистрации из России и Казахстана",
    changed: "изменён 2 недели назад, Ирина Кузнецова",
    enabled: true,
  },
  {
    key: "ui.legacy_sidebar",
    title: "Старая боковая навигация",
    env: "prod",
    rollout: 3,
    audience: "12 рабочих пространств, попросивших оставить",
    changed: "изменён 8 месяцев назад",
    enabled: true,
    stale: true,
  },
]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Страница фич-флагов: тумблер, доля выката числом и полосой, словесное
 * описание аудитории и отметка забытого флага. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard071({
  title = "Фич-флаги",
  subtitle = "Доля выката считается от активных пользователей среды и обновляется раз в минуту. Выключение флага действует мгновенно и не требует релиза.",
  flags = DEFAULT_FLAGS,
  envs = ["prod", "stage", "dev"],
  activeEnv = "prod",
  accent,
  background = "",
  onLabel = "включён",
  offLabel = "выключен",
  pctText = "{rollout} %",
  rolloutAriaText = "{title}: выкат {rollout} процентов",
  staleText = "флаг не трогали 8 месяцев — пора выпилить из кода",
  className,
  style,
}: Dashboard071Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-071-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-071-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-071" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-071"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
          </div>

          <div data-part="envs">
            {envs.map((env) => (
              <button
                key={env}
                type="button"
                data-part="env"
                aria-pressed={env === activeEnv}
              >
                {env}
              </button>
            ))}
          </div>

          <ul data-part="list">
            {flags.map((flag) => (
              <li
                key={flag.key}
                data-part="flag"
                data-on={flag.enabled}
                data-stale={flag.stale}
              >
                <div data-part="name">
                  <b>{flag.title}</b>
                  <code data-part="key">{flag.key}</code>
                </div>

                <label data-part="switch">
                  <input type="checkbox" defaultChecked={flag.enabled} />
                  {flag.enabled ? onLabel : offLabel}
                </label>

                <p data-part="roll">
                  <span
                    data-part="bar"
                    role="progressbar"
                    aria-valuenow={flag.rollout}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={rolloutAriaText
                      .replace("{title}", flag.title)
                      .replace("{rollout}", String(flag.rollout))}
                  >
                    <span style={{ width: `${flag.rollout}%` }} />
                  </span>
                  <span data-part="pct">
                    {pctText.replace("{rollout}", String(flag.rollout))}
                  </span>
                  <span>{flag.audience}</span>
                </p>

                <p data-part="meta">
                  <span>{flag.changed}</span>
                  {flag.stale ? (
                    <span data-part="warn">{staleText}</span>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
