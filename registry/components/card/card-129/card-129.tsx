import type { ComponentProps, CSSProperties } from "react"

export type Card129Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-129"]){
--vibeui-card-129-card:#110e1a;
--vibeui-card-129-cyan:#22f3ff;
--vibeui-card-129-line:rgb(255 255 255 / .12);
--vibeui-card-129-muted:#a39bb5;
}
[data-vibeui-block="card-129"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-129"] *{box-sizing:border-box}
[data-vibeui-block="card-129"]{display:grid;grid-template-columns:1.6rem minmax(0,1fr);gap:.75rem;padding:.9rem 1rem;border-radius:.8rem;border:1px solid var(--vibeui-card-129-line);background:var(--vibeui-card-129-card);transition:border-color .3s,box-shadow .3s}
[data-vibeui-block="card-129"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-129-cyan) 50%,transparent);box-shadow:0 0 18px color-mix(in oklab,var(--vibeui-card-129-cyan) 20%,transparent)}
[data-vibeui-block="card-129"]::before{content:"";width:1.6rem;height:1.6rem;border-radius:.4rem;background:color-mix(in oklab,var(--vibeui-card-129-cyan) 18%,transparent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2322f3ff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4 4 10-10'/%3E%3C/svg%3E") center/1rem no-repeat;box-shadow:0 0 10px color-mix(in oklab,var(--vibeui-card-129-cyan) 40%,transparent)}
[data-vibeui-block="card-129"] b{display:block;font-weight:700}
[data-vibeui-block="card-129"] span{display:block;margin-top:.15rem;font-size:.88rem;color:var(--vibeui-card-129-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-129"] *{animation:none!important;transition:none!important}}
`

/** Пункт списка с заголовком и текстом в одной строке. */
export function Card129({
  title = "Одноразовое всё",
  text = "Иглы, картриджи, краски в капсулах и плёнка вскрываются при вас.",
  accent,
  className,
  style,
  ...props
}: Card129Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-129-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-129" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-129"
        className={className}
        style={palette}
      >
        <span>
          <b>{title}</b>
          <span>{text}</span>
        </span>
      </li>
    </>
  )
}
