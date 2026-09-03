import type { CSSProperties } from "react"

export type Features010Integration = {
  name: string
  category: string
}

export type Features010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  integrations?: Features010Integration[]
  action?: { label: string; href: string }
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: витрина интеграций без единого логотипа-картинки. Каждая плитка
// рисует монограмму: первая буква названия на подложке, оттенок которой
// посчитан из самого названия — плитки различимы между собой, но остаются в
// одной палитре и не требуют ни SVG-файлов, ни лицензий на чужие знаки.
// Сетка автозаполняемая (auto-fill + minmax), поэтому число колонок зависит
// от ширины блока, а не от заранее выбранного числа.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Монограмма красится
// прямо в своём правиле, а не через переменную: оттенок плитки приходит
// инлайном, а подстановка var() внутри переменной считается один раз на корне.
const STYLES = `
:where([data-vibeui-block="features-010"]){
--vibeui-features-010-bg:transparent;
--vibeui-features-010-fg:light-dark(oklch(0.2 0.012 265),oklch(0.95 0.005 265));
--vibeui-features-010-muted:light-dark(oklch(0.52 0.012 265),oklch(0.72 0.012 265));
--vibeui-features-010-card:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-features-010-line:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-features-010-accent:light-dark(oklch(0.52 0.16 268),oklch(0.76 0.14 268));
--vibeui-features-010-hue:268;
--vibeui-features-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-010"]{color-scheme:dark}
[data-vibeui-block="features-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-010-bg);color:var(--vibeui-features-010-fg);
font-family:var(--vibeui-features-010-sans);
}
[data-vibeui-block="features-010"] *{box-sizing:border-box}
[data-vibeui-block="features-010"] [data-part="shell"]{max-width:70rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-010"] [data-part="head"]{max-width:36rem;margin-bottom:2rem}
[data-vibeui-block="features-010"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-010-accent);
}
[data-vibeui-block="features-010"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-010"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-010-muted);text-wrap:pretty;
}
[data-vibeui-block="features-010"] ul{
list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;
grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr));
}
[data-vibeui-block="features-010"] li{
display:flex;align-items:center;gap:0.75rem;padding:0.875rem;
border:1px solid var(--vibeui-features-010-line);border-radius:0.875rem;background:var(--vibeui-features-010-card);
transition:border-color .16s ease,transform .16s ease;
}
[data-vibeui-block="features-010"] li:hover{border-color:var(--vibeui-features-010-accent);transform:translateY(-2px)}
[data-vibeui-block="features-010"] [data-part="mono"]{
flex:0 0 auto;width:2.25rem;height:2.25rem;border-radius:0.625rem;
display:flex;align-items:center;justify-content:center;
background:light-dark(oklch(0.94 0.05 var(--vibeui-features-010-hue)),oklch(0.34 0.06 var(--vibeui-features-010-hue)));color:light-dark(oklch(0.42 0.13 var(--vibeui-features-010-hue)),oklch(0.87 0.09 var(--vibeui-features-010-hue)));
font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="features-010"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:650;letter-spacing:-0.005em}
[data-vibeui-block="features-010"] [data-part="cat"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-features-010-muted)}
[data-vibeui-block="features-010"] [data-part="foot"]{
display:flex;flex-direction:column;align-items:flex-start;gap:0.75rem;margin-top:1.75rem;
}
[data-vibeui-block="features-010"] a{
display:inline-flex;align-items:center;gap:0.375rem;height:2.5rem;padding:0 1.125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-features-010-line);background:var(--vibeui-features-010-card);
font-size:0.875rem;font-weight:650;color:var(--vibeui-features-010-fg);text-decoration:none;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="features-010"] a:hover{border-color:var(--vibeui-features-010-accent);color:var(--vibeui-features-010-accent)}
[data-vibeui-block="features-010"] a:focus-visible{outline:2px solid var(--vibeui-features-010-accent);outline-offset:3px}
[data-vibeui-block="features-010"] [data-part="note"]{margin:0;font-size:0.8125rem;color:var(--vibeui-features-010-muted)}
@container (min-width: 34rem){
[data-vibeui-block="features-010"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-010"] [data-part="foot"]{flex-direction:row;align-items:center;justify-content:space-between}
}
@container (min-width: 60rem){
[data-vibeui-block="features-010"] [data-part="shell"]{padding:6rem 2.5rem}
[data-vibeui-block="features-010"] [data-part="head"]{margin-bottom:2.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_INTEGRATIONS: Features010Integration[] = [
  { name: "Next.js", category: "Фреймворк" },
  { name: "Vite", category: "Сборка" },
  { name: "Remix", category: "Фреймворк" },
  { name: "Astro", category: "Фреймворк" },
  { name: "Tailwind", category: "Стили" },
  { name: "shadcn", category: "Реестр" },
  { name: "Storybook", category: "Документация" },
  { name: "Figma", category: "Дизайн" },
  { name: "GitHub", category: "Хранилище" },
  { name: "Vercel", category: "Хостинг" },
]

// Оттенок выводится из названия: одно и то же имя всегда даёт один цвет,
// поэтому плитки не перекрашиваются при переупорядочивании списка.
function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

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

/** Блок интеграций: плитки с монограммами, оттенок каждой посчитан из названия. */
export function Features010({
  eyebrow = "Интеграции",
  title = "Работает там, где вы уже работаете",
  lede = "Секции не требуют своего рантайма и не спорят с вашим стеком: это обычные React-файлы со своим CSS.",
  integrations = DEFAULT_INTEGRATIONS,
  action = { label: "Все интеграции", href: "#" },
  note = "Не нашли свой стек? Секция всё равно поставится — ей нужен только React.",
  background = "",
  accent,
  className,
  style,
}: Features010Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <ul>
            {integrations.slice(0, 12).map((integration) => (
              <li
                key={integration.name}
                style={
                  {
                    "--vibeui-features-010-hue": String(hue(integration.name)),
                  } as CSSProperties
                }
              >
                <span data-part="mono" aria-hidden="true">
                  {integration.name.slice(0, 1)}
                </span>
                <span>
                  <span data-part="name">{integration.name}</span>
                  <span data-part="cat">{integration.category}</span>
                </span>
              </li>
            ))}
          </ul>

          <div data-part="foot">
            {note ? <p data-part="note">{note}</p> : null}
            {action ? <a href={action.href}>{action.label} →</a> : null}
          </div>
        </div>
      </section>
    </>
  )
}
