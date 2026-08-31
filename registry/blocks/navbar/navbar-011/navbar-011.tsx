import type { CSSProperties } from "react"

type Navbar011Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar011Props = {
  project?: string
  section?: string
  versions?: string[]
  currentVersion?: string
  links?: Navbar011Link[]
  repoLabel?: string
  repoHref?: string
  stars?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка документации. Главное её отличие от шапки сайта — выбор версии:
// человек, попавший сюда из поисковика, обязан сразу видеть, о какой версии
// читает. Выбор сделан нативным <select> внутри формы: он работает без JS,
// на телефоне открывает системный список и не требует клиентского состояния.
const STYLES = `
:where([data-vibeui-block="navbar-011"]){
--vibeui-navbar-011-bg:oklch(0.99 0.003 250);
--vibeui-navbar-011-ink:oklch(0.24 0.014 250);
--vibeui-navbar-011-muted:oklch(0.54 0.014 250);
--vibeui-navbar-011-border:oklch(0.9 0.006 250);
--vibeui-navbar-011-accent:oklch(0.5 0.16 200);
--vibeui-navbar-011-accent-fg:oklch(0.99 0 0);
--vibeui-navbar-011-mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
--vibeui-navbar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-011"]{
display:block;background:var(--vibeui-navbar-011-bg);color:var(--vibeui-navbar-011-ink);
border-bottom:1px solid var(--vibeui-navbar-011-border);
font-family:var(--vibeui-navbar-011-font);
}
[data-vibeui-block="navbar-011"] [data-part="shell"]{
display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap;
max-width:84rem;margin:0 auto;padding:0.6875rem 1rem;
}
[data-vibeui-block="navbar-011"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:0.9375rem;font-weight:680;letter-spacing:-0.015em;
}
[data-vibeui-block="navbar-011"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:0.4375rem;flex:none;
display:grid;place-items:center;
background:var(--vibeui-navbar-011-ink);color:var(--vibeui-navbar-011-bg);
font-family:var(--vibeui-navbar-011-mono);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="navbar-011"] [data-part="section"]{
padding:0.125rem 0.4375rem;border:1px solid var(--vibeui-navbar-011-border);border-radius:0.375rem;
color:var(--vibeui-navbar-011-muted);
font-family:var(--vibeui-navbar-011-mono);font-size:0.6875rem;letter-spacing:0.02em;
}
[data-vibeui-block="navbar-011"] [data-part="version"]{
appearance:none;cursor:pointer;flex:none;
height:1.875rem;padding:0 1.75rem 0 0.625rem;
border:1px solid var(--vibeui-navbar-011-border);border-radius:0.5rem;
background:var(--vibeui-navbar-011-bg);color:var(--vibeui-navbar-011-ink);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:right 0.75rem center,right 0.5rem center;
background-size:0.25rem 0.25rem,0.25rem 0.25rem;
background-repeat:no-repeat;
font-family:var(--vibeui-navbar-011-mono);font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="navbar-011"] [data-part="links"]{
order:5;flex:1 1 100%;display:flex;align-items:center;gap:1rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-navbar-011-border);
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-011"] [data-part="links"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-011"] [data-part="links"] a{
color:var(--vibeui-navbar-011-muted);text-decoration:none;white-space:nowrap;
font-size:0.875rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-011"] [data-part="links"] a:hover{color:var(--vibeui-navbar-011-ink)}
[data-vibeui-block="navbar-011"] [data-part="links"] a[aria-current="page"]{color:var(--vibeui-navbar-011-accent);font-weight:620}
[data-vibeui-block="navbar-011"] [data-part="repo"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin-left:auto;flex:none;
height:1.875rem;padding:0 0.625rem;
border:1px solid var(--vibeui-navbar-011-border);border-radius:0.5rem;
color:var(--vibeui-navbar-011-ink);text-decoration:none;font-size:0.8125rem;font-weight:560;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-011"] [data-part="repo"]:hover{border-color:var(--vibeui-navbar-011-accent)}
[data-vibeui-block="navbar-011"] [data-part="stars"]{
padding-left:0.4375rem;border-left:1px solid var(--vibeui-navbar-011-border);
color:var(--vibeui-navbar-011-muted);font-family:var(--vibeui-navbar-011-mono);font-size:0.75rem;
}
[data-vibeui-block="navbar-011"] a:focus-visible,
[data-vibeui-block="navbar-011"] select:focus-visible{outline:2px solid var(--vibeui-navbar-011-accent);outline-offset:2px}
@container (min-width: 54rem){
[data-vibeui-block="navbar-011"] [data-part="shell"]{padding:0.6875rem 2rem;gap:1rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-011"] [data-part="links"]{order:0;flex:1 1 auto;padding-top:0;border-top:0;overflow:visible;margin-left:0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VERSIONS = ["v4.2 (текущая)", "v4.1", "v3.9 LTS", "v2.14"]

const DEFAULT_LINKS: Navbar011Link[] = [
  { label: "Начало работы", href: "#start", current: true },
  { label: "Руководства", href: "#guides" },
  { label: "Справочник API", href: "#api" },
  { label: "Миграция", href: "#migration" },
  { label: "Changelog", href: "#changelog" },
]

/** Шапка документации: раздел, выбор версии нативным select и ссылка на репозиторий. */
export function Navbar011({
  project = "Плита",
  section = "docs",
  versions = DEFAULT_VERSIONS,
  currentVersion = "v4.2 (текущая)",
  links = DEFAULT_LINKS,
  repoLabel = "GitHub",
  repoHref = "#repo",
  stars = "4.1k",
  accent,
  className,
  style,
}: Navbar011Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-011" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              П
            </span>
            {project}
          </a>
          <span data-part="section">{section}</span>
          <select
            data-part="version"
            name="version"
            aria-label="Версия документации"
            defaultValue={currentVersion}
          >
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
          <nav data-part="links" aria-label="Разделы документации">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="repo" href={repoHref}>
            {repoLabel}
            <span data-part="stars">{stars}</span>
          </a>
        </div>
      </header>
    </>
  )
}
