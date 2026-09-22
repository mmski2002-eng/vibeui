import type { CSSProperties } from "react"
import { Footerlinks003 } from "@/registry/components/navigation/footerlinks-003/footerlinks-003"

export type Footer022Link = {
  label: string
  href: string
}

export type Footer022Column = {
  title: string
  links: readonly Footer022Link[]
}

export type Footer022Social = {
  /** telegram | vk | youtube | instagram | max — своя иконка; иначе первая буква. */
  kind: string
  label: string
  href: string
}

export type Footer022Props = {
  brand?: string
  brandHref?: string
  columns?: readonly Footer022Column[]
  socials?: readonly Footer022Social[]
  /** Нижняя строка: организатор, возраст, год. */
  legal?: string
  /** Цветная полоска-«лента» сверху из цветов фестиваля. */
  stripe?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал фестиваля: тонкая цветная полоска сверху из цветов направлений,
// словомарка с точкой слева и ряд иконок соцсетей справа, ниже пять
// колонок ссылок, в самом низу организатор и год. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-022"]){
--vibeui-footer-022-bg:light-dark(#ffffff,#0e0f12);
--vibeui-footer-022-fg:light-dark(#111111,#f4f4f5);
--vibeui-footer-022-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-footer-022-line:light-dark(#e8e8ea,#26272d);
--vibeui-footer-022-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-footer-022-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-022-on-accent:oklch(from var(--vibeui-footer-022-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-footer-022-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-022-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-022"]{color-scheme:dark}
:where([data-vibeui-block="footer-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-022"]{box-sizing:border-box;display:block;background:var(--vibeui-footer-022-bg);color:var(--vibeui-footer-022-fg);font-family:var(--vibeui-footer-022-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="footer-022"] *{box-sizing:border-box}
[data-vibeui-block="footer-022"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-022"] a:focus-visible{outline:2px solid var(--vibeui-footer-022-fg);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="footer-022"] [data-part="stripe"]{display:flex;height:.5rem}
[data-vibeui-block="footer-022"] [data-part="stripe"] i{flex:1;transition:flex .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-022"] [data-part="stripe"] i:hover{flex:3}
[data-vibeui-block="footer-022"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2.5rem 1.25rem 2rem}
[data-vibeui-block="footer-022"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:2rem}
[data-vibeui-block="footer-022"] [data-part="brand"]{font-family:var(--vibeui-footer-022-display);font-size:1.8rem;font-weight:700;letter-spacing:-.04em;line-height:1}
[data-vibeui-block="footer-022"] [data-part="brand"] i{font-style:normal;color:var(--vibeui-footer-022-accent);filter:brightness(.85)}
[data-vibeui-block="footer-022"] [data-part="socials"]{display:flex;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-022"] [data-part="social"]{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;background:var(--vibeui-footer-022-chip);font-weight:600;transition:transform .25s cubic-bezier(.2,.9,.3,1.3),background .2s,color .2s}
[data-vibeui-block="footer-022"] [data-part="social"]:hover{transform:translateY(-3px) rotate(-6deg);background:var(--vibeui-footer-022-fg);color:var(--vibeui-footer-022-bg)}
[data-vibeui-block="footer-022"] [data-part="social"] svg{width:1.15rem;height:1.15rem;fill:currentColor}
[data-vibeui-block="footer-022"] [data-part="columns"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1.5rem;padding-top:2rem;border-top:1px solid var(--vibeui-footer-022-line)}
[data-vibeui-block="footer-022"] [data-part="legal"]{margin:2.5rem 0 0;padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-022-line);font-size:.85rem;color:var(--vibeui-footer-022-muted)}
@container (min-width: 60rem){
[data-vibeui-block="footer-022"] [data-part="shell"]{padding:2.5rem 2rem 2rem}
[data-vibeui-block="footer-022"] [data-part="columns"]{grid-template-columns:repeat(5,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-022"] *{transition:none!important}}`

const ICONS: Record<string, string> = {
  telegram: "M9.04 15.47 8.7 20.1c.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8L22 4.8c.3-1.3-.5-1.8-1.3-1.5L2.4 10.3c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5L17.7 6.5c.5-.3 1-.2.6.2z",
  vk: "M12.8 17.4c-5.7 0-9-3.9-9.1-10.4h2.9c.1 4.8 2.2 6.8 3.9 7.2V7h2.7v4.1c1.6-.2 3.4-2.1 4-4.1h2.7c-.5 2.6-2.3 4.5-3.6 5.3 1.3.6 3.4 2.3 4.2 5.1h-3c-.6-2-2.2-3.5-4.3-3.7v3.7z",
  youtube: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z",
  instagram: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21 8.7c-.1-1.6-.4-3-1.6-4.2S16.9 3 15.3 3C13.7 2.9 10.3 2.9 8.7 3 7.1 3.1 5.7 3.4 4.5 4.6S3 7.1 3 8.7c-.1 1.6-.1 5 0 6.6.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 5 .1 6.6 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-5 0-6.6zm-2.2 8.2a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9A3.3 3.3 0 0 1 5.1 3.2c1.3-.5 4.4-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z",
}

/** Подвал фестиваля: цветная полоска, словомарка, иконки соцсетей, пять колонок и организатор. */
export function Footer022({
  brand = "тридня",
  brandHref = "#",
  columns = [
    { title: "Фестиваль", links: [{ label: "Программа", href: "#program" }, { label: "Расписание", href: "#schedule" }, { label: "Участники", href: "#lineup" }, { label: "Площадки", href: "#venues" }] },
    { title: "Билеты", links: [{ label: "Купить", href: "#tickets" }, { label: "Возврат", href: "#faq" }, { label: "Семьям", href: "#tickets" }, { label: "Промокоды", href: "#" }] },
    { title: "Гостям", links: [{ label: "Как добраться", href: "#map" }, { label: "Правила", href: "#" }, { label: "Доступная среда", href: "#faq" }, { label: "Бюро находок", href: "#" }] },
    { title: "Партнёрам", links: [{ label: "Стать участником", href: "#" }, { label: "Фуд-корт и маркет", href: "#" }, { label: "Спонсорство", href: "#" }, { label: "Пресса", href: "#" }] },
    { title: "Команда", links: [{ label: "О фестивале", href: "#about" }, { label: "Волонтёрам", href: "#" }, { label: "Вакансии", href: "#" }, { label: "Контакты", href: "#" }] },
  ],
  socials = [
    { kind: "telegram", label: "Telegram", href: "https://t.me/" },
    { kind: "vk", label: "ВКонтакте", href: "https://vk.com/" },
    { kind: "youtube", label: "YouTube", href: "https://youtube.com/" },
    { kind: "instagram", label: "Instagram", href: "https://instagram.com/" },
  ],
  legal = "Организатор — АНО «Городские выходные». Возрастная маркировка программы указана у каждого события. © 2026.",
  stripe = ["#ffe2d6", "#c2df37", "#f1ddbc", "#9854d1", "#006461", "#f3c37d", "#ffa5b1", "#122378", "#d9cafe", "#464dff", "#fdb084", "#98f5af"],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Footer022Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-022-accent": accent } : null),
    ...(background ? { "--vibeui-footer-022-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-022" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {stripe.length > 0 ? (
          <div data-part="stripe" aria-hidden="true">
            {stripe.map((color, index) => (
              <i key={index} style={{ background: color }} />
            ))}
          </div>
        ) : null}
        <div data-part="shell">
          <div data-part="top">
            <a data-part="brand" href={brandHref}>
              {brand}
              <i>.</i>
            </a>
            {socials.length > 0 ? (
              <ul data-part="socials">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a data-part="social" href={social.href} aria-label={social.label} target="_blank" rel="noreferrer noopener">
                      {ICONS[social.kind] ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d={ICONS[social.kind]} />
                        </svg>
                      ) : (
                        social.label.slice(0, 1)
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="columns">
            {columns.map((column) => (
              <Footerlinks003 key={column.title} data-part="column" title={column.title} links={column.links} accent={accent} />
            ))}
          </div>
          {legal ? <p data-part="legal">{legal}</p> : null}
        </div>
      </footer>
    </>
  )
}
