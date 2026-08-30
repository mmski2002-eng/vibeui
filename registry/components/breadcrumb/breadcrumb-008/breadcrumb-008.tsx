import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb008Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  path?: string
  separator?: string
  accent?: string
}

// Идея компонента: путь файловой системы, а не сайта. Он приходит одной
// строкой и разбирается на уровни, потому что путь так и хранится; собирать
// массив вручную ради показа — лишняя работа. Шрифт моноширинный: в путях
// важны точки, дефисы и регистр, а пропорциональный шрифт их смазывает.
const STYLES = `
:where([data-vibeui-block="breadcrumb-008"]){
--vibeui-breadcrumb-008-fg:oklch(0.28 0.014 265);
--vibeui-breadcrumb-008-muted:oklch(0.55 0.012 265);
--vibeui-breadcrumb-008-bg:oklch(0.97 0.003 265);
--vibeui-breadcrumb-008-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-008-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="breadcrumb-008"]{
display:inline-block;max-width:100%;box-sizing:border-box;
padding:0.3125rem 0.5rem;
border:1px solid var(--vibeui-breadcrumb-008-border);border-radius:0.5rem;
background:var(--vibeui-breadcrumb-008-bg);
font-family:var(--vibeui-breadcrumb-008-mono);font-size:0.75rem;line-height:1.4;
color:var(--vibeui-breadcrumb-008-muted);
}
[data-vibeui-block="breadcrumb-008"] ol{
display:flex;align-items:center;gap:0.125rem;flex-wrap:wrap;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-008"] li{display:inline-flex;align-items:center;gap:0.125rem;min-width:0}
/* Разделитель в CSS: иначе скринридер прочитает «слэш» на каждом уровне. */
[data-vibeui-block="breadcrumb-008"] li + li::before{
content:var(--vibeui-breadcrumb-008-separator,"/");color:oklch(0.75 0.01 265);
}
[data-vibeui-block="breadcrumb-008"] a{
color:inherit;text-decoration:none;padding:0 0.0625rem;border-radius:0.1875rem;
}
[data-vibeui-block="breadcrumb-008"] a:hover{color:var(--vibeui-breadcrumb-008-fg);background:oklch(0.93 0.006 265)}
[data-vibeui-block="breadcrumb-008"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-008-accent);outline-offset:1px}
/* Имя файла выделено: в длинном пути глаз ищет именно его. */
[data-vibeui-block="breadcrumb-008"] [aria-current="page"]{color:var(--vibeui-breadcrumb-008-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Путь файловой системы: строка разбирается на уровни, шрифт моноширинный.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb008({
  path = "registry/components/breadcrumb/breadcrumb-008.tsx",
  separator = "/",
  accent,
  className,
  style,
  ...props
}: Breadcrumb008Props) {
  const parts = path.split(separator).filter(Boolean)
  const palette = {
    "--vibeui-breadcrumb-008-separator": `"${separator}"`,
    ...(accent ? { "--vibeui-breadcrumb-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-008"
        aria-label="Путь к файлу"
        className={className}
        style={palette}
      >
        <ol>
          {parts.map((part, index) => {
            const last = index === parts.length - 1

            return (
              <li key={`${part}-${index}`}>
                {last ? (
                  <span aria-current="page">{part}</span>
                ) : (
                  <a href="#">{part}</a>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
