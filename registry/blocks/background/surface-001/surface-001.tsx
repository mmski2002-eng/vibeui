import type { CSSProperties, ReactNode } from "react"
import { Mockup011 } from "@/registry/components/mockup/mockup-011/mockup-011"

export type Surface001Props = {
  /** Контент поверх фотографии. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Адрес фотографии. Без него рисуется стилизованная заглушка. */
  src?: string
  /** Описание изображения; пустая строка — декоративный кадр. */
  alt?: string
  /** Точка кадрирования, как в object-position. */
  focus?: string
  /** Сила тёмной вуали под текстом. */
  scrim?: "soft" | "strong"
  /** Положение текстовой зоны. */
  align?: "start" | "end"
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Фотографическая атмосфера: полноформатное фото, намеренный кадр и
// градиентная вуаль под текстом. Фотография сохраняет естественные
// цвета; навигация и действия поверх остаются брендовыми. Вуаль — не
// вычисление по пикселям, а заранее выбранная тёмная зона с проверенным
// контрастом. Изображение передаётся пропом src; заглушка — CSS-пейзаж.
const STYLES = `
:where([data-vibeui-block="surface-001"]){
--vibeui-surface-001-ink:light-dark(#000000,#ffffff);
--vibeui-surface-001-muted:light-dark(color-mix(in oklab,#000000 66%,#ffffff),color-mix(in oklab,#ffffff 78%,#1a1a1a));
--vibeui-surface-001-veil:light-dark(#ffffff,#000000);
--vibeui-surface-001-scrim:52%;
--vibeui-surface-001-ghost:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-surface-001-ghost-soft:light-dark(color-mix(in oklab,#000000 13%,transparent),color-mix(in oklab,#ffffff 16%,transparent));
--vibeui-surface-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-001"][data-scrim="strong"]){
--vibeui-surface-001-scrim:72%;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-001"]{color-scheme:dark}
:where([data-vibeui-block="surface-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-001"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:#1a1a1a;color:var(--vibeui-surface-001-ink);
font-family:var(--vibeui-surface-001-font);
}
[data-vibeui-block="surface-001"] *{box-sizing:border-box}
[data-vibeui-block="surface-001"] [data-part="ghost"]{flex:1}
[data-vibeui-block="surface-001"] [data-part="media"]{
position:absolute;inset:0;
}
[data-vibeui-block="surface-001"] [data-part="media"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="surface-001"] [data-part="placeholder"]{
position:absolute;inset:0;
background:
linear-gradient(#8d9aa5 0%,#b9c0c4 44%,#6d6a63 44.2%,#4a4640 70%,#2e2b27 100%);
}
[data-vibeui-block="surface-001"] [data-part="placeholder"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(30rem 16rem at 74% 34%,rgb(255 214 170 / 34%),transparent 62%);
}
[data-vibeui-block="surface-001"] [data-part="scrim"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(color-mix(in oklab,var(--vibeui-surface-001-veil) calc(var(--vibeui-surface-001-scrim)*0.5),transparent),transparent 34%,transparent 52%,color-mix(in oklab,var(--vibeui-surface-001-veil) var(--vibeui-surface-001-scrim),transparent));
}
[data-vibeui-block="surface-001"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:30rem;
padding:2.5rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
[data-vibeui-block="surface-001"][data-align="start"] [data-part="ghost"]{justify-content:flex-start}
@container (min-width: 48rem){
[data-vibeui-block="surface-001"] [data-part="frame"]{padding:6rem 3rem 4rem;min-height:36rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-001"] *{animation:none!important;transition:none!important}}
`

/** Фон-фотография с вуалью под текст: атмосфера места поверх брендового интерфейса. */
export function Surface001({
  children,
  src,
  alt = "",
  focus = "center",
  scrim = "soft",
  align = "end",
  tone = "auto",
  accent,
  className,
  style,
}: Surface001Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-001"
        data-tone={tone === "auto" ? undefined : tone}
        data-scrim={scrim === "strong" ? "strong" : undefined}
        data-align={align === "start" ? "start" : undefined}
        className={className}
        style={palette}
      >
        {src ? (
          <div data-part="media">
            <img src={src} alt={alt} style={{ objectPosition: focus }} />
          </div>
        ) : (
          <div data-part="placeholder" role="img" aria-label="Горный пейзаж на закате" />
        )}
        <div data-part="scrim" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <Mockup011 data-part="ghost"  accent={accent} />
          )}
        </div>
      </section>
    </>
  )
}
