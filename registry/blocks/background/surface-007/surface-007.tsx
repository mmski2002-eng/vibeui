import type { CSSProperties, ReactNode } from "react"

export type Surface007Props = {
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
:where([data-vibeui-block="surface-007"]){
--vibeui-surface-007-ink:#ffffff;
--vibeui-surface-007-muted:color-mix(in oklab,#ffffff 78%,#1a1a1a);
--vibeui-surface-007-scrim:52%;
--vibeui-surface-007-accent:#ff5900;
--vibeui-surface-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-007"][data-scrim="strong"]){
--vibeui-surface-007-scrim:72%;
}
[data-vibeui-block="surface-007"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:#1a1a1a;color:var(--vibeui-surface-007-ink);
font-family:var(--vibeui-surface-007-font);
}
[data-vibeui-block="surface-007"] *{box-sizing:border-box}
[data-vibeui-block="surface-007"] [data-part="media"]{
position:absolute;inset:0;
}
[data-vibeui-block="surface-007"] [data-part="media"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="surface-007"] [data-part="placeholder"]{
position:absolute;inset:0;
background:
linear-gradient(#8d9aa5 0%,#b9c0c4 44%,#6d6a63 44.2%,#4a4640 70%,#2e2b27 100%);
}
[data-vibeui-block="surface-007"] [data-part="placeholder"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(30rem 16rem at 74% 34%,rgb(255 214 170 / 34%),transparent 62%);
}
[data-vibeui-block="surface-007"] [data-part="scrim"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(color-mix(in oklab,#000000 calc(var(--vibeui-surface-007-scrim)*0.5),transparent),transparent 34%,transparent 52%,color-mix(in oklab,#000000 var(--vibeui-surface-007-scrim),transparent));
}
[data-vibeui-block="surface-007"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:30rem;
padding:4rem 1.5rem 3rem;display:flex;flex-direction:column;justify-content:flex-end;gap:1rem;
}
[data-vibeui-block="surface-007"][data-align="start"] [data-part="frame"]{justify-content:flex-start}
[data-vibeui-block="surface-007"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-007-muted);
}
[data-vibeui-block="surface-007"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-007-accent);
}
[data-vibeui-block="surface-007"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
text-shadow:0 1px 24px rgb(0 0 0 / 35%);
}
[data-vibeui-block="surface-007"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-007-muted);
}
[data-vibeui-block="surface-007"] [data-part="actions"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:0.5rem;
}
[data-vibeui-block="surface-007"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.75rem;padding:0.375rem 1.375rem;
background:var(--vibeui-surface-007-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="surface-007"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="surface-007"] [data-part="ghost"]{
display:inline-flex;align-items:center;min-height:2.75rem;padding:0.375rem 1.375rem;
border:1px solid color-mix(in oklab,#ffffff 44%,transparent);color:var(--vibeui-surface-007-ink);
text-decoration:none;font-size:1rem;font-weight:540;
backdrop-filter:blur(4px);
}
[data-vibeui-block="surface-007"] a:focus-visible{
outline:2px solid var(--vibeui-surface-007-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-007"] [data-part="frame"]{padding:6rem 3rem 4rem;min-height:36rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-007"] *{animation:none!important;transition:none!important}}
`

/** Фон-фотография с вуалью под текст: атмосфера места поверх брендового интерфейса. */
export function Surface007({
  children,
  src,
  alt = "",
  focus = "center",
  scrim = "soft",
  align = "end",
  accent,
  className,
  style,
}: Surface007Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-007"
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
            <>
              <p data-part="kicker">Отель «Перевал»</p>
              <h2 data-part="title">Тишина на высоте два километра</h2>
              <p data-part="lede">
                Фотография задаёт атмосферу, вуаль держит контраст, а
                действия остаются фирменными — оранжевыми поверх любого кадра.
              </p>
              <div data-part="actions">
                <a data-part="action" href="#book">
                  Забронировать
                </a>
                <a data-part="ghost" href="#rooms">
                  Смотреть номера
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
