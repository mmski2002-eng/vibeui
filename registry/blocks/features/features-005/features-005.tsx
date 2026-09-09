import type { CSSProperties } from "react"

export type Features005Group = {
  title: string
  items: string[]
}

export type Features005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  groups?: Features005Group[]
  excluded?: string[]
  excludedTitle?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: список с галочками, у которого есть вторая половина — то, чего
// в продукте нет. Честный «не входит» снимает половину вопросов в продажах и
// отличает секцию от бесконечной простыни преимуществ. Галочка и крестик —
// это ::before у li, а не иконка в разметке: список остаётся чистым <ul>,
// который переживёт любую вставку пунктов, и скринридер читает только текст.
const STYLES = `
:where([data-vibeui-block="features-005"]){
--vibeui-features-005-bg:light-dark(oklch(0.975 0.012 160),oklch(0.21 0.03 160));
--vibeui-features-005-fg:light-dark(oklch(0.22 0.02 160),oklch(0.97 0.006 160));
--vibeui-features-005-muted:light-dark(oklch(0.48 0.02 160),oklch(0.75 0.02 160));
--vibeui-features-005-line:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 14%));
--vibeui-features-005-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.78 0.16 39.8));
--vibeui-features-005-no:light-dark(oklch(0.52 0.12 39.8),oklch(0.72 0.11 39.8));
--vibeui-features-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-005"]{color-scheme:dark}
[data-vibeui-block="features-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-005-bg);color:var(--vibeui-features-005-fg);
font-family:var(--vibeui-features-005-sans);
}
[data-vibeui-block="features-005"] *{box-sizing:border-box}
[data-vibeui-block="features-005"] [data-part="shell"]{max-width:66rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-005"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-005-accent);
}
[data-vibeui-block="features-005"] h2{
margin:0;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.5rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-005"] [data-part="lede"]{
margin:0.875rem 0 0;max-width:34rem;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-005-muted);text-wrap:pretty;
}
[data-vibeui-block="features-005"] [data-part="groups"]{display:grid;grid-template-columns:1fr;gap:2rem;margin-top:2.5rem}
[data-vibeui-block="features-005"] h3{
margin:0 0 1rem;padding-bottom:0.625rem;border-bottom:1px solid var(--vibeui-features-005-line);
font-size:0.8125rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--vibeui-features-005-muted);
}
[data-vibeui-block="features-005"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="features-005"] li{
position:relative;padding-left:1.875rem;font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="features-005"] li::before{
content:"";position:absolute;left:0;top:0.0625rem;width:1.25rem;height:1.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-features-005-accent) 22%,transparent);
}
[data-vibeui-block="features-005"] li::after{
content:"";position:absolute;left:0.375rem;top:0.4375rem;width:0.5rem;height:0.25rem;
border-left:2px solid var(--vibeui-features-005-accent);border-bottom:2px solid var(--vibeui-features-005-accent);
transform:rotate(-45deg);
}
[data-vibeui-block="features-005"] [data-part="no"] li{color:var(--vibeui-features-005-muted)}
[data-vibeui-block="features-005"] [data-part="no"] li::before{background:color-mix(in oklab,var(--vibeui-features-005-no) 22%,transparent)}
[data-vibeui-block="features-005"] [data-part="no"] li::after{
left:0.34375rem;top:0.625rem;width:0.5625rem;height:0;transform:none;
border-left:0;border-bottom:2px solid var(--vibeui-features-005-no);
}
@container (min-width: 34rem){
[data-vibeui-block="features-005"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-005"] [data-part="groups"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.5rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-005"] [data-part="groups"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:3rem}
[data-vibeui-block="features-005"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Features005Group[] = [
  {
    title: "В каждой секции",
    items: [
      "Собственная палитра в CSS-переменных",
      "Раскладка от ширины блока",
      "Поддержка prefers-reduced-motion",
      "Семантическая разметка и видимый фокус",
    ],
  },
  {
    title: "В поставке",
    items: [
      "Один файл без внешних импортов",
      "Инструкция для ИИ-агента",
      "shadcn-совместимый реестр",
      "Пропсы с готовыми значениями",
    ],
  },
]

const DEFAULT_EXCLUDED = [
  "Обязательная регистрация",
  "Сборщик и плагины в вашем проекте",
  "Библиотека иконок в зависимостях",
  "Привязка к нашей теме и токенам",
]

/** Список с галочками и честной колонкой «не входит»: маркеры нарисованы псевдоэлементами. */
export function Features005({
  eyebrow = "Что вы получаете",
  title = "Список без звёздочек и мелкого шрифта",
  lede = "Слева — то, что есть в каждой секции. Справа — то, чего в ней нет и не появится.",
  groups = DEFAULT_GROUPS,
  excluded = DEFAULT_EXCLUDED,
  excludedTitle = "Чего нет",
  accent,
  className,
  style,
}: Features005Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <div data-part="groups">
            {groups.slice(0, 2).map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.slice(0, 6).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            {excluded.length > 0 ? (
              <div data-part="no">
                <h3>{excludedTitle}</h3>
                <ul>
                  {excluded.slice(0, 6).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
