import type { CSSProperties } from "react"
import { Footerlinks022 } from "@/registry/components/navigation/footerlinks-022/footerlinks-022"

export type Footer030Link = {
  label: string
  href: string
}

export type Footer030Props = {
  name?: string
  /** Строка под именем: «дизайн и фронтенд · Тбилиси». */
  caption?: string
  links?: readonly Footer030Link[]
  /** Подпись справа: «сделано руками, без шаблонов». */
  sign?: string
  year?: string
  topLabel?: string
  topHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал личного сайта в одну полосу: имя плотным гротеском, подпись,
// ссылки в ряд, год и «сделано руками», справа кнопка «наверх» со стрелкой,
// которая при наведении уезжает вверх и возвращается. Линия сверху,
// ничего лишнего.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=Golos+Text:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-030"]){
--vibeui-footer-030-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-030-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-030-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-030-on-accent:oklch(from var(--vibeui-footer-030-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-footer-030-muted:color-mix(in oklab,var(--vibeui-footer-030-fg) 60%,var(--vibeui-footer-030-bg));
--vibeui-footer-030-line:color-mix(in oklab,var(--vibeui-footer-030-fg) 12%,transparent);
--vibeui-footer-030-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-030-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-030-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-030"]{color-scheme:dark}
:where([data-vibeui-block="footer-030"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-030"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-030"]{box-sizing:border-box;padding:2.5rem 0;background:var(--vibeui-footer-030-bg);color:var(--vibeui-footer-030-fg);font-family:var(--vibeui-footer-030-font);font-size:.92rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-030-line)}
[data-vibeui-block="footer-030"] *{box-sizing:border-box}
[data-vibeui-block="footer-030"] [data-part="links"]{margin:0}
[data-vibeui-block="footer-030"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:1.5rem;align-items:center}
[data-vibeui-block="footer-030"] [data-part="name"]{font-family:var(--vibeui-footer-030-display);font-weight:800;font-size:1.4rem;letter-spacing:-.04em;line-height:1}
[data-vibeui-block="footer-030"] [data-part="name"] small{display:block;margin-top:.3rem;font-family:var(--vibeui-footer-030-mono);font-weight:400;font-size:.72rem;letter-spacing:0;color:var(--vibeui-footer-030-muted)}
[data-vibeui-block="footer-030"] [data-part="right"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;font-family:var(--vibeui-footer-030-mono);font-size:.72rem;color:var(--vibeui-footer-030-muted)}
[data-vibeui-block="footer-030"] [data-part="top"]{display:inline-grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;border:1px solid var(--vibeui-footer-030-line);color:inherit;text-decoration:none;overflow:hidden;transition:background .2s,color .2s,border-color .2s,transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="footer-030"] [data-part="top"] i{font-style:normal;display:block;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-030"] [data-part="top"]:hover{background:var(--vibeui-footer-030-accent);color:var(--vibeui-footer-030-on-accent);border-color:transparent;transform:scale(1.1);box-shadow:0 10px 24px -10px color-mix(in oklab,var(--vibeui-footer-030-accent) 70%,transparent)}
[data-vibeui-block="footer-030"] [data-part="top"]:hover i{animation:vibeui-footer-030-up .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-030"] a:focus-visible{outline:2px solid var(--vibeui-footer-030-accent);outline-offset:3px}
@keyframes vibeui-footer-030-up{0%{transform:translateY(0)}45%{transform:translateY(-140%)}50%{transform:translateY(140%)}100%{transform:translateY(0)}}
@container (min-width: 56rem){[data-vibeui-block="footer-030"] [data-part="shell"]{grid-template-columns:auto 1fr auto;gap:3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-030"] *{animation:none!important;transition:none!important}}`

/** Подвал личного сайта в одну полосу с кнопкой «наверх». */
export function Footer030({
  name = "Даня Лунёв",
  caption = "дизайн и фронтенд · Тбилиси",
  links = [
    { label: "Проекты", href: "#work" },
    { label: "Обо мне", href: "#about" },
    { label: "Отзывы", href: "#words" },
    { label: "Контакт", href: "#contact" },
  ],
  sign = "сделано руками, без шаблонов",
  year = "2026",
  topLabel = "Наверх",
  topHref = "#top",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer030Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-030-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-030-fg": ink } : null),
    ...(background ? { "--vibeui-footer-030-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-030" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-030" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="name">
            {name}
            {caption ? <small>{caption}</small> : null}
          </div>
          <Footerlinks022 data-part="links" links={links} accent={accent} />
          <div data-part="right">
            <span>
              © {year}
              {sign ? ` · ${sign}` : ""}
            </span>
            <a data-part="top" href={topHref} aria-label={topLabel}>
              <i aria-hidden="true">↑</i>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
