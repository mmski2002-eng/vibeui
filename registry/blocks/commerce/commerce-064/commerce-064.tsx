import type { CSSProperties } from "react"

export type Commerce064Network = {
  value: string
  label: string
  fee: string
  time: string
}

export type Commerce064Props = {
  kicker?: string
  title?: string
  amount?: string
  fiat?: string
  rate?: string
  holdFor?: string
  networkLegend?: string
  networks?: Commerce064Network[]
  addressLabel?: string
  address?: string
  copyLabel?: string
  memoLabel?: string
  memo?: string
  memoHint?: string
  warning?: string
  cta?: string
  waiting?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оплата криптовалютой, где ошибка стоит денег навсегда. Сеть
// выбирается радиокнопками и названа явно, адрес выделяется целиком через
// user-select:all, а предупреждение о неверной сети стоит над кнопкой, а не
// в подвале. QR нарисован CSS-сеткой: блок обязан оставаться одним файлом
// без картинок, а настоящий код подставляет вызывающий проект.
const STYLES = `
:where([data-vibeui-block="commerce-064"]){
--vibeui-commerce-064-bg:transparent;
--vibeui-commerce-064-panel:light-dark(oklch(0.975 0.005 265),oklch(0.25 0.025 265));
--vibeui-commerce-064-fg:light-dark(oklch(0.22 0.018 265),oklch(0.97 0.006 265));
--vibeui-commerce-064-muted:light-dark(oklch(0.52 0.018 265),oklch(0.72 0.018 265));
--vibeui-commerce-064-border:light-dark(oklch(0.89 0.009 265),oklch(0.4 0.028 265));
--vibeui-commerce-064-accent:light-dark(oklch(0.52 0.13 145),oklch(0.78 0.16 145));
--vibeui-commerce-064-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.02 265));
--vibeui-commerce-064-warn:light-dark(oklch(0.53 0.14 65),oklch(0.8 0.15 75));
/* Бумага и краска QR не зависят от темы: код читает сканер, а ему нужен
   постоянный контраст. */
--vibeui-commerce-064-qr-paper:oklch(0.99 0 0);
--vibeui-commerce-064-qr-ink:oklch(0.19 0.02 265);
--vibeui-commerce-064-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-commerce-064-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-064"]{color-scheme:dark}
[data-vibeui-block="commerce-064"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-064-bg);
color:var(--vibeui-commerce-064-fg);font-family:var(--vibeui-commerce-064-sans);
}
[data-vibeui-block="commerce-064"] *{box-sizing:border-box}
[data-vibeui-block="commerce-064"] form{display:contents}
[data-vibeui-block="commerce-064"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:1.5rem 1rem 2rem}
[data-vibeui-block="commerce-064"] [data-part="kicker"]{margin:0;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-commerce-064-accent)}
[data-vibeui-block="commerce-064"] h2{margin:0.375rem 0 1rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-064"] [data-part="sumbox"]{
border:1px solid var(--vibeui-commerce-064-border);border-radius:1rem;padding:1rem 1.125rem;
background:var(--vibeui-commerce-064-panel);margin-bottom:1rem;
}
[data-vibeui-block="commerce-064"] [data-part="amount"]{margin:0;font-size:clamp(1.5rem,6cqi,2.25rem);font-weight:750;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="commerce-064"] [data-part="fiat"]{margin:0.375rem 0 0;font-size:0.875rem;color:var(--vibeui-commerce-064-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-064"] [data-part="rate"]{margin:0.5rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-064-muted)}
[data-vibeui-block="commerce-064"] [data-part="hold"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.625rem;height:1.75rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-064-border);font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-064-accent);
}
[data-vibeui-block="commerce-064"] [data-part="pulse"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-commerce-064-accent);
animation:vibeui-commerce-064-blink 1.8s ease-in-out infinite;
}
@keyframes vibeui-commerce-064-blink{0%,100%{opacity:1}50%{opacity:0.25}}
[data-vibeui-block="commerce-064"] fieldset{border:0;margin:0 0 1rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-064"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-064-muted);
}
[data-vibeui-block="commerce-064"] [data-part="nets"]{display:grid;gap:0.5rem;grid-template-columns:1fr;clear:both}
[data-vibeui-block="commerce-064"] [data-part="net"]{position:relative}
[data-vibeui-block="commerce-064"] [data-part="net"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-064"] [data-part="nface"]{
display:block;cursor:pointer;border:1px solid var(--vibeui-commerce-064-border);border-radius:0.75rem;padding:0.625rem 0.75rem;
background:var(--vibeui-commerce-064-panel);transition:border-color .14s ease;
}
[data-vibeui-block="commerce-064"] [data-part="net"] input:checked+[data-part="nface"]{border-color:var(--vibeui-commerce-064-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-064-accent)}
[data-vibeui-block="commerce-064"] [data-part="net"] input:focus-visible+[data-part="nface"]{outline:2px solid var(--vibeui-commerce-064-accent);outline-offset:2px}
[data-vibeui-block="commerce-064"] [data-part="nname"]{display:block;font-size:0.875rem;font-weight:700}
[data-vibeui-block="commerce-064"] [data-part="nfee"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-commerce-064-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-064"] [data-part="pay"]{display:grid;gap:1rem;grid-template-columns:1fr;align-items:start}
[data-vibeui-block="commerce-064"] [data-part="qr"]{
width:9rem;height:9rem;justify-self:center;padding:0.5rem;border-radius:0.75rem;
background:var(--vibeui-commerce-064-qr-paper);
display:grid;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(9,1fr);gap:2px;
}
[data-vibeui-block="commerce-064"] [data-part="cell"]{background:var(--vibeui-commerce-064-qr-ink);border-radius:1px}
[data-vibeui-block="commerce-064"] [data-part="alabel"]{margin:0 0 0.25rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-064-muted)}
[data-vibeui-block="commerce-064"] [data-part="address"]{
margin:0;padding:0.625rem 0.75rem;border-radius:0.625rem;border:1px solid var(--vibeui-commerce-064-border);
background:var(--vibeui-commerce-064-panel);font-family:var(--vibeui-commerce-064-mono);font-size:0.8125rem;
line-height:1.5;word-break:break-all;user-select:all;
}
[data-vibeui-block="commerce-064"] [data-part="copy"]{
appearance:none;cursor:pointer;margin-top:0.5rem;border-radius:0.625rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;padding:0.25rem 1rem;
border:1px solid var(--vibeui-commerce-064-border);background:transparent;color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-064"] [data-part="copy"]:focus-visible,
[data-vibeui-block="commerce-064"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-064-accent);outline-offset:2px}
[data-vibeui-block="commerce-064"] [data-part="memo"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-064-muted)}
[data-vibeui-block="commerce-064"] [data-part="memo"] code{font-family:var(--vibeui-commerce-064-mono);color:var(--vibeui-commerce-064-fg);user-select:all}
[data-vibeui-block="commerce-064"] [data-part="warning"]{
margin:1rem 0 0;padding:0.6875rem 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-064-warn);color:var(--vibeui-commerce-064-warn);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="commerce-064"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:1rem;border-radius:0.875rem;
background:var(--vibeui-commerce-064-accent);color:var(--vibeui-commerce-064-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-064"] [data-part="waiting"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-064-muted);text-align:center}
@container (min-width: 34rem){
[data-vibeui-block="commerce-064"] [data-part="nets"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="commerce-064"] [data-part="pay"]{grid-template-columns:9rem minmax(0,1fr)}
[data-vibeui-block="commerce-064"] [data-part="qr"]{justify-self:start}
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-064"] [data-part="shell"]{padding:2.5rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-064"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NETWORKS: Commerce064Network[] = [
  {
    value: "trc20",
    label: "TRC-20",
    fee: "Комиссия 1 USDT",
    time: "≈ 1 минута",
  },
  {
    value: "erc20",
    label: "ERC-20",
    fee: "Комиссия 9 USDT",
    time: "≈ 5 минут",
  },
  { value: "ton", label: "TON", fee: "Комиссия 0,2 USDT", time: "≈ 30 секунд" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

// Узор QR нарисован сеткой: настоящий код подставляет вызывающий проект.
const QR_PATTERN = [
  1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1,
  1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0,
  1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1,
  1, 0, 1,
]

/**
 * Оплата криптовалютой: выбор сети радиокнопками, адрес с user-select:all и
 * предупреждение над кнопкой. Один файл, ноль зависимостей.
 */
export function Commerce064({
  kicker = "Оплата криптовалютой",
  title = "Переведите точную сумму на адрес ниже",
  amount = "684,20 USDT",
  fiat = "≈ 62 580 ₽ по курсу 91,45 ₽",
  rate = "Курс зафиксирован на момент создания счёта. Если перевод придёт позже, разницу пересчитаем по курсу зачисления.",
  holdFor = "Курс держится ещё 14 минут",
  networkLegend = "Сеть перевода",
  networks = DEFAULT_NETWORKS,
  addressLabel = "Адрес кошелька",
  address = "TQ7hLm4xW2pF9cVnR3sJb8YdK5aZgUe1Nq",
  copyLabel = "Скопировать адрес",
  memoLabel = "Комментарий к переводу",
  memo = "ORD-2024-1187",
  memoHint = "Без него платёж придётся искать вручную — это до трёх рабочих дней.",
  warning = "Отправляйте только USDT и только в выбранной сети. Монета в другой сети уходит навсегда: вернуть её не может ни магазин, ни биржа.",
  cta = "Я отправил перевод",
  waiting = "После отправки счёт закроется автоматически, когда сеть подтвердит транзакцию.",
  accent,
  background = "",
  className,
  style,
}: Commerce064Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-064-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-064-bg": background,
          // Панели и поля не должны просвечивать: им нужна непрозрачная
          // подложка, а она задана тем же цветом.
          "--vibeui-commerce-064-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-064" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-064"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="kicker">{kicker}</p>
          <h2>{title}</h2>

          <div data-part="sumbox">
            <p data-part="amount">{amount}</p>
            <p data-part="fiat">{fiat}</p>
            <p data-part="rate">{rate}</p>
            <span data-part="hold">
              <span data-part="pulse" aria-hidden="true" />
              {holdFor}
            </span>
          </div>

          <form>
            <fieldset>
              <legend>{networkLegend}</legend>
              <div data-part="nets">
                {networks.map((network, index) => (
                  <div key={network.value} data-part="net">
                    <input
                      type="radio"
                      id={`commerce-064-${network.value}`}
                      name="commerce-064-network"
                      defaultChecked={index === 0}
                    />
                    <label
                      data-part="nface"
                      htmlFor={`commerce-064-${network.value}`}
                    >
                      <span data-part="nname">{network.label}</span>
                      <span data-part="nfee">
                        {network.fee} · {network.time}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </form>

          <div data-part="pay">
            <div data-part="qr" aria-hidden="true">
              {QR_PATTERN.map((cell, index) =>
                cell ? (
                  <span key={index} data-part="cell" />
                ) : (
                  <span key={index} />
                ),
              )}
            </div>
            <div>
              <p data-part="alabel">{addressLabel}</p>
              <p data-part="address">{address}</p>
              <button type="button" data-part="copy">
                {copyLabel}
              </button>
              <p data-part="memo">
                {memoLabel}: <code>{memo}</code>. {memoHint}
              </p>
            </div>
          </div>

          <p data-part="warning">{warning}</p>
          <button type="button" data-part="go">
            {cta}
          </button>
          <p data-part="waiting">{waiting}</p>
        </div>
      </section>
    </>
  )
}
