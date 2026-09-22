import type { ComponentProps, CSSProperties } from "react"

export type Card131Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  code?: string
  image?: string
  imageAlt?: string
  city?: string
  date?: string
  title?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-131"]){
--vibeui-card-131-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-131-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-131-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-card-131-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-card-131-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-card-131-sand:light-dark(#f4f4f4,#242424);
--vibeui-card-131-script:"Lobster","Brush Script MT",cursive;
--vibeui-card-131-sea:#2aa7a0;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-131"]{color-scheme:dark}
[data-vibeui-block="card-131"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-131"] *{box-sizing:border-box}
[data-vibeui-block="card-131"]{position:relative;display:grid;grid-template-columns:5.5rem minmax(0,1fr);gap:1rem;padding:1.1rem;border:1px solid var(--vibeui-card-131-line);border-radius:1rem;background:color-mix(in oklab,var(--vibeui-card-131-sand) 60%,transparent);transition:border-color .3s,transform .3s,box-shadow .3s}
[data-vibeui-block="card-131"][data-active="true"]{border-color:var(--vibeui-card-131-accent);transform:translateY(-.25rem);box-shadow:0 24px 40px -28px rgb(18 58 75 / .5)}
[data-vibeui-block="card-131"] figure{margin:0;width:5.5rem;height:5.5rem;border-radius:50%;overflow:hidden;background:var(--vibeui-card-131-sand);box-shadow:0 0 0 3px var(--vibeui-card-131-bg),0 0 0 4px var(--vibeui-card-131-line)}
[data-vibeui-block="card-131"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="card-131"] small{display:block;padding-right:3.2rem;font-family:var(--vibeui-card-131-display);font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-card-131-sea)}
[data-vibeui-block="card-131"] h3{margin:.2rem 0 .3rem;font-family:var(--vibeui-card-131-display);font-size:1.35rem;font-weight:600;line-height:1.1;text-transform:uppercase}
[data-vibeui-block="card-131"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-131-muted)}
[data-vibeui-block="card-131"] [data-part="code"]{position:absolute;top:.6rem;right:.8rem;font-family:var(--vibeui-card-131-script);font-size:1.2rem;color:var(--vibeui-card-131-accent);opacity:.8}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-131"] *{animation:none!important;transition:none!important}}
`

/** Карточка остановки: фото, название, код и описание; активна по data-active. */
export function Card131({
  code = "Остановка маршрута",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  city = "Остановка маршрута",
  date = "Остановка маршрута",
  title = "Остановка маршрута",
  text = "Остановка маршрута",
  accent,
  className,
  style,
  ...props
}: Card131Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-131-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-131" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-131"
        className={className}
        style={palette}
      >
        <figure>{image ? <img src={image} alt={imageAlt ?? ""} loading="lazy" /> : null}</figure>
        <div>
          <small>
            {city} · {date}
          </small>
          <h3>{title}</h3>
          {text ? <p>{text}</p> : null}
        </div>
        <span data-part="code" aria-hidden="true">
          {code}
        </span>
      </li>
    </>
  )
}
