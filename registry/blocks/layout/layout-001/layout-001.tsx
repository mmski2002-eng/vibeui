import type { CSSProperties, ReactNode } from "react"

export type Layout001Props = {
  /** Секции страницы. Без них каркас показывает демонстрационный лендинг. */
  children?: ReactNode
  /** Слот шапки: сюда ставится ваш navbar. */
  header?: ReactNode
  /** Слот футера. */
  footer?: ReactNode
  /** Ширина контентной колонки. */
  width?: "narrow" | "normal" | "wide"
  /** Вертикальный ритм секций. */
  rhythm?: "calm" | "tight"
  /** Тонкие разделители между секциями. */
  dividers?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вертикальный лендинг с выразительным ритмом: обычный поток документа,
// секции разной высоты, чередование плотных и свободных участков. Каркас
// объявляет слоты (шапка, секции, футер), ширину колонки и вертикальный
// ритм — содержимое произвольное. Владелец прокрутки — сам документ:
// каркас не создаёт внутренних scroll-областей и ничего не закрепляет.
const STYLES = `
:where([data-vibeui-block="layout-001"]){
--vibeui-layout-001-bg:#ffffff;
--vibeui-layout-001-ink:#000000;
--vibeui-layout-001-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-001-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-001-panel:#f2f2f2;
--vibeui-layout-001-accent:#ff5900;
--vibeui-layout-001-width:72rem;
--vibeui-layout-001-gap:6rem;
--vibeui-layout-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="layout-001"][data-width="narrow"]){--vibeui-layout-001-width:56rem}
:where([data-vibeui-block="layout-001"][data-width="wide"]){--vibeui-layout-001-width:84rem}
:where([data-vibeui-block="layout-001"][data-rhythm="tight"]){--vibeui-layout-001-gap:3.5rem}
[data-vibeui-block="layout-001"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-001-bg);color:var(--vibeui-layout-001-ink);
font-family:var(--vibeui-layout-001-font);
}
[data-vibeui-block="layout-001"] *{box-sizing:border-box}
[data-vibeui-block="layout-001"] [data-part="main"]{
display:flex;flex-direction:column;
padding:clamp(2.5rem,6cqi,4.5rem) 1rem;gap:var(--vibeui-layout-001-gap);
max-width:var(--vibeui-layout-001-width);margin:0 auto;
}
[data-vibeui-block="layout-001"][data-dividers="on"] [data-part="main"]>*+*{
border-top:1px solid var(--vibeui-layout-001-line);
padding-top:var(--vibeui-layout-001-gap);
}
[data-vibeui-block="layout-001"] [data-part="hero"]{
display:flex;flex-direction:column;gap:1.25rem;align-items:flex-start;
padding-top:clamp(1rem,5cqi,4rem);
}
[data-vibeui-block="layout-001"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0;
font-size:0.8125rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-layout-001-muted);
}
[data-vibeui-block="layout-001"] [data-part="eyebrow"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-layout-001-accent);
}
[data-vibeui-block="layout-001"] [data-part="hero"] h1{
margin:0;max-width:18ch;
font-size:clamp(2.125rem,6.5cqi,4.25rem);line-height:1.04;letter-spacing:-0.025em;font-weight:680;
}
[data-vibeui-block="layout-001"] [data-part="hero"] p{
margin:0;max-width:46ch;font-size:1.125rem;line-height:1.6;
color:var(--vibeui-layout-001-muted);
}
[data-vibeui-block="layout-001"] [data-part="actions"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:0.5rem;
}
[data-vibeui-block="layout-001"] [data-part="primary"]{
display:inline-flex;align-items:center;min-height:2.75rem;padding:0.375rem 1.375rem;
background:var(--vibeui-layout-001-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="layout-001"] [data-part="primary"]:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-001"] [data-part="ghost"]{
display:inline-flex;align-items:center;min-height:2.75rem;padding:0.375rem 1.375rem;
border:1px solid var(--vibeui-layout-001-line);color:var(--vibeui-layout-001-ink);
text-decoration:none;font-size:1rem;font-weight:540;
}
[data-vibeui-block="layout-001"] [data-part="proof"]{
display:flex;flex-wrap:wrap;gap:1rem 2.5rem;align-items:center;
color:var(--vibeui-layout-001-muted);font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="layout-001"] [data-part="section-title"]{
margin:0 0 0.625rem;max-width:24ch;
font-size:clamp(1.5rem,3.6cqi,2.375rem);line-height:1.12;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="layout-001"] [data-part="section-lede"]{
margin:0 0 2rem;max-width:52ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-layout-001-muted);
}
[data-vibeui-block="layout-001"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1rem;
}
[data-vibeui-block="layout-001"] [data-part="cell"]{
background:var(--vibeui-layout-001-panel);padding:1.5rem;
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="layout-001"] [data-part="cell"] strong{
font-size:1.0625rem;font-weight:640;letter-spacing:-0.01em;
}
[data-vibeui-block="layout-001"] [data-part="cell"] span{
font-size:0.9375rem;line-height:1.55;color:var(--vibeui-layout-001-muted);
}
[data-vibeui-block="layout-001"] [data-part="split"]{
display:grid;gap:2rem;align-items:center;
}
[data-vibeui-block="layout-001"] [data-part="figure"]{
min-height:16rem;background:linear-gradient(135deg,#1a1a1a 0%,#000000 70%),#1a1a1a;
position:relative;overflow:hidden;
}
[data-vibeui-block="layout-001"] [data-part="figure"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(24rem 14rem at 78% 18%,color-mix(in oklab,var(--vibeui-layout-001-accent) 36%,transparent),transparent 65%);
}
[data-vibeui-block="layout-001"] [data-part="finale"]{
background:#1a1a1a;color:#ffffff;padding:clamp(2rem,6cqi,4rem);
display:flex;flex-direction:column;gap:1rem;align-items:flex-start;
}
[data-vibeui-block="layout-001"] [data-part="finale"] h2{
margin:0;max-width:22ch;
font-size:clamp(1.625rem,4.2cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-001"] [data-part="finale"] p{
margin:0;max-width:46ch;font-size:1.0625rem;line-height:1.6;
color:color-mix(in oklab,#ffffff 66%,#1a1a1a);
}
[data-vibeui-block="layout-001"] a:focus-visible{
outline:2px solid var(--vibeui-layout-001-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="layout-001"] [data-part="main"]{padding:clamp(2.5rem,6cqi,4.5rem) 2rem}
[data-vibeui-block="layout-001"] [data-part="split"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-001"] *{animation:none!important;transition:none!important}}
`

function DemoContent() {
  return (
    <>
      <section data-part="hero">
        <p data-part="eyebrow">Каркас лендинга</p>
        <h1>Страница, которая ведёт к действию</h1>
        <p>
          Естественный поток документа: выразительный первый экран,
          доказательства, возможности и финальное предложение. Секции разной
          высоты создают ритм — без принудительных полноэкранных блоков.
        </p>
        <div data-part="actions">
          <a data-part="primary" href="#start">
            Попробовать бесплатно
          </a>
          <a data-part="ghost" href="#how">
            Как это работает
          </a>
        </div>
      </section>
      <section data-part="proof" aria-label="Нам доверяют">
        <span>Северсталь·Дизайн</span>
        <span>Контур Лаб</span>
        <span>Атлас Групп</span>
        <span>Ясно.Медиа</span>
      </section>
      <section>
        <h2 data-part="section-title">Возможности, разложенные по полочкам</h2>
        <p data-part="section-lede">
          Плотная секция после свободного hero: сетка панелей выравнивается
          сама и перестраивается в одну колонку на телефоне.
        </p>
        <div data-part="grid">
          <div data-part="cell">
            <strong>Быстрый старт</strong>
            <span>Первый результат за вечер, без месяца настройки.</span>
          </div>
          <div data-part="cell">
            <strong>Прозрачные данные</strong>
            <span>Показатели считаются одинаково во всех отчётах.</span>
          </div>
          <div data-part="cell">
            <strong>Командная работа</strong>
            <span>Роли и доступы без писем администратору.</span>
          </div>
        </div>
      </section>
      <section data-part="split">
        <div>
          <h2 data-part="section-title">Деталь крупным планом</h2>
          <p data-part="section-lede">
            Двухколоночная секция: текст рядом с иллюстрацией. На телефоне
            колонки складываются в смысловом порядке — сначала текст.
          </p>
        </div>
        <div data-part="figure" role="img" aria-label="Тёмная иллюстрация с тёплым светом" />
      </section>
      <section data-part="finale">
        <h2>Готовы начать?</h2>
        <p>Финальное предложение закрывает страницу одним ясным действием.</p>
        <a data-part="primary" href="#start">
          Создать аккаунт
        </a>
      </section>
    </>
  )
}

/** Каркас вертикального лендинга: слоты, ширина колонки и ритм секций. */
export function Layout001({
  children,
  header,
  footer,
  width = "normal",
  rhythm = "calm",
  dividers = false,
  accent,
  className,
  style,
}: Layout001Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="layout-001"
        data-width={width === "normal" ? undefined : width}
        data-rhythm={rhythm === "calm" ? undefined : rhythm}
        data-dividers={dividers ? "on" : undefined}
        className={className}
        style={palette}
      >
        {header}
        <main data-part="main">{children ?? <DemoContent />}</main>
        {footer}
      </div>
    </>
  )
}
