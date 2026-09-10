import type { CSSProperties, ReactNode } from "react"

export type Surface012Props = {
  /** Контент поверх видео. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Адрес видеофайла. Без него рисуется статичная заглушка-кадр. */
  src?: string
  /** Постер: обязательный стоп-кадр до и вместо видео. */
  poster?: string
  /** Нативные элементы управления с доступной паузой. */
  controls?: boolean
  /** Сила тёмной вуали под текстом. */
  scrim?: "soft" | "strong"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Кинематографический видеофон: короткая спокойная петля с хорошим
// стоп-кадром. Видео muted, loop, playsInline, preload="metadata"; звука
// нет и не бывает. Постер обязателен: он же служит статичным кадром при
// prefers-reduced-motion (видео скрывается CSS) и при ошибке загрузки —
// пустого первого экрана не бывает. Текст стоит в устойчивой тёмной
// зоне вуали; брендовые действия отделены от движущейся картинки.
const STYLES = `
:where([data-vibeui-block="surface-012"]){
--vibeui-surface-012-ink:#ffffff;
--vibeui-surface-012-muted:color-mix(in oklab,#ffffff 78%,#1a1a1a);
--vibeui-surface-012-scrim:56%;
--vibeui-surface-012-accent:#ff5900;
--vibeui-surface-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-012"][data-scrim="strong"]){--vibeui-surface-012-scrim:74%}
[data-vibeui-block="surface-012"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:#1a1a1a;color:var(--vibeui-surface-012-ink);
font-family:var(--vibeui-surface-012-font);
}
[data-vibeui-block="surface-012"] *{box-sizing:border-box}
[data-vibeui-block="surface-012"] [data-part="media"],
[data-vibeui-block="surface-012"] [data-part="media"] video,
[data-vibeui-block="surface-012"] [data-part="media"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="surface-012"] [data-part="placeholder"]{
position:absolute;inset:0;
background:linear-gradient(160deg,#23282e 0%,#4b5158 44%,#6e675c 72%,#221d17 100%);
}
[data-vibeui-block="surface-012"] [data-part="placeholder"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(30rem 16rem at 70% 30%,rgb(255 200 150 / 26%),transparent 62%);
}
[data-vibeui-block="surface-012"] [data-part="scrim"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(color-mix(in oklab,#000000 calc(var(--vibeui-surface-012-scrim)*0.4),transparent),transparent 36%,transparent 50%,color-mix(in oklab,#000000 var(--vibeui-surface-012-scrim),transparent));
}
[data-vibeui-block="surface-012"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:30rem;
padding:4rem 1.5rem 3rem;display:flex;flex-direction:column;justify-content:flex-end;gap:1rem;
}
[data-vibeui-block="surface-012"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-012-muted);
}
[data-vibeui-block="surface-012"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-012-accent);
}
[data-vibeui-block="surface-012"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
text-shadow:0 1px 24px rgb(0 0 0 / 35%);
}
[data-vibeui-block="surface-012"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-012-muted);
}
[data-vibeui-block="surface-012"] [data-part="action"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;margin-top:0.5rem;
background:var(--vibeui-surface-012-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="surface-012"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="surface-012"] a:focus-visible{
outline:2px solid var(--vibeui-surface-012-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-012"] [data-part="frame"]{padding:6rem 3rem 4rem;min-height:36rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="surface-012"] *{animation:none!important;transition:none!important}
[data-vibeui-block="surface-012"] [data-part="media"] video{display:none}
}
`

/** Видеофон с обязательным постером: петля без звука, статика при reduced motion. */
export function Surface012({
  children,
  src,
  poster,
  controls = false,
  scrim = "soft",
  accent,
  className,
  style,
}: Surface012Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-012"
        data-scrim={scrim === "strong" ? "strong" : undefined}
        className={className}
        style={palette}
      >
        {src ? (
          <div data-part="media">
            {poster ? <img src={poster} alt="" aria-hidden="true" /> : null}
            <video
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controls={controls}
            />
          </div>
        ) : poster ? (
          <div data-part="media">
            <img src={poster} alt="" aria-hidden="true" />
          </div>
        ) : (
          <div data-part="placeholder" role="img" aria-label="Спокойный кинокадр интерьера" />
        )}
        <div data-part="scrim" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="kicker">Отель «Перевал» · фильм</p>
              <h2 data-part="title">Кино вместо заставки</h2>
              <p data-part="lede">
                Короткая петля задаёт настроение, постер держит первый
                кадр, а все смыслы продублированы текстом — видео ничего
                не рассказывает в одиночку.
              </p>
              <a data-part="action" href="#story">
                Смотреть историю
              </a>
            </>
          )}
        </div>
      </section>
    </>
  )
}
