import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card031Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  handle?: string
  name?: string
  image?: string
  text?: string
  likes?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatLikes(likes: number) {
  return new Intl.NumberFormat("ru-RU").format(likes)
}

// Часть блока testimonials-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-031"]){
--vibeui-card-031-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-031-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-031-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-031-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-031"]{color-scheme:dark}
[data-vibeui-block="card-031"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-031"] *{box-sizing:border-box}
[data-vibeui-block="card-031"]{break-inside:avoid;margin:0 0 1rem;
padding:1.25rem;border:1px solid var(--vibeui-card-031-border);border-radius:1rem;
background:var(--vibeui-card-031-card);}
[data-vibeui-block="card-031"] [data-part="post-head"]{display:flex;align-items:center;gap:0.625rem;margin-bottom:0.75rem;}
[data-vibeui-block="card-031"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="card-031"] [data-part="author-name"]{font-size:0.875rem;font-weight:640}
[data-vibeui-block="card-031"] [data-part="handle"]{color:var(--vibeui-card-031-muted);font-size:0.75rem}
[data-vibeui-block="card-031"] [data-part="text"]{margin:0;font-size:0.9375rem;line-height:1.55;overflow-wrap:break-word;}
[data-vibeui-block="card-031"] [data-part="post-foot"]{display:flex;align-items:center;gap:0.375rem;margin-top:0.875rem;
color:var(--vibeui-card-031-muted);font-size:0.75rem;font-weight:600;
font-variant-numeric:tabular-nums;}
[data-vibeui-block="card-031"] [data-part="heart"]{width:0.875rem;height:0.875rem;flex:none;
color:var(--vibeui-card-031-accent);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-031"] *{animation:none!important;transition:none!important}}
`

/** Карточка в стиле поста: аватар, имя и хэндл в шапке, текст поста и строка реакций внизу. */
export function Card031({
  handle = "@akovaleva",
  name = "Анна Ковалёва",
  image,
  text = "Собрала лендинг курса за вечер. Выбрала блоки в каталоге, скинула агенту — он поставил всё сам. Утром поправила тексты и запустила рекламу.",
  likes = 214,
  accent,
  className,
  style,
  ...props
}: Card031Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-031" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-031"
        className={className}
        style={palette}
      >
        <header data-part="post-head">
          <Avatar001 data-part="avatar" name={name} src={image} status="none" aria-hidden="true" />
          <span data-part="who">
            <span data-part="author-name">{name}</span>
            <span data-part="handle">{handle}</span>
          </span>
        </header>
        <p data-part="text">{text}</p>
        <footer data-part="post-foot">
          <svg
            data-part="heart"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21s-6.7-4.3-9.3-8.1C.6 9.9 1.6 5.9 4.9 4.6c2-.8 4.3-.2 5.8 1.4l1.3 1.3 1.3-1.3c1.5-1.6 3.8-2.2 5.8-1.4 3.3 1.3 4.3 5.3 2.2 8.3C18.7 16.7 12 21 12 21Z" />
          </svg>
          <span aria-label={`Отметок «нравится»: ${likes}`}>
            {formatLikes(likes)}
          </span>
        </footer>
      </article>
    </>
  )
}
