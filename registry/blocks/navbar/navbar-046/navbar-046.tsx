"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar046Link = { label: string; href: string }

export type Navbar046Props = {
  brand?: string
  tagline?: string
  links?: readonly Navbar046Link[]
  phone?: string
  ctaLabel?: string
  ctaHref?: string
  menuLabel?: string
  homeLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Прозрачная шапка поверх фото первого экрана: отрицательный нижний отступ
// кладёт её на хиро, а после первых пикселей прокрутки она превращается в
// матовое стекло. Тонкая янтарная нить снизу — прогресс прокрутки страницы.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="navbar-046"]'
const STYLES = `
:where(${S}){
--vibeui-navbar-046-bg:light-dark(#f4f1ec,#0e0f10);
--vibeui-navbar-046-fg:light-dark(#16181a,#f2efe9);
--vibeui-navbar-046-accent:#e8a35c;
--vibeui-navbar-046-on-accent:oklch(from var(--vibeui-navbar-046-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-046-muted:color-mix(in oklab,var(--vibeui-navbar-046-fg) 64%,transparent);
--vibeui-navbar-046-line:color-mix(in oklab,var(--vibeui-navbar-046-fg) 14%,transparent);
--vibeui-navbar-046-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-046-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-navbar-046-h:4.75rem;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{position:sticky;top:0;z-index:40;height:var(--vibeui-navbar-046-h);margin-bottom:calc(var(--vibeui-navbar-046-h) * -1);color:var(--vibeui-navbar-046-fg);font-family:var(--vibeui-navbar-046-font);font-size:.875rem;transition:background-color .5s,backdrop-filter .5s,box-shadow .5s;container-type:inline-size}
${S} *{box-sizing:border-box}
${S}[data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-046-bg) 72%,transparent);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);box-shadow:inset 0 -1px 0 var(--vibeui-navbar-046-line)}
${S} [data-part="bar"]{display:flex;align-items:center;gap:1.5rem;height:100%;max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="brand"]{display:flex;align-items:center;gap:.7rem;color:inherit;text-decoration:none;margin-right:auto}
${S} [data-part="brand"] svg{width:1.9rem;height:1.9rem;color:var(--vibeui-navbar-046-accent);transition:transform .6s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="brand"]:hover svg{transform:translateY(-2px) rotate(-4deg)}
${S} [data-part="brand"] b{display:block;font-weight:700;font-size:.95rem;letter-spacing:.22em;text-transform:uppercase}
${S} [data-part="brand"] small{display:block;font-size:.66rem;color:var(--vibeui-navbar-046-muted);letter-spacing:.04em}
${S} [data-part="links"]{display:none;gap:.25rem;margin:0;padding:0;list-style:none}
${S} [data-part="links"] a{position:relative;display:block;padding:.5rem .8rem;color:var(--vibeui-navbar-046-muted);text-decoration:none;transition:color .3s}
${S} [data-part="links"] a::after{content:"";position:absolute;left:.8rem;right:.8rem;bottom:.3rem;height:1px;background:var(--vibeui-navbar-046-accent);transform:scaleX(0);transform-origin:right;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="links"] a:hover{color:var(--vibeui-navbar-046-fg)}
${S} [data-part="links"] a:hover::after{transform:scaleX(1);transform-origin:left}
${S} [data-part="phone"]{display:none;font-family:var(--vibeui-navbar-046-mono);font-size:.8rem;color:inherit;text-decoration:none;letter-spacing:.02em}
${S} [data-part="cta"]{display:inline-flex;align-items:center;gap:.6rem;height:2.6rem;padding:0 .35rem 0 1.15rem;border-radius:999px;background:var(--vibeui-navbar-046-fg);color:var(--vibeui-navbar-046-bg);font-weight:600;text-decoration:none;white-space:nowrap;transition:background-color .35s,color .35s}
${S} [data-part="cta"] i{display:grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;background:var(--vibeui-navbar-046-bg);color:var(--vibeui-navbar-046-fg);transition:transform .45s cubic-bezier(.2,.8,.2,1),background-color .35s}
${S} [data-part="cta"]:hover i{transform:rotate(45deg)}
${S} [data-part="cta"] svg{width:.9rem;height:.9rem}
${S} [data-part="burger"]{display:grid;place-items:center;width:2.6rem;height:2.6rem;padding:0;border:1px solid var(--vibeui-navbar-046-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer}
${S} [data-part="burger"] span{position:relative;display:block;width:1rem;height:1px;background:currentColor;transition:background-color .3s}
${S} [data-part="burger"] span::before,${S} [data-part="burger"] span::after{content:"";position:absolute;left:0;width:100%;height:1px;background:currentColor;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="burger"] span::before{transform:translateY(-4px)}
${S} [data-part="burger"] span::after{transform:translateY(4px)}
${S}[data-open="true"] [data-part="burger"] span{background:transparent}
${S}[data-open="true"] [data-part="burger"] span::before{transform:rotate(45deg)}
${S}[data-open="true"] [data-part="burger"] span::after{transform:rotate(-45deg)}
${S} [data-part="sheet"]{position:absolute;top:100%;left:.75rem;right:.75rem;display:grid;gap:.25rem;padding:.75rem;border:1px solid var(--vibeui-navbar-046-line);border-radius:1.25rem;background:color-mix(in oklab,var(--vibeui-navbar-046-bg) 92%,transparent);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);opacity:0;transform:translateY(-.5rem);pointer-events:none;transition:opacity .35s,transform .35s cubic-bezier(.2,.8,.2,1)}
${S}[data-open="true"] [data-part="sheet"]{opacity:1;transform:none;pointer-events:auto}
${S} [data-part="sheet"] a{padding:.8rem .9rem;border-radius:.8rem;color:inherit;text-decoration:none;font-size:1.05rem}
${S} [data-part="sheet"] a:hover{background:var(--vibeui-navbar-046-line)}
${S} [data-part="progress"]{position:absolute;left:0;bottom:0;height:1px;width:100%;background:var(--vibeui-navbar-046-accent);transform-origin:left;transform:scaleX(var(--vibeui-navbar-046-p,0))}
${S} a:focus-visible,${S} button:focus-visible{outline:2px solid var(--vibeui-navbar-046-accent);outline-offset:2px}
@container (min-width: 64rem){${S} [data-part="links"]{display:flex}${S} [data-part="burger"],${S} [data-part="sheet"]{display:none}}
@container (min-width: 76rem){${S} [data-part="phone"]{display:block}}
@media (prefers-reduced-motion:reduce){${S},${S} *{transition:none!important}}
${S} [data-part="cta"]{position:relative;isolation:isolate;overflow:hidden;transition:color .55s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="cta"]::before{content:"";position:absolute;z-index:-1;right:.45rem;top:50%;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-navbar-046-accent);transform:translateY(-50%) scale(0);transition:transform .75s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="cta"]:hover::before{transform:translateY(-50%) scale(28)}
${S} [data-part="cta"]:hover{color:var(--vibeui-navbar-046-on-accent);box-shadow:0 14px 34px -14px color-mix(in oklab,var(--vibeui-navbar-046-accent) 70%,transparent)}
${S} [data-part="cta"]:active{transform:scale(.965);transition-duration:.12s}
${S} [data-part="cta"] i{overflow:hidden}
${S} [data-part="cta"]:hover i{transform:none}
${S} [data-part="cta"]:hover i svg{animation:vibeui-navbar-046-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="burger"]{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="burger"] svg{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="burger"]:active{transform:scale(.9);transition-duration:.12s}
@keyframes vibeui-navbar-046-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-navbar-046-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_LINKS: Navbar046Link[] = [
  { label: "Проекты", href: "#projects" },
  { label: "Стоимость", href: "#calc" },
  { label: "Технология", href: "#tech" },
  { label: "Этапы", href: "#stages" },
  { label: "Построенные дома", href: "#built" },
]

/** Прозрачная шапка поверх фото, при прокрутке — стекло. */
export function Navbar046({
  brand = "Сосна",
  tagline = "дома из клеёного бруса",
  links = DEFAULT_LINKS,
  phone = "+7 (812) 407-18-42",
  ctaLabel = "Обсудить дом",
  ctaHref = "#contact",
  menuLabel = "Меню",
  homeLabel = "На главную",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar046Props) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 24)
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const first = requestAnimationFrame(update)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(first)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-046-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-046-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-046-bg": background } : null),
    "--vibeui-navbar-046-p": progress,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-046" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-046" data-tone={tone === "auto" ? undefined : tone} data-scrolled={scrolled || open} data-open={open} className={className} style={palette}>
        <nav data-part="bar">
          <a data-part="brand" href="#top" aria-label={homeLabel}>
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 15 16 4l12 11" />
              <path d="M7.5 12.5V27h17V12.5" />
              <path d="M7.5 17.5h17M7.5 22h17" opacity=".55" />
              <path d="M14 27v-5h4v5" />
            </svg>
            <span>
              <b>{brand}</b>
              {tagline ? <small>{tagline}</small> : null}
            </span>
          </a>
          <ul data-part="links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          {phone ? (
            <a data-part="phone" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              {phone}
            </a>
          ) : null}
          <a data-part="cta" href={ctaHref}>
            {ctaLabel}
            <i aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M5 11 11 5M6 5h5v5" />
              </svg>
            </i>
          </a>
          <button data-part="burger" type="button" aria-label={menuLabel} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span />
          </button>
        </nav>
        <div data-part="sheet" aria-hidden={!open}>
          {links.map((link) => (
            <a key={link.href} href={link.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          {phone ? (
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} tabIndex={open ? 0 : -1}>
              {phone}
            </a>
          ) : null}
        </div>
        <span data-part="progress" aria-hidden="true" />
      </header>
    </>
  )
}
