import type { ComponentProps, CSSProperties } from "react"

export type Card143Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  look?: string
  title?: string
  year?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-143"]){
--vibeui-card-143-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-143-dur-1:130ms;
--vibeui-card-143-dur-4:340ms;
--vibeui-card-143-dur-5:460ms;
--vibeui-card-143-ease:cubic-bezier(.32,.72,0,1);
--vibeui-card-143-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-143"]{color-scheme:dark}
[data-vibeui-block="card-143"]{box-sizing:border-box}
[data-vibeui-block="card-143"] *{box-sizing:border-box}
[data-vibeui-block="card-143"]{display:flex;flex-direction:column;gap:0.5625rem;color:inherit;text-decoration:none;}
[data-vibeui-block="card-143"] [data-part="shot"]{position:relative;aspect-ratio:4/3;display:block;overflow:hidden;border-radius:0.875rem;
background:linear-gradient(158deg,#2a2a2a 0%,#000000 88%);
transition:transform var(--vibeui-card-143-dur-5) var(--vibeui-card-143-ease),box-shadow var(--vibeui-card-143-dur-4) ease;}
[data-vibeui-block="card-143"] [data-part="shot"]::after{content:"";position:absolute;inset:0;}
[data-vibeui-block="card-143"][data-look="paper"] [data-part="shot"]{background:linear-gradient(158deg,#f2f2f2 0%,#d8d4cc 100%);}
[data-vibeui-block="card-143"][data-look="paper"] [data-part="shot"]::after{background:
radial-gradient(circle at 66% 40%,var(--vibeui-card-143-accent) 0 2.75rem,transparent 2.75rem),
linear-gradient(#000000 0 0) 22% 74%/38% 1.5px no-repeat,
linear-gradient(#000000 0 0) 22% 82%/24% 1.5px no-repeat;}
[data-vibeui-block="card-143"][data-look="dark"] [data-part="shot"]::after{background:
linear-gradient(transparent 62%,rgb(0 0 0 / 55%) 100%),
linear-gradient(104deg,transparent 46%,color-mix(in oklab,var(--vibeui-card-143-accent) 60%,transparent) 50%,transparent 54%);}
[data-vibeui-block="card-143"][data-look="warm"] [data-part="shot"]{background:linear-gradient(158deg,#3a2a1e 0%,#6b3a16 62%,#1a1a1a 100%);}
[data-vibeui-block="card-143"][data-look="warm"] [data-part="shot"]::after{background:
radial-gradient(10rem 7rem at 26% 18%,rgb(255 196 128 / 42%),transparent 66%),
linear-gradient(rgb(255 214 164 / 26%) 0 0) 12% 100%/26% 62% no-repeat;}
[data-vibeui-block="card-143"][data-look="night"] [data-part="shot"]{background:linear-gradient(178deg,#1a1a1a 0%,#2a2f36 44%,#6b3a16 100%);}
[data-vibeui-block="card-143"][data-look="night"] [data-part="shot"]::after{background:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 120' preserveAspectRatio='none'%3E%3Cpath fill='%23000000' d='M0,86 L70,44 L128,80 L196,34 L262,78 L330,40 L400,76 L400,120 L0,120 Z'/%3E%3C/svg%3E") bottom/100% 52% no-repeat,
radial-gradient(3rem 3rem at 74% 24%,rgb(255 214 164 / 88%),transparent 70%);}
[data-vibeui-block="card-143"]:hover [data-part="shot"]{transform:translateY(-0.25rem);
box-shadow:0 1rem 2.25rem color-mix(in oklab,#000000 22%,transparent);}
[data-vibeui-block="card-143"] [data-part="meta"]{display:flex;align-items:baseline;gap:0.5rem;}
[data-vibeui-block="card-143"] [data-part="title"]{font-size:0.9375rem;font-weight:600;letter-spacing:-0.01em;
transition:color var(--vibeui-card-143-dur-1) ease;}
[data-vibeui-block="card-143"] [data-part="year"]{margin-left:auto;font-size:0.75rem;color:var(--vibeui-card-143-muted);
font-variant-numeric:tabular-nums;}
[data-vibeui-block="card-143"]:hover [data-part="title"]{color:var(--vibeui-card-143-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-143"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-карточка работы: кадр по data-look, название и год. */
export function Card143({
  look = "чёрно-белая печать",
  title = "Карточка работы галереи",
  year = "2024",
  accent,
  className,
  style,
  ...props
}: Card143Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-143-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-143" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="card"
        data-vibeui-block="card-143" data-look={look} href="#piece"
        className={className}
        style={palette}
      >
        <span data-part="shot" aria-hidden="true" />
        <span data-part="meta">
          <span data-part="title">{title}</span>
          <span data-part="year">{year}</span>
        </span>
      </a>
    </>
  )
}
