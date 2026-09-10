import type { CSSProperties, ReactNode } from "react"

export type Layout017Props = {
  /** Контент страницы над футером. Без него — демонстрационная секция. */
  children?: ReactNode
  /** Слот футера. Без него — демонстрационный финальный экран. */
  footer?: ReactNode
  footerName?: string
  footerNote?: string
  contactLabel?: string
  contactHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Футер, открывающийся из-под страницы: контент лежит слоем выше, а
// финальный экран закреплён под ним sticky у нижнего края — последняя
// секция словно приподнимается, показывая подготовленный финал. Чистый
// CSS без захвата прокрутки: футер занимает реальное место в раскладке,
// длинный футер читается полностью, фокус по ссылкам штатный. При
// нехватке высоты эффект вырождается в обычный футер.
const STYLES = `
:where([data-vibeui-block="layout-017"]){
--vibeui-layout-017-bg:#ffffff;
--vibeui-layout-017-ink:#000000;
--vibeui-layout-017-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-017-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-017-accent:#ff5900;
--vibeui-layout-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-017"]{
display:block;min-width:min(100%,16rem);
background:#000000;
font-family:var(--vibeui-layout-017-font);
}
[data-vibeui-block="layout-017"] *{box-sizing:border-box}
[data-vibeui-block="layout-017"] [data-part="page"]{
position:relative;z-index:1;
background:var(--vibeui-layout-017-bg);color:var(--vibeui-layout-017-ink);
box-shadow:0 1.5rem 3rem rgb(0 0 0 / 35%);
}
[data-vibeui-block="layout-017"] [data-part="demo-section"]{
max-width:72rem;margin:0 auto;min-height:26rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1rem;
}
[data-vibeui-block="layout-017"] [data-part="demo-section"] h2{
margin:0;max-width:22ch;
font-size:clamp(1.75rem,4.4cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-017"] [data-part="demo-section"] p{
margin:0;max-width:48ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-layout-017-muted);
}
[data-vibeui-block="layout-017"] [data-part="reveal"]{
position:sticky;bottom:0;z-index:0;
}
[data-vibeui-block="layout-017"] [data-part="finale"]{
background:#000000;color:#ffffff;
min-height:22rem;display:flex;
}
[data-vibeui-block="layout-017"] [data-part="finale-inner"]{
max-width:72rem;margin:auto;width:100%;
padding:3.5rem 1.5rem;display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-017"] [data-part="finale"] h2{
margin:0;max-width:16ch;
font-size:clamp(2rem,6cqi,4rem);line-height:1.02;letter-spacing:-0.03em;font-weight:720;
}
[data-vibeui-block="layout-017"] [data-part="finale"] p{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:color-mix(in oklab,#ffffff 64%,#000000);
}
[data-vibeui-block="layout-017"] [data-part="contact"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;margin-top:0.5rem;
background:var(--vibeui-layout-017-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="layout-017"] [data-part="contact"]:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-017"] a:focus-visible{
outline:2px solid var(--vibeui-layout-017-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-017"] *{animation:none!important;transition:none!important}
[data-vibeui-block="layout-017"] [data-part="reveal"]{position:static}}
`

function DemoPage() {
  return (
    <>
      <section data-part="demo-section">
        <h2>Страница лежит поверх финала</h2>
        <p>
          Контент — верхний слой с тенью. Прокрутите ниже: последняя секция
          приподнимется и откроет финальный экран, который всё это время
          ждал под ней.
        </p>
      </section>
      <section data-part="demo-section">
        <h2>Никакого захвата прокрутки</h2>
        <p>
          Эффект построен на position:sticky у футера: колесо, клавиатура и
          якоря работают как обычно, а при reduced motion финал становится
          обычным футером в потоке.
        </p>
      </section>
    </>
  )
}

/** Футер-финал, открывающийся из-под приподнимающейся страницы. Чистый CSS. */
export function Layout017({
  children,
  footer,
  footerName = "Студия «Русло»",
  footerNote = "Проектируем дома, интерьеры и айдентику. Расскажите о задаче — ответим в течение дня.",
  contactLabel = "Обсудить проект",
  contactHref = "#contact",
  accent,
  className,
  style,
}: Layout017Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-017" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-017" className={className} style={palette}>
        <div data-part="page">{children ?? <DemoPage />}</div>
        <div data-part="reveal">
          {footer ?? (
            <footer data-part="finale">
              <div data-part="finale-inner">
                <h2>{footerName}</h2>
                <p>{footerNote}</p>
                <a data-part="contact" href={contactHref}>
                  {contactLabel}
                </a>
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  )
}
