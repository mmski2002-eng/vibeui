import type { ComponentProps, CSSProperties } from "react"

export type Browser003Tab = {
  label: string
  url: string
  heading: string
  body: string
}

export type Browser003Props = Omit<ComponentProps<"section">, "children"> & {
  tabs?: Browser003Tab[]
  accent?: string
  /** Секунд на полный круг переключения вкладок. */
  duration?: number
}

// Идея: окно браузера с несколькими вкладками, которые сами переключаются по
// кругу — активная вкладка подсвечивается, адресная строка и панель контента
// синхронно сменяются на соседний слот. Цикл держится на @keyframes с разным
// animation-delay на индекс вкладки: JS не участвует, крутится один таймер на
// всех через переменную --vibeui-browser-003-duration.
const STYLES = `
:where([data-vibeui-block="browser-003"]){
--vibeui-browser-003-duration:9s;
--vibeui-browser-003-chrome:light-dark(oklch(0.965 0 265),oklch(0.22 0 265));
--vibeui-browser-003-page:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-browser-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-browser-003-muted:color-mix(in oklab,var(--vibeui-browser-003-fg) 58%,transparent);
--vibeui-browser-003-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-browser-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-browser-003-tab-active:color-mix(in oklab,var(--vibeui-browser-003-accent) 14%,transparent);
--vibeui-browser-003-line:light-dark(oklch(0.91 0 0),oklch(0.36 0 0));
--vibeui-browser-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="browser-003"]{color-scheme:dark}
[data-vibeui-block="browser-003"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
font-family:var(--vibeui-browser-003-font);color:var(--vibeui-browser-003-fg);
}
[data-vibeui-block="browser-003"] *{box-sizing:border-box}
[data-vibeui-block="browser-003"] [data-part="window"]{
overflow:hidden;border-radius:0.875rem;border:1px solid var(--vibeui-browser-003-border);
background:var(--vibeui-browser-003-page);
box-shadow:0 1px 2px oklch(0 0 0 / 0.06),0 12px 28px -16px oklch(0 0 0 / 0.28);
}
[data-vibeui-block="browser-003"] [data-part="titlebar"]{
display:flex;align-items:center;gap:0.625rem;padding:0.5rem 0.625rem 0;
background:var(--vibeui-browser-003-chrome);
}
[data-vibeui-block="browser-003"] [data-part="dots"]{display:flex;gap:0.3125rem;flex:none;padding-bottom:0.5rem}
[data-vibeui-block="browser-003"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px}
[data-vibeui-block="browser-003"] [data-part="dot"][data-c="red"]{background:#ff5f57}
[data-vibeui-block="browser-003"] [data-part="dot"][data-c="yellow"]{background:#febc2e}
[data-vibeui-block="browser-003"] [data-part="dot"][data-c="green"]{background:#28c840}
[data-vibeui-block="browser-003"] [data-part="tabbar"]{display:flex;gap:0.25rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="browser-003"] [data-part="tab"]{
display:flex;align-items:center;gap:0.375rem;min-width:0;flex:1 1 0;
padding:0.375rem 0.5rem;border-radius:0.5rem 0.5rem 0 0;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-browser-003-muted);
animation:vibeui-browser-003-tab var(--vibeui-browser-003-duration) linear infinite;
}
[data-vibeui-block="browser-003"] [data-part="tab-dot"]{
flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;background:currentColor;opacity:0.5;
}
[data-vibeui-block="browser-003"] [data-part="tab-label"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="browser-003"] [data-part="address"]{
position:relative;display:flex;align-items:center;gap:0.375rem;margin:0 0.625rem 0.5rem;
padding:0.25rem 0.625rem;border-radius:9999px;height:1.5rem;
background:var(--vibeui-browser-003-page);border:1px solid var(--vibeui-browser-003-border);
}
[data-vibeui-block="browser-003"] [data-part="lock"]{flex:none;width:0.625rem;height:0.625rem;color:var(--vibeui-browser-003-muted)}
[data-vibeui-block="browser-003"] [data-part="urls"]{position:relative;flex:1 1 auto;min-width:0;height:0.875rem}
[data-vibeui-block="browser-003"] [data-part="url"]{
position:absolute;inset:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;color:var(--vibeui-browser-003-muted);
animation:vibeui-browser-003-fade var(--vibeui-browser-003-duration) linear infinite;
}
[data-vibeui-block="browser-003"] [data-part="content"]{
position:relative;min-height:7.5rem;border-top:1px solid var(--vibeui-browser-003-border);
}
[data-vibeui-block="browser-003"] [data-part="panel"]{
position:absolute;inset:0;display:flex;flex-direction:column;gap:0.5rem;padding:1rem;
animation:vibeui-browser-003-fade var(--vibeui-browser-003-duration) linear infinite;
}
[data-vibeui-block="browser-003"] [data-part="panel-icon"]{width:1.75rem;height:1.75rem;border-radius:0.5rem;background:var(--vibeui-browser-003-accent)}
[data-vibeui-block="browser-003"] [data-part="panel"][data-index="1"] [data-part="panel-icon"]{background:light-dark(oklch(0.6 0.15 160),oklch(0.75 0.14 160))}
[data-vibeui-block="browser-003"] [data-part="panel"][data-index="2"] [data-part="panel-icon"]{background:light-dark(oklch(0.68 0.15 60),oklch(0.8 0.13 60))}
[data-vibeui-block="browser-003"] [data-part="panel-title"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="browser-003"] [data-part="panel-body"]{margin:0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-browser-003-muted)}
[data-vibeui-block="browser-003"] [data-part="panel-line"]{display:block;height:0.375rem;border-radius:9999px;background:var(--vibeui-browser-003-line)}
[data-vibeui-block="browser-003"] [data-part="panel-line"][data-w="88"]{width:88%}
[data-vibeui-block="browser-003"] [data-part="panel-line"][data-w="62"]{width:62%}
[data-vibeui-block="browser-003"] [data-index="1"]{animation-delay:calc(var(--vibeui-browser-003-duration) * -0.33334)}
[data-vibeui-block="browser-003"] [data-index="2"]{animation-delay:calc(var(--vibeui-browser-003-duration) * -0.66667)}
@keyframes vibeui-browser-003-tab{
0%,2%{background:transparent;color:var(--vibeui-browser-003-muted)}
6%,28%{background:var(--vibeui-browser-003-tab-active);color:var(--vibeui-browser-003-fg)}
33%,100%{background:transparent;color:var(--vibeui-browser-003-muted)}
}
@keyframes vibeui-browser-003-fade{
0%,2%{opacity:0;visibility:hidden}
6%,28%{opacity:1;visibility:visible}
33%,100%{opacity:0;visibility:hidden}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="browser-003"] [data-part="tab"],
[data-vibeui-block="browser-003"] [data-part="url"],
[data-vibeui-block="browser-003"] [data-part="panel"]{animation:none}
[data-vibeui-block="browser-003"] [data-part="tab"][data-index="0"]{background:var(--vibeui-browser-003-tab-active);color:var(--vibeui-browser-003-fg)}
[data-vibeui-block="browser-003"] [data-part="url"][data-index="0"],
[data-vibeui-block="browser-003"] [data-part="panel"][data-index="0"]{opacity:1;visibility:visible}
[data-vibeui-block="browser-003"] [data-part="url"][data-index="1"],
[data-vibeui-block="browser-003"] [data-part="url"][data-index="2"],
[data-vibeui-block="browser-003"] [data-part="panel"][data-index="1"],
[data-vibeui-block="browser-003"] [data-part="panel"][data-index="2"]{opacity:0;visibility:hidden}
}
`

const DEFAULT_TABS: Browser003Tab[] = [
  {
    label: "Обзор",
    url: "vibeui.ru/overview",
    heading: "Обзор проекта",
    body: "Ключевые метрики за неделю",
  },
  {
    label: "Аналитика",
    url: "vibeui.ru/analytics",
    heading: "Аналитика",
    body: "Трафик и конверсии по каналам",
  },
  {
    label: "Настройки",
    url: "vibeui.ru/settings",
    heading: "Настройки",
    body: "Профиль, доступы и уведомления",
  },
]

/**
 * Окно браузера с вкладками, которые сами переключаются по кругу. Один
 * файл, ноль зависимостей, собственная палитра.
 */
export function Browser003({
  tabs = DEFAULT_TABS,
  accent,
  duration = 9,
  className,
  style,
  ...props
}: Browser003Props) {
  const palette = {
    ...(accent ? { "--vibeui-browser-003-accent": accent } : null),
    "--vibeui-browser-003-duration": `${duration}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-browser-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="browser-003"
        data-slot="browser-tabs"
        className={className}
        style={palette}
      >
        <div data-part="window">
          <div data-part="titlebar">
            <span data-part="dots" aria-hidden="true">
              <span data-part="dot" data-c="red" />
              <span data-part="dot" data-c="yellow" />
              <span data-part="dot" data-c="green" />
            </span>
            <div data-part="tabbar">
              {tabs.map((tab, index) => (
                <span data-part="tab" data-index={index} key={tab.label}>
                  <span data-part="tab-dot" aria-hidden="true" />
                  <span data-part="tab-label">{tab.label}</span>
                </span>
              ))}
            </div>
          </div>
          <div data-part="address">
            <svg
              data-part="lock"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span data-part="urls">
              {tabs.map((tab, index) => (
                <span data-part="url" data-index={index} key={tab.label}>
                  {tab.url}
                </span>
              ))}
            </span>
          </div>
          <div data-part="content">
            {tabs.map((tab, index) => (
              <div data-part="panel" data-index={index} key={tab.label}>
                <span data-part="panel-icon" aria-hidden="true" />
                <p data-part="panel-title">{tab.heading}</p>
                <p data-part="panel-body">{tab.body}</p>
                <span data-part="panel-line" data-w="88" aria-hidden="true" />
                <span data-part="panel-line" data-w="62" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
