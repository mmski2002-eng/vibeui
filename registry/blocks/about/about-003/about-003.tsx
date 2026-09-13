import type { CSSProperties } from "react"

type About003Icon = "stack" | "spark" | "bolt" | "ring"

type About003Item = {
  icon: About003Icon
  title: string
  text: string
}

export type About003Props = {
  eyebrow?: string
  title?: string
  items?: About003Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Ценности ровной сеткой из четырёх карточек. Иконки нарисованы чистым CSS
// (псевдоэлементы, повороты, рамки) — блок не тянет иконочную библиотеку и
// не ломается без сети. Четыре простых знака: стопка, искра, молния, кольцо —
// абстрактные, чтобы не спорить с любым брендом.
const STYLES = `
:where([data-vibeui-block="about-003"]){
--vibeui-about-003-bg:transparent;
--vibeui-about-003-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-about-003-ink:light-dark(oklch(0.17 0 0),oklch(0.97 0 0));
--vibeui-about-003-muted:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-about-003-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-about-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-about-003-tint:color-mix(in oklab,var(--vibeui-about-003-accent) 12%,var(--vibeui-about-003-card));
--vibeui-about-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-about-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-003"]{color-scheme:dark}
[data-vibeui-block="about-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-about-003-bg);color:var(--vibeui-about-003-ink);
font-family:var(--vibeui-about-003-font);
}
[data-vibeui-block="about-003"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3.5rem 1.25rem;
}
[data-vibeui-block="about-003"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-about-003-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="about-003"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="about-003"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="about-003"] [data-part="card"]{
min-inline-size:0;
padding:1.5rem;border:1px solid var(--vibeui-about-003-border);border-radius:1.125rem;
background:var(--vibeui-about-003-card);
transition:border-color var(--vibeui-about-003-dur-2) ease,transform var(--vibeui-about-003-dur-2) ease;
}
[data-vibeui-block="about-003"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-about-003-accent) 40%,var(--vibeui-about-003-border));
transform:translateY(-2px);
}
[data-vibeui-block="about-003"] [data-part="icon"]{
position:relative;display:block;width:2.75rem;height:2.75rem;margin:0 0 1.125rem;
border-radius:0.75rem;background:var(--vibeui-about-003-tint);
}
[data-vibeui-block="about-003"] [data-part="icon"]::before,
[data-vibeui-block="about-003"] [data-part="icon"]::after{
content:"";position:absolute;inset:0;margin:auto;
}
[data-vibeui-block="about-003"] [data-icon="stack"]::before{
width:1rem;height:1rem;border:2px solid var(--vibeui-about-003-accent);border-radius:0.1875rem;
transform:translate(-3px,-3px);
}
[data-vibeui-block="about-003"] [data-icon="stack"]::after{
width:1rem;height:1rem;border:2px solid var(--vibeui-about-003-accent);border-radius:0.1875rem;
transform:translate(3px,3px);opacity:0.45;
}
[data-vibeui-block="about-003"] [data-icon="spark"]::before{
width:0.9375rem;height:0.9375rem;background:var(--vibeui-about-003-accent);
border-radius:0.125rem;transform:rotate(45deg);color:oklch(from var(--vibeui-about-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="about-003"] [data-icon="spark"]::after{
width:1.625rem;height:1.625rem;border:2px solid var(--vibeui-about-003-accent);
border-radius:0.375rem;transform:rotate(45deg);opacity:0.35;
}
[data-vibeui-block="about-003"] [data-icon="bolt"]::before{
width:0.875rem;height:0.4375rem;background:var(--vibeui-about-003-accent);
border-radius:0.125rem;transform:translate(-3px,-4px) skewX(-24deg);color:oklch(from var(--vibeui-about-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="about-003"] [data-icon="bolt"]::after{
width:0.875rem;height:0.4375rem;background:var(--vibeui-about-003-accent);
border-radius:0.125rem;transform:translate(3px,4px) skewX(-24deg);color:oklch(from var(--vibeui-about-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="about-003"] [data-icon="ring"]::before{
width:1.375rem;height:1.375rem;border:2.5px solid var(--vibeui-about-003-accent);border-radius:999px;
}
[data-vibeui-block="about-003"] [data-icon="ring"]::after{
width:0.375rem;height:0.375rem;background:var(--vibeui-about-003-accent);border-radius:999px;color:oklch(from var(--vibeui-about-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="about-003"] [data-part="value-title"]{
margin:0 0 0.5rem;font-size:1.0625rem;line-height:1.3;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="about-003"] [data-part="value-text"]{
margin:0;color:var(--vibeui-about-003-muted);font-size:0.9375rem;line-height:1.6;
}
@container (min-width: 40rem){
[data-vibeui-block="about-003"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="about-003"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="about-003"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: About003Item[] = [
  {
    icon: "stack",
    title: "Самодостаточность",
    text: "Блок — это один файл без зависимостей. Его можно унести в любой проект, и он продолжит работать.",
  },
  {
    icon: "spark",
    title: "Ясность для машин",
    text: "Метаданные пишем для модели так же тщательно, как код для людей: что сохранить, что адаптировать.",
  },
  {
    icon: "bolt",
    title: "Скорость без потерь",
    text: "От выбора дизайна до работающей страницы — вечер. Но скорость не оправдывает сломанную типографику.",
  },
  {
    icon: "ring",
    title: "Доступность по умолчанию",
    text: "Семантика, фокус и контраст — условие попадания в каталог, а не пункт в бэклоге на потом.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Ценности компании сеткой из четырёх карточек с CSS-иконками. */
export function About003({
  eyebrow = "Ценности",
  title = "Во что мы верим",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: About003Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-about-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-about-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="about-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {items.map((item) => (
              <article key={item.title} data-part="card">
                <span
                  data-part="icon"
                  data-icon={item.icon}
                  aria-hidden="true"
                />
                <h3 data-part="value-title">{item.title}</h3>
                <p data-part="value-text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
