"use client"

import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react"

export type Api001Place = {
  /** Подстроки, по которым узнаётся запрос (в нижнем регистре). */
  keys: readonly string[]
  /** Нормализованный адрес в ответе. */
  address: string
  city: string
  lat: number
  lon: number
  /** Положение точки на карте, в процентах ширины и высоты. */
  x: number
  y: number
  precision: "house" | "street" | "city"
  latency: number
}

export type Api001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  placeholder?: string
  actionLabel?: string
  /** Адреса-подсказки чипами под полем. */
  suggestions?: readonly string[]
  /** Предзаданные ответы; первый — ответ по умолчанию для незнакомого адреса. */
  places?: readonly Api001Place[]
  /** Стоимость одного запроса, ₽. */
  cost?: number
  /** Остаток бесплатных запросов, уменьшается с каждым запросом. */
  freeLeft?: number
  note?: string
  /** aria поля и примеров, пустой ответ, aria карты, подписи счётчиков. */
  inputLabel?: string
  chipsLabel?: string
  emptyLine?: string
  mapLabel?: string
  costLabel?: string
  freeLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Песочница API: поле адреса и кнопка «Отправить». После нажатия справа
// на стилизованной CSS-карте (сетка точек, улицы и кольцо в SVG) точка
// плавно едет к новым координатам и «пингует» кольцом, а слева построчно
// печатается JSON-ответ. В строке под картой — латентность, стоимость
// запроса, точность и остаток бесплатных запросов. Ответы предзаданы, для
// незнакомого адреса — ответ по умолчанию с точностью «street».
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="api-001"]){
--vibeui-api-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-api-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-api-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-api-001-on-accent:oklch(from var(--vibeui-api-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-api-001-muted:color-mix(in oklab,var(--vibeui-api-001-fg) 60%,var(--vibeui-api-001-bg));
--vibeui-api-001-line:color-mix(in oklab,var(--vibeui-api-001-fg) 12%,transparent);
--vibeui-api-001-panel:color-mix(in oklab,var(--vibeui-api-001-fg) 4%,var(--vibeui-api-001-bg));
--vibeui-api-001-street:color-mix(in oklab,var(--vibeui-api-001-fg) 18%,transparent);
--vibeui-api-001-number:color-mix(in oklab,var(--vibeui-api-001-accent) 60%,#ffb454);
--vibeui-api-001-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-api-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="api-001"]{color-scheme:dark}
:where([data-vibeui-block="api-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="api-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="api-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-api-001-bg);color:var(--vibeui-api-001-fg);font-family:var(--vibeui-api-001-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="api-001"] *{box-sizing:border-box}
[data-vibeui-block="api-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="api-001"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="api-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-api-001-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-api-001-accent)}
[data-vibeui-block="api-001"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="api-001"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="api-001"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-api-001-muted)}
[data-vibeui-block="api-001"] [data-part="lab"]{display:grid;gap:1rem;border:1px solid var(--vibeui-api-001-line);border-radius:1.2rem;background:var(--vibeui-api-001-panel);padding:1rem}
[data-vibeui-block="api-001"] [data-part="left"],[data-vibeui-block="api-001"] [data-part="right"]{display:grid;gap:.9rem;align-content:start}
[data-vibeui-block="api-001"] [data-part="form"]{display:grid;gap:.5rem}
[data-vibeui-block="api-001"] [data-part="field"]{display:flex;align-items:center;gap:.5rem;height:3rem;padding:0 .5rem 0 .9rem;border:1px solid var(--vibeui-api-001-line);border-radius:.7rem;background:var(--vibeui-api-001-bg);font-family:var(--vibeui-api-001-mono);font-size:.85rem;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="api-001"] [data-part="field"]:focus-within{border-color:var(--vibeui-api-001-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-api-001-accent) 20%,transparent)}
[data-vibeui-block="api-001"] [data-part="field"] span{color:var(--vibeui-api-001-muted);font-size:.72rem;white-space:nowrap}
[data-vibeui-block="api-001"] [data-part="field"] input{flex:1;min-width:0;height:100%;border:0;background:transparent;color:inherit;font:inherit;outline:none}
[data-vibeui-block="api-001"] [data-part="field"] input::placeholder{color:var(--vibeui-api-001-muted)}
[data-vibeui-block="api-001"] [data-part="send"]{display:inline-flex;align-items:center;gap:.4rem;height:2.2rem;padding:0 .9rem;border:0;border-radius:.5rem;background:var(--vibeui-api-001-accent);color:var(--vibeui-api-001-on-accent);font:inherit;font-weight:600;font-size:.78rem;cursor:pointer;white-space:nowrap;transition:box-shadow .2s,opacity .2s}
[data-vibeui-block="api-001"] [data-part="send"]:hover{box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-api-001-accent) 22%,transparent)}
[data-vibeui-block="api-001"] [data-part="send"][disabled]{opacity:.6;cursor:progress}
[data-vibeui-block="api-001"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="api-001"] [data-part="chips"] button{padding:.3rem .65rem;border:1px solid var(--vibeui-api-001-line);border-radius:999px;background:transparent;color:var(--vibeui-api-001-muted);font-family:var(--vibeui-api-001-mono);font-size:.7rem;cursor:pointer;transition:color .2s,border-color .2s}
[data-vibeui-block="api-001"] [data-part="chips"] button:hover{color:var(--vibeui-api-001-fg);border-color:var(--vibeui-api-001-fg)}
[data-vibeui-block="api-001"] button:focus-visible,[data-vibeui-block="api-001"] input:focus-visible{outline:2px solid var(--vibeui-api-001-accent);outline-offset:2px}
[data-vibeui-block="api-001"] [data-part="response"]{position:relative;min-height:13rem;margin:0;padding:.9rem 1rem;border:1px solid var(--vibeui-api-001-line);border-radius:.7rem;background:var(--vibeui-api-001-bg);font-family:var(--vibeui-api-001-mono);font-size:.76rem;line-height:1.6;color:var(--vibeui-api-001-muted);white-space:pre;overflow-x:auto}
[data-vibeui-block="api-001"] [data-part="response"] [data-part="line"]{display:block;opacity:0;transform:translateX(-6px);animation:vibeui-api-001-line .3s ease-out forwards}
[data-vibeui-block="api-001"] [data-part="response"] [data-t="k"]{color:var(--vibeui-api-001-fg)}
[data-vibeui-block="api-001"] [data-part="response"] [data-t="s"]{color:var(--vibeui-api-001-accent)}
[data-vibeui-block="api-001"] [data-part="response"] [data-t="n"]{color:var(--vibeui-api-001-number)}
[data-vibeui-block="api-001"] [data-part="empty"]{display:block;color:var(--vibeui-api-001-muted);white-space:normal}
[data-vibeui-block="api-001"] [data-part="empty"] b{color:var(--vibeui-api-001-accent);font-weight:600}
[data-vibeui-block="api-001"] [data-part="progress"]{position:absolute;left:0;right:0;top:0;height:2px;border-radius:2px;background:var(--vibeui-api-001-accent);transform-origin:left;animation:vibeui-api-001-progress .7s ease-out forwards}
[data-vibeui-block="api-001"] [data-part="map"]{position:relative;overflow:hidden;aspect-ratio:4/3;border:1px solid var(--vibeui-api-001-line);border-radius:.8rem;background-color:var(--vibeui-api-001-bg);background-image:radial-gradient(color-mix(in oklab,var(--vibeui-api-001-fg) 14%,transparent) 1px,transparent 1.5px);background-size:20px 20px;container-type:size}
[data-vibeui-block="api-001"] [data-part="map"] svg{position:absolute;inset:0;width:100%;height:100%}
[data-vibeui-block="api-001"] [data-part="map"] svg path,[data-vibeui-block="api-001"] [data-part="map"] svg circle{fill:none;stroke:var(--vibeui-api-001-street);stroke-width:1.5;vector-effect:non-scaling-stroke}
[data-vibeui-block="api-001"] [data-part="map"] svg [data-river]{stroke:color-mix(in oklab,var(--vibeui-api-001-accent) 30%,transparent);stroke-width:6}
[data-vibeui-block="api-001"] [data-part="pin"]{position:absolute;left:0;top:0;width:0;height:0;transform:translate(calc(var(--vibeui-api-001-x) * 1cqw),calc(var(--vibeui-api-001-y) * 1cqh));transition:transform .9s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="api-001"] [data-part="pin"] i{position:absolute;left:-.35rem;top:-.35rem;width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-api-001-accent);box-shadow:0 0 0 3px var(--vibeui-api-001-bg),0 0 14px var(--vibeui-api-001-accent)}
[data-vibeui-block="api-001"] [data-part="ping"]{position:absolute;left:-1rem;top:-1rem;width:2rem;height:2rem;border-radius:50%;border:2px solid var(--vibeui-api-001-accent);animation:vibeui-api-001-ping 1.4s ease-out .8s 2}
[data-vibeui-block="api-001"] [data-part="tag"]{position:absolute;left:.7rem;top:-.7rem;padding:.15rem .45rem;border-radius:.3rem;background:var(--vibeui-api-001-fg);color:var(--vibeui-api-001-bg);font-family:var(--vibeui-api-001-mono);font-size:.62rem;white-space:nowrap}
[data-vibeui-block="api-001"] [data-part="pin"][data-flip="true"] [data-part="tag"]{left:auto;right:.7rem}
[data-vibeui-block="api-001"] [data-part="crosshair"]{position:absolute;inset:0;pointer-events:none;background:linear-gradient(var(--vibeui-api-001-line),var(--vibeui-api-001-line)) 50% 0/1px 100% no-repeat,linear-gradient(var(--vibeui-api-001-line),var(--vibeui-api-001-line)) 0 50%/100% 1px no-repeat;opacity:.6}
[data-vibeui-block="api-001"] [data-part="meta"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="api-001"] [data-part="meta"] li{display:grid;gap:.1rem;padding:.6rem .8rem;border:1px solid var(--vibeui-api-001-line);border-radius:.6rem}
[data-vibeui-block="api-001"] [data-part="meta"] span{font-size:.7rem;color:var(--vibeui-api-001-muted)}
[data-vibeui-block="api-001"] [data-part="meta"] b{font-family:var(--vibeui-api-001-mono);font-weight:600;font-size:1rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="api-001"] [data-part="meta"] b[data-accent]{color:var(--vibeui-api-001-accent)}
[data-vibeui-block="api-001"] [data-part="note"]{margin:0;font-size:.78rem;color:var(--vibeui-api-001-muted)}
@keyframes vibeui-api-001-line{to{opacity:1;transform:none}}
@keyframes vibeui-api-001-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes vibeui-api-001-ping{from{transform:scale(.3);opacity:1}to{transform:scale(2.6);opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="api-001"] [data-part="form"]{grid-template-columns:1fr auto;align-items:center}[data-vibeui-block="api-001"] [data-part="meta"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="api-001"] [data-part="lab"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);padding:1.25rem;gap:1.25rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="api-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="api-001"] [data-part="response"] [data-part="line"]{opacity:1;transform:none}[data-vibeui-block="api-001"] [data-part="ping"]{display:none}}`

const DEFAULT_PLACES: Api001Place[] = [
  { keys: ["тверская"], address: "Россия, Москва, Тверская улица, 7", city: "Москва", lat: 55.759853, lon: 37.610127, x: 50, y: 48, precision: "house", latency: 38 },
  { keys: ["невский"], address: "Россия, Санкт-Петербург, Невский проспект, 28", city: "Санкт-Петербург", lat: 59.935612, lon: 30.325744, x: 24, y: 30, precision: "house", latency: 44 },
  { keys: ["арбат"], address: "Россия, Москва, улица Арбат, 12", city: "Москва", lat: 55.750438, lon: 37.594412, x: 41, y: 58, precision: "house", latency: 36 },
  { keys: ["казан", "баумана"], address: "Россия, Казань, улица Баумана, 3", city: "Казань", lat: 55.79392, lon: 49.10986, x: 74, y: 40, precision: "house", latency: 51 },
  { keys: ["сочи", "морской"], address: "Россия, Сочи, Курортный проспект, 50", city: "Сочи", lat: 43.585525, lon: 39.723062, x: 62, y: 76, precision: "street", latency: 63 },
]

const FALLBACK: Api001Place = { keys: [], address: "Россия, Москва, Ленинградский проспект", city: "Москва", lat: 55.79105, lon: 37.55873, x: 34, y: 36, precision: "street", latency: 47 }

const JSON_TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)/g

function highlight(line: string) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of line.matchAll(JSON_TOKEN)) {
    const index = match.index ?? 0
    if (index > last) parts.push(line.slice(last, index))
    if (match[1]) {
      parts.push(
        <span key={index} data-t={match[2] ? "k" : "s"}>
          {match[1]}
        </span>,
      )
      if (match[2]) parts.push(match[2])
    } else {
      parts.push(
        <span key={index} data-t="n">
          {match[0]}
        </span>,
      )
    }
    last = index + match[0].length
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts
}

function formatNumber(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Песочница геокодера: адрес → точка на CSS-карте и JSON-ответ. */
export function Api001({
  eyebrow = "Песочница",
  title = "Попробуйте без ключа",
  lede = "Введите адрес — ответ придёт как из настоящего API: координаты, точность, нормализованный адрес. Точка на карте едет туда же.",
  placeholder = "Город, улица, дом",
  actionLabel = "Отправить",
  suggestions = ["Москва, Тверская, 7", "Санкт-Петербург, Невский, 28", "Казань, Баумана, 3", "Сочи, Курортный проспект"],
  places = DEFAULT_PLACES,
  cost = 0.012,
  freeLeft = 10000,
  note = "Песочница отвечает предзаписанными данными: ключ не нужен, лимит не тратится.",
  inputLabel = "Адрес",
  chipsLabel = "Примеры адресов",
  emptyLine = "ответ появится здесь — нажмите «{action}» или выберите адрес",
  mapLabel = "Карта с точкой результата",
  costLabel = "стоимость",
  freeLabel = "бесплатных осталось",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Api001Props) {
  const [query, setQuery] = useState("")
  const [pending, setPending] = useState<Api001Place | null>(null)
  const [result, setResult] = useState<Api001Place | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => {
      setResult(pending)
      setPending(null)
      setCount((value) => value + 1)
    }, 700)
    return () => clearTimeout(timer)
  }, [pending])

  const send = (text: string) => {
    const needle = text.trim().toLowerCase()
    if (!needle) return
    const found = places.find((place) => place.keys.some((key) => needle.includes(key))) ?? { ...FALLBACK, address: text.trim() }
    setPending(found)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    send(query)
  }

  const pick = (text: string) => {
    setQuery(text)
    send(text)
  }

  const pin = result ?? places[0] ?? FALLBACK
  const lines = result
    ? [
        "{",
        `  "query": "${query.trim() || result.address}",`,
        "  \"results\": [{",
        `    "lat": ${result.lat},`,
        `    "lon": ${result.lon},`,
        `    "precision": "${result.precision}",`,
        `    "address": "${result.address}",`,
        `    "city": "${result.city}"`,
        "  }],",
        `  "took_ms": ${result.latency}`,
        "}",
      ]
    : []

  const palette = {
    ...(accent ? { "--vibeui-api-001-accent": accent } : null),
    ...(ink ? { "--vibeui-api-001-fg": ink } : null),
    ...(background ? { "--vibeui-api-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-api-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="api-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="lab">
            <div data-part="left">
              <form data-part="form" onSubmit={submit}>
                <label data-part="field">
                  <span>GET /v2/geocode?q=</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} aria-label={inputLabel} autoComplete="off" />
                </label>
                <button data-part="send" type="submit" disabled={pending !== null}>
                  {pending ? "…" : actionLabel} <span aria-hidden="true">↵</span>
                </button>
              </form>
              {suggestions.length > 0 ? (
                <ul data-part="chips" aria-label={chipsLabel}>
                  {suggestions.map((item) => (
                    <li key={item}>
                      <button type="button" onClick={() => pick(item)}>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <pre data-part="response" aria-live="polite">
                {pending ? <i data-part="progress" aria-hidden="true" /> : null}
                {result ? (
                  lines.map((line, index) => (
                    <span data-part="line" key={`${count}-${index}`} style={{ animationDelay: `${index * 40}ms` }}>
                      {highlight(line)}
                      {"\n"}
                    </span>
                  ))
                ) : (
                  <span data-part="empty">
                    <b>{"// "}</b>
                    {emptyLine.replace("{action}", actionLabel)}
                  </span>
                )}
              </pre>
            </div>
            <div data-part="right">
              <div data-part="map" aria-label={mapLabel} role="img">
                <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 96 L400 96 M0 172 L400 172 M0 240 L400 240 M72 0 L72 300 M158 0 L158 300 M252 0 L252 300 M336 0 L336 300" />
                  <path d="M0 40 L400 210 M120 0 L320 300" />
                  <circle cx="200" cy="150" r="118" strokeDasharray="6 5" />
                  <circle cx="200" cy="150" r="58" />
                  <path data-river="" d="M-10 260 C60 230 90 150 150 140 C220 128 250 60 330 40 C370 30 400 20 420 10" />
                </svg>
                <i data-part="crosshair" aria-hidden="true" />
                <div data-part="pin" data-flip={pin.x > 66} style={{ ["--vibeui-api-001-x" as string]: pin.x, ["--vibeui-api-001-y" as string]: pin.y }}>
                  {result ? <i data-part="ping" key={count} aria-hidden="true" /> : null}
                  <i aria-hidden="true" />
                  <span data-part="tag">
                    {pin.lat.toFixed(4)}, {pin.lon.toFixed(4)}
                  </span>
                </div>
              </div>
              <ul data-part="meta">
                <li>
                  <span>latency</span>
                  <b data-accent="">{result ? `${result.latency} ms` : "—"}</b>
                </li>
                <li>
                  <span>{costLabel}</span>
                  <b>{result ? `${cost.toFixed(3).replace(".", ",")} ₽` : "—"}</b>
                </li>
                <li>
                  <span>precision</span>
                  <b>{result ? result.precision : "—"}</b>
                </li>
                <li>
                  <span>{freeLabel}</span>
                  <b>{formatNumber(Math.max(0, freeLeft - count))}</b>
                </li>
              </ul>
              {note ? <p data-part="note">{note}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
