import type { CSSProperties } from "react"
import { Footerlinks016 } from "@/registry/components/navigation/footerlinks-016/footerlinks-016"

type Footer008Link = {
  label: string
  href: string
}

type Footer008Detail = {
  term: string
  value: string
}

export type Footer008Props = {
  company?: string
  legalLinks?: Footer008Link[]
  /** Подпись группы документов для скринридера. */
  legalLinksLabel?: string
  details?: Footer008Detail[]
  disclaimer?: string
  copyright?: string
  cookieLabel?: string
  cookieHref?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Юридический подвал: реквизиты, обязательные ссылки и предупреждение.
// Реквизиты размечены списком определений — это пары «что это — значение»,
// и скринридер обязан читать их парами, а не сплошной строкой цифр.
// Настройки cookie вынесены отдельной ссылкой: по регламенту согласие
// должно отзываться так же просто, как давалось.
//
// Тема берётся из color-scheme окружения через light-dark(): подвал темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="footer-008"]){
--vibeui-footer-008-bg:transparent;
--vibeui-footer-008-ink:light-dark(oklch(0.24 0 260),oklch(0.93 0 260));
--vibeui-footer-008-muted:light-dark(oklch(0.52 0 260),oklch(0.7 0 260));
--vibeui-footer-008-border:light-dark(oklch(0.88 0 260),oklch(0.33 0 260));
--vibeui-footer-008-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-footer-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-footer-008-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-008"]{color-scheme:dark}
[data-vibeui-block="footer-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-008-bg);color:var(--vibeui-footer-008-ink);
border-top:1px solid var(--vibeui-footer-008-border);
font-family:var(--vibeui-footer-008-font);
}
[data-vibeui-block="footer-008"] [data-part="shell"]{
display:grid;gap:1.75rem;
max-width:72rem;margin:0 auto;padding:2.25rem 1.25rem;
}
[data-vibeui-block="footer-008"] [data-part="company"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="footer-008"] [data-part="details"]{
display:grid;gap:0.5rem;margin:0.875rem 0 0;
}
[data-vibeui-block="footer-008"] [data-part="details"] div{
display:flex;flex-wrap:wrap;gap:0.375rem;
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="footer-008"] [data-part="details"] dt{color:var(--vibeui-footer-008-muted)}
[data-vibeui-block="footer-008"] [data-part="details"] dd{margin:0;font-variant-numeric:tabular-nums}
[data-vibeui-block="footer-008"] [data-part="disclaimer"]{
margin:0;color:var(--vibeui-footer-008-muted);font-size:0.75rem;line-height:1.6;
}
[data-vibeui-block="footer-008"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem 1rem;
padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-008-border);
color:var(--vibeui-footer-008-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-008"] [data-part="cookie"]{
margin-left:auto;
display:inline-flex;align-items:center;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-footer-008-border);
color:var(--vibeui-footer-008-ink);text-decoration:none;font-size:0.8125rem;font-weight:580;
transition:border-color var(--vibeui-footer-008-dur-2) ease,color var(--vibeui-footer-008-dur-2) ease;
}
[data-vibeui-block="footer-008"] [data-part="cookie"]:hover{border-color:var(--vibeui-footer-008-accent);color:var(--vibeui-footer-008-accent)}
[data-vibeui-block="footer-008"] a:focus-visible{outline:2px solid var(--vibeui-footer-008-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="footer-008"] [data-part="shell"]{grid-template-columns:1.4fr 1fr;gap:2rem 3rem;padding:3rem 2rem}
[data-vibeui-block="footer-008"] [data-part="disclaimer"]{grid-column:1 / -1;max-width:92ch}
[data-vibeui-block="footer-008"] [data-part="bottom"]{grid-column:1 / -1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Footer008Link[] = [
  { label: "Пользовательское соглашение", href: "#terms" },
  { label: "Политика обработки персональных данных", href: "#privacy" },
  { label: "Согласие на рассылку", href: "#consent" },
  { label: "Публичная оферта", href: "#offer" },
]

const DEFAULT_DETAILS: Footer008Detail[] = [
  { term: "ОГРН", value: "1157700000000" },
  { term: "ИНН / КПП", value: "7700000000 / 770001001" },
  { term: "Адрес", value: "123001, Москва, ул. Малая Бронная, 4, оф. 12" },
  { term: "Лицензия", value: "№ ЛО-77-01-000000 от 14.02.2024" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/** Юридический подвал: реквизиты, обязательные ссылки, отзыв согласия cookie. */
export function Footer008({
  company = "ООО «Ориентир»",
  legalLinks = DEFAULT_LINKS,
  legalLinksLabel = "Юридические документы",
  details = DEFAULT_DETAILS,
  disclaimer = "Информация на сайте носит справочный характер и не является публичной офертой, определяемой статьёй 437 Гражданского кодекса. Точные условия, сроки и стоимость услуг фиксируются в договоре. Изображения могут отличаться от фактического вида.",
  copyright = "© 2026 ООО «Ориентир». Все права защищены.",
  cookieLabel = "Настройки cookie",
  cookieHref = "#cookies",
  background = "",
  accent,
  className,
  style,
}: Footer008Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-008" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <p data-part="company">{company}</p>
            <dl data-part="details">
              {details.map((detail) => (
                <div key={detail.term}>
                  <dt>{detail.term}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Footerlinks016 data-part="links" legalLinksLabel={legalLinksLabel} legalLinks={legalLinks} accent={accent} />
          <p data-part="disclaimer">{disclaimer}</p>
          <div data-part="bottom">
            <span>{copyright}</span>
            <a data-part="cookie" href={cookieHref}>
              {cookieLabel}
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
