import type { CSSProperties, ReactNode } from "react"

export type Surface003Props = {
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
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
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
:where([data-vibeui-block="surface-003"]){
--vibeui-surface-003-ink:light-dark(#000000,#ffffff);
--vibeui-surface-003-muted:light-dark(color-mix(in oklab,#000000 66%,#ffffff),color-mix(in oklab,#ffffff 78%,#1a1a1a));
--vibeui-surface-003-veil:light-dark(#ffffff,#000000);
--vibeui-surface-003-scrim:56%;
--vibeui-surface-003-ghost:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-surface-003-ghost-soft:light-dark(color-mix(in oklab,#000000 13%,transparent),color-mix(in oklab,#ffffff 16%,transparent));
--vibeui-surface-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-003"][data-scrim="strong"]){--vibeui-surface-003-scrim:74%}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-003"]{color-scheme:dark}
:where([data-vibeui-block="surface-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-003"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:#1a1a1a;color:var(--vibeui-surface-003-ink);
font-family:var(--vibeui-surface-003-font);
}
[data-vibeui-block="surface-003"] *{box-sizing:border-box}
[data-vibeui-block="surface-003"] [data-part="media"],
[data-vibeui-block="surface-003"] [data-part="media"] video,
[data-vibeui-block="surface-003"] [data-part="media"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="surface-003"] [data-part="placeholder"]{
position:absolute;inset:0;
background:linear-gradient(160deg,#23282e 0%,#4b5158 44%,#6e675c 72%,#221d17 100%);
}
[data-vibeui-block="surface-003"] [data-part="placeholder"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(30rem 16rem at 70% 30%,rgb(255 200 150 / 26%),transparent 62%);
}
[data-vibeui-block="surface-003"] [data-part="scrim"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(color-mix(in oklab,#000000 calc(var(--vibeui-surface-003-scrim)*0.4),transparent),transparent 36%,transparent 50%,color-mix(in oklab,var(--vibeui-surface-003-veil) var(--vibeui-surface-003-scrim),transparent));
}
[data-vibeui-block="surface-003"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:30rem;
padding:2.5rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
/* Призрак страницы с кадром: шапка сверху, подпись и действия у нижнего
   края — ровно то, что кладут поверх петли на странице отеля или бренда. */
[data-vibeui-block="surface-003"] [data-part="ghost"]{display:flex;flex-direction:column;flex:1}
[data-vibeui-block="surface-003"] [data-part="topbar"]{display:flex;align-items:center;gap:0.875rem}
[data-vibeui-block="surface-003"] [data-part="mark"]{width:1.75rem;height:1.75rem;flex:none;background:var(--vibeui-surface-003-accent);color:oklch(from var(--vibeui-surface-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="surface-003"] [data-part="topbar"] span:not([data-part]){
width:3.5rem;height:0.5rem;background:var(--vibeui-surface-003-ghost-soft);
}
[data-vibeui-block="surface-003"] [data-part="caption"]{
display:flex;flex-direction:column;gap:0.875rem;margin-top:auto;max-width:34rem;
}
[data-vibeui-block="surface-003"] [data-part="caption"] span{height:2rem;background:var(--vibeui-surface-003-ghost)}
[data-vibeui-block="surface-003"] [data-part="caption"] span:nth-child(2){width:66%}
[data-vibeui-block="surface-003"] [data-part="caption"] span:nth-child(3){
height:0.625rem;width:48%;margin-top:0.25rem;background:var(--vibeui-surface-003-ghost-soft);
}
[data-vibeui-block="surface-003"] [data-part="buttons"]{display:flex;gap:0.75rem;margin-top:1.25rem}
[data-vibeui-block="surface-003"] [data-part="buttons"] span{width:8.5rem;height:2.75rem;background:var(--vibeui-surface-003-ghost-soft)}
[data-vibeui-block="surface-003"] [data-part="buttons"] span:first-child{background:var(--vibeui-surface-003-accent);color:oklch(from var(--vibeui-surface-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@container (min-width: 48rem){
[data-vibeui-block="surface-003"] [data-part="frame"]{padding-block:3.5rem;min-height:36rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="surface-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="surface-003"] [data-part="media"] video{display:none}
}
`

/** Видеофон с обязательным постером: петля без звука, статика при reduced motion. */
export function Surface003({
  children,
  src,
  poster,
  controls = false,
  scrim = "soft",
  tone = "auto",
  accent,
  className,
  style,
}: Surface003Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-003"
        data-tone={tone === "auto" ? undefined : tone}
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
            <div data-part="ghost" aria-hidden="true">
              <div data-part="topbar">
                <span data-part="mark" />
                <span />
                <span />
                <span />
              </div>
              <div data-part="caption">
                <span />
                <span />
                <span />
              </div>
              <div data-part="buttons">
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
