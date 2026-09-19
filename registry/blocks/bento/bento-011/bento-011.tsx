import type { CSSProperties } from "react"

export type Bento011Kind = "geocode" | "reverse" | "route" | "suggest" | "matrix" | "batch"

export type Bento011Item = {
  method?: "GET" | "POST"
  path: string
  title: string
  text: string
  /** Подпись справа внизу: «p50 · 42 ms». */
  meta?: string
  /** Какое микродемо рисовать в плитке. */
  kind: Bento011Kind
  /** Плитка на две колонки от 60rem контейнера. */
  wide?: boolean
}

export type Bento011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Bento011Item[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Эндпоинты bento-плитками: у каждой чип метода, путь моноширинным и
// своё микродемо на чистом CSS — булавка падает на сетку (geocode),
// прицел и строки адреса (reverse), полилиния рисуется штрихом (route),
// подсказки печатаются под полем (suggest), тепловая сетка дышит
// (matrix), полосы пакетной загрузки заполняются (batch). Плитки разного
// размера, широкая занимает две колонки. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-011"]){
--vibeui-bento-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-011-on-accent:oklch(from var(--vibeui-bento-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-011-muted:color-mix(in oklab,var(--vibeui-bento-011-fg) 60%,var(--vibeui-bento-011-bg));
--vibeui-bento-011-line:color-mix(in oklab,var(--vibeui-bento-011-fg) 12%,transparent);
--vibeui-bento-011-panel:color-mix(in oklab,var(--vibeui-bento-011-fg) 4%,var(--vibeui-bento-011-bg));
--vibeui-bento-011-dots:radial-gradient(color-mix(in oklab,var(--vibeui-bento-011-fg) 16%,transparent) 1px,transparent 1.5px);
--vibeui-bento-011-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-011-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-011"]{color-scheme:dark}
:where([data-vibeui-block="bento-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-011"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-011-bg);color:var(--vibeui-bento-011-fg);font-family:var(--vibeui-bento-011-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-011"] *{box-sizing:border-box}
[data-vibeui-block="bento-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-011"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="bento-011"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-011-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-bento-011-accent)}
[data-vibeui-block="bento-011"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="bento-011"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="bento-011"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-bento-011-muted)}
[data-vibeui-block="bento-011"] [data-part="grid"]{display:grid;gap:.9rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bento-011"] [data-part="tile"]{position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:.9rem;padding:1.1rem;border:1px solid var(--vibeui-bento-011-line);border-radius:1.1rem;background:var(--vibeui-bento-011-panel);transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="bento-011"] [data-part="tile"]:hover{border-color:color-mix(in oklab,var(--vibeui-bento-011-accent) 50%,transparent);box-shadow:0 0 40px -20px var(--vibeui-bento-011-accent)}
[data-vibeui-block="bento-011"] [data-part="route-line"]{display:flex;align-items:center;gap:.5rem;font-family:var(--vibeui-bento-011-mono);font-size:.76rem}
[data-vibeui-block="bento-011"] [data-part="method"]{padding:.12rem .4rem;border-radius:.3rem;font-size:.64rem;font-weight:600;letter-spacing:.04em;background:color-mix(in oklab,var(--vibeui-bento-011-accent) 18%,transparent);color:var(--vibeui-bento-011-accent)}
[data-vibeui-block="bento-011"] [data-part="method"][data-post="true"]{background:color-mix(in oklab,#ffb454 22%,transparent);color:color-mix(in oklab,#ffb454 80%,var(--vibeui-bento-011-fg))}
[data-vibeui-block="bento-011"] [data-part="path"]{color:var(--vibeui-bento-011-muted)}
[data-vibeui-block="bento-011"] [data-part="demo"]{position:relative;overflow:hidden;min-height:7.5rem;border:1px solid var(--vibeui-bento-011-line);border-radius:.7rem;background-color:var(--vibeui-bento-011-bg);background-image:var(--vibeui-bento-011-dots);background-size:16px 16px;font-family:var(--vibeui-bento-011-mono);font-size:.72rem;line-height:1.5}
[data-vibeui-block="bento-011"] [data-part="tile"] h3{margin:0;font-size:1.1rem;font-weight:700;letter-spacing:-.02em}
[data-vibeui-block="bento-011"] [data-part="tile"] p{margin:.3rem 0 0;font-size:.88rem;color:var(--vibeui-bento-011-muted)}
[data-vibeui-block="bento-011"] [data-part="meta"]{display:block;margin:.6rem 0 0;font-family:var(--vibeui-bento-011-mono);font-size:.68rem;color:var(--vibeui-bento-011-accent)}
[data-vibeui-block="bento-011"] [data-part="pin"]{position:absolute;left:58%;top:52%;width:.8rem;height:.8rem;border-radius:50%;background:var(--vibeui-bento-011-accent);box-shadow:0 0 0 3px var(--vibeui-bento-011-bg),0 0 14px var(--vibeui-bento-011-accent);animation:vibeui-bento-011-drop 3.2s cubic-bezier(.2,.8,.2,1) infinite}
[data-vibeui-block="bento-011"] [data-part="pin"]::after{content:"";position:absolute;inset:-.9rem;border-radius:50%;border:2px solid var(--vibeui-bento-011-accent);animation:vibeui-bento-011-ring 3.2s ease-out infinite}
[data-vibeui-block="bento-011"] [data-part="addr"]{position:absolute;left:.8rem;top:.7rem;padding:.25rem .5rem;border-radius:.35rem;border:1px solid var(--vibeui-bento-011-line);background:var(--vibeui-bento-011-panel);color:var(--vibeui-bento-011-fg);white-space:nowrap}
[data-vibeui-block="bento-011"] [data-part="coords"]{position:absolute;right:.8rem;bottom:.7rem;padding:.25rem .5rem;border-radius:.35rem;background:var(--vibeui-bento-011-fg);color:var(--vibeui-bento-011-bg);white-space:nowrap;animation:vibeui-bento-011-fade 3.2s ease-out infinite}
[data-vibeui-block="bento-011"] [data-part="cross"]{position:absolute;left:50%;top:50%;width:2.6rem;height:2.6rem;margin:-1.3rem 0 0 -1.3rem;border:1px solid var(--vibeui-bento-011-accent);border-radius:50%;animation:vibeui-bento-011-pulse 2.4s ease-in-out infinite}
[data-vibeui-block="bento-011"] [data-part="cross"]::before,[data-vibeui-block="bento-011"] [data-part="cross"]::after{content:"";position:absolute;background:var(--vibeui-bento-011-accent)}
[data-vibeui-block="bento-011"] [data-part="cross"]::before{left:50%;top:-.5rem;bottom:-.5rem;width:1px}
[data-vibeui-block="bento-011"] [data-part="cross"]::after{top:50%;left:-.5rem;right:-.5rem;height:1px}
[data-vibeui-block="bento-011"] [data-part="lines"]{position:absolute;left:.8rem;right:.8rem;bottom:.7rem;display:grid;gap:.25rem}
[data-vibeui-block="bento-011"] [data-part="lines"] span{display:block;height:.45rem;border-radius:2px;background:color-mix(in oklab,var(--vibeui-bento-011-fg) 22%,transparent);transform-origin:left;animation:vibeui-bento-011-grow 2.4s ease-out infinite}
[data-vibeui-block="bento-011"] [data-part="lines"] span:nth-child(1){width:70%}
[data-vibeui-block="bento-011"] [data-part="lines"] span:nth-child(2){width:45%;animation-delay:.3s}
[data-vibeui-block="bento-011"] [data-part="lines"] span:nth-child(3){width:58%;animation-delay:.6s;background:color-mix(in oklab,var(--vibeui-bento-011-accent) 60%,transparent)}
[data-vibeui-block="bento-011"] [data-part="demo"] svg{position:absolute;inset:0;width:100%;height:100%}
[data-vibeui-block="bento-011"] [data-part="demo"] svg path{fill:none;stroke:var(--vibeui-bento-011-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:400;stroke-dashoffset:400;animation:vibeui-bento-011-draw 3s ease-in-out infinite}
[data-vibeui-block="bento-011"] [data-part="demo"] svg circle{fill:var(--vibeui-bento-011-bg);stroke:var(--vibeui-bento-011-accent);stroke-width:2.5}
[data-vibeui-block="bento-011"] [data-part="dist"]{position:absolute;left:.8rem;top:.7rem;padding:.25rem .5rem;border-radius:.35rem;background:var(--vibeui-bento-011-fg);color:var(--vibeui-bento-011-bg)}
[data-vibeui-block="bento-011"] [data-part="input"]{position:absolute;left:.8rem;right:.8rem;top:.7rem;display:flex;align-items:center;gap:.4rem;height:1.9rem;padding:0 .6rem;border:1px solid var(--vibeui-bento-011-line);border-radius:.4rem;background:var(--vibeui-bento-011-panel);color:var(--vibeui-bento-011-fg)}
[data-vibeui-block="bento-011"] [data-part="input"] b{display:inline-block;overflow:hidden;white-space:nowrap;font-weight:500;animation:vibeui-bento-011-type 3.6s steps(6) infinite}
[data-vibeui-block="bento-011"] [data-part="input"] i{width:1px;height:1em;background:var(--vibeui-bento-011-accent);animation:vibeui-bento-011-blink 1s steps(2,start) infinite}
[data-vibeui-block="bento-011"] [data-part="list"]{position:absolute;left:.8rem;right:.8rem;top:3rem;display:grid;gap:.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bento-011"] [data-part="list"] li{padding:.2rem .6rem;border-radius:.3rem;background:var(--vibeui-bento-011-panel);color:var(--vibeui-bento-011-muted);opacity:0;animation:vibeui-bento-011-item 3.6s ease-out infinite}
[data-vibeui-block="bento-011"] [data-part="list"] li:nth-child(2){animation-delay:.15s}
[data-vibeui-block="bento-011"] [data-part="list"] li:nth-child(3){animation-delay:.3s}
[data-vibeui-block="bento-011"] [data-part="list"] li:first-child{color:var(--vibeui-bento-011-fg)}
[data-vibeui-block="bento-011"] [data-part="cells"]{position:absolute;inset:.8rem;display:grid;grid-template-columns:repeat(6,1fr);gap:.25rem}
[data-vibeui-block="bento-011"] [data-part="cells"] i{border-radius:.2rem;background:var(--vibeui-bento-011-accent);opacity:.12;animation:vibeui-bento-011-cell 4s ease-in-out infinite;animation-delay:calc(var(--vibeui-bento-011-i) * -.37s)}
[data-vibeui-block="bento-011"] [data-part="bars"]{position:absolute;left:.8rem;right:.8rem;top:50%;transform:translateY(-50%);display:grid;gap:.45rem}
[data-vibeui-block="bento-011"] [data-part="bars"] div{display:grid;grid-template-columns:5.5rem 1fr 2.6rem;align-items:center;gap:.6rem;color:var(--vibeui-bento-011-muted)}
[data-vibeui-block="bento-011"] [data-part="bars"] div em{font-style:normal;text-align:right;color:var(--vibeui-bento-011-fg)}
[data-vibeui-block="bento-011"] [data-part="bars"] div span{height:.4rem;border-radius:2px;background:var(--vibeui-bento-011-line);overflow:hidden}
[data-vibeui-block="bento-011"] [data-part="bars"] div span::after{content:"";display:block;height:100%;background:var(--vibeui-bento-011-accent);transform-origin:left;animation:vibeui-bento-011-fill 5s cubic-bezier(.2,.8,.2,1) infinite;animation-delay:calc(var(--vibeui-bento-011-i) * .6s)}
@keyframes vibeui-bento-011-drop{0%,8%{transform:translateY(-2.4rem) scale(.6);opacity:0}22%,80%{transform:none;opacity:1}100%{transform:none;opacity:0}}
@keyframes vibeui-bento-011-ring{0%,22%{transform:scale(.4);opacity:0}30%{opacity:1}70%,100%{transform:scale(1.6);opacity:0}}
@keyframes vibeui-bento-011-fade{0%,28%{opacity:0;transform:translateY(4px)}38%,85%{opacity:1;transform:none}100%{opacity:0}}
@keyframes vibeui-bento-011-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:1}}
@keyframes vibeui-bento-011-grow{0%{transform:scaleX(0)}35%,80%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-bento-011-draw{0%{stroke-dashoffset:400}50%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:-400}}
@keyframes vibeui-bento-011-type{0%,10%{width:0}60%,100%{width:6ch}}
@keyframes vibeui-bento-011-blink{to{visibility:hidden}}
@keyframes vibeui-bento-011-item{0%,45%{opacity:0;transform:translateY(-4px)}55%,90%{opacity:1;transform:none}100%{opacity:0}}
@keyframes vibeui-bento-011-cell{0%,100%{opacity:.1}50%{opacity:.85}}
@keyframes vibeui-bento-011-fill{0%{transform:scaleX(0)}55%,85%{transform:scaleX(1)}100%{transform:scaleX(1);opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="bento-011"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="bento-011"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}[data-vibeui-block="bento-011"] [data-part="tile"][data-wide="true"]{grid-column:span 2}[data-vibeui-block="bento-011"] [data-part="tile"]:nth-child(6):last-child{grid-column:span 3}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-011"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-011"] [data-part="list"] li,[data-vibeui-block="bento-011"] [data-part="pin"]{opacity:1}[data-vibeui-block="bento-011"] [data-part="input"] b{width:6ch}[data-vibeui-block="bento-011"] [data-part="demo"] svg path{stroke-dashoffset:0}}`

const DEFAULT_ITEMS: Bento011Item[] = [
  { method: "GET", path: "/v2/geocode", title: "Прямое геокодирование", text: "Строка адреса в любом виде — с опечатками, сокращениями, без индекса — превращается в координаты дома и нормализованный адрес.", meta: "p50 · 42 ms", kind: "geocode", wide: true },
  { method: "GET", path: "/v2/reverse", title: "Обратное геокодирование", text: "Координаты → ближайший адрес, район, почтовый индекс и тип объекта.", meta: "p50 · 39 ms", kind: "reverse" },
  { method: "POST", path: "/v2/route", title: "Маршруты", text: "Авто, пешком, велосипед: геометрия, расстояние, время с пробками.", meta: "p50 · 110 ms", kind: "route" },
  { method: "GET", path: "/v2/suggest", title: "Подсказки адресов", text: "Автодополнение по первым буквам для форм доставки и регистрации.", meta: "p50 · 24 ms", kind: "suggest" },
  { method: "POST", path: "/v2/matrix", title: "Матрица расстояний", text: "До 100 × 100 точек за один запрос — для логистики и выбора ближайшего склада.", meta: "p50 · 180 ms", kind: "matrix" },
  { method: "POST", path: "/v2/batch", title: "Пакетная обработка", text: "Загрузите файл на миллион адресов — вернём геокодированный CSV.", meta: "≈ 12 мин на 1 000 000", kind: "batch" },
]

function Demo({ kind }: { kind: Bento011Kind }) {
  switch (kind) {
    case "geocode":
      return (
        <>
          <span data-part="addr">«Тверская 7, мск»</span>
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
          <span data-part="dist">7,4 км · 18 мин</span>
        </>
      )
    case "suggest":
      return (
        <>
          <div data-part="input" aria-hidden="true">
            <b>Тверск</b>
            <i />
          </div>
          <ul data-part="list" aria-hidden="true">
            <li>Тверская улица, Москва</li>
            <li>Тверская-Ямская 1-я улица</li>
            <li>Тверской бульвар</li>
          </ul>
        </>
      )
    case "matrix":
      return (
        <div data-part="cells" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ ["--vibeui-bento-011-i" as string]: (index * 7) % 11 }} />
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
            <div key={name} style={{ ["--vibeui-bento-011-i" as string]: index }}>
              {name}
              <span />
              <em>{count}</em>
            </div>
          ))}
        </div>
      )
  }
}

/** Эндпоинты API bento-плитками с CSS-микродемо. */
export function Bento011({
  eyebrow = "Эндпоинты",
  title = "Шесть методов, один ключ",
  lede = "Всё, что нужно доставке, картам и логистике. Один формат ответа, одна авторизация, одинаковая документация.",
  items = DEFAULT_ITEMS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento011Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-011-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-011-fg": ink } : null),
    ...(background ? { "--vibeui-bento-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {items.map((item) => (
              <li key={item.path} data-part="tile" data-wide={item.wide ? "true" : undefined}>
                <div data-part="route-line">
                  <span data-part="method" data-post={item.method === "POST" ? "true" : undefined}>
                    {item.method ?? "GET"}
                  </span>
                  <span data-part="path">{item.path}</span>
                </div>
                <div data-part="demo">
                  <Demo kind={item.kind} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.meta ? <span data-part="meta">{item.meta}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
