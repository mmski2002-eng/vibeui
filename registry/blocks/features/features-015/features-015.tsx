import type { CSSProperties } from "react"

export type Features015Group = {
  title: string
  specs: { label: string; value: string }[]
}

export type Features015Props = {
  eyebrow?: string
  title?: string
  lede?: string
  groups?: Features015Group[]
  footnote?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: технические характеристики так, как их печатают в даташите.
// Каждая группа — <dl> с парами «параметр — значение»: на узкой ширине пары
// идут строками с точечным заполнителем между названием и значением, на
// широкой — двумя колонками. Значения набраны моноширинным шрифтом и
// tabular-nums, поэтому цифры выстраиваются столбиком и таблицу можно
// читать по вертикали, не сравнивая символы глазами.
const STYLES = `
:where([data-vibeui-block="features-015"]){
--vibeui-features-015-bg:oklch(0.97 0.003 250);
--vibeui-features-015-fg:oklch(0.2 0.01 250);
--vibeui-features-015-muted:oklch(0.52 0.01 250);
--vibeui-features-015-card:oklch(1 0 0);
--vibeui-features-015-line:oklch(0.9 0.005 250);
--vibeui-features-015-accent:oklch(0.5 0.13 200);
--vibeui-features-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-features-015-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
[data-vibeui-block="features-015"]{
box-sizing:border-box;background:var(--vibeui-features-015-bg);color:var(--vibeui-features-015-fg);
font-family:var(--vibeui-features-015-sans);
}
[data-vibeui-block="features-015"] *{box-sizing:border-box}
[data-vibeui-block="features-015"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-015"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-family:var(--vibeui-features-015-mono);font-size:0.75rem;font-weight:600;
letter-spacing:0.1em;text-transform:uppercase;color:var(--vibeui-features-015-accent);
}
[data-vibeui-block="features-015"] h2{
margin:0;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-015"] [data-part="lede"]{
margin:0.875rem 0 0;max-width:36rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-features-015-muted);text-wrap:pretty;
}
[data-vibeui-block="features-015"] [data-part="groups"]{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:2.25rem}
[data-vibeui-block="features-015"] [data-part="group"]{
border:1px solid var(--vibeui-features-015-line);border-radius:0.875rem;background:var(--vibeui-features-015-card);overflow:hidden;
}
[data-vibeui-block="features-015"] h3{
margin:0;padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-features-015-line);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--vibeui-features-015-muted);
}
[data-vibeui-block="features-015"] dl{margin:0;padding:0.25rem 1rem 0.75rem}
[data-vibeui-block="features-015"] [data-part="spec"]{
display:flex;align-items:baseline;gap:0.5rem;padding:0.5rem 0;
border-bottom:1px dotted var(--vibeui-features-015-line);
}
[data-vibeui-block="features-015"] [data-part="spec"]:last-child{border-bottom:0}
[data-vibeui-block="features-015"] dt{margin:0;flex:1 1 auto;font-size:0.8125rem;color:var(--vibeui-features-015-muted)}
[data-vibeui-block="features-015"] dd{
margin:0;flex:0 0 auto;text-align:right;font-family:var(--vibeui-features-015-mono);
font-size:0.8125rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-015"] [data-part="footnote"]{
margin:1.25rem 0 0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-features-015-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="features-015"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-015"] [data-part="groups"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-015"] [data-part="groups"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="features-015"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Features015Group[] = [
  {
    title: "Поставка",
    specs: [
      { label: "Файлов в секции", value: "1" },
      { label: "Внешних зависимостей", value: "0" },
      { label: "Формат", value: ".tsx" },
      { label: "Целевой путь", value: "components/vibeui" },
    ],
  },
  {
    title: "Совместимость",
    specs: [
      { label: "React", value: "19+" },
      { label: "Next.js", value: "15+" },
      { label: "Tailwind", value: "не требуется" },
      { label: "Тип компонента", value: "server" },
    ],
  },
  {
    title: "Поведение",
    specs: [
      { label: "Раскладка", value: "container queries" },
      { label: "Минимальная ширина", value: "320 px" },
      { label: "Reduced motion", value: "поддержан" },
      { label: "Тёмная тема", value: "своя палитра" },
    ],
  },
]

/** Блок технических характеристик: три группы пар «параметр — значение» в стиле даташита. */
export function Features015({
  eyebrow = "Спецификация",
  title = "Технические характеристики секции",
  lede = "Всё, что обычно выясняется уже после установки: сколько файлов приедет, чего секция требует от проекта и как она себя ведёт.",
  groups = DEFAULT_GROUPS,
  footnote = "Характеристики одинаковы для всех секций каталога: это требование реестра, а не свойство конкретного блока.",
  accent,
  className,
  style,
}: Features015Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <div data-part="groups">
            {groups.slice(0, 3).map((group) => (
              <section key={group.title} data-part="group">
                <h3>{group.title}</h3>
                <dl>
                  {group.specs.slice(0, 6).map((spec) => (
                    <div key={spec.label} data-part="spec">
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          {footnote ? <p data-part="footnote">{footnote}</p> : null}
        </div>
      </section>
    </>
  )
}
