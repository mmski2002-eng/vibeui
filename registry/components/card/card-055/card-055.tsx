import type { ComponentProps, CSSProperties } from "react"

export type Card055Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  ink?: string
  color?: string
  image?: string
  tag?: string
  href?: string
  role?: string
  when?: string
  text?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-055"]){
--vibeui-card-055-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
}
[data-vibeui-block="card-055"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-055"] *{box-sizing:border-box}
@keyframes vibeui-card-055-in{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-055"]{position:relative;display:grid;gap:.9rem;padding:1.1rem;border-radius:1.4rem;overflow:hidden;isolation:isolate;background:var(--vibeui-card-055-card);color:var(--vibeui-card-055-ink,#111);animation:vibeui-card-055-in .55s cubic-bezier(.2,.9,.3,1.2) both;animation-delay:calc(var(--vibeui-card-055-n) * 60ms);transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="card-055"]:hover,[data-vibeui-block="card-055"]:focus-within{transform:translateY(-4px);box-shadow:0 24px 40px -26px rgb(0 0 0 / .4)}
[data-vibeui-block="card-055"] [data-part="top"]{display:flex;align-items:center;justify-content:space-between;gap:.75rem}
[data-vibeui-block="card-055"] [data-part="avatar"]{width:4.5rem;height:4.5rem;border-radius:50%;object-fit:cover;flex:none;background:rgb(0 0 0 / .1);border:3px solid rgb(255 255 255 / .6);transition:transform .45s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="card-055"]:hover [data-part="avatar"]{transform:rotate(-8deg) scale(1.06)}
[data-vibeui-block="card-055"] [data-part="tag"]{padding:.25rem .65rem;border-radius:999px;background:rgb(255 255 255 / .55);color:#111;font-size:.75rem;font-weight:600}
[data-vibeui-block="card-055"][data-dark="true"] [data-part="tag"]{background:rgb(0 0 0 / .3);color:#fff}
[data-vibeui-block="card-055"] [data-part="name"]{margin:0;font-family:var(--vibeui-card-055-display);font-size:1.35rem;font-weight:600;line-height:1.15;letter-spacing:-.02em}
[data-vibeui-block="card-055"] [data-part="role"]{margin:.2rem 0 0;font-size:.92rem;opacity:.8}
[data-vibeui-block="card-055"] [data-part="when"]{margin:.5rem 0 0;font-size:.85rem;font-weight:500;opacity:.9}
[data-vibeui-block="card-055"] [data-part="reveal"]{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:1rem 1.1rem 1.1rem;background:var(--vibeui-card-055-card);box-shadow:0 -12px 24px -16px rgb(0 0 0 / .35);transform:translateY(102%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-055"]:hover [data-part="reveal"],[data-vibeui-block="card-055"]:focus-within [data-part="reveal"]{transform:none}
[data-vibeui-block="card-055"] [data-part="reveal"]>p{margin:0;font-size:.92rem;line-height:1.45}
[data-vibeui-block="card-055"] [data-part="reveal"]>p span{display:block;padding-top:.7rem;border-top:1px solid rgb(0 0 0 / .14)}
[data-vibeui-block="card-055"][data-dark="true"] [data-part="reveal"]>p span{border-color:rgb(255 255 255 / .25)}
[data-vibeui-block="card-055"] [data-part="reveal"] b{display:block;margin-bottom:.25rem;font-family:var(--vibeui-card-055-display);font-size:1rem;font-weight:600}
@container (min-width: 68rem){
[data-vibeui-block="card-055"] [data-part="reveal"]{padding:1.25rem 1.5rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-055"] *{animation:none!important;transition:none!important}}
`

/** Цветная карточка хедлайнера с раскрывающимся описанием: фото, имя, сцена и время, свой цвет через переменную. */
export function Card055({
  name = "Даниил Орлов",
  ink = "Хедлайнер на цветной карто…",
  color = "#98f5af",
  image = "/demo/realty/object-01.webp",
  tag = "Хедлайнер на цветной карто…",
  href = "#",
  role = "режиссёр",
  when = "Хедлайнер на цветной карто…",
  text = "Хедлайнер на цветной карто…",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card055Props) {
  const palette = {
    ["--vibeui-card-055-card" as string]: color, ["--vibeui-card-055-ink" as string]: ink ?? "#111", ["--vibeui-card-055-n" as string]: index,
    ...(accent ? { "--vibeui-card-055-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-055" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-055" data-dark={ink ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="top">
          {image ? <img data-part="avatar" src={image} alt="" loading="lazy" /> : <span data-part="avatar" />}
          {tag ? <span data-part="tag">{tag}</span> : null}
        </div>
        <div>
          <h3 data-part="name">{href ? <a href={href}>{name}</a> : name}</h3>
          <p data-part="role">{role}</p>
          {when ? <p data-part="when">{when}</p> : null}
        </div>
        {text ? (
          <div data-part="reveal" aria-hidden="true">
            <p>
              <span>
                <b>{name}</b>
                {text}
              </span>
            </p>
          </div>
        ) : null}
      </li>
    </>
  )
}
