import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Hero006Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  eyebrow?: string
  title?: string
  lede?: string
  submitLabel?: string
  consent?: string
  proof?: string
  facts?: string[]
  /** Название формы для скринридера: компонент несёт русское. */
  formLabel?: string
  /** Подпись поля для скринридера: компонент несёт русскую. */
  emailLabel?: string
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: hero, у которого главный элемент — не кнопка, а поле ввода.
// Форма настоящая: <form> с <label> и type="email", поэтому браузер сам
// валидирует адрес и подставляет сохранённый. Поле и кнопка лежат в одной
// рамке и подсвечиваются вместе через :focus-within — так фокус виден целиком,
// а не только на инпуте.
const STYLES = `
:where([data-vibeui-block="hero-006"]){
--vibeui-hero-006-bg:transparent;
--vibeui-hero-006-fg:light-dark(oklch(0.2 0.03 155),oklch(0.95 0.012 155));
--vibeui-hero-006-muted:light-dark(oklch(0.48 0.02 155),oklch(0.73 0.018 155));
--vibeui-hero-006-field:light-dark(oklch(1 0 0),oklch(0.24 0.018 155));
--vibeui-hero-006-line:light-dark(oklch(0.87 0.02 155),oklch(0.38 0.02 155));
--vibeui-hero-006-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-006-accent-fg:oklch(from var(--vibeui-hero-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-006-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-006"]{color-scheme:dark}
:where([data-vibeui-block="hero-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;position:relative;overflow:hidden;
background:
radial-gradient(80% 60% at 50% 0%,color-mix(in oklab,var(--vibeui-hero-006-accent) 14%,transparent),transparent 70%),
var(--vibeui-hero-006-bg);
color:var(--vibeui-hero-006-fg);font-family:var(--vibeui-hero-006-sans);
}
[data-vibeui-block="hero-006"] *{box-sizing:border-box}
[data-vibeui-block="hero-006"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin:0 0 1.125rem;padding:0.3125rem 0.75rem;
border-radius:9999px;border:1px solid var(--vibeui-hero-006-line);background:var(--vibeui-hero-006-field);
font-size:0.75rem;font-weight:600;color:var(--vibeui-hero-006-muted);
}
[data-vibeui-block="hero-006"] [data-part="shell"]{max-width:44rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="hero-006"] [data-part="pip"]{width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-hero-006-accent);color:oklch(from var(--vibeui-hero-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="hero-006"] form{margin:1.875rem auto 0;max-width:30rem;width:100%}
[data-vibeui-block="hero-006"] [data-part="search-row"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="hero-006"] [data-part="search-row"]>[data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="hero-006"] [data-part="search-row"]>[data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="hero-006"] [data-part="consent"]{margin:0.875rem 0 0;font-size:0.75rem;color:var(--vibeui-hero-006-muted)}
[data-vibeui-block="hero-006"] [data-part="proof"]{
display:flex;align-items:center;justify-content:center;gap:0.5rem;margin:1.75rem 0 0;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-hero-006-muted);
}
[data-vibeui-block="hero-006"] [data-part="faces"]{display:flex}
[data-vibeui-block="hero-006"] [data-part="face"]{
position:relative;width:1.5rem;height:1.5rem;border-radius:9999px;border:2px solid var(--vibeui-hero-006-field);margin-left:-0.5rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="hero-006"] [data-part="face"][data-empty="true"]{background:color-mix(in oklab,var(--vibeui-hero-006-accent) 45%,var(--vibeui-hero-006-field));}
[data-vibeui-block="hero-006"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="hero-006"] [data-part="face"]:first-child{margin-left:0}
[data-vibeui-block="hero-006"] [data-part="facts"]{
list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.25rem;
margin:1.25rem 0 0;padding:0;font-size:0.75rem;color:var(--vibeui-hero-006-muted);
}
[data-vibeui-block="hero-006"] [data-part="facts"] li{display:flex;align-items:center;gap:0.375rem}
@container (min-width: 34rem){
[data-vibeui-block="hero-006"] [data-part="search-row"]{flex-direction:row;align-items:stretch}
[data-vibeui-block="hero-006"] [data-part="shell"]{padding:5.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FACTS = [
  "Письмо раз в неделю",
  "Отписка в один клик",
  "Без рекламы партнёров",
]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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

/** Hero с формой подписки: поле и кнопка в одной рамке, фокус общий. */
export function Hero006({
  eyebrow = "Рассылка «Секция недели»",
  avatarImage = "",
  title = "Разбираем по одной секции каждую пятницу",
  lede = "Что сработало, что провалилось и почему. Короткое письмо с примерами вёрстки и цифрами конверсии.",
  submitLabel = "Подписаться",
  consent = "Отправляя адрес, вы соглашаетесь получать письма. Мы не передаём его третьим лицам.",
  proof = "4 200 подписчиков уже читают",
  facts = DEFAULT_FACTS,
  formLabel = "Подписка на рассылку",
  emailLabel = "Электронная почта",
  accent,
  background = "",
  tone = "auto",
  className,
  style,
}: Hero006Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-006"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? (
            <p data-part="badge">
              <span data-part="pip" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <Heading001
            data-part="heading"
            title={title}
            lede={lede}
            level="h1"
            size="lg"
            align="center"
            accent={accent}
          />

          <form aria-label={formLabel}>
            <div data-part="search-row">
              <Input001 type="email" name="email" required label={emailLabel} autoComplete="email" accent={accent} />
              <Button001 type="submit" size="lg" accent={accent}>
                {submitLabel}
              </Button001>
            </div>
          </form>

          {consent ? <p data-part="consent">{consent}</p> : null}

          {proof ? (
            <p data-part="proof">
              <span data-part="faces" aria-hidden="true">
                <span
                  data-part="face"
                  data-empty={avatarImage ? undefined : "true"}
                >
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <span data-part="face" />
                <span data-part="face" />
              </span>
              {proof}
            </p>
          ) : null}

          {facts.length > 0 ? (
            <ul data-part="facts">
              {facts.slice(0, 4).map((fact) => (
                <li key={fact}>
                  <span data-part="pip" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
