import type { CSSProperties, ReactNode } from "react"

type Layout007Work = {
  title: string
  note: string
  href: string
  /** Масштаб карточки: wide занимает всю строку. */
  size?: "wide" | "tall" | "normal"
  /** Тон заглушки кадра. */
  look?: "dark" | "paper" | "warm"
  /** Путь к фото работы; без него — тональная заглушка. */
  src?: string
}

export type Layout007Props = {
  /** Свои работы вместо демонстрационных. */
  children?: ReactNode
  heading?: string
  intro?: string
  works?: Layout007Work[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Асимметричное портфолио: крупные проекты разного масштаба, короткие
// подписи и свободные поля. Ритм создают размеры кадров — wide на всю
// строку, tall выше соседей. Прокрутка естественная, DOM-порядок
// совпадает с чтением: на телефоне работы складываются в ленту. Кадры —
// CSS-заглушки с заданной пропорцией; реальные изображения передаёт
// проект. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="layout-007"]){
--vibeui-layout-007-bg:#ffffff;
--vibeui-layout-007-ink:#000000;
--vibeui-layout-007-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-007-accent:#ff5900;
--vibeui-layout-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-007"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-007-bg);color:var(--vibeui-layout-007-ink);
font-family:var(--vibeui-layout-007-font);
}
[data-vibeui-block="layout-007"] *{box-sizing:border-box}
[data-vibeui-block="layout-007"] [data-part="shell"]{
max-width:84rem;margin:0 auto;padding:2.5rem 1rem 4rem;
display:flex;flex-direction:column;gap:2rem;
}
[data-vibeui-block="layout-007"] [data-part="intro"]{
display:flex;flex-direction:column;gap:0.75rem;max-width:40rem;
}
[data-vibeui-block="layout-007"] [data-part="intro"] h1{
margin:0;font-size:clamp(1.875rem,5cqi,3.25rem);line-height:1.05;
letter-spacing:-0.025em;font-weight:680;
}
[data-vibeui-block="layout-007"] [data-part="intro"] p{
margin:0;font-size:1.0625rem;line-height:1.6;color:var(--vibeui-layout-007-muted);
}
[data-vibeui-block="layout-007"] [data-part="grid"]{
display:grid;gap:1.5rem 1.25rem;
}
[data-vibeui-block="layout-007"] [data-part="work"]{
display:flex;flex-direction:column;gap:0.5rem;
color:inherit;text-decoration:none;min-width:0;
}
[data-vibeui-block="layout-007"] [data-part="frame"]{
aspect-ratio:4/3;overflow:hidden;position:relative;
background:linear-gradient(150deg,#1a1a1a 0%,#000000 90%);
}
[data-vibeui-block="layout-007"] [data-part="work"][data-size="wide"] [data-part="frame"]{aspect-ratio:21/9}
[data-vibeui-block="layout-007"] [data-part="work"][data-size="tall"] [data-part="frame"]{aspect-ratio:3/4}
[data-vibeui-block="layout-007"] [data-part="frame"][data-look="paper"]{
background:linear-gradient(150deg,#ececea 0%,#d2cfc8 100%);
}
[data-vibeui-block="layout-007"] [data-part="frame"][data-look="warm"]{
background:linear-gradient(150deg,#3b3129 0%,#14100d 76%);
}
[data-vibeui-block="layout-007"] [data-part="frame"][data-look="warm"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(20rem 12rem at 72% 26%,rgb(255 160 90 / 30%),transparent 64%);
}
[data-vibeui-block="layout-007"] [data-part="frame"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="layout-007"] [data-part="frame"]::before{
content:"";position:absolute;inset:0;z-index:1;
outline:1px solid color-mix(in oklab,#000000 8%,transparent);outline-offset:-1px;
}
[data-vibeui-block="layout-007"] [data-part="caption"]{
display:flex;align-items:baseline;gap:0.75rem;flex-wrap:wrap;
}
[data-vibeui-block="layout-007"] [data-part="caption"] h2{
margin:0;font-size:1.125rem;letter-spacing:-0.015em;font-weight:640;
transition:color .16s ease;
}
[data-vibeui-block="layout-007"] [data-part="work"]:hover h2{color:var(--vibeui-layout-007-accent)}
[data-vibeui-block="layout-007"] [data-part="caption"] span{
font-size:0.875rem;color:var(--vibeui-layout-007-muted);
}
[data-vibeui-block="layout-007"] [data-part="work"]:hover [data-part="frame"]{
outline:2px solid var(--vibeui-layout-007-accent);outline-offset:-2px;
}
[data-vibeui-block="layout-007"] a:focus-visible{
outline:2px solid var(--vibeui-layout-007-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="layout-007"] [data-part="shell"]{padding:3.5rem 2.5rem 5rem;gap:2.5rem}
[data-vibeui-block="layout-007"] [data-part="grid"]{
grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;
}
[data-vibeui-block="layout-007"] [data-part="work"][data-size="wide"]{grid-column:1/-1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKS: Layout007Work[] = [
  {
    title: "Дом на склоне",
    note: "Архитектура · 2026",
    href: "#w1",
    size: "wide",
    look: "warm",
  },
  { title: "Айдентика «Русла»", note: "Брендинг", href: "#w2", look: "paper" },
  { title: "Интерьер мастерской", note: "Пространство", href: "#w3", size: "tall", look: "dark" },
  { title: "Серия «Тихий свет»", note: "Фотография", href: "#w4", look: "warm" },
  { title: "Витрина «Лавки»", note: "Веб · e-commerce", href: "#w5", look: "paper" },
]

/** Асимметричное портфолио: кадры разного масштаба, подписи и свободные поля. */
export function Layout007({
  children,
  heading = "Студия «Русло»",
  intro = "Проектируем дома, интерьеры и айдентику. Показываем немного — только то, за что отвечаем от эскиза до реализации.",
  works = DEFAULT_WORKS,
  accent,
  className,
  style,
}: Layout007Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-007" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-007" className={className} style={palette}>
        <div data-part="shell">
          <div data-part="intro">
            <h1>{heading}</h1>
            <p>{intro}</p>
          </div>
          {children ?? (
            <div data-part="grid">
              {works.map((work) => (
                <a
                  data-part="work"
                  data-size={work.size === "normal" ? undefined : work.size}
                  href={work.href}
                  key={work.href}
                >
                  <span
                    data-part="frame"
                    data-look={work.look === "dark" ? undefined : work.look}
                    aria-hidden={work.src ? undefined : "true"}
                  >
                    {work.src ? <img src={work.src} alt={work.title} /> : null}
                  </span>
                  <span data-part="caption">
                    <h2>{work.title}</h2>
                    <span>{work.note}</span>
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
