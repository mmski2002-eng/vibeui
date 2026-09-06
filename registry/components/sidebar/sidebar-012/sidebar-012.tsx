import type { ComponentProps, CSSProperties } from "react"

export type Sidebar012Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: string[]
  activeLabel?: string
  planName?: string
  /** Сколько израсходовано и сколько всего: считает сам компонент. */
  used?: number
  limit?: number
  /** Подпись расхода. {used}, {limit} и {percent} подставляются. */
  usageTemplate?: string
  actionLabel?: string
  actionHref?: string
  accent?: string
  /** Пусто — подложки нет, меню лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: карточка тарифа внизу меню. Она отвечает на вопрос
// «сколько у меня осталось» там, где человек и так каждый день бывает, —
// не письмом и не баннером поверх работы. Расход показан полосой и числом:
// полоса даёт мгновенную оценку, число — точность. Возле порога полоса
// перекрашивается, потому что «почти кончилось» и «полно места» на глаз
// отличаются плохо. Кнопка повышения тарифа стоит рядом, но не кричит:
// это подсказка, а не требование.
const STYLES = `
:where([data-vibeui-block="sidebar-012"]){
--vibeui-sidebar-012-bg:transparent;
--vibeui-sidebar-012-fg:light-dark(oklch(0.27 0 265),oklch(0.94 0 265));
--vibeui-sidebar-012-muted:color-mix(in oklab,var(--vibeui-sidebar-012-fg) 62%,transparent);
--vibeui-sidebar-012-border:light-dark(oklch(0 0 0 / 11%),oklch(1 0 0 / 12%));
--vibeui-sidebar-012-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-sidebar-012-card:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-sidebar-012-track:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 14%));
--vibeui-sidebar-012-accent:light-dark(oklch(0.5 0.16 265),oklch(0.8 0.12 265));
--vibeui-sidebar-012-on-accent:oklch(from var(--vibeui-sidebar-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sidebar-012-active:color-mix(in oklab,var(--vibeui-sidebar-012-accent) 14%,transparent);
--vibeui-sidebar-012-alarm:light-dark(oklch(0.58 0.16 45),oklch(0.8 0.14 55));
--vibeui-sidebar-012-radius:0.5rem;
--vibeui-sidebar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-012"]{color-scheme:dark}
[data-vibeui-block="sidebar-012"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:15rem;min-height:16rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-012-bg);color:var(--vibeui-sidebar-012-fg);
font-family:var(--vibeui-sidebar-012-font);
}
[data-vibeui-block="sidebar-012"] *{box-sizing:border-box}
[data-vibeui-block="sidebar-012"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-012"] [data-part="link"]{
display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.4375rem 0.5rem;border-radius:var(--vibeui-sidebar-012-radius);
color:inherit;font-size:0.875rem;text-decoration:none;
}
[data-vibeui-block="sidebar-012"] [data-part="link"]:hover{background:var(--vibeui-sidebar-012-hover)}
[data-vibeui-block="sidebar-012"] [data-part="link"][aria-current="page"]{
background:var(--vibeui-sidebar-012-active);font-weight:650;
}
[data-vibeui-block="sidebar-012"] [data-part="link"]:focus-visible,
[data-vibeui-block="sidebar-012"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-sidebar-012-accent);outline-offset:2px;
}
/* Карточка прижата к низу колонки: место под ней в меню всё равно пустует,
   а глаз ищет счётчик расхода внизу, как в банковском приложении. */
[data-vibeui-block="sidebar-012"] [data-part="card"]{
margin-top:auto;display:flex;flex-direction:column;gap:0.4375rem;
padding:0.625rem;border-radius:0.625rem;
background:var(--vibeui-sidebar-012-card);
border:1px solid var(--vibeui-sidebar-012-border);
}
[data-vibeui-block="sidebar-012"] [data-part="plan"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="sidebar-012"] [data-part="percent"]{
font-size:0.75rem;font-weight:600;color:var(--vibeui-sidebar-012-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sidebar-012"] [data-part="track"]{
height:0.375rem;border-radius:999px;overflow:hidden;
background:var(--vibeui-sidebar-012-track);
}
[data-vibeui-block="sidebar-012"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-sidebar-012-accent);
}
/* Возле порога полоса меняет цвет: «осталось 8%» и «занято 40%» на глаз
   различаются плохо, если оба куска одного цвета. */
[data-vibeui-block="sidebar-012"] [data-part="card"][data-alarm="true"] [data-part="fill"]{
background:var(--vibeui-sidebar-012-alarm);
}
[data-vibeui-block="sidebar-012"] [data-part="usage"]{
margin:0;font-size:0.75rem;line-height:1.35;color:var(--vibeui-sidebar-012-muted);
}
[data-vibeui-block="sidebar-012"] [data-part="action"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0.625rem;border-radius:var(--vibeui-sidebar-012-radius);
background:var(--vibeui-sidebar-012-accent);color:var(--vibeui-sidebar-012-on-accent);
font-size:0.8125rem;font-weight:650;text-decoration:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = ["Обзор", "Проекты", "Задачи", "Отчёты", "Настройки"]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Меню с карточкой тарифа внизу: расход виден там, где человек бывает каждый день.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar012({
  items = DEFAULT_ITEMS,
  activeLabel = "Проекты",
  planName = "Тариф «Команда»",
  used = 8600,
  limit = 10000,
  usageTemplate = "{used} из {limit} запросов в этом месяце",
  actionLabel = "Повысить тариф",
  actionHref = "#",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sidebar012Props) {
  const safeLimit = limit > 0 ? limit : 1
  const percent = Math.min(100, Math.round((used / safeLimit) * 100))
  const alarm = percent >= 80

  const usage = usageTemplate
    .replace("{used}", used.toLocaleString("ru-RU"))
    .replace("{limit}", limit.toLocaleString("ru-RU"))
    .replace("{percent}", String(percent))

  const palette = {
    ...(accent ? { "--vibeui-sidebar-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-012" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-012"
        aria-label={planName}
        className={className}
        style={palette}
      >
        <ul>
          {items.map((item) => (
            <li key={item}>
              <a
                data-part="link"
                href="#"
                aria-current={item === activeLabel ? "page" : undefined}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div data-part="card" data-alarm={alarm || undefined}>
          <span data-part="plan">
            {planName}
            <span data-part="percent">{percent}%</span>
          </span>
          {/* Полоса нарисована как progress по смыслу, а не по тегу: у
              нативного progress не задать цвет порога в обеих темах. */}
          <span
            data-part="track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={usage}
          >
            <span data-part="fill" style={{ width: `${percent}%` }} />
          </span>
          <p data-part="usage">{usage}</p>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </nav>
    </>
  )
}
