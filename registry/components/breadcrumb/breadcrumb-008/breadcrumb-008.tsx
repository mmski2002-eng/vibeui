import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb008Props = Omit<ComponentProps<"nav">, "children"> & {
  path?: string
  separator?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Заливка плашки кода. Пусто — берётся своя, из палитры компонента. */
  background?: string
  accent?: string
}

// Идея компонента: путь файловой системы, а не сайта. Он приходит одной
// строкой и разбирается на уровни, потому что путь так и хранится; собирать
// массив вручную ради показа — лишняя работа. Шрифт моноширинный: в путях
// важны точки, дефисы и регистр, а пропорциональный шрифт их смазывает.
//
// Плашка здесь — часть дизайна: путь показан как фрагмент кода, поэтому
// заливка остаётся, но обе её ветки объявлены через light-dark() и следуют
// color-scheme окружения.
const STYLES = `
:where([data-vibeui-block="breadcrumb-008"]){
--vibeui-breadcrumb-008-fg:light-dark(oklch(0.28 0.014 265),oklch(0.94 0.008 265));
--vibeui-breadcrumb-008-muted:color-mix(in oklab,var(--vibeui-breadcrumb-008-fg) 68%,transparent);
--vibeui-breadcrumb-008-sep:light-dark(oklch(0.75 0.01 265),oklch(0.52 0.012 265));
--vibeui-breadcrumb-008-bg:light-dark(oklch(0.97 0.003 265),oklch(0.26 0.01 265));
--vibeui-breadcrumb-008-hover:light-dark(oklch(0.93 0.006 265),oklch(0.33 0.012 265));
--vibeui-breadcrumb-008-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-breadcrumb-008-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-breadcrumb-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-008"]{color-scheme:dark}
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
content:var(--vibeui-breadcrumb-008-separator,"/");color:var(--vibeui-breadcrumb-008-sep);
}
[data-vibeui-block="breadcrumb-008"] a{
color:inherit;text-decoration:none;padding:0 0.0625rem;border-radius:0.1875rem;
}
[data-vibeui-block="breadcrumb-008"] a:hover{color:var(--vibeui-breadcrumb-008-fg);background:var(--vibeui-breadcrumb-008-hover)}
[data-vibeui-block="breadcrumb-008"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-008-accent);outline-offset:1px}
/* Имя файла выделено: в длинном пути глаз ищет именно его. */
[data-vibeui-block="breadcrumb-008"] [aria-current="page"]{color:var(--vibeui-breadcrumb-008-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Путь файловой системы: строка разбирается на уровни, шрифт моноширинный.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb008({
  path = "registry/components/breadcrumb/breadcrumb-008.tsx",
  separator = "/",
  navLabel = "Путь к файлу",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb008Props) {
  const parts = path.split(separator).filter(Boolean)
  const palette = {
    "--vibeui-breadcrumb-008-separator": `"${separator}"`,
    ...(accent ? { "--vibeui-breadcrumb-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-008"
        aria-label={navLabel}
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
