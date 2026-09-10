import type { CSSProperties, ReactNode } from "react"

type Layout011Section = {
  label: string
  href: string
  current?: boolean
}

type Layout011Thread = {
  name: string
  preview: string
  time: string
  unread?: boolean
  current?: boolean
}

export type Layout011Props = {
  /** Своя область диалога вместо демонстрационной. */
  children?: ReactNode
  appName?: string
  sections?: Layout011Section[]
  sectionsLabel?: string
  threadsTitle?: string
  threads?: Layout011Thread[]
  /** Заголовок выбранного диалога. */
  threadName?: string
  composerPlaceholder?: string
  sendLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Трёхпанельный сервис: разделы, список разговоров и выбранный диалог.
// Для почты, AI-чата, поддержки и сообщества. На desktop блок держит
// высоту в rem, панели списка и диалога прокручиваются каждая своя —
// переключение разговора не сбрасывает позицию списка. В узкой колонке
// панели идут последовательно потоком в порядке DOM. Отправку сообщений,
// хранение и AI предоставляет приложение. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="layout-011"]){
--vibeui-layout-011-bg:#ffffff;
--vibeui-layout-011-ink:#000000;
--vibeui-layout-011-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-011-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-011-panel:#f2f2f2;
--vibeui-layout-011-side:#1a1a1a;
--vibeui-layout-011-accent:#ff5900;
--vibeui-layout-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-011"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-011-bg);color:var(--vibeui-layout-011-ink);
font-family:var(--vibeui-layout-011-font);
}
[data-vibeui-block="layout-011"] *{box-sizing:border-box}
[data-vibeui-block="layout-011"] [data-part="frame"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="layout-011"] [data-part="rail"]{
flex:none;background:var(--vibeui-layout-011-side);color:#ffffff;
display:flex;flex-direction:row;align-items:center;gap:0.25rem;
padding:0.625rem 0.75rem;overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="layout-011"] [data-part="rail"]::-webkit-scrollbar{display:none}
[data-vibeui-block="layout-011"] [data-part="app"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;margin-right:0.5rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.015em;
}
[data-vibeui-block="layout-011"] [data-part="app"]::before{
content:"";width:1.375rem;height:1.375rem;border-radius:0.375rem;
background:var(--vibeui-layout-011-accent);
}
[data-vibeui-block="layout-011"] [data-part="rail"] a{
flex:none;padding:0.4375rem 0.75rem;border-radius:0.5rem;
color:color-mix(in oklab,#ffffff 72%,#1a1a1a);text-decoration:none;
font-size:0.875rem;font-weight:540;white-space:nowrap;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="layout-011"] [data-part="rail"] a:hover{color:#ffffff}
[data-vibeui-block="layout-011"] [data-part="rail"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-layout-011-accent) 24%,transparent);color:#ffffff;
}
[data-vibeui-block="layout-011"] [data-part="threads"]{
flex:none;border-bottom:1px solid var(--vibeui-layout-011-line);
display:flex;flex-direction:column;min-height:0;
}
[data-vibeui-block="layout-011"] [data-part="threads"] h2{
margin:0;padding:0.875rem 1rem;font-size:0.9375rem;font-weight:650;
border-bottom:1px solid var(--vibeui-layout-011-line);
}
[data-vibeui-block="layout-011"] [data-part="thread-list"]{
display:flex;flex-direction:column;overflow-y:auto;min-height:0;
}
[data-vibeui-block="layout-011"] [data-part="thread"]{
display:flex;flex-direction:column;gap:0.1875rem;
padding:0.75rem 1rem;color:inherit;text-decoration:none;
border-left:3px solid transparent;
border-bottom:1px solid var(--vibeui-layout-011-line);
}
[data-vibeui-block="layout-011"] [data-part="thread"]:hover{background:var(--vibeui-layout-011-panel)}
[data-vibeui-block="layout-011"] [data-part="thread"][aria-current="true"]{
background:var(--vibeui-layout-011-panel);
border-left-color:var(--vibeui-layout-011-accent);
}
[data-vibeui-block="layout-011"] [data-part="thread-top"]{
display:flex;align-items:baseline;gap:0.5rem;
}
[data-vibeui-block="layout-011"] [data-part="thread-top"] strong{
font-size:0.9375rem;font-weight:620;flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="layout-011"] [data-part="thread"][data-unread="on"] [data-part="thread-top"] strong::after{
content:"";display:inline-block;width:0.4375rem;height:0.4375rem;margin-left:0.375rem;
border-radius:999px;background:var(--vibeui-layout-011-accent);vertical-align:middle;
}
[data-vibeui-block="layout-011"] [data-part="thread-top"] time{
flex:none;font-size:0.75rem;color:var(--vibeui-layout-011-muted);
}
[data-vibeui-block="layout-011"] [data-part="thread"] p{
margin:0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-layout-011-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="layout-011"] [data-part="dialog"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;min-height:24rem;
}
[data-vibeui-block="layout-011"] [data-part="dialog-top"]{
flex:none;padding:0.875rem 1rem;font-size:0.9375rem;font-weight:650;
border-bottom:1px solid var(--vibeui-layout-011-line);
}
[data-vibeui-block="layout-011"] [data-part="messages"]{
flex:1 1 auto;min-height:0;overflow-y:auto;
padding:1rem;display:flex;flex-direction:column;gap:0.625rem;
}
[data-vibeui-block="layout-011"] [data-part="bubble"]{
max-width:32rem;padding:0.625rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-layout-011-panel);
font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="layout-011"] [data-part="bubble"][data-mine="on"]{
align-self:flex-end;
background:color-mix(in oklab,var(--vibeui-layout-011-accent) 16%,#ffffff);
}
[data-vibeui-block="layout-011"] [data-part="composer"]{
flex:none;display:flex;gap:0.5rem;padding:0.75rem 1rem;
border-top:1px solid var(--vibeui-layout-011-line);
}
[data-vibeui-block="layout-011"] [data-part="composer"] input{
flex:1 1 auto;min-width:0;min-height:2.5rem;padding:0.25rem 0.875rem;
background:var(--vibeui-layout-011-panel);color:var(--vibeui-layout-011-ink);
border:1px solid transparent;border-radius:0.625rem;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="layout-011"] [data-part="composer"] input:focus-visible{
outline:none;border-color:var(--vibeui-layout-011-accent);
}
[data-vibeui-block="layout-011"] [data-part="composer"] button{
appearance:none;border:0;cursor:pointer;flex:none;
min-height:2.5rem;padding:0.25rem 1.125rem;border-radius:0.625rem;
background:var(--vibeui-layout-011-accent);color:#000000;
font:inherit;font-size:0.9375rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="layout-011"] [data-part="composer"] button:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-011"] a:focus-visible,
[data-vibeui-block="layout-011"] button:focus-visible,
[data-vibeui-block="layout-011"] input:focus-visible{
outline:2px solid var(--vibeui-layout-011-accent);outline-offset:2px;
}
@container (min-width: 58rem){
[data-vibeui-block="layout-011"] [data-part="frame"]{
display:grid;grid-template-columns:11rem 19rem minmax(0,1fr);
grid-template-rows:34rem;
}
[data-vibeui-block="layout-011"] [data-part="rail"]{
flex-direction:column;align-items:stretch;overflow:visible;
padding:1rem 0.75rem;
}
[data-vibeui-block="layout-011"] [data-part="app"]{margin:0 0 1rem}
[data-vibeui-block="layout-011"] [data-part="threads"]{
border-bottom:0;border-right:1px solid var(--vibeui-layout-011-line);
}
[data-vibeui-block="layout-011"] [data-part="dialog"]{min-height:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Layout011Section[] = [
  { label: "Входящие", href: "#inbox", current: true },
  { label: "Важное", href: "#starred" },
  { label: "Архив", href: "#archive" },
]

const DEFAULT_THREADS: Layout011Thread[] = [
  { name: "Марина Ковалёва", preview: "Отправила макеты на согласование", time: "12:40", unread: true, current: true },
  { name: "Поддержка · Атлас", preview: "Заявка № 4182 закрыта", time: "11:05" },
  { name: "Команда витрины", preview: "Собрание перенесли на четверг", time: "Вчера", unread: true },
  { name: "Сергей Панов", preview: "Спасибо, всё получилось!", time: "Вчера" },
]

function DemoDialog() {
  return (
    <>
      <div data-part="bubble">Добрый день! Отправила макеты на согласование — посмотрите, пожалуйста, до вечера.</div>
      <div data-part="bubble" data-mine="on">Добрый! Уже смотрю. Первый вариант нравится, во втором вопрос по шапке.</div>
      <div data-part="bubble">Отлично, тогда соберу правки по второму и вернусь завтра утром.</div>
    </>
  )
}

/** Трёхпанельный сервис: разделы, список разговоров и диалог со своими прокрутками. */
export function Layout011({
  children,
  appName = "Диалог",
  sections = DEFAULT_SECTIONS,
  sectionsLabel = "Разделы",
  threadsTitle = "Разговоры",
  threads = DEFAULT_THREADS,
  threadName = "Марина Ковалёва",
  composerPlaceholder = "Написать сообщение",
  sendLabel = "Отправить",
  accent,
  className,
  style,
}: Layout011Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-011" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-011" className={className} style={palette}>
        <div data-part="frame">
          <nav data-part="rail" aria-label={sectionsLabel}>
            <span data-part="app">{appName}</span>
            {sections.map((section) => (
              <a
                key={section.href}
                href={section.href}
                aria-current={section.current ? "page" : undefined}
              >
                {section.label}
              </a>
            ))}
          </nav>
          <section data-part="threads" aria-label={threadsTitle}>
            <h2>{threadsTitle}</h2>
            <div data-part="thread-list">
              {threads.map((thread) => (
                <a
                  data-part="thread"
                  data-unread={thread.unread ? "on" : undefined}
                  aria-current={thread.current ? "true" : undefined}
                  href="#thread"
                  key={thread.name}
                >
                  <span data-part="thread-top">
                    <strong>{thread.name}</strong>
                    <time>{thread.time}</time>
                  </span>
                  <p>{thread.preview}</p>
                </a>
              ))}
            </div>
          </section>
          <section data-part="dialog" aria-label={threadName}>
            <div data-part="dialog-top">{threadName}</div>
            <div data-part="messages">{children ?? <DemoDialog />}</div>
            <form data-part="composer" action="#send">
              <input type="text" name="message" placeholder={composerPlaceholder} aria-label={composerPlaceholder} />
              <button type="submit">{sendLabel}</button>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}
