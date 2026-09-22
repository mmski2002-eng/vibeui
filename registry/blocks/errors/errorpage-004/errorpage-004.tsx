import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Errorpage004Props = {
  code?: string
  title?: string
  description?: string
  switchLabel?: string
  switchHref?: string
  requestLabel?: string
  requestHref?: string
  hint?: string
  /** Пусто — подложки нет, страница лежит прямо на фоне сайта. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Страница 403 с замком, собранным из чистого CSS: дужка — рамка с
// скруглением, корпус — оранжевая плита со скважиной. Иллюстрация вместо
// голого кода, потому что 403 пугает; замок объясняет ситуацию быстрее
// абзаца. Два выхода — «сменить аккаунт» и «запросить доступ»: у 403 всегда
// две причины — не тот аккаунт или не выданы права, и страница закрывает обе.
const STYLES = `
:where([data-vibeui-block="errorpage-004"]){
--vibeui-errorpage-004-bg:transparent;
--vibeui-errorpage-004-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-errorpage-004-muted:light-dark(oklch(0.48 0 0),oklch(0.7 0 0));
--vibeui-errorpage-004-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-errorpage-004-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-errorpage-004-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-errorpage-004-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-errorpage-004-accent-ink:oklch(from var(--vibeui-errorpage-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-errorpage-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-errorpage-004-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="errorpage-004"]{color-scheme:dark}
[data-vibeui-block="errorpage-004"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-errorpage-004-bg);color:var(--vibeui-errorpage-004-ink);
font-family:var(--vibeui-errorpage-004-font);
}
[data-vibeui-block="errorpage-004"] [data-part="frame"]{
max-width:40rem;margin:0 auto;padding:4rem 1.25rem;
display:flex;flex-direction:column;align-items:center;text-align:center;
}
/* Замок из двух элементов: дужка — рамка без нижней стороны, корпус —
   скруглённая плита. Скважина — псевдоэлементы корпуса: круг и ножка. */
[data-vibeui-block="errorpage-004"] [data-part="lock"]{
display:grid;justify-items:center;
filter:drop-shadow(0 18px 24px color-mix(in oklab,var(--vibeui-errorpage-004-accent) 25%,transparent));
}
[data-vibeui-block="errorpage-004"] [data-part="shackle"]{
width:3.25rem;height:2.5rem;
border:0.5rem solid color-mix(in oklab,var(--vibeui-errorpage-004-accent) 55%,var(--vibeui-errorpage-004-muted));
border-bottom:0;border-radius:1.625rem 1.625rem 0 0;
margin-bottom:-0.375rem;
}
[data-vibeui-block="errorpage-004"] [data-part="body"]{
position:relative;width:5.75rem;height:4.25rem;border-radius:1rem;
background:var(--vibeui-errorpage-004-accent-fill);
}
[data-vibeui-block="errorpage-004"] [data-part="body"]::before{
content:"";position:absolute;left:50%;top:1.125rem;translate:-50% 0;
width:0.875rem;height:0.875rem;border-radius:999px;
background:var(--vibeui-errorpage-004-accent-ink);
}
[data-vibeui-block="errorpage-004"] [data-part="body"]::after{
content:"";position:absolute;left:50%;top:1.75rem;translate:-50% 0;
width:0.375rem;height:1rem;border-radius:0 0 999px 999px;
background:var(--vibeui-errorpage-004-accent-ink);
}
[data-vibeui-block="errorpage-004"] [data-part="code"]{
margin:1.75rem 0 0;
color:var(--vibeui-errorpage-004-accent);
font-size:0.875rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-004"] [data-part="actions"]{
margin-top:1.75rem;display:flex;flex-wrap:wrap;justify-content:center;gap:0.625rem;
}
[data-vibeui-block="errorpage-004"] [data-part="hint"]{
margin:1.5rem 0 0;
color:var(--vibeui-errorpage-004-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 48rem){
[data-vibeui-block="errorpage-004"] [data-part="frame"]{padding:6rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="errorpage-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Страница 403: CSS-замок, объяснение и два выхода — аккаунт или запрос. */
export function Errorpage004({
  code = "Ошибка 403",
  title = "Сюда нужен доступ",
  description = "Этот раздел открыт не всем участникам команды. Возможно, вы вошли не с того аккаунта — или владелец ещё не выдал вам права.",
  switchLabel = "Сменить аккаунт",
  switchHref = "/login",
  requestLabel = "Запросить доступ",
  requestHref = "/access",
  hint = "Запрос уходит владельцу раздела. Обычно отвечают в течение рабочего дня.",
  background = "",
  accent,
  className,
  style,
}: Errorpage004Props) {
  const palette = {
    ...(accent ? { "--vibeui-errorpage-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-errorpage-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-errorpage-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="errorpage-004"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="lock" aria-hidden="true">
            <div data-part="shackle" />
            <div data-part="body" />
          </div>
          <p data-part="code">{code}</p>
          <Heading001
            data-part="heading"
            title={title}
            lede={description}
            accent={accent}
          />
          <div data-part="actions">
            <Button016
              data-part="switch"
              label={switchLabel}
              href={switchHref}
              external={false}
              size="lg"
              tone="accent"
              accent={accent}
            />
            <Button016
              data-part="request"
              label={requestLabel}
              href={requestHref}
              external={false}
              size="lg"
              tone="neutral"
              accent={accent}
            />
          </div>
          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
