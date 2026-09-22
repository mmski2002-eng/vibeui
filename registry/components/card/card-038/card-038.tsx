import type { ComponentProps, CSSProperties } from "react"

export type Card038Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  handle?: string
  name?: string
  role?: string
  text?: string
  stack?: readonly string[]
  metric?: string
  stackLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

// Часть блока testimonials-034, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-038"]){
--vibeui-card-038-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-038-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-038-line:color-mix(in oklab,var(--vibeui-card-038-fg) 12%,transparent);
--vibeui-card-038-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-038-muted:color-mix(in oklab,var(--vibeui-card-038-fg) 60%,var(--vibeui-card-038-bg));
--vibeui-card-038-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-038"]{color-scheme:dark}
[data-vibeui-block="card-038"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-038"] *{box-sizing:border-box}
[data-vibeui-block="card-038"]{display:grid;gap:.9rem;padding:1.2rem;border:1px solid var(--vibeui-card-038-line);border-radius:1rem;background:var(--vibeui-card-038-bg);transition:border-color .3s,box-shadow .3s,transform .3s}
[data-vibeui-block="card-038"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-038-accent) 55%,transparent);box-shadow:0 0 50px -20px var(--vibeui-card-038-accent);transform:translateY(-3px)}
[data-vibeui-block="card-038"] [data-part="who"]{display:grid;grid-template-columns:auto 1fr;gap:.7rem;align-items:center}
[data-vibeui-block="card-038"] [data-part="avatar"]{display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:.55rem;background:color-mix(in oklab,var(--vibeui-card-038-accent) 16%,transparent);color:var(--vibeui-card-038-accent);font-family:var(--vibeui-card-038-mono);font-weight:600;font-size:.8rem}
[data-vibeui-block="card-038"] [data-part="handle"]{font-family:var(--vibeui-card-038-mono);font-size:.82rem;font-weight:600}
[data-vibeui-block="card-038"] [data-part="role"]{font-size:.76rem;color:var(--vibeui-card-038-muted)}
[data-vibeui-block="card-038"] [data-part="quote"]{margin:0;font-size:.98rem;line-height:1.55}
[data-vibeui-block="card-038"] [data-part="quote"]::before{content:"“";color:var(--vibeui-card-038-accent);margin-right:.1em}
[data-vibeui-block="card-038"] [data-part="quote"]::after{content:"”";color:var(--vibeui-card-038-accent);margin-left:.1em}
[data-vibeui-block="card-038"] [data-part="stack"]{display:flex;flex-wrap:wrap;gap:.3rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="card-038"] [data-part="stack"] li{padding:.15rem .5rem;border:1px solid var(--vibeui-card-038-line);border-radius:.35rem;font-family:var(--vibeui-card-038-mono);font-size:.66rem;color:var(--vibeui-card-038-muted)}
[data-vibeui-block="card-038"] [data-part="metric"]{margin:0;padding-top:.8rem;border-top:1px dashed var(--vibeui-card-038-line);font-family:var(--vibeui-card-038-mono);font-size:.76rem;color:var(--vibeui-card-038-accent)}
[data-vibeui-block="card-038"] [data-part="metric"]::before{content:"$ ";color:var(--vibeui-card-038-muted)}
@container (min-width: 64rem){
[data-vibeui-block="card-038"]:nth-child(3n+2){transform:translateY(1.5rem)}
[data-vibeui-block="card-038"]:nth-child(3n+2):hover{transform:translateY(calc(1.5rem - 3px))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-038"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва в духе комментария к коду: аватар и хэндл, моноширинный текст, метка стека и ссылка на профиль. */
export function Card038({
  handle = "@sergey_v",
  name = "Сергей Волков",
  role = "Индивидуальный разработчик",
  text = "Десяти тысяч бесплатных хватает на пет-проект с запасом. Ключ выдали за полминуты, карту не просили. Документация — с примерами на четырёх языках.",
  stack = [],
  metric,
  stackLabel = "Стек",
  accent,
  className,
  style,
  ...props
}: Card038Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-038-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-038" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-038"
        className={className}
        style={palette}
      >
        <div data-part="who">
          <span data-part="avatar" aria-hidden="true">
            {initials(name)}
          </span>
          <div>
            <div data-part="handle">{handle}</div>
            <div data-part="role">
              {name} · {role}
            </div>
          </div>
        </div>
        <blockquote data-part="quote">{text}</blockquote>
        {stack && stack.length > 0 ? (
          <ul data-part="stack" aria-label={stackLabel}>
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {metric ? <p data-part="metric">{metric}</p> : null}
      </li>
    </>
  )
}
