import type { ComponentProps, CSSProperties } from "react"

type NotFound002Suggestion = { label: string; href: string }

export type NotFound002Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  searchAction?: string
  searchPlaceholder?: string
  searchLabel?: string
  suggestionsLabel?: string
  suggestions?: NotFound002Suggestion[]
  /** Цвет стрелки компаса и кнопки поиска. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Компас, который не может найти север: стрелка мечется по шкале и
// замирает на секунду, будто ищет страницу вместе с человеком. Рядом —
// настоящий поиск и подсказки популярных запросов: потерявшемуся дают
// инструмент, а не извинение.
const STYLES = `
:where([data-vibeui-block="not-found-002"]){
--vibeui-not-found-002-bg:transparent;
--vibeui-not-found-002-fg:light-dark(oklch(0.2 0.01 250),oklch(0.96 0.005 250));
--vibeui-not-found-002-muted:light-dark(oklch(0.52 0.01 250),oklch(0.72 0.01 250));
--vibeui-not-found-002-line:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 12%));
--vibeui-not-found-002-surface:light-dark(oklch(1 0 0),oklch(0.22 0.01 250));
--vibeui-not-found-002-dial:light-dark(oklch(0.97 0.005 250),oklch(0.18 0.01 250));
--vibeui-not-found-002-accent:light-dark(oklch(0.58 0.21 28),oklch(0.7 0.18 30));
--vibeui-not-found-002-on-accent:oklch(from var(--vibeui-not-found-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-not-found-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-002"]{color-scheme:dark}
[data-vibeui-block="not-found-002"]{display:block;background:var(--vibeui-not-found-002-bg);color:var(--vibeui-not-found-002-fg);font-family:var(--vibeui-not-found-002-font)}
[data-vibeui-block="not-found-002"] [data-part="layout"]{
display:grid;gap:2.5rem;align-items:center;justify-items:center;box-sizing:border-box;max-width:60rem;margin:0 auto;padding:3.5rem 1.5rem;text-align:center;
}
[data-vibeui-block="not-found-002"] [data-part="compass"]{
position:relative;width:min(70cqi,16rem);aspect-ratio:1;border-radius:50%;
background:radial-gradient(circle,var(--vibeui-not-found-002-dial) 58%,var(--vibeui-not-found-002-surface) 59%);
box-shadow:0 0 0 1px var(--vibeui-not-found-002-line),0 1.5rem 3rem -1.5rem oklch(0 0 0 / 35%),inset 0 0 0 0.625rem var(--vibeui-not-found-002-surface);
}
[data-vibeui-block="not-found-002"] [data-part="ticks"]{position:absolute;inset:0.625rem;border-radius:50%;
background:repeating-conic-gradient(var(--vibeui-not-found-002-line) 0 1deg,transparent 1deg 15deg);
mask:radial-gradient(circle,transparent 82%,#000 83%)}
[data-vibeui-block="not-found-002"] [data-part="mark"]{position:absolute;font-size:0.6875rem;font-weight:700;color:var(--vibeui-not-found-002-muted)}
[data-vibeui-block="not-found-002"] [data-part="mark"][data-side="n"]{top:14%;left:50%;translate:-50% 0;color:var(--vibeui-not-found-002-accent)}
[data-vibeui-block="not-found-002"] [data-part="mark"][data-side="s"]{bottom:14%;left:50%;translate:-50% 0}
[data-vibeui-block="not-found-002"] [data-part="mark"][data-side="w"]{left:14%;top:50%;translate:0 -50%}
[data-vibeui-block="not-found-002"] [data-part="mark"][data-side="e"]{right:14%;top:50%;translate:0 -50%}
[data-vibeui-block="not-found-002"] [data-part="needle"]{
position:absolute;left:50%;top:50%;width:0.75rem;height:62%;translate:-50% -50%;
background:linear-gradient(var(--vibeui-not-found-002-accent) 50%,var(--vibeui-not-found-002-muted) 50%);
clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);
animation:vibeui-not-found-002-seek 5s cubic-bezier(.5,0,.3,1.4) infinite;
}
[data-vibeui-block="not-found-002"] [data-part="hub"]{position:absolute;left:50%;top:50%;width:0.875rem;height:0.875rem;translate:-50% -50%;border-radius:50%;background:var(--vibeui-not-found-002-surface);box-shadow:0 0 0 2px var(--vibeui-not-found-002-fg)}
@keyframes vibeui-not-found-002-seek{
0%{rotate:-20deg}15%{rotate:140deg}28%{rotate:95deg}45%{rotate:250deg}58%{rotate:215deg}75%{rotate:400deg}88%,100%{rotate:340deg}
}
[data-vibeui-block="not-found-002"] [data-part="code"]{margin:0;color:var(--vibeui-not-found-002-accent);font-size:0.8125rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase}
[data-vibeui-block="not-found-002"] [data-part="title"]{margin:0.75rem 0 0;font-size:clamp(1.75rem,5cqi,2.75rem);font-weight:750;line-height:1.08;letter-spacing:-0.03em;text-wrap:balance}
[data-vibeui-block="not-found-002"] [data-part="text"]{margin:0.875rem auto 0;max-width:30rem;color:var(--vibeui-not-found-002-muted);font-size:1rem;line-height:1.55;text-wrap:pretty}
[data-vibeui-block="not-found-002"] [data-part="search"]{
display:flex;gap:0.375rem;margin:1.75rem auto 0;max-width:28rem;padding:0.375rem;border:1px solid var(--vibeui-not-found-002-line);border-radius:0.875rem;
background:var(--vibeui-not-found-002-surface);box-shadow:0 0.75rem 2rem -1.25rem oklch(0 0 0 / 30%);
}
[data-vibeui-block="not-found-002"] [data-part="search"]:focus-within{border-color:var(--vibeui-not-found-002-accent)}
[data-vibeui-block="not-found-002"] [data-part="input"]{flex:1;min-width:0;border:0;padding:0 0.75rem;background:transparent;color:inherit;font:inherit;font-size:0.9375rem;outline:none}
[data-vibeui-block="not-found-002"] [data-part="submit"]{
appearance:none;border:0;padding:0.625rem 1.125rem;border-radius:0.625rem;cursor:pointer;
background:var(--vibeui-not-found-002-accent);color:var(--vibeui-not-found-002-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="not-found-002"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-not-found-002-accent);outline-offset:2px}
[data-vibeui-block="not-found-002"] [data-part="hint"]{margin:1.25rem 0 0;color:var(--vibeui-not-found-002-muted);font-size:0.75rem}
[data-vibeui-block="not-found-002"] [data-part="chips"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;margin:0.625rem 0 0;padding:0;list-style:none}
[data-vibeui-block="not-found-002"] [data-part="chip"]{
display:inline-block;padding:0.375rem 0.75rem;border:1px solid var(--vibeui-not-found-002-line);border-radius:999px;color:inherit;font-size:0.8125rem;text-decoration:none;
transition:border-color .2s ease,background .2s ease;
}
[data-vibeui-block="not-found-002"] [data-part="chip"]:hover{border-color:var(--vibeui-not-found-002-accent);background:color-mix(in oklab,var(--vibeui-not-found-002-accent) 8%,transparent)}
[data-vibeui-block="not-found-002"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-not-found-002-accent);outline-offset:2px}
@container (min-width:46rem){
[data-vibeui-block="not-found-002"] [data-part="layout"]{grid-template-columns:auto 1fr;gap:4rem;padding:5rem 2.5rem;text-align:left;justify-items:start}
[data-vibeui-block="not-found-002"] [data-part="text"],[data-vibeui-block="not-found-002"] [data-part="search"]{margin-left:0}
[data-vibeui-block="not-found-002"] [data-part="chips"]{justify-content:flex-start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-002"] *{animation:none!important;transition:none!important}}
`

const SUGGESTIONS: NotFound002Suggestion[] = [
  { label: "Тарифы", href: "/pricing" },
  { label: "Шапка сайта", href: "/search?q=шапка" },
  { label: "Первый экран", href: "/search?q=первый+экран" },
  { label: "Контакты", href: "/contact" },
]

export function NotFound002({
  code = "Ошибка 404",
  title = "Даже компас не нашёл эту страницу",
  description = "Похоже, адрес изменился или страница ушла в отпуск. Поищите нужное — или выберите популярный раздел.",
  searchAction = "/search",
  searchPlaceholder = "Что вы искали?",
  searchLabel = "Найти",
  suggestionsLabel = "Часто ищут:",
  suggestions = SUGGESTIONS,
  accent,
  background,
  className,
  style,
  ...props
}: NotFound002Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-002-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-002" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-002" className={className} style={palette}>
        <div data-part="layout">
          <div data-part="compass" aria-hidden="true">
            <span data-part="ticks" />
            <span data-part="mark" data-side="n">N</span>
            <span data-part="mark" data-side="e">E</span>
            <span data-part="mark" data-side="s">S</span>
            <span data-part="mark" data-side="w">W</span>
            <span data-part="needle" />
            <span data-part="hub" />
          </div>
          <div>
            <p data-part="code">{code}</p>
            <h1 data-part="title">{title}</h1>
            <p data-part="text">{description}</p>
            <form data-part="search" role="search" action={searchAction}>
              <input data-part="input" type="search" name="q" placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
              <button data-part="submit" type="submit">
                {searchLabel}
              </button>
            </form>
            <p data-part="hint">{suggestionsLabel}</p>
            <ul data-part="chips">
              {suggestions.map((item) => (
                <li key={item.href}>
                  <a data-part="chip" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
