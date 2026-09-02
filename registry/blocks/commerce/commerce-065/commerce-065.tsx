import type { CSSProperties } from "react"

export type Commerce065Row = {
  id: string
  term: string
  value: string
}

export type Commerce065Props = {
  status?: string
  amount?: string
  paidAt?: string
  paidAtIso?: string
  method?: string
  rows?: Commerce065Row[]
  receiptTitle?: string
  numberLabel?: string
  receiptNumber?: string
  fiscalHint?: string
  download?: string
  sendMail?: string
  mailHint?: string
  back?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран после успешного платежа, где чек — не картинка, а
// текст. Номер операции выделяется целиком через user-select:all: его
// диктуют в поддержку. Нижний край чека вырезан маской из повторяющегося
// радиального градиента, поэтому «зубцы» не требуют картинки. Кнопка
// скачивания стоит рядом с отправкой на почту: письмо иногда не доходит.
const STYLES = `
:where([data-vibeui-block="commerce-065"]){
--vibeui-commerce-065-bg:transparent;
--vibeui-commerce-065-card:light-dark(oklch(1 0 0),oklch(0.23 0.016 155));
--vibeui-commerce-065-fg:light-dark(oklch(0.2 0.014 155),oklch(0.94 0.007 155));
--vibeui-commerce-065-muted:light-dark(oklch(0.52 0.016 155),oklch(0.73 0.014 155));
--vibeui-commerce-065-border:light-dark(oklch(0.9 0.008 155),oklch(0.39 0.016 155));
--vibeui-commerce-065-accent:light-dark(oklch(0.5 0.13 152),oklch(0.76 0.14 152));
--vibeui-commerce-065-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.03 152));
--vibeui-commerce-065-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-commerce-065-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="commerce-065"]{
box-sizing:border-box;background:var(--vibeui-commerce-065-bg);
color:var(--vibeui-commerce-065-fg);font-family:var(--vibeui-commerce-065-sans);
}
[data-vibeui-block="commerce-065"] *{box-sizing:border-box}
[data-vibeui-block="commerce-065"] [data-part="shell"]{max-width:34rem;margin:0 auto;padding:1.75rem 1rem 2.25rem;text-align:center}
[data-vibeui-block="commerce-065"] [data-part="tick"]{
width:3.5rem;height:3.5rem;margin:0 auto 0.875rem;border-radius:9999px;
background:var(--vibeui-commerce-065-accent);display:flex;align-items:center;justify-content:center;
color:var(--vibeui-commerce-065-onaccent);font-size:1.5rem;font-weight:800;
}
[data-vibeui-block="commerce-065"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-065"] [data-part="amount"]{margin:0;font-size:clamp(1.875rem,8cqi,2.75rem);font-weight:750;line-height:1.05;letter-spacing:-0.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-065"] [data-part="when"]{margin:0.375rem 0 1.25rem;font-size:0.8125rem;color:var(--vibeui-commerce-065-muted)}
[data-vibeui-block="commerce-065"] [data-part="receipt"]{
text-align:left;background:var(--vibeui-commerce-065-card);border:1px solid var(--vibeui-commerce-065-border);
border-bottom:0;border-radius:1rem 1rem 0 0;padding:1rem 1.125rem 1.25rem;
}
[data-vibeui-block="commerce-065"] [data-part="edge"]{
height:0.75rem;background:var(--vibeui-commerce-065-card);
box-shadow:0 0 0 1px var(--vibeui-commerce-065-border) inset;
mask-image:radial-gradient(0.5rem at 0.5rem 0,transparent 98%,#000 100%);
mask-size:1rem 0.75rem;mask-repeat:repeat-x;mask-position:0 100%;
}
[data-vibeui-block="commerce-065"] h3{
margin:0 0 0.75rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-commerce-065-muted);
}
[data-vibeui-block="commerce-065"] dl{margin:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.4375rem 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-065"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-065"] dt{color:var(--vibeui-commerce-065-muted);min-width:0}
[data-vibeui-block="commerce-065"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-065"] [data-part="number"]{
margin:0.875rem 0 0;padding-top:0.75rem;border-top:1px dashed var(--vibeui-commerce-065-border);
font-size:0.75rem;color:var(--vibeui-commerce-065-muted);
}
[data-vibeui-block="commerce-065"] [data-part="number"] code{
display:inline-block;margin-top:0.25rem;font-family:var(--vibeui-commerce-065-mono);font-size:0.875rem;
color:var(--vibeui-commerce-065-fg);user-select:all;
}
[data-vibeui-block="commerce-065"] [data-part="fiscal"]{margin:0.5rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-065-muted)}
[data-vibeui-block="commerce-065"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-top:1.25rem}
[data-vibeui-block="commerce-065"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.375rem;border-radius:0.875rem;
background:var(--vibeui-commerce-065-accent);color:var(--vibeui-commerce-065-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-065"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-065-border);background:var(--vibeui-commerce-065-card);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-065"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-065"] [data-part="alt"]:focus-visible,
[data-vibeui-block="commerce-065"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-commerce-065-accent);outline-offset:2px}
[data-vibeui-block="commerce-065"] [data-part="mail"]{margin:0.875rem auto 0;max-width:40ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-065-muted)}
[data-vibeui-block="commerce-065"] [data-part="back"]{
display:inline-block;margin-top:0.75rem;font-size:0.8125rem;font-weight:650;color:var(--vibeui-commerce-065-accent);
text-decoration:underline;text-underline-offset:2px;border-radius:0.25rem;
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-065"] [data-part="shell"]{padding:3rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-065"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_ROWS: Commerce065Row[] = [
  { id: "1", term: "Заказ", value: "№ 2024-1187" },
  { id: "2", term: "Товары", value: "61 700 ₽" },
  { id: "3", term: "Доставка", value: "880 ₽" },
  { id: "4", term: "В том числе НДС 20%", value: "10 430 ₽" },
  { id: "5", term: "Способ оплаты", value: "Мир •• 4821" },
]

/**
 * Экран успешной оплаты с чеком: сумма крупно, номер операции копируется,
 * нижний край вырезан маской. Один файл, ноль зависимостей.
 */
export function Commerce065({
  status = "Платёж прошёл",
  amount = "62 580 ₽",
  paidAt = "11 марта, 14:07",
  paidAtIso = "2024-03-11T14:07:00+03:00",
  method = "Мир •• 4821",
  rows = DEFAULT_ROWS,
  receiptTitle = "Чек",
  numberLabel = "Номер операции",
  receiptNumber = "OP-8842-113705",
  fiscalHint = "Фискальный чек отправлен оператору данных и появится в приложении налоговой в течение суток.",
  download = "Скачать чек",
  sendMail = "Отправить на почту",
  mailHint = "Копия ушла на a.remizova@example.com. Если письма нет через десять минут — проверьте папку «Спам» и нажмите «Отправить на почту» ещё раз.",
  back = "Вернуться к заказу",
  accent,
  background = "",
  className,
  style,
}: Commerce065Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-065-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-065-bg": background,
          // Чек и вторая кнопка не должны просвечивать: им нужна непрозрачная
          // подложка, а она задана тем же цветом.
          "--vibeui-commerce-065-card": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-065" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-065"
        className={className}
        style={palette}
        aria-label={status}
      >
        <div data-part="shell">
          <div data-part="tick" aria-hidden="true">
            ✓
          </div>
          <h2>{status}</h2>
          <p data-part="amount">{amount}</p>
          <p data-part="when">
            <time dateTime={paidAtIso}>{paidAt}</time> · {method}
          </p>

          <div data-part="receipt">
            <h3>{receiptTitle}</h3>
            <dl>
              {rows.map((row) => (
                <div key={row.id} data-part="pair">
                  <dt>{row.term}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p data-part="number">
              {numberLabel}
              <br />
              <code>{receiptNumber}</code>
            </p>
            <p data-part="fiscal">{fiscalHint}</p>
          </div>
          <div data-part="edge" aria-hidden="true" />

          <div data-part="actions">
            <button type="button" data-part="go">
              {download}
            </button>
            <button type="button" data-part="alt">
              {sendMail}
            </button>
          </div>
          <p data-part="mail">{mailHint}</p>
          <a data-part="back" href="#order">
            {back}
          </a>
        </div>
      </section>
    </>
  )
}
