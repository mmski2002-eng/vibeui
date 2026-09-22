import type { ComponentProps, CSSProperties } from "react"

export type Card077Kind = "geocode" | "reverse" | "route" | "suggest" | "matrix" | "batch"

export type Card077Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  path?: string
  wide?: boolean
  method?: "GET" | "POST"
  kind?: Card077Kind
  title?: string
  text?: string
  meta?: string
  demoAddress?: string
  demoDistance?: string
  demoQuery?: string
  demoSuggestions?: readonly [string, string, string]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Demo({ kind, texts }: { kind: Card077Kind; texts: { address: string; distance: string; query: string; suggestions: readonly [string, string, string] } }) {
  switch (kind) {
    case "geocode":
      return (
        <>
          <span data-part="addr">{texts.address}</span>
          <i data-part="pin" aria-hidden="true" />
          <span data-part="coords">55.7599, 37.6101</span>
        </>
      )
    case "reverse":
      return (
        <>
          <i data-part="cross" aria-hidden="true" />
          <div data-part="lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </>
      )
    case "route":
      return (
        <>
          <svg viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
            <path d="M18 88 C40 80 48 50 70 48 C95 46 100 70 122 62 C150 52 156 30 182 22" />
            <circle cx="18" cy="88" r="4" />
            <circle cx="182" cy="22" r="4" />
          </svg>
          <span data-part="dist">{texts.distance}</span>
        </>
      )
    case "suggest":
      return (
        <>
          <div data-part="input" aria-hidden="true">
            <b>{texts.query}</b>
            <i />
          </div>
          <ul data-part="list" aria-hidden="true">
            {texts.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )
    case "matrix":
      return (
        <div data-part="cells" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ ["--vibeui-card-077-i" as string]: (index * 7) % 11 }} />
          ))}
        </div>
      )
    case "batch":
      return (
        <div data-part="bars" aria-hidden="true">
          {[
            ["orders.csv", "1 000 000"],
            ["clients.csv", "240 000"],
            ["stores.csv", "3 800"],
          ].map(([name, count], index) => (
            <div key={name} style={{ ["--vibeui-card-077-i" as string]: index }}>
              {name}
              <span />
              <em>{count}</em>
            </div>
          ))}
        </div>
      )
  }
}

// Часть блока bento-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-077"]){
--vibeui-card-077-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-077-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-077-dots:radial-gradient(color-mix(in oklab,var(--vibeui-card-077-fg) 16%,transparent) 1px,transparent 1.5px);
--vibeui-card-077-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-077-line:color-mix(in oklab,var(--vibeui-card-077-fg) 12%,transparent);
--vibeui-card-077-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-077-muted:color-mix(in oklab,var(--vibeui-card-077-fg) 60%,var(--vibeui-card-077-bg));
--vibeui-card-077-panel:color-mix(in oklab,var(--vibeui-card-077-fg) 4%,var(--vibeui-card-077-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-077"]{color-scheme:dark}
[data-vibeui-block="card-077"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-077"] *{box-sizing:border-box}
@keyframes vibeui-card-077-type{0%,10%{width:0}60%,100%{width:6ch}}
@keyframes vibeui-card-077-ring{0%,22%{transform:scale(.4);opacity:0}30%{opacity:1}70%,100%{transform:scale(1.6);opacity:0}}
@keyframes vibeui-card-077-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:1}}
@keyframes vibeui-card-077-item{0%,45%{opacity:0;transform:translateY(-4px)}55%,90%{opacity:1;transform:none}100%{opacity:0}}
@keyframes vibeui-card-077-grow{0%{transform:scaleX(0)}35%,80%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-card-077-fill{0%{transform:scaleX(0)}55%,85%{transform:scaleX(1)}100%{transform:scaleX(1);opacity:0}}
@keyframes vibeui-card-077-fade{0%,28%{opacity:0;transform:translateY(4px)}38%,85%{opacity:1;transform:none}100%{opacity:0}}
@keyframes vibeui-card-077-drop{0%,8%{transform:translateY(-2.4rem) scale(.6);opacity:0}22%,80%{transform:none;opacity:1}100%{transform:none;opacity:0}}
@keyframes vibeui-card-077-draw{0%{stroke-dashoffset:400}50%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:-400}}
@keyframes vibeui-card-077-cell{0%,100%{opacity:.1}50%{opacity:.85}}
@keyframes vibeui-card-077-blink{to{visibility:hidden}}
[data-vibeui-block="card-077"]{position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:.9rem;padding:1.1rem;border:1px solid var(--vibeui-card-077-line);border-radius:1.1rem;background:var(--vibeui-card-077-panel);transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="card-077"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-077-accent) 50%,transparent);box-shadow:0 0 40px -20px var(--vibeui-card-077-accent)}
[data-vibeui-block="card-077"] [data-part="route-line"]{display:flex;align-items:center;gap:.5rem;font-family:var(--vibeui-card-077-mono);font-size:.76rem}
[data-vibeui-block="card-077"] [data-part="method"]{padding:.12rem .4rem;border-radius:.3rem;font-size:.64rem;font-weight:600;letter-spacing:.04em;background:color-mix(in oklab,var(--vibeui-card-077-accent) 18%,transparent);color:var(--vibeui-card-077-accent)}
[data-vibeui-block="card-077"] [data-part="method"][data-post="true"]{background:color-mix(in oklab,#ffb454 22%,transparent);color:color-mix(in oklab,#ffb454 80%,var(--vibeui-card-077-fg))}
[data-vibeui-block="card-077"] [data-part="path"]{color:var(--vibeui-card-077-muted)}
[data-vibeui-block="card-077"] [data-part="demo"]{position:relative;overflow:hidden;min-height:7.5rem;border:1px solid var(--vibeui-card-077-line);border-radius:.7rem;background-color:var(--vibeui-card-077-bg);background-image:var(--vibeui-card-077-dots);background-size:16px 16px;font-family:var(--vibeui-card-077-mono);font-size:.72rem;line-height:1.5}
[data-vibeui-block="card-077"] h3{margin:0;font-size:1.1rem;font-weight:700;letter-spacing:-.02em}
[data-vibeui-block="card-077"] p{margin:.3rem 0 0;font-size:.88rem;color:var(--vibeui-card-077-muted)}
[data-vibeui-block="card-077"] [data-part="meta"]{display:block;margin:.6rem 0 0;font-family:var(--vibeui-card-077-mono);font-size:.68rem;color:var(--vibeui-card-077-accent)}
[data-vibeui-block="card-077"] [data-part="pin"]{position:absolute;left:58%;top:52%;width:.8rem;height:.8rem;border-radius:50%;background:var(--vibeui-card-077-accent);box-shadow:0 0 0 3px var(--vibeui-card-077-bg),0 0 14px var(--vibeui-card-077-accent);animation:vibeui-card-077-drop 3.2s cubic-bezier(.2,.8,.2,1) infinite}
[data-vibeui-block="card-077"] [data-part="pin"]::after{content:"";position:absolute;inset:-.9rem;border-radius:50%;border:2px solid var(--vibeui-card-077-accent);animation:vibeui-card-077-ring 3.2s ease-out infinite}
[data-vibeui-block="card-077"] [data-part="addr"]{position:absolute;left:.8rem;top:.7rem;padding:.25rem .5rem;border-radius:.35rem;border:1px solid var(--vibeui-card-077-line);background:var(--vibeui-card-077-panel);color:var(--vibeui-card-077-fg);white-space:nowrap}
[data-vibeui-block="card-077"] [data-part="coords"]{position:absolute;right:.8rem;bottom:.7rem;padding:.25rem .5rem;border-radius:.35rem;background:var(--vibeui-card-077-fg);color:var(--vibeui-card-077-bg);white-space:nowrap;animation:vibeui-card-077-fade 3.2s ease-out infinite}
[data-vibeui-block="card-077"] [data-part="cross"]{position:absolute;left:50%;top:50%;width:2.6rem;height:2.6rem;margin:-1.3rem 0 0 -1.3rem;border:1px solid var(--vibeui-card-077-accent);border-radius:50%;animation:vibeui-card-077-pulse 2.4s ease-in-out infinite}
[data-vibeui-block="card-077"] [data-part="cross"]::before,[data-vibeui-block="card-077"] [data-part="cross"]::after{content:"";position:absolute;background:var(--vibeui-card-077-accent)}
[data-vibeui-block="card-077"] [data-part="cross"]::before{left:50%;top:-.5rem;bottom:-.5rem;width:1px}
[data-vibeui-block="card-077"] [data-part="cross"]::after{top:50%;left:-.5rem;right:-.5rem;height:1px}
[data-vibeui-block="card-077"] [data-part="lines"]{position:absolute;left:.8rem;right:.8rem;bottom:.7rem;display:grid;gap:.25rem}
[data-vibeui-block="card-077"] [data-part="lines"] span{display:block;height:.45rem;border-radius:2px;background:color-mix(in oklab,var(--vibeui-card-077-fg) 22%,transparent);transform-origin:left;animation:vibeui-card-077-grow 2.4s ease-out infinite}
[data-vibeui-block="card-077"] [data-part="lines"] span:nth-child(1){width:70%}
[data-vibeui-block="card-077"] [data-part="lines"] span:nth-child(2){width:45%;animation-delay:.3s}
[data-vibeui-block="card-077"] [data-part="lines"] span:nth-child(3){width:58%;animation-delay:.6s;background:color-mix(in oklab,var(--vibeui-card-077-accent) 60%,transparent)}
[data-vibeui-block="card-077"] [data-part="demo"] svg{position:absolute;inset:0;width:100%;height:100%}
[data-vibeui-block="card-077"] [data-part="demo"] svg path{fill:none;stroke:var(--vibeui-card-077-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:400;stroke-dashoffset:400;animation:vibeui-card-077-draw 3s ease-in-out infinite}
[data-vibeui-block="card-077"] [data-part="demo"] svg circle{fill:var(--vibeui-card-077-bg);stroke:var(--vibeui-card-077-accent);stroke-width:2.5}
[data-vibeui-block="card-077"] [data-part="dist"]{position:absolute;left:.8rem;top:.7rem;padding:.25rem .5rem;border-radius:.35rem;background:var(--vibeui-card-077-fg);color:var(--vibeui-card-077-bg)}
[data-vibeui-block="card-077"] [data-part="input"]{position:absolute;left:.8rem;right:.8rem;top:.7rem;display:flex;align-items:center;gap:.4rem;height:1.9rem;padding:0 .6rem;border:1px solid var(--vibeui-card-077-line);border-radius:.4rem;background:var(--vibeui-card-077-panel);color:var(--vibeui-card-077-fg)}
[data-vibeui-block="card-077"] [data-part="input"] b{display:inline-block;overflow:hidden;white-space:nowrap;font-weight:500;animation:vibeui-card-077-type 3.6s steps(6) infinite}
[data-vibeui-block="card-077"] [data-part="input"] i{width:1px;height:1em;background:var(--vibeui-card-077-accent);animation:vibeui-card-077-blink 1s steps(2,start) infinite}
[data-vibeui-block="card-077"] [data-part="list"]{position:absolute;left:.8rem;right:.8rem;top:3rem;display:grid;gap:.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="card-077"] [data-part="list"] li{padding:.2rem .6rem;border-radius:.3rem;background:var(--vibeui-card-077-panel);color:var(--vibeui-card-077-muted);opacity:0;animation:vibeui-card-077-item 3.6s ease-out infinite}
[data-vibeui-block="card-077"] [data-part="list"] li:nth-child(2){animation-delay:.15s}
[data-vibeui-block="card-077"] [data-part="list"] li:nth-child(3){animation-delay:.3s}
[data-vibeui-block="card-077"] [data-part="list"] li:first-child{color:var(--vibeui-card-077-fg)}
[data-vibeui-block="card-077"] [data-part="cells"]{position:absolute;inset:.8rem;display:grid;grid-template-columns:repeat(6,1fr);gap:.25rem}
[data-vibeui-block="card-077"] [data-part="cells"] i{border-radius:.2rem;background:var(--vibeui-card-077-accent);opacity:.12;animation:vibeui-card-077-cell 4s ease-in-out infinite;animation-delay:calc(var(--vibeui-card-077-i) * -.37s)}
[data-vibeui-block="card-077"] [data-part="bars"]{position:absolute;left:.8rem;right:.8rem;top:50%;transform:translateY(-50%);display:grid;gap:.45rem}
[data-vibeui-block="card-077"] [data-part="bars"] div{display:grid;grid-template-columns:5.5rem 1fr 2.6rem;align-items:center;gap:.6rem;color:var(--vibeui-card-077-muted)}
[data-vibeui-block="card-077"] [data-part="bars"] div em{font-style:normal;text-align:right;color:var(--vibeui-card-077-fg)}
[data-vibeui-block="card-077"] [data-part="bars"] div span{height:.4rem;border-radius:2px;background:var(--vibeui-card-077-line);overflow:hidden}
[data-vibeui-block="card-077"] [data-part="bars"] div span::after{content:"";display:block;height:100%;background:var(--vibeui-card-077-accent);transform-origin:left;animation:vibeui-card-077-fill 5s cubic-bezier(.2,.8,.2,1) infinite;animation-delay:calc(var(--vibeui-card-077-i) * .6s)}
@container (min-width: 60rem){
[data-vibeui-block="card-077"][data-wide="true"]{grid-column:span 2}
[data-vibeui-block="card-077"]:nth-child(6):last-child{grid-column:span 3}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-077"] [data-part="list"] li,[data-vibeui-block="card-077"] [data-part="pin"]{opacity:1}
[data-vibeui-block="card-077"] [data-part="input"] b{width:6ch}
[data-vibeui-block="card-077"] [data-part="demo"] svg path{stroke-dashoffset:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-077"] *{animation:none!important;transition:none!important}}
`

/** Плитка с методом и путём запроса, демонстрацией ответа (адрес, расстояние, подсказки) и описанием. Широкая вариация по data-wide. */
export function Card077({
  path = "/v2/geocode",
  wide,
  method = "GET",
  kind = "geocode",
  title = "Прямое геокодирование",
  text = "Строка адреса в любом виде — с опечатками, сокращениями, без индекса — превращается в координаты дома и нормализованный адрес.",
  meta = "p50 · 42 ms",
  demoAddress = "«Тверская 7, мск»",
  demoDistance = "7,4 км · 18 мин",
  demoQuery = "Тверск",
  demoSuggestions = ["Тверская улица, Москва", "Тверская-Ямская 1-я улица", "Тверской бульвар"],
  accent,
  className,
  style,
  ...props
}: Card077Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-077-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-077" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-077" data-wide={wide ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="route-line">
          <span data-part="method" data-post={method === "POST" ? "true" : undefined}>
            {method ?? "GET"}
          </span>
          <span data-part="path">{path}</span>
        </div>
        <div data-part="demo">
          <Demo kind={kind} texts={{ address: demoAddress, distance: demoDistance, query: demoQuery, suggestions: demoSuggestions }} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{text}</p>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </div>
      </li>
    </>
  )
}
